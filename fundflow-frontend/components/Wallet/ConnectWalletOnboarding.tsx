"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/hooks/useAuth';
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
    }, 300);
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
          return user?.role;
        case 1:
          return userData.name && userData.company && userData.role && userData.experience;
        case 2:
          return selectedInterests.length > 0 && selectedGoals.length > 0;
        default:
          return true;
      }
    })();
    return isValid;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
                Choose Your Path
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Select your primary role to customize your FundFlow experience and unlock relevant features
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
              {userTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    setUserRole(type.id as UserRole);
                  }}
                  className={`group relative cursor-pointer transition-all duration-500 transform hover:scale-105 ${user?.role === type.id ? 'scale-105' : 'hover:scale-102'
                    }`}
                >
                  <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 border-2 transition-all duration-500 ${user?.role === type.id
                    ? 'border-blue-500 shadow-2xl shadow-blue-500/25'
                    : 'border-transparent hover:border-slate-300/50 dark:hover:border-slate-600/50'
                    } ${type.bg}`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent"></div>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 text-center mb-8">
                      <div className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-2xl`}>
                        <type.icon className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        {type.title}
                      </h2>
                      <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-medium">
                        {type.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed mb-8 text-center">
                      {type.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0`}>
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-lg">
                              {feature.text}
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300 text-sm">
                              {feature.detail}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent">
                          {type.stats.primary}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {type.stats.label}
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r ${type.gradient} bg-clip-text text-transparent">
                          {type.stats.secondary}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {type.stats.sublabel}
                        </div>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {user?.role === type.id && (
                      <div className="absolute top-6 right-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
                Tell Us About Yourself
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Help us personalize your experience and connect you with the right opportunities
              </p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-slate-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => updateUserData({ name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-6 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    value={userData.company}
                    onChange={(e) => updateUserData({ company: e.target.value })}
                    placeholder="Enter company name"
                    className="w-full px-6 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={userData.role}
                    onChange={(e) => updateUserData({ role: e.target.value })}
                    placeholder="Enter your job title"
                    className="w-full px-6 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Experience Level
                  </label>
                  <select
                    value={userData.experience}
                    onChange={(e) => updateUserData({ experience: e.target.value })}
                    className="w-full px-6 py-4 bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select experience level</option>
                    <option value="first-time">First-time founder</option>
                    <option value="experienced">Experienced entrepreneur</option>
                    <option value="veteran">Veteran founder</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
                Personalize Your Experience
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select your interests and goals to help us tailor your dashboard and recommendations
              </p>
            </div>

            <div className="space-y-12">
              {/* Interests Section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-slate-700/50">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                  What interests you?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {interests[user?.role as keyof typeof interests]?.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedInterests.includes(interest.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/25'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-2xl ${interest.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <interest.icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {interest.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals Section */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20 dark:border-slate-700/50">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                  What are your goals?
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {goals[user?.role as keyof typeof goals]?.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => handleGoalToggle(goal.id)}
                      className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${selectedGoals.includes(goal.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/25'
                        : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <goal.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">
                            {goal.label}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            {goal.desc}
                          </p>
                        </div>
                      </div>
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
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-12 lg:p-16 shadow-2xl border border-white/20 dark:border-slate-700/50">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-700 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent mb-6">
                Welcome to FundFlow!
              </h1>

              <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Your account has been set up successfully. You're now ready to start your journey in the world of blockchain-powered fundraising.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  What's Next?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Explore your dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Complete your profile</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Start your first campaign</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <span className="text-slate-700 dark:text-slate-200">Connect with investors</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-2xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-700/60 top-0 shadow-lg shadow-slate-900/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {onboardingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`relative flex items-center space-x-3 ${index === currentStep
                    ? 'text-blue-600 dark:text-blue-400'
                    : index < currentStep
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                    }`}>
                    <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${index === currentStep
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-110'
                      : index < currentStep
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}>
                      {index < currentStep ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                      {index === currentStep && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-bold">{step.title}</div>
                      <div className="text-xs opacity-70">{step.description}</div>
                    </div>
                  </div>
                  {index < onboardingSteps.length - 1 && (
                    <div className={`hidden xl:block w-16 h-1 rounded-full transition-all duration-500 ${index < currentStep
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-700'
                      }`} />
                  )}
                </div>
              ))}
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {currentStep + 1} of {onboardingSteps.length}
              </span>
              <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            {renderStepContent()}
          </div>
        </div>
      </div>

      {currentStep < 3 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="group flex items-center space-x-3 px-8 py-4 border border-slate-300 dark:border-slate-600 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold hover:shadow-lg text-lg"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`group flex items-center space-x-3 px-10 py-4 rounded-2xl font-bold transition-all duration-500 transform ${!isStepValid()
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 hover:shadow-purple-500/25 hover:scale-105'
                }`}
            >
              <span>{currentStep === 2 ? 'Complete Setup' : 'Continue'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletOnboarding;