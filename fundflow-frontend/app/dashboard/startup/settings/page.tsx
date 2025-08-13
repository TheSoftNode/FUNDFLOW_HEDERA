"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Building,
    Shield,
    Bell,
    CreditCard,
    Key,
    Trash2,
    Edit,
    Save,
    X,
    Camera,
    Settings,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    bio: string;
    location: string;
    website: string;
    linkedin: string;
    twitter: string;
    avatar: string;
}

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    investmentUpdates: boolean;
    milestoneAlerts: boolean;
    campaignUpdates: boolean;
    weeklyReports: boolean;
    marketingEmails: boolean;
}

interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
    passwordExpiry: number;
}

const mockProfile: UserProfile = {
    name: 'Alex Johnson',
    email: 'alex.johnson@startup.com',
    phone: '+1 (555) 123-4567',
    company: 'TechStart Inc.',
    position: 'Founder & CEO',
    bio: 'Passionate entrepreneur building the future of healthcare technology. Focused on AI-driven solutions that improve patient outcomes.',
    location: 'San Francisco, CA',
    website: 'https://techstart.com',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    twitter: 'https://twitter.com/alexjohnson',
    avatar: ''
};

const SettingsPage = () => {
    const router = useRouter();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('settings');
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>(mockProfile);
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        investmentUpdates: true,
        milestoneAlerts: true,
        campaignUpdates: true,
        weeklyReports: false,
        marketingEmails: false
    });
    const [security, setSecurity] = useState<SecuritySettings>({
        twoFactorAuth: true,
        sessionTimeout: 30,
        loginAlerts: true,
        passwordExpiry: 90
    });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId);
    };

    const handleSaveProfile = () => {
        // In a real app, this would update the backend
        console.log('Saving profile:', profile);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setProfile(mockProfile); // Reset to original
        setIsEditing(false);
    };

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        // In a real app, this would update the backend
        console.log('Changing password');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // In a real app, this would delete the account
            console.log('Deleting account');
        }
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
                            Account Settings
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Manage your profile, preferences, and account security settings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Profile Information */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl text-slate-900 dark:text-white">
                                                Profile Information
                                            </CardTitle>
                                            <CardDescription className="text-slate-600 dark:text-slate-400">
                                                Update your personal and company information
                                            </CardDescription>
                                        </div>
                                        {!isEditing ? (
                                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <Button onClick={handleSaveProfile}>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                                <Button onClick={handleCancelEdit} variant="outline">
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                {profile.avatar ? (
                                                    <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                                ) : (
                                                    <User className="w-10 h-10 text-slate-400" />
                                                )}
                                            </div>
                                            {isEditing && (
                                                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 w-8 h-8 p-0">
                                                    <Camera className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {profile.name}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {profile.position} at {profile.company}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="company">Company Name</Label>
                                            <Input
                                                id="company"
                                                value={profile.company}
                                                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Position</Label>
                                            <Input
                                                id="position"
                                                value={profile.position}
                                                onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={profile.location}
                                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="bg-white dark:bg-slate-900"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                value={profile.website}
                                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin">LinkedIn</Label>
                                            <Input
                                                id="linkedin"
                                                value={profile.linkedin}
                                                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                                disabled={!isEditing}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Password Change */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl text-slate-900 dark:text-white">
                                        Change Password
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Update your account password for enhanced security
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="bg-white dark:bg-slate-900 pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="bg-white dark:bg-slate-900"
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handlePasswordChange} className="w-full">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Change Password
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Settings */}
                        <div className="space-y-6">
                            {/* Notification Settings */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                                        <Bell className="w-5 h-5 inline mr-2" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Manage your notification preferences
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                                        <Switch
                                            id="emailNotifications"
                                            checked={notifications.emailNotifications}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                                        <Switch
                                            id="pushNotifications"
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="investmentUpdates">Investment Updates</Label>
                                        <Switch
                                            id="investmentUpdates"
                                            checked={notifications.investmentUpdates}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, investmentUpdates: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="milestoneAlerts">Milestone Alerts</Label>
                                        <Switch
                                            id="milestoneAlerts"
                                            checked={notifications.milestoneAlerts}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, milestoneAlerts: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="campaignUpdates">Campaign Updates</Label>
                                        <Switch
                                            id="campaignUpdates"
                                            checked={notifications.campaignUpdates}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, campaignUpdates: checked })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security Settings */}
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-lg text-slate-900 dark:text-white">
                                        <Shield className="w-5 h-5 inline mr-2" />
                                        Security
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Security and privacy settings
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                                        <Switch
                                            id="twoFactorAuth"
                                            checked={security.twoFactorAuth}
                                            onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="loginAlerts">Login Alerts</Label>
                                        <Switch
                                            id="loginAlerts"
                                            checked={security.loginAlerts}
                                            onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                                        />
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                        <Select value={security.sessionTimeout.toString()} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: parseInt(value) })}>
                                            <SelectTrigger>
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

                            {/* Danger Zone */}
                            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                <CardHeader>
                                    <CardTitle className="text-lg text-red-700 dark:text-red-300">
                                        <Trash2 className="w-5 h-5 inline mr-2" />
                                        Danger Zone
                                    </CardTitle>
                                    <CardDescription className="text-red-600 dark:text-red-400">
                                        Irreversible and destructive actions
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        className="w-full"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Account
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
