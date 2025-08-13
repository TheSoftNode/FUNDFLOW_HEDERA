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
    DollarSign,
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    Eye,
    BarChart3,
    Filter,
    Search,
    Plus,
    ArrowUpRight,
    Clock,
    CheckCircle,
    AlertCircle,
    Star,
    PieChart,
    Activity,
    Users,
    Building,
    MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';

interface Investment {
    id: string;
    campaignTitle: string;
    startupName: string;
    category: string;
    investedAmount: number;
    currentValue: number;
    equityTokens: number;
    investmentDate: string;
    status: 'active' | 'milestone_pending' | 'completed' | 'at_risk';
    progress: number;
    lastUpdate: string;
    founder: string;
    riskLevel: 'low' | 'medium' | 'high';
    milestones: { completed: number; total: number };
    location: string;
    sector: string;
    expectedExit: string;
    monthlyReturn: number;
    totalReturn: number;
    returnPercentage: number;
}

const mockInvestments: Investment[] = [
    {
        id: '1',
        campaignTitle: 'AI-Powered Healthcare Assistant',
        startupName: 'HealthTech Solutions Inc.',
        category: 'HealthTech',
        investedAmount: 25000,
        currentValue: 32000,
        equityTokens: 250,
        investmentDate: '2024-01-15',
        status: 'active',
        progress: 75,
        lastUpdate: '2 days ago',
        founder: 'Dr. Sarah Chen',
        riskLevel: 'medium',
        milestones: { completed: 3, total: 5 },
        location: 'San Francisco, CA',
        sector: 'Healthcare',
        expectedExit: '2026-2028',
        monthlyReturn: 2.1,
        totalReturn: 7000,
        returnPercentage: 28.0
    },
    {
        id: '2',
        campaignTitle: 'Sustainable Energy Storage',
        startupName: 'GreenPower Technologies',
        category: 'CleanTech',
        investedAmount: 15000,
        currentValue: 18500,
        equityTokens: 150,
        investmentDate: '2024-02-01',
        status: 'milestone_pending',
        progress: 60,
        lastUpdate: '1 week ago',
        founder: 'Michael Torres',
        riskLevel: 'high',
        milestones: { completed: 2, total: 4 },
        location: 'Boston, MA',
        sector: 'Clean Energy',
        expectedExit: '2027-2029',
        monthlyReturn: 1.8,
        totalReturn: 3500,
        returnPercentage: 23.3
    },
    {
        id: '3',
        campaignTitle: 'Decentralized Social Network',
        startupName: 'SocialChain Labs',
        category: 'Blockchain',
        investedAmount: 20000,
        currentValue: 28000,
        equityTokens: 200,
        investmentDate: '2023-12-10',
        status: 'completed',
        progress: 100,
        lastUpdate: '1 month ago',
        founder: 'Alex Kim',
        riskLevel: 'low',
        milestones: { completed: 6, total: 6 },
        location: 'Seattle, WA',
        sector: 'Social Media',
        expectedExit: '2025-2026',
        monthlyReturn: 3.2,
        totalReturn: 8000,
        returnPercentage: 40.0
    },
    {
        id: '4',
        campaignTitle: 'IoT Smart Agriculture Platform',
        startupName: 'AgriTech Innovations',
        category: 'AgTech',
        investedAmount: 12000,
        currentValue: 14500,
        equityTokens: 120,
        investmentDate: '2024-03-01',
        status: 'active',
        progress: 45,
        lastUpdate: '3 days ago',
        founder: 'Maria Rodriguez',
        riskLevel: 'medium',
        milestones: { completed: 1, total: 4 },
        location: 'Austin, TX',
        sector: 'Agriculture',
        expectedExit: '2028-2030',
        monthlyReturn: 1.5,
        totalReturn: 2500,
        returnPercentage: 20.8
    },
    {
        id: '5',
        campaignTitle: 'Quantum Computing Software',
        startupName: 'QuantumSoft Systems',
        category: 'DeepTech',
        investedAmount: 30000,
        currentValue: 35000,
        equityTokens: 300,
        investmentDate: '2023-11-20',
        status: 'milestone_pending',
        progress: 80,
        lastUpdate: '5 days ago',
        founder: 'Dr. James Liu',
        riskLevel: 'high',
        milestones: { completed: 4, total: 5 },
        location: 'New York, NY',
        sector: 'Quantum Computing',
        expectedExit: '2029-2032',
        monthlyReturn: 2.8,
        totalReturn: 5000,
        returnPercentage: 16.7
    }
];

const InvestmentsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('investments');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredInvestments = mockInvestments.filter(investment => {
        const matchesSearch = investment.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investment.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investment.founder.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || investment.status === selectedStatus;
        const matchesCategory = selectedCategory === 'all' || investment.category === selectedCategory;
        const matchesRiskLevel = selectedRiskLevel === 'all' || investment.riskLevel === selectedRiskLevel;

        return matchesSearch && matchesStatus && matchesCategory && matchesRiskLevel;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'milestone_pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
            case 'at_risk': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalInvested = mockInvestments.reduce((sum, i) => sum + i.investedAmount, 0);
    const totalCurrentValue = mockInvestments.reduce((sum, i) => sum + i.currentValue, 0);
    const totalReturn = totalCurrentValue - totalInvested;
    const totalReturnPercentage = (totalReturn / totalInvested) * 100;
    const activeInvestments = mockInvestments.filter(i => i.status === 'active').length;
    const completedInvestments = mockInvestments.filter(i => i.status === 'completed').length;

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
                                    My Investments
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Track your investment portfolio performance and manage your startup investments
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                                    {viewMode === 'list' ? 'Grid View' : 'List View'}
                                </Button>
                                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Investment
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Invested
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalInvested)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Across all investments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Current Value
                                </CardTitle>
                                <BarChart3 className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalCurrentValue)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Portfolio valuation
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Total Return
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {formatCurrency(totalReturn)}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {totalReturnPercentage.toFixed(1)}% return
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Active Investments
                                </CardTitle>
                                <Target className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeInvestments}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Currently active
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
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedInvestments}</div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Exited investments
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search investments..."
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
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="milestone_pending">Milestone Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="at_risk">At Risk</SelectItem>
                                    </SelectContent>
                                </Select>

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
                                        <SelectItem value="AgTech">AgTech</SelectItem>
                                        <SelectItem value="DeepTech">DeepTech</SelectItem>
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
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="return">Highest Return</SelectItem>
                                        <SelectItem value="amount">Investment Amount</SelectItem>
                                        <SelectItem value="progress">Progress</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Investments List */}
                    <div className="space-y-6">
                        {filteredInvestments.map((investment) => (
                            <Card key={investment.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            {/* Startup Logo */}
                                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-semibold text-xl">
                                                {investment.startupName.split(' ').map(n => n[0]).join('')}
                                            </div>

                                            {/* Investment Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                        {investment.campaignTitle}
                                                    </h3>
                                                    <Badge className={getStatusColor(investment.status)}>
                                                        {investment.status.replace('_', ' ').charAt(0).toUpperCase() + investment.status.replace('_', ' ').slice(1)}
                                                    </Badge>
                                                    <Badge className={getRiskLevelColor(investment.riskLevel)}>
                                                        {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)} Risk
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-400 mb-2">
                                                    {investment.startupName} • {investment.category}
                                                </p>
                                                <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                                    <span className="flex items-center">
                                                        <Users className="w-4 h-4 mr-1" />
                                                        {investment.founder}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {investment.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Building className="w-4 h-4 mr-1" />
                                                        {investment.sector}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-green-600">
                                                <BarChart3 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Investment Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(investment.investedAmount)}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Invested Amount
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {formatCurrency(investment.currentValue)}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Current Value
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {investment.returnPercentage.toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Return
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {investment.equityTokens}
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                Equity Tokens
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress and Milestones */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                Progress: {investment.milestones.completed}/{investment.milestones.total} milestones
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {investment.progress}% complete
                                            </span>
                                        </div>
                                        <Progress value={investment.progress} className="h-2" />
                                    </div>

                                    {/* Additional Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">Investment Date:</span>
                                            <p className="text-slate-900 dark:text-white mt-1 font-medium">
                                                {formatDate(investment.investmentDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">Expected Exit:</span>
                                            <p className="text-slate-900 dark:text-white mt-1 font-medium">
                                                {investment.expectedExit}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-slate-600 dark:text-slate-400">Monthly Return:</span>
                                            <p className="text-slate-900 dark:text-white mt-1 font-medium">
                                                {investment.monthlyReturn}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                            <span>Last update: {investment.lastUpdate}</span>
                                            <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                View Details
                                                <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredInvestments.length === 0 && (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-12 text-center">
                                    <DollarSign className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No investments found
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                                        {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedRiskLevel !== 'all'
                                            ? 'Try adjusting your filters or search terms.'
                                            : 'You haven\'t made any investments yet.'
                                        }
                                    </p>
                                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Discover Opportunities
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

export default InvestmentsPage;
