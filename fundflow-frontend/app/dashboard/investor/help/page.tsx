'use client';

import React, { useState } from 'react';
import { HelpCircle, Search, MessageCircle, Phone, Mail, FileText, BookOpen, Video, ChevronDown, ChevronRight, ExternalLink, Star, Clock, User, Tag, TrendingUp, Shield, BarChart3, Lock } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data for FAQs
const mockFAQs = [
    {
        id: 1,
        question: 'How do I verify my accredited investor status?',
        answer: 'To verify your accredited investor status, you\'ll need to provide documentation such as tax returns, W-2 forms, or bank statements that demonstrate your income or net worth meets SEC requirements. You can submit these documents through your profile settings.',
        category: 'verification',
        tags: ['accredited investor', 'verification', 'compliance'],
        helpful: 45,
        lastUpdated: '2024-03-15'
    },
    {
        id: 2,
        question: 'What happens if a startup I invested in goes bankrupt?',
        answer: 'If a startup goes bankrupt, your investment may be lost. However, you may have some recourse depending on the company\'s assets and the terms of your investment. We recommend consulting with a financial advisor or attorney for specific guidance.',
        category: 'investments',
        tags: ['bankruptcy', 'risk', 'loss'],
        helpful: 32,
        lastUpdated: '2024-03-10'
    },
    {
        id: 3,
        question: 'How do I track my investment performance?',
        answer: 'You can track your investment performance through the Analytics dashboard, which provides detailed metrics including returns, portfolio allocation, and performance comparisons. You can also generate custom reports and export data for external analysis.',
        category: 'analytics',
        tags: ['performance', 'tracking', 'metrics'],
        helpful: 67,
        lastUpdated: '2024-03-20'
    },
    {
        id: 4,
        question: 'Can I sell my investment before the startup exits?',
        answer: 'Secondary market sales depend on the startup\'s policies and market conditions. Some startups allow secondary sales through their own platforms or third-party marketplaces. Check with the startup directly or contact our support team for guidance.',
        category: 'investments',
        tags: ['secondary market', 'liquidity', 'exit'],
        helpful: 28,
        lastUpdated: '2024-03-05'
    },
    {
        id: 5,
        question: 'How do I update my investment preferences?',
        answer: 'You can update your investment preferences in your Profile settings. Navigate to Profile > Preferences to modify your investment focus areas, preferred stages, and investment size ranges.',
        category: 'profile',
        tags: ['preferences', 'settings', 'profile'],
        helpful: 23,
        lastUpdated: '2024-02-28'
    },
    {
        id: 6,
        question: 'What tax documents will I receive for my investments?',
        answer: 'You\'ll receive tax documents including K-1s for LLC investments, 1099-DIV for dividends, and 1099-B for capital gains/losses. These are typically available by January 31st of the following year.',
        category: 'taxes',
        tags: ['tax documents', 'K-1', '1099', 'reporting'],
        helpful: 89,
        lastUpdated: '2024-03-01'
    }
];

// Mock data for help categories
const mockCategories = [
    {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Learn the basics of investing on our platform',
        icon: BookOpen,
        articleCount: 12,
        color: 'text-blue-600'
    },
    {
        id: 'investments',
        name: 'Investments',
        description: 'Everything about making and managing investments',
        icon: TrendingUp,
        articleCount: 25,
        color: 'text-green-600'
    },
    {
        id: 'verification',
        name: 'Verification',
        description: 'Account verification and compliance requirements',
        icon: Shield,
        articleCount: 8,
        color: 'text-purple-600'
    },
    {
        id: 'analytics',
        name: 'Analytics',
        description: 'Understanding your portfolio performance',
        icon: BarChart3,
        articleCount: 15,
        color: 'text-orange-600'
    },
    {
        id: 'taxes',
        name: 'Taxes',
        description: 'Tax implications and reporting requirements',
        icon: FileText,
        articleCount: 18,
        color: 'text-red-600'
    },
    {
        id: 'security',
        name: 'Security',
        description: 'Account security and privacy settings',
        icon: Lock,
        articleCount: 10,
        color: 'text-indigo-600'
    }
];

// Mock data for support tickets
const mockSupportTickets = [
    {
        id: 1,
        subject: 'Unable to complete KYC verification',
        status: 'open',
        priority: 'high',
        category: 'verification',
        createdAt: '2024-03-28',
        lastUpdated: '2024-03-28',
        assignedTo: 'Sarah Chen'
    },
    {
        id: 2,
        subject: 'Portfolio performance data not updating',
        status: 'in-progress',
        priority: 'medium',
        category: 'analytics',
        createdAt: '2024-03-25',
        lastUpdated: '2024-03-27',
        assignedTo: 'Mike Johnson'
    },
    {
        id: 3,
        subject: 'Investment withdrawal request',
        status: 'resolved',
        priority: 'high',
        category: 'investments',
        createdAt: '2024-03-20',
        lastUpdated: '2024-03-22',
        assignedTo: 'Lisa Wang'
    }
];

export default function HelpPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('help');
    const [showContactForm, setShowContactForm] = useState(false);

    const filteredFAQs = mockFAQs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !selectedCategory || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id: number) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    return (
        <div className="flex h-screen bg-gray-50">
            <InvestorSidebar activeItem="help" isCollapsed={false} onToggle={() => { }} onItemClick={() => { }} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
                            <p className="text-gray-600">Find answers to your questions and get the support you need</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                                    <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
                                    <Button className="w-full">Start Chat</Button>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                                    <p className="text-gray-600 mb-4">Call us at +1 (555) 123-4567</p>
                                    <Button variant="outline" className="w-full">Call Now</Button>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                                    <p className="text-gray-600 mb-4">Send us an email for detailed assistance</p>
                                    <Button variant="outline" className="w-full">Send Email</Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('help')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'help'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Help Center
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'support'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Support Tickets
                            </button>
                        </div>

                        {/* Help Center Tab */}
                        {activeTab === 'help' && (
                            <div className="space-y-8">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        placeholder="Search for help articles, FAQs, or topics..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 text-lg"
                                    />
                                </div>

                                {/* Help Categories */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {mockCategories.map((category) => (
                                            <Card
                                                key={category.id}
                                                className="hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <category.icon className={`h-8 w-8 ${category.color}`} />
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                                            <p className="text-sm text-gray-600">{category.articleCount} articles</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{category.description}</p>
                                                    {selectedCategory === category.id && (
                                                        <div className="mt-3 pt-3 border-t">
                                                            <Button variant="outline" size="sm" className="w-full">
                                                                View Articles
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>

                                {/* Popular Help Articles */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Help Articles</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-3">
                                                    <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                                                        <p className="text-gray-600 mb-3">Complete step-by-step guide to start investing on our platform</p>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <span>5 min read</span>
                                                            <span>⭐ 4.8 (156 reviews)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex items-start space-x-3">
                                                    <Video className="h-6 w-6 text-green-600 mt-1" />
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-2">Platform Walkthrough</h3>
                                                        <p className="text-gray-600 mb-3">Video tutorial covering all major platform features</p>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <span>12 min video</span>
                                                            <span>⭐ 4.9 (89 reviews)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* FAQs */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">All Categories</SelectItem>
                                                <SelectItem value="verification">Verification</SelectItem>
                                                <SelectItem value="investments">Investments</SelectItem>
                                                <SelectItem value="analytics">Analytics</SelectItem>
                                                <SelectItem value="profile">Profile</SelectItem>
                                                <SelectItem value="taxes">Taxes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4">
                                        {filteredFAQs.map((faq) => (
                                            <Card key={faq.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-6">
                                                    <div
                                                        className="flex items-start justify-between cursor-pointer"
                                                        onClick={() => toggleFAQ(faq.id)}
                                                    >
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                <span className="flex items-center">
                                                                    <Tag className="h-4 w-4 mr-1" />
                                                                    {faq.category}
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Star className="h-4 w-4 mr-1" />
                                                                    {faq.helpful} found helpful
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Clock className="h-4 w-4 mr-1" />
                                                                    Updated {faq.lastUpdated}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {expandedFAQ === faq.id ? (
                                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                                        )}
                                                    </div>

                                                    {expandedFAQ === faq.id && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <p className="text-gray-700 mb-3">{faq.answer}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {faq.tags.map((tag, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button size="sm" variant="ghost">
                                                                        <Star className="h-4 w-4 mr-1" />
                                                                        Helpful
                                                                    </Button>
                                                                    <Button size="sm" variant="ghost">
                                                                        <MessageCircle className="h-4 w-4 mr-1" />
                                                                        Contact Support
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Support Tickets Tab */}
                        {activeTab === 'support' && (
                            <div className="space-y-6">
                                {/* Support Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                                                    <p className="text-2xl font-bold text-gray-900">{mockSupportTickets.length}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-red-600 font-bold">
                                                        {mockSupportTickets.filter(t => t.status === 'open').length}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Open</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {mockSupportTickets.filter(t => t.status === 'open').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-yellow-600 font-bold">
                                                        {mockSupportTickets.filter(t => t.status === 'in-progress').length}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {mockSupportTickets.filter(t => t.status === 'in-progress').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-green-600 font-bold">
                                                        {mockSupportTickets.filter(t => t.status === 'resolved').length}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {mockSupportTickets.filter(t => t.status === 'resolved').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Create New Ticket */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <MessageCircle className="h-5 w-5 text-blue-600" />
                                            <span>Create Support Ticket</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            Can't find what you're looking for? Create a support ticket and our team will help you.
                                        </p>
                                        <Button onClick={() => setShowContactForm(true)}>
                                            Create Ticket
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Existing Tickets */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-green-600" />
                                            <span>Your Support Tickets</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {mockSupportTickets.map((ticket) => (
                                                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{ticket.subject}</h4>
                                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                            <span>Created: {ticket.createdAt}</span>
                                                            <span>Updated: {ticket.lastUpdated}</span>
                                                            <span>Assigned to: {ticket.assignedTo}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Badge className={getStatusColor(ticket.status)}>
                                                            {ticket.status}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(ticket.priority)}>
                                                            {ticket.priority}
                                                        </Badge>
                                                        <Button size="sm" variant="outline">
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
