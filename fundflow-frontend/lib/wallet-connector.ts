import { ethers } from 'ethers';
import { Client, AccountId, AccountBalanceQuery, Hbar, LedgerId } from '@hashgraph/sdk';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { DAppConnector } from '@hashgraph/hedera-wallet-connect';
import { MetaMaskInpageProvider } from '@metamask/providers';

// Types
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
  chainId?: number;
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

export class WalletConnector {
  private connection: WalletConnection | null = null;
  private listeners: { [event: string]: Function[] } = {};
  private hederaClient: Client | null = null;
  private walletConnectProvider: any = null;
  private hashPackConnector: DAppConnector | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeHederaClient();
      this.loadSavedConnection();
    }
  }

  // Event handling
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

  private initializeHederaClient() {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    this.hederaClient = new Client({
      network: network as any
    });
  }

  // Helper method to get ethereum provider with proper typing
  private get ethereum(): MetaMaskInpageProvider | undefined {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum as unknown as MetaMaskInpageProvider;
    }
    return undefined;
  }

  // HashPack Integration
  async connectHashPack(): Promise<WalletConnection> {
    try {
      if (!window.hashpack) {
        throw new Error('HashPack wallet is not installed. Please install HashPack extension.');
      }

      console.log('🔗 Connecting to HashPack wallet...');

      // Initialize HashPack connector
      if (!this.hashPackConnector) {
        const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet' ? LedgerId.MAINNET : LedgerId.TESTNET;
        
        this.hashPackConnector = new DAppConnector({
          name: process.env.NEXT_PUBLIC_HASHPACK_APP_NAME || 'FundFlow',
          description: process.env.NEXT_PUBLIC_HASHPACK_APP_DESCRIPTION || 'Blockchain-Powered Startup Fundraising Platform',
          url: process.env.NEXT_PUBLIC_HASHPACK_APP_URL || 'https://fundflow.com',
          icons: ['https://fundflow.com/icon.png']
        }, network, process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!);
      }

      // Initialize the connector
      await this.hashPackConnector.init();

      // Connect to HashPack using extension
      const session = await this.hashPackConnector.connectExtension('hashpack');
      
      // Get the first available signer
      const signers = this.hashPackConnector.signers;
      if (signers.length === 0) {
        throw new Error('No signers available after connection');
      }

      const signer = signers[0];
      const accountId = signer.getAccountId().toString();
      
      // Get account balance
      let balance = '0';
      try {
        if (this.hederaClient) {
          const query = new AccountBalanceQuery()
            .setAccountId(AccountId.fromString(accountId));
          const accountBalance = await query.execute(this.hederaClient);
          balance = accountBalance.hbars.toString();
        }
      } catch (error) {
        console.warn('Could not fetch balance:', error);
      }

      const connection: WalletConnection = {
        type: WalletType.HASHPACK,
        accountId,
        address: accountId, // HashPack uses account IDs
        balance,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        chainId: HEDERA_NETWORKS[process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet']?.chainId
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
      const ethereum = this.ethereum;
      if (!ethereum?.isMetaMask) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      console.log('🔗 Connecting to MetaMask...');

      // Request accounts
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const account = accounts[0];

      if (!account) {
        throw new Error('No accounts found');
      }

      // Check if we're on the correct network
      const chainId = await ethereum.request({ method: 'eth_chainId' }) as string;
      const expectedChainId = process.env.NEXT_PUBLIC_METAMASK_CHAIN_ID || '296';

      if (chainId !== `0x${parseInt(expectedChainId).toString(16)}`) {
        // Request network switch
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(expectedChainId).toString(16)}` }]
          });
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            const networkConfig = HEDERA_NETWORKS[process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet'];
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${networkConfig.chainId.toString(16)}`,
                chainName: networkConfig.name,
                nativeCurrency: networkConfig.currency,
                rpcUrls: [networkConfig.rpcUrl],
                blockExplorerUrls: [networkConfig.blockExplorerUrl]
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Get balance
      const balance = await provider.getBalance(account);
      const balanceInEther = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: WalletType.METAMASK,
        accountId: account,
        address: account,
        signer,
        provider,
        balance: balanceInEther,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        chainId: parseInt(expectedChainId)
      };

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      // Set up event listeners
      this.setupMetaMaskListeners();

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

      if (!this.walletConnectProvider) {
        this.walletConnectProvider = await EthereumProvider.init({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          chains: [parseInt(process.env.NEXT_PUBLIC_METAMASK_CHAIN_ID || '296')],
          showQrModal: true,
          metadata: {
            name: 'FundFlow',
            description: 'Blockchain-Powered Startup Fundraising Platform',
            url: 'https://fundflow.com',
            icons: ['https://fundflow.com/icon.png']
          }
        });
      }

      // Connect
      await this.walletConnectProvider.connect();

      // Get accounts
      const accounts = await this.walletConnectProvider.request({ method: 'eth_accounts' }) as string[];
      const account = accounts[0];

      if (!account) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      const provider = new ethers.BrowserProvider(this.walletConnectProvider);
      const signer = await provider.getSigner();

      // Get balance
      const balance = await provider.getBalance(account);
      const balanceInEther = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: WalletType.WALLETCONNECT,
        accountId: account,
        address: account,
        signer,
        provider,
        balance: balanceInEther,
        network: process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        chainId: parseInt(process.env.NEXT_PUBLIC_METAMASK_CHAIN_ID || '296')
      };

      this.connection = connection;
      this.saveConnection();
      this.emit('connected', connection);

      // Set up event listeners
      this.setupWalletConnectListeners();

      return connection;
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      throw error;
    }
  }

  private setupMetaMaskListeners() {
    const ethereum = this.ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts: unknown) => {
        const accountArray = accounts as string[];
        this.emit('accountsChanged', accountArray);
        if (accountArray.length === 0) {
          this.disconnect();
        } else {
          // Update connection with new account
          this.updateConnection(accountArray[0]);
        }
      });

      ethereum.on('chainChanged', (chainId: unknown) => {
        const chainIdStr = chainId as string;
        this.emit('chainChanged', chainIdStr);
        // Check if we need to reconnect
        const expectedChainId = process.env.NEXT_PUBLIC_METAMASK_CHAIN_ID || '296';
        if (parseInt(chainIdStr, 16).toString() !== expectedChainId) {
          this.emit('networkMismatch', { current: chainIdStr, expected: expectedChainId });
        }
      });
    }
  }

  private setupWalletConnectListeners() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.on('accountsChanged', (accounts: string[]) => {
        this.emit('accountsChanged', accounts);
        if (accounts.length === 0) {
          this.disconnect();
        } else {
          this.updateConnection(accounts[0]);
        }
      });

      this.walletConnectProvider.on('chainChanged', (chainId: string) => {
        this.emit('chainChanged', chainId);
      });

      this.walletConnectProvider.on('disconnect', () => {
        this.disconnect();
      });
    }
  }

  private async updateConnection(newAccount: string) {
    if (!this.connection) return;

    try {
      if (this.connection.type === WalletType.METAMASK && this.connection.provider) {
        const signer = await (this.connection.provider as any).getSigner();
        const balance = await this.connection.provider.getBalance(newAccount);
        const balanceInEther = ethers.formatEther(balance);

        const updatedConnection: WalletConnection = {
          ...this.connection,
          accountId: newAccount,
          address: newAccount,
          signer,
          balance: balanceInEther
        };

        this.connection = updatedConnection;
        this.saveConnection();
        this.emit('accountChanged', updatedConnection);
      }
    } catch (error) {
      console.error('Error updating connection:', error);
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

      return connection;
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      const connection = this.connection;
      
      // Disconnect from specific wallet
      if (this.connection.type === WalletType.WALLETCONNECT && this.walletConnectProvider) {
        await this.walletConnectProvider.disconnect();
      }

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
        if (this.hederaClient) {
          const query = new AccountBalanceQuery()
            .setAccountId(AccountId.fromString(this.connection.accountId));
          const accountBalance = await query.execute(this.hederaClient);
          return accountBalance.hbars.toString();
        }
      } else if (this.connection.provider) {
        const balance = await this.connection.provider.getBalance(this.connection.address);
        return ethers.formatEther(balance);
      }

      return this.connection.balance || '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        if (this.hashPackConnector && this.connection.accountId) {
          const signer = this.hashPackConnector.getSigner(AccountId.fromString(this.connection.accountId));
          const signature = await signer.sign([new TextEncoder().encode(message)]);
          return Buffer.from(signature[0].signature).toString('hex');
        }
        throw new Error('HashPack connector not available');
      } else if (this.connection.signer) {
        const signature = await this.connection.signer.signMessage(message);
        return signature;
      }

      throw new Error('Message signing not supported for this wallet type');
    } catch (error) {
      console.error('Message signing error:', error);
      throw error;
    }
  }

  async sendTransaction(transaction: any): Promise<string> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      if (this.connection.type === WalletType.HASHPACK) {
        if (this.hashPackConnector && this.connection.accountId) {
          const signer = this.hashPackConnector.getSigner(AccountId.fromString(this.connection.accountId));
          const signedTransaction = await signer.signTransaction(transaction);
          const result = await signedTransaction.execute(this.hederaClient!);
          return result.transactionId.toString();
        }
        throw new Error('HashPack connector not available');
      } else if (this.connection.signer) {
        const tx = await this.connection.signer.sendTransaction(transaction);
        return tx.hash;
      }

      throw new Error('Transaction sending not supported for this wallet type');
    } catch (error) {
      console.error('Transaction error:', error);
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
    if (typeof window === 'undefined') return false;
    return !!window.ethereum?.isMetaMask;
  }

  static getAvailableWallets(): WalletType[] {
    const available: WalletType[] = [];

    if (this.isHashPackInstalled()) {
      available.push(WalletType.HASHPACK);
    }

    if (this.isMetaMaskInstalled()) {
      available.push(WalletType.METAMASK);
    }

    // WalletConnect is always available
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
export const walletConnector = new WalletConnector();
