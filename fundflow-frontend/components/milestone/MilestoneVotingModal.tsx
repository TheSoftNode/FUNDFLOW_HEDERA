import React, { useState } from 'react';
import { 
  X,
  CheckCircle,
  Clock,
  FileText,
  Download,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Info,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  fundingPercentage: number;
  evidence: Evidence[];
  submissionDate: string;
  votingDeadline: string;
  currentVotes: {
    for: number;
    against: number;
    totalVotingPower: number;
  };
  userVotingPower: number;
  hasUserVoted: boolean;
  userVote?: 'for' | 'against';
}

interface Evidence {
  id: number;
  type: 'document' | 'link' | 'image';
  title: string;
  description: string;
  url?: string;
  size?: string;
}

interface Campaign {
  id: number;
  title: string;
  founder: string;
  category: string;
  totalRaised: number;
  targetAmount: number;
}

interface MilestoneVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone;
  campaign: Campaign;
}

const MilestoneVotingModal: React.FC<MilestoneVotingModalProps> = ({
  isOpen,
  onClose,
  milestone,
  campaign
}) => {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | null>(
    milestone.hasUserVoted ? milestone.userVote || null : null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const votingPowerPercentage = (milestone.userVotingPower / milestone.currentVotes.totalVotingPower) * 100;
  const approvalPercentage = (milestone.currentVotes.for / (milestone.currentVotes.for + milestone.currentVotes.against)) * 100;
  const fundReleaseAmount = (campaign.totalRaised * milestone.fundingPercentage) / 100;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (): number => {
    const deadline = new Date(milestone.votingDeadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleVoteSubmit = async () => {
    if (!selectedVote || milestone.hasUserVoted) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'link': return <ExternalLink className="w-5 h-5 text-green-500" />;
      case 'image': return <FileText className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" />
          
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Vote Submitted Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your vote has been recorded on the blockchain. Thank you for participating in the governance process.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Milestone Voting
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{campaign.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Founder:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.founder}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <p className="font-medium text-gray-900 dark:text-white">{campaign.category}</p>
                  </div>
                </div>
              </div>

              {/* Milestone Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {milestone.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-blue-900 dark:text-blue-300">Target Date</span>
                    </div>
                    <p className="text-blue-800 dark:text-blue-400">{formatDate(milestone.targetDate)}</p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-900 dark:text-green-300">Fund Release</span>
                    </div>
                    <p className="text-green-800 dark:text-green-400">
                      {milestone.fundingPercentage}% ({formatCurrency(fundReleaseAmount)})
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-purple-900 dark:text-purple-300">Submitted</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-400">{formatDate(milestone.submissionDate)}</p>
                  </div>
                </div>
              </div>

              {/* Evidence */}
              <div>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Supporting Evidence
                </h5>
                <div className="space-y-3">
                  {milestone.evidence.map((evidence) => (
                    <div
                      key={evidence.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getEvidenceIcon(evidence.type)}
                        <div>
                          <h6 className="font-medium text-gray-900 dark:text-white">{evidence.title}</h6>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{evidence.description}</p>
                          {evidence.size && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">{evidence.size}</p>
                          )}
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        {evidence.type === 'link' ? (
                          <ExternalLink className="w-4 h-4" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span className="text-sm">
                          {evidence.type === 'link' ? 'Visit' : 'Download'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voting Section */}
              {!milestone.hasUserVoted && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Cast Your Vote
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setSelectedVote('for')}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        selectedVote === 'for'
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <ThumbsUp className={`w-6 h-6 ${selectedVote === 'for' ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${selectedVote === 'for' ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          Approve
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Milestone has been successfully completed
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedVote('against')}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        selectedVote === 'against'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <ThumbsDown className={`w-6 h-6 ${selectedVote === 'against' ? 'text-red-500' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${selectedVote === 'against' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
                          Reject
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Milestone requirements not met
                      </p>
                    </button>
                  </div>

                  <button
                    onClick={handleVoteSubmit}
                    disabled={!selectedVote || isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Vote...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Vote</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {milestone.hasUserVoted && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-blue-900 dark:text-blue-300">
                      You have already voted {milestone.userVote === 'for' ? 'to approve' : 'to reject'} this milestone.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Voting Stats */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Voting Statistics</span>
                </h5>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {approvalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${approvalPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {milestone.currentVotes.for}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">For</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {milestone.currentVotes.against}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Against</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Your voting power</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {votingPowerPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting Deadline */}
              <div className={`p-4 rounded-xl ${
                getDaysUntilDeadline() <= 3 
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className={`w-5 h-5 ${
                    getDaysUntilDeadline() <= 3 ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <span className={`font-medium ${
                    getDaysUntilDeadline() <= 3 
                      ? 'text-red-900 dark:text-red-300' 
                      : 'text-yellow-900 dark:text-yellow-300'
                  }`}>
                    Voting Deadline
                  </span>
                </div>
                <p className={`text-sm ${
                  getDaysUntilDeadline() <= 3 
                    ? 'text-red-800 dark:text-red-400' 
                    : 'text-yellow-800 dark:text-yellow-400'
                }`}>
                  {getDaysUntilDeadline()} days remaining
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {formatDate(milestone.votingDeadline)}
                </p>
              </div>

              {/* Voting Requirements */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <h6 className="font-medium text-gray-900 dark:text-white mb-3">Voting Requirements</h6>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>Minimum participation:</span>
                    <span className="font-medium text-gray-900 dark:text-white">51%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval threshold:</span>
                    <span className="font-medium text-gray-900 dark:text-white">51%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current participation:</span>
                    <span className="font-medium text-gray-900 dark:text-white">68%</span>
                  </div>
                </div>
              </div>

              {/* Fund Release Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-blue-900 dark:text-blue-300">Fund Release</span>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-400 mb-2">
                  If approved, {formatCurrency(fundReleaseAmount)} ({milestone.fundingPercentage}% of raised funds) will be released to the campaign founder.
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-500">
                  Funds are held in escrow until milestone approval
                </div>
              </div>

              {/* Help */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                <h6 className="font-medium text-gray-900 dark:text-white mb-2">Need Help?</h6>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Learn more about milestone voting and governance.
                </p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View Voting Guide →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneVotingModal;