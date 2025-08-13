'use client';

import React, { useState } from 'react';
import { Search, Users, MessageCircle, Star, MapPin, Building2, TrendingUp, Filter } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Mock data for community members
const mockCommunityMembers = [
    {
        id: 1,
        name: 'Sarah Chen',
        role: 'Angel Investor',
        avatar: '/avatars/sarah.jpg',
        company: 'Tech Ventures Capital',
        location: 'San Francisco, CA',
        expertise: ['AI/ML', 'SaaS', 'Fintech'],
        investmentFocus: 'Early-stage startups',
        portfolioSize: '$15M',
        connectionStatus: 'connected',
        mutualConnections: 12,
        lastActive: '2 hours ago',
        bio: 'Passionate about supporting innovative startups in the AI and fintech space.',
        interests: ['Machine Learning', 'Blockchain', 'Healthcare Tech']
    },
    {
        id: 2,
        name: 'Michael Rodriguez',
        role: 'Venture Partner',
        avatar: '/avatars/michael.jpg',
        company: 'Innovation Fund',
        location: 'New York, NY',
        expertise: ['Healthcare', 'Biotech', 'MedTech'],
        investmentFocus: 'Series A & B',
        portfolioSize: '$45M',
        connectionStatus: 'pending',
        mutualConnections: 8,
        lastActive: '1 day ago',
        bio: 'Healthcare investor with 15+ years of experience in biotech and medical technology.',
        interests: ['Digital Health', 'Drug Discovery', 'Medical Devices']
    },
    {
        id: 3,
        name: 'Emily Watson',
        role: 'Investment Manager',
        avatar: '/avatars/emily.jpg',
        company: 'Growth Capital Partners',
        location: 'Boston, MA',
        expertise: ['Enterprise Software', 'B2B', 'Cloud'],
        investmentFocus: 'Growth-stage companies',
        portfolioSize: '$28M',
        connectionStatus: 'not_connected',
        mutualConnections: 5,
        lastActive: '3 hours ago',
        bio: 'Focused on enterprise software and B2B solutions that drive business transformation.',
        interests: ['Enterprise SaaS', 'Data Analytics', 'Cybersecurity']
    },
    {
        id: 4,
        name: 'David Kim',
        role: 'Family Office',
        avatar: '/avatars/david.jpg',
        company: 'Kim Family Investments',
        location: 'Seattle, WA',
        expertise: ['E-commerce', 'Marketplace', 'Consumer Tech'],
        investmentFocus: 'Diverse portfolio',
        portfolioSize: '$120M',
        connectionStatus: 'connected',
        mutualConnections: 18,
        lastActive: '5 hours ago',
        bio: 'Multi-generational investor with a focus on consumer technology and marketplaces.',
        interests: ['E-commerce', 'Mobile Apps', 'Social Commerce']
    },
    {
        id: 5,
        name: 'Lisa Thompson',
        role: 'Corporate VC',
        avatar: '/avatars/lisa.jpg',
        company: 'Global Tech Corp',
        location: 'Austin, TX',
        expertise: ['IoT', 'Hardware', 'Manufacturing'],
        investmentFocus: 'Strategic investments',
        portfolioSize: '$75M',
        connectionStatus: 'not_connected',
        mutualConnections: 3,
        lastActive: '1 week ago',
        bio: 'Corporate venture capital investor focused on strategic technology partnerships.',
        interests: ['Industrial IoT', 'Smart Manufacturing', 'Supply Chain Tech']
    },
    {
        id: 6,
        name: 'James Wilson',
        role: 'Retired Executive',
        avatar: '/avatars/james.jpg',
        company: 'Wilson Advisory',
        location: 'Chicago, IL',
        expertise: ['Retail', 'Logistics', 'Real Estate'],
        investmentFocus: 'Value investments',
        portfolioSize: '$60M',
        connectionStatus: 'connected',
        mutualConnections: 22,
        lastActive: '4 hours ago',
        bio: 'Former retail executive now investing in logistics and real estate technology.',
        interests: ['PropTech', 'Logistics Tech', 'Retail Innovation']
    }
];

// Mock data for community events
const mockEvents = [
    {
        id: 1,
        title: 'AI Investment Summit 2024',
        date: '2024-03-15',
        time: '9:00 AM - 5:00 PM',
        location: 'San Francisco, CA',
        attendees: 150,
        type: 'conference',
        description: 'Join leading AI investors and entrepreneurs for a day of insights and networking.'
    },
    {
        id: 2,
        title: 'Healthcare Tech Meetup',
        date: '2024-03-20',
        time: '6:00 PM - 9:00 PM',
        location: 'New York, NY',
        attendees: 45,
        type: 'meetup',
        description: 'Monthly meetup for healthcare technology investors and founders.'
    },
    {
        id: 3,
        title: 'Fintech Investment Workshop',
        date: '2024-03-25',
        time: '10:00 AM - 3:00 PM',
        location: 'Boston, MA',
        attendees: 80,
        type: 'workshop',
        description: 'Deep dive into fintech investment strategies and due diligence.'
    }
];

// Mock data for discussion topics
const mockDiscussions = [
    {
        id: 1,
        title: 'What\'s your take on AI regulation in 2024?',
        author: 'Sarah Chen',
        replies: 23,
        views: 156,
        lastActivity: '2 hours ago',
        tags: ['AI', 'Regulation', 'Policy']
    },
    {
        id: 2,
        title: 'Best practices for startup due diligence',
        author: 'Michael Rodriguez',
        replies: 18,
        views: 89,
        lastActivity: '1 day ago',
        tags: ['Due Diligence', 'Best Practices', 'Investing']
    },
    {
        id: 3,
        title: 'Emerging trends in healthcare technology',
        author: 'Emily Watson',
        replies: 31,
        views: 203,
        lastActivity: '3 hours ago',
        tags: ['Healthcare', 'Technology', 'Trends']
    }
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('members');
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [expertiseFilter, setExpertiseFilter] = useState('');
    const [connectionFilter, setConnectionFilter] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    const filteredMembers = mockCommunityMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesLocation = !locationFilter || member.location.includes(locationFilter);
        const matchesExpertise = !expertiseFilter || member.expertise.includes(expertiseFilter);
        const matchesConnection = !connectionFilter || member.connectionStatus === connectionFilter;

        return matchesSearch && matchesLocation && matchesExpertise && matchesConnection;
    });

    const sortedMembers = [...filteredMembers].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'connections':
                return b.mutualConnections - a.mutualConnections;
            case 'portfolio':
                return parseInt(b.portfolioSize.replace('$', '').replace('M', '000000')) -
                    parseInt(a.portfolioSize.replace('$', '').replace('M', '000000'));
            default:
                return 0;
        }
    });

    const handleConnect = (memberId: number) => {
        // Handle connection request
        console.log(`Connecting with member ${memberId}`);
    };

    const handleMessage = (memberId: number) => {
        // Handle messaging
        console.log(`Messaging member ${memberId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <InvestorSidebar activeItem="community" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
                            <p className="text-gray-600">Connect with fellow investors, share insights, and discover new opportunities</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                                            <p className="text-2xl font-bold text-gray-900">2,847</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <MessageCircle className="h-8 w-8 text-green-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Active Discussions</p>
                                            <p className="text-2xl font-bold text-gray-900">156</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Events This Month</p>
                                            <p className="text-2xl font-bold text-gray-900">12</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Star className="h-8 w-8 text-yellow-600 mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Your Connections</p>
                                            <p className="text-2xl font-bold text-gray-900">47</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('members')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'members'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Members ({mockCommunityMembers.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'events'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Events ({mockEvents.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('discussions')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'discussions'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Discussions ({mockDiscussions.length})
                            </button>
                        </div>

                        {/* Members Tab */}
                        {activeTab === 'members' && (
                            <div>
                                {/* Filters */}
                                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                        <div>
                                            <Input
                                                placeholder="Search members..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Locations</SelectItem>
                                                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                                                    <SelectItem value="New York">New York</SelectItem>
                                                    <SelectItem value="Boston">Boston</SelectItem>
                                                    <SelectItem value="Seattle">Seattle</SelectItem>
                                                    <SelectItem value="Austin">Austin</SelectItem>
                                                    <SelectItem value="Chicago">Chicago</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Expertise" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All Expertise</SelectItem>
                                                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                                    <SelectItem value="Fintech">Fintech</SelectItem>
                                                    <SelectItem value="SaaS">SaaS</SelectItem>
                                                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select value={connectionFilter} onValueChange={setConnectionFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Connection" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All</SelectItem>
                                                    <SelectItem value="connected">Connected</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="not_connected">Not Connected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Select value={sortBy} onValueChange={setSortBy}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="recent">Most Recent</SelectItem>
                                                    <SelectItem value="name">Name</SelectItem>
                                                    <SelectItem value="connections">Most Connections</SelectItem>
                                                    <SelectItem value="portfolio">Portfolio Size</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Members Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sortedMembers.map((member) => (
                                        <Card key={member.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={member.avatar} alt={member.name} />
                                                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                                            <p className="text-sm text-gray-600">{member.role}</p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={member.connectionStatus === 'connected' ? 'default' :
                                                            member.connectionStatus === 'pending' ? 'secondary' : 'outline'}
                                                    >
                                                        {member.connectionStatus === 'connected' ? 'Connected' :
                                                            member.connectionStatus === 'pending' ? 'Pending' : 'Connect'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Building2 className="h-4 w-4 mr-2" />
                                                        {member.company}
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {member.location}
                                                    </div>

                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Portfolio:</span> {member.portfolioSize}
                                                    </div>

                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Focus:</span> {member.investmentFocus}
                                                    </div>

                                                    <div className="flex flex-wrap gap-1">
                                                        {member.expertise.slice(0, 3).map((skill, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {member.expertise.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{member.expertise.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        {member.mutualConnections} mutual connections
                                                    </div>

                                                    <div className="text-sm text-gray-500">
                                                        Last active: {member.lastActive}
                                                    </div>

                                                    <Separator />

                                                    <div className="flex space-x-2">
                                                        {member.connectionStatus === 'not_connected' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleConnect(member.id)}
                                                                className="flex-1"
                                                            >
                                                                Connect
                                                            </Button>
                                                        ) : member.connectionStatus === 'pending' ? (
                                                            <Button size="sm" variant="outline" className="flex-1" disabled>
                                                                Pending
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleMessage(member.id)}
                                                                className="flex-1"
                                                            >
                                                                Message
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Events Tab */}
                        {activeTab === 'events' && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mockEvents.map((event) => (
                                        <Card key={event.id} className="hover:shadow-md transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                                    <Badge variant={event.type === 'conference' ? 'default' :
                                                        event.type === 'workshop' ? 'secondary' : 'outline'}>
                                                        {event.type}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 mr-2" />
                                                        {event.location}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Date:</span> {formatDate(event.date)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Time:</span> {event.time}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Attendees:</span> {event.attendees}
                                                    </div>
                                                    <p className="text-sm text-gray-700">{event.description}</p>
                                                    <Button className="w-full">Register Interest</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Discussions Tab */}
                        {activeTab === 'discussions' && (
                            <div>
                                <div className="space-y-4">
                                    {mockDiscussions.map((discussion) => (
                                        <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                            <span>By {discussion.author}</span>
                                                            <span>{discussion.replies} replies</span>
                                                            <span>{discussion.views} views</span>
                                                            <span>Last activity: {discussion.lastActivity}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {discussion.tags.map((tag, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Join Discussion
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
