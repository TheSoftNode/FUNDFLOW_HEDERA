"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { WalletType } from '@/lib/wallet-connector';
import { Wallet, ExternalLink, CheckCircle, AlertCircle, Loader2, Sparkles, Shield, Zap } from 'lucide-react';

interface WalletConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectionModal: React.FC<WalletConnectionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { connectWallet, getAvailableWallets, isLoading } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);

  useEffect(() => {
    setAvailableWallets(getAvailableWallets());
  }, [getAvailableWallets]);

  const walletOptions = [
    {
      id: WalletType.HASHPACK,
      name: 'HashPack',
      description: 'Native Hedera wallet',
      icon: '🔗',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      features: ['Best Hedera support', 'Native HBAR', 'Fast transactions'],
      installUrl: 'https://hashpack.app',
      recommended: true
    },
    {
      id: WalletType.METAMASK,
      name: 'MetaMask',
      description: 'Popular EVM wallet',
      icon: '🦊',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      features: ['Wide adoption', 'EVM compatible', 'Mobile support'],
      installUrl: 'https://metamask.io',
      recommended: false
    },
    {
      id: WalletType.WALLETCONNECT,
      name: 'WalletConnect',
      description: 'Connect any wallet',
      icon: '🔌',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      features: ['Multi-wallet', 'QR code', 'Mobile friendly'],
      installUrl: 'https://walletconnect.com',
      recommended: false
    }
  ];

  const filteredWalletOptions = walletOptions.filter(wallet =>
    availableWallets.includes(wallet.id)
  );

  const handleConnect = async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    setError(null);

    try {
      await connectWallet(walletType);
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setSelectedWallet(null);
    }
  };

  const handleInstallWallet = (installUrl: string) => {
    window.open(installUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-[#7F56D9] to-[#9F7AEA] text-white">
          <DialogTitle className="flex items-center space-x-3 text-xl font-semibold">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <span>Connect Your Wallet</span>
          </DialogTitle>
          <p className="text-white/80 text-sm mt-1">
            Choose your preferred wallet to connect to FundFlow
          </p>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">Connection Failed</p>
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {filteredWalletOptions.length > 0 ? (
            <div className="space-y-4">
              {filteredWalletOptions.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`
                    relative group cursor-pointer transition-all duration-200 rounded-xl border-2 overflow-hidden
                    ${selectedWallet === wallet.id
                      ? 'border-[#7F56D9] shadow-lg shadow-[#7F56D9]/20'
                      : `${wallet.borderColor} hover:border-[#7F56D9]/50 hover:shadow-md`
                    }
                  `}
                  onClick={() => handleConnect(wallet.id)}
                >
                  {selectedWallet === wallet.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7F56D9]/5 to-[#9F7AEA]/5" />
                  )}

                  <div className="relative p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg
                        bg-gradient-to-br ${wallet.color} text-white
                      `}>
                        {wallet.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {wallet.name}
                          </h3>
                          {wallet.recommended && (
                            <span className="inline-flex items-center space-x-1 text-xs bg-gradient-to-r from-[#00C9A7] to-[#00E6A7] text-white px-2 py-1 rounded-full font-medium">
                              <Sparkles className="w-3 h-3" />
                              <span>Recommended</span>
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {wallet.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {wallet.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <CheckCircle className="w-3 h-3 text-[#00C9A7]" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedWallet === wallet.id && (
                        <div className="flex-shrink-0">
                          <Loader2 className="w-5 h-5 animate-spin text-[#7F56D9]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-gray-400" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No Wallets Available
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Install a compatible wallet to start using FundFlow and connect to the Hedera network
              </p>

              <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                {walletOptions.map((wallet) => (
                  <Button
                    key={wallet.id}
                    variant="outline"
                    className="w-full justify-start group hover:border-[#7F56D9] hover:bg-[#7F56D9]/5"
                    onClick={() => handleInstallWallet(wallet.installUrl)}
                  >
                    <span className="mr-3 text-lg">{wallet.icon}</span>
                    <span className="flex-1 text-left">
                      <span className="font-medium">Install {wallet.name}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {wallet.description}
                      </span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#7F56D9]" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Security & Features */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Secure</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Fast</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Reliable</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By connecting your wallet, you agree to our{' '}
              <a href="/terms" className="text-[#7F56D9] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#7F56D9] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectionModal; 