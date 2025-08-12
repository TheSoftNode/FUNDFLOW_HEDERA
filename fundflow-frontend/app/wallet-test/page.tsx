"use client";

import React, { useState, useEffect } from 'react';
import { WalletConnector, WalletType } from '@/lib/wallet-connector';

export default function WalletTestPage() {
    const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');
    const [error, setError] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    useEffect(() => {
        addLog('Page loaded');
        checkAvailableWallets();
    }, []);

    const checkAvailableWallets = () => {
        addLog('Checking available wallets...');

        // Check HashPack
        const hashpackInstalled = WalletConnector.isHashPackInstalled();
        addLog(`HashPack installed: ${hashpackInstalled}`);

        // Check MetaMask
        const metamaskInstalled = WalletConnector.isMetaMaskInstalled();
        addLog(`MetaMask installed: ${metamaskInstalled}`);

        // Get all available wallets
        const available = WalletConnector.getAvailableWallets();
        setAvailableWallets(available);
        addLog(`Available wallets: ${available.join(', ')}`);
    };

    const testConnection = async (walletType: WalletType) => {
        addLog(`Testing connection to ${walletType}...`);
        setError('');

        try {
            const connector = new WalletConnector();
            const connection = await connector.connect(walletType);
            setConnectionStatus(`Connected to ${walletType}: ${connection.address}`);
            addLog(`Successfully connected to ${walletType}`);
            addLog(`Address: ${connection.address}`);
            addLog(`Balance: ${connection.balance}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(`Failed to connect to ${walletType}: ${errorMessage}`);
            addLog(`Error connecting to ${walletType}: ${errorMessage}`);
        }
    };

    const testMetaMaskDetection = async () => {
        addLog('Testing MetaMask detection...');

        try {
            const detectEthereumProvider = (await import('@metamask/detect-provider')).default;
            const provider = await detectEthereumProvider();

            if (provider) {
                addLog('MetaMask provider detected');
                addLog(`Provider: ${typeof provider}`);

                // Test requesting accounts
                const accounts = await (provider as any).request({ method: 'eth_requestAccounts' });
                addLog(`Accounts: ${accounts.join(', ')}`);
            } else {
                addLog('MetaMask provider not detected');
            }
        } catch (err) {
            addLog(`Error detecting MetaMask: ${err}`);
        }
    };

    const testHashPackDetection = () => {
        addLog('Testing HashPack detection...');

        if (typeof window !== 'undefined') {
            addLog(`window.hashpack exists: ${!!window.hashpack}`);
            addLog(`window.hashpack type: ${typeof window.hashpack}`);

            if (window.hashpack) {
                addLog('HashPack is available');
            } else {
                addLog('HashPack is not available');
            }
        } else {
            addLog('Window is not available (SSR)');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Wallet Connection Test
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Wallet Detection */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Wallet Detection
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Available Wallets:
                                </h3>
                                <div className="space-y-2">
                                    {availableWallets.map(wallet => (
                                        <div key={wallet} className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {wallet}
                                            </span>
                                        </div>
                                    ))}
                                    {availableWallets.length === 0 && (
                                        <span className="text-sm text-red-500">No wallets detected</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={testMetaMaskDetection}
                                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Test MetaMask Detection
                                </button>

                                <button
                                    onClick={testHashPackDetection}
                                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                >
                                    Test HashPack Detection
                                </button>

                                <button
                                    onClick={checkAvailableWallets}
                                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Refresh Wallet Detection
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Connection Testing */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Connection Testing
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status: {connectionStatus}
                                </h3>
                                {error && (
                                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                {availableWallets.map(wallet => (
                                    <button
                                        key={wallet}
                                        onClick={() => testConnection(wallet)}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Connect to {wallet}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Debug Logs
                    </h2>

                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto">
                        {logs.map((log, index) => (
                            <div key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300 mb-1">
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-sm text-gray-500">No logs yet...</div>
                        )}
                    </div>

                    <button
                        onClick={() => setLogs([])}
                        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Clear Logs
                    </button>
                </div>
            </div>
        </div>
    );
} 