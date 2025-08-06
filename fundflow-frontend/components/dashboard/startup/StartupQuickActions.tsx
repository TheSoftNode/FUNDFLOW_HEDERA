"use client";

import React from 'react';
import { 
  Plus,
  BarChart3,
  Users,
  Target,
  Mail,
  FileText,
  Settings,
  Zap,
  TrendingUp,
  Calendar
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

const StartupQuickActions: React.FC = () => {
  const handleCreateCampaign = () => {
    window.location.href = '/campaign/create';
  };

  const handleViewAnalytics = () => {
    alert('Analytics dashboard coming soon!');
  };

  const handleUpdateMilestone = () => {
    alert('Milestone update feature coming soon!');
  };

  const handleContactInvestors = () => {
    alert('Investor communication feature coming soon!');
  };

  const handleGenerateReport = () => {
    alert('Report generation feature coming soon!');
  };

  const handleManageSettings = () => {
    alert('Campaign settings coming soon!');
  };

  const actions: QuickAction[] = [
    {
      id: 'create-campaign',
      title: 'Create Campaign',
      description: 'Launch a new fundraising campaign',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: handleCreateCampaign
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Track campaign performance',
      icon: BarChart3,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      onClick: handleViewAnalytics
    },
    {
      id: 'update-milestone',
      title: 'Update Milestone',
      description: 'Report progress to investors',
      icon: Target,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: handleUpdateMilestone
    },
    {
      id: 'contact-investors',
      title: 'Contact Investors',
      description: 'Send updates to your backers',
      icon: Mail,
      color: 'bg-teal-500 hover:bg-teal-600',
      onClick: handleContactInvestors
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      description: 'Create financial reports',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: handleGenerateReport
    },
    {
      id: 'manage-settings',
      title: 'Campaign Settings',
      description: 'Manage campaign preferences',
      icon: Settings,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: handleManageSettings
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>Quick Actions</span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your campaigns efficiently
        </p>
      </div>

      {/* Actions Grid */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="group p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                  <action.icon className="w-4 h-4 text-white" />
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

        {/* Primary Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              onClick={handleCreateCampaign}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleViewAnalytics}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Performance
            </Button>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Upcoming</span>
          </h4>
          <div className="space-y-2">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-400">
                Milestone Due: Clinical Trials
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500">
                Due in 5 days
              </p>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-medium text-blue-800 dark:text-blue-400">
                Investor Update Due
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-500">
                Monthly report
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupQuickActions;