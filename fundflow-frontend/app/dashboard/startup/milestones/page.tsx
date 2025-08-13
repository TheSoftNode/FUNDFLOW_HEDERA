"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Share2,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import StartupSidebar from '@/components/dashboard/startup/StartupSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

interface Milestone {
  id: string;
  title: string;
  description: string;
  campaignId: string;
  campaignTitle: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  completionDate?: string;
  progress: number;
  budget: number;
  spent: number;
  assignedTo: string;
  dependencies: string[];
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

const mockMilestones: Milestone[] = [
  {
    id: '1',
    title: 'Complete MVP Development',
    description: 'Finish the minimum viable product with core features including user authentication, campaign creation, and basic investment tracking.',
    campaignId: '1',
    campaignTitle: 'AI Healthcare Platform',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-10T00:00:00Z',
    completionDate: '2024-01-08T00:00:00Z',
    progress: 100,
    budget: 50000,
    spent: 48500,
    assignedTo: 'Development Team',
    dependencies: [],
    notes: 'Successfully completed ahead of schedule. All core features are working as expected.',
    attachments: ['mvp-specs.pdf', 'test-results.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '2',
    title: 'User Testing & Feedback',
    description: 'Conduct comprehensive user testing with 50+ participants and gather feedback for improvements.',
    campaignId: '1',
    campaignTitle: 'AI Healthcare Platform',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-01-25T00:00:00Z',
    progress: 65,
    budget: 15000,
    spent: 9750,
    assignedTo: 'UX Team',
    dependencies: ['1'],
    notes: 'Testing phase is going well. 35 participants completed, 15 in progress. Initial feedback is positive.',
    attachments: ['user-testing-plan.pdf', 'feedback-summary.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'Regulatory Compliance Review',
    description: 'Complete healthcare industry compliance review and obtain necessary certifications.',
    campaignId: '1',
    campaignTitle: 'AI Healthcare Platform',
    status: 'not-started',
    priority: 'critical',
    dueDate: '2024-02-15T00:00:00Z',
    progress: 0,
    budget: 25000,
    spent: 0,
    assignedTo: 'Legal Team',
    dependencies: ['1', '2'],
    notes: 'Waiting for MVP completion and user testing results before proceeding.',
    attachments: ['compliance-checklist.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Market Research & Analysis',
    description: 'Conduct comprehensive market research to identify target segments and competitive landscape.',
    campaignId: '2',
    campaignTitle: 'Sustainable Energy Storage',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-05T00:00:00Z',
    completionDate: '2024-01-03T00:00:00Z',
    progress: 100,
    budget: 20000,
    spent: 18750,
    assignedTo: 'Marketing Team',
    dependencies: [],
    notes: 'Market analysis complete. Identified 3 primary target segments with high growth potential.',
    attachments: ['market-research-report.pdf', 'competitive-analysis.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '5',
    title: 'Prototype Development',
    description: 'Develop working prototype of the energy storage system for demonstration purposes.',
    campaignId: '2',
    campaignTitle: 'Sustainable Energy Storage',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-02-01T00:00:00Z',
    progress: 40,
    budget: 75000,
    spent: 30000,
    assignedTo: 'Engineering Team',
    dependencies: ['4'],
    notes: 'Core components assembled. Testing phase beginning next week.',
    attachments: ['prototype-specs.pdf', 'component-list.pdf'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

const MilestonesPage = () => {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('milestones');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleItemClick = (itemId: string) => {
    setActiveNavItem(itemId);
  };

  const filteredMilestones = mockMilestones.filter(milestone => {
    const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || milestone.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || milestone.priority === selectedPriority;
    const matchesCampaign = selectedCampaign === 'all' || milestone.campaignId === selectedCampaign;

    return matchesSearch && matchesStatus && matchesPriority && matchesCampaign;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'not-started': return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'not-started': return <Target className="w-5 h-5 text-slate-600" />;
      case 'overdue': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'paused': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    if (progress >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const totalMilestones = mockMilestones.length;
  const completedMilestones = mockMilestones.filter(m => m.status === 'completed').length;
  const inProgressMilestones = mockMilestones.filter(m => m.status === 'in-progress').length;
  const overdueMilestones = mockMilestones.filter(m => m.status === 'overdue').length;
  const totalBudget = mockMilestones.reduce((sum, m) => sum + m.budget, 0);
  const totalSpent = mockMilestones.reduce((sum, m) => sum + m.spent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
      <DashboardNavbar />
      <StartupSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem={activeNavItem}
        onItemClick={handleItemClick}
        userName="Startup Founder"
        userRole="Startup Founder"
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Main Content */}
        <main className="pt-10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Milestones & Progress
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Track and manage your campaign milestones to ensure successful delivery
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="w-5 h-5 mr-2" />
              Create Milestone
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Milestones
                </CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalMilestones}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Across all campaigns
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
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedMilestones}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{inProgressMilestones}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Budget
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(totalBudget)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(totalSpent)} spent
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Overdue
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{overdueMilestones}</div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input
                  placeholder="Search milestones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white dark:bg-slate-900"
                />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Campaigns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    <SelectItem value="1">AI Healthcare Platform</SelectItem>
                    <SelectItem value="2">Sustainable Energy Storage</SelectItem>
                    <SelectItem value="3">EdTech Learning Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Milestones List */}
          <div className="space-y-6">
            {filteredMilestones.map((milestone) => (
              <Card key={milestone.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(milestone.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                            {milestone.title}
                          </h3>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(milestone.priority)}>
                            {milestone.priority}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                          {milestone.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {formatDate(milestone.dueDate)}
                            {milestone.status !== 'completed' && (
                              <span className={`ml-2 px-2 py-1 rounded text-xs ${getDaysUntilDue(milestone.dueDate) < 0
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                : getDaysUntilDue(milestone.dueDate) <= 7
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                }`}>
                                {getDaysUntilDue(milestone.dueDate) < 0
                                  ? `${Math.abs(getDaysUntilDue(milestone.dueDate))} days overdue`
                                  : getDaysUntilDue(milestone.dueDate) === 0
                                    ? 'Due today'
                                    : `${getDaysUntilDue(milestone.dueDate)} days left`
                                }
                              </span>
                            )}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {milestone.assignedTo}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {formatCurrency(milestone.spent)} / {formatCurrency(milestone.budget)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {milestone.progress}%
                      </span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Campaign:</span>
                      <span className="ml-2 font-medium text-slate-900 dark:text-white">
                        {milestone.campaignTitle}
                      </span>
                    </div>
                    {milestone.dependencies.length > 0 && (
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Dependencies:</span>
                        <span className="ml-2 font-medium text-slate-900 dark:text-white">
                          {milestone.dependencies.join(', ')}
                        </span>
                      </div>
                    )}
                    {milestone.notes && (
                      <div className="md:col-span-2">
                        <span className="text-slate-600 dark:text-slate-400">Notes:</span>
                        <span className="ml-2 text-slate-900 dark:text-white">
                          {milestone.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredMilestones.length === 0 && (
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No milestones found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {searchTerm || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedCampaign !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'No milestones have been created yet.'
                    }
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Milestone
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

export default MilestonesPage;
