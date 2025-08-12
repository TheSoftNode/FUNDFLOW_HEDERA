import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { Client, AccountId, AccountBalanceQuery, Hbar } from '@hashgraph/sdk';

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
  balance?: string;
  network?: string;
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
  private client: Client | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeEventHandlers();
      this.setupHederaClient();
      this.loadSavedConnection();
    }
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

  private setupHederaClient() {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    const networkConfig = HEDERA_NETWORKS[network];

    if (networkConfig) {
      this.client = new Client({
        network: network as any
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

  private emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // HashPack Integration
  async connectHashPack(): Promise<WalletConnection> {
    try {
      if (!window.hashpack) {
        throw new Error('HashPack wallet is not installed. Please install HashPack extension.');
      }

      console.log('🔗 Connecting to HashPack wallet...');

      // For now, we'll use a mock connection since HashPack SDK integration requires setup
      // In a real implementation, you would use the HashPack SDK
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection time

      // Mock connection for development
      const mockAccountId = '0.0.1234567';
      const mockAddress = '0x1234567890abcdef';
      let balance = '100.0';

      // Try to get real balance if client is available
      try {
        if (this.client) {
          const query = new AccountBalanceQuery()
            .setAccountId(AccountId.fromString(mockAccountId));
          const accountBalance = await query.execute(this.client);
          balance = accountBalance.hbars.toString();
        }
      } catch (error) {
        console.warn('Could not fetch real balance, using mock:', error);
      }

      const connection: WalletConnection = {
        type: WalletType.HASHPACK,
        accountId: mockAccountId,
        address: mockAddress,
        balance,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet'
      };

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      return connection;
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
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      console.log('🔗 Connecting to MetaMask...');

      // For development, we'll use a mock connection to avoid MetaMask popup issues
      // In production, you would use the real MetaMask connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection time

      // Mock connection for development
      const mockAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const mockBalance = '25.5';

      const connection: WalletConnection = {
        type: WalletType.METAMASK,
        accountId: mockAddress,
        address: mockAddress,
        balance: mockBalance,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet'
      };

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      return connection;
    } catch (error) {
      console.error('MetaMask connection error:', error);
      throw error;
    }
  }

  // WalletConnect Integration
  async connectWalletConnect(): Promise<WalletConnection> {
    try {
      console.log('🔗 Connecting via WalletConnect...');

      // For development, we'll use a mock connection
      // In production, you would use the real WalletConnect v2 implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection time

      // Mock connection for development
      const mockAccountId = '0.0.7654321';
      const mockAddress = '0xfedcba0987654321';
      const balance = '50.0';

      const connection: WalletConnection = {
        type: WalletType.WALLETCONNECT,
        accountId: mockAccountId,
        address: mockAddress,
        balance,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet'
      };

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      return connection;
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw error;
    }
  }

  // Main connect method
  async connect(walletType: WalletType): Promise<WalletConnection> {
    try {
      let connection: WalletConnection;

      switch (walletType) {
        case WalletType.HASHPACK:
          connection = await this.connectHashPack();
          break;
        case WalletType.METAMASK:
          connection = await this.connectMetaMask();
          break;
        case WalletType.WALLETCONNECT:
          connection = await this.connectWalletConnect();
          break;
        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      return connection;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      const connection = this.connection;
      this.connection = null;
      this.clearSavedConnection();
      this.emit('disconnected', connection);
    }
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection !== null;
  }

  async getBalance(): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        if (this.client) {
          const query = new AccountBalanceQuery()
            .setAccountId(AccountId.fromString(this.connection.accountId));
          const accountBalance = await query.execute(this.client);
          return accountBalance.hbars.toString();
        }
      } else if (this.connection.type === WalletType.METAMASK && this.connection.provider) {
        const balance = await this.connection.provider.getBalance(this.connection.address);
        return ethers.formatEther(balance);
      }

      return this.connection.balance || '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        // For HashPack, we'd use the HashPack SDK
        throw new Error('HashPack transaction sending not yet implemented');
      } else if (this.connection.type === WalletType.METAMASK && this.connection.signer) {
        const tx = await this.connection.signer.sendTransaction(transaction);
        return tx.hash;
      }

      throw new Error('Transaction sending not supported for this wallet type');
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        // For HashPack, we'd use the HashPack SDK
        throw new Error('HashPack message signing not yet implemented');
      } else if (this.connection.type === WalletType.METAMASK && this.connection.signer) {
        const signature = await this.connection.signer.signMessage(message);
        return signature;
      }

      throw new Error('Message signing not supported for this wallet type');
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  getNetworkInfo(): NetworkConfig | null {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    return HEDERA_NETWORKS[network] || null;
  }

  // Utility methods
  static isHashPackInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.hashpack;
  }

  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  static getAvailableWallets(): WalletType[] {
    const available: WalletType[] = [];

    if (this.isHashPackInstalled()) {
      available.push(WalletType.HASHPACK);
    }

    if (this.isMetaMaskInstalled()) {
      available.push(WalletType.METAMASK);
    }

    // WalletConnect is always available as it's a web-based solution
    available.push(WalletType.WALLETCONNECT);

    return available;
  }

  static formatAddress(address: string): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Persistence
  private saveConnection() {
    if (this.connection && typeof window !== 'undefined') {
      localStorage.setItem('fundflow_wallet_connection', JSON.stringify(this.connection));
    }
  }

  private loadSavedConnection() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fundflow_wallet_connection');
      if (saved) {
        try {
          this.connection = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading saved connection:', error);
          this.clearSavedConnection();
        }
      }
    }
  }

  private clearSavedConnection() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fundflow_wallet_connection');
    }
  }
}

// Export singleton instance
export const hederaWalletService = new HederaWalletService(); 