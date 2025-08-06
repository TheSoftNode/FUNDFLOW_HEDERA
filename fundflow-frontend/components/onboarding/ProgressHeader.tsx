"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  title: string;
  icon: any;
  description: string;
  progress: number;
}

interface ProgressHeaderProps {
  steps: Step[];
  currentStep: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ steps, currentStep }) => {
  return (
    <div className="z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`relative flex items-center space-x-2 ${
                  index === currentStep 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : index < currentStep 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-gray-400 dark:text-gray-500'
                }`}>
                  <div className={`relative w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    index === currentStep 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
                      : index < currentStep 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <step.icon className="w-3 h-3" />
                    )}
                    {index === currentStep && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-ping opacity-20"></div>
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold">{step.title}</div>
                    <div className="text-xs opacity-70">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden xl:block w-6 h-0.5 rounded-full transition-all duration-500 ${
                    index < currentStep 
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>
            <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;