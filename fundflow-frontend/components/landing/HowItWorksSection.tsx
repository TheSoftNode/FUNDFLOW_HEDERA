"use client";

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Target, 
  Vote, 
  Coins, 
  ArrowRight, 
  Play,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  Clock,
  Shield,
  BarChart3,
  Eye,
  Sparkles
} from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState([0, 0, 0, 0]);

  const steps = [
    {
      icon: Rocket,
      title: "Create Campaign",
      description: "Launch your startup fundraising campaign with clear goals, milestones, and timeline.",
      details: [
        "Set funding goals and timeline",
        "Define project milestones", 
        "Submit for community review",
        "Launch with full transparency"
      ],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200/50 dark:border-blue-800/50",
      mockupData: { percentage: 85, amount: "$2.5M", days: "45" }
    },
    {
      icon: Target,
      title: "Attract Investors",
      description: "Connect with global investors through our AI-powered matching system.",
      details: [
        "AI-powered investor matching",
        "Global investor network access",
        "Real-time campaign analytics", 
        "Community-driven discovery"
      ],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50",
      mockupData: { percentage: 92, amount: "$1.8M", days: "32" }
    },
    {
      icon: Vote,
      title: "Milestone Voting",
      description: "Community validates milestone completion before funds are released.",
      details: [
        "Submit milestone evidence",
        "Community reviews progress",
        "Weighted voting by stake",
        "Transparent decision process"
      ],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
      mockupData: { percentage: 76, amount: "$950K", days: "28" }
    },
    {
      icon: Coins,
      title: "Fund Release & Equity",
      description: "Automated fund release and equity token distribution upon milestone approval.",
      details: [
        "Automatic fund release",
        "Proportional equity tokens",
        "Smart contract execution",
        "Transparent distribution"
      ],
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20", 
      borderColor: "border-teal-200/50 dark:border-teal-800/50",
      mockupData: { percentage: 100, amount: "$3.2M", days: "60" }
    }
  ];

  const userTypes = [
    {
      icon: TrendingUp,
      title: "For Startups",
      benefits: [
        "Transparent milestone-based funding",
        "Global investor access",
        "Automated equity distribution", 
        "AI-powered campaign optimization"
      ],
      action: "Start Fundraising",
      gradient: "from-blue-600 to-purple-600",
      hoverGradient: "from-blue-700 to-purple-700",
      stats: "1,200+ campaigns funded"
    },
    {
      icon: Users,
      title: "For Investors", 
      benefits: [
        "Real-time investment transparency",
        "Community governance rights",
        "Portfolio analytics & insights",
        "Risk mitigation through milestones"
      ],
      action: "Explore Opportunities",
      gradient: "from-teal-600 to-emerald-600",
      hoverGradient: "from-teal-700 to-emerald-700",
      stats: "15,000+ active investors"
    }
  ];

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate numbers when component is visible
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const targetNumbers = [85, 92, 76, 100];
      targetNumbers.forEach((target, index) => {
        let current = 0;
        const increment = target / 30;
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          setAnimatedNumbers(prev => {
            const newNumbers = [...prev];
            newNumbers[index] = Math.floor(current);
            return newNumbers;
          });
        }, 50);
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const currentStep = steps[activeStep];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-900/50 dark:via-gray-900 dark:to-gray-800/50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-400/5 dark:bg-teal-500/5 rounded-full blur-2xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-xl animate-pulse [animation-delay:1s]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Simple Process
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How FundFlow{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-teal-700 dark:from-blue-400 dark:via-purple-400 dark:to-teal-400">
              Works
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Four simple steps to revolutionize your fundraising experience with transparency, 
            security, and community governance.
          </p>
        </div>

        {/* Interactive Steps - Compact */}
        <div className="mb-16">
          {/* Mobile-First Step Navigation */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-wrap justify-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    activeStep === index
                      ? `bg-gradient-to-r ${step.color} text-white shadow-md transform scale-105`
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="hidden sm:block font-medium text-sm">{step.title}</span>
                  <span className="sm:hidden font-medium text-sm">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Step Content - Enhanced with Animation */}
          <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Left Content */}
            <div className="space-y-5">
              <div className={`w-14 h-14 ${currentStep.bgColor} rounded-2xl flex items-center justify-center border ${currentStep.borderColor} shadow-sm`}>
                <currentStep.icon className={`w-7 h-7 text-blue-600 dark:text-blue-400`} />
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Step {activeStep + 1}: {currentStep.title}
              </h3>
              
              <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentStep.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.details.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-2 group">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual - Interactive Mockup */}
            <div className="relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 lg:p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-[1.02] transition-all duration-300">
                {/* Mini Dashboard Mockup */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${currentStep.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <currentStep.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          TechFlow AI
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Series A • Active</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Live</span>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - animatedNumbers[activeStep] / 100)}`}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {animatedNumbers[activeStep]}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Complete</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{currentStep.mockupData.amount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Raised</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{currentStep.mockupData.days}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Days Left</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">247</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Investors</div>
                    </div>
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeStep
                            ? `bg-gradient-to-r ${steps[index].color} transform scale-125`
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact User Type Benefits */}
        <div className="grid md:grid-cols-2 gap-6">
          {userTypes.map((userType, index) => (
            <div
              key={index}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 lg:p-7 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${userType.gradient} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                <userType.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {userType.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 font-medium">
                {userType.stats}
              </p>

              <div className="grid grid-cols-1 gap-2.5 mb-6">
                {userType.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-start space-x-2.5 group/item">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full bg-gradient-to-r ${userType.gradient} hover:bg-gradient-to-r hover:${userType.hoverGradient} text-white py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl`}>
                <span>{userType.action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;