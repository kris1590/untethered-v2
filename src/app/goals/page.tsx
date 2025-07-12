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
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-10">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow p-6 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-accent mb-6 text-center">
                    Monthly Goal Tracker
                </h1>
                {/* User Selector */}
                <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center">
                    <label className="font-medium text-slate-700 dark:text-slate-200">Select Member:</label>
                    <select
                        className="border rounded-md p-2 dark:bg-slate-900"
                        value={selectedUid}
                        onChange={e => setSelectedUid(e.target.value)}
                    >
                        {users.map(u => (
                            <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
                        ))}
                    </select>
                </div>
                {loading ? (
                    <div className="text-center text-slate-400">Loading...</div>
                ) : (
                    <div>
                        {/* Monthly Goal */}
                        <div className="mb-4 font-bold text-lg text-slate-800 dark:text-slate-100">
                            Goal:
                        </div>
                        <div className="mb-6">
                            {userGoals?.monthlyGoal ? (
                                <div className="bg-accent/20 rounded-md px-4 py-2 text-slate-800 dark:text-slate-200">
                                    {userGoals.monthlyGoal}
                                </div>
                            ) : selectedUid === user?.uid ? (
                                <div>
                                    <input
                                        className="border rounded-md w-full p-2 mb-2 dark:bg-slate-900"
                                        type="text"
                                        placeholder="Enter your monthly goal..."
                                        value={monthlyGoal}
                                        onChange={e => setMonthlyGoalText(e.target.value)}
                                        disabled={addingMonthly}
                                    />
                                    <button
                                        onClick={handleSetMonthlyGoal}
                                        disabled={addingMonthly || !monthlyGoal.trim()}
                                        className="px-5 py-2 rounded-full font-semibold bg-accent text-primary hover:bg-accent/80 shadow transition w-full"
                                    >
                                        Set Goal
                                    </button>
                                </div>
                            ) : (
                                <span className="italic text-slate-400">No goal set for this month.</span>
                            )}
                        </div>
                        {/* Weekly Tracker */}
                        <div>
                            {[0, 1, 2, 3].map(idx => (
                                <div key={idx} className="mb-6 border-l-4 border-accent pl-4 py-2 bg-slate-50 dark:bg-slate-900 rounded">
                                    <div className="font-semibold text-primary dark:text-accent mb-1">
                                        Week {idx + 1}
                                    </div>
                                    {/* Main weekly goal */}
                                    <div className="mb-2">
                                        {userGoals?.weeklyGoals?.[idx]?.goal ? (
                                            <div className="text-slate-700 dark:text-slate-200">
                                                {userGoals.weeklyGoals[idx].goal}
                                            </div>
                                        ) : (selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) ? (
                                            <input
                                                className="w-full border rounded-md p-2 dark:bg-slate-800"
                                                value={weeklyGoalInputs[idx]}
                                                onChange={e => handleGoalInputChange(idx, e.target.value)}
                                                placeholder="Set your weekly goal…"
                                            />
                                        ) : (
                                            <span className="italic text-slate-400">No weekly goal set yet.</span>
                                        )}
                                    </div>
                                    {/* Additional note */}
                                    <div>
                                        {(selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) ? (
                                            <textarea
                                                className="w-full border rounded-md p-2 dark:bg-slate-800"
                                                value={weeklyNoteInputs[idx]}
                                                onChange={e => handleNoteInputChange(idx, e.target.value)}
                                                placeholder="Add or update your note for this week..."
                                                rows={2}
                                            />
                                        ) : (
                                            <div className="text-slate-700 dark:text-slate-300 text-sm min-h-[32px]">
                                                {userGoals?.weeklyGoals?.[idx]?.note || <span className="italic text-slate-400">No notes yet.</span>}
                                            </div>
                                        )}
                                    </div>
                                    {/* Save Button */}
                                    {(selectedUid === user?.uid && idx === currentWeek && userGoals?.monthlyGoal) && (
                                        <button
                                            onClick={() => handleSaveWeek(idx)}
                                            disabled={savingWeek === idx || (!weeklyGoalInputs[idx] && !weeklyNoteInputs[idx])}
                                            className="mt-2 px-4 py-2 rounded-full bg-accent text-primary font-semibold hover:bg-accent/80 shadow transition"
                                        >
                                            {savingWeek === idx ? "Saving..." : "Save Week"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
