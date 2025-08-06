import { Client, AccountBalance, AccountId, Hbar, TransactionId, TransactionResponse, TransactionReceipt } from '@hashgraph/sdk';

// Configuration
export const getHederaClient = (): Client => {
  const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
  
  if (network === 'mainnet') {
    return Client.forMainnet();
  } else {
    return Client.forTestnet();
  }
};

export const getMirrorNodeUrl = (): string => {
  const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
  return network === 'mainnet'
    ? 'https://mainnet-public.mirrornode.hedera.com'
    : 'https://testnet.mirrornode.hedera.com';
};

export const getHashScanUrl = (): string => {
  const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
  return network === 'mainnet'
    ? 'https://hashscan.io/mainnet'
    : 'https://hashscan.io/testnet';
};

// Types
export interface HederaAccountBalance {
  account: string;
  balance: {
    hbars: number;
    tokens: Record<string, number>;
  };
  timestamp: string;
}

export interface HederaTransaction {
  transaction_id: string;
  transaction_hash: string;
  consensus_timestamp: string;
  entity_id: string;
  result: string;
  transfers: Array<{
    account: string;
    amount: number;
  }>;
  token_transfers: Array<{
    token_id: string;
    account: string;
    amount: number;
  }>;
}

export interface ContractCall {
  contract_id: string;
  function_name: string;
  function_parameters: string;
  gas_used: number;
  gas_limit: number;
}

export interface NetworkInfo {
  network: string;
  version: string;
  current_block: number;
  freeze_time: string;
}

// API Service Class
export class HederaApiService {
  private mirrorNodeUrl: string;
  private client: Client;
  private network: string;

  constructor() {
    this.mirrorNodeUrl = getMirrorNodeUrl();
    this.client = getHederaClient();
    this.network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
  }

  // Account Information
  async getAccountBalance(accountId: string): Promise<HederaAccountBalance> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/accounts/${accountId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch account balance: ${response.statusText}`);
      }
      const data = await response.json();
      
      return {
        account: data.account,
        balance: {
          hbars: data.balance ? parseInt(data.balance.balance) / 100000000 : 0, // Convert from tinybar to HBAR
          tokens: data.balance?.tokens || {}
        },
        timestamp: data.balance?.timestamp || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  }

  async getAccountHbarBalance(accountId: string): Promise<string> {
    try {
      const balance = await this.getAccountBalance(accountId);
      return balance.balance.hbars.toFixed(6);
    } catch (error) {
      console.error('Error fetching HBAR balance:', error);
      return '0';
    }
  }

  async getAccountTransactions(accountId: string, limit: number = 50): Promise<HederaTransaction[]> {
    try {
      const response = await fetch(
        `${this.mirrorNodeUrl}/api/v1/transactions?account.id=${accountId}&limit=${limit}&order=desc`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch account transactions: ${response.statusText}`);
      }
      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error('Error fetching account transactions:', error);
      return [];
    }
  }

  // Transaction Information
  async getTransaction(transactionId: string): Promise<HederaTransaction> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/transactions/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }
      const data = await response.json();
      return data.transactions[0];
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  async waitForTransaction(transactionId: string, maxWaitTime: number = 30000): Promise<HederaTransaction> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const transaction = await this.getTransaction(transactionId);
        if (transaction && transaction.result) {
          return transaction;
        }
      } catch (error) {
        // Transaction might not exist yet, continue polling
      }
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error(`Transaction ${transactionId} not found within ${maxWaitTime}ms`);
  }

  // Contract Information
  async getContractInfo(contractId: string): Promise<any> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/contracts/${contractId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch contract info: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching contract info:', error);
      throw error;
    }
  }

  async getContractResults(contractId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.mirrorNodeUrl}/api/v1/contracts/${contractId}/results?limit=${limit}&order=desc`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch contract results: ${response.statusText}`);
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching contract results:', error);
      return [];
    }
  }

  // Network Information
  async getNetworkInfo(): Promise<NetworkInfo> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/network/nodes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch network info: ${response.statusText}`);
      }
      const data = await response.json();
      
      return {
        network: this.network,
        version: data.version || 'unknown',
        current_block: data.timestamp ? parseInt(data.timestamp) : 0,
        freeze_time: data.freeze_time || 'unknown'
      };
    } catch (error) {
      console.error('Error fetching network info:', error);
      throw error;
    }
  }

  // Token Information
  async getTokenInfo(tokenId: string): Promise<any> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/tokens/${tokenId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch token info: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching token info:', error);
      throw error;
    }
  }

  async getAccountTokenBalances(accountId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.mirrorNodeUrl}/api/v1/accounts/${accountId}/tokens`);
      if (!response.ok) {
        throw new Error(`Failed to fetch account token balances: ${response.statusText}`);
      }
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      console.error('Error fetching account token balances:', error);
      return [];
    }
  }

  // Topics (for event listening)
  async getTopicMessages(topicId: string, limit: number = 50): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.mirrorNodeUrl}/api/v1/topics/${topicId}/messages?limit=${limit}&order=desc`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch topic messages: ${response.statusText}`);
      }
      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Error fetching topic messages:', error);
      return [];
    }
  }

  // Utility functions
  formatHbar(amount: number): string {
    return `${amount.toFixed(6)} ℏ`;
  }

  formatTinybar(tinybar: number): string {
    return this.formatHbar(tinybar / 100000000);
  }

  getExplorerUrl(type: 'account' | 'transaction' | 'contract', id: string): string {
    const baseUrl = getHashScanUrl();
    return `${baseUrl}/${type}/${id}`;
  }

  // Convert account ID formats
  parseAccountId(accountId: string): string {
    // Convert various formats to standard format (0.0.xxxxx)
    if (accountId.includes('.')) {
      return accountId;
    }
    // Assume it's just the account number
    return `0.0.${accountId}`;
  }

  // Fee estimation (approximate)
  estimateTransactionFee(): number {
    // Basic transaction fee in HBAR
    return 0.00001; // 0.01 milli-HBAR
  }

  estimateContractCallFee(gasLimit: number = 300000): number {
    // Contract call fee estimation in HBAR
    const baseFee = 0.00001;
    const gasFee = gasLimit * 0.0000001; // Approximate gas cost
    return baseFee + gasFee;
  }
}

// Export singleton instance
export const hederaApi = new HederaApiService();