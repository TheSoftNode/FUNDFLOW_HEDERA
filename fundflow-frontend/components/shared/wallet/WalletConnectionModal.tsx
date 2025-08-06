"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { WalletType } from '@/lib/hedera-wallet-service';
import { Wallet, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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

  const walletOptions = [
    {
      id: WalletType.HASHPACK,
      name: 'HashPack',
      description: 'Native Hedera wallet with full ecosystem support',
      icon: '🔗',
      features: ['Native Hedera support', 'Best performance', 'Full ecosystem access'],
      installUrl: 'https://hashpack.app',
      recommended: true
    },
    {
      id: WalletType.METAMASK,
      name: 'MetaMask',
      description: 'Popular EVM wallet with Hedera EVM support',
      icon: '🦊',
      features: ['EVM compatible', 'Wide adoption', 'Mobile support'],
      installUrl: 'https://metamask.io',
      recommended: false
    },
    {
      id: WalletType.WALLETCONNECT,
      name: 'WalletConnect',
      description: 'Connect any wallet via QR code',
      icon: '🔌',
      features: ['Multi-wallet support', 'Mobile friendly', 'QR code connection'],
      installUrl: 'https://walletconnect.com',
      recommended: false
    }
  ];

  const availableWallets = getAvailableWallets();
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#7F56D9]" />
            <span>Connect Your Wallet</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {filteredWalletOptions.length > 0 ? (
            <div className="space-y-3">
              {filteredWalletOptions.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`
                    relative p-4 border rounded-lg cursor-pointer transition-all duration-200
                    ${selectedWallet === wallet.id 
                      ? 'border-[#7F56D9] bg-[#7F56D9]/5' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#7F56D9]/50 hover:bg-[#7F56D9]/5'
                    }
                  `}
                  onClick={() => handleConnect(wallet.id)}
                >
                  {selectedWallet === wallet.id && (
                    <div className="absolute top-2 right-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#7F56D9]" />
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7F56D9] to-[#9F7AEA] rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-lg">{wallet.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {wallet.name}
                        </h3>
                        {wallet.recommended && (
                          <span className="text-xs bg-[#00C9A7]/10 text-[#00C9A7] px-2 py-0.5 rounded-full font-medium border border-[#00C9A7]/20">
                            Recommended
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {wallet.description}
                      </p>
                      
                      <div className="mt-2 space-y-1">
                        {wallet.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-[#00C9A7]" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Wallets Available
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Please install a compatible wallet to connect to FundFlow
              </p>
              
              <div className="space-y-3">
                {walletOptions.map((wallet) => (
                  <Button
                    key={wallet.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleInstallWallet(wallet.installUrl)}
                  >
                    <span className="mr-2">{wallet.icon}</span>
                    <span>Install {wallet.name}</span>
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
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