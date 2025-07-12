'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../lib/firebase';
import { useToast } from '../../../lib/toast-context';

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

// Helper function to convert Firebase error codes to user-friendly messages for signup
const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists. Please try logging in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password is too weak. Please choose a stronger password.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return 'Failed to create account. Please try again.';
    }
};

export default function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addToast('error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            addToast('error', 'Password must be at least 6 characters long');
            return;
        }

        if (!displayName.trim()) {
            addToast('error', 'Display name is required');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: displayName.trim(),
                phoneNumber: phoneNumber.trim() || null,
                createdAt: new Date()
            });

            addToast('success', 'Account created successfully!');
            onClose();
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setDisplayName('');
            setPhoneNumber('');
        } catch (error: any) {
            const userFriendlyMessage = getFirebaseErrorMessage(error.code);
            addToast('error', userFriendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="modal modal-open">
            <div className="modal-box max-w-md bg-base-100 shadow-xl rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Sign up</h2>
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
                            <span className="label-text font-medium text-foreground">Display name *</span>
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="input input-bordered w-full focus:outline-none"
                            placeholder="Enter your full name"
                            required
                            aria-describedby="displayname-error"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-foreground">Email *</span>
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
                            <span className="label-text font-medium text-foreground">Phone number</span>
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="input input-bordered w-full focus:outline-none"
                            placeholder="Enter your phone number (optional)"
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-foreground">Password *</span>
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
                        <label className="label">
                            <span className="label-text font-medium text-foreground">Confirm password *</span>
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input input-bordered w-full focus:outline-none"
                            placeholder="Confirm your password"
                            required
                            aria-describedby="confirmpassword-error"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full rounded-lg focus:outline-none"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Creating account...
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </button>
                </form>

                <div className="modal-action">
                    <div className="text-center w-full">
                        <p className="text-sm text-neutral">
                            Already have an account?{' '}
                            <button
                                onClick={onSwitchToLogin}
                                className="link link-primary font-medium focus:outline-none"
                            >
                                Login
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