"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Rocket,
  Building2,
  DollarSign,
  BarChart3,
  Globe,
  User,
  Award,
  Shield,
  Zap,
  Star,
  Check,
  ChevronDown,
  BrainCircuit,
  Lock,
  Sparkles,
  Activity,
  LineChart
} from 'lucide-react';

const ConnectWalletOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [userData, setUserData] = useState({
    name: '',
    company: '',
    role: '',
    experience: ''
  });

  const {
    user,
    isConnected,
    setUserRole,
    updateProfile
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleStepTransition = (nextStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsAnimating(false);
    }, 200);
  };

  const onboardingSteps = [
    { title: 'Choose Your Role', icon: Users, description: 'Select your primary role', progress: 25 },
    { title: 'Personal Info', icon: User, description: 'Tell us about yourself', progress: 50 },
    { title: 'Interests & Goals', icon: Target, description: 'Personalize your experience', progress: 75 },
    { title: 'Welcome', icon: CheckCircle, description: 'You\'re all set', progress: 100 }
  ];

  const userTypes = [
    {
      id: 'startup',
      title: 'Startup Founder',
      subtitle: 'Raise Capital & Scale',
      icon: Rocket,
      description: 'Access milestone-based funding with transparent governance and automated equity distribution through smart contracts.',
      features: [
        { icon: Zap, text: 'Milestone-based campaigns', detail: 'Release funds based on verified achievements' },
        { icon: Globe, text: 'Global investor network', detail: 'Access international funding opportunities' },
        { icon: Shield, text: 'Automated equity distribution', detail: 'Smart contract-powered token allocation' },
        { icon: BarChart3, text: 'Real-time analytics', detail: 'AI-powered insights and optimization' }
      ],
      stats: { primary: '1,200+', label: 'Campaigns Funded', secondary: '$47M', sublabel: 'Total Raised' },
      gradient: 'from-blue-600 via-blue-700 to-indigo-800',
      bg: 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/10',
      ring: 'ring-blue-500/20'
    },
    {
      id: 'investor',
      title: 'Investor',
      subtitle: 'Discover & Fund Innovation',
      icon: TrendingUp,
      description: 'Find promising startups with reduced risk through milestone-based funding and community governance rights.',
      features: [
        { icon: BrainCircuit, text: 'AI-powered discovery', detail: 'Smart recommendations tailored to you' },
        { icon: Shield, text: 'Risk mitigation', detail: 'Milestone approval reduces investment risk' },
        { icon: Award, text: 'Portfolio tracking', detail: 'Advanced analytics and performance insights' },
        { icon: Users, text: 'Governance rights', detail: 'Vote on milestone completion' }
      ],
      stats: { primary: '15,000+', label: 'Active Investors', secondary: '23%', sublabel: 'Avg. Returns' },
      gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
      bg: 'bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/20 dark:from-emerald-950/20 dark:via-teal-950/15 dark:to-cyan-950/10',
      ring: 'ring-emerald-500/20'
    }
  ];

  const interests = {
    startup: [
      { id: 'ai-ml', label: 'AI/ML', icon: BrainCircuit, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      { id: 'blockchain', label: 'Blockchain', icon: Lock, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
      { id: 'fintech', label: 'FinTech', icon: DollarSign, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      { id: 'healthcare', label: 'Healthcare', icon: Shield, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
      { id: 'climate', label: 'Climate Tech', icon: Globe, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      { id: 'edtech', label: 'EdTech', icon: Award, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
      { id: 'gaming', label: 'Gaming', icon: Star, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
      { id: 'iot', label: 'IoT', icon: Zap, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
      { id: 'robotics', label: 'Robotics', icon: Target, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
      { id: 'consumer', label: 'Consumer', icon: Users, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' }
    ],
    investor: [
      { id: 'early-stage', label: 'Early Stage', icon: Rocket, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      { id: 'growth-stage', label: 'Growth Stage', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
      { id: 'deep-tech', label: 'Deep Tech', icon: BrainCircuit, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      { id: 'consumer-products', label: 'Consumer Products', icon: Users, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
      { id: 'b2b-saas', label: 'B2B SaaS', icon: Building2, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
      { id: 'hardware', label: 'Hardware', icon: Zap, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
      { id: 'sustainable-tech', label: 'Sustainable Tech', icon: Globe, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      { id: 'social-impact', label: 'Social Impact', icon: Shield, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' }
    ]
  };

  const goals = {
    startup: [
      { id: 'raise-seed', label: 'Raise Seed Funding', icon: DollarSign, desc: 'Initial capital for product development' },
      { id: 'find-investors', label: 'Find Strategic Investors', icon: Users, desc: 'Connect with industry experts' },
      { id: 'build-community', label: 'Build Community', icon: Globe, desc: 'Engage early adopters and users' },
      { id: 'scale-globally', label: 'Scale Globally', icon: TrendingUp, desc: 'Expand to international markets' },
      { id: 'launch-mvp', label: 'Launch MVP', icon: Rocket, desc: 'Deploy minimum viable product' },
      { id: 'series-a', label: 'Series A Preparation', icon: Award, desc: 'Ready for institutional funding' }
    ],
    investor: [
      { id: 'diversify-portfolio', label: 'Diversify Portfolio', icon: BarChart3, desc: 'Spread risk across sectors' },
      { id: 'find-unicorns', label: 'Find Future Unicorns', icon: Star, desc: 'Identify high-potential startups' },
      { id: 'support-innovation', label: 'Support Innovation', icon: BrainCircuit, desc: 'Back breakthrough technologies' },
      { id: 'generate-returns', label: 'Generate Returns', icon: TrendingUp, desc: 'Achieve target ROI goals' },
      { id: 'mentor-founders', label: 'Mentor Founders', icon: Users, desc: 'Share expertise and guidance' },
      { id: 'network-building', label: 'Network Building', icon: Globe, desc: 'Connect with ecosystem players' }
    ]
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      handleStepTransition(currentStep + 1);
    } else {
      // Complete onboarding - redirect to role-specific dashboard
      console.log('Completing onboarding, user role:', user?.role);
      if (user?.role === 'startup') {
        console.log('Redirecting to startup dashboard');
        router.push('/dashboard/startup');
      } else if (user?.role === 'investor') {
        console.log('Redirecting to investor dashboard');
        router.push('/dashboard/investor');
      } else {
        // Fallback to main dashboard if no role is set
        console.log('No role set, redirecting to main dashboard');
        router.push('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      handleStepTransition(currentStep - 1);
    }
  };

  const handleInterestToggle = (interestId: string) => {
    const updated = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    setSelectedInterests(updated);
  };

  const handleGoalToggle = (goalId: string) => {
    const updated = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    setSelectedGoals(updated);
  };

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
    updateProfile(data);
  };

  const isStepValid = () => {
    const isValid = (() => {
      switch (currentStep) {
        case 0:
          const hasRole = !!user?.role;
          console.log('Step 0 validation - user role:', user?.role, 'isValid:', hasRole);
          return hasRole;
        case 1:
          const hasInfo = !!(userData.name && userData.company && userData.role);
          console.log('Step 1 validation - hasInfo:', hasInfo);
          return hasInfo;
        case 2:
          const hasInterests = selectedInterests.length > 0 && selectedGoals.length > 0;
          console.log('Step 2 validation - interests:', selectedInterests.length, 'goals:', selectedGoals.length, 'isValid:', hasInterests);
          return hasInterests;
        default: return true;
      }
    })();
    console.log(`Step ${currentStep} validation result:`, isValid);
    return isValid;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Choose Your Role
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Select your primary role to unlock a personalized FundFlow experience
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    console.log('Setting user role to:', type.id);
                    setUserRole(type.id as 'startup' | 'investor');
                    // For demo: immediately navigate to dashboard
                    if (type.id === 'startup') {
                      router.push('/dashboard/startup');
                    } else if (type.id === 'investor') {
                      router.push('/dashboard/investor');
                    }
                  }}
                  className={`group relative cursor-pointer transition-all duration-500 ${user?.role === type.id
                    ? 'transform scale-[1.02]'
                    : 'hover:transform hover:scale-[1.01]'
                    }`}
                >
                  <div className={`absolute inset-0 ${type.bg} rounded-3xl opacity-60 transition-opacity duration-300`} />

                  {user?.role === type.id && (
                    <>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div className={`absolute inset-0 rounded-3xl ring-2 ${type.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`} />
                    </>
                  )}

                  <div className={`relative p-8 rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border transition-all duration-300 ${user?.role === type.id
                    ? 'border-blue-200 dark:border-blue-800 shadow-2xl shadow-blue-500/10'
                    : 'border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 shadow-xl hover:shadow-2xl'
                    }`}>

                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <type.icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {type.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {type.stats.primary}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {type.stats.label}
                        </div>
                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {type.stats.secondary}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.stats.sublabel}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base">
                      {type.description}
                    </p>

                    <div className="grid grid-cols-1 gap-4">
                      {type.features.map((feature, idx) => (
                        <div key={idx} className="group/feature flex items-start space-x-3 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                          <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm group-hover/feature:shadow-md transition-shadow duration-200">
                            <feature.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
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

      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Tell Us About Yourself
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Help us personalize your FundFlow experience
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => updateUserData({ name: e.target.value })}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {user?.role === 'startup' ? 'Company Name' : 'Organization'} *
                    </label>
                    <input
                      type="text"
                      value={userData.company}
                      onChange={(e) => updateUserData({ company: e.target.value })}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                      placeholder={user?.role === 'startup' ? 'Your startup name' : 'Your organization'}
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
                    onChange={(e) => updateUserData({ role: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                    placeholder={user?.role === 'startup' ? 'e.g., CEO, CTO, Founder' : 'e.g., Angel Investor, VC Partner'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Experience Level
                  </label>
                  <div className="relative">
                    <select
                      value={userData.experience}
                      onChange={(e) => updateUserData({ experience: e.target.value })}
                      className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none transition-all duration-200 shadow-sm"
                    >
                      <option value="">Select experience level</option>
                      <option value="first-time">First-time {user?.role === 'startup' ? 'founder' : 'investor'}</option>
                      <option value="experienced">Some experience</option>
                      <option value="veteran">Veteran {user?.role === 'startup' ? 'entrepreneur' : 'investor'}</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        const currentInterests = interests[user?.role as keyof typeof interests] || [];
        const currentGoals = goals[user?.role as keyof typeof goals] || [];

        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Interests & Goals
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Help us recommend the best {user?.role === 'startup' ? 'investors' : 'opportunities'} for you
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Industries of Interest
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentInterests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 ${selectedInterests.includes(interest.id)
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                        }`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedInterests.includes(interest.id)
                          ? 'bg-blue-500 text-white shadow-lg'
                          : `${interest.color} group-hover:scale-110`
                          }`}>
                          <interest.icon className="w-6 h-6" />
                        </div>
                        <span className={`text-sm font-semibold text-center transition-colors duration-300 ${selectedInterests.includes(interest.id)
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                          }`}>
                          {interest.label}
                        </span>
                      </div>
                      {selectedInterests.includes(interest.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Primary Goals
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentGoals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-300 ${selectedGoals.includes(goal.id)
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${selectedGoals.includes(goal.id)
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/20'
                          }`}>
                          <goal.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-base mb-1 transition-colors duration-300 ${selectedGoals.includes(goal.id)
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-gray-900 dark:text-white'
                            }`}>
                            {goal.label}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {goal.desc}
                          </div>
                        </div>
                      </div>
                      {selectedGoals.includes(goal.id) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 mb-8 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 animate-ping opacity-20"></div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                Welcome to FundFlow! 🎉
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your account is ready. Let's start your {user?.role === 'startup' ? 'fundraising' : 'investment'} journey on the blockchain.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/90 via-gray-50/90 to-blue-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-2xl mb-10">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  What's Next?
                </h3>
              </div>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {user?.role === 'startup' ? (
                  <>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Rocket className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Create Your First Campaign</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Set up milestone-based funding goals and timeline</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Define Smart Milestones</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Set transparent progress markers with automated fund release</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Connect with Global Investors</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Access our network of 15,000+ active investors</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Browse Active Campaigns</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Discover promising startups with AI-powered recommendations</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <LineChart className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Set Up Smart Portfolio</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Track investments with advanced analytics and insights</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="group flex items-center space-x-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-100/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">Make Your First Investment</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Start building your diversified crypto portfolio</div>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-3 mx-auto"
            >
              <span className="relative z-10">Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20">
        <div className="text-center p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            Please connect your Stacks wallet to continue with the onboarding process.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-700/60 top-0 shadow-lg shadow-gray-900/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {onboardingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`relative flex items-center space-x-3 ${index === currentStep
                    ? 'text-blue-600 dark:text-blue-400'
                    : index < currentStep
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400 dark:text-gray-500'
                    }`}>
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${index === currentStep
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                      : index < currentStep
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                      }`}>
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                      {index === currentStep && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-bold">{step.title}</div>
                      <div className="text-xs opacity-70">{step.description}</div>
                    </div>
                  </div>
                  {index < onboardingSteps.length - 1 && (
                    <div className={`hidden xl:block w-12 h-1 rounded-full transition-all duration-500 ${index < currentStep
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {currentStep + 1} of {onboardingSteps.length}
              </span>
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            {renderStepContent()}
          </div>
        </div>
      </div>

      {currentStep < 3 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="group flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`group flex items-center space-x-2 px-8 py-3 rounded-xl font-bold transition-all duration-500 transform ${!isStepValid()
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-purple-500/25 hover:scale-105'
                }`}
            >
              <span>{currentStep === 2 ? 'Complete Setup' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletOnboarding;