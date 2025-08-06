import { StacksNetwork, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';

// Configuration
export const getStacksNetwork = (): StacksNetwork => {
  return process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' 
    ? STACKS_MAINNET 
    : STACKS_TESTNET;
};

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://api.hiro.so'
    : 'https://api.testnet.hiro.so';
};

// Types
export interface AccountBalance {
  stx: {
    balance: string;
    locked: string;
    unlock_height: number;
  };
  fungible_tokens: Record<string, {
    balance: string;
    total_sent: string;
    total_received: string;
  }>;
  non_fungible_tokens: Record<string, {
    count: string;
    total_sent: string;
    total_received: string;
  }>;
}

export interface TransactionResult {
  tx_id: string;
  tx_status: 'pending' | 'success' | 'abort_by_response' | 'abort_by_post_condition';
  tx_result: {
    hex: string;
    repr: string;
  };
  events: any[];
}

export interface BlockInfo {
  height: number;
  hash: string;
  burn_block_time: number;
  burn_block_time_iso: string;
  burn_block_hash: string;
  burn_block_height: number;
  miner_txid: string;
  parent_block_hash: string;
  parent_microblock_hash: string;
  parent_microblock_sequence: number;
  txs: string[];
}

// API Functions
export class StacksApiService {
  private baseUrl: string;
  private network: StacksNetwork;

  constructor() {
    this.baseUrl = getApiUrl();
    this.network = getStacksNetwork();
  }

  // Account Information
  async getAccountBalance(address: string): Promise<AccountBalance> {
    const response = await fetch(`${this.baseUrl}/extended/v2/addresses/${address}/balances`);
    if (!response.ok) {
      throw new Error(`Failed to fetch account balance: ${response.statusText}`);
    }
    return response.json();
  }

  async getAccountSTXBalance(address: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/extended/v2/addresses/${address}/balances/stx?include_mempool=false`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch STX balance: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Convert microSTX to STX
      const microStxBalance = data.balance || 0;
      const stxBalance = (parseInt(microStxBalance) / 1000000).toFixed(6);
      return stxBalance;
    } catch (error) {
      console.error("Error fetching STX balance:", error);
      return '0';
    }
  }

  async getAccountTransactions(address: string, limit: number = 50): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/extended/v2/addresses/${address}/transactions?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch account transactions: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results;
  }

  // Transaction Information
  async getTransaction(txId: string): Promise<TransactionResult> {
    const response = await fetch(`${this.baseUrl}/extended/v1/tx/${txId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch transaction: ${response.statusText}`);
    }
    return response.json();
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v2/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: txHex,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to broadcast transaction: ${errorText}`);
    }
    
    return response.text(); // Returns transaction ID
  }

  // Block Information
  async getLatestBlock(): Promise<BlockInfo> {
    const response = await fetch(`${this.baseUrl}/extended/v1/block/latest`);
    if (!response.ok) {
      throw new Error(`Failed to fetch latest block: ${response.statusText}`);
    }
    return response.json();
  }

  async getBlockByHeight(height: number): Promise<BlockInfo> {
    const response = await fetch(`${this.baseUrl}/extended/v1/block/by_height/${height}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch block by height: ${response.statusText}`);
    }
    return response.json();
  }

  // Contract Information
  async getContractInterface(contractAddress: string, contractName: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/v2/contracts/interface/${contractAddress}/${contractName}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch contract interface: ${response.statusText}`);
    }
    return response.json();
  }

  async callReadOnlyFunction(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: string[],
    sender?: string
  ): Promise<any> {
    const body = {
      function_name: functionName,
      function_args: functionArgs,
      sender: sender || contractAddress,
    };

    const response = await fetch(
      `${this.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to call read-only function: ${response.statusText}`);
    }
    return response.json();
  }

  // Fee Estimation
  async estimateTransactionFee(txHex: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}/v2/fees/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: txHex,
    });

    if (!response.ok) {
      throw new Error(`Failed to estimate transaction fee: ${response.statusText}`);
    }

    const result = await response.text();
    return parseInt(result);
  }

  async getTransferFee(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/v2/fees/transfer`);
    if (!response.ok) {
      throw new Error(`Failed to fetch transfer fee: ${response.statusText}`);
    }
    const result = await response.text();
    return parseInt(result);
  }

  // Network Information
  async getNetworkInfo(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v2/info`);
    if (!response.ok) {
      throw new Error(`Failed to fetch network info: ${response.statusText}`);
    }
    return response.json();
  }

  async getNetworkStatus(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/extended/v1/status`);
    if (!response.ok) {
      throw new Error(`Failed to fetch network status: ${response.statusText}`);
    }
    return response.json();
  }

  // Mempool
  async getMempoolTransactions(limit: number = 50): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/extended/v1/tx/mempool?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch mempool transactions: ${response.statusText}`);
    }
    const data = await response.json();
    return data.results;
  }

  // Search
  async searchById(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/extended/v1/search/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to search by ID: ${response.statusText}`);
    }
    return response.json();
  }
}

// Export singleton instance
export const stacksApi = new StacksApiService();