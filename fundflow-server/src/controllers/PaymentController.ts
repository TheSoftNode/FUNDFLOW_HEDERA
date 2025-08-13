import { Request, Response } from 'express';
import { PaymentService } from '../services/PaymentService';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

const paymentService = new PaymentService();

export class PaymentController {
    /**
     * Get payments for the authenticated user
     */
    static async getUserPayments(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 10, status, paymentType, startDate, endDate } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                status: status as string,
                paymentType: paymentType as string,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                userId
            };

            const payments = await paymentService.getUserPayments(filters);
            return ApiResponse.success(res, 'Payments retrieved successfully', payments);
        } catch (error) {
            logger.error('Error getting user payments:', error);
            return ApiResponse.error(res, 'Failed to retrieve payments', 500);
        }
    }

    /**
     * Get payment by ID
     */
    static async getPaymentById(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const payment = await paymentService.getPaymentById(paymentId);
            if (!payment) {
                return ApiResponse.error(res, 'Payment not found', 404);
            }

            // Check if user has access to this payment
            if (payment.payerId.toString() !== userId && payment.payeeId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            return ApiResponse.success(res, 'Payment retrieved successfully', payment);
        } catch (error) {
            logger.error('Error getting payment by ID:', error);
            return ApiResponse.error(res, 'Failed to retrieve payment', 500);
        }
    }

    /**
     * Get payment statistics for the authenticated user
     */
    static async getPaymentStats(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const stats = await paymentService.getPaymentStats(userId);
            return ApiResponse.success(res, 'Payment statistics retrieved successfully', stats);
        } catch (error) {
            logger.error('Error getting payment stats:', error);
            return ApiResponse.error(res, 'Failed to retrieve payment statistics', 500);
        }
    }

    /**
     * Create investment payment
     */
    static async createInvestmentPayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { investmentId, amount, currency = 'HBAR' } = req.body;

            if (!investmentId || !amount) {
                return ApiResponse.error(res, 'Investment ID and amount are required', 400);
            }

            const payment = await paymentService.createInvestmentPayment(investmentId, amount, currency);
            return ApiResponse.success(res, 'Investment payment created successfully', payment, 201);
        } catch (error) {
            logger.error('Error creating investment payment:', error);
            return ApiResponse.error(res, 'Failed to create investment payment', 500);
        }
    }

    /**
     * Create milestone payment
     */
    static async createMilestonePayment(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { milestoneId, amount, currency = 'HBAR' } = req.body;

            if (!milestoneId || !amount) {
                return ApiResponse.error(res, 'Milestone ID and amount are required', 400);
            }

            const payment = await paymentService.createMilestonePayment(milestoneId, amount, currency);
            return ApiResponse.success(res, 'Milestone payment created successfully', payment, 201);
        } catch (error) {
            logger.error('Error creating milestone payment:', error);
            return ApiResponse.error(res, 'Failed to create milestone payment', 500);
        }
    }

    /**
     * Update payment status
     */
    static async updatePaymentStatus(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const { status } = req.body;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            if (!status) {
                return ApiResponse.error(res, 'Status is required', 400);
            }

            const payment = await paymentService.updatePaymentStatus(paymentId, status);
            return ApiResponse.success(res, 'Payment status updated successfully', payment);
        } catch (error) {
            logger.error('Error updating payment status:', error);
            return ApiResponse.error(res, 'Failed to update payment status', 500);
        }
    }

    /**
     * Refund payment
     */
    static async refundPayment(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const { reason } = req.body;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const refundPayment = await paymentService.refundPayment(paymentId, reason);
            return ApiResponse.success(res, 'Payment refunded successfully', refundPayment);
        } catch (error) {
            logger.error('Error refunding payment:', error);
            return ApiResponse.error(res, 'Failed to refund payment', 500);
        }
    }

    /**
     * Get payment confirmation status
     */
    static async getPaymentConfirmation(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const payment = await paymentService.getPaymentById(paymentId);
            if (!payment) {
                return ApiResponse.error(res, 'Payment not found', 404);
            }

            // Check if user has access to this payment
            if (payment.payerId.toString() !== userId && payment.payeeId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const confirmationData = {
                paymentId: payment.paymentId,
                status: payment.status,
                confirmations: payment.confirmations,
                requiredConfirmations: payment.requiredConfirmations,
                transactionHash: payment.transactionHash,
                blockNumber: payment.blockNumber,
                isConfirmed: payment.confirmations >= payment.requiredConfirmations
            };

            return ApiResponse.success(res, 'Payment confirmation status retrieved successfully', confirmationData);
        } catch (error) {
            logger.error('Error getting payment confirmation:', error);
            return ApiResponse.error(res, 'Failed to retrieve payment confirmation status', 500);
        }
    }
}
