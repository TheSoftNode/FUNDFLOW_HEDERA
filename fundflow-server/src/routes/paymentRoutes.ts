import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all payment routes
router.use(authenticateToken);

// ==================== PAYMENT RETRIEVAL ====================

/**
 * @route   GET /api/payments
 * @desc    Get payments for the authenticated user
 * @access  Private
 */
router.get('/', PaymentController.getUserPayments);

/**
 * @route   GET /api/payments/stats
 * @desc    Get payment statistics for the authenticated user
 * @access  Private
 */
router.get('/stats', PaymentController.getPaymentStats);

/**
 * @route   GET /api/payments/:paymentId
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:paymentId', PaymentController.getPaymentById);

/**
 * @route   GET /api/payments/:paymentId/confirmation
 * @desc    Get payment confirmation status
 * @access  Private
 */
router.get('/:paymentId/confirmation', PaymentController.getPaymentConfirmation);

// ==================== PAYMENT CREATION ====================

/**
 * @route   POST /api/payments/investment
 * @desc    Create investment payment
 * @access  Private
 */
router.post('/investment', PaymentController.createInvestmentPayment);

/**
 * @route   POST /api/payments/milestone
 * @desc    Create milestone payment
 * @access  Private
 */
router.post('/milestone', PaymentController.createMilestonePayment);

// ==================== PAYMENT MANAGEMENT ====================

/**
 * @route   PUT /api/payments/:paymentId/status
 * @desc    Update payment status
 * @access  Private
 */
router.put('/:paymentId/status', PaymentController.updatePaymentStatus);

/**
 * @route   POST /api/payments/:paymentId/refund
 * @desc    Refund payment
 * @access  Private
 */
router.post('/:paymentId/refund', PaymentController.refundPayment);

export default router;
