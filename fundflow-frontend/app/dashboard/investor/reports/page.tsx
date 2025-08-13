'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart, Filter, Eye, Printer } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Mock data for reports
const mockReports = [
    {
        id: 1,
        title: 'Q1 2024 Portfolio Performance Report',
        type: 'performance',
        period: 'Q1 2024',
        generatedDate: '2024-04-01',
        status: 'ready',
        size: '2.4 MB',
        format: 'PDF',
        description: 'Comprehensive analysis of your portfolio performance, including returns, risk metrics, and sector allocation.',
        metrics: {
            totalReturn: '+12.5%',
            benchmarkReturn: '+8.2%',
            riskScore: 'Medium',
            topPerformer: 'TechFlow AI (+45%)',
            worstPerformer: 'HealthTech Pro (-8%)'
        },
        sections: ['Executive Summary', 'Performance Analysis', 'Risk Assessment', 'Sector Breakdown', 'Recommendations']
    },
    {
        id: 2,
        title: 'Annual Tax Report 2023',
        type: 'tax',
        period: '2023',
        generatedDate: '2024-01-31',
        status: 'ready',
        size: '1.8 MB',
        format: 'PDF',
        description: 'Complete tax documentation for your investment activities, including capital gains, dividends, and losses.',
        metrics: {
            totalGains: '$45,230',
            totalLosses: '$12,450',
            netGain: '$32,780',
            dividends: '$8,920',
            taxLiability: '$6,890'
        },
        sections: ['Income Summary', 'Capital Gains', 'Dividend Income', 'Losses', 'Tax Calculations']
    },
    {
        id: 3,
        title: 'Investment Due Diligence Report',
        type: 'due_diligence',
        period: 'Current',
        generatedDate: '2024-03-28',
        status: 'ready',
        size: '3.2 MB',
        format: 'PDF',
        description: 'Detailed analysis of potential investment opportunities with risk assessment and market analysis.',
        metrics: {
            opportunities: 12,
            highRisk: 3,
            mediumRisk: 6,
            lowRisk: 3,
            recommended: 4
        },
        sections: ['Market Overview', 'Opportunity Analysis', 'Risk Assessment', 'Financial Projections', 'Recommendations']
    },
    {
        id: 4,
        title: 'Monthly Portfolio Update - March 2024',
        type: 'monthly',
        period: 'March 2024',
        generatedDate: '2024-04-01',
        status: 'ready',
        size: '1.5 MB',
        format: 'PDF',
        description: 'Monthly snapshot of your portfolio performance, recent transactions, and market insights.',
        metrics: {
            monthlyReturn: '+2.8%',
            newInvestments: 2,
            exits: 1,
            cashFlow: '+$15,400',
            portfolioValue: '$2.45M'
        },
        sections: ['Monthly Summary', 'Performance Metrics', 'Transaction Log', 'Market Update', 'Outlook']
    },
    {
        id: 5,
        title: 'Sector Analysis Report',
        type: 'sector',
        period: 'Q1 2024',
        generatedDate: '2024-04-01',
        status: 'generating',
        size: 'N/A',
        format: 'PDF',
        description: 'Deep dive into sector performance and allocation analysis across your investment portfolio.',
        metrics: {
            sectors: 8,
            topSector: 'Technology (+18%)',
            bottomSector: 'Healthcare (-3%)',
            diversification: 'High',
            rebalanceNeeded: 'No'
        },
        sections: ['Sector Overview', 'Performance Analysis', 'Allocation Review', 'Trend Analysis', 'Action Items']
    },
    {
        id: 6,
        title: 'Risk Management Report',
        type: 'risk',
        period: 'Q1 2024',
        generatedDate: '2024-04-01',
        status: 'scheduled',
        size: 'N/A',
        format: 'PDF',
        description: 'Comprehensive risk assessment including volatility analysis, correlation metrics, and stress testing.',
        metrics: {
            volatility: '12.5%',
            sharpeRatio: '1.8',
            maxDrawdown: '-8.2%',
            var95: '$45K',
            riskScore: 'Medium'
        },
        sections: ['Risk Metrics', 'Volatility Analysis', 'Correlation Matrix', 'Stress Testing', 'Risk Mitigation']
    }
];

// Mock data for report templates
const mockTemplates = [
    {
        id: 1,
        name: 'Standard Portfolio Report',
        description: 'Comprehensive portfolio overview with performance metrics',
        estimatedTime: '5-10 minutes',
        sections: ['Performance Summary', 'Asset Allocation', 'Risk Metrics', 'Transactions']
    },
    {
        id: 2,
        name: 'Executive Summary Report',
        description: 'High-level overview for stakeholders and advisors',
        estimatedTime: '2-3 minutes',
        sections: ['Key Metrics', 'Performance Highlights', 'Risk Summary', 'Outlook']
    },
    {
        id: 3,
        name: 'Detailed Analysis Report',
        description: 'In-depth analysis with charts and detailed metrics',
        estimatedTime: '15-20 minutes',
        sections: ['Executive Summary', 'Detailed Performance', 'Risk Analysis', 'Sector Breakdown', 'Recommendations']
    },
    {
        id: 4,
        name: 'Tax Preparation Report',
        description: 'Tax-ready documentation for filing season',
        estimatedTime: '3-5 minutes',
        sections: ['Income Summary', 'Capital Gains', 'Dividends', 'Losses', 'Tax Calculations']
    }
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('reports');
    const [filterType, setFilterType] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

    const filteredReports = mockReports.filter(report => {
        const matchesType = !filterType || report.type === filterType;
        const matchesPeriod = !filterPeriod || report.period.includes(filterPeriod);
        const matchesStatus = !filterStatus || report.status === filterStatus;

        return matchesType && matchesPeriod && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'generating':
                return 'bg-yellow-100 text-yellow-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'performance':
                return <TrendingUp className="h-5 w-5 text-blue-600" />;
            case 'tax':
                return <FileText className="h-5 w-5 text-green-600" />;
            case 'due_diligence':
                return <BarChart3 className="h-5 w-5 text-purple-600" />;
            case 'monthly':
                return <Calendar className="h-5 w-5 text-orange-600" />;
            case 'sector':
                return <PieChart className="h-5 w-5 text-indigo-600" />;
            case 'risk':
                return <BarChart3 className="h-5 w-5 text-red-600" />;
            default:
                return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const handleDownload = (report: typeof mockReports[0]) => {
        console.log(`Downloading report: ${report.title}`);
    };

    const handleView = (report: typeof mockReports[0]) => {
        setSelectedReport(report);
    };

    const handlePrint = (report: typeof mockReports[0]) => {
        console.log(`Printing report: ${report.title}`);
    };

    const handleGenerateReport = (template: typeof mockTemplates[0]) => {
        console.log(`Generating report using template: ${template.name}`);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <InvestorSidebar
                activeItem="reports"
                isCollapsed={false}
                onToggle={() => { }}
                onItemClick={() => { }}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
                            <p className="text-gray-600">Generate, view, and download comprehensive investment reports and analytics</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Reports</p>
                                            <p className="text-2xl font-bold text-gray-900">{mockReports.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-green-600 font-bold">
                                                {mockReports.filter(r => r.status === 'ready').length}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Ready</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {mockReports.filter(r => r.status === 'ready').length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-yellow-600 font-bold">
                                                {mockReports.filter(r => r.status === 'generating').length}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Generating</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {mockReports.filter(r => r.status === 'generating').length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-blue-600 font-bold">
                                                {mockTemplates.length}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Templates</p>
                                            <p className="text-2xl font-bold text-gray-900">{mockTemplates.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Available Reports ({mockReports.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'templates'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Report Templates ({mockTemplates.length})
                            </button>
                        </div>

                        {/* Reports Tab */}
                        {activeTab === 'reports' && (
                            <div>
                                {/* Filters */}
                                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <Select value={filterType} onValueChange={setFilterType}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Types" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Types</SelectItem>
                                                    <SelectItem value="performance">Performance</SelectItem>
                                                    <SelectItem value="tax">Tax</SelectItem>
                                                    <SelectItem value="due_diligence">Due Diligence</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="sector">Sector</SelectItem>
                                                    <SelectItem value="risk">Risk</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Periods" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Periods</SelectItem>
                                                    <SelectItem value="2024">2024</SelectItem>
                                                    <SelectItem value="2023">2023</SelectItem>
                                                    <SelectItem value="Q1">Q1</SelectItem>
                                                    <SelectItem value="Q2">Q2</SelectItem>
                                                    <SelectItem value="Q3">Q3</SelectItem>
                                                    <SelectItem value="Q4">Q4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Statuses</SelectItem>
                                                    <SelectItem value="ready">Ready</SelectItem>
                                                    <SelectItem value="generating">Generating</SelectItem>
                                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                                    <SelectItem value="failed">Failed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Filter className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                {filteredReports.length} of {mockReports.length}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Reports Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredReports.map((report) => (
                                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        {getTypeIcon(report.type)}
                                                        <div>
                                                            <CardTitle className="text-lg">{report.title}</CardTitle>
                                                            <p className="text-sm text-gray-600">{report.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={getStatusColor(report.status)}>
                                                        {report.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="space-y-4">
                                                    {/* Report Info */}
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-600">Period:</span>
                                                            <p className="text-gray-900">{report.period}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Generated:</span>
                                                            <p className="text-gray-900">{report.generatedDate}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Size:</span>
                                                            <p className="text-gray-900">{report.size}</p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">Format:</span>
                                                            <p className="text-gray-900">{report.format}</p>
                                                        </div>
                                                    </div>

                                                    {/* Key Metrics */}
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            {Object.entries(report.metrics).slice(0, 4).map(([key, value]) => (
                                                                <div key={key} className="flex justify-between">
                                                                    <span className="text-gray-600 capitalize">
                                                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                                    </span>
                                                                    <span className="font-medium text-gray-900">{value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Sections */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Report Sections</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {report.sections.slice(0, 3).map((section, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {section}
                                                                </Badge>
                                                            ))}
                                                            {report.sections.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{report.sections.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    {/* Actions */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex space-x-2">
                                                            {report.status === 'ready' ? (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleView(report)}
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        <span>View</span>
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleDownload(report)}
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                        <span>Download</span>
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handlePrint(report)}
                                                                        className="flex items-center space-x-2"
                                                                    >
                                                                        <Printer className="h-4 w-4" />
                                                                        <span>Print</span>
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button size="sm" variant="outline" disabled>
                                                                    {report.status === 'generating' ? 'Generating...' :
                                                                        report.status === 'scheduled' ? 'Scheduled' : 'Failed'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {mockTemplates.map((template) => (
                                        <Card key={template.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <CardTitle className="flex items-center space-x-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <span>{template.name}</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <p className="text-gray-700">{template.description}</p>

                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Estimated Time:</span> {template.estimatedTime}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Includes Sections</h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {template.sections.map((section, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {section}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        className="w-full"
                                                        onClick={() => handleGenerateReport(template)}
                                                    >
                                                        Generate Report
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
