import React from 'react';
import { 
  Shield, 
  Users, 
  Zap, 
  Brain,
  CheckCircle,
  BarChart3,
  Coins,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Bitcoin-Level Security",
      description: "Built on Stacks blockchain with Bitcoin's proven security model for ultimate trust.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200/50 dark:border-blue-800/50"
    },
    {
      icon: CheckCircle,
      title: "Milestone-Based Releases",
      description: "Funds released only after community-verified milestone achievements.",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50"
    },
    {
      icon: Coins,
      title: "Automated Equity",
      description: "Proportional equity tokens distributed automatically to all investors.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200/50 dark:border-amber-800/50"
    },
    {
      icon: Users,
      title: "Community Governance",
      description: "Weighted voting system where investors decide on milestone completion.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200/50 dark:border-purple-800/50"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Smart recommendations for campaign optimization and investment decisions.",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200/50 dark:border-pink-800/50"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Advanced portfolio tracking with performance insights and risk assessment.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
      borderColor: "border-teal-200/50 dark:border-teal-800/50"
    }
  ];

  const stats = [
    { label: "Platform Fee", value: "2.5%", description: "Transparent & Sustainable" },
    { label: "Success Rate", value: "94%", description: "Milestone Completion" },
    { label: "Global Reach", value: "50+", description: "Countries Supported" },
    { label: "Response Time", value: "<1s", description: "Real-time Updates" }
  ];

  return (
    <section id="platform" className="py-16 lg:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 relative overflow-hidden">
      {/* CSS-Only Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full mb-4 border border-blue-200/50 dark:border-blue-800/50">
            <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Revolutionary Platform
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500">
              FundFlow
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of fundraising with our comprehensive platform designed for 
            transparency, security, and unprecedented investor confidence.
          </p>
        </div>

        {/* Compact Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border ${feature.borderColor} hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Icon Container */}
              <div className={`w-11 h-11 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border ${feature.borderColor}`}>
                <feature.icon className={`w-5.5 h-5.5 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} 
                  style={{ WebkitTextFillColor: 'transparent' }} />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-[0.02] rounded-2xl transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>



        {/* Refined Call to Action */}
        <div className="text-center mt-8">
          <div className="inline-flex flex-col sm:flex-row gap-3">
            <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-600/25">
              <span className="flex items-center justify-center gap-2">
                Start Your Campaign
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
            <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white px-8 py-3.5 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-lg">
              Explore Opportunities
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;