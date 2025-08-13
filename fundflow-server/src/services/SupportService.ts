import SupportTicket, { ISupportTicket } from '../models/SupportTicket';
import User from '../models/User';
import { logger } from '../utils/logger';

export interface CreateTicketData {
    title: string;
    description: string;
    category: 'technical' | 'billing' | 'account' | 'investment' | 'campaign' | 'general' | 'bug' | 'feature-request';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    userId: string;
    userEmail: string;
    userRole: 'investor' | 'startup' | 'admin';
    campaignId?: string;
    investmentId?: string;
    milestoneId?: string;
    tags?: string[];
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
    }>;
}

export interface UpdateTicketData {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    status?: string;
    tags?: string[];
}

export interface TicketFilters {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    category?: string;
    userId?: string;
    assignedTo?: string;
    isOverdue?: boolean;
    startDate?: Date;
    endDate?: Date;
}

export interface TicketStats {
    totalTickets: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    closedTickets: number;
    averageResolutionTime: number;
    overdueTickets: number;
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
}

export interface CreateMessageData {
    senderId: string;
    senderType: 'user' | 'support' | 'system';
    message: string;
    isInternal?: boolean;
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
    }>;
}

export class SupportService {
    constructor() {
        logger.info('SupportService initialized');
    }

    // ==================== TICKET CREATION ====================

    /**
     * Create a new support ticket
     */
    async createTicket(data: CreateTicketData): Promise<ISupportTicket> {
        try {
            // Validate user exists
            const user = await User.findById(data.userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate unique ticket ID
            const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Set default priority based on category
            const defaultPriority = this.getDefaultPriority(data.category);
            const priority = data.priority || defaultPriority;

            const ticket = new SupportTicket({
                ticketId,
                title: data.title,
                description: data.description,
                category: data.category,
                priority,
                userId: data.userId,
                userEmail: data.userEmail,
                userRole: data.userRole,
                campaignId: data.campaignId,
                investmentId: data.investmentId,
                milestoneId: data.milestoneId,
                tags: data.tags || [],
                attachments: data.attachments || [],
                messages: [{
                    senderId: data.userId,
                    senderType: 'user',
                    message: data.description,
                    isInternal: false,
                    attachments: data.attachments || [],
                    createdAt: new Date()
                }],
                sla: {
                    targetResolutionTime: this.getTargetResolutionTime(priority),
                    isOverdue: false
                }
            });

            const savedTicket = await ticket.save();
            logger.info(`Support ticket created: ${ticketId} by ${data.userId}`);

            return savedTicket;
        } catch (error) {
            logger.error('Error creating support ticket:', error);
            throw error;
        }
    }

    /**
     * Create ticket from user feedback
     */
    async createTicketFromFeedback(
        userId: string,
        feedback: {
            type: 'bug' | 'feature-request' | 'general';
            title: string;
            description: string;
            severity?: 'low' | 'medium' | 'high';
        }
    ): Promise<ISupportTicket> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const category = feedback.type === 'bug' ? 'bug' :
                feedback.type === 'feature-request' ? 'feature-request' : 'general';

            const priority = feedback.severity === 'high' ? 'high' :
                feedback.severity === 'medium' ? 'medium' : 'low';

            const ticketData: CreateTicketData = {
                title: feedback.title,
                description: feedback.description,
                category,
                priority,
                userId,
                userEmail: user.email,
                userRole: user.role,
                tags: [feedback.type, 'feedback']
            };

            return await this.createTicket(ticketData);
        } catch (error) {
            logger.error('Error creating ticket from feedback:', error);
            throw error;
        }
    }

    // ==================== TICKET RETRIEVAL ====================

    /**
     * Get tickets with filters
     */
    async getTickets(filters: TicketFilters = {}): Promise<{ tickets: ISupportTicket[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, status, priority, category, userId, assignedTo, isOverdue, startDate, endDate } = filters;
            const skip = (page - 1) * limit;

            const query: any = {};

            if (status) {
                query.status = status;
            }

            if (priority) {
                query.priority = priority;
            }

            if (category) {
                query.category = category;
            }

            if (userId) {
                query.userId = userId;
            }

            if (assignedTo) {
                query.assignedTo = assignedTo;
            }

            if (isOverdue !== undefined) {
                query['sla.isOverdue'] = isOverdue;
            }

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = startDate;
                if (endDate) query.createdAt.$lte = endDate;
            }

            const [tickets, total] = await Promise.all([
                SupportTicket.find(query)
                    .sort({ priority: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('userId', 'profile.name profile.avatar role')
                    .populate('assignedTo', 'profile.name profile.avatar role')
                    .populate('resolvedBy', 'profile.name profile.avatar role')
                    .populate('campaignId', 'title status')
                    .populate('investmentId', 'amount status')
                    .populate('milestoneId', 'title status'),
                SupportTicket.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                tickets,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching tickets:', error);
            throw error;
        }
    }

    /**
     * Get ticket by ID
     */
    async getTicketById(ticketId: string): Promise<ISupportTicket | null> {
        try {
            const ticket = await SupportTicket.findById(ticketId)
                .populate('userId', 'profile.name profile.avatar role email')
                .populate('assignedTo', 'profile.name profile.avatar role')
                .populate('resolvedBy', 'profile.name profile.avatar role')
                .populate('campaignId', 'title status')
                .populate('investmentId', 'amount status')
                .populate('milestoneId', 'title status');

            return ticket;
        } catch (error) {
            logger.error('Error fetching ticket by ID:', error);
            throw error;
        }
    }

    /**
     * Get tickets by user
     */
    async getUserTickets(userId: string, filters: TicketFilters = {}): Promise<{ tickets: ISupportTicket[]; total: number; page: number; totalPages: number }> {
        return this.getTickets({ ...filters, userId });
    }

    /**
     * Get assigned tickets for support agent
     */
    async getAssignedTickets(agentId: string, filters: TicketFilters = {}): Promise<{ tickets: ISupportTicket[]; total: number; page: number; totalPages: number }> {
        return this.getTickets({ ...filters, assignedTo: agentId });
    }

    // ==================== TICKET MANAGEMENT ====================

    /**
     * Update ticket
     */
    async updateTicket(ticketId: string, updates: UpdateTicketData, userId: string): Promise<ISupportTicket> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            // Check if user can update ticket
            if (ticket.userId.toString() !== userId && !ticket.assignedTo?.toString() === userId) {
                throw new Error('Access denied');
            }

            const updatedTicket = await SupportTicket.findByIdAndUpdate(
                ticketId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!updatedTicket) {
                throw new Error('Ticket not found');
            }

            logger.info(`Ticket updated: ${ticketId} by ${userId}`);
            return updatedTicket;
        } catch (error) {
            logger.error('Error updating ticket:', error);
            throw error;
        }
    }

    /**
     * Assign ticket to support agent
     */
    async assignTicket(ticketId: string, agentId: string, adminId: string): Promise<ISupportTicket> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            // Validate agent exists
            const agent = await User.findById(agentId);
            if (!agent) {
                throw new Error('Support agent not found');
            }

            const updatedTicket = await ticket.assignTo(agentId);
            logger.info(`Ticket assigned: ${ticketId} -> ${agentId} by ${adminId}`);

            return updatedTicket;
        } catch (error) {
            logger.error('Error assigning ticket:', error);
            throw error;
        }
    }

    /**
     * Resolve ticket
     */
    async resolveTicket(
        ticketId: string,
        resolverId: string,
        resolution: {
            summary: string;
            steps: string[];
            category: 'resolved' | 'workaround' | 'duplicate' | 'not-a-bug' | 'by-design';
        }
    ): Promise<ISupportTicket> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            const updatedTicket = await ticket.resolve(
                resolverId,
                resolution.summary,
                resolution.steps,
                resolution.category
            );

            logger.info(`Ticket resolved: ${ticketId} by ${resolverId}`);
            return updatedTicket;
        } catch (error) {
            logger.error('Error resolving ticket:', error);
            throw error;
        }
    }

    /**
     * Close ticket
     */
    async closeTicket(ticketId: string, userId: string): Promise<ISupportTicket> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            if (ticket.status !== 'resolved') {
                throw new Error('Only resolved tickets can be closed');
            }

            const updatedTicket = await ticket.close();
            logger.info(`Ticket closed: ${ticketId} by ${userId}`);

            return updatedTicket;
        } catch (error) {
            logger.error('Error closing ticket:', error);
            throw error;
        }
    }

    /**
     * Delete ticket
     */
    async deleteTicket(ticketId: string, userId: string): Promise<boolean> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            // Only ticket owner or assigned agent can delete
            if (ticket.userId.toString() !== userId && ticket.assignedTo?.toString() !== userId) {
                throw new Error('Access denied');
            }

            await SupportTicket.findByIdAndDelete(ticketId);
            logger.info(`Ticket deleted: ${ticketId} by ${userId}`);

            return true;
        } catch (error) {
            logger.error('Error deleting ticket:', error);
            throw error;
        }
    }

    // ==================== MESSAGE MANAGEMENT ====================

    /**
     * Add message to ticket
     */
    async addMessage(ticketId: string, data: CreateMessageData): Promise<ISupportTicket> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            const updatedTicket = await ticket.addMessage(
                data.senderId,
                data.senderType,
                data.message,
                data.isInternal || false,
                data.attachments
            );

            logger.info(`Message added to ticket: ${ticketId} by ${data.senderId}`);
            return updatedTicket;
        } catch (error) {
            logger.error('Error adding message to ticket:', error);
            throw error;
        }
    }

    /**
     * Get ticket messages
     */
    async getTicketMessages(ticketId: string, includeInternal: boolean = false): Promise<any[]> {
        try {
            const ticket = await SupportTicket.findById(ticketId);
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            let messages = ticket.messages;

            if (!includeInternal) {
                messages = messages.filter(m => !m.isInternal);
            }

            // Populate sender details
            const populatedMessages = await Promise.all(
                messages.map(async (message) => {
                    const sender = await User.findById(message.senderId).select('profile.name profile.avatar role');
                    return {
                        ...message.toObject(),
                        sender
                    };
                })
            );

            return populatedMessages;
        } catch (error) {
            logger.error('Error fetching ticket messages:', error);
            throw error;
        }
    }

    // ==================== TICKET STATISTICS ====================

    /**
     * Get ticket statistics
     */
    async getTicketStats(userId?: string): Promise<TicketStats> {
        try {
            const stats = await SupportTicket.getTicketStats(userId);

            if (stats.length === 0) {
                return {
                    totalTickets: 0,
                    openTickets: 0,
                    inProgressTickets: 0,
                    resolvedTickets: 0,
                    closedTickets: 0,
                    averageResolutionTime: 0,
                    overdueTickets: 0,
                    ticketsByCategory: {},
                    ticketsByPriority: {}
                };
            }

            const stat = stats[0];

            // Get overdue tickets count
            const overdueCount = await SupportTicket.countDocuments({
                'sla.isOverdue': true,
                ...(userId && { userId })
            });

            // Get tickets by category
            const categoryStats = await SupportTicket.aggregate([
                ...(userId ? [{ $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } }] : []),
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const ticketsByCategory = categoryStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>);

            // Get tickets by priority
            const priorityStats = await SupportTicket.aggregate([
                ...(userId ? [{ $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } }] : []),
                {
                    $group: {
                        _id: '$priority',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const ticketsByPriority = priorityStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>);

            return {
                totalTickets: stat.totalTickets || 0,
                openTickets: stat.openTickets || 0,
                inProgressTickets: stat.inProgressTickets || 0,
                resolvedTickets: stat.resolvedTickets || 0,
                closedTickets: stat.closedTickets || 0,
                averageResolutionTime: stat.averageResolutionTime || 0,
                overdueTickets: overdueCount,
                ticketsByCategory,
                ticketsByPriority
            };
        } catch (error) {
            logger.error('Error getting ticket statistics:', error);
            throw error;
        }
    }

    // ==================== SLA MANAGEMENT ====================

    /**
     * Check and update SLA status
     */
    async updateSLAs(): Promise<{ updated: number; overdue: number }> {
        try {
            const now = new Date();
            let updated = 0;
            let overdue = 0;

            // Find tickets that need SLA updates
            const tickets = await SupportTicket.find({
                status: { $in: ['open', 'in-progress'] },
                'sla.isOverdue': false
            });

            for (const ticket of tickets) {
                const timeSinceCreation = now.getTime() - ticket.createdAt.getTime();
                const hoursSinceCreation = Math.floor(timeSinceCreation / (1000 * 60 * 60));

                if (hoursSinceCreation > ticket.sla.targetResolutionTime) {
                    ticket.sla.isOverdue = true;
                    await ticket.save();
                    overdue++;
                }

                updated++;
            }

            logger.info(`SLA updates completed: ${updated} checked, ${overdue} overdue`);
            return { updated, overdue };
        } catch (error) {
            logger.error('Error updating SLAs:', error);
            throw error;
        }
    }

    // ==================== TICKET CLEANUP ====================

    /**
     * Clean up old closed tickets
     */
    async cleanupOldTickets(daysOld: number = 365): Promise<{ deletedCount: number }> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await SupportTicket.deleteMany({
                status: 'closed',
                closedAt: { $lt: cutoffDate }
            });

            logger.info(`Cleaned up ${result.deletedCount} old tickets`);
            return { deletedCount: result.deletedCount || 0 };
        } catch (error) {
            logger.error('Error cleaning up old tickets:', error);
            throw error;
        }
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Get default priority based on category
     */
    private getDefaultPriority(category: string): 'low' | 'medium' | 'high' | 'urgent' {
        const priorityMap: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
            'bug': 'high',
            'billing': 'high',
            'account': 'medium',
            'investment': 'medium',
            'campaign': 'medium',
            'technical': 'medium',
            'general': 'low',
            'feature-request': 'low'
        };

        return priorityMap[category] || 'medium';
    }

    /**
     * Get target resolution time based on priority
     */
    private getTargetResolutionTime(priority: string): number {
        const timeMap: Record<string, number> = {
            'urgent': 4,    // 4 hours
            'high': 24,     // 24 hours
            'medium': 72,   // 72 hours
            'low': 168      // 1 week
        };

        return timeMap[priority] || 72;
    }
}

export const supportService = new SupportService();
export default supportService;
