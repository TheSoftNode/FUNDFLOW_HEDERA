import {
  Client,
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  AccountId,
  Hbar,
  TransactionId,
  LedgerId,
  TransferTransaction,
  AccountCreateTransaction,
  PrivateKey,
  PublicKey,
  AccountBalanceQuery
} from '@hashgraph/sdk';
import { ethers } from 'ethers';
import { walletConnector, WalletType } from './wallet-connector';

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  data?: any;
}

export interface CampaignData {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  durationDays: number;
  startDate: number;
  endDate: number;
  creator: string;
  status: 'active' | 'funded' | 'expired' | 'cancelled';
  milestones: MilestoneData[];
}

export interface MilestoneData {
  id: number;
  title: string;
  description: string;
  targetAmount: number;
  votingDurationDays: number;
  votesFor: number;
  votesAgainst: number;
  status: 'pending' | 'approved' | 'rejected' | 'funded';
}

export class HederaTransactionService {
  private client: Client | null = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
    this.setupClient();
  }

  private setupClient() {
    const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
    this.client = new Client({
      network: network as any
    });
  }

  // Campaign Management
  async createCampaign(
    title: string,
    description: string,
    targetAmount: number,
    durationDays: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection) {
        throw new Error('No wallet connected');
      }

      if (connection.type === WalletType.HASHPACK) {
        return await this.createCampaignHashPack(title, description, targetAmount, durationDays);
      } else if (connection.type === WalletType.METAMASK) {
        return await this.createCampaignMetaMask(title, description, targetAmount, durationDays);
      } else {
        throw new Error('Unsupported wallet type for campaign creation');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createCampaignHashPack(
    title: string,
    description: string,
    targetAmount: number,
    durationDays: number
  ): Promise<TransactionResult> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const parameters = new ContractFunctionParameters()
        .addString(title)
        .addString(description)
        .addUint256(targetAmount)
        .addUint256(durationDays);

      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractAddress)
        .setGas(300000)
        .setFunction("createCampaign", parameters);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        data: { receipt }
      };
    } catch (error) {
      console.error('HashPack campaign creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async createCampaignMetaMask(
    title: string,
    description: string,
    targetAmount: number,
    durationDays: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection || !connection.signer) {
        throw new Error('MetaMask signer not available');
      }

      // For MetaMask, we'd need to interact with the EVM contract
      // This is a simplified implementation
      const contractInterface = new ethers.Interface([
        "function createCampaign(string title, string description, uint256 targetAmount, uint256 durationDays) external"
      ]);

      const data = contractInterface.encodeFunctionData("createCampaign", [
        title,
        description,
        targetAmount,
        durationDays
      ]);

      const transaction = {
        to: this.contractAddress,
        data: data,
        gasLimit: ethers.parseUnits("300000", "wei")
      };

      const tx = await connection.signer.sendTransaction(transaction);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: tx.hash,
        data: { receipt }
      };
    } catch (error) {
      console.error('MetaMask campaign creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Investment
  async investInCampaign(campaignId: number, amount: number): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection) {
        throw new Error('No wallet connected');
      }

      if (connection.type === WalletType.HASHPACK) {
        return await this.investInCampaignHashPack(campaignId, amount);
      } else if (connection.type === WalletType.METAMASK) {
        return await this.investInCampaignMetaMask(campaignId, amount);
      } else {
        throw new Error('Unsupported wallet type for investment');
      }
    } catch (error) {
      console.error('Error investing in campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async investInCampaignHashPack(
    campaignId: number,
    amount: number
  ): Promise<TransactionResult> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const parameters = new ContractFunctionParameters()
        .addUint256(campaignId);

      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractAddress)
        .setGas(300000)
        .setPayableAmount(new Hbar(amount))
        .setFunction("investInCampaign", parameters);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        data: { receipt }
      };
    } catch (error) {
      console.error('HashPack investment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async investInCampaignMetaMask(
    campaignId: number,
    amount: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection || !connection.signer) {
        throw new Error('MetaMask signer not available');
      }

      const contractInterface = new ethers.Interface([
        "function investInCampaign(uint256 campaignId) external payable"
      ]);

      const data = contractInterface.encodeFunctionData("investInCampaign", [campaignId]);

      const transaction = {
        to: this.contractAddress,
        data: data,
        value: ethers.parseEther(amount.toString()),
        gasLimit: ethers.parseUnits("300000", "wei")
      };

      const tx = await connection.signer.sendTransaction(transaction);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: tx.hash,
        data: { receipt }
      };
    } catch (error) {
      console.error('MetaMask investment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Milestone Management
  async addMilestone(
    campaignId: number,
    title: string,
    description: string,
    targetAmount: number,
    votingDurationDays: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection) {
        throw new Error('No wallet connected');
      }

      if (connection.type === WalletType.HASHPACK) {
        return await this.addMilestoneHashPack(campaignId, title, description, targetAmount, votingDurationDays);
      } else if (connection.type === WalletType.METAMASK) {
        return await this.addMilestoneMetaMask(campaignId, title, description, targetAmount, votingDurationDays);
      } else {
        throw new Error('Unsupported wallet type for milestone creation');
      }
    } catch (error) {
      console.error('Error adding milestone:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async addMilestoneHashPack(
    campaignId: number,
    title: string,
    description: string,
    targetAmount: number,
    votingDurationDays: number
  ): Promise<TransactionResult> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const parameters = new ContractFunctionParameters()
        .addUint256(campaignId)
        .addString(title)
        .addString(description)
        .addUint256(targetAmount)
        .addUint256(votingDurationDays);

      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractAddress)
        .setGas(300000)
        .setFunction("addMilestone", parameters);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        data: { receipt }
      };
    } catch (error) {
      console.error('HashPack milestone creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async addMilestoneMetaMask(
    campaignId: number,
    title: string,
    description: string,
    targetAmount: number,
    votingDurationDays: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection || !connection.signer) {
        throw new Error('MetaMask signer not available');
      }

      const contractInterface = new ethers.Interface([
        "function addMilestone(uint256 campaignId, string title, string description, uint256 targetAmount, uint256 votingDurationDays) external"
      ]);

      const data = contractInterface.encodeFunctionData("addMilestone", [
        campaignId,
        title,
        description,
        targetAmount,
        votingDurationDays
      ]);

      const transaction = {
        to: this.contractAddress,
        data: data,
        gasLimit: ethers.parseUnits("300000", "wei")
      };

      const tx = await connection.signer.sendTransaction(transaction);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: tx.hash,
        data: { receipt }
      };
    } catch (error) {
      console.error('MetaMask milestone creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Voting
  async voteOnMilestone(
    campaignId: number,
    milestoneId: number,
    voteFor: boolean
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection) {
        throw new Error('No wallet connected');
      }

      if (connection.type === WalletType.HASHPACK) {
        return await this.voteOnMilestoneHashPack(campaignId, milestoneId, voteFor);
      } else if (connection.type === WalletType.METAMASK) {
        return await this.voteOnMilestoneMetaMask(campaignId, milestoneId, voteFor);
      } else {
        throw new Error('Unsupported wallet type for voting');
      }
    } catch (error) {
      console.error('Error voting on milestone:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async voteOnMilestoneHashPack(
    campaignId: number,
    milestoneId: number,
    voteFor: boolean
  ): Promise<TransactionResult> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const parameters = new ContractFunctionParameters()
        .addUint256(campaignId)
        .addUint256(milestoneId)
        .addBool(voteFor);

      const transaction = new ContractExecuteTransaction()
        .setContractId(this.contractAddress)
        .setGas(300000)
        .setFunction("voteOnMilestone", parameters);

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        data: { receipt }
      };
    } catch (error) {
      console.error('HashPack voting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async voteOnMilestoneMetaMask(
    campaignId: number,
    milestoneId: number,
    voteFor: boolean
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection || !connection.signer) {
        throw new Error('MetaMask signer not available');
      }

      const contractInterface = new ethers.Interface([
        "function voteOnMilestone(uint256 campaignId, uint256 milestoneId, bool voteFor) external"
      ]);

      const data = contractInterface.encodeFunctionData("voteOnMilestone", [
        campaignId,
        milestoneId,
        voteFor
      ]);

      const transaction = {
        to: this.contractAddress,
        data: data,
        gasLimit: ethers.parseUnits("300000", "wei")
      };

      const tx = await connection.signer.sendTransaction(transaction);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: tx.hash,
        data: { receipt }
      };
    } catch (error) {
      console.error('MetaMask voting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Query Functions
  async getCampaign(campaignId: number): Promise<CampaignData | null> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const parameters = new ContractFunctionParameters()
        .addUint256(campaignId);

      const query = new ContractCallQuery()
        .setContractId(this.contractAddress)
        .setGas(100000)
        .setFunction("getCampaign", parameters);

      const response = await query.execute(this.client);

      if (response.getUint256(0).toString() === '0') {
        return null; // Campaign doesn't exist
      }

      // Parse campaign data from response
      // This would need to match your smart contract structure
      const campaign: CampaignData = {
        id: campaignId,
        title: response.getString(0),
        description: response.getString(1),
        targetAmount: Number(response.getUint256(2)),
        currentAmount: Number(response.getUint256(3)),
        durationDays: Number(response.getUint256(4)),
        startDate: Number(response.getUint256(5)),
        endDate: Number(response.getUint256(6)),
        creator: response.getString(7),
        status: response.getString(8) as any,
        milestones: [] // Would need to query milestones separately
      };

      return campaign;
    } catch (error) {
      console.error('Error getting campaign:', error);
      return null;
    }
  }

  // Utility Functions
  async getBalance(accountId: string): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const query = new AccountBalanceQuery()
        .setAccountId(AccountId.fromString(accountId));

      const accountBalance = await query.execute(this.client);
      return accountBalance.hbars.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async transferHBAR(toAccountId: string, amount: number): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection) {
        throw new Error('No wallet connected');
      }

      if (connection.type === WalletType.HASHPACK) {
        return await this.transferHBARHashPack(toAccountId, amount);
      } else if (connection.type === WalletType.METAMASK) {
        return await this.transferHBARMetaMask(toAccountId, amount);
      } else {
        throw new Error('Unsupported wallet type for transfer');
      }
    } catch (error) {
      console.error('Error transferring HBAR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async transferHBARHashPack(
    toAccountId: string,
    amount: number
  ): Promise<TransactionResult> {
    try {
      if (!this.client) {
        throw new Error('Hedera client not initialized');
      }

      const transaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(toAccountId), new Hbar(amount))
        .addHbarTransfer(AccountId.fromString("0.0.0"), new Hbar(-amount));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId.toString(),
        data: { receipt }
      };
    } catch (error) {
      console.error('HashPack transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async transferHBARMetaMask(
    toAccountId: string,
    amount: number
  ): Promise<TransactionResult> {
    try {
      const connection = walletConnector.getConnection();
      if (!connection || !connection.signer) {
        throw new Error('MetaMask signer not available');
      }

      const transaction = {
        to: toAccountId,
        value: ethers.parseEther(amount.toString()),
        gasLimit: ethers.parseUnits("21000", "wei")
      };

      const tx = await connection.signer.sendTransaction(transaction);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionId: tx.hash,
        data: { receipt }
      };
    } catch (error) {
      console.error('MetaMask transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const hederaTransactionService = new HederaTransactionService();