import { hederaService, ContractCallResult, ContractQueryResult } from './HederaService';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

// Smart Contract ABI Interfaces (simplified for Hedera)
export interface CampaignData {
  id: number;
  creator: string;
  title: string;
  description: string;
  ipfsHash: string;
  targetAmount: string;
  raisedAmount: string;
  deadline: number;
  status: number;
  category: number;
  createdAt: number;
  updatedAt: number;
  milestoneCount: number;
  totalInvestors: number;
  equityTokensIssued: number;
  emergencyRefundEnabled: boolean;
}

export interface MilestoneData {
  id: number;
  campaignId: number;
  title: string;
  description: string;
  targetAmount: string;
  status: number;
  votingDeadline: number;
  createdAt: number;
  approvalCount: number;
  rejectionCount: number;
  completed: boolean;
  deliverableHash: string;
}

export interface InvestmentData {
  amount: string;
  timestamp: number;
  equityTokens: number;
  refunded: boolean;
  investmentType: number;
  tokenAddress: string;
  investor: string;
}

export interface GovernanceProposal {
  id: number;
  campaignId: number;
  proposer: string;
  proposalType: number;
  title: string;
  description: string;
  creationTime: number;
  votingStart: number;
  votingEnd: number;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  status: number;
  executed: boolean;
}

export interface PlatformMetrics {
  totalCampaigns: number;
  totalFundsRaised: string;
  totalInvestors: number;
  successfulCampaigns: number;
  platformFeesCollected: string;
}

export interface CampaignMetrics {
  averageInvestment: number;
  completedMilestones: number;
  totalMilestones: number;
  successRate: number;
  daysRemaining: number;
  fundingProgress: number;
}

export class SmartContractIntegrationService {
  private fundFlowCoreId: string;
  private campaignManagerId: string;
  private investmentManagerId: string;
  private milestoneManagerId: string;
  private analyticsManagerId: string;
  private governanceManagerId: string;

  constructor() {
    this.fundFlowCoreId = config.FUNDFLOWCORE_ID;
    this.campaignManagerId = config.CAMPAIGNMANAGER_ID;
    this.investmentManagerId = config.INVESTMENTMANAGER_ID;
    this.milestoneManagerId = config.MILESTONEMANAGER_ID;
    this.analyticsManagerId = config.ANALYTICSMANAGER_ID;
    this.governanceManagerId = config.GOVERNANCEMANAGER_ID;

    logger.info('SmartContractIntegrationService initialized');
  }

  // ==================== FUNDFLOW CORE INTEGRATION ====================

  /**
   * Create a new campaign on the blockchain
   */
  async createCampaignOnChain(campaignData: {
    title: string;
    description: string;
    ipfsHash: string;
    targetAmount: string;
    durationDays: number;
    category: number;
    milestoneFundingPercentages: number[];
    milestoneTitles: string[];
    milestoneDescriptions: string[];
  }): Promise<ContractCallResult> {
    try {
      const parameters = [
        campaignData.title,
        campaignData.description,
        campaignData.ipfsHash,
        campaignData.targetAmount,
        campaignData.durationDays,
        campaignData.category,
        campaignData.milestoneFundingPercentages,
        campaignData.milestoneTitles,
        campaignData.milestoneDescriptions
      ];

      logger.info('Creating campaign on blockchain:', { title: campaignData.title });
      
      return await hederaService.executeContractFunction(
        this.fundFlowCoreId,
        'createCampaign',
        parameters
      );
    } catch (error) {
      logger.error('Failed to create campaign on blockchain:', error);
      throw error;
    }
  }

  /**
   * Get campaign data from blockchain
   */
  async getCampaignFromChain(campaignId: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getCampaign',
        [campaignId]
      );
    } catch (error) {
      logger.error(`Failed to get campaign ${campaignId} from blockchain:`, error);
      throw error;
    }
  }

  /**
   * Get campaign metrics from blockchain
   */
  async getCampaignMetricsFromChain(campaignId: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getCampaignMetrics',
        [campaignId]
      );
    } catch (error) {
      logger.error(`Failed to get metrics for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Get platform metrics from blockchain
   */
  async getPlatformMetricsFromChain(): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getPlatformMetrics',
        []
      );
    } catch (error) {
      logger.error('Failed to get platform metrics from blockchain:', error);
      throw error;
    }
  }

  // ==================== INVESTMENT INTEGRATION ====================

  /**
   * Process investment in a campaign
   */
  async processInvestmentOnChain(
    campaignId: number,
    investor: string,
    amount: string
  ): Promise<ContractCallResult> {
    try {
      const parameters = [campaignId, investor, amount];

      logger.info(`Processing investment on blockchain: Campaign ${campaignId}, Investor ${investor}, Amount ${amount}`);
      
      return await hederaService.executeContractFunction(
        this.investmentManagerId,
        'processInvestment',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to process investment for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Get investment data from blockchain
   */
  async getInvestmentFromChain(campaignId: number, investor: string): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getInvestment',
        [campaignId, investor]
      );
    } catch (error) {
      logger.error(`Failed to get investment data for campaign ${campaignId}, investor ${investor}:`, error);
      throw error;
    }
  }

  /**
   * Get campaign investors from blockchain
   */
  async getCampaignInvestorsFromChain(campaignId: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getCampaignInvestors',
        [campaignId]
      );
    } catch (error) {
      logger.error(`Failed to get investors for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== MILESTONE INTEGRATION ====================

  /**
   * Submit milestone deliverable
   */
  async submitMilestoneDeliverable(
    campaignId: number,
    milestoneIndex: number,
    deliverableHash: string
  ): Promise<ContractCallResult> {
    try {
      const parameters = [campaignId, milestoneIndex, deliverableHash];

      logger.info(`Submitting milestone deliverable: Campaign ${campaignId}, Milestone ${milestoneIndex}`);
      
      return await hederaService.executeContractFunction(
        this.fundFlowCoreId,
        'submitMilestoneDeliverable',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to submit milestone deliverable for campaign ${campaignId}, milestone ${milestoneIndex}:`, error);
      throw error;
    }
  }

  /**
   * Vote on milestone
   */
  async voteOnMilestone(
    campaignId: number,
    milestoneIndex: number,
    vote: boolean,
    reason: string
  ): Promise<ContractCallResult> {
    try {
      const parameters = [campaignId, milestoneIndex, vote, reason];

      logger.info(`Voting on milestone: Campaign ${campaignId}, Milestone ${milestoneIndex}, Vote ${vote}`);
      
      return await hederaService.executeContractFunction(
        this.fundFlowCoreId,
        'voteOnMilestone',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to vote on milestone for campaign ${campaignId}, milestone ${milestoneIndex}:`, error);
      throw error;
    }
  }

  /**
   * Complete milestone
   */
  async completeMilestone(campaignId: number, milestoneIndex: number): Promise<ContractCallResult> {
    try {
      const parameters = [campaignId, milestoneIndex];

      logger.info(`Completing milestone: Campaign ${campaignId}, Milestone ${milestoneIndex}`);
      
      return await hederaService.executeContractFunction(
        this.fundFlowCoreId,
        'completeMilestone',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to complete milestone for campaign ${campaignId}, milestone ${milestoneIndex}:`, error);
      throw error;
    }
  }

  /**
   * Get milestone data from blockchain
   */
  async getMilestoneFromChain(campaignId: number, milestoneIndex: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getMilestone',
        [campaignId, milestoneIndex]
      );
    } catch (error) {
      logger.error(`Failed to get milestone ${milestoneIndex} for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== GOVERNANCE INTEGRATION ====================

  /**
   * Create governance proposal
   */
  async createGovernanceProposal(
    campaignId: number,
    proposalType: number,
    title: string,
    description: string,
    executionData: string
  ): Promise<ContractCallResult> {
    try {
      const parameters = [campaignId, proposalType, title, description, executionData];

      logger.info(`Creating governance proposal: Campaign ${campaignId}, Type ${proposalType}`);
      
      return await hederaService.executeContractFunction(
        this.governanceManagerId,
        'createProposal',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to create governance proposal for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Cast vote on governance proposal
   */
  async castGovernanceVote(
    proposalId: number,
    support: boolean,
    reason: string
  ): Promise<ContractCallResult> {
    try {
      const parameters = [proposalId, support, reason];

      logger.info(`Casting governance vote: Proposal ${proposalId}, Support ${support}`);
      
      return await hederaService.executeContractFunction(
        this.governanceManagerId,
        'castVote',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to cast governance vote for proposal ${proposalId}:`, error);
      throw error;
    }
  }

  /**
   * Execute governance proposal
   */
  async executeGovernanceProposal(proposalId: number): Promise<ContractCallResult> {
    try {
      const parameters = [proposalId];

      logger.info(`Executing governance proposal: ${proposalId}`);
      
      return await hederaService.executeContractFunction(
        this.governanceManagerId,
        'executeProposal',
        parameters
      );
    } catch (error) {
      logger.error(`Failed to execute governance proposal ${proposalId}:`, error);
      throw error;
    }
  }

  /**
   * Get governance proposal data
   */
  async getGovernanceProposal(proposalId: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.governanceManagerId,
        'getProposal',
        [proposalId]
      );
    } catch (error) {
      logger.error(`Failed to get governance proposal ${proposalId}:`, error);
      throw error;
    }
  }

  // ==================== ANALYTICS INTEGRATION ====================

  /**
   * Get campaign analytics from blockchain
   */
  async getCampaignAnalyticsFromChain(campaignId: number): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.analyticsManagerId,
        'getCampaignMetrics',
        [campaignId]
      );
    } catch (error) {
      logger.error(`Failed to get analytics for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  /**
   * Get investor analytics from blockchain
   */
  async getInvestorAnalyticsFromChain(investor: string): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.analyticsManagerId,
        'getInvestorMetrics',
        [investor]
      );
    } catch (error) {
      logger.error(`Failed to get analytics for investor ${investor}:`, error);
      throw error;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Get voting power for an address
   */
  async getVotingPower(campaignId: number, voter: string): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getVotingPower',
        [campaignId, voter]
      );
    } catch (error) {
      logger.error(`Failed to get voting power for campaign ${campaignId}, voter ${voter}:`, error);
      throw error;
    }
  }

  /**
   * Calculate platform fee
   */
  async calculatePlatformFee(amount: string): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'calculatePlatformFee',
        [amount]
      );
    } catch (error) {
      logger.error('Failed to calculate platform fee:', error);
      throw error;
    }
  }

  /**
   * Get contract balance
   */
  async getContractBalance(): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getContractBalance',
        []
      );
    } catch (error) {
      logger.error('Failed to get contract balance:', error);
      throw error;
    }
  }

  /**
   * Get next campaign ID
   */
  async getNextCampaignId(): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getNextCampaignId',
        []
      );
    } catch (error) {
      logger.error('Failed to get next campaign ID:', error);
      throw error;
    }
  }

  /**
   * Get total campaigns count
   */
  async getTotalCampaigns(): Promise<ContractQueryResult> {
    try {
      return await hederaService.queryContractFunction(
        this.fundFlowCoreId,
        'getTotalCampaigns',
        []
      );
    } catch (error) {
      logger.error('Failed to get total campaigns count:', error);
      throw error;
    }
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Get multiple campaigns from blockchain
   */
  async getMultipleCampaignsFromChain(campaignIds: number[]): Promise<ContractQueryResult[]> {
    try {
      const promises = campaignIds.map(id => this.getCampaignFromChain(id));
      return await Promise.all(promises);
    } catch (error) {
      logger.error('Failed to get multiple campaigns from blockchain:', error);
      throw error;
    }
  }

  /**
   * Get multiple milestones from blockchain
   */
  async getMultipleMilestonesFromChain(campaignId: number, milestoneIndices: number[]): Promise<ContractQueryResult[]> {
    try {
      const promises = milestoneIndices.map(index => this.getMilestoneFromChain(campaignId, index));
      return await Promise.all(promises);
    } catch (error) {
      logger.error(`Failed to get multiple milestones for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== HEALTH CHECK ====================

  /**
   * Check blockchain connectivity
   */
  async checkBlockchainHealth(): Promise<boolean> {
    try {
      // Try to get a simple query to verify connectivity
      await this.getTotalCampaigns();
      return true;
    } catch (error) {
      logger.error('Blockchain health check failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getServiceStatus() {
    return {
      fundFlowCore: !!this.fundFlowCoreId,
      campaignManager: !!this.campaignManagerId,
      investmentManager: !!this.investmentManagerId,
      milestoneManager: !!this.milestoneManagerId,
      analyticsManager: !!this.analyticsManagerId,
      governanceManager: !!this.governanceManagerId,
      blockchainHealth: false // Will be updated by health check
    };
  }
}

// Export singleton instance
export const smartContractIntegration = new SmartContractIntegrationService();
