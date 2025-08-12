"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardNavbar from './DashboardNavbar';
import StartupSidebar from './startup/StartupSidebar';
import InvestorSidebar from './investor/InvestorSidebar';
import StartupDashboard from './startup/StartupDashboard';
import InvestorDashboard from './investor/InvestorDashboard';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, isConnected } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      } else {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
  };

  // If not connected, show connection prompt
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
              onClick={() => {
                // Try to connect to the first available wallet
                const availableWallets = ['hashpack', 'metamask', 'walletconnect'];
                if (availableWallets.length > 0) {
                  // For demo purposes, just redirect to role selection
                  window.location.href = '/dashboard';
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isStartup = user.role === 'startup';
  const isInvestor = user.role === 'investor';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNavbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          } lg:relative lg:translate-x-0`}>
          {isStartup ? (
            <StartupSidebar
              isCollapsed={sidebarCollapsed}
              onToggle={handleSidebarToggle}
              activeItem={activeNavItem}
              onItemClick={handleNavItemClick}
              userName={user.profile?.name || 'Startup User'}
              userRole="startup"
            />
          ) : isInvestor ? (
            <InvestorSidebar
              isCollapsed={sidebarCollapsed}
              onToggle={handleSidebarToggle}
              activeItem={activeNavItem}
              onItemClick={handleNavItemClick}
              userName={user.profile?.name || 'Investor User'}
              userRole="investor"
            />
          ) : (
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
              <div className="p-4">
                <p className="text-gray-500 dark:text-gray-400">Please select your role</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {isStartup ? (
              <StartupDashboard
                sidebarCollapsed={sidebarCollapsed}
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            ) : isInvestor ? (
              <InvestorDashboard
                sidebarCollapsed={sidebarCollapsed}
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome to FundFlow
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please select your role to access your dashboard.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      // For demo: immediately set role and navigate
                      localStorage.setItem('user_role', 'startup');
                      window.location.reload();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue as Startup
                  </button>
                  <button
                    onClick={() => {
                      // For demo: immediately set role and navigate
                      localStorage.setItem('user_role', 'investor');
                      window.location.reload();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue as Investor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 