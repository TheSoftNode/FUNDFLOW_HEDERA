"use client";

import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const RevenueChart: React.FC = () => {
  // Mock revenue data
  const revenueMetrics = [
    { label: 'This Month', value: '$45,200', positive: true },
    { label: 'Last Month', value: '$38,750', positive: true },
    { label: 'Avg. Monthly', value: '$41,975', positive: true },
    { label: 'Growth Rate', value: '+16.7%', positive: true },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Revenue Tracking</span>
        </h3>
        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+16.7%</span>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {revenueMetrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {metric.label}
            </span>
            <div className="text-right">
              <span className={`font-semibold ${
                metric.positive !== false 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="h-24 lg:h-32 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Revenue Chart
          </p>
          <p className="text-xs text-gray-400">
            Chart integration pending
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;