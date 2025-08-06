/**
 * Wallet Integration for FUNDFLOW
 * Based on Hedera Counter DApp approach with HashPack and WalletConnect
 */

import {
  Client,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  AccountId,
  AccountBalanceQuery,
  Hbar,
  TransactionId,
  LedgerId
} from '@hashgraph/sdk';

// Types
export type WalletType = 'hashpack' | 'walletconnect' | 'metamask';
export type HederaNetwork = 'testnet' | 'mainnet';

export interface WalletConnection {
  accountId: string;
  isConnected: boolean;
  network: HederaNetwork;
  balance?: string;
  walletType?: WalletType;
  address?: string;
}

export interface ContractCallResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  data?: any;
}

// Configuration
const ENV = {
  HEDERA_NETWORK: (process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet') as HederaNetwork,
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
  WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'
};

/**
 * Simple HashPack Wallet Manager (Mock implementation for development)
 */
export class HashPackWalletManager {
  private connection: WalletConnection | null = null;
  private client: Client | null = null;

  constructor() {
    this.setupClient();
    this.loadSavedConnection();
  }

  /**
   * Check if HashPack is available
   */
  isAvailable(): boolean {
    // For now, always return true as we're using a mock implementation
    return typeof window !== 'undefined';
  }

  /**
   * Connect to HashPack wallet (Mock implementation)
   */
  async connectWallet(): Promise<WalletConnection> {
    try {
      console.log('🔗 Connecting to HashPack wallet...');

      // Mock connection for development
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockAccountId = '0.0.6255971'; // Mock account ID
      let balance = '100.0'; // Mock balance

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
        accountId: mockAccountId,
        network: ENV.HEDERA_NETWORK,
        isConnected: true,
        walletType: 'hashpack',
        balance
      };

      this.connection = connection;
      this.saveConnection();

      console.log('✅ HashPack wallet connected successfully:', connection);
      return connection;

    } catch (error) {
      console.error('❌ HashPack connection failed:', error);
      throw new Error(`Failed to connect to HashPack: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disconnect from HashPack wallet
   */
  async disconnectWallet(): Promise<void> {
    try {
      this.connection = null;
      this.clearSavedConnection();
      console.log('✅ HashPack wallet disconnected');
    } catch (error) {
      console.error('❌ HashPack disconnect error:', error);
    }
  }

  /**
   * Get current connection
   */
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.connection?.isConnected || false;
  }

  /**
   * Execute contract transaction (Mock implementation)
   */
  private async executeTransaction(
    functionName: string, 
    parameters?: ContractFunctionParameters, 
    payableAmount?: Hbar
  ): Promise<string> {
    if (!this.connection || !ENV.CONTRACT_ADDRESS) {
      throw new Error('Wallet not connected or contract address not set');
    }

    try {
      console.log(`🔄 Executing contract function: ${functionName}`);

      // Mock transaction execution for development
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = `${this.connection.accountId}@${Date.now()}.${Math.floor(Math.random() * 1000000)}`;

      console.log('✅ Contract transaction successful:', transactionId);
      return transactionId;

    } catch (error) {
      console.error('❌ Contract transaction failed:', error);
      throw new Error(`Contract transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // FUNDFLOW specific contract functions

  /**
   * Create a new campaign
   */
  async createCampaign(
    title: string,
    description: string,
    targetAmount: number,
    durationDays: number
  ): Promise<string> {
    const parameters = new ContractFunctionParameters()
      .addString(title)
      .addString(description)
      .addUint256(targetAmount * 1e18) // Convert to wei
      .addUint256(durationDays);
    
    return this.executeTransaction('createCampaign', parameters);
  }

  /**
   * Invest in a campaign
   */
  async investInCampaign(campaignId: number, amount: number): Promise<string> {
    const parameters = new ContractFunctionParameters()
      .addUint256(campaignId);
    
    const payableAmount = new Hbar(amount);
    
    return this.executeTransaction('investInCampaign', parameters, payableAmount);
  }

  /**
   * Add milestone to campaign
   */
  async addMilestone(
    campaignId: number,
    title: string,
    description: string,
    targetAmount: number,
    votingDurationDays: number
  ): Promise<string> {
    const parameters = new ContractFunctionParameters()
      .addUint256(campaignId)
      .addString(title)
      .addString(description)
      .addUint256(targetAmount * 1e18)
      .addUint256(votingDurationDays);
    
    return this.executeTransaction('addMilestone', parameters);
  }

  /**
   * Vote on milestone
   */
  async voteOnMilestone(campaignId: number, milestoneId: number, voteFor: boolean): Promise<string> {
    const parameters = new ContractFunctionParameters()
      .addUint256(campaignId)
      .addUint256(milestoneId)
      .addBool(voteFor);
    
    return this.executeTransaction('voteOnMilestone', parameters);
  }

  /**
   * Release milestone funds
   */
  async releaseMilestoneFunds(campaignId: number, milestoneId: number): Promise<string> {
    const parameters = new ContractFunctionParameters()
      .addUint256(campaignId)
      .addUint256(milestoneId);
    
    return this.executeTransaction('releaseMilestoneFunds', parameters);
  }

  /**
   * Get campaign data (read-only)
   */
  async getCampaign(campaignId: number): Promise<any> {
    if (!this.client || !ENV.CONTRACT_ADDRESS) {
      throw new Error('Client not initialized or contract address not set');
    }

    try {
      console.log('🔍 Querying campaign data from contract...');

      const query = new ContractCallQuery()
        .setContractId(ENV.CONTRACT_ADDRESS)
        .setGas(100000)
        .setFunction('getCampaign', new ContractFunctionParameters().addUint256(campaignId));

      const result = await query.execute(this.client);

      // Mock result for development
      return {
        creator: result.getAddress ? result.getAddress(0) : '0x123...',
        title: `Campaign ${campaignId}`,
        description: 'Mock campaign description',
        targetAmount: result.getUint256 ? result.getUint256(3).toString() : '1000000000000000000000',
        raisedAmount: result.getUint256 ? result.getUint256(4).toString() : '0',
        deadline: result.getUint256 ? result.getUint256(5).toString() : Date.now() + 86400000,
        isActive: true,
        milestoneCount: 0,
        totalInvestors: 0
      };
    } catch (error) {
      console.error('❌ Failed to get campaign data:', error);
      throw new Error('Failed to get campaign data');
    }
  }

  /**
   * Setup Hedera client
   */
  private setupClient(): void {
    if (ENV.HEDERA_NETWORK === 'mainnet') {
      this.client = Client.forMainnet();
    } else {
      this.client = Client.forTestnet();
    }
  }

  /**
   * Save connection to localStorage
   */
  private saveConnection(): void {
    if (this.connection && typeof window !== 'undefined') {
      localStorage.setItem('fundflow_wallet_connection', JSON.stringify(this.connection));
    }
  }

  /**
   * Load saved connection from localStorage
   */
  private loadSavedConnection(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fundflow_wallet_connection');
      if (saved) {
        try {
          this.connection = JSON.parse(saved);
        } catch (error) {
          console.error('Failed to load saved connection:', error);
          this.clearSavedConnection();
        }
      }
    }
  }

  /**
   * Clear saved connection
   */
  private clearSavedConnection(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fundflow_wallet_connection');
    }
  }
}

/**
 * Main Wallet Manager for FUNDFLOW
 */
export class FundFlowWalletManager {
  private hashPackWallet: HashPackWalletManager;
  private currentWallet: WalletConnection | null = null;

  constructor() {
    this.hashPackWallet = new HashPackWalletManager();
    // Initialize current wallet from saved state
    this.currentWallet = this.hashPackWallet.getConnection();
  }

  /**
   * Get available wallets
   */
  getAvailableWallets() {
    return [
      {
        name: 'HashPack',
        id: 'hashpack' as WalletType,
        icon: '/icons/hashpack.svg',
        isAvailable: this.hashPackWallet.isAvailable(),
        downloadUrl: 'https://www.hashpack.app/',
      }
      // Can add more wallets here later
    ];
  }

  /**
   * Connect to wallet
   */
  async connect(walletType: WalletType = 'hashpack'): Promise<WalletConnection> {
    switch (walletType) {
      case 'hashpack':
        this.currentWallet = await this.hashPackWallet.connectWallet();
        return this.currentWallet;
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  /**
   * Disconnect from current wallet
   */
  async disconnect(): Promise<void> {
    if (this.currentWallet) {
      switch (this.currentWallet.walletType) {
        case 'hashpack':
          await this.hashPackWallet.disconnectWallet();
          break;
      }
      this.currentWallet = null;
    }
  }

  /**
   * Get current wallet connection
   */
  getCurrentWallet(): WalletConnection | null {
    return this.currentWallet;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.currentWallet?.isConnected || false;
  }

  /**
   * Get account balance
   */
  async getBalance(): Promise<string> {
    if (!this.currentWallet) {
      throw new Error('Wallet not connected');
    }
    return this.currentWallet.balance || '0';
  }

  // Contract interaction methods

  async createCampaign(title: string, description: string, targetAmount: number, durationDays: number): Promise<string> {
    if (!this.isConnected()) throw new Error('Wallet not connected');
    return this.hashPackWallet.createCampaign(title, description, targetAmount, durationDays);
  }

  async investInCampaign(campaignId: number, amount: number): Promise<string> {
    if (!this.isConnected()) throw new Error('Wallet not connected');
    return this.hashPackWallet.investInCampaign(campaignId, amount);
  }

  async addMilestone(campaignId: number, title: string, description: string, targetAmount: number, votingDurationDays: number): Promise<string> {
    if (!this.isConnected()) throw new Error('Wallet not connected');
    return this.hashPackWallet.addMilestone(campaignId, title, description, targetAmount, votingDurationDays);
  }

  async voteOnMilestone(campaignId: number, milestoneId: number, voteFor: boolean): Promise<string> {
    if (!this.isConnected()) throw new Error('Wallet not connected');
    return this.hashPackWallet.voteOnMilestone(campaignId, milestoneId, voteFor);
  }

  async releaseMilestoneFunds(campaignId: number, milestoneId: number): Promise<string> {
    if (!this.isConnected()) throw new Error('Wallet not connected');
    return this.hashPackWallet.releaseMilestoneFunds(campaignId, milestoneId);
  }

  async getCampaign(campaignId: number): Promise<any> {
    return this.hashPackWallet.getCampaign(campaignId);
  }
}

// Export singleton instance
export const fundFlowWallet = new FundFlowWalletManager();

// Export utility functions
export const connectWallet = (walletType?: WalletType) => fundFlowWallet.connect(walletType);
export const disconnectWallet = () => fundFlowWallet.disconnect();
export const getWalletConnection = () => fundFlowWallet.getCurrentWallet();
export const isWalletConnected = () => fundFlowWallet.isConnected();

// Contract interaction exports
export const createCampaign = (title: string, description: string, targetAmount: number, durationDays: number) => 
  fundFlowWallet.createCampaign(title, description, targetAmount, durationDays);

export const investInCampaign = (campaignId: number, amount: number) => 
  fundFlowWallet.investInCampaign(campaignId, amount);

export const addMilestone = (campaignId: number, title: string, description: string, targetAmount: number, votingDurationDays: number) => 
  fundFlowWallet.addMilestone(campaignId, title, description, targetAmount, votingDurationDays);

export const voteOnMilestone = (campaignId: number, milestoneId: number, voteFor: boolean) => 
  fundFlowWallet.voteOnMilestone(campaignId, milestoneId, voteFor);

export const releaseMilestoneFunds = (campaignId: number, milestoneId: number) => 
  fundFlowWallet.releaseMilestoneFunds(campaignId, milestoneId);

export const getCampaignData = (campaignId: number) => 
  fundFlowWallet.getCampaign(campaignId);