"use client";

import React from 'react';
import { CheckCircle, Activity, Rocket, Target, Users, Globe, LineChart, DollarSign, ArrowRight, ChevronDown } from 'lucide-react';

interface WelcomeStepProps {
  userType: string | null;
  onComplete: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ userType, onComplete }) => {
  const startupSteps = [
    {
      icon: Rocket,
      title: 'Create Your First Campaign',
      description: 'Set up milestone-based funding goals',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Target,
      title: 'Define Smart Milestones',
      description: 'Set transparent progress markers',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Connect with Global Investors',
      description: 'Access our network of 15,000+ investors',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];

  const investorSteps = [
    {
      icon: Globe,
      title: 'Browse Active Campaigns',
      description: 'Discover promising startups with AI',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: LineChart,
      title: 'Set Up Smart Portfolio',
      description: 'Track investments with analytics',
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      icon: DollarSign,
      title: 'Make Your First Investment',
      description: 'Start building your portfolio',
      gradient: 'from-emerald-500 to-green-600'
    }
  ];

  const steps = userType === 'startup' ? startupSteps : investorSteps;

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 mb-6 shadow-xl">
          <CheckCircle className="w-8 h-8 text-white" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 animate-ping opacity-20"></div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Welcome to FundFlow! 🎉
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Your account is ready. Let's start your {userType === 'startup' ? 'fundraising' : 'investment'} journey on the blockchain.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/90 via-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            What's Next?
          </h3>
        </div>
        <div className="grid gap-3 max-w-xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="group flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`w-10 h-10 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{step.description}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onComplete}
        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-purple-500/25 flex items-center space-x-2 mx-auto"
      >
        <span className="relative z-10">Launch Dashboard</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    </div>
  );
};

export default WelcomeStep;