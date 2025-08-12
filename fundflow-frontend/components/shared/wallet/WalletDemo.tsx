"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { hederaTransactionService } from '@/lib/hedera-transactions';
import { WalletType } from '@/lib/wallet-connector';
import { Wallet, Plus, TrendingUp, Target, CheckCircle, AlertCircle } from 'lucide-react';

const WalletDemo: React.FC = () => {
    const {
        user,
        isConnected,
        connectWallet,
        disconnectWallet,
        updateBalance,
        getAvailableWallets
    } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const availableWallets = getAvailableWallets();

    const handleConnect = async (walletType: WalletType) => {
        setIsLoading(true);
        setMessage(null);

        try {
            await connectWallet(walletType);
            setMessage({ type: 'success', text: `Successfully connected to ${walletType}!` });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to connect wallet' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = () => {
        disconnectWallet();
        setMessage({ type: 'success', text: 'Wallet disconnected successfully!' });
    };

    const handleUpdateBalance = async () => {
        if (!isConnected) return;

        setIsLoading(true);
        try {
            await updateBalance();
            setMessage({ type: 'success', text: 'Balance updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update balance' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async () => {
        if (!isConnected) {
            setMessage({ type: 'error', text: 'Please connect a wallet first' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await hederaTransactionService.createCampaign(
                'Demo Campaign',
                'This is a demo campaign created through the wallet integration',
                100, // 100 HBAR
                30 // 30 days
            );

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `Campaign created successfully! Transaction ID: ${result.transactionId}`
                });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to create campaign' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to create campaign' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInvestInCampaign = async () => {
        if (!isConnected) {
            setMessage({ type: 'error', text: 'Please connect a wallet first' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await hederaTransactionService.investInCampaign(1, 10); // Campaign ID 1, 10 HBAR

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `Investment successful! Transaction ID: ${result.transactionId}`
                });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to invest in campaign' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to invest in campaign' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransferHBAR = async () => {
        if (!isConnected) {
            setMessage({ type: 'error', text: 'Please connect a wallet first' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const result = await hederaTransactionService.transferHBAR(
                '0.0.123456', // Example recipient account
                5 // 5 HBAR
            );

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `Transfer successful! Transaction ID: ${result.transactionId}`
                });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to transfer HBAR' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to transfer HBAR' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Hedera Wallet Integration Demo
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Test the FundFlow Hedera wallet integration with various operations
                </p>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`
          p-4 rounded-lg border flex items-center space-x-2
          ${message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }
        `}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${message.type === 'success'
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                        }`}>
                        {message.text}
                    </span>
                </div>
            )}

            {/* Wallet Connection */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Wallet className="w-5 h-5" />
                        <span>Wallet Connection</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isConnected ? (
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Connect your wallet to start using FundFlow
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {availableWallets.map((walletType) => (
                                    <Button
                                        key={walletType}
                                        onClick={() => handleConnect(walletType)}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        ) : (
                                            <span>{walletType}</span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                            {availableWallets.length === 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    No compatible wallets detected. Please install HashPack or MetaMask.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Connected Wallet
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Type:</span> {user?.walletType}</p>
                                    <p><span className="font-medium">Address:</span> {user?.walletAddress}</p>
                                    <p><span className="font-medium">Balance:</span> {user?.balance} HBAR</p>
                                    <p><span className="font-medium">Role:</span> {user?.role || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Button onClick={handleUpdateBalance} disabled={isLoading}>
                                    Update Balance
                                </Button>
                                <Button onClick={handleDisconnect} variant="outline">
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transaction Examples */}
            {isConnected && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Plus className="w-5 h-5" />
                                <span>Campaign Operations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleCreateCampaign}
                                disabled={isLoading}
                                className="w-full"
                            >
                                Create Demo Campaign
                            </Button>
                            <Button
                                onClick={handleInvestInCampaign}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full"
                            >
                                Invest in Campaign
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5" />
                                <span>Transfer Operations</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={handleTransferHBAR}
                                disabled={isLoading}
                                className="w-full"
                            >
                                Transfer 5 HBAR
                            </Button>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Note: This will transfer to a demo account. In production, you would specify the actual recipient.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Available Wallets Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>Available Wallets</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl mb-2">🔗</div>
                            <h3 className="font-semibold">HashPack</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {availableWallets.includes(WalletType.HASHPACK) ? 'Available' : 'Not installed'}
                            </p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl mb-2">🦊</div>
                            <h3 className="font-semibold">MetaMask</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {availableWallets.includes(WalletType.METAMASK) ? 'Available' : 'Not installed'}
                            </p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl mb-2">🔌</div>
                            <h3 className="font-semibold">WalletConnect</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {availableWallets.includes(WalletType.WALLETCONNECT) ? 'Available' : 'Always available'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>How to Test</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li>Install HashPack or MetaMask browser extension</li>
                        <li>Create or import a wallet</li>
                        <li>Get testnet HBAR from <a href="https://portal.hedera.com" target="_blank" rel="noopener noreferrer" className="text-[#7F56D9] hover:underline">Hedera Portal</a></li>
                        <li>Connect your wallet using the buttons above</li>
                        <li>Try the different transaction operations</li>
                        <li>Check the transaction results in the message area</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
};

export default WalletDemo; 