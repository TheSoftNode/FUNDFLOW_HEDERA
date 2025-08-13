'use client';

import React, { useState } from 'react';
import { Settings, Shield, Bell, CreditCard, Globe, User, Lock, Eye, EyeOff, Save, X, Key, Smartphone, Mail, Globe as GlobeIcon, Edit, Activity, RefreshCw } from 'lucide-react';
import InvestorSidebar from '@/components/dashboard/investor/InvestorSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Mock data for settings
const mockSettings = {
    account: {
        email: 'john.anderson@email.com',
        phone: '+1 (555) 123-4567',
        language: 'en',
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
    },
    security: {
        twoFactorEnabled: true,
        loginNotifications: true,
        suspiciousActivityAlerts: true,
        sessionTimeout: 30,
        passwordLastChanged: '2024-01-15',
        lastLogin: '2024-03-28 10:30 AM',
        loginLocation: 'San Francisco, CA'
    },
    notifications: {
        email: {
            investmentOpportunities: true,
            milestoneUpdates: true,
            marketInsights: true,
            weeklyDigest: true,
            monthlyReport: true,
            securityAlerts: true,
            platformUpdates: true
        },
        push: {
            investmentOpportunities: true,
            milestoneUpdates: true,
            securityAlerts: true,
            platformUpdates: false
        },
        sms: {
            securityAlerts: true,
            urgentNotifications: false
        }
    },
    privacy: {
        profileVisibility: 'public',
        showPortfolio: false,
        showInvestments: true,
        allowStartupContact: true,
        allowInvestorContact: true,
        showAnalytics: false,
        dataSharing: 'minimal'
    },
    preferences: {
        defaultView: 'dashboard',
        autoRefresh: true,
        refreshInterval: 5,
        compactMode: false,
        theme: 'light',
        sidebarCollapsed: false
    }
};

export default function SettingsPage() {
    const [settings, setSettings] = useState(mockSettings);
    const [activeTab, setActiveTab] = useState('account');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        email: settings.account.email,
        phone: settings.account.phone,
        language: settings.account.language,
        timezone: settings.account.timezone,
        currency: settings.account.currency,
        dateFormat: settings.account.dateFormat,
        timeFormat: settings.account.timeFormat
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = () => {
        setSettings(prev => ({
            ...prev,
            account: {
                ...prev.account,
                ...editForm
            }
        }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({
            email: settings.account.email,
            phone: settings.account.phone,
            language: settings.account.language,
            timezone: settings.account.timezone,
            currency: settings.account.currency,
            dateFormat: settings.account.dateFormat,
            timeFormat: settings.account.timeFormat
        });
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordUpdate = () => {
        if (passwordForm.newPassword === passwordForm.confirmPassword) {
            console.log('Password updated successfully');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            console.log('Passwords do not match');
        }
    };

    const handleSettingChange = (category: string, setting: string, value: boolean | string | number) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [setting]: value
            }
        }));
    };

    const getVisibilityColor = (visibility: string) => {
        switch (visibility) {
            case 'public':
                return 'bg-green-100 text-green-800';
            case 'private':
                return 'bg-red-100 text-red-800';
            case 'contacts':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDataSharingColor = (sharing: string) => {
        switch (sharing) {
            case 'minimal':
                return 'bg-green-100 text-green-800';
            case 'standard':
                return 'bg-yellow-100 text-yellow-800';
            case 'enhanced':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <InvestorSidebar activeItem="settings" isCollapsed={false} onToggle={() => { }} onItemClick={() => { }} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                                <p className="text-gray-600">Manage your account settings and preferences</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'account'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Account
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'security'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'notifications'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'privacy'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Privacy
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
                        </div>

                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div className="space-y-6">
                                {/* Account Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <User className="h-5 w-5 text-blue-600" />
                                            <span>Account Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        type="email"
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{settings.account.email}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                {isEditing ? (
                                                    <Input
                                                        value={editForm.phone}
                                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                                        className="w-full"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900">{settings.account.phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                                {isEditing ? (
                                                    <Select value={editForm.language} onValueChange={(value) => handleInputChange('language', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="en">English</SelectItem>
                                                            <SelectItem value="es">Spanish</SelectItem>
                                                            <SelectItem value="fr">French</SelectItem>
                                                            <SelectItem value="de">German</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900">English</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                                {isEditing ? (
                                                    <Select value={editForm.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900">Pacific Time (PT)</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                                {isEditing ? (
                                                    <Select value={editForm.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                                                            <SelectItem value="EUR">Euro (€)</SelectItem>
                                                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                                                            <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900">US Dollar ($)</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                                                {isEditing ? (
                                                    <Select value={editForm.dateFormat} onValueChange={(value) => handleInputChange('dateFormat', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-gray-900">MM/DD/YYYY</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-3">
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
                                                    <span>Edit Account</span>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Password Change */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock className="h-5 w-5 text-red-600" />
                                            <span>Change Password</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={passwordForm.currentPassword}
                                                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                        className="w-full pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <Button onClick={handlePasswordUpdate} className="flex items-center space-x-2">
                                                    <Key className="h-4 w-4" />
                                                    <span>Update Password</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                {/* Two-Factor Authentication */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Shield className="h-5 w-5 text-green-600" />
                                            <span>Two-Factor Authentication</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">SMS Authentication</h4>
                                                <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
                                            </div>
                                            <Switch
                                                checked={settings.security.twoFactorEnabled}
                                                onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Login Security */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Lock className="h-5 w-5 text-blue-600" />
                                            <span>Login Security</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Login Notifications</h4>
                                                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                                            </div>
                                            <Switch
                                                checked={settings.security.loginNotifications}
                                                onCheckedChange={(checked) => handleSettingChange('security', 'loginNotifications', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Suspicious Activity Alerts</h4>
                                                <p className="text-sm text-gray-600">Receive alerts for unusual account activity</p>
                                            </div>
                                            <Switch
                                                checked={settings.security.suspiciousActivityAlerts}
                                                onCheckedChange={(checked) => handleSettingChange('security', 'suspiciousActivityAlerts', checked)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                                            <Select
                                                value={settings.security.sessionTimeout.toString()}
                                                onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', parseInt(value))}
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="15">15 minutes</SelectItem>
                                                    <SelectItem value="30">30 minutes</SelectItem>
                                                    <SelectItem value="60">1 hour</SelectItem>
                                                    <SelectItem value="120">2 hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Account Activity */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-purple-600" />
                                            <span>Recent Account Activity</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">Last Login</p>
                                                    <p className="text-sm text-gray-600">{settings.security.lastLogin}</p>
                                                </div>
                                                <Badge variant="outline">{settings.security.loginLocation}</Badge>
                                            </div>

                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">Password Last Changed</p>
                                                    <p className="text-sm text-gray-600">{settings.security.passwordLastChanged}</p>
                                                </div>
                                                <Badge variant="outline">Updated</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                {/* Email Notifications */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Mail className="h-5 w-5 text-blue-600" />
                                            <span>Email Notifications</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(settings.notifications.email).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => handleSettingChange('notifications', `email.${key}`, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Push Notifications */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Smartphone className="h-5 w-5 text-green-600" />
                                            <span>Push Notifications</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(settings.notifications.push).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => handleSettingChange('notifications', `push.${key}`, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* SMS Notifications */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Smartphone className="h-5 w-5 text-purple-600" />
                                            <span>SMS Notifications</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(settings.notifications.sms).map(([key, value]) => (
                                                <div key={key} className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-700 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </label>
                                                    <Switch
                                                        checked={value}
                                                        onCheckedChange={(checked) => handleSettingChange('notifications', `sms.${key}`, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Privacy Tab */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6">
                                {/* Profile Privacy */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <User className="h-5 w-5 text-blue-600" />
                                            <span>Profile Privacy</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                                            <Select
                                                value={settings.privacy.profileVisibility}
                                                onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">Public</SelectItem>
                                                    <SelectItem value="contacts">Contacts Only</SelectItem>
                                                    <SelectItem value="private">Private</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Badge className={`mt-2 ${getVisibilityColor(settings.privacy.profileVisibility)}`}>
                                                {settings.privacy.profileVisibility}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Show Portfolio</h4>
                                                <p className="text-sm text-gray-600">Allow others to see your portfolio value</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.showPortfolio}
                                                onCheckedChange={(checked) => handleSettingChange('privacy', 'showPortfolio', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Show Investments</h4>
                                                <p className="text-sm text-gray-600">Allow others to see your investment history</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.showInvestments}
                                                onCheckedChange={(checked) => handleSettingChange('privacy', 'showInvestments', checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Mail className="h-5 w-5 text-green-600" />
                                            <span>Contact Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Allow Startup Contact</h4>
                                                <p className="text-sm text-gray-600">Allow startups to contact you directly</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.allowStartupContact}
                                                onCheckedChange={(checked) => handleSettingChange('privacy', 'allowStartupContact', checked)}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Allow Investor Contact</h4>
                                                <p className="text-sm text-gray-600">Allow other investors to contact you</p>
                                            </div>
                                            <Switch
                                                checked={settings.privacy.allowInvestorContact}
                                                onCheckedChange={(checked) => handleSettingChange('privacy', 'allowInvestorContact', checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Data Sharing */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <GlobeIcon className="h-5 w-5 text-purple-600" />
                                            <span>Data Sharing</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Data Sharing Level</label>
                                            <Select
                                                value={settings.privacy.dataSharing}
                                                onValueChange={(value) => handleSettingChange('privacy', 'dataSharing', value)}
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="minimal">Minimal</SelectItem>
                                                    <SelectItem value="standard">Standard</SelectItem>
                                                    <SelectItem value="enhanced">Enhanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Badge className={`mt-2 ${getDataSharingColor(settings.privacy.dataSharing)}`}>
                                                {settings.privacy.dataSharing}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                {/* Display Preferences */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Globe className="h-5 w-5 text-blue-600" />
                                            <span>Display Preferences</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                                            <Select
                                                value={settings.preferences.defaultView}
                                                onValueChange={(value) => handleSettingChange('preferences', 'defaultView', value)}
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dashboard">Dashboard</SelectItem>
                                                    <SelectItem value="investments">Investments</SelectItem>
                                                    <SelectItem value="discover">Discover</SelectItem>
                                                    <SelectItem value="analytics">Analytics</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Compact Mode</h4>
                                                <p className="text-sm text-gray-600">Use compact layout for better space utilization</p>
                                            </div>
                                            <Switch
                                                checked={settings.preferences.compactMode}
                                                onCheckedChange={(checked) => handleSettingChange('preferences', 'compactMode', checked)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                            <Select
                                                value={settings.preferences.theme}
                                                onValueChange={(value) => handleSettingChange('preferences', 'theme', value)}
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="auto">Auto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Auto-Refresh Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <RefreshCw className="h-5 w-5 text-green-600" />
                                            <span>Auto-Refresh Settings</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Auto-Refresh</h4>
                                                <p className="text-sm text-gray-600">Automatically refresh data at regular intervals</p>
                                            </div>
                                            <Switch
                                                checked={settings.preferences.autoRefresh}
                                                onCheckedChange={(checked) => handleSettingChange('preferences', 'autoRefresh', checked)}
                                            />
                                        </div>

                                        {settings.preferences.autoRefresh && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (minutes)</label>
                                                <Select
                                                    value={settings.preferences.refreshInterval.toString()}
                                                    onValueChange={(value) => handleSettingChange('preferences', 'refreshInterval', parseInt(value))}
                                                >
                                                    <SelectTrigger className="w-48">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">1 minute</SelectItem>
                                                        <SelectItem value="5">5 minutes</SelectItem>
                                                        <SelectItem value="15">15 minutes</SelectItem>
                                                        <SelectItem value="30">30 minutes</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
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
