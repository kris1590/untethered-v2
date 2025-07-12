'use client';

import React from 'react';
import { useToast, ToastType } from '../../lib/toast-context';

export default function Toast() {
    const { toasts, removeToast } = useToast();

    const getAlertClass = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'alert-success';
            case 'error':
                return 'alert-error';
            case 'warning':
                return 'alert-warning';
            case 'info':
                return 'alert-info';
            default:
                return 'alert-info';
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast toast-end">
            {toasts.map((toast) => (
                <div key={toast.id} className={`alert ${getAlertClass(toast.type)}`}>
                    <span>{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="btn btn-ghost btn-xs"
                        aria-label="Close toast"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
} 