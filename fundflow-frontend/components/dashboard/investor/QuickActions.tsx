"use client";

import React from 'react';
import { 
  Plus, 
  Search, 
  BarChart3, 
  Users, 
  Target,
  FileText,
  Download,
  Bell,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  customActions?: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ customActions }) => {
  const handleDiscoverCampaigns = () => {
    window.location.href = '/campaign/browse';
  };

  const handleViewAnalytics = () => {
    alert('Analytics dashboard coming soon!');
  };

  const handleExportPortfolio = () => {
    // Simple CSV export simulation
    const csvData = [
      ['Campaign', 'Invested', 'Current Value', 'Return %', 'Status'],
      ['AI Healthcare Assistant', '$25,000', '$32,000', '+28%', 'Active'],
      ['CleanTech Solar', '$15,000', '$18,500', '+23.3%', 'Pending'],
      ['Blockchain Network', '$20,000', '$28,000', '+40%', 'Completed']
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleJoinCommunity = () => {
    alert('Community features coming soon!');
  };

  const handleCreateAlert = () => {
    alert('Investment alerts feature coming soon!');
  };

  const handleViewReports = () => {
    alert('Detailed reports coming soon!');
  };

  const defaultActions: QuickAction[] = [
    {
      id: 'discover',
      title: 'Discover Campaigns',
      description: 'Find new investment opportunities',
      icon: Search,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: handleDiscoverCampaigns
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Deep dive into performance',
      icon: BarChart3,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: handleViewAnalytics
    },
    {
      id: 'export',
      title: 'Export Portfolio',
      description: 'Download your data',
      icon: Download,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: handleExportPortfolio
    },
    {
      id: 'community',
      title: 'Join Community',
      description: 'Connect with other investors',
      icon: Users,
      color: 'bg-teal-500 hover:bg-teal-600',
      onClick: handleJoinCommunity
    },
    {
      id: 'alerts',
      title: 'Create Alert',
      description: 'Set investment notifications',
      icon: Bell,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: handleCreateAlert
    },
    {
      id: 'reports',
      title: 'View Reports',
      description: 'Generate detailed reports',
      icon: FileText,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: handleViewReports
    }
  ];

  const actions = customActions || defaultActions;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>Quick Actions</span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Common tasks and shortcuts
        </p>
      </div>

      {/* Actions Grid */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="group p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-col gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={() => window.location.href = '/campaign/browse'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Investing
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => alert('Portfolio optimizer coming soon!')}
            >
              <Target className="w-4 h-4 mr-2" />
              Optimize Portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;