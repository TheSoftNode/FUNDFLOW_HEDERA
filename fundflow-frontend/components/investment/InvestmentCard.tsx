"use client";

import React from 'react';
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User, 
  Target,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Investment {
  id: number;
  campaignTitle: string;
  investedAmount: number;
  currentValue: number;
  equityTokens: number;
  investmentDate: string;
  status: 'active' | 'completed' | 'milestone_pending';
  progress: number;
  lastUpdate: string;
  category: string;
  founder: string;
  riskLevel: 'low' | 'medium' | 'high';
  milestones: {
    completed: number;
    total: number;
  };
}

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ 
  investment, 
  onViewDetails 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Active'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          label: 'Completed'
        };
      case 'milestone_pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Pending Vote'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Unknown'
        };
    }
  };

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Low Risk'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Medium Risk'
        };
      case 'high':
        return {
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          label: 'High Risk'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Unknown'
        };
    }
  };

  const returnAmount = investment.currentValue - investment.investedAmount;
  const returnPercentage = (returnAmount / investment.investedAmount) * 100;
  const isPositiveReturn = returnAmount >= 0;

  const statusConfig = getStatusConfig(investment.status);
  const riskConfig = getRiskConfig(investment.riskLevel);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-4 lg:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
              {investment.campaignTitle}
            </h3>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={statusConfig.color} >
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" >
                {investment.category}
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewDetails}
            className="ml-2 flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invested</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(investment.investedAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Value</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(investment.currentValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Return</p>
            <div className="flex items-center space-x-1">
              {isPositiveReturn ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`font-semibold text-sm ${
                isPositiveReturn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositiveReturn ? '+' : ''}{returnPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Progress</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${investment.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {investment.progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{investment.founder}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>{investment.milestones.completed}/{investment.milestones.total}</span>
            </div>
          </div>
          <Badge className={riskConfig.color} >
            {riskConfig.label}
          </Badge>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex items-center space-x-6">
          {/* Campaign Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 truncate">
              {investment.campaignTitle}
            </h3>
            
            <div className="flex items-center space-x-4 mb-3">
              <Badge className={statusConfig.color}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <Badge variant="outline">
                {investment.category}
              </Badge>
              <Badge className={riskConfig.color}>
                {riskConfig.label}
              </Badge>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{investment.founder}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(investment.investmentDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{investment.milestones.completed}/{investment.milestones.total} milestones</span>
              </div>
            </div>
          </div>

          {/* Investment Amounts */}
          <div className="text-center min-w-[120px]">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Invested</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(investment.investedAmount)}
            </p>
          </div>

          <div className="text-center min-w-[120px]">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Value</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(investment.currentValue)}
            </p>
          </div>

          {/* Return */}
          <div className="text-center min-w-[100px]">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Return</p>
            <div className="flex items-center justify-center space-x-1">
              {isPositiveReturn ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`font-semibold ${
                isPositiveReturn ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositiveReturn ? '+' : ''}{returnPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="min-w-[120px]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {investment.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${investment.progress}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewDetails}
              className="min-w-[100px]"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;