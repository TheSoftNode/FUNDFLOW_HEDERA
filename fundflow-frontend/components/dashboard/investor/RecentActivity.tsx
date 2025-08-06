"use client";

import React from 'react';
import { 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Users,
  Target,
  Activity
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'investment' | 'milestone' | 'return' | 'governance' | 'update';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  status: 'success' | 'pending' | 'warning' | 'info';
  campaignName?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities = [], 
  maxItems = 10 
}) => {
  // Mock data if no activities provided
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'milestone',
      title: 'Milestone Completed',
      description: 'Product Beta Launch milestone reached',
      timestamp: '2 hours ago',
      status: 'success',
      campaignName: 'AI Healthcare Assistant'
    },
    {
      id: '2',
      type: 'investment',
      title: 'New Investment',
      description: 'Successfully invested in campaign',
      timestamp: '1 day ago',
      amount: 15000,
      status: 'success',
      campaignName: 'CleanTech Solar'
    },
    {
      id: '3',
      type: 'governance',
      title: 'Voting Required',
      description: 'New proposal requires your vote',
      timestamp: '2 days ago',
      status: 'pending',
      campaignName: 'Blockchain Network'
    },
    {
      id: '4',
      type: 'return',
      title: 'Dividend Received',
      description: 'Quarterly dividend payment',
      timestamp: '3 days ago',
      amount: 2500,
      status: 'success',
      campaignName: 'SaaS Platform'
    },
    {
      id: '5',
      type: 'update',
      title: 'Campaign Update',
      description: 'Monthly progress report available',
      timestamp: '1 week ago',
      status: 'info',
      campaignName: 'AI Healthcare Assistant'
    },
    {
      id: '6',
      type: 'milestone',
      title: 'Milestone Delayed',
      description: 'Technical challenges causing delay',
      timestamp: '1 week ago',
      status: 'warning',
      campaignName: 'IoT Platform'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;
  const limitedActivities = displayActivities.slice(0, maxItems);

  const getActivityIcon = (type: string, status: string) => {
    switch (type) {
      case 'investment':
        return DollarSign;
      case 'milestone':
        return status === 'warning' ? AlertTriangle : CheckCircle;
      case 'return':
        return TrendingUp;
      case 'governance':
        return Users;
      case 'update':
        return Activity;
      default:
        return Clock;
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          dotColor: 'bg-green-500'
        };
      case 'pending':
        return {
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          dotColor: 'bg-yellow-500'
        };
      case 'warning':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          dotColor: 'bg-red-500'
        };
      case 'info':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          dotColor: 'bg-blue-500'
        };
      default:
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          dotColor: 'bg-gray-500'
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Activity</span>
          </h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-4 lg:p-6">
        {limitedActivities.length > 0 ? (
          <div className="space-y-4">
            {limitedActivities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type, activity.status);
              const statusConfig = getStatusConfig(activity.status);

              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Line */}
                  {index < limitedActivities.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-700"></div>
                  )}

                  {/* Activity Item */}
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <ActivityIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {activity.title}
                            </h4>
                            <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full`}></div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {activity.description}
                          </p>
                          
                          {activity.campaignName && (
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {activity.campaignName}
                            </p>
                          )}
                        </div>

                        {/* Amount & Timestamp */}
                        <div className="text-right flex-shrink-0 ml-4">
                          {activity.amount && (
                            <div className={`text-sm font-semibold mb-1 ${
                              activity.type === 'return' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {activity.type === 'return' ? '+' : ''}{formatCurrency(activity.amount)}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Recent Activity
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              Your recent activity will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;