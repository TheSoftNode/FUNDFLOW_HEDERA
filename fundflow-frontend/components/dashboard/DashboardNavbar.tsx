"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  Menu,
  X,
  Home,
  TrendingUp,
  Rocket,
  Settings,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '../shared/themes/ThemeToggle';
import Logo from '../shared/logo/Logo';
import ConnectWalletButton from '../shared/wallet/ConnectWalletButton';

const DashboardNavbar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isConnected, disconnectWallet } = useAuth();

  const dashboardLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Investments', href: '/dashboard/investments', icon: TrendingUp },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Rocket },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleDisconnect = () => {
    disconnectWallet();
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/30 shadow-lg shadow-gray-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {dashboardLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-3">
              {isConnected && user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {user.role === 'startup' ? 'Startup' : 'Investor'} Dashboard
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <ConnectWalletButton />
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Dashboard Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isConnected && user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3">
                          <User className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{user.role === 'startup' ? 'Startup' : 'Investor'} Dashboard</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.walletAddress?.slice(0, 6)}...{user.walletAddress?.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={handleDisconnect}
                          className="w-full justify-start text-red-600 dark:text-red-400"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Disconnect Wallet
                        </Button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <ConnectWalletButton />
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 