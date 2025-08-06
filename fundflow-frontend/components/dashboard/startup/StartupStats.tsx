"use client";

import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  FolderOpen,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import StatCard from '../shared/StatCard';

const StartupStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Raised',
      value: '$185,000',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      iconColor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      subtitle: 'Across all campaigns'
    },
    {
      title: 'Active Campaigns',
      value: '2',
      change: '+1',
      trend: 'up' as const,
      icon: FolderOpen,
      iconColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      subtitle: 'Currently fundraising'
    },
    {
      title: 'Total Investors',
      value: '89',
      change: '+15',
      trend: 'up' as const,
      icon: Users,
      iconColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      subtitle: 'Unique backers'
    },
    {
      title: 'Avg. Investment',
      value: '$2,079',
      change: '-5.2%',
      trend: 'down' as const,
      icon: TrendingUp,
      iconColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      subtitle: 'Per investor'
    },
    {
      title: 'Milestones Completed',
      value: '7/9',
      change: '+2',
      trend: 'up' as const,
      icon: Target,
      iconColor: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      subtitle: 'On track for goals'
    },
    {
      title: 'Days to Goal',
      value: '23',
      change: '-7',
      trend: 'down' as const,
      icon: Calendar,
      iconColor: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      subtitle: 'Avg. across campaigns'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            iconColor={stat.iconColor}
            subtitle={stat.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default StartupStats;