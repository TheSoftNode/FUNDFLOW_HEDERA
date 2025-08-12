"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import InvestorDashboard from './investor/InvestorDashboard';
import StartupDashboard from './startup/StartupDashboard';
import RoleSelection from './RoleSelection';
import LoadingSpinner from './shared/LoadingSpinner';

const DashboardRouter: React.FC = () => {
  const { user, isConnected, isLoading, connectWallet, getAvailableWallets } = useAuth();

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

  // For demo: bypass authentication checks
  // Not connected - show connection prompt
  if (!isConnected || !user) {
    // For demo purposes, show role selection instead of connection prompt
    return <RoleSelection />;
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