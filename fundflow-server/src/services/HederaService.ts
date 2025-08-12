import {
  Client,
  PrivateKey,
  AccountId,
  ContractId,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  Hbar,
  TransactionReceiptQuery,
  TransactionResponse,
  Status,
  ReceiptStatusError,
  TransactionId
} from '@hashgraph/sdk';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

export interface HederaConfig {
  network: string;
  accountId: string;
  privateKey: string;
  gasLimit: number;
  maxTransactionFee: Hbar;
}

export interface ContractCallResult {
  success: boolean;
  transactionId?: string;
  receipt?: any;
  error?: string;
  data?: any;
}

export interface ContractQueryResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class HederaService {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;
  private config: HederaConfig;

  constructor(config: HederaConfig) {
    this.config = config;
    this.operatorId = AccountId.fromString(config.accountId);

    // Parse private key (remove 0x prefix if present)
    let privateKeyString = config.privateKey;
    if (privateKeyString.startsWith('0x')) {
      privateKeyString = privateKeyString.slice(2);
    }
    this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);

    // Initialize client
    this.client = Client.forName(config.network);
    this.client.setOperator(this.operatorId, this.operatorKey);

    logger.info(`HederaService initialized for network: ${config.network}`);
  }

  /**
   * Execute a contract function
   */
  async executeContractFunction(
    contractId: string,
    functionName: string,
    parameters: any[] = [],
    gas: number = this.config.gasLimit
  ): Promise<ContractCallResult> {
    try {
      logger.info(`Executing contract function: ${functionName} on contract: ${contractId}`);

      const contractParams = this.buildContractParameters(parameters);

      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, contractParams)
        .setMaxTransactionFee(this.config.maxTransactionFee);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      if (receipt.status !== Status.Success) {
        throw new ReceiptStatusError(`Transaction failed with status: ${receipt.status}`);
      }

      logger.info(`Contract function ${functionName} executed successfully. Transaction ID: ${txResponse.transactionId}`);

      return {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        receipt: receipt
      };

    } catch (error) {
      logger.error(`Failed to execute contract function ${functionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Query a contract function
   */
  async queryContractFunction(
    contractId: string,
    functionName: string,
    parameters: any[] = []
  ): Promise<ContractQueryResult> {
    try {
      logger.info(`Querying contract function: ${functionName} on contract: ${contractId}`);

      const contractParams = this.buildContractParameters(parameters);

      const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(this.config.gasLimit)
        .setFunction(functionName, contractParams);

      const response = await query.execute(this.client);

      if (response.errorMessage) {
        throw new Error(`Contract query failed: ${response.errorMessage}`);
      }

      const result = response.getResult([]);
      logger.info(`Contract function ${functionName} queried successfully`);

      return {
        success: true,
        data: result
      };

    } catch (error) {
      logger.error(`Failed to query contract function ${functionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(transactionId: string): Promise<any> {
    try {
      const txId = TransactionId.fromString(transactionId);
      const receipt = await new TransactionReceiptQuery()
        .setTransactionId(txId)
        .execute(this.client);

      return receipt;
    } catch (error) {
      logger.error(`Failed to get transaction receipt for ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(accountId: string): Promise<Hbar> {
    try {
      const account = AccountId.fromString(accountId);
      const balance = await this.client.getAccountBalance(account);
      return balance;
      return balance;
    } catch (error) {
      logger.error(`Failed to get account balance for ${accountId}:`, error);
      throw error;
    }
  }

  /**
   * Build contract parameters from array
   */
  private buildContractParameters(parameters: any[]): ContractFunctionParameters {
    const contractParams = new ContractFunctionParameters();

    parameters.forEach(param => {
      if (typeof param === 'string') {
        if (param.startsWith('0x') && param.length === 42) {
          // Ethereum address
          contractParams.addAddress(param);
        } else {
          // Regular string
          contractParams.addString(param);
        }
      } else if (typeof param === 'number') {
        contractParams.addUint256(param);
      } else if (typeof param === 'bigint') {
        contractParams.addUint256(param);
      } else if (typeof param === 'boolean') {
        contractParams.addBool(param);
      } else if (Array.isArray(param)) {
        // Handle array parameters
        param.forEach(item => {
          if (typeof item === 'string') {
            contractParams.addString(item);
          } else if (typeof item === 'number') {
            contractParams.addUint256(item);
          }
        });
      }
    });

    return contractParams;
  }

  /**
   * Get client instance
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Get operator account ID
   */
  getOperatorId(): string {
    return this.operatorId.toString();
  }

  /**
   * Get operator account ID as AccountId object
   */
  getOperatorAccountId(): AccountId {
    return this.operatorId;
  }

  /**
   * Convert Hedera account ID to Solidity address
   */
  accountIdToSolidityAddress(accountId: string): string {
    return AccountId.fromString(accountId).toSolidityAddress();
  }

  /**
   * Convert Solidity address to Hedera account ID
   */
  solidityAddressToAccountId(address: string): string {
    return AccountId.fromSolidityAddress(address).toString();
  }
}

// Export singleton instance
export const hederaService = new HederaService({
  network: config.HEDERA_NETWORK,
  accountId: config.HEDERA_OPERATOR_ID,
  privateKey: config.HEDERA_OPERATOR_KEY,
  gasLimit: config.GAS_LIMIT,
  maxTransactionFee: Hbar.from(config.MAX_TRANSACTION_FEE)
});
