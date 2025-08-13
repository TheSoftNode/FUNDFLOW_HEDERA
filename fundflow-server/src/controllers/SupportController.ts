import { Request, Response } from 'express';
import { SupportService } from '../services/SupportService';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

const supportService = new SupportService();

export class SupportController {
    /**
     * Get support tickets for the authenticated user
     */
    static async getUserTickets(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 10, status, priority, category } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                status: status as string,
                priority: priority as string,
                category: category as string
            };

            const tickets = await supportService.getUserTickets(userId, filters);
            return ApiResponse.success(res, 'Support tickets retrieved successfully', tickets);
        } catch (error) {
            logger.error('Error getting user tickets:', error);
            return ApiResponse.error(res, 'Failed to retrieve support tickets', 500);
        }
    }

    /**
     * Get all tickets (for support staff)
     */
    static async getAllTickets(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            // TODO: Check if user has support staff role
            // For now, allow any authenticated user to view all tickets

            const { page = 1, limit = 20, status, priority, category, assignedTo } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                status: status as string,
                priority: priority as string,
                category: category as string,
                assignedTo: assignedTo as string
            };

            const tickets = await supportService.getTickets(filters);
            return ApiResponse.success(res, 'All support tickets retrieved successfully', tickets);
        } catch (error) {
            logger.error('Error getting all tickets:', error);
            return ApiResponse.error(res, 'Failed to retrieve support tickets', 500);
        }
    }

    /**
     * Get tickets assigned to the authenticated user (for support staff)
     */
    static async getAssignedTickets(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 20, status, priority, category } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                status: status as string,
                priority: priority as string,
                category: category as string
            };

            const tickets = await supportService.getAssignedTickets(userId, filters);
            return ApiResponse.success(res, 'Assigned tickets retrieved successfully', tickets);
        } catch (error) {
            logger.error('Error getting assigned tickets:', error);
            return ApiResponse.error(res, 'Failed to retrieve assigned tickets', 500);
        }
    }

    /**
     * Get ticket by ID
     */
    static async getTicketById(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const ticket = await supportService.getTicketById(ticketId);
            if (!ticket) {
                return ApiResponse.error(res, 'Ticket not found', 404);
            }

            // Check if user has access to this ticket
            if (ticket.userId.toString() !== userId && ticket.assignedTo?.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            return ApiResponse.success(res, 'Ticket retrieved successfully', ticket);
        } catch (error) {
            logger.error('Error getting ticket by ID:', error);
            return ApiResponse.error(res, 'Failed to retrieve ticket', 500);
        }
    }

    /**
     * Create a new support ticket
     */
    static async createTicket(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                title,
                description,
                category,
                priority,
                campaignId,
                investmentId,
                milestoneId,
                tags = [],
                attachments = []
            } = req.body;

            if (!title || !description || !category) {
                return ApiResponse.error(res, 'Title, description, and category are required', 400);
            }

            const ticketData = {
                title,
                description,
                category,
                priority,
                userId,
                campaignId,
                investmentId,
                milestoneId,
                tags,
                attachments
            };

            const ticket = await supportService.createTicket(ticketData);
            return ApiResponse.success(res, 'Support ticket created successfully', ticket, 201);
        } catch (error) {
            logger.error('Error creating support ticket:', error);
            return ApiResponse.error(res, 'Failed to create support ticket', 500);
        }
    }

    /**
     * Create ticket from feedback
     */
    static async createTicketFromFeedback(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                feedback,
                category = 'feedback',
                priority = 'medium',
                campaignId,
                investmentId,
                milestoneId
            } = req.body;

            if (!feedback) {
                return ApiResponse.error(res, 'Feedback content is required', 400);
            }

            const ticketData = {
                title: `Feedback: ${feedback.substring(0, 50)}...`,
                description: feedback,
                category,
                priority,
                userId,
                campaignId,
                investmentId,
                milestoneId,
                tags: ['feedback'],
                attachments: []
            };

            const ticket = await supportService.createTicketFromFeedback(ticketData);
            return ApiResponse.success(res, 'Feedback ticket created successfully', ticket, 201);
        } catch (error) {
            logger.error('Error creating feedback ticket:', error);
            return ApiResponse.error(res, 'Failed to create feedback ticket', 500);
        }
    }

    /**
     * Update ticket
     */
    static async updateTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const ticket = await supportService.getTicketById(ticketId);
            if (!ticket) {
                return ApiResponse.error(res, 'Ticket not found', 404);
            }

            // Check if user owns this ticket or is assigned to it
            if (ticket.userId.toString() !== userId && ticket.assignedTo?.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const updateData = req.body;
            const updatedTicket = await supportService.updateTicket(ticketId, updateData);
            return ApiResponse.success(res, 'Ticket updated successfully', updatedTicket);
        } catch (error) {
            logger.error('Error updating ticket:', error);
            return ApiResponse.error(res, 'Failed to update ticket', 500);
        }
    }

    /**
     * Assign ticket to support staff
     */
    static async assignTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const { assignedTo } = req.body;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            if (!assignedTo) {
                return ApiResponse.error(res, 'Assigned user ID is required', 400);
            }

            // TODO: Check if current user has permission to assign tickets
            // For now, allow any authenticated user to assign tickets

            const ticket = await supportService.assignTicket(ticketId, assignedTo);
            return ApiResponse.success(res, 'Ticket assigned successfully', ticket);
        } catch (error) {
            logger.error('Error assigning ticket:', error);
            return ApiResponse.error(res, 'Failed to assign ticket', 500);
        }
    }

    /**
     * Resolve ticket
     */
    static async resolveTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const { resolution, resolutionNotes } = req.body;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            if (!resolution) {
                return ApiResponse.error(res, 'Resolution is required', 400);
            }

            const ticket = await supportService.resolveTicket(ticketId, userId, resolution, resolutionNotes);
            return ApiResponse.success(res, 'Ticket resolved successfully', ticket);
        } catch (error) {
            logger.error('Error resolving ticket:', error);
            return ApiResponse.error(res, 'Failed to resolve ticket', 500);
        }
    }

    /**
     * Close ticket
     */
    static async closeTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const ticket = await supportService.closeTicket(ticketId, userId);
            return ApiResponse.success(res, 'Ticket closed successfully', ticket);
        } catch (error) {
            logger.error('Error closing ticket:', error);
            return ApiResponse.error(res, 'Failed to close ticket', 500);
        }
    }

    /**
     * Add message to ticket
     */
    static async addMessage(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const { message, isInternal = false } = req.body;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            if (!message) {
                return ApiResponse.error(res, 'Message content is required', 400);
            }

            const ticket = await supportService.addMessage(ticketId, userId, message, isInternal);
            return ApiResponse.success(res, 'Message added successfully', ticket);
        } catch (error) {
            logger.error('Error adding message:', error);
            return ApiResponse.error(res, 'Failed to add message', 500);
        }
    }

    /**
     * Get ticket messages
     */
    static async getTicketMessages(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const ticket = await supportService.getTicketById(ticketId);
            if (!ticket) {
                return ApiResponse.error(res, 'Ticket not found', 404);
            }

            // Check if user has access to this ticket
            if (ticket.userId.toString() !== userId && ticket.assignedTo?.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const messages = await supportService.getTicketMessages(ticketId);
            return ApiResponse.success(res, 'Ticket messages retrieved successfully', messages);
        } catch (error) {
            logger.error('Error getting ticket messages:', error);
            return ApiResponse.error(res, 'Failed to retrieve ticket messages', 500);
        }
    }

    /**
     * Get ticket statistics
     */
    static async getTicketStats(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const stats = await supportService.getTicketStats(userId);
            return ApiResponse.success(res, 'Ticket statistics retrieved successfully', stats);
        } catch (error) {
            logger.error('Error getting ticket stats:', error);
            return ApiResponse.error(res, 'Failed to retrieve ticket statistics', 500);
        }
    }

    /**
     * Delete ticket
     */
    static async deleteTicket(req: Request, res: Response) {
        try {
            const { ticketId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const ticket = await supportService.getTicketById(ticketId);
            if (!ticket) {
                return ApiResponse.error(res, 'Ticket not found', 404);
            }

            // Check if user owns this ticket
            if (ticket.userId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            await supportService.deleteTicket(ticketId);
            return ApiResponse.success(res, 'Ticket deleted successfully');
        } catch (error) {
            logger.error('Error deleting ticket:', error);
            return ApiResponse.error(res, 'Failed to delete ticket', 500);
        }
    }
}
