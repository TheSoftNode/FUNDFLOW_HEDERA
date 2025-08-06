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

const StartupDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
    switch (itemId) {
      case 'dashboard':
        // Stay on current page
        break;
      case 'campaigns':
        // Navigate to campaigns management
        break;
      case 'investors':
        // Navigate to investors view
        break;
      case 'analytics':
        // Navigate to analytics view
        break;
      case 'milestones':
        // Navigate to milestones management
        break;
      case 'payments':
        // Navigate to payments view
        break;
      case 'settings':
        // Navigate to settings
        break;
      default:
        console.log('Navigate to:', itemId);
    }
  };

  // Initialize sidebar state based on screen size
  React.useEffect(() => {
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
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
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
        className={`fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${
          sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
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
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
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

            {/* Stats Cards */}
            <StartupStats />

            {/* Main Dashboard Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Campaigns List - Full Width */}
              <div className="w-full">
                <CampaignsList campaigns={campaigns} />
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

            {/* Mobile Bottom Spacing */}
            <div className="h-20 lg:h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;