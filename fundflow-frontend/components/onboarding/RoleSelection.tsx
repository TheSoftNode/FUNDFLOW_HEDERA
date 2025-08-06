"use client";

import React from 'react';
import { Users, Check } from 'lucide-react';

interface UserType {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  description: string;
  features: Array<{
    icon: any;
    text: string;
    detail: string;
  }>;
  stats: {
    primary: string;
    label: string;
    secondary: string;
    sublabel: string;
  };
  gradient: string;
  bg: string;
  ring: string;
}

interface RoleSelectionProps {
  userTypes: UserType[];
  selectedType: string | null;
  onSelect: (typeId: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ userTypes, selectedType, onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4 shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Choose Your Role
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Select your primary role to unlock a personalized experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {userTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`group relative cursor-pointer transition-all duration-500 ${
              selectedType === type.id
                ? 'transform scale-[1.01]'
                : 'hover:transform hover:scale-[1.005]'
            }`}
          >
            {/* Background Pattern */}
            <div className={`absolute inset-0 ${type.bg} rounded-2xl opacity-60 transition-opacity duration-300`} />
            
            {/* Selection Indicator */}
            {selectedType === type.id && (
              <>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <div className={`absolute inset-0 rounded-2xl ring-2 ${type.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`} />
              </>
            )}

            {/* Card Content */}
            <div className={`relative p-6 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border transition-all duration-300 ${
              selectedType === type.id
                ? 'border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-500/10'
                : 'border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 shadow-lg hover:shadow-xl'
            }`}>
              
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${type.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {type.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {type.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {type.stats.primary}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {type.stats.label}
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {type.stats.secondary}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {type.stats.sublabel}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                {type.description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-3">
                {type.features.map((feature, idx) => (
                  <div key={idx} className="group/feature flex items-start space-x-3 p-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                    <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm">
                      <feature.icon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.text}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {feature.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;