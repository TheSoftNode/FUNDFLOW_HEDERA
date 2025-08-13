"use client";

import React from 'react';
import { Wallet, ChevronDown, Loader2, User, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { WalletType } from '@/lib/wallet-connector';

interface ConnectWalletButtonProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  variant = 'default',
  className = ''
}) => {
  const {
    user,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    getAvailableWallets
  } = useAuth();

  const walletOptions = [

    {
      name: 'MetaMask',
      id: WalletType.METAMASK,
      description: 'EVM compatible wallet',
      icon: '🦊',
      color: 'from-orange-500 to-orange-600',
      installUrl: 'https://metamask.io'
    },
    {
      name: 'WalletConnect',
      id: WalletType.WALLETCONNECT,
      description: 'Multi-wallet support',
      recommended: false,
      icon: '🔌',
      color: 'from-blue-500 to-blue-600',
      installUrl: 'https://walletconnect.com'
    }
  ];

  const availableWallets = getAvailableWallets();
  const filteredWalletOptions = walletOptions.filter(wallet =>
    availableWallets.includes(wallet.id)
  );

  const handleConnect = async (walletType: WalletType) => {
    try {
      console.log(`Attempting to connect to ${walletType}...`);
      await connectWallet(walletType);
      console.log(`Successfully connected to ${walletType}!`);
    } catch (error) {
      console.error(`Failed to connect to ${walletType}:`, error);
      // You could add toast notification here
      alert(`Failed to connect to ${walletType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };



  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Get wallet icon based on type
  const getWalletIcon = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.HASHPACK:
        return '🔗';
      case WalletType.METAMASK:
        return '🦊';
      case WalletType.WALLETCONNECT:
        return '🔌';
      default:
        return '💼';
    }
  };

  // Debug information
  console.log('Available wallets:', availableWallets);
  console.log('Filtered wallet options:', filteredWalletOptions);

  // Connected state - show user menu
  if (isConnected && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`
              border-[#7F56D9]/20 bg-[#7F56D9]/5 hover:bg-[#7F56D9]/10
              text-[#7F56D9] dark:text-[#7F56D9]
              transition-all duration-200 hover:border-[#7F56D9]/40
              ${variant === 'compact' ? 'px-2 py-0.5 h-7' : 'px-4 py-2'}
              ${className}
            `}
          >
            <div className="flex items-center space-x-1.5">
              <div className={`${variant === 'compact' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-[#00C9A7] rounded-full animate-pulse`}></div>
              <Wallet className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {variant !== 'compact' && (
                <span className="max-w-[120px] truncate">
                  {user.profile?.name || formatAddress(user.walletAddress)}
                </span>
              )}
              {variant !== 'compact' && <ChevronDown className="w-3 h-3" />}
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-1">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/50 mb-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7F56D9] to-[#9F7AEA] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.profile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {formatAddress(user.walletAddress)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-[#7F56D9] font-medium capitalize">
                    {user.role || 'No Role'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {getWalletIcon(user.walletType)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Balance: {user.balance} HBAR
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Options */}
          <DropdownMenuItem className="text-[#7F56D9] hover:text-[#6D47C7] hover:bg-[#7F56D9]/10 rounded-lg mx-1 px-3 py-2.5 transition-all duration-200 cursor-pointer flex items-center space-x-2 relative">
            <User className="w-4 h-4" />
            <span className="font-medium">Go to Startup Dashboard</span>
            <a href="/dashboard/startup" className="block w-full h-full absolute inset-0"></a>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-[#7F56D9] hover:text-[#6D47C7] hover:bg-[#7F56D9]/10 rounded-lg mx-1 px-3 py-2.5 transition-all duration-200 cursor-pointer flex items-center space-x-2 relative">
            <User className="w-4 h-4" />
            <span className="font-medium">Go to Investor Dashboard</span>
            <a href="/dashboard/investor" className="block w-full h-full absolute inset-0"></a>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            onClick={handleDisconnect}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 px-3 py-2.5 transition-all duration-200 cursor-pointer flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Disconnect Wallet</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Not connected state - show wallet selection
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`
            bg-[#7F56D9] hover:bg-[#6D47C7] 
            text-white border-0
            transition-all duration-200 hover:shadow-lg hover:shadow-[#7F56D9]/25
            ${variant === 'compact' ? 'px-2 py-0.5 h-7' : 'px-4 py-0.5'}
            ${className}
          `}
          disabled={isLoading}
        >
          <div className="flex items-center space-x-1.5">
            {isLoading ? (
              <Loader2 className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} animate-spin`} />
            ) : (
              <Wallet className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'}`} />
            )}
            {variant !== 'compact' && (
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            )}
            {!isLoading && variant !== 'compact' && <ChevronDown className="w-3 h-3" />}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-1.5">

        <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-700/50 mb-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Select Wallet
          </p>
        </div>

        {filteredWalletOptions.length > 0 ? (
          filteredWalletOptions.map((wallet) => (
            <DropdownMenuItem
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg mx-1 transition-all duration-200 group"
              disabled={isLoading}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${wallet.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <span className="text-sm">{wallet.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white group-hover:text-[#7F56D9] transition-colors">
                      {wallet.name}
                    </span>
                    {wallet.recommended && (
                      <span className="inline-flex items-center space-x-1 text-xs bg-gradient-to-r from-[#00C9A7] to-[#00E6A7] text-white px-2 py-0.5 rounded-full font-medium">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Recommended</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                    {wallet.description}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              No compatible wallets found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Please install HashPack or MetaMask to continue
            </p>
            <div className="mt-3 space-y-2">
              <a
                href="https://hashpack.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#7F56D9] hover:text-[#6D47C7] transition-colors"
              >
                <span>Install HashPack</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <br />
              <a
                href="https://metamask.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-[#7F56D9] hover:text-[#6D47C7] transition-colors"
              >
                <span>Install MetaMask</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        <div className="mt-1 pt-1.5 border-t border-gray-100 dark:border-gray-700/50">
          <p className="text-xs text-gray-400 dark:text-gray-500 px-3 py-1 text-center">
            Connect securely with your preferred wallet
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectWalletButton;