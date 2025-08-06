"use client";

import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Search, 
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Target,
  DollarSign,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Campaign {
  id: number;
  title: string;
  status: 'active' | 'completed' | 'draft' | 'paused';
  targetAmount: number;
  raisedAmount: number;
  progressPercentage: number;
  investorCount: number;
  daysLeft: number;
  category: string;
  createdDate: string;
  milestones: {
    completed: number;
    total: number;
  };
}

interface CampaignsListProps {
  campaigns: Campaign[];
}

const CampaignsList: React.FC<CampaignsListProps> = ({ campaigns }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Active'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          label: 'Completed'
        };
      case 'draft':
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Draft'
        };
      case 'paused':
        return {
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Paused'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
          label: 'Unknown'
        };
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCampaignAction = (campaignId: number, action: string) => {
    switch (action) {
      case 'view':
        window.location.href = `/campaign/detail?id=${campaignId}`;
        break;
      case 'edit':
        alert(`Edit campaign ${campaignId} - Feature coming soon!`);
        break;
      case 'analytics':
        alert(`View analytics for campaign ${campaignId} - Feature coming soon!`);
        break;
      case 'pause':
        alert(`Pause campaign ${campaignId} - Feature coming soon!`);
        break;
      case 'resume':
        alert(`Resume campaign ${campaignId} - Feature coming soon!`);
        break;
      default:
        console.log(`Action ${action} for campaign ${campaignId}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Campaigns
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredCampaigns.length} of {campaigns.length} campaigns
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-3 lg:space-y-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>

            {/* Create Campaign Button */}
            <Button
              onClick={() => window.location.href = '/campaign/create'}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => {
            const statusConfig = getStatusConfig(campaign.status);
            const returnAmount = campaign.raisedAmount - campaign.targetAmount;
            const isOverfunded = returnAmount > 0;

            return (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                {/* Mobile Layout */}
                <div className="block lg:hidden space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-2 truncate">
                        {campaign.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline">
                          {campaign.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Actions Dropdown */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, 'view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, 'edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Raised</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.raisedAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Goal</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.targetAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {campaign.progressPercentage}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Investors</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {campaign.investorCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-6">
                    {/* Campaign Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2 truncate">
                        {campaign.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline">
                          {campaign.category}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(campaign.createdDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{campaign.milestones.completed}/{campaign.milestones.total} milestones</span>
                        </div>
                        {campaign.status === 'active' && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.daysLeft} days left</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="text-center min-w-[120px]">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Raised</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.raisedAmount)}
                      </p>
                    </div>

                    <div className="text-center min-w-[120px]">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Goal</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(campaign.targetAmount)}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="text-center min-w-[100px]">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progress</p>
                      <div className="flex items-center space-x-1">
                        {isOverfunded ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                        )}
                        <span className={`font-semibold ${
                          isOverfunded ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {campaign.progressPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Investors */}
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Investors</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {campaign.investorCount}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, 'view')}
                        title="View campaign"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, 'edit')}
                        title="Edit campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCampaignAction(campaign.id, 'analytics')}
                        title="View analytics"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Create your first campaign to start fundraising.'
              }
            </p>
            <Button
              onClick={() => window.location.href = '/campaign/create'}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Campaign
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsList;