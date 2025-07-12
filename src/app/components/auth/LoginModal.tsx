'use client';

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useToast } from '../../../lib/toast-context';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignUp: () => void;
}

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        default:
            return 'Login failed. Please check your credentials and try again.';
    }
};

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { addToast } = useToast();

    // Load saved credentials when component mounts
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedEmail && savedPassword && savedRememberMe) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Set persistence based on "Remember me" checkbox
            if (rememberMe) {
                await setPersistence(auth, browserLocalPersistence);
                // Save credentials to localStorage
                localStorage.setItem('rememberedEmail', email);
                localStorage.setItem('rememberedPassword', password);
                localStorage.setItem('rememberMe', 'true');
            } else {
                await setPersistence(auth, browserSessionPersistence);
                // Clear saved credentials
                localStorage.removeItem('rememberedEmail');
                localStorage.removeItem('rememberedPassword');
                localStorage.removeItem('rememberMe');
            }

            await signInWithEmailAndPassword(auth, email, password);
            addToast('success', 'Successfully logged in!');
            onClose();
            setEmail('');
            setPassword('');
            setRememberMe(false);
        } catch (error: unknown) {
            const errorCode = error instanceof Error ? error.message : 'unknown_error';
            const userFriendlyMessage = getFirebaseErrorMessage(errorCode);
            addToast('error', userFriendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle remember me checkbox change
    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        if (!checked) {
            // Clear saved credentials when unchecking
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMe');
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-md bg-base-100 shadow-xl rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Login</h2>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle focus:outline-none"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-foreground">Email</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full focus:outline-none"
                            placeholder="Enter your email address"
                            required
                            aria-describedby="email-error"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-foreground">Password</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full focus:outline-none"
                            placeholder="Enter your password"
                            required
                            aria-describedby="password-error"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-sm checkbox-primary border-1 border-gray-400 focus:outline-none"
                                checked={rememberMe}
                                onChange={(e) => handleRememberMeChange(e.target.checked)}
                            />
                            <span className="label-text text-foreground">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full rounded-lg focus:outline-none"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="modal-action">
                    <div className="text-center w-full">
                        <p className="text-sm text-neutral">
                            Don&apos;t have an account?{' '}
                            <button
                                onClick={onSwitchToSignUp}
                                className="link link-primary font-medium focus:outline-none"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose} className="sr-only">close</button>
            </form>
        </dialog>
    );
} 