'use client';

import React, { useState } from 'react';
import { User, Edit, Save, X, Camera, Shield, Bell, Globe, CreditCard, Building2, MapPin, Phone, Mail, Linkedin, Twitter, Globe as GlobeIcon, Target, FileText } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Mock data for investor profile
const mockProfile = {
    id: 1,
    firstName: 'John',
    lastName: 'Anderson',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: '/avatars/john.jpg',
    title: 'Angel Investor & Venture Partner',
    company: 'Anderson Capital Group',
    location: 'San Francisco, CA',
    bio: 'Experienced angel investor with 15+ years in early-stage technology investments. Focus on AI/ML, SaaS, and fintech startups. Passionate about supporting innovative entrepreneurs and building successful companies.',
    website: 'https://andersoncapital.com',
    linkedin: 'https://linkedin.com/in/johnanderson',
    twitter: 'https://twitter.com/johnanderson',
    investmentFocus: ['AI/ML', 'SaaS', 'Fintech', 'Healthcare Tech'],
    investmentStage: ['Seed', 'Series A', 'Series B'],
    investmentSize: '$50K - $500K',
    portfolioSize: '$15M',
    yearsInvesting: 15,
    totalInvestments: 47,
    successfulExits: 12,
    verificationStatus: 'verified',
    kycStatus: 'completed',
    accountType: 'accredited',
    preferences: {
        notifications: {
            email: true,
            push: true,
            sms: false,
            weeklyDigest: true,
            monthlyReport: true,
            investmentOpportunities: true,
            milestoneUpdates: true,
            marketInsights: true
        },
        privacy: {
            profilePublic: true,
            showPortfolio: false,
            showInvestments: true,
            allowContact: true,
            showAnalytics: false
        },
        communication: {
            startupOutreach: true,
            investorNetworking: true,
            platformUpdates: true,
            marketingEmails: false
        }
    },
    documents: [
        { id: 1, name: 'KYC Verification', status: 'verified', date: '2024-01-15' },
        { id: 2, name: 'Accredited Investor Certificate', status: 'verified', date: '2024-01-20' },
        { id: 3, name: 'Identity Verification', status: 'verified', date: '2024-01-10' },
        { id: 4, name: 'Address Verification', status: 'pending', date: '2024-03-01' }
    ]
};

export default function ProfilePage() {
    const [profile, setProfile] = useState(mockProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [editForm, setEditForm] = useState({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        title: profile.title,
        company: profile.company,
        location: profile.location,
        bio: profile.bio,
        website: profile.website,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        investmentFocus: profile.investmentFocus,
        investmentStage: profile.investmentStage,
        investmentSize: profile.investmentSize
    });

    const handleSave = () => {
        setProfile(prev => ({
            ...prev,
            ...editForm
        }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            title: profile.title,
            company: profile.company,
            location: profile.location,
            bio: profile.bio,
            website: profile.website,
            linkedin: profile.linkedin,
            twitter: profile.twitter,
            investmentFocus: profile.investmentFocus,
            investmentStage: profile.investmentStage,
            investmentSize: profile.investmentSize
        });
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string | string[]) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getVerificationColor = (status: string) => {
        switch (status) {
            case 'verified':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAccountTypeColor = (type: string) => {
        switch (type) {
            case 'accredited':
                return 'bg-blue-100 text-blue-800';
            case 'non-accredited':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <InvestorSidebar activeItem="profile" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                                <p className="text-gray-600">Manage your investor profile and account settings</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} className="flex items-center space-x-2">
                                            <Save className="h-4 w-4" />
                                            <span>Save Changes</span>
                                        </Button>
                                        <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2">
                                            <X className="h-4 w-4" />
                                            <span>Cancel</span>
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                                        <Edit className="h-4 w-4" />
                                        <span>Edit Profile</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Profile Overview Card */}
                        <Card className="mb-8">
                            <CardContent className="p-8">
                                <div className="flex items-start space-x-6">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <Avatar className="h-32 w-32">
                                                <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                                                <AvatarFallback className="text-3xl">
                                                    {profile.firstName[0]}{profile.lastName[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isEditing && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                                                >
                                                    <Camera className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <Badge className={getVerificationColor(profile.verificationStatus)}>
                                                {profile.verificationStatus === 'verified' ? '✓ Verified' : profile.verificationStatus}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.firstName}
                                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.firstName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.lastName}
                                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.lastName}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className="w-full"
                                                        type="email"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.title}
                                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.title}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.company}
                                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.company}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.location}
                                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-gray-900">{profile.location}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                                                <Badge className={getAccountTypeColor(profile.accountType)}>
                                                    {profile.accountType.replace('-', ' ')}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            {isEditing ? (
                                                <Textarea
                                                    value={editForm.bio}
                                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                                    rows={4}
                                                    className="w-full"
                                                />
                                            ) : (
                                                <p className="text-gray-700">{profile.bio}</p>
                                            )}
                                        </div>

                                        {/* Investment Focus */}
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Investment Focus</label>
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {['AI/ML', 'SaaS', 'Fintech', 'Healthcare Tech', 'E-commerce', 'IoT'].map((focus) => (
                                                        <Badge
                                                            key={focus}
                                                            variant={editForm.investmentFocus.includes(focus) ? 'default' : 'outline'}
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                const newFocus = editForm.investmentFocus.includes(focus)
                                                                    ? editForm.investmentFocus.filter(f => f !== focus)
                                                                    : [...editForm.investmentFocus, focus];
                                                                handleInputChange('investmentFocus', newFocus);
                                                            }}
                                                        >
                                                            {focus}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.investmentFocus.map((focus) => (
                                                        <Badge key={focus} variant="secondary">
                                                            {focus}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'preferences'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Preferences
                            </button>
                            <button
                                onClick={() => setActiveTab('documents')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'documents'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Documents
                            </button>
                        </div>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Investment Stats */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                            <span>Investment Stats</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Portfolio Size</span>
                                            <span className="font-semibold">{profile.portfolioSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Years Investing</span>
                                            <span className="font-semibold">{profile.yearsInvesting}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Investments</span>
                                            <span className="font-semibold">{profile.totalInvestments}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Successful Exits</span>
                                            <span className="font-semibold">{profile.successfulExits}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Investment Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Target className="h-5 w-5 text-green-600" />
                                            <span>Investment Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Investment Stage</span>
                                            <div className="mt-2 space-y-1">
                                                {profile.investmentStage.map((stage) => (
                                                    <Badge key={stage} variant="outline" className="mr-1">
                                                        {stage}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Investment Size</span>
                                            <p className="text-sm text-gray-900 mt-1">{profile.investmentSize}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Social Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <GlobeIcon className="h-5 w-5 text-purple-600" />
                                            <span>Social Links</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {profile.website && (
                                            <div className="flex items-center space-x-2">
                                                <Globe className="h-4 w-4 text-gray-500" />
                                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Website
                                                </a>
                                            </div>
                                        )}
                                        {profile.linkedin && (
                                            <div className="flex items-center space-x-2">
                                                <Linkedin className="h-4 w-4 text-gray-500" />
                                                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    LinkedIn
                                                </a>
                                            </div>
                                        )}
                                        {profile.twitter && (
                                            <div className="flex items-center space-x-2">
                                                <Twitter className="h-4 w-4 text-gray-500" />
                                                <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Twitter
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                {/* Notification Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Bell className="h-5 w-5 text-blue-600" />
                                            <span>Notification Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => {
                                                            setProfile(prev => ({
                                                                ...prev,
                                                                preferences: {
                                                                    ...prev.preferences,
                                                                    notifications: {
                                                                        ...prev.preferences.notifications,
                                                                        [key]: checked
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Privacy Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-green-600" />
                                            <span>Privacy Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(profile.preferences.privacy).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => {
                                                            setProfile(prev => ({
                                                                ...prev,
                                                                preferences: {
                                                                    ...prev.preferences,
                                                                    privacy: {
                                                                        ...prev.preferences.privacy,
                                                                        [key]: checked
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Communication Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Mail className="h-5 w-5 text-purple-600" />
                                            <span>Communication Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(profile.preferences.communication).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => {
                                                            setProfile(prev => ({
                                                                ...prev,
                                                                preferences: {
                                                                    ...prev.preferences,
                                                                    communication: {
                                                                        ...prev.preferences.communication,
                                                                        [key]: checked
                                                                    }
                                                                }
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <span>Verification Documents</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {profile.documents.map((doc) => (
                                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <FileText className="h-5 w-5 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                                                            <p className="text-sm text-gray-600">Submitted: {doc.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <Badge className={getVerificationColor(doc.status)}>
                                                            {doc.status === 'verified' ? '✓ Verified' : doc.status}
                                                        </Badge>
                                                        {doc.status === 'pending' && (
                                                            <Button size="sm" variant="outline">
                                                                Resubmit
                                                            </Button>
                                                        )}
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
