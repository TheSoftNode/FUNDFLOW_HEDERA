"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  X,
  Bell,
  LogOut,
  User,
  Wallet,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '../shared/themes/ThemeToggle';
import Logo from '../shared/logo/Logo';

interface DashboardNavbarProps {
  sidebarCollapsed?: boolean;
}

const DashboardNavbar = ({ sidebarCollapsed = false }: DashboardNavbarProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isConnected, disconnectWallet } = useAuth();
  const router = useRouter();

  const handleDisconnect = () => {
    disconnectWallet();
    router.push('/');
  };

  const handleSettings = () => {
    const role = user?.role;
    if (role === 'startup') {
      router.push('/dashboard/startup/settings');
    } else if (role === 'investor') {
      router.push('/dashboard/investor/settings');
    }
  };

  return (
    <nav className={`fixed top-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-900/10 transition-all duration-300 ${
      sidebarCollapsed ? 'left-16 lg:left-16' : 'left-64 lg:left-64'
    }`}>
      <div className="flex justify-between items-center h-16 px-6">
        {/* Left Side - Logo (hidden on mobile) */}
        <div className="hidden lg:flex items-center">
          <Logo size="sm" />
        </div>

        {/* Right Side - User Menu & Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {isConnected && user ? (
              <>
                {/* Settings Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSettings}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                {/* User Info */}
                <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.profile?.name || 'User'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {user.role === 'startup' ? 'Startup Founder' : 'Investor'}
                    </div>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                    {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                  </span>
                </div>

                {/* Disconnect Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center space-x-2">
                  <Logo size="sm" />
                  <span className="text-lg font-semibold">Dashboard Menu</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* User Section */}
                {isConnected && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {user.profile?.name || 'User'}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {user.role === 'startup' ? 'Startup Founder' : 'Investor'}
                        </div>
                        <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                          {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={handleSettings}
                      className="w-full justify-start text-slate-600 dark:text-slate-300"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={handleDisconnect}
                      className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Disconnect Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="p-3">
                    <Button
                      onClick={() => router.push('/')}
                      variant="outline"
                      className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 