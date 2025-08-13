"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, TrendingUp, Shield, Users, BarChart3, Briefcase, Zap, ChevronDown, Search, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '../shared/themes/ThemeToggle';
import Logo from '../shared/logo/Logo';
import ConnectWalletButton from '../shared/wallet/ConnectWalletButton';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isConnected } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const platformItems = [
    { name: 'Overview', href: '#platform', icon: TrendingUp, description: 'Platform features & capabilities' },
    { name: 'Analytics', href: '#analytics', icon: BarChart3, description: 'Market insights & data' },
    { name: 'Security', href: '#security', icon: Shield, description: 'Trust & safety measures' },
    { name: 'Community', href: '#community', icon: Users, description: 'Join our network' }
  ];

  const solutionsItems = [
    { name: 'For Startups', href: '#startups', icon: Zap, description: 'Raise funds & grow your business' },
    { name: 'For Investors', href: '#investors', icon: Briefcase, description: 'Discover investment opportunities' }
  ];

  const allNavItems = [...platformItems, ...solutionsItems];

  return (
    <>
      <nav className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/30 shadow-lg shadow-gray-900/5'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/10 dark:border-gray-700/20'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <Logo />
            </Link>

            {/* Desktop Navigation - Clean & Professional */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Platform Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] px-3 py-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Platform</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/50 mb-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Platform Features
                    </p>
                  </div>
                  {platformItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#2F80ED]/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#2F80ED]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#2F80ED] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          {item.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Solutions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] px-3 py-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">Solutions</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/50 mb-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tailored Solutions
                    </p>
                  </div>
                  {solutionsItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-[#7F56D9]/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#7F56D9]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#7F56D9] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          {item.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Campaigns Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] px-3 py-2">
                    <FolderOpen className="w-4 h-4" />
                    <span className="font-medium">Campaigns</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/50 mb-1">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign Actions
                    </p>
                  </div>
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group">
                    <div className="w-8 h-8 bg-[#2F80ED]/10 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-[#2F80ED]" />
                    </div>
                    <div className="flex-1">
                      <a href="/campaign/browse" className="block">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#2F80ED] transition-colors">
                          Browse Campaigns
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          Discover investment opportunities
                        </div>
                      </a>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group">
                    <div className="w-8 h-8 bg-[#7F56D9]/10 rounded-lg flex items-center justify-center">
                      <Plus className="w-4 h-4 text-[#7F56D9]" />
                    </div>
                    <div className="flex-1">
                      <a href="/campaign/create" className="block">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#7F56D9] transition-colors">
                          Create Campaign
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          Launch your fundraising campaign
                        </div>
                      </a>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dashboard Dropdown - Show when wallet is connected */}
              {isConnected && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] px-3 py-2">
                      <span className="font-medium">Dashboards</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-2">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/50 mb-1">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Dashboard Access
                      </p>
                    </div>
                    <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group">
                      <div className="w-8 h-8 bg-[#2F80ED]/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-[#2F80ED]" />
                      </div>
                      <div className="flex-1">
                        <a href="/dashboard/startup" className="block">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#2F80ED] transition-colors">
                            Go to Startup Dashboard
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                            Manage campaigns & milestones
                          </div>
                        </a>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group">
                      <div className="w-8 h-8 bg-[#7F56D9]/10 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#7F56D9]" />
                      </div>
                      <div className="flex-1">
                        <a href="/dashboard/investor" className="block">
                          <div className="font-medium text-gray-900 dark:text-white group-hover:text-[#7F56D9] transition-colors">
                            Go to Investor Dashboard
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                            Track investments & discover opportunities
                          </div>
                        </a>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Right Side - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <ThemeToggle />
              <ConnectWalletButton />
            </div>

            {/* Mobile Controls */}
            <div className="lg:hidden flex items-center space-x-2">
              <ThemeToggle />
              <ConnectWalletButton variant="compact" />

              <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 h-7"
                  >
                    <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-0"
                >
                  <SheetHeader className="text-left p-4 pb-2">
                    <SheetTitle className="flex items-center justify-between">
                      <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
                        <Logo size="sm" />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="px-4 pb-4 space-y-4">
                    {/* All Navigation Items */}
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider px-2">
                        Navigation
                      </h3>
                      <div className="space-y-1">
                        {allNavItems.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-[#2F80ED]/10 transition-colors">
                              <item.icon className="w-3.5 h-3.5 transition-colors group-hover:text-[#2F80ED]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#2F80ED]/70 dark:group-hover:text-[#2F80ED]/70 leading-tight truncate">
                                {item.description}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider px-2">
                        Quick Access
                      </h3>
                      <div className="space-y-1">
                        <a
                          href="/campaign/browse"
                          className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <span className="font-medium text-sm">Browse Campaigns</span>
                        </a>

                        <a
                          href="/campaign/create"
                          className="flex items-center px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                          onClick={() => setIsMobileOpen(false)}
                        >
                          <span className="font-medium text-sm">Create Campaign</span>
                        </a>

                        {/* Dashboard Options - Show when wallet is connected */}
                        {isConnected && (
                          <>
                            <a
                              href="/dashboard/startup"
                              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#2F80ED] dark:hover:text-[#2F80ED] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <div className="w-6 h-6 bg-[#2F80ED]/10 rounded-md flex items-center justify-center group-hover:bg-[#2F80ED]/20 transition-colors">
                                <Zap className="w-3.5 h-3.5 text-[#2F80ED]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">Go to Startup Dashboard</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#2F80ED]/70 dark:group-hover:text-[#2F80ED]/70 leading-tight truncate">
                                  Manage campaigns & milestones
                                </div>
                              </div>
                            </a>
                            <a
                              href="/dashboard/investor"
                              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#7F56D9] dark:hover:text-[#7F56D9] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <div className="w-6 h-6 bg-[#7F56D9]/10 rounded-md flex items-center justify-center group-hover:bg-[#7F56D9]/20 transition-colors">
                                <Briefcase className="w-3.5 h-3.5 text-[#7F56D9]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">Go to Investor Dashboard</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-[#7F56D9]/70 dark:group-hover:text-[#7F56D9]/70 leading-tight truncate">
                                  Track investments & discover opportunities
                                </div>
                              </div>
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-700" />

                    {/* Mobile Connect Wallet */}
                    <div>
                      <ConnectWalletButton className="w-full justify-center" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
