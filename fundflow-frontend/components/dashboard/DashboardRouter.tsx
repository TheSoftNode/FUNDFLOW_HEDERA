"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import InvestorDashboard from './investor/InvestorDashboard';
import StartupDashboard from './startup/StartupDashboard';
import RoleSelection from './RoleSelection';
import LoadingSpinner from './shared/LoadingSpinner';

const DashboardRouter: React.FC = () => {
  const { user, isConnected, isLoading, connectWallet } = useAuth();

  useEffect(() => {
    // If not connected, try to reconnect on page load
    if (!isConnected && !isLoading) {
      // Don't auto-connect, let user decide
    }
  }, [isConnected, isLoading]);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not connected - show connection prompt
  if (!isConnected || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Your Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your wallet to access your personalized dashboard and manage your investments or campaigns.
            </p>
            
            <button
              onClick={connectWallet}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Connect Wallet
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Secure connection via Stacks blockchain
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User connected but no role selected
  if (!user.role) {
    return <RoleSelection />;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'investor':
      return <InvestorDashboard />;
    case 'startup':
      return <StartupDashboard />;
    default:
      return <RoleSelection />;
  }
};

export default DashboardRouter;