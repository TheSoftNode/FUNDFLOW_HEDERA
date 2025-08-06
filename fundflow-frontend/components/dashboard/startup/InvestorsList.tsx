"use client";

import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Mail, 
  Calendar,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Investor {
  id: string;
  name: string;
  email: string;
  totalInvested: number;
  investmentDate: string;
  campaigns: number;
  avatar?: string;
  isAccredited: boolean;
}

const InvestorsList: React.FC = () => {
  // Mock investor data
  const investors: Investor[] = [
    {
      id: '1',
      name: 'Michael Rodriguez',
      email: 'michael.r@example.com',
      totalInvested: 25000,
      investmentDate: '2024-01-15',
      campaigns: 2,
      isAccredited: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      totalInvested: 15000,
      investmentDate: '2024-01-20',
      campaigns: 1,
      isAccredited: false
    },
    {
      id: '3',
      name: 'David Chen',
      email: 'david.c@example.com',
      totalInvested: 35000,
      investmentDate: '2024-01-08',
      campaigns: 2,
      isAccredited: true
    },
    {
      id: '4',
      name: 'Emily Watson',
      email: 'emily.w@example.com',
      totalInvested: 12000,
      investmentDate: '2024-01-25',
      campaigns: 1,
      isAccredited: false
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContactInvestor = (investor: Investor) => {
    alert(`Contact ${investor.name} feature coming soon!`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Top Investors</span>
          </h3>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All
          </button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {investors.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Investors</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(investors.reduce((sum, inv) => sum + inv.totalInvested, 0))}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Invested</div>
          </div>
        </div>
      </div>

      {/* Investors List */}
      <div className="p-4 lg:p-6">
        <div className="space-y-4">
          {investors.map((investor) => (
            <div key={investor.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {/* Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {getInitials(investor.name)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {investor.name}
                  </h4>
                  {investor.isAccredited && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Accredited Investor"></div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatCurrency(investor.totalInvested)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(investor.investmentDate)}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContactInvestor(investor)}
                className="flex-shrink-0"
              >
                <Mail className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => alert('Investor management coming soon!')}
          >
            <Users className="w-4 h-4 mr-2" />
            Manage Investors
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestorsList;