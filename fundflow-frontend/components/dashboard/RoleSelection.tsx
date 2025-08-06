"use client";

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  Rocket, 
  Users, 
  Target,
  DollarSign,
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoleSelection: React.FC = () => {
  const { user, setUserRole, updateProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = [
    {
      id: 'investor' as UserRole,
      title: 'Investor',
      subtitle: 'Discover & Fund Startups',
      description: 'Browse innovative campaigns, make investments, and track your portfolio performance with milestone-based funding.',
      icon: TrendingUp,
      color: 'from-blue-500 to-teal-400',
      features: [
        'Browse investment opportunities',
        'Track portfolio performance',
        'Participate in milestone voting',
        'Receive equity tokens',
        'Access detailed analytics'
      ]
    },
    {
      id: 'startup' as UserRole,
      title: 'Startup',
      subtitle: 'Raise Funds & Grow',
      description: 'Create fundraising campaigns, manage investors, track milestones, and build your company with transparent funding.',
      icon: Rocket,
      color: 'from-purple-500 to-pink-400',
      features: [
        'Create fundraising campaigns',
        'Manage investor relations',
        'Track milestone progress',
        'Receive Bitcoin-secured funding',
        'Access growth analytics'
      ]
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);
    try {
      // Set the user role
      setUserRole(selectedRole);
      
      // Initialize default profile based on role
      const defaultProfile = selectedRole === 'investor' 
        ? { isAccredited: false }
        : { companyName: '', industry: '' };
      
      updateProfile(defaultProfile);
      
      // Role is set, DashboardRouter will automatically redirect
    } catch (error) {
      console.error('Error setting user role:', error);
      alert('Failed to set user role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">FundFlow</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Choose your role to get started
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connected: {user?.walletAddress.slice(0, 6)}...{user?.walletAddress.slice(-4)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedRole === role.id
                  ? 'border-blue-500 ring-4 ring-blue-500/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Selection Indicator */}
              {selectedRole === role.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-6`}>
                <role.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {role.title}
                </h3>
                <p className={`text-sm font-medium mb-3 bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                  {role.subtitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {role.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                  What you can do:
                </h4>
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className={`px-8 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              selectedRole
                ? 'bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Setting up...
              </>
            ) : (
              <>
                Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title : 'User'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {selectedRole && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              You can change your role later in settings
            </p>
          )}
        </div>

        {/* Features Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure Funding</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bitcoin-level security with milestone-based releases
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Community Driven</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transparent governance with investor participation
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Analytics</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track performance and make data-driven decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;