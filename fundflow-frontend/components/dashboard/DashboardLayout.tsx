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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-4">
              Access Your Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
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
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900/50">
      <DashboardNavbar />

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
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
            <div className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/50 h-full shadow-xl">
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Select Your Role</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Choose your primary role to continue</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6 lg:p-8">
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
              <div className="text-center py-16">
                <div className="max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>

                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-6">
                    Welcome to FundFlow
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                    Choose your role to access your personalized dashboard and start your journey.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button
                      onClick={() => {
                        localStorage.setItem('user_role', 'startup');
                        window.location.reload();
                      }}
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Continue as Startup
                    </button>

                    <button
                      onClick={() => {
                        localStorage.setItem('user_role', 'investor');
                        window.location.reload();
                      }}
                      className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Continue as Investor
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default DashboardLayout; 