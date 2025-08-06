"use client"

import React, { useState } from 'react';
import { 
  ArrowLeft,
  Share2,
  Heart,
  Users,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Download,
  MessageCircle
} from 'lucide-react';

const CampaignDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const campaign = {
    id: 1,
    title: "AI-Powered Healthcare Assistant",
    description: "Revolutionary AI platform that assists doctors in diagnosing diseases with 94% accuracy using advanced machine learning algorithms and comprehensive medical data analysis.",
    founder: {
      name: "Dr. Sarah Chen",
      title: "MD, PhD in AI & Machine Learning",
      location: "San Francisco, CA",
      experience: "15+ years in healthcare technology",
      avatar: "/api/placeholder/60/60"
    },
    targetAmount: 2500000,
    raisedAmount: 1875000,
    progressPercentage: 75,
    investorCount: 234,
    daysLeft: 15,
    minInvestment: 1000,
    category: "AI & HealthTech",
    tags: ["AI", "Healthcare", "SaaS", "B2B"],
    milestones: [
      {
        id: 1,
        title: "MVP Development",
        description: "Complete minimum viable product with core AI diagnostic features",
        targetDate: "2024-02-15",
        status: "completed",
        fundingPercentage: 25,
        evidence: "GitHub repository, demo video, user testing results"
      },
      {
        id: 2,
        title: "Clinical Trials Phase 1",
        description: "Initial clinical trials with 5 partner hospitals",
        targetDate: "2024-04-30",
        status: "completed",
        fundingPercentage: 25,
        evidence: "Clinical trial reports, hospital partnerships"
      },
      {
        id: 3,
        title: "FDA Submission",
        description: "Submit application for FDA approval and regulatory compliance",
        targetDate: "2024-07-15",
        status: "in-progress",
        fundingPercentage: 25,
        evidence: "Pending submission"
      },
      {
        id: 4,
        title: "Market Launch",
        description: "Commercial launch with initial customer base",
        targetDate: "2024-10-01",
        status: "pending",
        fundingPercentage: 25,
        evidence: "Not started"
      }
    ],
    documents: [
      { name: "Business Plan", type: "PDF", size: "2.4 MB" },
      { name: "Financial Projections", type: "XLSX", size: "1.8 MB" },
      { name: "Technical Whitepaper", type: "PDF", size: "3.2 MB" },
      { name: "Market Research", type: "PDF", size: "4.1 MB" }
    ],
    updates: [
      {
        date: "2024-01-15",
        title: "Milestone 2 Completed!",
        content: "We've successfully completed our Phase 1 clinical trials with outstanding results..."
      },
      {
        date: "2024-01-10",
        title: "Partnership Announcement",
        content: "Excited to announce our partnership with Stanford Medical Center..."
      }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'milestones', name: 'Milestones' },
    { id: 'documents', name: 'Documents' },
    { id: 'updates', name: 'Updates' },
    { id: 'team', name: 'Team' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending': return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => window.location.href = '/campaign/browse'}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Campaigns</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campaign Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.category}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{campaign.daysLeft} days left</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {campaign.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: campaign.title,
                          text: campaign.description,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Campaign link copied to clipboard!');
                      }
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Founder Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {campaign.founder.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{campaign.founder.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.founder.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {campaign.founder.location}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {campaign.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Funding Progress</h2>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                  {campaign.progressPercentage}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-teal-400 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${campaign.progressPercentage}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(campaign.raisedAmount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Raised</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(campaign.targetAmount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Goal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {campaign.investorCount}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Investors</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Campaign</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Our AI-powered healthcare assistant represents a breakthrough in medical technology, 
                        combining advanced machine learning algorithms with comprehensive medical databases to 
                        assist healthcare professionals in making more accurate diagnoses. With a 94% accuracy rate 
                        in preliminary trials, this platform has the potential to revolutionize healthcare delivery 
                        and improve patient outcomes globally.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300">94% diagnostic accuracy rate</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300">Integration with major EHR systems</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300">HIPAA compliant and secure</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-600 dark:text-gray-300">Real-time decision support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div className="space-y-4">
                    {campaign.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(milestone.status)}
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{milestone.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.description}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Target Date:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{milestone.targetDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Funding Release:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{milestone.fundingPercentage}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Evidence:</span>
                            <p className="font-medium text-gray-900 dark:text-white">{milestone.evidence}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    {campaign.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">{doc.type}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{doc.size}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            // Simulate document download
                            alert(`Downloading ${doc.name}...`);
                          }}
                          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm">Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    {campaign.updates.map((update, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">{update.date}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{update.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{update.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {campaign.founder.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{campaign.founder.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{campaign.founder.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{campaign.founder.experience}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Investment Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Invest in This Campaign</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investment Amount (USD)
                  </label>
                  <input
                    type="number"
                    placeholder={`Min. ${formatCurrency(campaign.minInvestment)}`}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-900 dark:text-blue-300">Security Features</span>
                  </div>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• Milestone-based fund release</li>
                    <li>• Community governance voting</li>
                    <li>• Smart contract protection</li>
                    <li>• Proportional equity tokens</li>
                  </ul>
                </div>

                <button 
                  onClick={() => {
                    if (!investmentAmount || parseFloat(investmentAmount) < campaign.minInvestment) {
                      alert(`Minimum investment amount is ${formatCurrency(campaign.minInvestment)}`);
                      return;
                    }
                    // Simulate investment process
                    alert(`Investment of ${formatCurrency(parseFloat(investmentAmount))} submitted successfully! Redirecting to dashboard...`);
                    setTimeout(() => {
                      window.location.href = '/dashboard/investor';
                    }, 2000);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>Invest Now</span>
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By investing, you agree to our terms and conditions. Only 2.5% platform fee.
                </p>
              </div>
            </div>

            {/* Campaign Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Campaign Stats</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Minimum Investment</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(campaign.minInvestment)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">2.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Campaign Duration</span>
                  <span className="font-semibold text-gray-900 dark:text-white">60 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Security Level</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Bitcoin-Secured</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">$50,000 investment</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Campaign update posted</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">25 new investors joined</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;