'use client';

import React, { useState } from 'react';
import { Bell, Check, X, Filter, Archive, Trash2, Settings, Eye, EyeOff } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// Mock data for notifications
const mockNotifications = [
    {
        id: 1,
        type: 'investment',
        title: 'New Investment Opportunity',
        message: 'TechFlow AI has launched a new funding round. You\'re invited to participate.',
        timestamp: '2 hours ago',
        isRead: false,
        priority: 'high',
        sender: {
            name: 'TechFlow AI',
            avatar: '/avatars/techflow.jpg',
            type: 'startup'
        },
        action: 'View Campaign',
        metadata: {
            amount: '$500K',
            equity: '5%',
            deadline: '2024-04-15'
        }
    },
    {
        id: 2,
        type: 'milestone',
        title: 'Milestone Update',
        message: 'HealthTech Pro has achieved their Q1 revenue target. Your investment is performing well.',
        timestamp: '4 hours ago',
        isRead: true,
        priority: 'medium',
        sender: {
            name: 'HealthTech Pro',
            avatar: '/avatars/healthtech.jpg',
            type: 'startup'
        },
        action: 'View Details',
        metadata: {
            milestone: 'Q1 Revenue Target',
            status: 'Achieved',
            impact: '+15%'
        }
    },
    {
        id: 3,
        type: 'payment',
        title: 'Dividend Payment',
        message: 'Your dividend payment of $2,450 has been processed and will be credited to your account.',
        timestamp: '1 day ago',
        isRead: true,
        priority: 'medium',
        sender: {
            name: 'FundFlow',
            avatar: '/avatars/fundflow.jpg',
            type: 'platform'
        },
        action: 'View Transaction',
        metadata: {
            amount: '$2,450',
            type: 'Dividend',
            date: '2024-03-10'
        }
    },
    {
        id: 4,
        type: 'community',
        title: 'New Connection Request',
        message: 'Sarah Chen, Angel Investor, would like to connect with you.',
        timestamp: '2 days ago',
        isRead: false,
        priority: 'low',
        sender: {
            name: 'Sarah Chen',
            avatar: '/avatars/sarah.jpg',
            type: 'investor'
        },
        action: 'Accept/Decline',
        metadata: {
            mutualConnections: 12,
            expertise: 'AI/ML, SaaS'
        }
    },
    {
        id: 5,
        type: 'market',
        title: 'Market Update',
        message: 'Sector analysis: AI investments show 23% growth in Q1 2024.',
        timestamp: '3 days ago',
        isRead: true,
        priority: 'low',
        sender: {
            name: 'Market Insights',
            avatar: '/avatars/market.jpg',
            type: 'platform'
        },
        action: 'View Report',
        metadata: {
            growth: '+8.5%',
            period: 'This Month',
            topPerformer: 'TechFlow AI'
        }
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filterType, setFilterType] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterRead, setFilterRead] = useState('all');
    const [showSettings, setShowSettings] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        investment: true,
        milestone: true,
        payment: true,
        community: true,
        market: true,
        reminder: true,
        event: true,
        portfolio: true
    });

    const handleItemClick = (itemId: string) => {
        // Handle navigation item clicks if needed
        console.log('Navigation item clicked:', itemId);
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesType = filterType === 'all' || notification.type === filterType;
        const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
        const matchesRead = filterRead === 'all' ||
            (filterRead === 'read' && notification.isRead) ||
            (filterRead === 'unread' && !notification.isRead);

        return matchesType && matchesPriority && matchesRead;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, isRead: true }))
        );
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const archiveNotification = (id: number) => {
        // In a real app, this would move to archived notifications
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'investment':
                return '💰';
            case 'milestone':
                return '🎯';
            case 'payment':
                return '💳';
            case 'community':
                return '👥';
            case 'market':
                return '📊';
            case 'reminder':
                return '⏰';
            case 'event':
                return '📅';
            case 'portfolio':
                return '📈';
            default:
                return '🔔';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        return timestamp;
    };

    return (
        <>
            <DashboardNavbar dashboardType="investor" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
                <InvestorSidebar
                    isCollapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    activeItem="notifications"
                    onItemClick={handleItemClick}
                    userName="John Doe"
                    userRole="Professional Investor"
                />
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                    {/* Main Content */}
                    <main className="pt-16 p-6">
                        <div className="max-w-6xl mx-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
                                    <p className="text-slate-600 dark:text-slate-400">Stay updated with your investments and platform activities</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="flex items-center space-x-2"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Button>
                                    <Button
                                        onClick={markAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="flex items-center space-x-2"
                                    >
                                        <Check className="h-4 w-4" />
                                        <span>Mark All Read</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            {showSettings && (
                                <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Settings className="h-5 w-5" />
                                            <span>Notification Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(notificationSettings).map(([key, value]) => (
                                                <div key={key} className="flex items-center space-x-3">
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) =>
                                                            setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                                                        }
                                                    />
                                                    <label className="text-sm font-medium capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <Bell className="h-8 w-8 text-blue-600 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-red-600 dark:text-red-400 font-bold">{unreadCount}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Unread</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-green-600 dark:text-green-400 font-bold">{notifications.length - unreadCount}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Read</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length - unreadCount}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-purple-600 dark:text-purple-400 font-bold">5</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">High Priority</p>
                                                <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Filters */}
                            <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Type</label>
                                            <Select value={filterType} onValueChange={setFilterType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Types</SelectItem>
                                                    <SelectItem value="investment">Investment</SelectItem>
                                                    <SelectItem value="milestone">Milestone</SelectItem>
                                                    <SelectItem value="payment">Payment</SelectItem>
                                                    <SelectItem value="community">Community</SelectItem>
                                                    <SelectItem value="market">Market</SelectItem>
                                                    <SelectItem value="reminder">Reminder</SelectItem>
                                                    <SelectItem value="event">Event</SelectItem>
                                                    <SelectItem value="portfolio">Portfolio</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Priority</label>
                                            <Select value={filterPriority} onValueChange={setFilterPriority}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Priorities" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Priorities</SelectItem>
                                                    <SelectItem value="high">High Priority</SelectItem>
                                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                                    <SelectItem value="low">Low Priority</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Status</label>
                                            <Select value={filterRead} onValueChange={setFilterRead}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Notifications" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Notifications</SelectItem>
                                                    <SelectItem value="unread">Unread Only</SelectItem>
                                                    <SelectItem value="read">Read Only</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notifications List */}
                            <div className="space-y-4">
                                {filteredNotifications.map((notification) => (
                                    <Card key={notification.id} className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl ${!notification.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-4">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                                                        <AvatarFallback>
                                                            {notification.sender.name.split(' ').map(n => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {notification.sender.name} • {notification.sender.type}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={getPriorityColor(notification.priority)}>
                                                        {notification.priority}
                                                    </Badge>
                                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                                        {formatTimestamp(notification.timestamp)}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-slate-700 dark:text-slate-300 mb-3">{notification.message}</p>

                                            {/* Metadata */}
                                            {notification.metadata && (
                                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg mb-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(notification.metadata).map(([key, value]) => (
                                                            <div key={key} className="text-sm">
                                                                <span className="font-medium text-slate-600 dark:text-slate-400 capitalize">
                                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                </span>
                                                                <span className="text-slate-900 dark:text-white ml-1">{value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Button size="sm" variant="outline">
                                                        {notification.action}
                                                    </Button>
                                                    {!notification.isRead && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Mark Read
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => archiveNotification(notification.id)}
                                                    >
                                                        <Archive className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {filteredNotifications.length === 0 && (
                                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                        <CardContent className="p-12 text-center">
                                            <Bell className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">No notifications found</h3>
                                            <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or check back later for new updates.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
