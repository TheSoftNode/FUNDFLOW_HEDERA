"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Search,
    Filter,
    TrendingUp,
    Users,
    DollarSign,
    Target,
    Calendar,
    MapPin,
    Building,
    Star,
    Eye,
    Heart,
    Share2,
    MessageCircle,
    ArrowUpRight,
    Clock,
    TrendingDown,
    Zap,
    Award,
    Globe,
    Lightbulb,
    RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';

interface Campaign {
    id: string;
    title: string;
    startupName: string;
    category: string;
    sector: string;
    description: string;
    fundingGoal: number;
    currentRaised: number;
    equityOffered: number;
    minInvestment: number;
    maxInvestment: number;
    location: string;
    founder: string;
    teamSize: number;
    stage: 'idea' | 'mvp' | 'early_traction' | 'growth' | 'scaling';
    riskLevel: 'low' | 'medium' | 'high';
    expectedReturn: number;
    timeline: string;
    tags: string[];
    images: string[];
    pitchDeck: string;
    businessPlan: string;
    financialProjections: string;
    team: {
        name: string;
        role: string;
        experience: string;
        linkedin: string;
    }[];
    milestones: {
        title: string;
        description: string;
        targetDate: string;
        status: 'pending' | 'in_progress' | 'completed';
    }[];
    updates: {
        date: string;
        title: string;
        content: string;
    }[];
    investors: {
        name: string;
        amount: number;
        date: string;
    }[];
    createdAt: string;
    endDate: string;
    daysLeft: number;
    trending: boolean;
    featured: boolean;
}

const mockCampaigns: Campaign[] = [
    {
        id: '1',
        title: 'AI-Powered Mental Health Platform',
        startupName: 'MindfulAI',
        category: 'HealthTech',
        sector: 'Mental Health',
        description: 'Revolutionary AI platform that provides personalized mental health support through natural language processing and machine learning algorithms.',
        fundingGoal: 500000,
        currentRaised: 320000,
        equityOffered: 15,
        minInvestment: 1000,
        maxInvestment: 50000,
        location: 'San Francisco, CA',
        founder: 'Dr. Sarah Chen',
        teamSize: 8,
        stage: 'early_traction',
        riskLevel: 'medium',
        expectedReturn: 35,
        timeline: '18-24 months',
        tags: ['AI/ML', 'Mental Health', 'SaaS', 'B2B'],
        images: ['/api/placeholder/400/300'],
        pitchDeck: '/api/placeholder/document',
        businessPlan: '/api/placeholder/document',
        financialProjections: '/api/placeholder/document',
        team: [
            {
                name: 'Dr. Sarah Chen',
                role: 'CEO & Co-Founder',
                experience: 'PhD in Clinical Psychology, 10+ years in mental health',
                linkedin: 'https://linkedin.com/in/sarahchen'
            }
        ],
        milestones: [
            {
                title: 'MVP Development',
                description: 'Complete core AI algorithm development',
                targetDate: '2024-06-01',
                status: 'completed'
            },
            {
                title: 'Beta Testing',
                description: 'Launch beta version with 100 users',
                targetDate: '2024-08-01',
                status: 'in_progress'
            }
        ],
        updates: [
            {
                date: '2024-01-15',
                title: 'AI Algorithm Milestone Reached',
                content: 'Successfully completed the core AI algorithm development ahead of schedule.'
            }
        ],
        investors: [
            {
                name: 'Angel Investor 1',
                amount: 50000,
                date: '2024-01-10'
            }
        ],
        createdAt: '2024-01-01',
        endDate: '2024-03-31',
        daysLeft: 45,
        trending: true,
        featured: true
    },
    {
        id: '2',
        title: 'Sustainable Smart Home Energy System',
        startupName: 'EcoHome Tech',
        category: 'CleanTech',
        sector: 'Smart Home',
        description: 'Intelligent home energy management system that optimizes renewable energy usage and reduces carbon footprint.',
        fundingGoal: 750000,
        currentRaised: 180000,
        equityOffered: 20,
        minInvestment: 500,
        maxInvestment: 25000,
        location: 'Austin, TX',
        founder: 'Michael Rodriguez',
        teamSize: 12,
        stage: 'mvp',
        riskLevel: 'high',
        expectedReturn: 45,
        timeline: '24-36 months',
        tags: ['Clean Energy', 'IoT', 'Smart Home', 'Sustainability'],
        images: ['/api/placeholder/400/300'],
        pitchDeck: '/api/placeholder/document',
        businessPlan: '/api/placeholder/document',
        financialProjections: '/api/placeholder/document',
        team: [
            {
                name: 'Michael Rodriguez',
                role: 'CEO & Founder',
                experience: 'MS in Electrical Engineering, 8+ years in IoT',
                linkedin: 'https://linkedin.com/in/michaelrodriguez'
            }
        ],
        milestones: [
            {
                title: 'Prototype Development',
                description: 'Complete working prototype of the energy system',
                targetDate: '2024-05-01',
                status: 'in_progress'
            }
        ],
        updates: [
            {
                date: '2024-01-20',
                title: 'Prototype Testing Begins',
                content: 'Started testing the energy management system prototype in our lab environment.'
            }
        ],
        investors: [],
        createdAt: '2024-01-15',
        endDate: '2024-04-15',
        daysLeft: 60,
        trending: false,
        featured: false
    },
    {
        id: '3',
        title: 'Blockchain-Based Supply Chain Platform',
        startupName: 'ChainLink Solutions',
        category: 'Blockchain',
        sector: 'Supply Chain',
        description: 'Transparent and secure supply chain management platform using blockchain technology for real-time tracking and verification.',
        fundingGoal: 1000000,
        currentRaised: 650000,
        equityOffered: 18,
        minInvestment: 2000,
        maxInvestment: 100000,
        location: 'New York, NY',
        founder: 'Alex Kim',
        teamSize: 15,
        stage: 'growth',
        riskLevel: 'medium',
        expectedReturn: 40,
        timeline: '12-18 months',
        tags: ['Blockchain', 'Supply Chain', 'B2B', 'Enterprise'],
        images: ['/api/placeholder/400/300'],
        pitchDeck: '/api/placeholder/document',
        businessPlan: '/api/placeholder/document',
        financialProjections: '/api/placeholder/document',
        team: [
            {
                name: 'Alex Kim',
                role: 'CEO & Co-Founder',
                experience: 'MS in Computer Science, 12+ years in blockchain',
                linkedin: 'https://linkedin.com/in/alexkim'
            }
        ],
        milestones: [
            {
                title: 'Platform Launch',
                description: 'Launch the main platform with 3 major clients',
                targetDate: '2024-07-01',
                status: 'pending'
            }
        ],
        updates: [
            {
                date: '2024-01-25',
                title: 'Major Partnership Secured',
                content: 'Secured partnership with a Fortune 500 company for pilot testing.'
            }
        ],
        investors: [
            {
                name: 'VC Fund 1',
                amount: 300000,
                date: '2024-01-20'
            }
        ],
        createdAt: '2023-12-01',
        endDate: '2024-05-01',
        daysLeft: 75,
        trending: true,
        featured: true
    }
];

const DiscoverPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('discover');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStage, setSelectedStage] = useState('all');
    const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [sortBy, setSortBy] = useState('trending');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredCampaigns = mockCampaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
        const matchesStage = selectedStage === 'all' || campaign.stage === selectedStage;
        const matchesRiskLevel = selectedRiskLevel === 'all' || campaign.riskLevel === selectedRiskLevel;
        const matchesLocation = selectedLocation === 'all' || campaign.location.includes(selectedLocation);

        return matchesSearch && matchesCategory && matchesStage && matchesRiskLevel && matchesLocation;
    });

    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        switch (sortBy) {
            case 'trending':
                return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
            case 'funding':
                return b.currentRaised - a.currentRaised;
            case 'deadline':
                return a.daysLeft - b.daysLeft;
            case 'return':
                return b.expectedReturn - a.expectedReturn;
            default:
                return 0;
        }
    });

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'idea': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
            case 'mvp': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'early_traction': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'growth': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
            case 'scaling': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getRiskLevelColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const totalCampaigns = mockCampaigns.length;
    const totalFundingGoal = mockCampaigns.reduce((sum, c) => sum + c.fundingGoal, 0);
    const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.currentRaised, 0);
    const avgExpectedReturn = mockCampaigns.reduce((sum, c) => sum + c.expectedReturn, 0) / mockCampaigns.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
            <InvestorSidebar
                isCollapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                userName="John Doe"
                userRole="Professional Investor"
            />
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
                {/* Main Content */}
                <main className="pt-10 p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                    Discover Opportunities
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Browse and discover promising startup investment opportunities
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                                    {viewMode === 'grid' ? 'List View' : 'Grid View'}
                                </Button>
                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Advanced Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Discovery Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Active Campaigns
                                </CardTitle>
                                <Target className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalCampaigns}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Available for investment
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Funding Goal
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalFundingGoal)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Combined funding targets
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Raised
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalRaised)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {((totalRaised / totalFundingGoal) * 100).toFixed(1)}% of goal
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Avg. Expected Return
                                </CardTitle>
                                <Zap className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {avgExpectedReturn.toFixed(1)}%
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Annual return projection
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                                {/* Search */}
                                <div className="relative lg:col-span-2">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search campaigns, startups, or sectors..."
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
                                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                                        <SelectItem value="CleanTech">CleanTech</SelectItem>
                                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                                        <SelectItem value="FinTech">FinTech</SelectItem>
                                        <SelectItem value="EdTech">EdTech</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Stage Filter */}
                                <Select value={selectedStage} onValueChange={setSelectedStage}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Stages" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Stages</SelectItem>
                                        <SelectItem value="idea">Idea Stage</SelectItem>
                                        <SelectItem value="mvp">MVP</SelectItem>
                                        <SelectItem value="early_traction">Early Traction</SelectItem>
                                        <SelectItem value="growth">Growth</SelectItem>
                                        <SelectItem value="scaling">Scaling</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Risk Level Filter */}
                                <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Risk Levels" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Risk Levels</SelectItem>
                                        <SelectItem value="low">Low Risk</SelectItem>
                                        <SelectItem value="medium">Medium Risk</SelectItem>
                                        <SelectItem value="high">High Risk</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Sort by */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trending">Trending</SelectItem>
                                        <SelectItem value="funding">Funding Progress</SelectItem>
                                        <SelectItem value="deadline">Deadline</SelectItem>
                                        <SelectItem value="return">Expected Return</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Campaigns Grid/List */}
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                        {sortedCampaigns.map((campaign) => (
                            <Card key={campaign.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-6">
                                    {/* Campaign Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                {campaign.trending && (
                                                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        Trending
                                                    </Badge>
                                                )}
                                                {campaign.featured && (
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                                        <Star className="w-3 h-3 mr-1" />
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2">
                                                {campaign.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                {campaign.startupName}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-600">
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Campaign Description */}
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                                        {campaign.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {campaign.tags.slice(0, 3).map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {campaign.tags.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{campaign.tags.length - 3} more
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Funding Progress */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {formatCurrency(campaign.currentRaised)} raised
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {getProgressPercentage(campaign.currentRaised, campaign.fundingGoal).toFixed(1)}%
                                            </span>
                                        </div>
                                        <Progress value={getProgressPercentage(campaign.currentRaised, campaign.fundingGoal)} className="h-2" />
                                        <div className="flex items-center justify-between mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            <span>Goal: {formatCurrency(campaign.fundingGoal)}</span>
                                            <span>{campaign.daysLeft} days left</span>
                                        </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {campaign.equityOffered}%
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Equity
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {campaign.expectedReturn}%
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Return
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(campaign.minInvestment)}
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Min Invest
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badges */}
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Badge className={getStageColor(campaign.stage)}>
                                            {campaign.stage.replace('_', ' ').charAt(0).toUpperCase() + campaign.stage.replace('_', ' ').slice(1)}
                                        </Badge>
                                        <Badge className={getRiskLevelColor(campaign.riskLevel)}>
                                            {campaign.riskLevel.charAt(0).toUpperCase() + campaign.riskLevel.slice(1)} Risk
                                        </Badge>
                                    </div>

                                    {/* Location and Team */}
                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {campaign.location}
                                        </span>
                                        <span className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            {campaign.teamSize} team members
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center space-x-3">
                                        <Button variant="outline" className="flex-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                        <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            Invest Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {sortedCampaigns.length === 0 && (
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardContent className="p-12 text-center">
                                <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    No campaigns found
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-4">
                                    {searchTerm || selectedCategory !== 'all' || selectedStage !== 'all' || selectedRiskLevel !== 'all'
                                        ? 'Try adjusting your filters or search terms.'
                                        : 'No investment opportunities are currently available.'
                                    }
                                </p>
                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DiscoverPage;
