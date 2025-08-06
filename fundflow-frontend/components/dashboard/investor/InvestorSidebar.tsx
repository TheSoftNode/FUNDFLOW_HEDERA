"use client";

import React from 'react';
import { 
  Home, 
  BarChart3, 
  Target, 
  Users, 
  Search, 
  Bell,
  Settings,
  User,
  TrendingUp,
  DollarSign,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: number;
  isActive?: boolean;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (itemId: string) => void;
  userName?: string;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeItem,
  onItemClick,
  userName = "John Doe",
  userRole = "Investor"
}) => {
  const mainNavItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, isActive: activeItem === 'dashboard' },
    { id: 'investments', label: 'Investments', icon: DollarSign, isActive: activeItem === 'investments' },
    { id: 'discover', label: 'Discover', icon: Search, isActive: activeItem === 'discover' },
    { id: 'milestones', label: 'Milestones', icon: Target, badge: 3, isActive: activeItem === 'milestones' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, isActive: activeItem === 'analytics' },
    { id: 'community', label: 'Community', icon: Users, isActive: activeItem === 'community' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5, isActive: activeItem === 'notifications' }
  ];

  const secondaryNavItems: SidebarItem[] = [
    { id: 'reports', label: 'Reports', icon: FileText, isActive: activeItem === 'reports' },
    { id: 'profile', label: 'Profile', icon: User, isActive: activeItem === 'profile' },
    { id: 'settings', label: 'Settings', icon: Settings, isActive: activeItem === 'settings' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, isActive: activeItem === 'help' }
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
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Fund<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Flow</span>
                </h1>
              </div>
            </div>
          )}
          
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-1">
            {/* Main Navigation */}
            <div className={`${isCollapsed ? '' : 'mb-6'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Main
                </h3>
              )}
              <nav className="space-y-1">
                {mainNavItems.map(renderNavItem)}
              </nav>
            </div>

            {/* Secondary Navigation */}
            <div>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-3">
                  Account
                </h3>
              )}
              <nav className="space-y-1">
                {secondaryNavItems.map(renderNavItem)}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Portfolio</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Value: <span className="font-semibold text-green-600 dark:text-green-400">$156,000</span>
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                +24.8% this month
              </p>
            </div>
          )}
          
          <button
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
          >
            <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;