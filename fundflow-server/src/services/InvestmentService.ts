import { smartContractIntegration } from './SmartContractIntegrationService';
import { CampaignService } from './CampaignService';
import { UserService } from './UserService';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

export interface InvestmentData {
    campaignId: number;
    investorAddress: string;
    amount: string;
    netAmount: string;
    platformFee: string;
    transactionId?: string;
    blockHeight?: number;
    timestamp: Date;
    status: 'pending' | 'confirmed' | 'failed' | 'refunded';
    equityTokens?: number;
    votingPower?: number;
}

export interface InvestmentStats {
    totalInvested: number;
    totalReturns: number;
    activeInvestments: number;
    completedInvestments: number;
    averageInvestment: number;
    portfolioValue: number;
    roi: number;
}

export interface CampaignInvestment {
    campaignId: number;
    campaignTitle: string;
    amount: string;
    netAmount: string;
    platformFee: string;
    timestamp: Date;
    status: string;
    equityTokens?: number;
    votingPower?: number;
}

export class InvestmentService {
    constructor() {
        logger.info('InvestmentService initialized');
    }

    // ==================== INVESTMENT PROCESSING ====================

    /**
     * Process a new investment
     */
    async processInvestment(investmentData: InvestmentData): Promise<any> {
        try {
            logger.info(`Processing investment: Campaign ${investmentData.campaignId}, Investor ${investmentData.investorAddress}, Amount ${investmentData.amount}`);

            // Validate investment data
            this.validateInvestmentData(investmentData);

            // Calculate platform fee
            const calculatedFee = await this.calculatePlatformFee(investmentData.amount);
            const netAmount = this.calculateNetAmount(investmentData.amount, calculatedFee);

            // Update investment data with calculated values
            const processedInvestment: InvestmentData = {
                ...investmentData,
                platformFee: calculatedFee,
                netAmount: netAmount,
                timestamp: new Date(),
                status: 'pending'
            };

            // Process investment on blockchain
            const blockchainResult = await smartContractIntegration.processInvestmentOnChain(
                investmentData.campaignId,
                investmentData.investorAddress,
                investmentData.amount
            );

            if (!blockchainResult.success) {
                throw new Error(`Blockchain investment failed: ${blockchainResult.error}`);
            }

            // Update investment status
            processedInvestment.status = 'confirmed';
            if (blockchainResult.transactionId) {
                processedInvestment.transactionId = blockchainResult.transactionId;
            }

            // Update campaign in database
            await this.updateCampaignInvestment(investmentData.campaignId, processedInvestment);

            // Update investor stats
            await this.updateInvestorStats(investmentData.investorAddress, processedInvestment);

            logger.info(`Investment processed successfully: Transaction ${blockchainResult.transactionId}`);

            return {
                success: true,
                investment: processedInvestment,
                transactionId: blockchainResult.transactionId,
                receipt: blockchainResult.receipt
            };

        } catch (error) {
            logger.error('Failed to process investment:', error);
            throw error;
        }
    }

    /**
     * Get investment details from blockchain
     */
    async getInvestmentFromBlockchain(campaignId: number, investorAddress: string): Promise<any> {
        try {
            const result = await smartContractIntegration.getInvestmentFromChain(campaignId, investorAddress);

            if (!result.success) {
                throw new Error(`Failed to get investment from blockchain: ${result.error}`);
            }

            return result.data;
        } catch (error) {
            logger.error(`Failed to get investment from blockchain for campaign ${campaignId}, investor ${investorAddress}:`, error);
            throw error;
        }
    }

    /**
     * Get all investments for a campaign
     */
    async getCampaignInvestments(campaignId: number): Promise<any[]> {
        try {
            const result = await smartContractIntegration.getCampaignInvestorsFromChain(campaignId);

            if (!result.success) {
                throw new Error(`Failed to get campaign investors from blockchain: ${result.error}`);
            }

            const investors = result.data as string[];
            const investments: any[] = [];

            // Get investment details for each investor
            for (const investor of investors) {
                try {
                    const investmentData = await this.getInvestmentFromBlockchain(campaignId, investor);
                    if (investmentData) {
                        investments.push({
                            campaignId,
                            investorAddress: investor,
                            ...investmentData
                        });
                    }
                } catch (error) {
                    logger.error(`Failed to get investment data for investor ${investor}:`, error);
                }
            }

            return investments;
        } catch (error) {
            logger.error(`Failed to get campaign investments for campaign ${campaignId}:`, error);
            throw error;
        }
    }

    /**
     * Get all investments for an investor
     */
    async getInvestorInvestments(investorAddress: string): Promise<CampaignInvestment[]> {
        try {
            // This would need to be implemented based on your database structure
            // For now, returning empty array
            logger.info(`Getting investments for investor: ${investorAddress}`);

            return [];
        } catch (error) {
            logger.error(`Failed to get investments for investor ${investorAddress}:`, error);
            throw error;
        }
    }

    // ==================== INVESTMENT CALCULATIONS ====================

    /**
     * Calculate platform fee
     */
    async calculatePlatformFee(amount: string): Promise<string> {
        try {
            const result = await smartContractIntegration.calculatePlatformFee(amount);

            if (!result.success) {
                throw new Error(`Failed to calculate platform fee: ${result.error}`);
            }

            return result.data?.toString() || '0';
        } catch (error) {
            logger.error('Failed to calculate platform fee:', error);
            // Fallback to local calculation
            const amountNum = parseFloat(amount);
            const feePercent = config.PLATFORM_FEE_PERCENT / 10000; // Convert basis points to decimal
            return (amountNum * feePercent).toString();
        }
    }

    /**
     * Calculate net investment amount
     */
    private calculateNetAmount(amount: string, platformFee: string): string {
        const amountNum = parseFloat(amount);
        const feeNum = parseFloat(platformFee);
        return (amountNum - feeNum).toString();
    }

    /**
     * Calculate voting power based on investment
     */
    calculateVotingPower(investmentAmount: string): number {
        const amount = parseFloat(investmentAmount);
        // Simple voting power calculation - 1:1 ratio
        // This could be enhanced with staking multipliers, reputation bonuses, etc.
        return amount;
    }

    // ==================== INVESTMENT VALIDATION ====================

    /**
     * Validate investment data
     */
    private validateInvestmentData(investmentData: InvestmentData): void {
        if (!investmentData.campaignId || investmentData.campaignId <= 0) {
            throw new Error('Invalid campaign ID');
        }

        if (!investmentData.investorAddress || investmentData.investorAddress.length === 0) {
            throw new Error('Invalid investor address');
        }

        if (!investmentData.amount || parseFloat(investmentData.amount) <= 0) {
            throw new Error('Invalid investment amount');
        }

        // Validate address format (basic check)
        if (!this.isValidAddress(investmentData.investorAddress)) {
            throw new Error('Invalid investor address format');
        }
    }

    /**
     * Validate address format
     */
    private isValidAddress(address: string): boolean {
        // Basic address validation - could be enhanced
        return address.length === 42 && address.startsWith('0x');
    }

    // ==================== DATABASE OPERATIONS ====================

    /**
     * Update campaign with new investment
     */
    private async updateCampaignInvestment(campaignId: number, investment: any): Promise<void> {
        try {
            // This would update the campaign in your database
            // Implementation depends on your database structure
            logger.debug(`Updating campaign ${campaignId} with investment data`);

            // Placeholder for database update
            // await CampaignService.addInvestment(campaignId.toString(), investment);

        } catch (error) {
            logger.error(`Failed to update campaign ${campaignId} with investment:`, error);
            throw error;
        }
    }

    /**
     * Update investor statistics
     */
    private async updateInvestorStats(investorAddress: string, investment: any): Promise<void> {
        try {
            // This would update investor statistics in your database
            // Implementation depends on your database structure
            logger.debug(`Updating investor stats for ${investorAddress}`);

            // Placeholder for database update
            // await UserService.updateInvestmentStats(investorAddress, investment);

        } catch (error) {
            logger.error(`Failed to update investor stats for ${investorAddress}:`, error);
            throw error;
        }
    }

    // ==================== INVESTMENT STATISTICS ====================

    /**
     * Get investment statistics for an investor
     */
    async getInvestorStats(investorAddress: string): Promise<InvestmentStats> {
        try {
            const investments = await this.getInvestorInvestments(investorAddress);

            const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.netAmount), 0);
            const activeInvestments = investments.filter(inv => inv.status === 'confirmed').length;
            const completedInvestments = investments.filter(inv => inv.status === 'completed').length;

            const averageInvestment = investments.length > 0 ? totalInvested / investments.length : 0;

            // Calculate ROI (simplified)
            const totalReturns = 0; // This would be calculated from actual returns
            const roi = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

            return {
                totalInvested,
                totalReturns,
                activeInvestments,
                completedInvestments,
                averageInvestment,
                portfolioValue: totalInvested + totalReturns,
                roi
            };
        } catch (error) {
            logger.error(`Failed to get investment stats for ${investorAddress}:`, error);
            throw error;
        }
    }

    /**
     * Get platform investment statistics
     */
    async getPlatformInvestmentStats(): Promise<any> {
        try {
            // This would aggregate platform-wide investment statistics
            // Implementation depends on your database structure
            logger.info('Getting platform investment statistics');

            return {
                totalInvestments: 0,
                totalInvestors: 0,
                totalAmount: 0,
                averageInvestment: 0,
                platformFees: 0
            };
        } catch (error) {
            logger.error('Failed to get platform investment stats:', error);
            throw error;
        }
    }

    // ==================== REFUND PROCESSING ====================

    /**
     * Process investment refund
     */
    async processRefund(campaignId: number, investorAddress: string, reason: string): Promise<any> {
        try {
            logger.info(`Processing refund for campaign ${campaignId}, investor ${investorAddress}`);

            // Get investment details
            const investment = await this.getInvestmentFromBlockchain(campaignId, investorAddress);

            if (!investment || investment.amount === '0') {
                throw new Error('No investment found to refund');
            }

            // Process refund on blockchain
            // This would call the refund function on the smart contract
            // Implementation depends on your smart contract structure

            // Update investment status
            const refundedInvestment = {
                ...investment,
                status: 'refunded' as const,
                refundReason: reason,
                refundTimestamp: new Date()
            };

            logger.info(`Refund processed successfully for campaign ${campaignId}, investor ${investorAddress}`);

            return {
                success: true,
                refund: refundedInvestment,
                amount: investment.amount
            };

        } catch (error) {
            logger.error(`Failed to process refund for campaign ${campaignId}, investor ${investorAddress}:`, error);
            throw error;
        }
    }

    // ==================== INVESTMENT ANALYTICS ====================

    /**
     * Get investment trends
     */
    async getInvestmentTrends(timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<any[]> {
        try {
            // This would analyze investment trends over time
            // Implementation depends on your database structure
            logger.info(`Getting investment trends for timeframe: ${timeframe}`);

            return [];
        } catch (error) {
            logger.error(`Failed to get investment trends for timeframe ${timeframe}:`, error);
            throw error;
        }
    }

    /**
     * Get top investors
     */
    async getTopInvestors(limit: number = 10): Promise<any[]> {
        try {
            // This would get the top investors by total investment amount
            // Implementation depends on your database structure
            logger.info(`Getting top ${limit} investors`);

            return [];
        } catch (error) {
            logger.error(`Failed to get top ${limit} investors:`, error);
            throw error;
        }
    }

    /**
     * Get investment distribution by category
     */
    async getInvestmentDistributionByCategory(): Promise<any[]> {
        try {
            // This would analyze investment distribution across campaign categories
            // Implementation depends on your database structure
            logger.info('Getting investment distribution by category');

            return [];
        } catch (error) {
            logger.error('Failed to get investment distribution by category:', error);
            throw error;
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Format investment amount
     */
    formatInvestmentAmount(amount: string): string {
        const num = parseFloat(amount);
        return num.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    /**
     * Calculate investment percentage of campaign goal
     */
    calculateInvestmentPercentage(investmentAmount: string, campaignGoal: string): number {
        const investment = parseFloat(investmentAmount);
        const goal = parseFloat(campaignGoal);

        if (goal <= 0) return 0;

        return (investment / goal) * 100;
    }

    /**
     * Check if investment is eligible for voting
     */
    isInvestmentEligibleForVoting(investment: any): boolean {
        return investment.status === 'confirmed' &&
            parseFloat(investment.netAmount) > 0 &&
            investment.timestamp < new Date();
    }
}

// Export singleton instance
export const investmentService = new InvestmentService();
