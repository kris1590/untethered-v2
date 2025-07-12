'use client';

import React from 'react';
import { useAuth } from '../../lib/auth-context';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

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
            {children}
        </>
    );
} 