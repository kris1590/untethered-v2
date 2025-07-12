'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import LoginModal from './auth/LoginModal';
import SignUpModal from './auth/SignUpModal';

const navLinks = [
    { href: '/team-culture', label: 'Team Culture' },
    { href: '/commitments', label: 'Commitments' },
    { href: '/goals', label: 'Goals' },
    { href: '/resources', label: 'Resources' },
    { href: '/calendar', label: 'Calendar' },
];

export default function Header() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <header className="bg-white/90 dark:bg-slate-900/90 shadow-sm fixed top-0 left-0 w-full z-40 backdrop-blur">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
                    {/* Branding */}
                    <a href="/" className="flex items-center gap-2 text-2xl font-extrabold text-primary dark:text-accent tracking-tight">
                        {/* Replace below with your SVG logo if you have one */}
                        <span role="img" aria-label="logo">🌱</span>
                        <span>Untethered</span>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex gap-2 ml-10">
                        {user && navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-accent/20 hover:text-primary dark:hover:text-accent font-medium transition"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right side: Auth/User actions */}
                    <div className="flex items-center gap-2">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => setIsSignUpOpen(true)}
                                    className="px-5 py-2 rounded-full font-semibold bg-accent text-primary hover:bg-accent/80 shadow transition"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="px-5 py-2 rounded-full font-semibold border border-accent text-accent bg-white dark:bg-slate-800 hover:bg-accent/10 transition"
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-sm text-slate-500 dark:text-slate-300 hidden sm:inline">
                                    Welcome, {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn rounded-full border border-accent text-accent font-medium bg-white dark:bg-slate-800 hover:bg-accent/10 transition"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {/* Mobile Hamburger */}
                        {user && (
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="lg:hidden ml-2 p-2 rounded-full hover:bg-accent/20 focus:outline-none"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6 text-primary dark:text-accent" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {user && menuOpen && (
                    <nav className="lg:hidden bg-white dark:bg-slate-900 shadow-md rounded-b-2xl px-4 py-3 flex flex-col gap-2 absolute left-0 right-0 top-full z-30">
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-accent/20 hover:text-primary dark:hover:text-accent font-medium transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Modals */}
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
    );
}
