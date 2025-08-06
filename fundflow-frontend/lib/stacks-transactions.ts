import {
  makeContractCall,
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  boolCV,
  PostCondition,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { UserSession } from '@stacks/connect';
import { stacksApi, getStacksNetwork } from './stacks-api';

// Contract configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = 'fundflow-core';

export interface CampaignData {
  title: string;
  description: string;
  targetAmount: number;
  durationBlocks: number;
}

export interface MilestoneData {
  campaignId: number;
  title: string;
  description: string;
  targetAmount: number;
  votingDurationBlocks: number;
}

export interface InvestmentData {
  campaignId: number;
  amount: number;
}

export class FundFlowTransactions {
  private network: StacksNetwork;
  private userSession: UserSession | null;

  constructor(userSession: UserSession | null) {
    this.network = getStacksNetwork();
    this.userSession = userSession;
  }

  // Campaign Management

  async createCampaign(campaignData: CampaignData): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();
    const senderAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

    // Convert STX to microSTX (multiply by 1,000,000)
    const targetAmountMicroSTX = campaignData.targetAmount * 1000000;

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'create-campaign',
      functionArgs: [
        stringAsciiCV(campaignData.title),
        stringAsciiCV(campaignData.description),
        uintCV(targetAmountMicroSTX),
        uintCV(campaignData.durationBlocks),
      ],
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }

  async investInCampaign(investmentData: InvestmentData): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();
    const senderAddress = userData.profile.stxAddress.mainnet || userData.profile.stxAddress.testnet;

    // Convert STX to microSTX
    const amountMicroSTX = investmentData.amount * 1000000;

    // Create post condition to ensure STX transfer
    const postConditions: PostCondition[] = [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.Equal,
        amountMicroSTX
      ),
    ];

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'invest-in-campaign',
      functionArgs: [
        uintCV(investmentData.campaignId),
        uintCV(amountMicroSTX),
      ],
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Deny,
      postConditions,
    };

    const transaction = await makeContractCall(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }

  // Milestone Management

  async addMilestone(milestoneData: MilestoneData): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();

    // Convert STX to microSTX
    const targetAmountMicroSTX = milestoneData.targetAmount * 1000000;

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'add-milestone',
      functionArgs: [
        uintCV(milestoneData.campaignId),
        stringAsciiCV(milestoneData.title),
        stringAsciiCV(milestoneData.description),
        uintCV(targetAmountMicroSTX),
        uintCV(milestoneData.votingDurationBlocks),
      ],
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }

  async voteOnMilestone(campaignId: number, milestoneId: number, voteFor: boolean): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'vote-on-milestone',
      functionArgs: [
        uintCV(campaignId),
        uintCV(milestoneId),
        boolCV(voteFor),
      ],
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }

  async releaseMilestoneFunds(campaignId: number, milestoneId: number): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'release-milestone-funds',
      functionArgs: [
        uintCV(campaignId),
        uintCV(milestoneId),
      ],
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }

  // Read-only functions for fetching data

  async getCampaign(campaignId: number): Promise<any> {
    try {
      const result = await stacksApi.callReadOnlyFunction(
        CONTRACT_ADDRESS,
        CONTRACT_NAME,
        'get-campaign',
        [uintCV(campaignId).serialize()],
      );
      return result;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async getMilestone(campaignId: number, milestoneId: number): Promise<any> {
    try {
      const result = await stacksApi.callReadOnlyFunction(
        CONTRACT_ADDRESS,
        CONTRACT_NAME,
        'get-milestone',
        [uintCV(campaignId).serialize(), uintCV(milestoneId).serialize()],
      );
      return result;
    } catch (error) {
      console.error('Error fetching milestone:', error);
      throw error;
    }
  }

  async getInvestment(campaignId: number, investorAddress: string): Promise<any> {
    try {
      const result = await stacksApi.callReadOnlyFunction(
        CONTRACT_ADDRESS,
        CONTRACT_NAME,
        'get-investment',
        [uintCV(campaignId).serialize(), standardPrincipalCV(investorAddress).serialize()],
      );
      return result;
    } catch (error) {
      console.error('Error fetching investment:', error);
      throw error;
    }
  }

  async getPlatformFeePercent(): Promise<any> {
    try {
      const result = await stacksApi.callReadOnlyFunction(
        CONTRACT_ADDRESS,
        CONTRACT_NAME,
        'get-platform-fee-percent',
        [],
      );
      return result;
    } catch (error) {
      console.error('Error fetching platform fee:', error);
      throw error;
    }
  }

  async calculatePlatformFee(amount: number): Promise<any> {
    try {
      const amountMicroSTX = amount * 1000000;
      const result = await stacksApi.callReadOnlyFunction(
        CONTRACT_ADDRESS,
        CONTRACT_NAME,
        'calculate-platform-fee',
        [uintCV(amountMicroSTX).serialize()],
      );
      return result;
    } catch (error) {
      console.error('Error calculating platform fee:', error);
      throw error;
    }
  }

  // Utility functions

  async estimateTransactionFee(txData: any): Promise<number> {
    try {
      // This would need the actual transaction hex
      // For now, return a default estimation
      return await stacksApi.getTransferFee();
    } catch (error) {
      console.error('Error estimating fee:', error);
      return 2000; // Default fee in microSTX
    }
  }

  // Direct STX transfer (for simple payments)
  async transferSTX(recipient: string, amount: number, memo?: string): Promise<string> {
    if (!this.userSession?.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const userData = this.userSession.loadUserData();
    const amountMicroSTX = amount * 1000000;

    const txOptions = {
      recipient,
      amount: amountMicroSTX,
      senderKey: userData.privateKey,
      network: this.network,
      anchorMode: AnchorMode.Any,
      memo,
    };

    const transaction = await makeSTXTokenTransfer(txOptions);
    const txId = await broadcastTransaction(transaction, this.network);
    
    return txId;
  }
}

// Utility function to create transaction instance
export const createFundFlowTransactions = (userSession: UserSession | null): FundFlowTransactions => {
  return new FundFlowTransactions(userSession);
};