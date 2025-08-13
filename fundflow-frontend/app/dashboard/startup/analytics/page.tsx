"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface AnalyticsData {
  period: string;
  visitors: number;
  pageViews: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  fundingProgress: number;
  newInvestors: number;
  totalRaised: number;
  campaignShares: number;
  emailOpens: number;
  emailClicks: number;
}

interface CampaignPerformance {
  id: string;
  title: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  avgTimeOnPage: number;
  fundingProgress: number;
  daysLeft: number;
}

interface TrafficSource {
  source: string;
  visitors: number;
  conversionRate: number;
  avgOrderValue: number;
  percentage: number;
}

const mockAnalyticsData: AnalyticsData[] = [
  {
    period: 'Last 7 days',
    visitors: 1247,
    pageViews: 3892,
    conversionRate: 3.2,
    avgSessionDuration: 245,
    bounceRate: 42.1,
    fundingProgress: 78.5,
    newInvestors: 12,
    totalRaised: 187500,
    campaignShares: 89,
    emailOpens: 234,
    emailClicks: 67
  },
  {
    period: 'Last 30 days',
    visitors: 5234,
    pageViews: 15678,
    conversionRate: 2.8,
    avgSessionDuration: 218,
    bounceRate: 45.3,
    fundingProgress: 78.5,
    newInvestors: 45,
    totalRaised: 187500,
    campaignShares: 342,
    emailOpens: 987,
    emailClicks: 234
  }
];

const mockCampaignPerformance: CampaignPerformance[] = [
  {
    id: '1',
    title: 'AI Healthcare Platform',
    visitors: 847,
    conversions: 23,
    conversionRate: 2.7,
    avgTimeOnPage: 312,
    fundingProgress: 75,
    daysLeft: 15
  },
  {
    id: '2',
    title: 'Sustainable Energy Storage',
    visitors: 623,
    conversions: 18,
    conversionRate: 2.9,
    avgTimeOnPage: 289,
    fundingProgress: 45,
    daysLeft: 28
  },
  {
    id: '3',
    title: 'EdTech Learning Platform',
    visitors: 234,
    conversions: 5,
    conversionRate: 2.1,
    avgTimeOnPage: 198,
    fundingProgress: 0,
    daysLeft: 60
  }
];

const mockTrafficSources: TrafficSource[] = [
  {
    source: 'Direct',
    visitors: 523,
    conversionRate: 4.2,
    avgOrderValue: 8500,
    percentage: 42
  },
  {
    source: 'Organic Search',
    visitors: 389,
    conversionRate: 2.8,
    avgOrderValue: 7200,
    percentage: 31
  },
  {
    source: 'Social Media',
    visitors: 234,
    conversionRate: 1.9,
    avgOrderValue: 5800,
    percentage: 19
  },
  {
    source: 'Referral',
    visitors: 101,
    conversionRate: 3.1,
    avgOrderValue: 9100,
    percentage: 8
  }
];

const AnalyticsPage = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('analytics');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const handleItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
  };

  const currentData = mockAnalyticsData[0]; // Last 7 days
  const previousData = mockAnalyticsData[1]; // Last 30 days

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
      <DashboardNavbar />
      <StartupSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNavItem}
        onItemClick={handleItemClick}
        userName="Startup Founder"
        userRole="Startup Founder"
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Main Content */}
        <div className="transition-all duration-300">
          {/* Dashboard Content */}
          <main className="pt-10 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your campaign performance and investor engagement metrics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Visitors
                  </CardTitle>
                  <Eye className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatNumber(currentData.visitors)}
                  </div>
                  <div className="flex items-center text-xs">
                    {calculateChange(currentData.visitors, previousData.visitors) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={calculateChange(currentData.visitors, previousData.visitors) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(calculateChange(currentData.visitors, previousData.visitors)).toFixed(1)}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Conversion Rate
                  </CardTitle>
                  <Target className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentData.conversionRate}%
                  </div>
                  <div className="flex items-center text-xs">
                    {calculateChange(currentData.conversionRate, previousData.conversionRate) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={calculateChange(currentData.conversionRate, previousData.conversionRate) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(calculateChange(currentData.conversionRate, previousData.conversionRate)).toFixed(1)}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    New Investors
                  </CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentData.newInvestors}
                  </div>
                  <div className="flex items-center text-xs">
                    {calculateChange(currentData.newInvestors, previousData.newInvestors) >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                    )}
                    <span className={calculateChange(currentData.newInvestors, previousData.newInvestors) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(calculateChange(currentData.newInvestors, previousData.newInvestors)).toFixed(1)}%
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1">vs last period</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Raised
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatCurrency(currentData.totalRaised)}
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {currentData.fundingProgress}% of goal
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Campaign Performance
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Individual campaign metrics and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCampaignPerformance.map((campaign) => (
                      <div key={campaign.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {campaign.title}
                          </h3>
                          <Badge variant="outline">
                            {campaign.daysLeft} days left
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Visitors:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">
                              {formatNumber(campaign.visitors)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Conversions:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">
                              {campaign.conversions}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Conv. Rate:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">
                              {campaign.conversionRate}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Avg. Time:</span>
                            <span className="ml-2 font-medium text-slate-900 dark:text-white">
                              {formatTime(campaign.avgTimeOnPage)}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400">
                              Funding Progress: {campaign.fundingProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${campaign.fundingProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Traffic Sources
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Where your visitors are coming from
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTrafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {source.source}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {source.visitors} visitors ({source.percentage}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {source.conversionRate}%
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatCurrency(source.avgOrderValue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Page Views</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatNumber(currentData.pageViews)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Avg. Session</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {formatTime(currentData.avgSessionDuration)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Bounce Rate</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {currentData.bounceRate}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    Marketing Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Campaign Shares</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {currentData.campaignShares}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Email Opens</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {currentData.emailOpens}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Email Clicks</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {currentData.emailClicks}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PieChart className="w-4 h-4 mr-2" />
                    Custom Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Real-time Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
