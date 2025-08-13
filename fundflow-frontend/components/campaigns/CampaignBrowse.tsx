"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    Search,
    Filter,
    TrendingUp,
    Users,
    Calendar,
    DollarSign,
    Target,
    Eye,
    Heart,
    Share2,
    Tag,
    Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Campaign {
    id: string;
    title: string;
    description: string;
    category: string;
    industry: string;
    targetAmount: number;
    raisedAmount: number;
    deadline: string;
    creator: {
        name: string;
        company: string;
    };
    tags: string[];
    status: 'active' | 'funded' | 'completed' | 'cancelled';
    investorCount: number;
    progress: number;
    daysLeft: number;
}

const CampaignBrowse = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [sortBy, setSortBy] = useState('trending');

    const categories = ['All', 'Technology', 'Healthcare', 'Finance', 'Gaming', 'Education', 'Other'];
    const industries = ['All', 'AI/ML', 'Blockchain', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'Consumer', 'B2B SaaS'];

    useEffect(() => {
        fetchCampaigns();
    }, []);

    useEffect(() => {
        filterCampaigns();
    }, [campaigns, searchTerm, selectedCategory, selectedIndustry, sortBy]);

    const fetchCampaigns = async () => {
        try {
            // TODO: Replace with actual API call
            const response = await fetch('/api/campaigns');
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data.campaigns || []);
            } else {
                // Mock data for development
                setCampaigns(getMockCampaigns());
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            // Mock data for development
            setCampaigns(getMockCampaigns());
        } finally {
            setIsLoading(false);
        }
    };

    const getMockCampaigns = (): Campaign[] => [
        {
            id: '1',
            title: 'AI-Powered Healthcare Assistant',
            description: 'Revolutionary AI platform for personalized healthcare recommendations and patient monitoring.',
            category: 'Healthcare',
            industry: 'HealthTech',
            targetAmount: 250000,
            raisedAmount: 187500,
            deadline: '2024-12-31',
            creator: { name: 'Dr. Sarah Chen', company: 'MedAI Solutions' },
            tags: ['AI', 'Healthcare', 'Machine Learning'],
            status: 'active',
            investorCount: 45,
            progress: 75,
            daysLeft: 45
        },
        {
            id: '2',
            title: 'Sustainable Energy Storage Platform',
            description: 'Next-generation battery technology for renewable energy storage and grid stabilization.',
            category: 'Technology',
            industry: 'CleanTech',
            targetAmount: 500000,
            raisedAmount: 320000,
            deadline: '2024-11-30',
            creator: { name: 'Michael Torres', company: 'GreenPower Tech' },
            tags: ['Clean Energy', 'Battery', 'Sustainability'],
            status: 'active',
            investorCount: 78,
            progress: 64,
            daysLeft: 30
        },
        {
            id: '3',
            title: 'Decentralized Social Network',
            description: 'Privacy-focused social platform built on blockchain with user-owned data.',
            category: 'Technology',
            industry: 'Blockchain',
            targetAmount: 300000,
            raisedAmount: 300000,
            deadline: '2024-10-15',
            creator: { name: 'Alex Kim', company: 'SocialChain' },
            tags: ['Blockchain', 'Social Media', 'Privacy'],
            status: 'funded',
            investorCount: 120,
            progress: 100,
            daysLeft: 0
        }
    ];

    const filterCampaigns = () => {
        let filtered = [...campaigns];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(campaign =>
                campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(campaign => campaign.category === selectedCategory);
        }

        // Industry filter
        if (selectedIndustry && selectedIndustry !== 'All') {
            filtered = filtered.filter(campaign => campaign.industry === selectedIndustry);
        }

        // Sort campaigns
        switch (sortBy) {
            case 'trending':
                filtered.sort((a, b) => b.investorCount - a.investorCount);
                break;
            case 'deadline':
                filtered.sort((a, b) => a.daysLeft - b.daysLeft);
                break;
            case 'progress':
                filtered.sort((a, b) => b.progress - a.progress);
                break;
            case 'amount':
                filtered.sort((a, b) => b.targetAmount - a.targetAmount);
                break;
            default:
                break;
        }

        setFilteredCampaigns(filtered);
    };

    const handleCampaignClick = (campaignId: string) => {
        router.push(`/campaign/${campaignId}`);
    };

    const handleInvestClick = (campaignId: string) => {
        router.push(`/campaign/${campaignId}/invest`);
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
            case 'completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search campaigns..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Industry Filter */}
                    <div>
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                            <SelectTrigger>
                                <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sort by:</span>
                        <div className="flex space-x-2">
                            {[
                                { key: 'trending', label: 'Trending', icon: TrendingUp },
                                { key: 'deadline', label: 'Deadline', icon: Calendar },
                                { key: 'progress', label: 'Progress', icon: Target },
                                { key: 'amount', label: 'Amount', icon: DollarSign }
                            ].map((option) => (
                                <Button
                                    key={option.key}
                                    variant={sortBy === option.key ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSortBy(option.key)}
                                    className="flex items-center space-x-2"
                                >
                                    <option.icon className="w-4 h-4" />
                                    <span>{option.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-400">
                        {filteredCampaigns.length} campaigns found
                    </div>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        onClick={() => handleCampaignClick(campaign.id)}
                    >
                        {/* Campaign Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {campaign.title}
                                </h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="secondary" className="text-xs">
                                        {campaign.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {campaign.industry}
                                    </Badge>
                                </div>
                            </div>
                            <Badge className={getStatusColor(campaign.status)}>
                                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3">
                            {campaign.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                <span className="font-semibold text-slate-900 dark:text-white">{campaign.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${campaign.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Campaign Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(campaign.raisedAmount)}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Raised</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {campaign.investorCount}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Investors</div>
                            </div>
                        </div>

                        {/* Creator Info */}
                        <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {campaign.creator.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {campaign.creator.company}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {campaign.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {campaign.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{campaign.tags.length - 3}
                                </Badge>
                            )}
                        </div>

                        {/* Campaign Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Deadline passed'}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle like
                                    }}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <Heart className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle share
                                    }}
                                    className="text-slate-400 hover:text-blue-500"
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInvestClick(campaign.id);
                                    }}
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                                >
                                    Invest
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredCampaigns.length === 0 && !isLoading && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No campaigns found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Try adjusting your search criteria or filters
                    </p>
                    <Button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                            setSelectedIndustry('');
                        }}
                        variant="outline"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CampaignBrowse;
