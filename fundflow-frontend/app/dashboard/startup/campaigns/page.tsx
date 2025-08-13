"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
    Target,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    Plus,
    Edit,
    Trash2,
    Eye,
    Share2,
    TrendingUp,
    Award,
    Users,
    DollarSign,
    BarChart3,
    Search,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Campaign {
    id: string;
    title: string;
    description: string;
    category: string;
    status: 'draft' | 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
    fundingGoal: number;
    currentRaised: number;
    investors: number;
    daysLeft: number;
    startDate: string;
    endDate: string;
    tags: string[];
    image: string;
    videoUrl?: string;
    milestones: number;
    completedMilestones: number;
    createdAt: string;
    updatedAt: string;
}

const mockCampaigns: Campaign[] = [
    {
        id: '1',
        title: 'AI Healthcare Platform',
        description: 'Revolutionary AI-powered healthcare platform that provides personalized treatment recommendations and early disease detection.',
        category: 'Healthcare',
        status: 'active',
        fundingGoal: 250000,
        currentRaised: 187500,
        investors: 23,
        daysLeft: 15,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-02-15T00:00:00Z',
        tags: ['AI/ML', 'Healthcare', 'Innovation'],
        image: '/api/placeholder/400/200',
        milestones: 5,
        completedMilestones: 3,
        createdAt: '2023-12-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    },
    {
        id: '2',
        title: 'Sustainable Energy Storage',
        description: 'Next-generation energy storage solution using advanced battery technology for renewable energy integration.',
        category: 'Clean Energy',
        status: 'active',
        fundingGoal: 200000,
        currentRaised: 90000,
        investors: 18,
        daysLeft: 28,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-03-01T00:00:00Z',
        tags: ['Clean Energy', 'Sustainability', 'Technology'],
        image: '/api/placeholder/400/200',
        milestones: 4,
        completedMilestones: 1,
        createdAt: '2023-12-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    },
    {
        id: '3',
        title: 'EdTech Learning Platform',
        description: 'Interactive learning platform that adapts to individual student needs using AI and gamification.',
        category: 'Education',
        status: 'draft',
        fundingGoal: 150000,
        currentRaised: 0,
        investors: 0,
        daysLeft: 60,
        startDate: '2024-03-01T00:00:00Z',
        endDate: '2024-05-01T00:00:00Z',
        tags: ['EdTech', 'AI/ML', 'Education'],
        image: '/api/placeholder/400/200',
        milestones: 3,
        completedMilestones: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    },
    {
        id: '4',
        title: 'Smart Home Security System',
        description: 'AI-powered home security system with facial recognition and smart monitoring capabilities.',
        category: 'Technology',
        status: 'pending',
        fundingGoal: 100000,
        currentRaised: 0,
        investors: 0,
        daysLeft: 45,
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-04-01T00:00:00Z',
        tags: ['IoT', 'Security', 'Smart Home'],
        image: '/api/placeholder/400/200',
        milestones: 4,
        completedMilestones: 0,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
    }
];

const CampaignsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('campaigns');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredCampaigns = mockCampaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
        const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'draft': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'draft': return <Edit className="w-5 h-5 text-slate-600" />;
            case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'paused': return <AlertCircle className="w-5 h-5 text-orange-600" />;
            case 'completed': return <CheckCircle className="w-5 h-5 text-blue-600" />;
            case 'cancelled': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Target className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-blue-500';
        if (percentage >= 40) return 'bg-yellow-500';
        if (percentage >= 20) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const totalCampaigns = mockCampaigns.length;
    const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;
    const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.currentRaised, 0);
    const totalGoal = mockCampaigns.reduce((sum, c) => sum + c.fundingGoal, 0);
    const totalInvestors = mockCampaigns.reduce((sum, c) => sum + c.investors, 0);

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
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                Campaigns
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Manage your fundraising campaigns and track their progress
                            </p>
                        </div>
                        <Button onClick={() => router.push('/dashboard/startup/campaigns/create')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <Plus className="w-5 h-5 mr-2" />
                            Create Campaign
                        </Button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Campaigns
                                </CardTitle>
                                <Target className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalCampaigns}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {activeCampaigns} active
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
                                    {formatCurrency(totalRaised)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    of {formatCurrency(totalGoal)} goal
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
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalInvestors}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Across all campaigns
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Success Rate
                                </CardTitle>
                                <Award className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0}%
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Funding progress
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search campaigns..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Status Filter */}
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Category Filter */}
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Clean Energy">Clean Energy</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                                        <SelectItem value="Fintech">Fintech</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Campaigns Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <Card key={campaign.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            {getStatusIcon(campaign.status)}
                                            <div>
                                                <CardTitle className="text-xl text-slate-900 dark:text-white">
                                                    {campaign.title}
                                                </CardTitle>
                                                <CardDescription className="text-slate-600 dark:text-slate-400">
                                                    {campaign.category}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(campaign.status)}>
                                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                        </Badge>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                                        {campaign.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Funding Progress</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {getProgressPercentage(campaign.currentRaised, campaign.fundingGoal).toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={getProgressPercentage(campaign.currentRaised, campaign.fundingGoal)}
                                            className="h-2"
                                        />
                                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            <span>{formatCurrency(campaign.currentRaised)} raised</span>
                                            <span>{formatCurrency(campaign.fundingGoal)} goal</span>
                                        </div>
                                    </div>

                                    {/* Campaign Stats */}
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {campaign.investors}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                Investors
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {campaign.daysLeft}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                Days Left
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {campaign.completedMilestones}/{campaign.milestones}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                Milestones
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {campaign.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                        <span>Started: {formatDate(campaign.startDate)}</span>
                                        <span>Ends: {formatDate(campaign.endDate)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/startup/campaigns/${campaign.id}`)}
                                            className="flex-1"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/dashboard/startup/campaigns/${campaign.id}/edit`)}
                                            className="flex-1"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-slate-400 hover:text-blue-600"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredCampaigns.length === 0 && (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl lg:col-span-2">
                                <CardContent className="p-12 text-center">
                                    <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No campaigns found
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                                        {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                                            ? 'Try adjusting your filters or search terms.'
                                            : 'No campaigns have been created yet.'
                                        }
                                    </p>
                                    <Button onClick={() => router.push('/dashboard/startup/campaigns/create')}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Campaign
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CampaignsPage;
