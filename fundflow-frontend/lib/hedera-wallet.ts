import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// HashPack Integration
declare global {
  interface Window {
    hashpack?: any;
    ethereum?: any;
  }
}

export enum WalletType {
  HASHPACK = 'hashpack',
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect'
}

export interface WalletConnection {
  type: WalletType;
  accountId: string;
  address: string;
  signer?: ethers.Signer;
  provider?: ethers.Provider;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl: string;
}

// Network configurations
export const HEDERA_NETWORKS: Record<string, NetworkConfig> = {
  testnet: {
    chainId: 296,
    name: 'Hedera Testnet',
    rpcUrl: 'https://testnet.hashio.io/api',
    currency: {
      name: 'HBAR',
      symbol: 'HBAR',
      decimals: 18
    },
    blockExplorerUrl: 'https://hashscan.io/testnet'
  },
  mainnet: {
    chainId: 295,
    name: 'Hedera Mainnet',
    rpcUrl: 'https://mainnet.hashio.io/api',
    currency: {
      name: 'HBAR',
      symbol: 'HBAR',
      decimals: 18
    },
    blockExplorerUrl: 'https://hashscan.io/mainnet'
  }
};

export class HederaWalletService {
  private connection: WalletConnection | null = null;
  private listeners: { [event: string]: Function[] } = {};

  constructor() {
    this.initializeEventHandlers();
  }

  // Event handling
  private initializeEventHandlers() {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        this.emit('accountsChanged', accounts);
        if (accounts.length === 0) {
          this.disconnect();
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        this.emit('chainChanged', chainId);
      });
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // HashPack Integration
  async connectHashPack(): Promise<WalletConnection> {
    try {
      if (!window.hashpack) {
        throw new Error('HashPack wallet not found. Please install HashPack wallet extension.');
      }

      const hashpack = window.hashpack;
      const response = await hashpack.connectToLocalWallet();
      
      if (!response.success) {
        throw new Error(`HashPack connection failed: ${response.error}`);
      }

      const accountInfo = response.data.accountIds[0];
      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
      const networkConfig = HEDERA_NETWORKS[network];

      // Create ethers provider and signer for contract interactions
      const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      
      this.connection = {
        type: WalletType.HASHPACK,
        accountId: accountInfo,
        address: accountInfo, // HashPack uses account ID format
        provider: provider
      };

      this.emit('connected', this.connection);
      return this.connection;
    } catch (error) {
      console.error('HashPack connection error:', error);
      throw error;
    }
  }

  // MetaMask Integration
  async connectMetaMask(): Promise<WalletConnection> {
    try {
      const provider = await detectEthereumProvider();
      
      if (!provider) {
        throw new Error('MetaMask not found. Please install MetaMask wallet extension.');
      }

      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      
      // Check if we're on the correct network
      const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
      const networkConfig = HEDERA_NETWORKS[network];
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }]
        });
      } catch (switchError: any) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${networkConfig.chainId.toString(16)}`,
              chainName: networkConfig.name,
              rpcUrls: [networkConfig.rpcUrl],
              nativeCurrency: networkConfig.currency,
              blockExplorerUrls: [networkConfig.blockExplorerUrl]
            }]
          });
        } else {
          throw switchError;
        }
      }

      this.connection = {
        type: WalletType.METAMASK,
        accountId: address,
        address: address,
        signer: signer,
        provider: ethersProvider
      };

      this.emit('connected', this.connection);
      return this.connection;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  }

  // Generic connection method
  async connect(walletType: WalletType): Promise<WalletConnection> {
    switch (walletType) {
      case WalletType.HASHPACK:
        return this.connectHashPack();
      case WalletType.METAMASK:
        return this.connectMetaMask();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  // Disconnect
  async disconnect() {
    if (this.connection?.type === WalletType.HASHPACK && window.hashpack) {
      try {
        await window.hashpack.disconnect();
      } catch (error) {
        console.error('HashPack disconnect error:', error);
      }
    }

    this.connection = null;
    this.emit('disconnected', null);
  }

  // Get current connection
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection !== null;
  }

  // Get balance
  async getBalance(): Promise<string> {
    if (!this.connection) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        // Use Hedera API to get balance
        const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
        const mirrorNodeUrl = network === 'mainnet' 
          ? 'https://mainnet-public.mirrornode.hedera.com'
          : 'https://testnet.mirrornode.hedera.com';
        
        const response = await fetch(`${mirrorNodeUrl}/api/v1/accounts/${this.connection.accountId}`);
        const data = await response.json();
        const balance = data.balance ? parseInt(data.balance.balance) / 100000000 : 0;
        return balance.toFixed(6);
      } else if (this.connection.provider) {
        const balance = await this.connection.provider.getBalance(this.connection.address);
        return ethers.formatEther(balance);
      }
      
      return '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  // Sign and send transaction
  async sendTransaction(transaction: any): Promise<string> {
    if (!this.connection) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        // HashPack transaction handling
        const hashpack = window.hashpack;
        const response = await hashpack.sendTransaction(
          this.connection.accountId,
          transaction
        );
        
        if (!response.success) {
          throw new Error(`Transaction failed: ${response.error}`);
        }
        
        return response.data.transactionId;
      } else if (this.connection.signer) {
        // MetaMask/Ethers transaction handling
        const tx = await this.connection.signer.sendTransaction(transaction);
        await tx.wait();
        return tx.hash;
      }
      
      throw new Error('No valid signer available');
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    if (!this.connection) {
      throw new Error('Wallet not connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        const hashpack = window.hashpack;
        const response = await hashpack.signMessage(message, this.connection.accountId);
        
        if (!response.success) {
          throw new Error(`Message signing failed: ${response.error}`);
        }
        
        return response.data.signature;
      } else if (this.connection.signer) {
        return await this.connection.signer.signMessage(message);
      }
      
      throw new Error('No valid signer available');
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  // Get network info
  getNetworkInfo(): NetworkConfig | null {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    return HEDERA_NETWORKS[network] || null;
  }

  // Check if wallet extension is installed
  static isHashPackInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.hashpack;
  }

  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  // Get available wallet types
  static getAvailableWallets(): WalletType[] {
    const wallets: WalletType[] = [];
    
    if (this.isHashPackInstalled()) {
      wallets.push(WalletType.HASHPACK);
    }
    
    if (this.isMetaMaskInstalled()) {
      wallets.push(WalletType.METAMASK);
    }
    
    return wallets;
  }

  // Format address for display
  static formatAddress(address: string): string {
    if (!address) return '';
    
    if (address.includes('.')) {
      // Hedera account ID format
      return address;
    } else {
      // Ethereum address format
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
  }
}

// Export singleton instance
export const hederaWallet = new HederaWalletService();