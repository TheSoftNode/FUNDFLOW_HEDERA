"use client";

import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown
} from 'lucide-react';
import StatCard from '@/components/dashboard/shared/StatCard';

interface PortfolioStatsProps {
  stats: {
    totalInvested: number;
    currentValue: number;
    totalReturn: number;
    returnPercentage: number;
    activeInvestments: number;
    completedInvestments: number;
    pendingMilestones: number;
    monthlyReturn: number;
    riskScore: number;
  };
}

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsConfig = [
    {
      title: 'Total Invested',
      value: formatCurrency(stats.totalInvested),
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      subtitle: 'Across all campaigns'
    },
    {
      title: 'Current Value',
      value: formatCurrency(stats.currentValue),
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      subtitle: `${stats.returnPercentage > 0 ? '+' : ''}${stats.returnPercentage.toFixed(1)}% return`,
      trend: {
        value: stats.returnPercentage,
        icon: stats.returnPercentage > 0 ? ArrowUpRight : ArrowDownRight,
        color: stats.returnPercentage > 0 ? 'text-green-500' : 'text-red-500'
      }
    },
    {
      title: 'Total Return',
      value: formatCurrency(stats.totalReturn),
      icon: Target,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      subtitle: 'Net profit/loss',
      trend: {
        value: stats.monthlyReturn,
        icon: stats.monthlyReturn > 0 ? TrendingUp : TrendingDown,
        color: stats.monthlyReturn > 0 ? 'text-green-500' : 'text-red-500',
        label: 'Monthly'
      }
    },
    {
      title: 'Active Investments',
      value: stats.activeInvestments.toString(),
      icon: Activity,
      color: 'teal',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      iconColor: 'text-teal-600 dark:text-teal-400',
      subtitle: `${stats.completedInvestments} completed`,
      badge: stats.pendingMilestones > 0 ? {
        text: `${stats.pendingMilestones} pending votes`,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      } : undefined
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <StatCard
          key={index}
          {...stat}
        />
      ))}
    </div>
  );
};

export default PortfolioStats;