"use client";
import React, { useState, useEffect } from "react";
import { getUsers, getUserGoal, setMonthlyGoal, addWeeklyGoal, updateWeeklyNote, getUserMonths, getCurrentMonthYear } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { HiChevronDown } from "react-icons/hi2";

// Type definitions
interface User {
    uid: string;
    displayName?: string;
    email?: string;
    phoneNumber?: string;
}
interface WeeklyGoal {
    goal?: string;   // Main entry for the week
    note?: string;   // Additional notes
}
interface UserGoals {
    monthlyGoal?: string;
    weeklyGoals?: WeeklyGoal[];
}

function getCurrentWeekNumberInMonth() {
    // Returns 0-based week of the month (0 = week 1, 1 = week 2, ...)
    const today = new Date();
    const day = today.getDate();
    // Calculate which week of the month we're in
    // Week 1: days 1-7, Week 2: days 8-14, etc.
    return Math.floor((day - 1) / 7);
}

function formatMonthYear(monthYear: string): string {
    const [month, year] = monthYear.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getNextMonth(monthYear: string): string {
    const [month, year] = monthYear.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    date.setMonth(date.getMonth() + 1);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function getPreviousMonth(monthYear: string): string {
    const [month, year] = monthYear.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    date.setMonth(date.getMonth() - 1);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export default function GoalsTracker() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUid, setSelectedUid] = useState(user?.uid || "");
    const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
    const [loading, setLoading] = useState(false);
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [currentMonthYear, setCurrentMonthYear] = useState(getCurrentMonthYear());
    const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());

    // For adding new monthly goal
    const [monthlyGoal, setMonthlyGoalText] = useState("");
    const [addingMonthly, setAddingMonthly] = useState(false);

    // For editing weekly goal and notes
    const [weeklyGoalInputs, setWeeklyGoalInputs] = useState<string[]>(["", "", "", ""]);
    const [weeklyNoteInputs, setWeeklyNoteInputs] = useState<string[]>(["", "", "", ""]);
    const [savingWeek, setSavingWeek] = useState<number | null>(null);

    // Pagination for previous months
    const [currentPage, setCurrentPage] = useState(1);
    const monthsPerPage = 6;

    // On mount, fetch all users and available months
    useEffect(() => {
        getUsers().then(setUsers);
        if (user?.uid) {
            getUserMonths(user.uid).then(setAvailableMonths);
        }
    }, [user?.uid]);

    // When selected user changes, fetch their months and goals
    useEffect(() => {
        if (!selectedUid) return;
        setLoading(true);
        getUserMonths(selectedUid).then(months => {
            setAvailableMonths(months);
            setLoading(false);
        });
    }, [selectedUid]);

    // When selected month changes, fetch goals for that month
    useEffect(() => {
        if (!selectedUid || !selectedMonthYear) return;
        setLoading(true);
        getUserGoal(selectedUid, selectedMonthYear).then((goals: UserGoals) => {
            setUserGoals(goals);
            setLoading(false);

            // Set local state for weekly goals and notes
            const weeks = goals?.weeklyGoals || [
                { goal: "", note: "" },
                { goal: "", note: "" },
                { goal: "", note: "" },
                { goal: "", note: "" }
            ];
            setWeeklyGoalInputs([0, 1, 2, 3].map(i => weeks[i]?.goal || ""));
            setWeeklyNoteInputs([0, 1, 2, 3].map(i => weeks[i]?.note || ""));
        }).catch(error => {
            console.error('Error fetching goals:', error);
            setLoading(false);
            // Set default empty structure on error
            setUserGoals({
                monthlyGoal: undefined,
                weeklyGoals: [
                    { goal: "", note: "" },
                    { goal: "", note: "" },
                    { goal: "", note: "" },
                    { goal: "", note: "" }
                ]
            });
        });
    }, [selectedUid, selectedMonthYear]);

    // Update current month/year when it changes
    useEffect(() => {
        const interval = setInterval(() => {
            const newCurrentMonth = getCurrentMonthYear();
            if (newCurrentMonth !== currentMonthYear) {
                setCurrentMonthYear(newCurrentMonth);
                // If we're viewing the old current month, switch to new current month
                if (selectedMonthYear === currentMonthYear) {
                    setSelectedMonthYear(newCurrentMonth);
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [currentMonthYear, selectedMonthYear]);

    const currentWeek = getCurrentWeekNumberInMonth();
    const isCurrentMonth = selectedMonthYear === currentMonthYear;

    // Save monthly goal (only if not already set)
    const handleSetMonthlyGoal = async () => {
        if (!user?.uid) return;
        setAddingMonthly(true);
        await setMonthlyGoal(user.uid, monthlyGoal, selectedMonthYear);
        setMonthlyGoalText("");
        setAddingMonthly(false);

        // Update local state to reflect the new goal
        setUserGoals(prev => ({
            ...prev,
            monthlyGoal: monthlyGoal
        }));
    };

    // Handle editing of weekly goal or note
    const handleSaveWeek = async (weekIdx: number) => {
        if (!user?.uid) return;
        setSavingWeek(weekIdx);
        // Save main weekly goal (if not yet set)
        if (!userGoals?.weeklyGoals?.[weekIdx]?.goal && weeklyGoalInputs[weekIdx]) {
            await addWeeklyGoal(user.uid, weekIdx, weeklyGoalInputs[weekIdx], selectedMonthYear);
        }
        // Always save notes
        await updateWeeklyNote(user.uid, weekIdx, weeklyNoteInputs[weekIdx], selectedMonthYear);
        setSavingWeek(null);
        // Refetch
        getUserGoal(selectedUid, selectedMonthYear).then((goals: UserGoals) => {
            setUserGoals(goals);
        });
    };

    // Local change handlers
    const handleGoalInputChange = (idx: number, value: string) => {
        setWeeklyGoalInputs(arr => arr.map((v, i) => i === idx ? value : v));
    };
    const handleNoteInputChange = (idx: number, value: string) => {
        setWeeklyNoteInputs(arr => arr.map((v, i) => i === idx ? value : v));
    };

    // Navigation handlers
    const handleNextMonth = () => {
        setSelectedMonthYear(getNextMonth(selectedMonthYear));
        setCurrentPage(1);
    };

    const handlePreviousMonth = () => {
        setSelectedMonthYear(getPreviousMonth(selectedMonthYear));
        setCurrentPage(1);
    };

    const handleGoToCurrentMonth = () => {
        setSelectedMonthYear(currentMonthYear);
        setCurrentPage(1);
    };

    // Pagination for previous months
    const paginatedMonths = availableMonths.slice((currentPage - 1) * monthsPerPage, currentPage * monthsPerPage);
    const totalPages = Math.ceil(availableMonths.length / monthsPerPage);

    return (
        <div className="bg-base-200 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-6">
                <div className="card bg-base-100 shadow-md rounded-xl">
                    <div className="card-body p-6 md:p-10">
                        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 text-center">
                            Monthly goal tracker
                        </h1>

                        {/* Month/Year Display and Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={handlePreviousMonth}
                                className="btn btn-primary btn-sm"
                            >
                                ← Previous
                            </button>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {formatMonthYear(selectedMonthYear)}
                                </h2>
                                {isCurrentMonth && (
                                    <span className="badge badge-primary badge-sm mt-1">Current Month</span>
                                )}
                            </div>
                            <button
                                onClick={handleNextMonth}
                                className="btn btn-primary btn-sm"
                            >
                                Next →
                            </button>
                        </div>

                        {/* Quick Navigation to Current Month */}
                        {!isCurrentMonth && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={handleGoToCurrentMonth}
                                    className="btn btn-primary btn-sm"
                                >
                                    Go to Current Month
                                </button>
                            </div>
                        )}

                        {/* User Selector */}
                        <div className="form-control mb-8">
                            <label className="label">
                                <span className="label-text font-medium text-foreground">Select member:</span>
                            </label>
                            <div className="dropdown dropdown-start w-full max-w-xs ">
                                <div tabIndex={0} role="button" className="btn btn-outline w-full justify-between">
                                    {users.find(u => u.uid === selectedUid)?.displayName || users.find(u => u.uid === selectedUid)?.email || "Select member"}
                                    <HiChevronDown className="h-4 w-4" />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow-sm">
                                    {users.map(u => (
                                        <li key={u.uid}>
                                            <a
                                                onClick={() => setSelectedUid(u.uid)}
                                                className={selectedUid === u.uid ? "active" : ""}
                                            >
                                                {u.displayName || u.email}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center text-neutral py-8">
                                <span className="loading loading-spinner loading-md"></span>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Monthly Goal */}
                                <div className="card bg-base-100 shadow-sm border">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg font-semibold text-foreground mb-4">
                                            Monthly goal
                                        </h2>
                                        {userGoals?.monthlyGoal ? (
                                            <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-foreground">
                                                {userGoals.monthlyGoal}
                                            </div>
                                        ) : selectedUid === user?.uid && isCurrentMonth ? (
                                            <div className="space-y-4">
                                                <input
                                                    className="input input-bordered w-full focus:outline-none"
                                                    type="text"
                                                    placeholder="Enter your monthly goal..."
                                                    value={monthlyGoal}
                                                    onChange={e => setMonthlyGoalText(e.target.value)}
                                                    disabled={addingMonthly}
                                                />
                                                <button
                                                    onClick={handleSetMonthlyGoal}
                                                    disabled={addingMonthly || !monthlyGoal.trim()}
                                                    className="btn btn-primary rounded-lg focus:outline-none"
                                                >
                                                    {addingMonthly ? (
                                                        <>
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                            Setting goal...
                                                        </>
                                                    ) : (
                                                        'Set goal'
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="italic text-neutral">No goal set for this month.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Weekly Tracker */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-foreground mb-4">Weekly progress</h2>
                                    {[0, 1, 2, 3].map(idx => (
                                        <div key={idx} className="card bg-base-100 shadow-sm border-l-4 border-l-primary">
                                            <div className="card-body">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold text-foreground">
                                                        Week {idx + 1}
                                                    </h3>
                                                    {idx === currentWeek && isCurrentMonth && (
                                                        <span className="badge badge-primary badge-sm">Current</span>
                                                    )}
                                                </div>

                                                {/* Main weekly goal */}
                                                <div className="mb-3">
                                                    {userGoals?.weeklyGoals?.[idx]?.goal ? (
                                                        <div className="text-foreground bg-base-200 rounded-lg px-3 py-2">
                                                            {userGoals.weeklyGoals[idx].goal}
                                                        </div>
                                                    ) : (selectedUid === user?.uid && idx === currentWeek && isCurrentMonth && userGoals?.monthlyGoal) ? (
                                                        <input
                                                            className="input input-bordered w-full focus:outline-none"
                                                            value={weeklyGoalInputs[idx]}
                                                            onChange={e => handleGoalInputChange(idx, e.target.value)}
                                                            placeholder="Set your weekly goal…"
                                                        />
                                                    ) : (
                                                        <span className="italic text-neutral">No weekly goal set yet.</span>
                                                    )}
                                                </div>

                                                {/* Additional note */}
                                                <div className="mb-3">
                                                    {(selectedUid === user?.uid && idx === currentWeek && isCurrentMonth && userGoals?.monthlyGoal) ? (
                                                        <textarea
                                                            className="textarea textarea-bordered w-full focus:outline-none"
                                                            value={weeklyNoteInputs[idx]}
                                                            onChange={e => handleNoteInputChange(idx, e.target.value)}
                                                            placeholder="Add or update your note for this week..."
                                                            rows={2}
                                                        />
                                                    ) : (
                                                        <div className="text-foreground text-sm min-h-[32px] bg-base-200 rounded-lg px-3 py-2">
                                                            {userGoals?.weeklyGoals?.[idx]?.note || <span className="italic text-neutral">No notes yet.</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Save Button */}
                                                {(selectedUid === user?.uid && idx === currentWeek && isCurrentMonth && userGoals?.monthlyGoal) && (
                                                    <button
                                                        onClick={() => handleSaveWeek(idx)}
                                                        disabled={savingWeek === idx || (!weeklyGoalInputs[idx] && !weeklyNoteInputs[idx])}
                                                        className="btn btn-primary btn-sm rounded-lg focus:outline-none"
                                                    >
                                                        {savingWeek === idx ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save week'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Previous Months Pagination */}
                                {availableMonths.length > 1 && (
                                    <div className="card bg-base-100 shadow-sm border mt-8">
                                        <div className="card-body">
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Previous Months</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                                {paginatedMonths.map(month => (
                                                    <button
                                                        key={month}
                                                        onClick={() => setSelectedMonthYear(month)}
                                                        className={`btn btn-sm ${selectedMonthYear === month ? 'btn-primary' : 'btn-outline'}`}
                                                    >
                                                        {formatMonthYear(month)}
                                                    </button>
                                                ))}
                                            </div>
                                            {totalPages > 1 && (
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Previous
                                                    </button>
                                                    <span className="flex items-center px-3">
                                                        Page {currentPage} of {totalPages}
                                                    </span>
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
