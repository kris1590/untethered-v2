'use client';

import React from 'react';
import { useAuth } from '../../lib/auth-context';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import Toast from './Toast';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <Header />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
            <Toast />
        </>
    );
} 