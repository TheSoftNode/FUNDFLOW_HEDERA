"use client";

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Vote,
  ArrowRight,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MilestoneAlert {
  id: string;
  type: 'voting_required' | 'milestone_achieved' | 'milestone_delayed' | 'upcoming_deadline';
  campaignName: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  actionRequired: boolean;
  deadline?: string;
  votingPower?: number;
  milestoneProgress?: number;
}

interface MilestoneAlertsProps {
  alerts?: MilestoneAlert[];
  maxAlerts?: number;
  onAlertAction?: (alertId: string, action: string) => void;
}

const MilestoneAlerts: React.FC<MilestoneAlertsProps> = ({ 
  alerts = [], 
  maxAlerts = 8,
  onAlertAction 
}) => {
  // Mock data if no alerts provided
  const defaultAlerts: MilestoneAlert[] = [
    {
      id: '1',
      type: 'voting_required',
      campaignName: 'AI Healthcare Assistant',
      title: 'Governance Vote Required',
      description: 'Vote on milestone completion and fund release',
      priority: 'high',
      timestamp: '2 hours ago',
      actionRequired: true,
      deadline: '2024-12-15',
      votingPower: 2.5
    },
    {
      id: '2',
      type: 'milestone_achieved',
      campaignName: 'CleanTech Solar',
      title: 'Milestone Completed',
      description: 'Beta testing phase successfully completed',
      priority: 'medium',
      timestamp: '1 day ago',
      actionRequired: false,
      milestoneProgress: 100
    },
    {
      id: '3',
      type: 'milestone_delayed',
      campaignName: 'Blockchain Network',
      title: 'Milestone Delayed',
      description: 'Technical challenges causing 2-week delay',
      priority: 'high',
      timestamp: '3 days ago',
      actionRequired: true,
      deadline: '2024-12-20'
    },
    {
      id: '4',
      type: 'upcoming_deadline',
      campaignName: 'IoT Platform',
      title: 'Upcoming Milestone',
      description: 'Product launch milestone due in 5 days',
      priority: 'medium',
      timestamp: '1 week ago',
      actionRequired: false,
      deadline: '2024-12-18'
    },
    {
      id: '5',
      type: 'voting_required',
      campaignName: 'SaaS Platform',
      title: 'Budget Approval Vote',
      description: 'Vote on additional funding for expansion',
      priority: 'medium',
      timestamp: '2 days ago',
      actionRequired: true,
      deadline: '2024-12-16',
      votingPower: 1.8
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;
  const limitedAlerts = displayAlerts.slice(0, maxAlerts);

  const getAlertConfig = (type: string, priority: string) => {
    const configs = {
      voting_required: {
        icon: Vote,
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-l-blue-500'
      },
      milestone_achieved: {
        icon: CheckCircle,
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-l-green-500'
      },
      milestone_delayed: {
        icon: AlertTriangle,
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-l-red-500'
      },
      upcoming_deadline: {
        icon: Calendar,
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        borderColor: 'border-l-yellow-500'
      }
    };

    return configs[type as keyof typeof configs] || configs.upcoming_deadline;
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const handleAlertAction = (alertId: string, action: string) => {
    if (onAlertAction) {
      onAlertAction(alertId, action);
    } else {
      console.log(`${action} for alert ${alertId}`);
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Milestone Alerts</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {limitedAlerts.filter(alert => alert.actionRequired).length} Action Required
            </Badge>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {limitedAlerts.length > 0 ? (
          limitedAlerts.map((alert) => {
            const config = getAlertConfig(alert.type, alert.priority);
            const AlertIcon = config.icon;

            return (
              <div key={alert.id} className={`p-4 border-l-4 ${config.borderColor} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <AlertIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h4>
                          <Badge className={getPriorityBadge(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {alert.description}
                        </p>
                        
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {alert.campaignName}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{alert.timestamp}</span>
                        {alert.deadline && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDeadline(alert.deadline)}</span>
                          </span>
                        )}
                        {alert.votingPower && (
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{alert.votingPower}% voting power</span>
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {alert.actionRequired && (
                        <Button
                          size="sm"
                          onClick={() => handleAlertAction(alert.id, 'take_action')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {alert.type === 'voting_required' ? 'Vote Now' : 'Take Action'}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Active Alerts
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              Milestone alerts and notifications will appear here
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {limitedAlerts.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {limitedAlerts.filter(alert => alert.actionRequired).length} items need attention
            </span>
            <button 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              onClick={() => console.log('Mark all as read')}
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneAlerts;