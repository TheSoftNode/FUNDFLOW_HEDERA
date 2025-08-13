"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    HelpCircle,
    Search,
    MessageCircle,
    Mail,
    Phone,
    Clock,
    BookOpen,
    Video,
    FileText,
    Star,
    ChevronDown,
    ChevronRight,
    Plus,
    Send,
    ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: 'getting-started' | 'campaigns' | 'investments' | 'payments' | 'technical' | 'billing';
    tags: string[];
    helpful: number;
    notHelpful: number;
}

interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
}

const mockFAQs: FAQ[] = [
    {
        id: '1',
        question: 'How do I create my first fundraising campaign?',
        answer: 'To create your first campaign, navigate to the Campaigns section and click "Create New Campaign". Fill in the required information including your campaign title, description, funding goal, and timeline. You can also add images, videos, and detailed information about your startup.',
        category: 'getting-started',
        tags: ['campaigns', 'fundraising', 'getting-started'],
        helpful: 45,
        notHelpful: 2
    },
    {
        id: '2',
        question: 'What are the fees for using FundFlow?',
        answer: 'FundFlow charges a 5% platform fee on successful fundraising campaigns, plus payment processing fees of 2.9% + $0.30 per transaction. There are no upfront costs or monthly fees.',
        category: 'billing',
        tags: ['fees', 'billing', 'costs'],
        helpful: 38,
        notHelpful: 5
    },
    {
        id: '3',
        question: 'How do investors get paid back?',
        answer: 'Investors receive returns through various mechanisms depending on your campaign structure. This can include equity shares, revenue sharing, or milestone-based payments. All terms are clearly outlined in your campaign agreement.',
        category: 'investments',
        tags: ['investments', 'returns', 'payments'],
        helpful: 52,
        notHelpful: 1
    },
    {
        id: '4',
        question: 'Can I update my campaign after it goes live?',
        answer: 'Yes, you can update certain aspects of your campaign after it goes live, including campaign description, images, and milestone updates. However, core details like funding goal and timeline cannot be changed once the campaign is active.',
        category: 'campaigns',
        tags: ['campaigns', 'updates', 'editing'],
        helpful: 29,
        notHelpful: 3
    },
    {
        id: '5',
        question: 'How do I track my campaign performance?',
        answer: 'Use the Analytics dashboard to track your campaign performance in real-time. You can monitor funding progress, investor engagement, traffic sources, and conversion rates. Detailed reports are available for download.',
        category: 'campaigns',
        tags: ['analytics', 'tracking', 'performance'],
        helpful: 41,
        notHelpful: 2
    }
];

const mockSupportTickets: SupportTicket[] = [
    {
        id: '1',
        subject: 'Payment processing issue',
        description: 'Investors are experiencing delays when trying to complete payments. The transaction appears to hang at the confirmation step.',
        status: 'in-progress',
        priority: 'high',
        category: 'payments',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T14:20:00Z',
        assignedTo: 'Support Team'
    },
    {
        id: '2',
        subject: 'Campaign analytics not updating',
        description: 'My campaign dashboard shows outdated information. The visitor count and conversion rates haven\'t updated in 24 hours.',
        status: 'open',
        priority: 'medium',
        category: 'technical',
        createdAt: '2024-01-14T16:45:00Z',
        updatedAt: '2024-01-14T16:45:00Z'
    }
];

const HelpPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('help');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
    const [showContactForm, setShowContactForm] = useState(false);
    const [contactForm, setContactForm] = useState({
        subject: '',
        description: '',
        category: '',
        priority: 'medium'
    });

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const filteredFAQs = mockFAQs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const markHelpful = (id: string) => {
        // In a real app, this would update the backend
        console.log('Marking FAQ as helpful:', id);
    };

    const markNotHelpful = (id: string) => {
        // In a real app, this would update the backend
        console.log('Marking FAQ as not helpful:', id);
    };

    const submitContactForm = () => {
        // In a real app, this would submit to the backend
        console.log('Submitting contact form:', contactForm);
        setShowContactForm(false);
        setContactForm({ subject: '', description: '', category: '', priority: 'medium' });
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            'getting-started': 'Getting Started',
            'campaigns': 'Campaigns',
            'investments': 'Investments',
            'payments': 'Payments',
            'technical': 'Technical',
            'billing': 'Billing'
        };
        return labels[category as keyof typeof labels] || category;
    };

    const getPriorityColor = (priority: string) => {
        const colors = {
            low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
            urgent: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        };
        return colors[priority as keyof typeof colors];
    };

    const getStatusColor = (status: string) => {
        const colors = {
            open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
            closed: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
        };
        return colors[status as keyof typeof colors];
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
                            Help & Support
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Find answers to common questions and get help when you need it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search and Filters */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <Input
                                                placeholder="Search help articles..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="getting-started">Getting Started</SelectItem>
                                                <SelectItem value="campaigns">Campaigns</SelectItem>
                                                <SelectItem value="investments">Investments</SelectItem>
                                                <SelectItem value="payments">Payments</SelectItem>
                                                <SelectItem value="technical">Technical</SelectItem>
                                                <SelectItem value="billing">Billing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Section */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl text-slate-900 dark:text-white">
                                        <BookOpen className="w-5 h-5 inline mr-2" />
                                        Frequently Asked Questions
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Find quick answers to common questions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredFAQs.map((faq) => (
                                            <div key={faq.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                                <button
                                                    className="w-full p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                                                    onClick={() => toggleFAQ(faq.id)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium text-slate-900 dark:text-white">
                                                            {faq.question}
                                                        </h3>
                                                        {expandedFAQ === faq.id ? (
                                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                                        ) : (
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {getCategoryLabel(faq.category)}
                                                        </Badge>
                                                        {faq.tags.slice(0, 2).map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </button>

                                                {expandedFAQ === faq.id && (
                                                    <div className="px-4 pb-4">
                                                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                                                {faq.answer}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => markHelpful(faq.id)}
                                                                        className="text-green-600 hover:text-green-700"
                                                                    >
                                                                        <Star className="w-4 h-4 mr-1" />
                                                                        Helpful ({faq.helpful})
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => markNotHelpful(faq.id)}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        Not Helpful ({faq.notHelpful})
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {filteredFAQs.length === 0 && (
                                            <div className="text-center py-12">
                                                <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    No help articles found
                                                </h3>
                                                <p className="text-slate-500 dark:text-slate-400">
                                                    Try adjusting your search terms or category filter.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Support */}
                            {showContactForm ? (
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-slate-900 dark:text-white">
                                            Contact Support
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Submit a support ticket for personalized assistance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Subject
                                                </label>
                                                <Input
                                                    value={contactForm.subject}
                                                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                                    placeholder="Brief description of your issue"
                                                    className="bg-white dark:bg-slate-900"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Category
                                                </label>
                                                <Select value={contactForm.category} onValueChange={(value) => setContactForm({ ...contactForm, category: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="technical">Technical Issue</SelectItem>
                                                        <SelectItem value="billing">Billing Question</SelectItem>
                                                        <SelectItem value="campaign">Campaign Support</SelectItem>
                                                        <SelectItem value="account">Account Issue</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Description
                                            </label>
                                            <Textarea
                                                value={contactForm.description}
                                                onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                                                placeholder="Please provide detailed information about your issue..."
                                                rows={4}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Select value={contactForm.priority} onValueChange={(value) => setContactForm({ ...contactForm, priority: value as any })}>
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low Priority</SelectItem>
                                                    <SelectItem value="medium">Medium Priority</SelectItem>
                                                    <SelectItem value="high">High Priority</SelectItem>
                                                    <SelectItem value="urgent">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" onClick={() => setShowContactForm(false)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={submitContactForm}>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Ticket
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                    <CardContent className="p-6 text-center">
                                        <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                            Need more help?
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                                            Can't find what you're looking for? Contact our support team for personalized assistance.
                                        </p>
                                        <Button onClick={() => setShowContactForm(true)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Contact Support
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Documentation
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Video className="w-4 h-4 mr-2" />
                                        Video Tutorials
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileText className="w-4 h-4 mr-2" />
                                        API Reference
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Community Forum
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Contact Information */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Email Support</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">support@fundflow.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Phone Support</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">Support Hours</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Mon-Fri 9AM-6PM EST</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Support Tickets */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                                        Recent Support Tickets
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {mockSupportTickets.map((ticket) => (
                                            <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                                                        {ticket.subject}
                                                    </h4>
                                                    <Badge className={getStatusColor(ticket.status)}>
                                                        {ticket.status.replace('-', ' ')}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <Badge className={getPriorityColor(ticket.priority)}>
                                                        {ticket.priority}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default HelpPage;
