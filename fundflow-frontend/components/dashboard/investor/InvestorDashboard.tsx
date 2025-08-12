"use client";

import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import PortfolioStats from './PortfolioStats';
import InvestmentsList from './InvestmentsList';
import PerformanceChart from '../charts/PerformanceChart';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import MilestoneAlerts from './MilestoneAlerts';
import Sidebar from './InvestorSidebar';

interface InvestorDashboardProps {
  sidebarCollapsed?: boolean;
  activeNavItem?: string;
  onNavItemClick?: (itemId: string) => void;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  sidebarCollapsed = true,
  activeNavItem = 'dashboard',
  onNavItemClick
}) => {
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);

  // Mock data - replace with actual data from your API
  const portfolioStats = {
    totalInvested: 125000,
    currentValue: 156000,
    totalReturn: 31000,
    returnPercentage: 24.8,
    activeInvestments: 8,
    completedInvestments: 3,
    pendingMilestones: 5,
    monthlyReturn: 8.2,
    riskScore: 6.5
  };

  const investments = [
    {
      id: 1,
      campaignTitle: "AI-Powered Healthcare Assistant",
      investedAmount: 25000,
      currentValue: 32000,
      equityTokens: 250,
      investmentDate: "2024-01-15",
      status: "active" as const,
      progress: 75,
      lastUpdate: "2 days ago",
      category: "HealthTech",
      founder: "Dr. Sarah Chen",
      riskLevel: "medium" as const,
      milestones: { completed: 3, total: 5 }
    },
    {
      id: 2,
      campaignTitle: "Sustainable Energy Storage",
      investedAmount: 15000,
      currentValue: 18500,
      equityTokens: 150,
      investmentDate: "2024-02-01",
      status: "milestone_pending" as const,
      progress: 60,
      lastUpdate: "1 week ago",
      category: "CleanTech",
      founder: "Michael Torres",
      riskLevel: "high" as const,
      milestones: { completed: 2, total: 4 }
    },
    {
      id: 3,
      campaignTitle: "Decentralized Social Network",
      investedAmount: 20000,
      currentValue: 28000,
      equityTokens: 200,
      investmentDate: "2023-12-10",
      status: "completed" as const,
      progress: 100,
      lastUpdate: "1 month ago",
      category: "Blockchain",
      founder: "Alex Kim",
      riskLevel: "low" as const,
      milestones: { completed: 6, total: 6 }
    },
    {
      id: 4,
      campaignTitle: "IoT Smart Agriculture Platform",
      investedAmount: 12000,
      currentValue: 14500,
      equityTokens: 120,
      investmentDate: "2024-03-01",
      status: "active" as const,
      progress: 45,
      lastUpdate: "3 days ago",
      category: "AgTech",
      founder: "Maria Rodriguez",
      riskLevel: "medium" as const,
      milestones: { completed: 1, total: 4 }
    },
    {
      id: 5,
      campaignTitle: "Quantum Computing Software",
      investedAmount: 30000,
      currentValue: 35000,
      equityTokens: 300,
      investmentDate: "2023-11-20",
      status: "milestone_pending" as const,
      progress: 80,
      lastUpdate: "5 days ago",
      category: "DeepTech",
      founder: "Dr. James Liu",
      riskLevel: "high" as const,
      milestones: { completed: 4, total: 5 }
    }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };



  const handleNavItemClick = (itemId: string) => {
    if (onNavItemClick) {
      onNavItemClick(itemId);
    }
  };

  const handleViewInvestmentDetails = (investment: any) => {
    setSelectedInvestment(investment);
    // Navigate to investment details page
    window.location.href = `/campaign/detail?id=${investment.id}`;
  };

  const handleNotificationClick = () => {
    setActiveNavItem('notifications');
    // Open notifications modal or panel
    alert('Notifications panel would open here');
  };

  const handleExportClick = () => {
    // Simulate export functionality
    const portfolioData = {
      totalInvested: portfolioStats.totalInvested,
      currentValue: portfolioStats.currentValue,
      totalReturn: portfolioStats.totalReturn,
      returnPercentage: portfolioStats.returnPercentage,
      investments: investments.map(inv => ({
        campaignTitle: inv.campaignTitle,
        investedAmount: inv.investedAmount,
        currentValue: inv.currentValue,
        status: inv.status,
        category: inv.category
      })),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        activeItem={activeNavItem}
        onItemClick={handleNavItemClick}
        userName="John Doe"
        userRole="Professional Investor"
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
        <div className="min-h-screen">
          {/* Top Spacing for Mobile Menu */}
          <div className="h-16 lg:h-4"></div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8">
            {/* Dashboard Header */}
            <DashboardHeader
              userName="John"
              totalPortfolioValue={portfolioStats.currentValue}
              onNotificationClick={handleNotificationClick}
              onExportClick={handleExportClick}
            />

            {/* Portfolio Stats */}
            <div className="mb-8">
              <PortfolioStats stats={portfolioStats} />
            </div>

            {/* Main Dashboard Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Investments List - Full Width */}
              <div className="w-full">
                <InvestmentsList
                  investments={investments}
                  onViewDetails={handleViewInvestmentDetails}
                />
              </div>

              {/* Row 1: Milestone Alerts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestone Alerts - Half Width */}
                <div className="w-full">
                  <MilestoneAlerts maxAlerts={5} />
                </div>

                {/* Recent Activity - Half Width */}
                <div className="w-full">
                  <RecentActivity maxItems={6} />
                </div>
              </div>

              {/* Row 2: Performance Chart and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Chart - Half Width */}
                <div className="w-full">
                  <PerformanceChart />
                </div>

                {/* Quick Actions - Half Width */}
                <div className="w-full">
                  <QuickActions />
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

export default InvestorDashboard;