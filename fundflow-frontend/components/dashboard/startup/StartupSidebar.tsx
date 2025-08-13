"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  isActive: boolean;
  badge?: number;
  description?: string;
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
  const router = useRouter();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      href: '/dashboard/startup',
      isActive: activeItem === 'dashboard',
      description: 'Overview and analytics'
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: FolderOpen,
      href: '/dashboard/startup/campaigns',
      isActive: activeItem === 'campaigns',
      badge: 3,
      description: 'Manage your campaigns'
    },
    {
      id: 'investors',
      label: 'Investors',
      icon: Users,
      href: '/dashboard/startup/investors',
      isActive: activeItem === 'investors',
      description: 'View and manage investors'
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: Target,
      href: '/dashboard/startup/milestones',
      isActive: activeItem === 'milestones',
      description: 'Track campaign progress'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/startup/analytics',
      isActive: activeItem === 'analytics',
      description: 'Performance insights'
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      href: '/dashboard/startup/payments',
      isActive: activeItem === 'payments',
      description: 'Financial transactions'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/dashboard/startup/notifications',
      isActive: activeItem === 'notifications',
      description: 'Stay updated'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/startup/settings',
      isActive: activeItem === 'settings',
      description: 'Account configuration'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      href: '/dashboard/startup/help',
      isActive: activeItem === 'help',
      description: 'Get assistance'
    }
  ];

  const handleItemClick = (item: SidebarItem) => {
    onItemClick(item.id);
    router.push(item.href);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024 && !isCollapsed) {
      onToggle();
    }
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/startup/campaigns/create');
    if (window.innerWidth < 1024 && !isCollapsed) {
      onToggle();
    }
  };

  const handleDisconnect = () => {
    // TODO: Implement disconnect logic
    router.push('/');
  };

  const renderNavItem = (item: SidebarItem) => (
    <button
      key={item.id}
      onClick={() => handleItemClick(item)}
      className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${item.isActive
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300'
        } ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
    >
      <div className={`p-2 rounded-lg transition-all duration-200 ${item.isActive
        ? 'bg-blue-100 dark:bg-blue-800/50'
        : 'bg-slate-100 dark:bg-slate-800/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/50'
        }`}>
        <item.icon className="w-4 h-4" />
      </div>

      {!isCollapsed && (
        <div className="flex-1 ml-3 text-left">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{item.label}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {item.badge}
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {item.description}
            </p>
          )}
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-14 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
          <div className="font-medium">{item.label}</div>
          {item.description && (
            <div className="text-slate-300 mt-1">{item.description}</div>
          )}
          {item.badge && (
            <Badge variant="destructive" className="mt-2 text-xs">
              {item.badge}
            </Badge>
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
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-50 flex flex-col shadow-xl ${isCollapsed
        ? '-translate-x-full lg:translate-x-0 lg:w-16'
        : 'translate-x-0 w-64 lg:w-64'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Startup Dashboard
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
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
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Desktop toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Profile */}
        {/* <div className={`p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 ${isCollapsed ? 'hidden lg:block' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {userRole}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
              </>
            )}
          </div>
        </div> */}

        {/* Quick Action */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <Button
              onClick={handleCreateCampaign}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-2">
            {sidebarItems.map(renderNavItem)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
          <button
            onClick={handleDisconnect}
            className={`w-full flex items-center px-3 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${isCollapsed ? 'justify-center px-2' : 'justify-start'
              }`}
          >
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
              <LogOut className="w-4 h-4" />
            </div>
            {!isCollapsed && <span className="font-medium text-sm ml-3">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default StartupSidebar;