import React, { useState } from 'react';
import { 
  X,
  DollarSign,
  Shield,
  Calculator,
  Wallet,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  minInvestment: number;
  investorCount: number;
  daysLeft: number;
  progressPercentage: number;
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, campaign }) => {
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isInvesting, setIsInvesting] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const platformFee = 0.025; // 2.5%
  const feeAmount = parseFloat(investmentAmount || '0') * platformFee;
  const totalAmount = parseFloat(investmentAmount || '0') + feeAmount;
  const equityTokens = Math.floor(parseFloat(investmentAmount || '0') / 100); // Example: 1 token per $100

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      setIsConnecting(false);
      setStep(2);
    }, 2000);
  };

  const handleInvest = async () => {
    setIsInvesting(true);
    // Simulate investment transaction
    setTimeout(() => {
      setIsInvesting(false);
      setStep(3);
    }, 3000);
  };

  const resetModal = () => {
    setStep(1);
    setInvestmentAmount('');
    setWalletConnected(false);
    setIsConnecting(false);
    setIsInvesting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {step === 1 ? 'Connect Wallet' : step === 2 ? 'Investment Details' : 'Investment Successful'}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Campaign Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{campaign.title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Progress:</span>
                <p className="font-medium text-gray-900 dark:text-white">{campaign.progressPercentage}%</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Days Left:</span>
                <p className="font-medium text-gray-900 dark:text-white">{campaign.daysLeft}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Raised:</span>
                <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(campaign.raisedAmount)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Investors:</span>
                <p className="font-medium text-gray-900 dark:text-white">{campaign.investorCount}</p>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Wallet className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Connect Your Stacks Wallet
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect your wallet to start investing in this campaign
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 dark:text-blue-300">Secure Investment</h5>
                    <ul className="text-sm text-blue-800 dark:text-blue-400 mt-1 space-y-1">
                      <li>• Bitcoin-level security</li>
                      <li>• Milestone-based fund release</li>
                      <li>• Smart contract protection</li>
                      <li>• Community governance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect Hiro Wallet</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Investment Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Min. ${formatCurrency(campaign.minInvestment)}`}
                    min={campaign.minInvestment}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {parseFloat(investmentAmount || '0') < campaign.minInvestment && investmentAmount && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Minimum investment is {formatCurrency(campaign.minInvestment)}</span>
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[campaign.minInvestment, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setInvestmentAmount(amount.toString())}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              {/* Investment Breakdown */}
              {investmentAmount && parseFloat(investmentAmount) >= campaign.minInvestment && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Calculator className="w-4 h-4" />
                    <span>Investment Breakdown</span>
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Investment Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(parseFloat(investmentAmount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Platform Fee (2.5%):</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(feeAmount)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">Total Amount:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Equity Tokens:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{equityTokens} tokens</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Warning */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-yellow-900 dark:text-yellow-300">Investment Risk</h5>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                      Investing in startups carries high risk. Only invest what you can afford to lose.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInvest}
                disabled={!investmentAmount || parseFloat(investmentAmount) < campaign.minInvestment || isInvesting}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                {isInvesting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Investment...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    <span>Invest {investmentAmount ? formatCurrency(parseFloat(investmentAmount)) : ''}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Investment Successful!
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Your investment of {formatCurrency(parseFloat(investmentAmount || '0'))} has been successfully processed.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <h5 className="font-medium text-green-900 dark:text-green-300 mb-2">Transaction Details</h5>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">Investment:</span>
                    <span className="font-medium text-green-900 dark:text-green-300">{formatCurrency(parseFloat(investmentAmount || '0'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">Equity Tokens:</span>
                    <span className="font-medium text-green-900 dark:text-green-300">{equityTokens} tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-400">Transaction ID:</span>
                    <span className="font-medium text-green-900 dark:text-green-300 truncate">0x1234...5678</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Navigate to portfolio
                    handleClose();
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  View Portfolio
                </button>
                <button
                  onClick={handleClose}
                  className="w-full border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;