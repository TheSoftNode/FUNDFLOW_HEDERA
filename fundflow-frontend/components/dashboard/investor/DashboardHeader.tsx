"use client";

import React, { useState } from 'react';
import { Bell, Download, Settings, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
  userName?: string;
  totalPortfolioValue: number;
  onNotificationClick?: () => void;
  onExportClick?: () => void;
  onSettingsClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Investor',
  totalPortfolioValue,
  onNotificationClick,
  onExportClick,
  onSettingsClick
}) => {
  const [showMobileActions, setShowMobileActions] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-6 lg:mb-8">
      {/* Main Header */}
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Left Section - Welcome & Portfolio Value */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}
            </h1>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-2">
            <h2 className="text-lg lg:text-xl text-gray-600 dark:text-gray-300">
              Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 font-semibold">Dashboard</span>
            </h2>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
              {currentDate} • {currentTime}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
              Portfolio Value: <span className="font-bold text-lg lg:text-xl text-gray-900 dark:text-white">{formatCurrency(totalPortfolioValue)}</span>
            </p>
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 mt-1 sm:mt-0">
              <span className="text-sm font-semibold">+24.8%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">this month</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-start lg:space-x-4">
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block lg:w-80 xl:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search investments, campaigns..."
                className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10"
              />
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportClick}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-10"
              title="Export portfolio data"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Settings panel coming soon!')}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-10"
              title="Open settings"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              onClick={onNotificationClick}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white h-10 relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>

          {/* Mobile Actions Toggle */}
          <div className="lg:hidden flex items-center justify-between">
            <Button
              onClick={onNotificationClick}
              className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white relative"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowMobileActions(!showMobileActions)}
              className="border-gray-200 dark:border-gray-700"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search & Actions */}
      <div className="lg:hidden mt-4 space-y-3">
        {/* Search Bar - Mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search investments, campaigns..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Mobile Actions Dropdown */}
        {showMobileActions && (
          <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportClick}
              className="flex-1 min-w-0"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="flex-1 min-w-0"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        )}
      </div>

      {/* Quick Stats Bar - Mobile */}
      <div className="lg:hidden mt-4 p-3 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Investments</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">8</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Return</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">+24.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;