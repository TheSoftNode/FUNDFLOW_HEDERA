"use client";

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  onBack,
  onNext
}) => {
  if (currentStep >= totalSteps - 1) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="flex items-center space-x-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="group flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`group flex items-center space-x-2 px-6 py-2.5 rounded-lg font-bold transition-all duration-500 transform text-sm ${
            !canGoNext
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-purple-500/25 hover:scale-105'
          }`}
        >
          <span>{currentStep === totalSteps - 2 ? 'Complete Setup' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default NavigationControls;