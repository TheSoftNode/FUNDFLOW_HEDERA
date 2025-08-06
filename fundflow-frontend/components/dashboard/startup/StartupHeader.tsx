"use client";

import React from 'react';
import { Bell, Download, Settings, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StartupHeaderProps {
  onNotificationClick: () => void;
  onExportClick: () => void;
}

const StartupHeader: React.FC<StartupHeaderProps> = ({
  onNotificationClick,
  onExportClick
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side - Greeting */}
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Good morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Sarah</span>! 👋
          </h1>
          <div className="flex items-center space-x-2 mt-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">{currentDate}</p>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Create Campaign Button */}
          <Button
            onClick={() => window.location.href = '/campaign/create'}
            className="bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">New</span>
          </Button>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={onNotificationClick}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-10 relative"
            title="View notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportClick}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-10"
            title="Export campaign data"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Settings panel coming soon!')}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 h-10"
            title="Open settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Raised</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">$185,000</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Campaigns</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">2</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Investors</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">89</p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">85%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupHeader;