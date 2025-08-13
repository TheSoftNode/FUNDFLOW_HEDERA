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
    },
    {
        id: '5',
        type: 'info',
        title: 'New Investor Interest',
        message: 'Sarah Johnson has shown interest in your sustainable energy project.',
        timestamp: '2024-01-14T11:30:00Z',
        isRead: false,
        category: 'investment',
        priority: 'medium',
        actionUrl: '/dashboard/startup/investors',
        actionText: 'View Profile'
    },
    {
        id: '6',
        type: 'warning',
        title: 'Milestone Deadline Approaching',
        message: 'Your Q1 milestone is due in 3 days. Please update progress.',
        timestamp: '2024-01-14T09:15:00Z',
        isRead: false,
        category: 'milestone',
        priority: 'high',
        actionUrl: '/dashboard/startup/milestones',
        actionText: 'Update Progress'
    }
];

const NotificationsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('notifications');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredNotifications = mockNotifications.filter(notification => {
        const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
        const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
        const matchesReadStatus = !showUnreadOnly || !notification.isRead;

        return matchesSearch && matchesCategory && matchesPriority && matchesReadStatus;
    });

    const markAsRead = (id: string) => {
        // In a real app, this would update the backend
        console.log('Marking notification as read:', id);
    };

    const markAllAsRead = () => {
        // In a real app, this would update the backend
        console.log('Marking all notifications as read');
    };

    const deleteNotification = (id: string) => {
        // In a real app, this would update the backend
        console.log('Deleting notification:', id);
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

    const getPriorityBadge = (priority: string) => {
        const variants = {
            low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        };
        return <Badge className={variants[priority as keyof typeof variants]}>{priority}</Badge>;
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            investment: <DollarSign className="w-4 h-4" />,
            milestone: <Target className="w-4 h-4" />,
            campaign: <Star className="w-4 h-4" />,
            system: <Settings className="w-4 h-4" />,
            payment: <DollarSign className="w-4 h-4" />
        };
        return icons[category as keyof typeof icons];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
            <DashboardNavbar />
            <StartupSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                userName="Startup Founder"
                userRole="Startup Founder"
            />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                {/* Main Content */}
                <main className="pt-10 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Notifications
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Stay updated with all your startup activities and important updates.
                        </p>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search notifications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Category Filter */}
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="investment">Investment</SelectItem>
                                        <SelectItem value="milestone">Milestone</SelectItem>
                                        <SelectItem value="campaign">Campaign</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="payment">Payment</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Priority Filter */}
                                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Priorities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                                        className={showUnreadOnly ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                                    >
                                        <Bell className="w-4 h-4 mr-2" />
                                        Unread Only
                                    </Button>
                                    <Button variant="outline" onClick={markAllAsRead}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark All Read
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl transition-all duration-200 hover:shadow-2xl ${notification.isRead
                                    ? 'opacity-75'
                                    : 'ring-2 ring-blue-200 dark:ring-blue-800'
                                    }`}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className={`text-lg font-semibold ${notification.isRead
                                                        ? 'text-slate-700 dark:text-slate-300'
                                                        : 'text-slate-900 dark:text-white'
                                                        }`}>
                                                        {notification.title}
                                                    </h3>
                                                    {getPriorityBadge(notification.priority)}
                                                    <Badge variant="outline" className="flex items-center space-x-1">
                                                        {getCategoryIcon(notification.category)}
                                                        <span className="ml-1 capitalize">{notification.category}</span>
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {new Date(notification.timestamp).toLocaleDateString()}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-slate-400 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <p className={`text-slate-600 dark:text-slate-400 mb-4 ${notification.isRead ? 'text-slate-500' : ''
                                                }`}>
                                                {notification.message}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {!notification.isRead && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Mark as Read
                                                        </Button>
                                                    )}
                                                    {notification.actionUrl && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => router.push(notification.actionUrl!)}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            {notification.actionText || 'View Details'}
                                                            <ArrowUpRight className="w-4 h-4 ml-2" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredNotifications.length === 0 && (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-12 text-center">
                                    <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No notifications found
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                                        {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || showUnreadOnly
                                            ? 'Try adjusting your filters or search terms.'
                                            : 'You\'re all caught up! Check back later for new updates.'
                                        }
                                    </p>
                                    {(searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || showUnreadOnly) && (
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCategory('all');
                                                setSelectedPriority('all');
                                                setShowUnreadOnly(false);
                                            }}
                                        >
                                            Clear All Filters
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default NotificationsPage;
