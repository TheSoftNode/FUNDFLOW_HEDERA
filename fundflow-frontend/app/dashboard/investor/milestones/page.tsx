"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Target,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Users,
    Calendar,
    Eye,
    Vote,
    MessageSquare,
    ArrowUpRight,
    Filter,
    Search,
    RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';

interface Milestone {
    id: string;
    campaignTitle: string;
    startupName: string;
    title: string;
    description: string;
    targetDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    progress: number;
    category: string;
    investmentAmount: number;
    equityTokens: number;
    founder: string;
    teamSize: number;
    location: string;
    sector: string;
    requiresVote: boolean;
    voteDeadline: string;
    totalVotes: number;
    approvedVotes: number;
    rejectedVotes: number;
    myVote: 'approved' | 'rejected' | null;
    canVote: boolean;
    updates: {
        date: string;
        title: string;
        content: string;
        author: string;
    }[];
    attachments: {
        name: string;
        type: string;
        url: string;
    }[];
}

const mockMilestones: Milestone[] = [
    {
        id: '1',
        campaignTitle: 'AI-Powered Healthcare Assistant',
        startupName: 'MindfulAI',
        title: 'MVP Development Complete',
        description: 'Complete core AI algorithm development and basic user interface for mental health assessment.',
        targetDate: '2024-06-01',
        status: 'completed',
        progress: 100,
        category: 'Development',
        investmentAmount: 25000,
        equityTokens: 250,
        founder: 'Dr. Sarah Chen',
        teamSize: 8,
        location: 'San Francisco, CA',
        sector: 'HealthTech',
        requiresVote: false,
        voteDeadline: '',
        totalVotes: 0,
        approvedVotes: 0,
        rejectedVotes: 0,
        myVote: null,
        canVote: false,
        updates: [
            {
                date: '2024-01-15',
                title: 'MVP Development Milestone Reached',
                content: 'Successfully completed the core AI algorithm development ahead of schedule.',
                author: 'Dr. Sarah Chen'
            }
        ],
        attachments: [
            {
                name: 'MVP Demo Video',
                type: 'video',
                url: '/api/placeholder/video'
            },
            {
                name: 'Technical Documentation',
                type: 'pdf',
                url: '/api/placeholder/document'
            }
        ]
    },
    {
        id: '2',
        campaignTitle: 'Sustainable Energy Storage',
        startupName: 'GreenPower Technologies',
        title: 'Prototype Testing Phase',
        description: 'Complete working prototype of the energy management system and begin testing in lab environment.',
        targetDate: '2024-05-01',
        status: 'in_progress',
        progress: 75,
        category: 'Testing',
        investmentAmount: 15000,
        equityTokens: 150,
        founder: 'Michael Torres',
        teamSize: 12,
        location: 'Austin, TX',
        sector: 'CleanTech',
        requiresVote: true,
        voteDeadline: '2024-04-15',
        totalVotes: 5,
        approvedVotes: 4,
        rejectedVotes: 1,
        myVote: 'approved',
        canVote: false,
        updates: [
            {
                date: '2024-01-20',
                title: 'Prototype Testing Begins',
                content: 'Started testing the energy management system prototype in our lab environment.',
                author: 'Michael Torres'
            }
        ],
        attachments: [
            {
                name: 'Test Results Report',
                type: 'pdf',
                url: '/api/placeholder/document'
            }
        ]
    },
    {
        id: '3',
        campaignTitle: 'Blockchain Supply Chain Platform',
        startupName: 'ChainLink Solutions',
        title: 'Platform Launch',
        description: 'Launch the main platform with 3 major clients and begin onboarding process.',
        targetDate: '2024-07-01',
        status: 'pending',
        progress: 30,
        category: 'Launch',
        investmentAmount: 30000,
        equityTokens: 300,
        founder: 'Alex Kim',
        teamSize: 15,
        location: 'New York, NY',
        sector: 'Blockchain',
        requiresVote: true,
        voteDeadline: '2024-06-15',
        totalVotes: 3,
        approvedVotes: 2,
        rejectedVotes: 0,
        myVote: null,
        canVote: true,
        updates: [
            {
                date: '2024-01-25',
                title: 'Major Partnership Secured',
                content: 'Secured partnership with a Fortune 500 company for pilot testing.',
                author: 'Alex Kim'
            }
        ],
        attachments: [
            {
                name: 'Partnership Agreement',
                type: 'pdf',
                url: '/api/placeholder/document'
            }
        ]
    }
];

const MilestonesPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('milestones');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const handleVote = (milestoneId: string, vote: 'approved' | 'rejected') => {
        // Handle voting logic here
        console.log(`Voted ${vote} for milestone ${milestoneId}`);
    };

    const filteredMilestones = mockMilestones.filter(milestone => {
        const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            milestone.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            milestone.startupName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || milestone.status === selectedStatus;
        const matchesCategory = selectedCategory === 'all' || milestone.category === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'in_progress': return <TrendingUp className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'overdue': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
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

    const getDaysUntilDeadline = (dateString: string) => {
        const today = new Date();
        const deadline = new Date(dateString);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const totalMilestones = mockMilestones.length;
    const completedMilestones = mockMilestones.filter(m => m.status === 'completed').length;
    const pendingVotes = mockMilestones.filter(m => m.requiresVote && m.canVote).length;
    const overdueMilestones = mockMilestones.filter(m => m.status === 'overdue').length;

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
                                    Milestones & Progress
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Track startup progress and vote on milestone achievements
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                                <Button variant="outline" size="sm">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Milestone Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Milestones
                                </CardTitle>
                                <Target className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalMilestones}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Across all investments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Completed
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedMilestones}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {((completedMilestones / totalMilestones) * 100).toFixed(1)}% success rate
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Pending Votes
                                </CardTitle>
                                <Vote className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{pendingVotes}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Require your attention
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Overdue
                                </CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{overdueMilestones}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Behind schedule
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
                                    <input
                                        type="text"
                                        placeholder="Search milestones..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                                    />
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                </select>

                                {/* Category Filter */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Development">Development</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Launch">Launch</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Milestones List */}
                    <div className="space-y-6">
                        {filteredMilestones.map((milestone) => (
                            <Card key={milestone.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-6">
                                    {/* Milestone Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <Badge className={getStatusColor(milestone.status)}>
                                                    {getStatusIcon(milestone.status)}
                                                    <span className="ml-1">
                                                        {milestone.status.replace('_', ' ').charAt(0).toUpperCase() + milestone.status.replace('_', ' ').slice(1)}
                                                    </span>
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {milestone.category}
                                                </Badge>
                                                {milestone.requiresVote && (
                                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                                                        <Vote className="w-3 h-3 mr-1" />
                                                        Vote Required
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                {milestone.campaignTitle} • {milestone.startupName}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-green-600">
                                                <MessageSquare className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Milestone Description */}
                                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                        {milestone.description}
                                    </p>

                                    {/* Progress and Timeline */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                Progress: {milestone.progress}%
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                Target: {formatDate(milestone.targetDate)}
                                            </span>
                                        </div>
                                        <Progress value={milestone.progress} className="h-2" />
                                    </div>

                                    {/* Investment Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(milestone.investmentAmount)}
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Investment
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {milestone.equityTokens}
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Equity Tokens
                                            </div>
                                        </div>
                                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                {milestone.teamSize}
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                Team Size
                                            </div>
                                        </div>
                                    </div>

                                    {/* Voting Section */}
                                    {milestone.requiresVote && (
                                        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-slate-900 dark:text-white">Voting Required</h4>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Deadline: {formatDate(milestone.voteDeadline)}
                                                    {milestone.voteDeadline && (
                                                        <span className="ml-2 font-medium">
                                                            ({getDaysUntilDeadline(milestone.voteDeadline)} days)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        Total Votes: {milestone.totalVotes}
                                                    </span>
                                                    <span className="text-green-600 dark:text-green-400">
                                                        Approved: {milestone.approvedVotes}
                                                    </span>
                                                    <span className="text-red-600 dark:text-red-400">
                                                        Rejected: {milestone.rejectedVotes}
                                                    </span>
                                                </div>
                                                {milestone.myVote && (
                                                    <Badge className={milestone.myVote === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                        You voted: {milestone.myVote}
                                                    </Badge>
                                                )}
                                            </div>

                                            {milestone.canVote && (
                                                <div className="flex items-center space-x-3">
                                                    <Button
                                                        onClick={() => handleVote(milestone.id, 'approved')}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleVote(milestone.id, 'rejected')}
                                                        variant="outline"
                                                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                                    >
                                                        <AlertCircle className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Updates and Attachments */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">Recent Updates:</span>
                                            <div className="mt-2 space-y-2">
                                                {milestone.updates.slice(0, 2).map((update, index) => (
                                                    <div key={index} className="p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-xs">
                                                        <div className="font-medium text-slate-900 dark:text-white">{update.title}</div>
                                                        <div className="text-slate-500 dark:text-slate-400">{update.content}</div>
                                                        <div className="text-slate-400 dark:text-slate-500 mt-1">
                                                            {update.author} • {formatDate(update.date)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">Attachments:</span>
                                            <div className="mt-2 space-y-2">
                                                {milestone.attachments.map((attachment, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full justify-start text-xs"
                                                    >
                                                        <Eye className="w-3 h-3 mr-2" />
                                                        {attachment.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {milestone.founder}
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {formatDate(milestone.targetDate)}
                                                </span>
                                            </div>
                                            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                View Details
                                                <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredMilestones.length === 0 && (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-12 text-center">
                                    <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No milestones found
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                                        {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
                                            ? 'Try adjusting your filters or search terms.'
                                            : 'No milestones are currently available.'
                                        }
                                    </p>
                                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
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

export default MilestonesPage;
