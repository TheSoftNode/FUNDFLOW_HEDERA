"use client";

import React from 'react';
import { 
  BarChart3, 
  FolderOpen, 
  Users, 
  Target,
  CreditCard,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  User,
  Plus,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  isActive: boolean;
  badge?: number;
}

interface StartupSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (itemId: string) => void;
  userName: string;
  userRole: string;
}

const StartupSidebar: React.FC<StartupSidebarProps> = ({
  isCollapsed,
  onToggle,
  activeItem,
  onItemClick,
  userName,
  userRole
}) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      isActive: activeItem === 'dashboard'
    },
    {
      id: 'campaigns',
      label: 'My Campaigns',
      icon: FolderOpen,
      isActive: activeItem === 'campaigns'
    },
    {
      id: 'investors',
      label: 'Investors',
      icon: Users,
      isActive: activeItem === 'investors'
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: Target,
      isActive: activeItem === 'milestones',
      badge: 2
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      isActive: activeItem === 'analytics'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      isActive: activeItem === 'payments'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      isActive: activeItem === 'notifications',
      badge: 3
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      isActive: activeItem === 'settings'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      isActive: activeItem === 'help'
    }
  ];

  const handleItemClick = (itemId: string) => {
    onItemClick(itemId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024 && !isCollapsed) {
      onToggle();
    }
  };

  const renderNavItem = (item: SidebarItem) => (
    <button
      key={item.id}
      onClick={() => handleItemClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
        item.isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-300'
      } ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
    >
      <item.icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
      
      {!isCollapsed && (
        <>
          <span className="font-medium text-sm truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-14 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {item.label}
          {item.badge && (
            <span className="ml-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed 
          ? '-translate-x-full lg:translate-x-0 lg:w-16' 
          : 'translate-x-0 w-64 lg:w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SF</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Startup Dashboard
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your campaigns
                </p>
              </div>
            </div>
          )}
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Desktop toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 hidden lg:block"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'hidden lg:block' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {userRole}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </>
            )}
          </div>
        </div>

        {/* Quick Action */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Button 
              onClick={() => window.location.href = '/campaign/create'}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map(renderNavItem)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button className={`w-full flex items-center px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ${
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          }`}>
            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default StartupSidebar;