"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
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
  Sparkles,
  Briefcase,
  Eye,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  isActive?: boolean;
  badge?: number;
  description?: string;
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
  const router = useRouter();

  const mainNavItems: SidebarItem[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      href: '/dashboard/investor',
      icon: Home, 
      isActive: activeItem === 'dashboard',
      description: 'Portfolio overview'
    },
    { 
      id: 'investments', 
      label: 'Investments', 
      href: '/dashboard/investor/investments',
      icon: DollarSign, 
      isActive: activeItem === 'investments',
      description: 'My investments'
    },
    { 
      id: 'discover', 
      label: 'Discover', 
      href: '/dashboard/investor/discover',
      icon: Search, 
      isActive: activeItem === 'discover',
      description: 'Find opportunities'
    },
    { 
      id: 'milestones', 
      label: 'Milestones', 
      href: '/dashboard/investor/milestones',
      icon: Target, 
      badge: 3, 
      isActive: activeItem === 'milestones',
      description: 'Vote on progress'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      href: '/dashboard/investor/analytics',
      icon: BarChart3, 
      isActive: activeItem === 'analytics',
      description: 'Portfolio performance'
    },
    { 
      id: 'community', 
      label: 'Community', 
      href: '/dashboard/investor/community',
      icon: Users, 
      isActive: activeItem === 'community',
      description: 'Connect with others'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      href: '/dashboard/investor/notifications',
      icon: Bell, 
      badge: 5, 
      isActive: activeItem === 'notifications',
      description: 'Stay updated'
    }
  ];

  const secondaryNavItems: SidebarItem[] = [
    { 
      id: 'reports', 
      label: 'Reports', 
      href: '/dashboard/investor/reports',
      icon: FileText, 
      isActive: activeItem === 'reports',
      description: 'Investment reports'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      href: '/dashboard/investor/profile',
      icon: User, 
      isActive: activeItem === 'profile',
      description: 'Account settings'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      href: '/dashboard/investor/settings',
      icon: Settings, 
      isActive: activeItem === 'settings',
      description: 'Preferences'
    },
    { 
      id: 'help', 
      label: 'Help & Support', 
      href: '/dashboard/investor/help',
      icon: HelpCircle, 
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

  const handleBrowseCampaigns = () => {
    router.push('/campaign/browse');
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
      className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
        item.isActive
          ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-300'
      } ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
    >
      <div className={`p-2 rounded-lg transition-all duration-200 ${
        item.isActive
          ? 'bg-emerald-100 dark:bg-emerald-800/50'
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
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 z-50 flex flex-col shadow-xl ${
        isCollapsed 
          ? '-translate-x-full lg:translate-x-0 lg:w-16' 
          : 'translate-x-0 w-64 lg:w-64'
      }`}>
        
        {/* Header */}
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 flex items-center ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Fund<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Flow</span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Investor Dashboard
                </p>
              </div>
            </div>
          )}
          
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
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 ${isCollapsed ? 'hidden lg:block' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
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
        </div>

        {/* Quick Action */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <Button 
              onClick={handleBrowseCampaigns}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Campaigns
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-2">
            {/* Main Navigation */}
            <div className={`${isCollapsed ? '' : 'mb-6'}`}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
                  Main
                </h3>
              )}
              <nav className="space-y-2">
                {mainNavItems.map(renderNavItem)}
              </nav>
            </div>

            {/* Secondary Navigation */}
            <div>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
                  Account
                </h3>
              )}
              <nav className="space-y-2">
                {secondaryNavItems.map(renderNavItem)}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20">
          {!isCollapsed && (
            <div className="mb-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Portfolio</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Total Value: <span className="font-semibold text-emerald-600 dark:text-emerald-400">$156,000</span>
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                +24.8% this month
              </p>
            </div>
          )}
          
          <button
            onClick={handleDisconnect}
            className={`w-full flex items-center px-3 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
          >
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
              <LogOut className="w-4 h-4" />
            </div>
            {!isCollapsed && <span className="font-medium text-sm ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;