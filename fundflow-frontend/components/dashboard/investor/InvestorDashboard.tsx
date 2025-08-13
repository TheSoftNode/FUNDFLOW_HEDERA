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
  sidebarCollapsed: initialSidebarCollapsed = true,
  activeNavItem: initialActiveNavItem = 'dashboard',
  onNavItemClick
}) => {
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [activeNavItem, setActiveNavItem] = useState(initialActiveNavItem);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={handleSidebarToggle}
        className={`fixed top-4 left-4 z-50 lg:hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 transition-all duration-300 ${sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className={`flex-1 transition-all duration-500 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="min-h-screen">
          {/* Top Spacing for Navbar */}
          <div className="h-16"></div>

          {/* Dashboard Content */}
          <div className="p-4 lg:p-8 space-y-8">
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
            <div className="space-y-8">
              {/* Investments List - Full Width */}
              <div className="w-full">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      Investment Portfolio
                    </h2>
                    <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg">
                      Discover Opportunities
                    </button>
                  </div>
                  <InvestmentsList
                    investments={investments}
                    onViewDetails={handleViewInvestmentDetails}
                  />
                </div>
              </div>

              {/* Row 1: Milestone Alerts and Recent Activity */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Milestone Alerts - Half Width */}
                <div className="w-full">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/50 h-full">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Milestone Alerts
                    </h3>
                    <MilestoneAlerts maxAlerts={5} />
                  </div>
                </div>

                {/* Recent Activity - Half Width */}
                <div className="w-full">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/50 h-full">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Recent Activity
                    </h3>
                    <RecentActivity maxItems={6} />
                  </div>
                </div>
              </div>

              {/* Row 2: Performance Chart and Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Performance Chart - Half Width */}
                <div className="w-full">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/50 h-full">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Performance Overview
                    </h3>
                    <PerformanceChart />
                  </div>
                </div>

                {/* Quick Actions - Half Width */}
                <div className="w-full">
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/20 dark:border-slate-700/50 h-full">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Quick Actions
                    </h3>
                    <QuickActions />
                  </div>
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