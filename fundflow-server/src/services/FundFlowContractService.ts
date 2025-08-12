import { hederaService, ContractCallResult, ContractQueryResult } from './HederaService';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

export interface CampaignData {
    id: number;
    creator: string;
    title: string;
    description: string;
    targetAmount: string;
    raisedAmount: string;
    deadline: number;
    status: number;
    category: string;
    imageUrl: string;
    videoUrl: string;
    documents: string[];
    socialLinks: string[];
    tags: string[];
    createdAt: number;
    updatedAt: number;
}

export interface InvestmentData {
    campaignId: number;
    investor: string;
    amount: string;
    timestamp: number;
    transactionId: string;
}

export interface MilestoneData {
    id: number;
    campaignId: number;
    title: string;
    description: string;
    targetAmount: string;
    deadline: number;
    status: number;
    votingDeadline: number;
    votesFor: number;
    votesAgainst: number;
    totalVotingPower: number;
    executed: boolean;
    executedAt?: number;
}

export interface AnalyticsData {
    totalCampaigns: number;
    totalInvestments: number;
    totalRaised: string;
    activeCampaigns: number;
    successfulCampaigns: number;
    averageInvestment: string;
    platformFees: string;
}

export class FundFlowContractService {
    private fundFlowCoreId: string;
    private campaignManagerId: string;
    private investmentManagerId: string;
    private milestoneManagerId: string;
    private analyticsManagerId: string;
    private governanceManagerId: string;

    constructor() {
        // Initialize contract IDs from configuration
        this.fundFlowCoreId = config.FUNDFLOWCORE_ID;
        this.campaignManagerId = config.CAMPAIGNMANAGER_ID;
        this.investmentManagerId = config.INVESTMENTMANAGER_ID;
        this.milestoneManagerId = config.MILESTONEMANAGER_ID;
        this.analyticsManagerId = config.ANALYTICSMANAGER_ID;
        this.governanceManagerId = config.GOVERNANCEMANAGER_ID;

        if (!this.fundFlowCoreId) {
            throw new Error('FUNDFLOWCORE_ID configuration is required');
        }

        logger.info('FundFlowContractService initialized with contract IDs:', {
            fundFlowCore: this.fundFlowCoreId,
            campaignManager: this.campaignManagerId,
            investmentManager: this.investmentManagerId,
            milestoneManager: this.milestoneManagerId,
            analyticsManager: this.analyticsManagerId,
            governanceManager: this.governanceManagerId
        });
    }

    // ==================== CAMPAIGN MANAGEMENT ====================

    /**
     * Create a new campaign
     */
    async createCampaign(campaignData: Omit<CampaignData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContractCallResult> {
        try {
            const parameters = [
                campaignData.creator,
                campaignData.title,
                campaignData.description,
                campaignData.targetAmount,
                campaignData.deadline,
                campaignData.category,
                campaignData.imageUrl || '',
                campaignData.videoUrl || '',
                campaignData.documents || [],
                campaignData.socialLinks || [],
                campaignData.tags || []
            ];

            return await hederaService.executeContractFunction(
                this.campaignManagerId,
                'createCampaign',
                parameters
            );
        } catch (error) {
            logger.error('Failed to create campaign:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get campaign by ID
     */
    async getCampaign(campaignId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.campaignManagerId,
                'getCampaign',
                [campaignId]
            );
        } catch (error) {
            logger.error(`Failed to get campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get campaigns by creator
     */
    async getCampaignsByCreator(creator: string): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.campaignManagerId,
                'getCampaignsByCreator',
                [creator]
            );
        } catch (error) {
            logger.error(`Failed to get campaigns by creator ${creator}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get active campaigns
     */
    async getActiveCampaigns(): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.campaignManagerId,
                'getActiveCampaigns',
                []
            );
        } catch (error) {
            logger.error('Failed to get active campaigns:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Update campaign
     */
    async updateCampaign(campaignId: number, updates: Partial<CampaignData>): Promise<ContractCallResult> {
        try {
            const parameters = [
                campaignId,
                updates.title || '',
                updates.description || '',
                updates.imageUrl || '',
                updates.videoUrl || '',
                updates.documents || [],
                updates.socialLinks || [],
                updates.tags || []
            ];

            return await hederaService.executeContractFunction(
                this.campaignManagerId,
                'updateCampaign',
                parameters
            );
        } catch (error) {
            logger.error(`Failed to update campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // ==================== INVESTMENT MANAGEMENT ====================

    /**
     * Process investment in a campaign
     */
    async processInvestment(
        campaignId: number,
        investor: string,
        amount: string
    ): Promise<ContractCallResult> {
        try {
            const parameters = [campaignId, investor, amount];

            return await hederaService.executeContractFunction(
                this.investmentManagerId,
                'processInvestment',
                parameters
            );
        } catch (error) {
            logger.error(`Failed to process investment in campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get investment by ID
     */
    async getInvestment(investmentId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.investmentManagerId,
                'getInvestment',
                [investmentId]
            );
        } catch (error) {
            logger.error(`Failed to get investment ${investmentId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get investments by campaign
     */
    async getInvestmentsByCampaign(campaignId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.investmentManagerId,
                'getInvestmentsByCampaign',
                [campaignId]
            );
        } catch (error) {
            logger.error(`Failed to get investments for campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get investments by investor
     */
    async getInvestmentsByInvestor(investor: string): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.investmentManagerId,
                'getInvestmentsByInvestor',
                [investor]
            );
        } catch (error) {
            logger.error(`Failed to get investments by investor ${investor}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // ==================== MILESTONE MANAGEMENT ====================

    /**
     * Add milestone to campaign
     */
    async addMilestone(milestoneData: Omit<MilestoneData, 'id' | 'executed'>): Promise<ContractCallResult> {
        try {
            const parameters = [
                milestoneData.campaignId,
                milestoneData.title,
                milestoneData.description,
                milestoneData.targetAmount,
                milestoneData.deadline,
                milestoneData.votingDeadline
            ];

            return await hederaService.executeContractFunction(
                this.milestoneManagerId,
                'addMilestone',
                parameters
            );
        } catch (error) {
            logger.error('Failed to add milestone:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Vote on milestone
     */
    async voteOnMilestone(
        milestoneId: number,
        voter: string,
        vote: boolean,
        votingPower: number
    ): Promise<ContractCallResult> {
        try {
            const parameters = [milestoneId, voter, vote, votingPower];

            return await hederaService.executeContractFunction(
                this.milestoneManagerId,
                'voteOnMilestone',
                parameters
            );
        } catch (error) {
            logger.error(`Failed to vote on milestone ${milestoneId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Execute milestone
     */
    async executeMilestone(milestoneId: number): Promise<ContractCallResult> {
        try {
            return await hederaService.executeContractFunction(
                this.milestoneManagerId,
                'executeMilestone',
                [milestoneId]
            );
        } catch (error) {
            logger.error(`Failed to execute milestone ${milestoneId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get milestone by ID
     */
    async getMilestone(milestoneId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.milestoneManagerId,
                'getMilestone',
                [milestoneId]
            );
        } catch (error) {
            logger.error(`Failed to get milestone ${milestoneId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get milestones by campaign
     */
    async getMilestonesByCampaign(campaignId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.milestoneManagerId,
                'getMilestonesByCampaign',
                [campaignId]
            );
        } catch (error) {
            logger.error(`Failed to get milestones for campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // ==================== ANALYTICS ====================

    /**
     * Get platform analytics
     */
    async getPlatformAnalytics(): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.analyticsManagerId,
                'getPlatformMetrics',
                []
            );
        } catch (error) {
            logger.error('Failed to get platform analytics:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get campaign analytics
     */
    async getCampaignAnalytics(campaignId: number): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.analyticsManagerId,
                'getCampaignMetrics',
                [campaignId]
            );
        } catch (error) {
            logger.error(`Failed to get analytics for campaign ${campaignId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Get investor analytics
     */
    async getInvestorAnalytics(investor: string): Promise<ContractQueryResult> {
        try {
            return await hederaService.queryContractFunction(
                this.analyticsManagerId,
                'getInvestorMetrics',
                [investor]
            );
        } catch (error) {
            logger.error(`Failed to get analytics for investor ${investor}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // ==================== GOVERNANCE ====================

    /**
     * Create governance proposal
     */
    async createProposal(
        campaignId: number,
        proposalType: number,
        title: string,
        description: string,
        executionData: string
    ): Promise<ContractCallResult> {
        try {
            const parameters = [campaignId, proposalType, title, description, executionData];

            return await hederaService.executeContractFunction(
                this.governanceManagerId,
                'createProposal',
                parameters
            );
        } catch (error) {
            logger.error('Failed to create governance proposal:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Vote on governance proposal
     */
    async voteOnProposal(
        proposalId: number,
        voter: string,
        vote: boolean,
        votingPower: number
    ): Promise<ContractCallResult> {
        try {
            const parameters = [proposalId, voter, vote, votingPower];

            return await hederaService.executeContractFunction(
                this.governanceManagerId,
                'voteOnProposal',
                parameters
            );
        } catch (error) {
            logger.error(`Failed to vote on proposal ${proposalId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    /**
     * Execute governance proposal
     */
    async executeProposal(proposalId: number): Promise<ContractCallResult> {
        try {
            return await hederaService.executeContractFunction(
                this.governanceManagerId,
                'executeProposal',
                [proposalId]
            );
        } catch (error) {
            logger.error(`Failed to execute proposal ${proposalId}:`, error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Get contract addresses
     */
    getContractAddresses() {
        return {
            fundFlowCore: this.fundFlowCoreId,
            campaignManager: this.campaignManagerId,
            investmentManager: this.investmentManagerId,
            milestoneManager: this.milestoneManagerId,
            analyticsManager: this.analyticsManagerId,
            governanceManager: this.governanceManagerId
        };
    }

    /**
     * Check if service is properly initialized
     */
    isInitialized(): boolean {
        return !!(
            this.fundFlowCoreId &&
            this.campaignManagerId &&
            this.investmentManagerId &&
            this.milestoneManagerId &&
            this.analyticsManagerId &&
            this.governanceManagerId
        );
    }
}

// Export singleton instance
export const fundFlowContractService = new FundFlowContractService();
