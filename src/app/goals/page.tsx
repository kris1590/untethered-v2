"use client";
import React, { useState, useEffect } from "react";
import { getUsers, getUserGoal, setMonthlyGoal, addWeeklyGoal, updateWeeklyNote } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

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
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const dayOfWeek = first.getDay();
    const day = today.getDate();
    return Math.floor((day + dayOfWeek - 1) / 7);
}

export default function GoalsTracker() {
    const { user } = useAuth();
    console.log(user);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUid, setSelectedUid] = useState(user?.uid || "");
    const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
    const [loading, setLoading] = useState(false);

    // For adding new monthly goal
    const [monthlyGoal, setMonthlyGoalText] = useState("");
    const [addingMonthly, setAddingMonthly] = useState(false);

    // For editing weekly goal and notes
    const [weeklyGoalInputs, setWeeklyGoalInputs] = useState<string[]>(["", "", "", ""]);
    const [weeklyNoteInputs, setWeeklyNoteInputs] = useState<string[]>(["", "", "", ""]);
    const [savingWeek, setSavingWeek] = useState<number | null>(null);

    // On mount, fetch all users
    useEffect(() => { getUsers().then(setUsers); }, []);

    // When selected user changes, fetch their goals
    useEffect(() => {
        if (!selectedUid) return;
        setLoading(true);
        getUserGoal(selectedUid).then((goals: UserGoals) => {
            setUserGoals(goals);
            setLoading(false);

            // Set local state for weekly goals and notes
            const weeks = goals?.weeklyGoals || [];
            setWeeklyGoalInputs([0, 1, 2, 3].map(i => weeks[i]?.goal || ""));
            setWeeklyNoteInputs([0, 1, 2, 3].map(i => weeks[i]?.note || ""));
        });
    }, [selectedUid]);

    const currentWeek = getCurrentWeekNumberInMonth();

    // Save monthly goal (only if not already set)
    const handleSetMonthlyGoal = async () => {
        if (!user?.uid) return;
        setAddingMonthly(true);
        await setMonthlyGoal(user.uid, monthlyGoal);
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
            await addWeeklyGoal(user.uid, weekIdx, weeklyGoalInputs[weekIdx]); // Now pass index
        }
        // Always save notes
        await updateWeeklyNote(user.uid, weekIdx, weeklyNoteInputs[weekIdx]);
        setSavingWeek(null);
        // Refetch
        getUserGoal(selectedUid).then((goals: UserGoals) => {
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

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-4xl mx-auto px-6">
                <div className="card bg-base-100 shadow-md rounded-xl">
                    <div className="card-body p-6 md:p-10">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
                            Monthly Goal Tracker
                        </h1>

                        {/* User Selector */}
                        <div className="form-control mb-8">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Select Member:</span>
                            </label>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={selectedUid}
                                onChange={e => setSelectedUid(e.target.value)}
                            >
                                {users.map(u => (
                                    <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center text-gray-500 py-8">
                                <span className="loading loading-spinner loading-md"></span>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Monthly Goal */}
                                <div className="card bg-base-100 shadow-sm border">
                                    <div className="card-body">
                                        <h2 className="card-title text-lg font-semibold text-gray-800 mb-4">
                                            Monthly Goal
                                        </h2>
                                        {userGoals?.monthlyGoal ? (
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-gray-800">
                                                {userGoals.monthlyGoal}
                                            </div>
                                        ) : selectedUid === user?.uid ? (
                                            <div className="space-y-4">
                                                <input
                                                    className="input input-bordered w-full"
                                                    type="text"
                                                    placeholder="Enter your monthly goal..."
                                                    value={monthlyGoal}
                                                    onChange={e => setMonthlyGoalText(e.target.value)}
                                                    disabled={addingMonthly}
                                                />
                                                <button
                                                    onClick={handleSetMonthlyGoal}
                                                    disabled={addingMonthly || !monthlyGoal.trim()}
                                                    className="btn btn-primary rounded-xl"
                                                >
                                                    {addingMonthly ? (
                                                        <>
                                                            <span className="loading loading-spinner loading-sm"></span>
                                                            Setting Goal...
                                                        </>
                                                    ) : (
                                                        'Set Goal'
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="italic text-gray-400">No goal set for this month.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Weekly Tracker */}
                                <div className="space-y-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h2>
                                    {[0, 1, 2, 3].map(idx => (
                                        <div key={idx} className="card bg-base-100 shadow-sm border-l-4 border-l-blue-500">
                                            <div className="card-body">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold text-gray-800">
                                                        Week {idx + 1}
                                                    </h3>
                                                    {idx === currentWeek && (
                                                        <span className="badge badge-primary badge-sm">Current</span>
                                                    )}
                                                </div>

                                                {/* Main weekly goal */}
                                                <div className="mb-3">
                                                    {userGoals?.weeklyGoals?.[idx]?.goal ? (
                                                        <div className="text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                                                            {userGoals.weeklyGoals[idx].goal}
                                                        </div>
                                                    ) : (selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) ? (
                                                        <input
                                                            className="input input-bordered w-full"
                                                            value={weeklyGoalInputs[idx]}
                                                            onChange={e => handleGoalInputChange(idx, e.target.value)}
                                                            placeholder="Set your weekly goal…"
                                                        />
                                                    ) : (
                                                        <span className="italic text-gray-400">No weekly goal set yet.</span>
                                                    )}
                                                </div>

                                                {/* Additional note */}
                                                <div className="mb-3">
                                                    {(selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) ? (
                                                        <textarea
                                                            className="textarea textarea-bordered w-full"
                                                            value={weeklyNoteInputs[idx]}
                                                            onChange={e => handleNoteInputChange(idx, e.target.value)}
                                                            placeholder="Add or update your note for this week..."
                                                            rows={2}
                                                        />
                                                    ) : (
                                                        <div className="text-gray-700 text-sm min-h-[32px] bg-gray-50 rounded-lg px-3 py-2">
                                                            {userGoals?.weeklyGoals?.[idx]?.note || <span className="italic text-gray-400">No notes yet.</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Save Button */}
                                                {(selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) && (
                                                    <button
                                                        onClick={() => handleSaveWeek(idx)}
                                                        disabled={savingWeek === idx || (!weeklyGoalInputs[idx] && !weeklyNoteInputs[idx])}
                                                        className="btn btn-primary btn-sm rounded-xl"
                                                    >
                                                        {savingWeek === idx ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            'Save Week'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
