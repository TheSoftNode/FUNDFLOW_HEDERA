"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    PieChart,
    Activity,
    Target,
    Calendar,
    Users,
    Globe,
    Zap,
    Shield,
    Award,
    Clock,
    ArrowUpRight,
    RefreshCw,
    Download,
    Filter,
    Eye,
    LineChart,
    PieChart as PieChartIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface PortfolioMetrics {
    totalInvested: number;
    currentValue: number;
    totalReturn: number;
    returnPercentage: number;
    monthlyReturn: number;
    annualizedReturn: number;
    riskScore: number;
    diversificationScore: number;
    liquidityScore: number;
    activeInvestments: number;
    completedInvestments: number;
    avgInvestmentSize: number;
    portfolioAge: number;
}

interface PerformanceData {
    month: string;
    invested: number;
    value: number;
    return: number;
    returnPercentage: number;
}

interface SectorAllocation {
    sector: string;
    amount: number;
    percentage: number;
    return: number;
    returnPercentage: number;
}

interface RiskAnalysis {
    riskLevel: 'low' | 'medium' | 'high';
    count: number;
    percentage: number;
    totalValue: number;
    avgReturn: number;
}

const mockPortfolioMetrics: PortfolioMetrics = {
    totalInvested: 125000,
    currentValue: 156000,
    totalReturn: 31000,
    returnPercentage: 24.8,
    monthlyReturn: 8.2,
    annualizedReturn: 32.5,
    riskScore: 6.5,
    diversificationScore: 8.2,
    liquidityScore: 7.8,
    activeInvestments: 8,
    completedInvestments: 3,
    avgInvestmentSize: 15625,
    portfolioAge: 18
};

const mockPerformanceData: PerformanceData[] = [
    { month: 'Jan', invested: 125000, value: 128000, return: 3000, returnPercentage: 2.4 },
    { month: 'Feb', invested: 125000, value: 132000, return: 7000, returnPercentage: 5.6 },
    { month: 'Mar', invested: 125000, value: 138000, return: 13000, returnPercentage: 10.4 },
    { month: 'Apr', invested: 125000, value: 142000, return: 17000, returnPercentage: 13.6 },
    { month: 'May', invested: 125000, value: 148000, return: 23000, returnPercentage: 18.4 },
    { month: 'Jun', invested: 125000, value: 156000, return: 31000, returnPercentage: 24.8 }
];

const mockSectorAllocation: SectorAllocation[] = [
    { sector: 'HealthTech', amount: 45000, percentage: 36, return: 12000, returnPercentage: 26.7 },
    { sector: 'CleanTech', amount: 30000, percentage: 24, return: 7500, returnPercentage: 25.0 },
    { sector: 'Blockchain', amount: 25000, percentage: 20, return: 8000, returnPercentage: 32.0 },
    { sector: 'AgTech', amount: 15000, percentage: 12, return: 2500, returnPercentage: 16.7 },
    { sector: 'DeepTech', amount: 10000, percentage: 8, return: 1000, returnPercentage: 10.0 }
];

const mockRiskAnalysis: RiskAnalysis[] = [
    { riskLevel: 'low', count: 2, percentage: 25, totalValue: 35000, avgReturn: 28.5 },
    { riskLevel: 'medium', count: 4, percentage: 50, totalValue: 65000, avgReturn: 24.2 },
    { riskLevel: 'high', count: 2, percentage: 25, totalValue: 25000, avgReturn: 18.8 }
];

const AnalyticsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('analytics');
    const [timeRange, setTimeRange] = useState('6m');
    const [selectedMetric, setSelectedMetric] = useState('return');

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 dark:text-green-400';
        if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        return 'Needs Improvement';
    };

    return (
        <>
            <DashboardNavbar dashboardType="investor" />
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
                    <main className="pt-16 p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        Portfolio Analytics
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Track your investment performance and portfolio insights
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Select value={timeRange} onValueChange={setTimeRange}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1m">1 Month</SelectItem>
                                            <SelectItem value="3m">3 Months</SelectItem>
                                            <SelectItem value="6m">6 Months</SelectItem>
                                            <SelectItem value="1y">1 Year</SelectItem>
                                            <SelectItem value="all">All Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Report
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Key Performance Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Total Return
                                    </CardTitle>
                                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(mockPortfolioMetrics.totalReturn)}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        +{mockPortfolioMetrics.returnPercentage}% overall
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Current Value
                                    </CardTitle>
                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(mockPortfolioMetrics.currentValue)}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Portfolio valuation
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Monthly Return
                                    </CardTitle>
                                    <Activity className="h-4 w-4 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {mockPortfolioMetrics.monthlyReturn}%
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        This month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        Annualized Return
                                    </CardTitle>
                                    <Zap className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {mockPortfolioMetrics.annualizedReturn}%
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Projected annual
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Portfolio Health Scores */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Risk Score</CardTitle>
                                    <CardDescription>Portfolio risk assessment</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(mockPortfolioMetrics.riskScore)}`}>
                                            {mockPortfolioMetrics.riskScore}/10
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            {getScoreLabel(mockPortfolioMetrics.riskScore)}
                                        </p>
                                        <Progress value={mockPortfolioMetrics.riskScore * 10} className="h-2" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            Lower is better
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Diversification</CardTitle>
                                    <CardDescription>Portfolio spread across sectors</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(mockPortfolioMetrics.diversificationScore)}`}>
                                            {mockPortfolioMetrics.diversificationScore}/10
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            {getScoreLabel(mockPortfolioMetrics.diversificationScore)}
                                        </p>
                                        <Progress value={mockPortfolioMetrics.diversificationScore * 10} className="h-2" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            Higher is better
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Liquidity</CardTitle>
                                    <CardDescription>Ability to exit investments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className={`text-4xl font-bold mb-2 ${getScoreColor(mockPortfolioMetrics.liquidityScore)}`}>
                                            {mockPortfolioMetrics.liquidityScore}/10
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            {getScoreLabel(mockPortfolioMetrics.liquidityScore)}
                                        </p>
                                        <Progress value={mockPortfolioMetrics.liquidityScore * 10} className="h-2" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            Higher is better
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Chart and Sector Allocation */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                            {/* Performance Chart */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Portfolio Performance</CardTitle>
                                    <CardDescription>Monthly performance over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockPerformanceData.map((data, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-600 dark:text-slate-400">{data.month}</span>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            Value: {formatCurrency(data.value)}
                                                        </span>
                                                        <span className={`font-medium ${data.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {data.return >= 0 ? '+' : ''}{formatCurrency(data.return)} ({data.returnPercentage}%)
                                                        </span>
                                                    </div>
                                                </div>
                                                <Progress
                                                    value={Math.abs(data.returnPercentage) * 4}
                                                    className="h-2"
                                                    style={{
                                                        backgroundColor: data.return >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Sector Allocation */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Sector Allocation</CardTitle>
                                    <CardDescription>Portfolio distribution by sector</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockSectorAllocation.map((sector, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-slate-900 dark:text-white">{sector.sector}</span>
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        {formatCurrency(sector.amount)} ({sector.percentage}%)
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                    <span>Return: {formatCurrency(sector.return)}</span>
                                                    <span className={`font-medium ${sector.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {sector.returnPercentage}%
                                                    </span>
                                                </div>
                                                <Progress value={sector.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Risk Analysis and Investment Summary */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                            {/* Risk Analysis */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Risk Analysis</CardTitle>
                                    <CardDescription>Portfolio risk distribution</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {mockRiskAnalysis.map((risk, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <Badge className={getRiskColor(risk.riskLevel)}>
                                                        {risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)} Risk
                                                    </Badge>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {risk.count} investments
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {formatCurrency(risk.totalValue)}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        {risk.avgReturn}% avg return
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Investment Summary */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg">Investment Summary</CardTitle>
                                    <CardDescription>Portfolio overview</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {mockPortfolioMetrics.activeInvestments}
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                                    Active Investments
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                                    {mockPortfolioMetrics.completedInvestments}
                                                </div>
                                                <div className="text-xs text-slate-600 dark:text-slate-400">
                                                    Completed
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Average Investment Size</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {formatCurrency(mockPortfolioMetrics.avgInvestmentSize)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Portfolio Age</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {mockPortfolioMetrics.portfolioAge} months
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">Total Invested</span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                                                    {formatCurrency(mockPortfolioMetrics.totalInvested)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Insights and Recommendations */}
                        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-lg">Portfolio Insights</CardTitle>
                                <CardDescription>AI-powered recommendations and insights</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                                            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Strong Performance</h4>
                                        </div>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                            Your portfolio is outperforming the market average by 15.2%. Consider increasing positions in high-performing sectors.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">Risk Management</h4>
                                        </div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Your risk score of 6.5/10 is well-balanced. Consider diversifying into emerging markets for growth opportunities.
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Target className="w-5 h-5 text-purple-600" />
                                            <h4 className="font-semibold text-purple-800 dark:text-purple-200">Next Steps</h4>
                                        </div>
                                        <p className="text-sm text-purple-700 dark:text-purple-300">
                                            HealthTech and CleanTech sectors show strong momentum. Consider additional investments in these areas.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AnalyticsPage;
