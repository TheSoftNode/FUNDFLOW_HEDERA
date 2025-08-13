"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    X,
    Search,
    Filter,
    Trash2,
    Settings,
    Mail,
    Users,
    DollarSign,
    Target,
    Calendar,
    Star,
    TrendingUp,
    Plus,
    Eye,
    ArrowUpRight,
    BarChart3,
    FolderOpen,
    Clock,
    Award,
    Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category: 'investment' | 'milestone' | 'campaign' | 'system' | 'payment';
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    actionText?: string;
}

interface DashboardStats {
    totalCampaigns: number;
    activeCampaigns: number;
    totalRaised: number;
    totalInvestors: number;
    monthlyGrowth: number;
    completionRate: number;
    pendingMilestones: number;
    recentInvestments: number;
}

interface RecentCampaign {
    id: string;
    title: string;
    progress: number;
    raised: number;
    target: number;
    daysLeft: number;
    status: 'active' | 'funded' | 'draft';
    category: string;
    investors: number;
}

interface RecentActivity {
    id: string;
    type: 'investment' | 'milestone' | 'campaign' | 'system';
    title: string;
    description: string;
    timestamp: string;
    amount?: number;
    status: 'completed' | 'pending' | 'failed';
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'success',
        title: 'New Investment Received',
        message: 'John Doe has invested $5,000 in your Tech Startup Alpha campaign.',
        timestamp: '2024-01-15T10:30:00Z',
        isRead: false,
        category: 'investment',
        priority: 'high',
        actionUrl: '/dashboard/startup/investors',
        actionText: 'View Details'
    },
    {
        id: '2',
        type: 'info',
        title: 'Milestone Update',
        message: 'Your campaign has reached 75% of the funding goal. Great progress!',
        timestamp: '2024-01-15T09:15:00Z',
        isRead: false,
        category: 'milestone',
        priority: 'medium',
        actionUrl: '/dashboard/startup/milestones',
        actionText: 'View Milestones'
    },
    {
        id: '3',
        type: 'warning',
        title: 'Payment Pending',
        message: 'Investment from Bob Wilson is pending verification. Please review.',
        timestamp: '2024-01-14T16:45:00Z',
        isRead: true,
        category: 'payment',
        priority: 'medium',
        actionUrl: '/dashboard/startup/payments',
        actionText: 'Review Payment'
    },
    {
        id: '4',
        type: 'success',
        title: 'Campaign Approved',
        message: 'Your campaign "Tech Startup Alpha" has been approved and is now live.',
        timestamp: '2024-01-14T14:20:00Z',
        isRead: true,
        category: 'campaign',
        priority: 'high',
        actionUrl: '/dashboard/startup/campaigns',
        actionText: 'View Campaign'
    }
];

const StartupDashboard = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState('dashboard');

    // Mock data - replace with actual API calls
    const [stats, setStats] = useState<DashboardStats>({
        totalCampaigns: 3,
        activeCampaigns: 2,
        totalRaised: 125000,
        totalInvestors: 45,
        monthlyGrowth: 12.5,
        completionRate: 78.5,
        pendingMilestones: 3,
        recentInvestments: 2
    });

    const [recentCampaigns, setRecentCampaigns] = useState<RecentCampaign[]>([
        {
            id: '1',
            title: 'AI Healthcare Platform',
            progress: 75,
            raised: 187500,
            target: 250000,
            daysLeft: 15,
            status: 'active',
            category: 'Healthcare',
            investors: 23
        },
        {
            id: '2',
            title: 'Sustainable Energy Storage',
            progress: 45,
            raised: 90000,
            target: 200000,
            daysLeft: 28,
            status: 'active',
            category: 'Clean Energy',
            investors: 18
        },
        {
            id: '3',
            title: 'EdTech Learning Platform',
            progress: 0,
            raised: 0,
            target: 150000,
            daysLeft: 60,
            status: 'draft',
            category: 'Education',
            investors: 0
        }
    ]);

    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
        {
            id: '1',
            type: 'investment',
            title: 'New Investment',
            description: 'John Doe invested $5,000 in AI Healthcare Platform',
            timestamp: '2024-01-15T10:30:00Z',
            amount: 5000,
            status: 'completed'
        },
        {
            id: '2',
            type: 'milestone',
            title: 'Milestone Achieved',
            description: 'AI Healthcare Platform reached 75% funding goal',
            timestamp: '2024-01-15T09:15:00Z',
            status: 'completed'
        },
        {
            id: '3',
            type: 'campaign',
            title: 'Campaign Launched',
            description: 'Sustainable Energy Storage campaign went live',
            timestamp: '2024-01-14T14:20:00Z',
            status: 'completed'
        }
    ]);

    const handleCreateCampaign = () => {
        router.push('/dashboard/startup/campaigns/create');
    };

    const handleViewCampaign = (campaignId: string) => {
        router.push(`/dashboard/startup/campaigns/${campaignId}`);
    };

    const handleViewAllCampaigns = () => {
        router.push('/dashboard/startup/campaigns');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'funded': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getTypeIcon = (type: string) => {
        const icons = {
            success: <CheckCircle className="w-5 h-5 text-green-600" />,
            warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
            info: <Info className="w-5 h-5 text-blue-600" />,
            error: <AlertCircle className="w-5 h-5 text-red-600" />
        };
        return icons[type as keyof typeof icons];
    };

    const markAsRead = (id: string) => {
        // In a real app, this would update the backend
        console.log('Marking notification as read:', id);
    };

    const markAllAsRead = () => {
        // In a real app, this would update the backend
        console.log('Marking all notifications as read');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
            <DashboardNavbar dashboardType="startup" />
            <StartupSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeItem={activeNavItem}
                onItemClick={setActiveNavItem}
                userName="Startup Founder"
                userRole="Startup Founder"
            />
            <main className="ml-0 lg:ml-64 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Welcome back, Founder! 👋
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Here's what's happening with your startup today.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <Button
                        onClick={handleCreateCampaign}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Campaign
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Campaigns
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalCampaigns}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {stats.activeCampaigns} active
                            </p>
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
                                {formatCurrency(stats.totalRaised)}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                <span className="text-green-600 dark:text-green-400">+{stats.monthlyGrowth}%</span> this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Investors
                            </CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalInvestors}</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Across all campaigns
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Completion Rate
                            </CardTitle>
                            <Target className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completionRate}%</div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Milestone success rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Recent Campaigns - Larger Section */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl text-slate-900 dark:text-white">
                                            Recent Campaigns
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Your latest fundraising efforts
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={handleViewAllCampaigns}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                        View All
                                        <ArrowUpRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentCampaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer"
                                            onClick={() => handleViewCampaign(campaign.id)}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {campaign.title}
                                                    </h3>
                                                    <Badge className={getStatusColor(campaign.status)}>
                                                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {campaign.category}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                    <span>{campaign.progress}% funded</span>
                                                    <span>{campaign.daysLeft} days left</span>
                                                    <span>{campaign.investors} investors</span>
                                                </div>
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between text-sm mb-1">
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            {formatCurrency(campaign.raised)} raised
                                                        </span>
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            of {formatCurrency(campaign.target)}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${campaign.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-400 hover:text-blue-600"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notifications Section - Smaller Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg text-slate-900 dark:text-white">
                                            Recent Notifications
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Stay updated
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {mockNotifications.slice(0, 3).map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 rounded-lg border transition-all duration-200 ${notification.isRead
                                                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                                                : 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-800 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getTypeIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-medium mb-1 ${notification.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                                            {new Date(notification.timestamp).toLocaleDateString()}
                                                        </span>
                                                        {!notification.isRead && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-xs h-6 px-2"
                                                                onClick={() => markAsRead(notification.id)}
                                                            >
                                                                Mark Read
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Recent Activity */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">
                                Recent Activity
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Latest updates from your startup
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                                {activity.type === 'investment' && <DollarSign className="w-4 h-4 text-blue-600" />}
                                                {activity.type === 'milestone' && <Target className="w-4 h-4 text-green-600" />}
                                                {activity.type === 'campaign' && <Star className="w-4 h-4 text-purple-600" />}
                                                {activity.type === 'system' && <Settings className="w-4 h-4 text-slate-600" />}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                                                {activity.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {activity.description}
                                            </p>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(activity.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        {activity.amount && (
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    +{formatCurrency(activity.amount)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 dark:text-white">
                                Quick Actions
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                Manage your startup efficiently
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => router.push('/dashboard/startup/investors')}
                                >
                                    <Users className="w-4 h-4 mr-3" />
                                    View Investors
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => router.push('/dashboard/startup/milestones')}
                                >
                                    <Target className="w-4 h-4 mr-3" />
                                    Track Milestones
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => router.push('/dashboard/startup/analytics')}
                                >
                                    <BarChart3 className="w-4 h-4 mr-3" />
                                    View Analytics
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-12 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    onClick={() => router.push('/dashboard/startup/settings')}
                                >
                                    <Settings className="w-4 h-4 mr-3" />
                                    Account Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default StartupDashboard;
