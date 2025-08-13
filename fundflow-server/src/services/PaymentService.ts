import Payment, { IPayment } from '../models/Payment';
import User from '../models/User';
import Campaign from '../models/Campaign';
import Investment from '../models/Investment';
import Milestone from '../models/Milestone';
import { logger } from '../utils/logger';
import { smartContractIntegration } from './SmartContractIntegrationService';

export interface CreatePaymentData {
    payerId: string;
    payeeId: string;
    amount: number;
    currency: string;
    paymentType: 'investment' | 'milestone' | 'dividend' | 'refund' | 'fee' | 'withdrawal';
    description: string;
    campaignId?: string | undefined;
    investmentId?: string | undefined;
    milestoneId?: string | undefined;
    metadata?: Record<string, any>;
}

export interface PaymentFilters {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
}

export interface PaymentStats {
    totalSent: number;
    totalReceived: number;
    totalFees: number;
    paymentCount: number;
    pendingAmount: number;
    completedAmount: number;
}

export class PaymentService {
    constructor() {
        logger.info('PaymentService initialized');
    }

    // ==================== PAYMENT CREATION ====================

    /**
     * Create a new payment
     */
    async createPayment(data: CreatePaymentData): Promise<IPayment> {
        try {
            // Validate users exist
            const [payer, payee] = await Promise.all([
                User.findById(data.payerId),
                User.findById(data.payeeId)
            ]);

            if (!payer || !payee) {
                throw new Error('Payer or payee not found');
            }

            // Generate unique payment ID
            const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const reference = `${data.paymentType.toUpperCase()}_${Date.now()}`;

            // Calculate fees
            const platformFee = await this.calculatePlatformFee(data.amount, data.paymentType);
            const networkFee = await this.estimateNetworkFee();
            const netAmount = data.amount - platformFee - networkFee;

            // Create payment record
            const payment = new Payment({
                paymentId,
                reference,
                payerId: data.payerId,
                payerAddress: payer.walletAddress,
                payerType: payer.role,
                payeeId: data.payeeId,
                payeeAddress: payee.walletAddress,
                payeeType: payee.role,
                amount: data.amount,
                currency: data.currency,
                paymentType: data.paymentType,
                campaignId: data.campaignId,
                investmentId: data.investmentId,
                milestoneId: data.milestoneId,
                description: data.description,
                platformFee,
                networkFee,
                netAmount,
                metadata: data.metadata || {},
                status: 'pending',
                confirmations: 0,
                requiredConfirmations: 12
            });

            const savedPayment = await payment.save();

            logger.info(`Payment created: ${paymentId} for ${data.amount} ${data.currency}`);

            // Process payment on blockchain
            await this.processPaymentOnChain(savedPayment);

            return savedPayment;
        } catch (error) {
            logger.error('Error creating payment:', error);
            throw error;
        }
    }

    /**
     * Create investment payment
     */
    async createInvestmentPayment(
        investmentId: string,
        amount: number,
        currency: string = 'HBAR'
    ): Promise<IPayment> {
        try {
            const investment = await Investment.findById(investmentId)
                .populate('campaignId', 'creatorAddress title');

            if (!investment) {
                throw new Error('Investment not found');
            }

            const campaign = investment.campaignId as any;
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Get user IDs from wallet addresses
            const [investor, creator] = await Promise.all([
                User.findOne({ walletAddress: investment.investorAddress }),
                User.findOne({ walletAddress: campaign.creatorAddress })
            ]);

            if (!investor) {
                throw new Error('Investor user not found');
            }

            if (!creator) {
                throw new Error('Campaign creator user not found');
            }

            const paymentData: CreatePaymentData = {
                payerId: (investor._id as any).toString(), // Use user ID, not wallet address
                payeeId: (creator._id as any).toString(), // Use user ID, not wallet address
                amount,
                currency,
                paymentType: 'investment',
                description: `Investment in ${campaign.title}`,
                campaignId: campaign._id.toString(),
                investmentId: investmentId,
                metadata: {
                    investmentAmount: investment.amount,
                    votingPower: investment.votingPower
                }
            };

            return await this.createPayment(paymentData);
        } catch (error) {
            logger.error('Error creating investment payment:', error);
            throw error;
        }
    }

    /**
     * Create milestone payment
     */
    async createMilestonePayment(
        milestoneId: string,
        amount: number,
        currency: string = 'HBAR'
    ): Promise<IPayment> {
        try {
            const milestone = await Milestone.findById(milestoneId)
                .populate('campaignId', 'creatorAddress title');

            if (!milestone) {
                throw new Error('Milestone not found');
            }

            const campaign = milestone.campaignId as any;
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            // Get user ID from wallet address
            const creator = await User.findOne({ walletAddress: campaign.creatorAddress });

            if (!creator) {
                throw new Error('Campaign creator user not found');
            }

            const paymentData: CreatePaymentData = {
                payerId: (creator._id as any).toString(), // Use user ID, not wallet address
                payeeId: (creator._id as any).toString(), // Use user ID, not wallet address
                amount,
                currency,
                paymentType: 'milestone',
                description: `Milestone payment: ${milestone.title}`,
                campaignId: campaign._id.toString(),
                milestoneId: milestoneId,
                metadata: {
                    milestoneTitle: milestone.title,
                    milestoneIndex: milestone.milestoneIndex
                }
            };

            return await this.createPayment(paymentData);
        } catch (error) {
            logger.error('Error creating milestone payment:', error);
            throw error;
        }
    }

    // ==================== PAYMENT PROCESSING ====================

    /**
     * Process payment on blockchain
     */
    private async processPaymentOnChain(payment: IPayment): Promise<void> {
        try {
            // TODO: Integrate with smart contract for actual payment processing
            // For now, simulate blockchain processing

            // Simulate transaction hash generation
            const transactionHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const blockNumber = Math.floor(Math.random() * 1000000) + 1000000;

            // Update payment with transaction details
            payment.transactionHash = transactionHash;
            payment.blockNumber = blockNumber;
            payment.status = 'processing';
            payment.confirmations = 1;

            await payment.save();

            logger.info(`Payment processing started: ${payment.paymentId}`);

            // Simulate confirmation process
            setTimeout(async () => {
                await this.confirmPayment((payment._id as any).toString());
            }, 5000); // Simulate 5 second confirmation time

        } catch (error) {
            logger.error('Error processing payment on blockchain:', error);
            payment.status = 'failed';
            await payment.save();
            throw error;
        }
    }

    /**
     * Confirm payment
     */
    async confirmPayment(paymentId: string): Promise<IPayment> {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }

            payment.status = 'completed';
            payment.confirmations = payment.requiredConfirmations;
            payment.completedAt = new Date();

            const updatedPayment = await payment.save();

            logger.info(`Payment confirmed: ${paymentId}`);

            // Update related entities
            await this.updateRelatedEntities(updatedPayment);

            return updatedPayment;
        } catch (error) {
            logger.error('Error confirming payment:', error);
            throw error;
        }
    }

    /**
     * Update related entities after payment completion
     */
    private async updateRelatedEntities(payment: IPayment): Promise<void> {
        try {
            switch (payment.paymentType) {
                case 'investment':
                    if (payment.investmentId) {
                        await Investment.findByIdAndUpdate(payment.investmentId, {
                            status: 'confirmed',
                            confirmations: payment.confirmations
                        });
                    }
                    break;

                case 'milestone':
                    if (payment.milestoneId) {
                        await Milestone.findByIdAndUpdate(payment.milestoneId, {
                            fundsReleased: true,
                            releasedAmount: payment.amount,
                            releaseTransactionId: payment.transactionHash,
                            releasedAt: new Date()
                        });
                    }
                    break;
            }
        } catch (error) {
            logger.error('Error updating related entities:', error);
        }
    }

    // ==================== PAYMENT RETRIEVAL ====================

    /**
     * Get payments for a user with filters
     */
    async getUserPayments(
        userId: string,
        filters: PaymentFilters = {}
    ): Promise<{ payments: IPayment[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, status, paymentType, startDate, endDate } = filters;
            const skip = (page - 1) * limit;

            const query: any = {
                $or: [
                    { payerId: userId },
                    { payeeId: userId }
                ]
            };

            if (status) {
                query.status = status;
            }

            if (paymentType) {
                query.paymentType = paymentType;
            }

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = startDate;
                if (endDate) query.createdAt.$lte = endDate;
            }

            const [payments, total] = await Promise.all([
                Payment.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('payerId', 'profile.name walletAddress')
                    .populate('payeeId', 'profile.name walletAddress')
                    .populate('campaignId', 'title status'),
                Payment.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                payments,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching user payments:', error);
            throw error;
        }
    }

    /**
     * Get payment by ID
     */
    async getPaymentById(paymentId: string): Promise<IPayment | null> {
        try {
            const payment = await Payment.findById(paymentId)
                .populate('payerId', 'profile.name walletAddress')
                .populate('payeeId', 'profile.name walletAddress')
                .populate('campaignId', 'title status')
                .populate('investmentId', 'amount status')
                .populate('milestoneId', 'title status');

            return payment;
        } catch (error) {
            logger.error('Error fetching payment by ID:', error);
            throw error;
        }
    }

    /**
     * Get payment statistics for a user
     */
    async getPaymentStats(userId: string): Promise<PaymentStats> {
        try {
            const stats = await (Payment as any).getPaymentStats(userId);

            if (stats.length === 0) {
                return {
                    totalSent: 0,
                    totalReceived: 0,
                    totalFees: 0,
                    paymentCount: 0,
                    pendingAmount: 0,
                    completedAmount: 0
                };
            }

            const stat = stats[0];

            // Get pending amount
            const pendingPayments = await Payment.find({
                $or: [
                    { payerId: userId },
                    { payeeId: userId }
                ],
                status: 'pending'
            });

            const pendingAmount = pendingPayments.reduce((total, payment) => {
                if (payment.payerId.toString() === userId) {
                    return total + payment.amount;
                }
                return total;
            }, 0);

            return {
                totalSent: stat.totalSent || 0,
                totalReceived: stat.totalReceived || 0,
                totalFees: stat.totalFees || 0,
                paymentCount: stat.paymentCount || 0,
                pendingAmount,
                completedAmount: (stat.totalSent || 0) + (stat.totalReceived || 0)
            };
        } catch (error) {
            logger.error('Error getting payment stats:', error);
            throw error;
        }
    }

    // ==================== PAYMENT MANAGEMENT ====================

    /**
     * Update payment status
     */
    async updatePaymentStatus(
        paymentId: string,
        status: string,
        confirmations?: number
    ): Promise<IPayment> {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }

            const updatedPayment = await (payment as any).updateStatus(status, confirmations);
            logger.info(`Payment status updated: ${paymentId} -> ${status}`);

            return updatedPayment;
        } catch (error) {
            logger.error('Error updating payment status:', error);
            throw error;
        }
    }

    /**
     * Refund payment
     */
    async refundPayment(
        paymentId: string,
        reason: string,
        adminId: string
    ): Promise<IPayment> {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {
                throw new Error('Payment not found');
            }

            if (payment.status !== 'completed') {
                throw new Error('Only completed payments can be refunded');
            }

            // Create refund payment
            const refundData: CreatePaymentData = {
                payerId: payment.payeeId.toString(),
                payeeId: payment.payerId.toString(),
                amount: payment.netAmount,
                currency: payment.currency,
                paymentType: 'refund',
                description: `Refund: ${reason}`,
                campaignId: payment.campaignId?.toString(),
                investmentId: payment.investmentId?.toString(),
                milestoneId: payment.milestoneId?.toString(),
                metadata: {
                    originalPaymentId: payment.paymentId,
                    refundReason: reason,
                    refundedBy: adminId
                }
            };

            const refundPayment = await this.createPayment(refundData);

            // Update original payment
            payment.status = 'refunded';
            await payment.save();

            logger.info(`Payment refunded: ${paymentId}`);

            return refundPayment;
        } catch (error) {
            logger.error('Error refunding payment:', error);
            throw error;
        }
    }

    // ==================== FEE CALCULATION ====================

    /**
     * Calculate platform fee
     */
    private async calculatePlatformFee(amount: number, paymentType: string): Promise<number> {
        // Platform fee structure
        const feeRates: Record<string, number> = {
            investment: 0.025, // 2.5%
            milestone: 0.01,   // 1%
            dividend: 0.015,   // 1.5%
            refund: 0,         // No fee for refunds
            fee: 0,            // No additional fee for fees
            withdrawal: 0.01   // 1%
        };

        const rate = feeRates[paymentType] || 0.02; // Default 2%
        return amount * rate;
    }

    /**
     * Estimate network fee
     */
    private async estimateNetworkFee(): Promise<number> {
        // TODO: Get actual network fee from Hedera
        // For now, return a fixed estimate
        return 0.001; // 0.001 HBAR
    }

    // ==================== PAYMENT VALIDATION ====================

    /**
     * Validate payment data
     */
    private validatePaymentData(data: CreatePaymentData): void {
        if (data.amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }

        if (data.payerId === data.payeeId) {
            throw new Error('Payer and payee cannot be the same');
        }

        if (!data.description || data.description.trim().length === 0) {
            throw new Error('Payment description is required');
        }
    }

    // ==================== PAYMENT CLEANUP ====================

    /**
     * Clean up old failed payments
     */
    async cleanupFailedPayments(daysOld: number = 30): Promise<{ deletedCount: number }> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await Payment.deleteMany({
                status: 'failed',
                createdAt: { $lt: cutoffDate }
            });

            logger.info(`Cleaned up ${result.deletedCount} failed payments`);
            return { deletedCount: result.deletedCount || 0 };
        } catch (error) {
            logger.error('Error cleaning up failed payments:', error);
            throw error;
        }
    }
}

export const paymentService = new PaymentService();
export default paymentService;
