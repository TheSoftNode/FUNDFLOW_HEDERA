"use client"

import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Clock, 
  Target,
  Star,
  ArrowRight,
  MapPin,
  
} from 'lucide-react';

const BrowseCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // Filter campaigns based on search and category
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.founder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           campaign.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', name: 'All Categories', count: 147 },
    { id: 'ai', name: 'AI & Machine Learning', count: 42 },
    { id: 'blockchain', name: 'Blockchain', count: 38 },
    { id: 'fintech', name: 'FinTech', count: 28 },
    { id: 'healthtech', name: 'HealthTech', count: 22 },
    { id: 'edtech', name: 'EdTech', count: 17 }
  ];

  const campaigns = [
    {
      id: 1,
      title: "AI-Powered Healthcare Assistant",
      description: "Revolutionary AI platform that assists doctors in diagnosing diseases with 94% accuracy.",
      founder: "Dr. Sarah Chen",
      location: "San Francisco, CA",
      category: "AI & HealthTech",
      targetAmount: 2500000,
      raisedAmount: 1875000,
      progressPercentage: 75,
      investorCount: 234,
      daysLeft: 15,
      milestones: { completed: 3, total: 5 },
      featured: true,
      image: "/api/placeholder/400/240",
      tags: ["AI", "Healthcare", "SaaS"]
    },
    {
      id: 2,
      title: "Sustainable Energy Storage",
      description: "Next-generation battery technology for renewable energy storage with 80% efficiency improvement.",
      founder: "Michael Torres",
      location: "Austin, TX",
      category: "CleanTech",
      targetAmount: 5000000,
      raisedAmount: 3200000,
      progressPercentage: 64,
      investorCount: 187,
      daysLeft: 28,
      milestones: { completed: 2, total: 4 },
      featured: false,
      image: "/api/placeholder/400/240",
      tags: ["CleanTech", "Hardware", "Energy"]
    },
    {
      id: 3,
      title: "Decentralized Social Network",
      description: "Privacy-first social platform built on blockchain with user-owned data and content monetization.",
      founder: "Alex Kim",
      location: "Berlin, Germany",
      category: "Blockchain",
      targetAmount: 1800000,
      raisedAmount: 1260000,
      progressPercentage: 70,
      investorCount: 156,
      daysLeft: 42,
      milestones: { completed: 4, total: 6 },
      featured: true,
      image: "/api/placeholder/400/240",
      tags: ["Blockchain", "Social", "Web3"]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Campaigns</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover innovative startups and invest in the future
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="ending">Ending Soon</option>
              <option value="funded">Most Funded</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </p>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Campaign Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20">
                {campaign.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Featured</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                  {campaign.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-6">
                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Founder and Location */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {campaign.founder.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{campaign.founder}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {campaign.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(campaign.raisedAmount)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      of {formatCurrency(campaign.targetAmount)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {campaign.investorCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Investors</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {campaign.daysLeft}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days Left</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {campaign.milestones.completed}/{campaign.milestones.total}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Milestones</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button 
                  onClick={() => window.location.href = `/campaign/detail?id=${campaign.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>View Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSortBy('trending');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button 
            onClick={() => alert('Loading more campaigns...')}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
          >
            Load More Campaigns
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseCampaigns;