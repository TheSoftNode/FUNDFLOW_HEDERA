import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <DashboardNavbar />
            <main className="pt-16">
                {children}
            </main>
            <Toaster />
        </div>
    );
} 