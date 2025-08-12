import { smartContractIntegration } from './SmartContractIntegrationService';
import { CampaignService } from './CampaignService';
import { UserService } from './UserService';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

export interface SyncStatus {
  lastSyncTime: Date;
  campaignsSynced: number;
  investmentsSynced: number;
  milestonesSynced: number;
  proposalsSynced: number;
  errors: string[];
  isRunning: boolean;
}

export interface SyncOptions {
  syncCampaigns?: boolean;
  syncInvestments?: boolean;
  syncMilestones?: boolean;
  syncGovernance?: boolean;
  forceFullSync?: boolean;
  batchSize?: number;
}

export class BlockchainSyncService {
  private syncStatus: SyncStatus;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.syncStatus = {
      lastSyncTime: new Date(0),
      campaignsSynced: 0,
      investmentsSynced: 0,
      milestonesSynced: 0,
      proposalsSynced: 0,
      errors: [],
      isRunning: false
    };

    logger.info('BlockchainSyncService initialized');
  }

  // ==================== SYNC OPERATIONS ====================

  /**
   * Start automatic synchronization
   */
  startAutoSync(intervalMinutes: number = 5): void {
    if (this.syncInterval) {
      logger.warn('Auto-sync already running');
      return;
    }

    logger.info(`Starting auto-sync every ${intervalMinutes} minutes`);

    this.syncInterval = setInterval(async () => {
      try {
        await this.syncAll();
      } catch (error) {
        logger.error('Auto-sync failed:', error);
      }
    }, intervalMinutes * 60 * 1000);

    // Run initial sync
    this.syncAll().catch(error => {
      logger.error('Initial sync failed:', error);
    });
  }

  /**
   * Stop automatic synchronization
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      logger.info('Auto-sync stopped');
    }
  }

  /**
   * Sync all blockchain data
   */
  async syncAll(options: SyncOptions = {}): Promise<SyncStatus> {
    if (this.isRunning) {
      logger.warn('Sync already in progress');
      return this.syncStatus;
    }

    this.isRunning = true;
    this.syncStatus.isRunning = true;
    this.syncStatus.errors = [];

    try {
      logger.info('Starting blockchain synchronization');

      if (options.syncCampaigns !== false) {
        await this.syncCampaigns(options.forceFullSync);
      }

      if (options.syncInvestments !== false) {
        await this.syncInvestments(options.forceFullSync);
      }

      if (options.syncMilestones !== false) {
        await this.syncMilestones(options.forceFullSync);
      }

      if (options.syncGovernance !== false) {
        await this.syncGovernance(options.forceFullSync);
      }

      this.syncStatus.lastSyncTime = new Date();
      logger.info('Blockchain synchronization completed successfully');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.syncStatus.errors.push(errorMessage);
      logger.error('Blockchain synchronization failed:', error);
    } finally {
      this.isRunning = false;
      this.syncStatus.isRunning = false;
    }

    return this.syncStatus;
  }

  // ==================== CAMPAIGN SYNCHRONIZATION ====================

  /**
   * Sync campaigns from blockchain
   */
  private async syncCampaigns(forceFullSync: boolean = false): Promise<void> {
    try {
      logger.info('Starting campaign synchronization');

      // Get total campaigns from blockchain
      const totalCampaignsResult = await smartContractIntegration.getTotalCampaigns();
      if (!totalCampaignsResult.success) {
        throw new Error('Failed to get total campaigns from blockchain');
      }

      const totalCampaigns = parseInt(totalCampaignsResult.data?.toString() || '0');
      logger.info(`Found ${totalCampaigns} campaigns on blockchain`);

      if (totalCampaigns === 0) {
        logger.info('No campaigns to sync');
        return;
      }

      // Get campaigns in batches
      const batchSize = 10;
      let syncedCount = 0;

      for (let i = 1; i <= totalCampaigns; i += batchSize) {
        const batchEnd = Math.min(i + batchSize - 1, totalCampaigns);
        const campaignIds = Array.from({ length: batchEnd - i + 1 }, (_, index) => i + index);

        logger.info(`Syncing campaigns ${i} to ${batchEnd}`);

        for (const campaignId of campaignIds) {
          try {
            await this.syncSingleCampaign(campaignId);
            syncedCount++;
          } catch (error) {
            logger.error(`Failed to sync campaign ${campaignId}:`, error);
            this.syncStatus.errors.push(`Campaign ${campaignId}: ${error}`);
          }
        }

        // Small delay to avoid overwhelming the blockchain
        await this.delay(100);
      }

      this.syncStatus.campaignsSynced = syncedCount;
      logger.info(`Campaign synchronization completed: ${syncedCount}/${totalCampaigns} campaigns synced`);

    } catch (error) {
      logger.error('Campaign synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync a single campaign
   */
  private async syncSingleCampaign(campaignId: number): Promise<void> {
    try {
      // Get campaign data from blockchain
      const campaignResult = await smartContractIntegration.getCampaignFromChain(campaignId);
      if (!campaignResult.success) {
        throw new Error(`Failed to get campaign ${campaignId} from blockchain`);
      }

      const campaignData = campaignResult.data;
      if (!campaignData) {
        throw new Error(`No data returned for campaign ${campaignId}`);
      }

      // Parse campaign data (this would need to match the actual blockchain return format)
      const campaign = this.parseCampaignData(campaignData, campaignId);

      // Check if campaign exists in database
      const existingCampaign = await CampaignService.getCampaignById(campaignId.toString());

      if (existingCampaign) {
        // Update existing campaign
        await CampaignService.updateCampaign(campaignId.toString(), {
          raisedAmount: campaign.raisedAmount,
          status: this.mapBlockchainStatus(campaign.status),
          updatedAt: new Date()
        });
      } else {
        // Create new campaign in database
        await CampaignService.createCampaign({
          chainId: config.HEDERA_NETWORK === 'mainnet' ? 295 : 296,
          creatorAddress: campaign.creator,
          contractAddress: config.FUNDFLOWCORE_ADDRESS,
          title: campaign.title,
          description: campaign.description,
          targetAmount: campaign.targetAmount,
          deadline: new Date(campaign.deadline * 1000),
          category: this.mapBlockchainCategory(campaign.category),
          industry: 'Technology', // Default value
          stage: 'idea', // Default value
          fundingDetails: {
            useOfFunds: [],
            minimumInvestment: 0.1,
            maximumInvestment: campaign.targetAmount
          }
        });
      }

      logger.debug(`Campaign ${campaignId} synced successfully`);

    } catch (error) {
      logger.error(`Failed to sync campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== INVESTMENT SYNCHRONIZATION ====================

  /**
   * Sync investments from blockchain
   */
  private async syncInvestments(forceFullSync: boolean = false): Promise<void> {
    try {
      logger.info('Starting investment synchronization');

      // This would iterate through all campaigns and sync their investments
      // For now, we'll implement a basic version
      let syncedCount = 0;

      // Get all campaigns from database
      const campaigns = await CampaignService.getCampaigns({});

      for (const campaign of campaigns.campaigns) {
        try {
          const campaignId = parseInt((campaign._id as any).toString());
          await this.syncCampaignInvestments(campaignId);
          syncedCount++;
        } catch (error) {
          logger.error(`Failed to sync investments for campaign ${campaign._id}:`, error);
        }
      }

      this.syncStatus.investmentsSynced = syncedCount;
      logger.info(`Investment synchronization completed: ${syncedCount} campaigns processed`);

    } catch (error) {
      logger.error('Investment synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync investments for a specific campaign
   */
  private async syncCampaignInvestments(campaignId: number): Promise<void> {
    try {
      // Get investors from blockchain
      const investorsResult = await smartContractIntegration.getCampaignInvestorsFromChain(campaignId);
      if (!investorsResult.success) {
        throw new Error(`Failed to get investors for campaign ${campaignId}`);
      }

      const investors = investorsResult.data as string[];
      if (!investors || investors.length === 0) {
        return; // No investors to sync
      }

      // Sync each investor's investment
      for (const investor of investors) {
        try {
          const investmentResult = await smartContractIntegration.getInvestmentFromChain(campaignId, investor);
          if (investmentResult.success && investmentResult.data) {
            // Update investment in database
            // This would need to be implemented based on your investment model
            logger.debug(`Investment synced for campaign ${campaignId}, investor ${investor}`);
          }
        } catch (error) {
          logger.error(`Failed to sync investment for campaign ${campaignId}, investor ${investor}:`, error);
        }
      }

    } catch (error) {
      logger.error(`Failed to sync investments for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== MILESTONE SYNCHRONIZATION ====================

  /**
   * Sync milestones from blockchain
   */
  private async syncMilestones(forceFullSync: boolean = false): Promise<void> {
    try {
      logger.info('Starting milestone synchronization');

      // Get all campaigns from database
      const campaigns = await CampaignService.getCampaigns({});
      let syncedCount = 0;

      for (const campaign of campaigns.campaigns) {
        try {
          const campaignId = parseInt((campaign._id as any).toString());
          await this.syncCampaignMilestones(campaignId);
          syncedCount++;
        } catch (error) {
          logger.error(`Failed to sync milestones for campaign ${campaign._id}:`, error);
        }
      }

      this.syncStatus.milestonesSynced = syncedCount;
      logger.info(`Milestone synchronization completed: ${syncedCount} campaigns processed`);

    } catch (error) {
      logger.error('Milestone synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync milestones for a specific campaign
   */
  private async syncCampaignMilestones(campaignId: number): Promise<void> {
    try {
      // Get campaign from blockchain to get milestone count
      const campaignResult = await smartContractIntegration.getCampaignFromChain(campaignId);
      if (!campaignResult.success) {
        throw new Error(`Failed to get campaign ${campaignId} for milestone sync`);
      }

      const campaignData = campaignResult.data;
      if (!campaignData) {
        return;
      }

      // Parse milestone count (this would need to match the actual blockchain return format)
      const milestoneCount = parseInt(campaignData.milestoneCount?.toString() || '0');

      if (milestoneCount === 0) {
        return; // No milestones to sync
      }

      // Sync each milestone
      for (let i = 0; i < milestoneCount; i++) {
        try {
          const milestoneResult = await smartContractIntegration.getMilestoneFromChain(campaignId, i);
          if (milestoneResult.success && milestoneResult.data) {
            // Update milestone in database
            // This would need to be implemented based on your milestone model
            logger.debug(`Milestone ${i} synced for campaign ${campaignId}`);
          }
        } catch (error) {
          logger.error(`Failed to sync milestone ${i} for campaign ${campaignId}:`, error);
        }
      }

    } catch (error) {
      logger.error(`Failed to sync milestones for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== GOVERNANCE SYNCHRONIZATION ====================

  /**
   * Sync governance data from blockchain
   */
  private async syncGovernance(forceFullSync: boolean = false): Promise<void> {
    try {
      logger.info('Starting governance synchronization');

      // This would sync governance proposals and votes
      // For now, we'll implement a basic version
      let syncedCount = 0;

      // Get all campaigns from database
      const campaigns = await CampaignService.getCampaigns({});

      for (const campaign of campaigns.campaigns) {
        try {
          const campaignId = parseInt((campaign._id as any).toString());
          await this.syncCampaignGovernance(campaignId);
          syncedCount++;
        } catch (error) {
          logger.error(`Failed to sync governance for campaign ${campaign._id}:`, error);
        }
      }

      this.syncStatus.proposalsSynced = syncedCount;
      logger.info(`Governance synchronization completed: ${syncedCount} campaigns processed`);

    } catch (error) {
      logger.error('Governance synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync governance for a specific campaign
   */
  private async syncCampaignGovernance(campaignId: number): Promise<void> {
    try {
      // This would get governance proposals and votes from the blockchain
      // For now, we'll implement a placeholder
      logger.debug(`Governance sync placeholder for campaign ${campaignId}`);

    } catch (error) {
      logger.error(`Failed to sync governance for campaign ${campaignId}:`, error);
      throw error;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Parse campaign data from blockchain
   */
  private parseCampaignData(data: any, campaignId: number): any {
    // This would need to be implemented based on the actual blockchain return format
    // For now, returning a basic structure
    return {
      id: campaignId,
      creator: data.creator || '',
      title: data.title || '',
      description: data.description || '',
      targetAmount: data.targetAmount || '0',
      raisedAmount: data.raisedAmount || '0',
      deadline: data.deadline || 0,
      status: data.status || 0,
      category: data.category || 0,
      milestoneCount: data.milestoneCount || 0
    };
  }

  /**
   * Map blockchain status to database status
   */
  private mapBlockchainStatus(blockchainStatus: number): string {
    // Map blockchain status enum to database status
    switch (blockchainStatus) {
      case 0: return 'draft';
      case 1: return 'active';
      case 2: return 'funded';
      case 3: return 'completed';
      case 4: return 'cancelled';
      case 5: return 'failed';
      case 6: return 'expired';
      default: return 'active';
    }
  }

  /**
   * Map blockchain category to database category
   */
  private mapBlockchainCategory(blockchainCategory: number): string {
    // Map blockchain category enum to database category
    switch (blockchainCategory) {
      case 0: return 'Technology';
      case 1: return 'Healthcare';
      case 2: return 'Finance';
      case 3: return 'Gaming';
      case 4: return 'Education';
      case 5: return 'Other';
      default: return 'Other';
    }
  }

  /**
   * Add delay between operations
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== STATUS AND CONTROL ====================

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Check if sync is running
   */
  isSyncRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): Date {
    return this.syncStatus.lastSyncTime;
  }

  /**
   * Reset sync status
   */
  resetSyncStatus(): void {
    this.syncStatus = {
      lastSyncTime: new Date(0),
      campaignsSynced: 0,
      investmentsSynced: 0,
      milestonesSynced: 0,
      proposalsSynced: 0,
      errors: [],
      isRunning: false
    };
    logger.info('Sync status reset');
  }

  /**
   * Get sync errors
   */
  getSyncErrors(): string[] {
    return [...this.syncStatus.errors];
  }

  /**
   * Clear sync errors
   */
  clearSyncErrors(): void {
    this.syncStatus.errors = [];
    logger.info('Sync errors cleared');
  }
}

// Export singleton instance
export const blockchainSyncService = new BlockchainSyncService();
