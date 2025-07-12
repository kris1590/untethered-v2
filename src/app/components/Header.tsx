'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import LoginModal from './auth/LoginModal';
import SignUpModal from './auth/SignUpModal';

export default function Header() {
    const { user, logout } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <div className="navbar bg-base-100 shadow-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        {user ? (
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                                <li><a href="/team-culture">Team Culture</a></li>
                                <li><a href="/commitments">Commitments</a></li>
                                <li><a>Goals</a></li>
                                <li><a>Resources</a></li>
                                <li><a>Calendar</a></li>
                            </ul>
                        ) : null}
                    </div>
                    <a className="btn btn-ghost text-xl">daisyUI</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    {user ? (
                        <ul className="menu menu-horizontal px-1">
                            <li><a href="/team-culture">Team Culture</a></li>
                            <li><a href="/commitments">Commitments</a></li>
                            <li><a>Goals</a></li>
                            <li><a>Resources</a></li>
                            <li><a>Calendar</a></li>
                        </ul>
                    ) : null}
                </div>
                <div className="navbar-end">
                    <div className="flex gap-2">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-600 hidden sm:inline">
                                    Welcome, {user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline btn-sm"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsSignUpOpen(true)}
                                    className="btn border-1 btn-sm"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="btn border-1 btn-sm"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToSignUp={() => {
                    setIsLoginOpen(false);
                    setIsSignUpOpen(true);
                }}
            />

            <SignUpModal
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onSwitchToLogin={() => {
                    setIsSignUpOpen(false);
                    setIsLoginOpen(true);
                }}
            />
        </>
    )
}