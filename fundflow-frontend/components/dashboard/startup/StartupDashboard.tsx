"use client";

import React, { useState } from 'react';
import StartupSidebar from './StartupSidebar';
import StartupHeader from './StartupHeader';
import CampaignsList from './CampaignsList';
import StartupStats from './StartupStats';
import RevenueChart from './RevenueChart';
import InvestorsList from './InvestorsList';
import MilestoneProgress from './MilestoneProgress';
import StartupQuickActions from './StartupQuickActions';

interface StartupDashboardProps {
  sidebarCollapsed?: boolean;
  activeNavItem?: string;
  onNavItemClick?: (itemId: string) => void;
}

const StartupDashboard: React.FC<StartupDashboardProps> = ({
  sidebarCollapsed: initialSidebarCollapsed = true,
  activeNavItem: initialActiveNavItem = 'dashboard',
  onNavItemClick
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [activeNavItem, setActiveNavItem] = useState(initialActiveNavItem);

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavItemClick = (itemId: string) => {
    if (onNavItemClick) {
      onNavItemClick(itemId);
    } else {
      setActiveNavItem(itemId);
    }
  };



  const handleNotificationClick = () => {
    setActiveNavItem('notifications');
    alert('Notifications panel would open here');
  };

  const handleExportClick = () => {
    // Simulate export functionality
    const campaignData = {
      totalRaised: 185000,
      activeCampaigns: 2,
      totalInvestors: 89,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(campaignData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `startup-data-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Mock data for campaigns
  const campaigns = [
    {
      id: 1,
      title: "AI Healthcare Assistant",
      status: "active",
      targetAmount: 250000,
      raisedAmount: 187500,
      progressPercentage: 75,
      investorCount: 45,
      daysLeft: 15,
      category: "HealthTech",
      createdDate: "2024-01-15",
      milestones: { completed: 3, total: 5 }
    },
    {
      id: 2,
      title: "Sustainable Energy Platform",
      status: "completed",
      targetAmount: 500000,
      raisedAmount: 520000,
      progressPercentage: 104,
      investorCount: 78,
      daysLeft: 0,
      category: "CleanTech",
      createdDate: "2023-11-20",
      milestones: { completed: 4, total: 4 }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={handleSidebarToggle}
        className={`fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <StartupSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        userName="Sarah Chen"
        userRole="Startup Founder"
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
        <div className="min-h-screen">
          {/* Top Spacing for Mobile Menu */}
          <div className="h-16 lg:h-4"></div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8">
            {/* Header */}
            <StartupHeader
              onNotificationClick={handleNotificationClick}
              onExportClick={handleExportClick}
            />

            {/* Content based on active nav item */}
            {activeNavItem === 'dashboard' && (
              <>
                {/* Stats Cards */}
                <StartupStats />

                {/* Main Dashboard Content */}
                <div className="space-y-6 lg:space-y-8">
                  {/* Campaigns List - Full Width */}
                  <div className="w-full">
                    <CampaignsList campaigns={campaigns as any} />
                  </div>

                  {/* Row 1: Revenue Chart and Milestone Progress */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="w-full">
                      <RevenueChart />
                    </div>

                    <div className="w-full">
                      <MilestoneProgress />
                    </div>
                  </div>

                  {/* Row 2: Investors List and Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="w-full">
                      <InvestorsList />
                    </div>

                    <div className="w-full">
                      <StartupQuickActions />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeNavItem === 'campaigns' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Campaigns</h2>
                  <CampaignsList campaigns={campaigns as any} />
                </div>
              </div>
            )}

            {activeNavItem === 'investors' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Investors</h2>
                  <InvestorsList />
                </div>
              </div>
            )}

            {activeNavItem === 'milestones' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Milestones</h2>
                  <MilestoneProgress />
                </div>
              </div>
            )}

            {activeNavItem === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h2>
                  <RevenueChart />
                </div>
              </div>
            )}

            {activeNavItem === 'payments' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payments</h2>
                  <p className="text-gray-600 dark:text-gray-400">Payment management interface will be implemented here.</p>
                </div>
              </div>
            )}

            {activeNavItem === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h2>
                  <p className="text-gray-600 dark:text-gray-400">Account settings and preferences will be implemented here.</p>
                </div>
              </div>
            )}

            {/* Mobile Bottom Spacing */}
            <div className="h-20 lg:h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;