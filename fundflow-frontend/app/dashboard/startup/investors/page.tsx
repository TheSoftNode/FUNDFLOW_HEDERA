"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  totalInvested: number;
  investmentCount: number;
  lastInvestment: string;
  status: 'active' | 'inactive' | 'prospect' | 'lead';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  preferredSectors: string[];
  notes: string;
  tags: string[];
  createdAt: string;
  lastContact: string;
}

const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Ventures',
    position: 'Managing Partner',
    location: 'San Francisco, CA',
    totalInvested: 50000,
    investmentCount: 3,
    lastInvestment: '2024-01-15T00:00:00Z',
    status: 'active',
    riskProfile: 'moderate',
    preferredSectors: ['Healthcare', 'AI/ML', 'Fintech'],
    notes: 'Experienced investor with strong healthcare background. Very responsive to communications.',
    tags: ['Healthcare Expert', 'High Net Worth', 'Strategic Partner'],
    createdAt: '2023-06-15T00:00:00Z',
    lastContact: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@greenenergy.com',
    phone: '+1 (555) 234-5678',
    company: 'Green Energy Capital',
    position: 'Investment Director',
    location: 'Boston, MA',
    totalInvested: 75000,
    investmentCount: 2,
    lastInvestment: '2024-01-10T00:00:00Z',
    status: 'active',
    riskProfile: 'aggressive',
    preferredSectors: ['Clean Energy', 'Sustainability', 'Transportation'],
    notes: 'Passionate about environmental impact. Looking for scalable clean energy solutions.',
    tags: ['Clean Energy', 'ESG Focus', 'Growth Investor'],
    createdAt: '2023-08-20T00:00:00Z',
    lastContact: '2024-01-18T00:00:00Z'
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@angelinvestors.com',
    phone: '+1 (555) 345-6789',
    company: 'Angel Investors Network',
    position: 'Angel Investor',
    location: 'Seattle, WA',
    totalInvested: 25000,
    investmentCount: 1,
    lastInvestment: '2024-01-05T00:00:00Z',
    status: 'active',
    riskProfile: 'conservative',
    preferredSectors: ['EdTech', 'Healthcare', 'Enterprise Software'],
    notes: 'Former tech executive. Prefers proven business models with clear revenue paths.',
    tags: ['Tech Executive', 'Conservative', 'Mentor'],
    createdAt: '2023-10-10T00:00:00Z',
    lastContact: '2024-01-15T00:00:00Z'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@startupfund.com',
    phone: '+1 (555) 456-7890',
    company: 'Startup Fund LLC',
    position: 'Principal',
    location: 'Austin, TX',
    totalInvested: 0,
    investmentCount: 0,
    lastInvestment: '',
    status: 'prospect',
    riskProfile: 'moderate',
    preferredSectors: ['SaaS', 'Marketplace', 'Mobile Apps'],
    notes: 'Interested in early-stage SaaS companies. Scheduled for demo next week.',
    tags: ['SaaS Focus', 'Early Stage', 'Demo Scheduled'],
    createdAt: '2024-01-01T00:00:00Z',
    lastContact: '2024-01-22T00:00:00Z'
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@venturepartners.com',
    phone: '+1 (555) 567-8901',
    company: 'Venture Partners',
    position: 'Partner',
    location: 'New York, NY',
    totalInvested: 100000,
    investmentCount: 4,
    lastInvestment: '2024-01-12T00:00:00Z',
    status: 'active',
    riskProfile: 'aggressive',
    preferredSectors: ['AI/ML', 'Robotics', 'Quantum Computing'],
    notes: 'Deep tech investor with strong technical background. Values innovation over immediate returns.',
    tags: ['Deep Tech', 'Technical Expert', 'Innovation Focus'],
    createdAt: '2023-05-01T00:00:00Z',
    lastContact: '2024-01-19T00:00:00Z'
  }
];

const InvestorsPage = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('investors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRiskProfile, setSelectedRiskProfile] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const filteredInvestors = mockInvestors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || investor.status === selectedStatus;
    const matchesRiskProfile = selectedRiskProfile === 'all' || investor.riskProfile === selectedRiskProfile;
    const matchesSector = selectedSector === 'all' || investor.preferredSectors.includes(selectedSector);

    return matchesSearch && matchesStatus && matchesRiskProfile && matchesSector;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'prospect': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'lead': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getRiskProfileColor = (riskProfile: string) => {
    switch (riskProfile) {
      case 'conservative': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'aggressive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalInvestors = mockInvestors.length;
  const activeInvestors = mockInvestors.filter(i => i.status === 'active').length;
  const totalInvested = mockInvestors.reduce((sum, i) => sum + i.totalInvested, 0);
  const avgInvestment = totalInvested / mockInvestors.filter(i => i.totalInvested > 0).length;

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
              Investors & Partners
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your investor relationships and track investment activities
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Investors
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalInvestors}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All investors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Active Investors
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeInvestors}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Currently investing
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Invested
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(totalInvested)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  From all investors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg. Investment
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(avgInvestment)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Per active investor
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search investors..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>

                {/* Risk Profile Filter */}
                <Select value={selectedRiskProfile} onValueChange={setSelectedRiskProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Risk Profiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Profiles</SelectItem>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sector Filter */}
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Clean Energy">Clean Energy</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Investors List */}
          <div className="space-y-6">
            {filteredInvestors.map((investor) => (
              <Card key={investor.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {investor.name.split(' ').map(n => n[0]).join('')}
                      </div>

                      {/* Investor Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {investor.name}
                          </h3>
                          <Badge className={getStatusColor(investor.status)}>
                            {investor.status.charAt(0).toUpperCase() + investor.status.slice(1)}
                          </Badge>
                          <Badge className={getRiskProfileColor(investor.riskProfile)}>
                            {investor.riskProfile.charAt(0).toUpperCase() + investor.riskProfile.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          {investor.position} at {investor.company}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {investor.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {investor.phone}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {investor.location}
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
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-purple-600">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(investor.totalInvested)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Total Invested
                      </div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {investor.investmentCount}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Investments
                      </div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatDate(investor.lastInvestment)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Last Investment
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Preferred Sectors:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {investor.preferredSectors.map((sector) => (
                          <Badge key={sector} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Tags:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {investor.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {investor.notes && (
                      <div className="md:col-span-2">
                        <span className="text-slate-600 dark:text-slate-400">Notes:</span>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {investor.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <span>Investor since: {formatDate(investor.createdAt)}</span>
                      <span>Last contact: {formatDate(investor.lastContact)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredInvestors.length === 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No investors found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {searchTerm || selectedStatus !== 'all' || selectedRiskProfile !== 'all' || selectedSector !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'No investors have been added yet.'
                    }
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Investor
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

export default InvestorsPage;
