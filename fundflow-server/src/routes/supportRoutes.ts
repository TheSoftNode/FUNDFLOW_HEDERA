import { Router } from 'express';
import { SupportController } from '../controllers/SupportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all support routes
router.use(authenticateToken);

// ==================== TICKET RETRIEVAL ====================

/**
 * @route   GET /api/support/tickets
 * @desc    Get support tickets for the authenticated user
 * @access  Private
 */
router.get('/tickets', SupportController.getUserTickets);

/**
 * @route   GET /api/support/tickets/all
 * @desc    Get all tickets (for support staff)
 * @access  Private (Support staff only)
 */
router.get('/tickets/all', SupportController.getAllTickets);

/**
 * @route   GET /api/support/tickets/assigned
 * @desc    Get tickets assigned to the authenticated user (for support staff)
 * @access  Private (Support staff only)
 */
router.get('/tickets/assigned', SupportController.getAssignedTickets);

/**
 * @route   GET /api/support/tickets/:ticketId
 * @desc    Get ticket by ID
 * @access  Private
 */
router.get('/tickets/:ticketId', SupportController.getTicketById);

/**
 * @route   GET /api/support/tickets/:ticketId/messages
 * @desc    Get ticket messages
 * @access  Private
 */
router.get('/tickets/:ticketId/messages', SupportController.getTicketMessages);

/**
 * @route   GET /api/support/stats
 * @desc    Get ticket statistics
 * @access  Private
 */
router.get('/stats', SupportController.getTicketStats);

// ==================== TICKET CREATION ====================

/**
 * @route   POST /api/support/tickets
 * @desc    Create a new support ticket
 * @access  Private
 */
router.post('/tickets', SupportController.createTicket);

/**
 * @route   POST /api/support/feedback
 * @desc    Create ticket from feedback
 * @access  Private
 */
router.post('/feedback', SupportController.createTicketFromFeedback);

// ==================== TICKET MANAGEMENT ====================

/**
 * @route   PUT /api/support/tickets/:ticketId
 * @desc    Update ticket
 * @access  Private
 */
router.put('/tickets/:ticketId', SupportController.updateTicket);

/**
 * @route   POST /api/support/tickets/:ticketId/assign
 * @desc    Assign ticket to support staff
 * @access  Private (Support staff only)
 */
router.post('/tickets/:ticketId/assign', SupportController.assignTicket);

/**
 * @route   POST /api/support/tickets/:ticketId/resolve
 * @desc    Resolve ticket
 * @access  Private
 */
router.post('/tickets/:ticketId/resolve', SupportController.resolveTicket);

/**
 * @route   POST /api/support/tickets/:ticketId/close
 * @desc    Close ticket
 * @access  Private
 */
router.post('/tickets/:ticketId/close', SupportController.closeTicket);

/**
 * @route   DELETE /api/support/tickets/:ticketId
 * @desc    Delete ticket
 * @access  Private
 */
router.delete('/tickets/:ticketId', SupportController.deleteTicket);

// ==================== TICKET COMMUNICATION ====================

/**
 * @route   POST /api/support/tickets/:ticketId/messages
 * @desc    Add message to ticket
 * @access  Private
 */
router.post('/tickets/:ticketId/messages', SupportController.addMessage);

export default router;
