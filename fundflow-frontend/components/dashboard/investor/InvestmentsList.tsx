"use client";

import React, { useState } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FilterSelect from '@/components/dashboard/shared/FilterSelect';
import InvestmentCard from '@/components/investment/InvestmentCard';

interface Investment {
  id: number;
  campaignTitle: string;
  investedAmount: number;
  currentValue: number;
  equityTokens: number;
  investmentDate: string;
  status: 'active' | 'completed' | 'milestone_pending';
  progress: number;
  lastUpdate: string;
  category: string;
  founder: string;
  riskLevel: 'low' | 'medium' | 'high';
  milestones: {
    completed: number;
    total: number;
  };
}

interface InvestmentsListProps {
  investments: Investment[];
  onViewDetails: (investment: Investment) => void;
}

const InvestmentsList: React.FC<InvestmentsListProps> = ({
  investments,
  onViewDetails
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'milestone_pending', label: 'Pending Milestones' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'AI', label: 'AI & Machine Learning' },
    { value: 'Blockchain', label: 'Blockchain' },
    { value: 'HealthTech', label: 'HealthTech' },
    { value: 'CleanTech', label: 'CleanTech' },
    { value: 'FinTech', label: 'FinTech' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Investment Date' },
    { value: 'amount', label: 'Investment Amount' },
    { value: 'return', label: 'Return %' },
    { value: 'progress', label: 'Progress' }
  ];

  // Filter and sort investments
  const filteredInvestments = investments.filter(investment => {
    const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || investment.category.includes(categoryFilter);
    const matchesSearch = searchTerm === '' || 
      investment.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.founder.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.investedAmount - a.investedAmount;
      case 'return':
        const returnA = ((a.currentValue - a.investedAmount) / a.investedAmount) * 100;
        const returnB = ((b.currentValue - b.investedAmount) / b.investedAmount) * 100;
        return returnB - returnA;
      case 'progress':
        return b.progress - a.progress;
      default:
        return new Date(b.investmentDate).getTime() - new Date(a.investmentDate).getTime();
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Investments
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredInvestments.length} of {investments.length} investments
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-2 lg:space-y-0">
            {/* Search */}
            <div className="relative min-w-0 flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Status Filter */}
            <FilterSelect
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />

            {/* Category Filter */}
            <FilterSelect
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Category"
            />

            {/* Sort By */}
            <FilterSelect
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredInvestments.length > 0 ? (
          filteredInvestments.map((investment) => (
            <InvestmentCard
              key={investment.id}
              investment={investment}
              onViewDetails={() => onViewDetails(investment)}
            />
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No investments found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <Button 
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
                setSearchTerm('');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsList;