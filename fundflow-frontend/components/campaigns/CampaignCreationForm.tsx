"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    Rocket,
    Target,
    Calendar,
    DollarSign,
    FileText,
    Tag,
    Plus,
    X,
    Save,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CampaignFormData {
    title: string;
    description: string;
    longDescription: string;
    targetAmount: string;
    deadline: string;
    category: string;
    industry: string;
    tags: string[];
    milestones: MilestoneData[];
}

interface MilestoneData {
    title: string;
    description: string;
    targetAmount: string;
    expectedCompletionDate: string;
    deliverables: string[];
}

const CampaignCreationForm = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [newMilestone, setNewMilestone] = useState<MilestoneData>({
        title: '',
        description: '',
        targetAmount: '',
        expectedCompletionDate: '',
        deliverables: []
    });

    const [formData, setFormData] = useState<CampaignFormData>({
        title: '',
        description: '',
        longDescription: '',
        targetAmount: '',
        deadline: '',
        category: '',
        industry: '',
        tags: [],
        milestones: []
    });

    const categories = [
        'Technology', 'Healthcare', 'Finance', 'Gaming', 'Education', 'Other'
    ];

    const industries = [
        'AI/ML', 'Blockchain', 'FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'Consumer', 'B2B SaaS'
    ];

    const handleInputChange = (field: keyof CampaignFormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
    };

    const handleAddMilestone = () => {
        if (newMilestone.title && newMilestone.description && newMilestone.targetAmount) {
            setFormData(prev => ({ ...prev, milestones: [...prev.milestones, { ...newMilestone }] }));
            setNewMilestone({
                title: '',
                description: '',
                targetAmount: '',
                expectedCompletionDate: '',
                deliverables: []
            });
        }
    };

    const handleRemoveMilestone = (index: number) => {
        setFormData(prev => ({ ...prev, milestones: prev.milestones.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.walletAddress) {
            alert('Please connect your wallet first');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create campaign on blockchain first
            const campaignData = {
                title: formData.title,
                description: formData.description,
                longDescription: formData.longDescription,
                targetAmount: parseInt(formData.targetAmount),
                deadline: new Date(formData.deadline).toISOString(),
                category: formData.category,
                industry: formData.industry,
                tags: formData.tags,
                milestones: formData.milestones,
                creatorAddress: user.walletAddress,
                chainId: 296, // Hedera testnet
            };

            // TODO: Call backend API to create campaign
            const response = await fetch('/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(campaignData),
            });

            if (response.ok) {
                const result = await response.json();
                router.push(`/dashboard/startup/campaigns`);
            } else {
                throw new Error('Failed to create campaign');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        return (
            formData.title &&
            formData.description &&
            formData.targetAmount &&
            formData.deadline &&
            formData.category &&
            formData.industry &&
            formData.milestones.length > 0
        );
    };

    return (
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                        <Rocket className="w-6 h-6 text-blue-600" />
                        <span>Campaign Details</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Campaign Title *
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter campaign title"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Category *
                            </label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Industry *
                            </label>
                            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industries.map((industry) => (
                                        <SelectItem key={industry} value={industry}>
                                            {industry}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Target Amount (HBAR) *
                            </label>
                            <Input
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                                placeholder="Enter target amount"
                                className="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Deadline *
                            </label>
                            <Input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => handleInputChange('deadline', e.target.value)}
                                className="w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Short Description *
                        </label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Brief description of your campaign"
                            className="w-full"
                            rows={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Detailed Description
                        </label>
                        <Textarea
                            value={formData.longDescription}
                            onChange={(e) => handleInputChange('longDescription', e.target.value)}
                            placeholder="Detailed description, business plan, etc."
                            className="w-full"
                            rows={5}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-emerald-600" />
                        <span>Tags</span>
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-2 hover:text-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>

                    <div className="flex space-x-2">
                        <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            className="flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Milestones */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        <span>Milestones</span>
                    </h3>

                    {formData.milestones.map((milestone, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Milestone {index + 1}: {milestone.title}
                                </h4>
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveMilestone(index)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Title
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">{milestone.title}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Target Amount
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">{milestone.targetAmount} HBAR</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Expected Completion
                                    </label>
                                    <p className="text-slate-900 dark:text-white font-medium">{milestone.expectedCompletionDate}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                        Description
                                    </label>
                                    <p className="text-slate-700 dark:text-slate-300">{milestone.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-600">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Add New Milestone</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Title *
                                </label>
                                <Input
                                    value={newMilestone.title}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Milestone title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Target Amount (HBAR) *
                                </label>
                                <Input
                                    type="number"
                                    value={newMilestone.targetAmount}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, targetAmount: e.target.value }))}
                                    placeholder="Amount"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Expected Completion Date *
                                </label>
                                <Input
                                    type="date"
                                    value={newMilestone.expectedCompletionDate}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, expectedCompletionDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                    Description *
                                </label>
                                <Textarea
                                    value={newMilestone.description}
                                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Milestone description"
                                    rows={2}
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddMilestone}
                            variant="outline"
                            className="w-full"
                            disabled={!newMilestone.title || !newMilestone.description || !newMilestone.targetAmount}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Milestone
                        </Button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="px-8 py-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!isFormValid() || isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating Campaign...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Campaign
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CampaignCreationForm;
