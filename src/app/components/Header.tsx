'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useToast } from '../../lib/toast-context';
import LoginModal from './auth/LoginModal';
import SignUpModal from './auth/SignUpModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
    { href: '/team-culture', label: 'Team Culture' },
    { href: '/commitments', label: 'Commitments' },
    { href: '/goals', label: 'Goals' },
    { href: '/resources', label: 'Resources' },
    { href: '/calendar', label: 'Calendar' },
];

export default function Header() {
    const { user, userData, logout } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            addToast('success', 'Successfully logged out!');
            router.push('/');
        } catch {
            addToast('error', 'Failed to logout. Please try again.');
        }
    };

    return (
        <>
            <header className="bg-base-100 shadow-sm fixed top-0 left-0 w-full z-40 backdrop-blur">
                <div className="navbar w-full px-6">
                    {/* Branding */}
                    <div className="navbar-start">
                        <Link href="/" className="text-2xl font-semibold text-foreground flex items-center gap-2">
                            <span role="img" aria-label="logo" className="text-2xl">🌱</span>
                            <span>Untethered</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="navbar-center hidden lg:flex">
                            <ul className="menu menu-horizontal gap-2">
                                {navLinks.map(link => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            className="uppercase text-neutral hover:text-primary font-medium px-4 py-2 rounded-lg hover:bg-base-200 transition-colors focus:outline-none"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Right side: Auth/User actions */}
                    <div className="navbar-end">
                        {!user ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsSignUpOpen(true)}
                                    className="btn btn-primary btn-sm rounded-lg focus:outline-none border-1"
                                >
                                    Sign up
                                </button>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="btn btn-outline btn-sm rounded-lg focus:outline-none border-1"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-neutral hidden sm:inline">
                                    Welcome, {userData?.displayName || user.email?.split('@')[0] || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-primary btn-sm rounded-lg focus:outline-none"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {user && (
                            <div className="lg:hidden">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="btn btn-ghost btn-sm rounded-lg focus:outline-none"
                                    aria-label="Toggle menu"
                                    aria-expanded={menuOpen}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {user && menuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100 shadow-lg border-t">
                        <ul className="menu p-4 space-y-2">
                            {navLinks.map(link => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-neutral hover:text-primary font-medium px-4 py-3 rounded-lg hover:bg-base-200 transition-colors focus:outline-none"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
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
