"use client";

import React, { useState, useEffect } from 'react';
import {
  Twitter,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Shield,
  Globe,
  Book,
  MessageCircle,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Logo from '@/components/shared/logo/Logo';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);

  const footerSections: Array<{
    title: string;
    links: Array<{
      name: string;
      href: string;
      icon?: React.ComponentType<{ className?: string }>;
    }>;
  }> = [
      {
        title: "Platform",
        links: [
          { name: "How it Works", href: "#how-it-works" },
          { name: "Features", href: "#features" },
          { name: "Security", href: "#security" },
          { name: "Pricing", href: "#pricing" }
        ]
      },
      {
        title: "For Startups",
        links: [
          { name: "Create Campaign", href: "/create" },
          { name: "Success Stories", href: "/stories" },
          { name: "Resources", href: "/resources" },
          { name: "Support", href: "/support" }
        ]
      },
      {
        title: "For Investors",
        links: [
          { name: "Browse Campaigns", href: "/browse" },
          { name: "Portfolio", href: "/portfolio" },
          { name: "Analytics", href: "/analytics" },
          { name: "Risk Assessment", href: "/risk" }
        ]
      },
      {
        title: "Developers",
        links: [
          { name: "API Documentation", href: "/docs", icon: Book },
          { name: "Smart Contracts", href: "/contracts", icon: Shield },
          { name: "GitHub", href: "https://github.com/fundflow", icon: Github },
          { name: "Community", href: "/community", icon: MessageCircle }
        ]
      }
    ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/fundflow", label: "Twitter", color: "hover:from-blue-400 hover:to-blue-500" },
    { icon: Github, href: "https://github.com/fundflow", label: "GitHub", color: "hover:from-gray-600 hover:to-gray-700" },
    { icon: Linkedin, href: "https://linkedin.com/company/fundflow", label: "LinkedIn", color: "hover:from-blue-600 hover:to-blue-700" },
    { icon: Mail, href: "mailto:hello@fundflow.ai", label: "Email", color: "hover:from-teal-500 hover:to-teal-600" }
  ];

  const stats = [
    { label: "Total Raised", value: 50, displayValue: "$50M+", description: "Across all campaigns" },
    { label: "Active Campaigns", value: 150, displayValue: "150+", description: "Currently fundraising" },
    { label: "Success Rate", value: 94, displayValue: "94%", description: "Milestone completion" },
    { label: "Global Users", value: 15, displayValue: "15K+", description: "Worldwide community" }
  ];

  // Animate stats on mount
  useEffect(() => {
    const targets = [50, 150, 94, 15];
    targets.forEach((target, index) => {
      let current = 0;
      const increment = target / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(counter);
        }
        setAnimatedStats(prev => {
          const newStats = [...prev];
          newStats[index] = Math.floor(current);
          return newStats;
        });
      }, 30);
    });
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black dark:from-black dark:via-gray-950 dark:to-black text-white relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/5 via-purple-500/3 to-transparent rounded-full blur-3xl animate-pulse [animation-duration:4s]"></div>
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-r from-teal-500/5 via-emerald-500/3 to-transparent rounded-full blur-3xl animate-pulse [animation-duration:6s] [animation-delay:2s]"></div>

      {/* Compact Stats Banner */}
      <div className="relative z-10 border-b border-gray-800/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                  {index === 0 && `$${animatedStats[index]}M+`}
                  {index === 1 && `${animatedStats[index]}+`}
                  {index === 2 && `${animatedStats[index]}%`}
                  {index === 3 && `${animatedStats[index]}K+`}
                </div>
                <div className="text-xs font-semibold text-gray-300 mb-0.5">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content - Compact */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Revolutionizing startup fundraising with transparent, milestone-based funding
              secured by enterprise-grade security on the Hedera Hashgraph network.
            </p>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Secured by Hedera</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Available Globally</span>
              </div>
            </div>
          </div>

          {/* Compact Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-200 group hover:translate-x-1"
                    >
                      {link.icon && React.createElement(link.icon, {
                        className: "w-3.5 h-3.5 group-hover:text-blue-400 transition-colors"
                      })}
                      <span className="text-sm">{link.name}</span>
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Enhanced Newsletter Signup */}
        <div className="mt-8 pt-6 border-t border-gray-800/50 dark:border-gray-700/50">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                <span>Stay Updated</span>
                <Sparkles className="w-5 h-5 text-blue-400" />
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get the latest updates on new features, campaigns, and platform developments.
              </p>
            </div>

            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 dark:border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button
                onClick={handleSubscribe}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 ${isSubscribed
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600'
                  }`}
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800/50 dark:border-gray-700/50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center lg:text-left">
              © 2025 FundFlow. All rights reserved. Built on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 font-semibold">Hedera</span>{' '}
              with <span className="text-red-500">❤️</span>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 group border border-gray-700/50`}
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors duration-200 hover:underline underline-offset-4">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-200 hover:underline underline-offset-4">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;