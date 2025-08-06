"use client";

import React from 'react';
import { 
  Target, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  dueDate: string;
  campaignName: string;
  fundingPercentage: number;
}

const MilestoneProgress: React.FC = () => {
  // Mock milestone data
  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Product Beta Launch',
      description: 'Complete beta version with core features',
      status: 'completed',
      dueDate: '2024-01-15',
      campaignName: 'AI Healthcare Assistant',
      fundingPercentage: 25
    },
    {
      id: '2',
      title: 'Clinical Trials Phase 1',
      description: 'Begin trials with partner hospitals',
      status: 'in-progress',
      dueDate: '2024-02-28',
      campaignName: 'AI Healthcare Assistant',
      fundingPercentage: 25
    },
    {
      id: '3',
      title: 'FDA Submission',
      description: 'Submit regulatory approval application',
      status: 'pending',
      dueDate: '2024-04-15',
      campaignName: 'AI Healthcare Assistant',
      fundingPercentage: 25
    },
    {
      id: '4',
      title: 'Energy Storage Prototype',
      description: 'Complete prototype development',
      status: 'delayed',
      dueDate: '2024-01-30',
      campaignName: 'Sustainable Energy Platform',
      fundingPercentage: 30
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          iconColor: 'text-green-500'
        };
      case 'in-progress':
        return {
          icon: Clock,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          iconColor: 'text-blue-500'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          iconColor: 'text-gray-500'
        };
      case 'delayed':
        return {
          icon: AlertTriangle,
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          iconColor: 'text-red-500'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          iconColor: 'text-gray-500'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Milestone Progress</span>
          </h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">3</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">2</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">1</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Delayed</div>
          </div>
        </div>
      </div>

      {/* Milestones List */}
      <div className="p-4 lg:p-6">
        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const statusConfig = getStatusConfig(milestone.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {milestone.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {milestone.description}
                        </p>
                      </div>
                      <Badge className={`${statusConfig.color} ml-2 text-xs`}>
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>Due {formatDate(milestone.dueDate)}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{milestone.fundingPercentage}%</span> funding
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 font-medium">
                        {milestone.campaignName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => alert('Milestone management coming soon!')}
          >
            <Target className="w-4 h-4 mr-2" />
            Manage Milestones
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneProgress;