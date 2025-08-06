"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    icon: LucideIcon;
    color: string;
    label?: string;
  };
  badge?: {
    text: string;
    color: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  subtitle,
  trend,
  badge
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        
        <div className="flex items-center justify-between">
          {subtitle && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </span>
          )}
          
          {trend && (
            <div className={`flex items-center space-x-1 ${trend.color}`}>
              <trend.icon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
                {trend.label && <span className="ml-1">({trend.label})</span>}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;