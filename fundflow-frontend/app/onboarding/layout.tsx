import React from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
            {children}
            <Toaster />
        </div>
    );
}
