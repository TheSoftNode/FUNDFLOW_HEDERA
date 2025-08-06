"use client";

import React from 'react';
import { Target, Sparkles, Check } from 'lucide-react';

interface Interest {
  id: string;
  label: string;
  icon: any;
  color: string;
}

interface Goal {
  id: string;
  label: string;
  icon: any;
  desc: string;
}

interface InterestsGoalsProps {
  interests: Interest[];
  goals: Goal[];
  selectedInterests: string[];
  selectedGoals: string[];
  userType: string | null;
  onInterestToggle: (id: string) => void;
  onGoalToggle: (id: string) => void;
}

const InterestsGoals: React.FC<InterestsGoalsProps> = ({
  interests,
  goals,
  selectedInterests,
  selectedGoals,
  userType,
  onInterestToggle,
  onGoalToggle
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 mb-4 shadow-lg">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Interests & Goals
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us recommend the best {userType === 'startup' ? 'investors' : 'opportunities'} for you
        </p>
      </div>

      <div className="space-y-6">
        {/* Interests Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Industries of Interest
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => onInterestToggle(interest.id)}
                className={`group relative p-3 rounded-xl border-2 transition-all duration-300 ${
                  selectedInterests.includes(interest.id)
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-blue-500 text-white shadow-lg'
                      : `${interest.color} group-hover:scale-110`
                  }`}>
                    <interest.icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-semibold text-center transition-colors duration-300 ${
                    selectedInterests.includes(interest.id)
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {interest.label}
                  </span>
                </div>
                {selectedInterests.includes(interest.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Primary Goals
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => onGoalToggle(goal.id)}
                className={`group relative p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                  selectedGoals.includes(goal.id)
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    selectedGoals.includes(goal.id)
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20'
                  }`}>
                    <goal.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                      selectedGoals.includes(goal.id)
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {goal.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {goal.desc}
                    </div>
                  </div>
                </div>
                {selectedGoals.includes(goal.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsGoals;