"use client";

import React from 'react';
import { User, ChevronDown } from 'lucide-react';

interface UserData {
  name: string;
  company: string;
  role: string;
  experience: string;
}

interface PersonalInfoFormProps {
  userData: UserData;
  userType: string | null;
  onUpdate: (data: Partial<UserData>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ userData, userType, onUpdate }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 mb-4 shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Tell Us About Yourself
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Help us personalize your FundFlow experience
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {userType === 'startup' ? 'Company Name' : 'Organization'} *
              </label>
              <input
                type="text"
                value={userData.company}
                onChange={(e) => onUpdate({ company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                placeholder={userType === 'startup' ? 'Your startup name' : 'Your organization'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Role/Title *
            </label>
            <input
              type="text"
              value={userData.role}
              onChange={(e) => onUpdate({ role: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
              placeholder={userType === 'startup' ? 'e.g., CEO, CTO, Founder' : 'e.g., Angel Investor, VC Partner'}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Experience Level
            </label>
            <div className="relative">
              <select
                value={userData.experience}
                onChange={(e) => onUpdate({ experience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none transition-all duration-200 shadow-sm"
              >
                <option value="">Select experience level</option>
                <option value="first-time">First-time {userType === 'startup' ? 'founder' : 'investor'}</option>
                <option value="experienced">Some experience</option>
                <option value="veteran">Veteran {userType === 'startup' ? 'entrepreneur' : 'investor'}</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;