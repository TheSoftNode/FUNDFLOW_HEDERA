"use client"

import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, CheckCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMetric, setCurrentMetric] = useState(0);

  const metrics = [
    { value: 80, label: "Funding", suffix: "%" },
    { value: 342, label: "Investors", suffix: "" },
    { value: 24, label: "Growth", suffix: "%" },
    { value: 7, label: "Days Left", suffix: "" }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-100/80 dark:from-slate-950 dark:via-gray-900 dark:to-slate-900">
      {/* Refined Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-slate-500/2 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">

          {/* Left Content - Clean & Professional */}
          <div className={`order-1 lg:order-1 text-center lg:text-left space-y-5 sm:space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Stylish Headline */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-slate-600 dark:text-slate-300 leading-tight">
                The Future of
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500">
                  Startup Capital
                </span>
              </h1>
            </div>

            {/* Professional Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Advanced blockchain infrastructure enabling transparent, milestone-driven fundraising with institutional-grade security and automated governance protocols.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto lg:mx-0">
              <button className="w-full sm:w-auto group relative bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02]">
                <span className="flex items-center justify-center gap-2">
                  Launch Campaign
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* <a href="/wallet-demo" className="w-full sm:w-auto group flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                <Play className="w-4 h-4" />
                Wallet Demo
              </a>
              <a href="/wallet-test" className="w-full sm:w-auto group flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80">
                <Play className="w-4 h-4" />
                Wallet Test
              </a> */}
            </div>

            {/* Clean Stats */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 max-w-xs mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">$50M+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Raised</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">1,200+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Campaigns</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">98%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Refined Circular Dashboard */}
          <div className={`order-2 lg:order-2 flex justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">

              {/* Clean Circular Interface */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] lg:w-96 lg:h-96 xl:w-[440px] xl:h-[440px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-full shadow-2xl border border-slate-200/60 dark:border-slate-700/60">

                {/* Subtle Outer Ring */}
                <div className="absolute inset-2 sm:inset-3 rounded-full border border-slate-200/30 dark:border-slate-700/30 animate-spin [animation-duration:30s]"></div>

                {/* Inner Dashboard */}
                <div className="absolute inset-4 sm:inset-6 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/40 flex flex-col items-center justify-center">

                  {/* Top Section - Company */}
                  <div className="absolute top-8 sm:top-10 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white">QuantumAI Labs</h3>
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Quantum Computing • Series A</p>
                  </div>

                  {/* Central Metric Display */}
                  <div className="text-center space-y-2">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                      {/* Clean Progress Ring */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        <defs>
                          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        {/* Background */}
                        <circle cx="100" cy="100" r="80" stroke="#e2e8f0" strokeWidth="2" fill="none" className="dark:stroke-slate-700" />
                        {/* Progress */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          stroke="url(#progressGrad)"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.8)}`}
                          className="transition-all duration-2000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Center Content - Dynamic */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                          {metrics[currentMetric].value}{metrics[currentMetric].suffix}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {metrics[currentMetric].label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Key Info */}
                  <div className="absolute bottom-6 sm:bottom-8 text-center space-y-2">
                    <div className="space-y-1">
                      <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">$1.2M / $1.5M</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Target: March 2025</div>
                    </div>

                    <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Active</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -right-2">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-sm font-bold text-emerald-600">+$47K</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Today</div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/2 -left-3 transform -translate-y-1/2">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                </div>

                <div className="absolute top-1/4 -right-3">
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;