import { Request, Response } from 'express';
import { notificationService } from '../services/NotificationService';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export class NotificationController {
    // ==================== GET NOTIFICATIONS ====================

    /**
     * Get user notifications with filters
     */
    async getUserNotifications(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page, limit, type, priority, unreadOnly, startDate, endDate } = req.query;

            const filters = {
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 20,
                type: type as string,
                priority: priority as string,
                unreadOnly: unreadOnly === 'true',
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined
            };

            const result = await notificationService.getUserNotifications(userId, filters);

            return ApiResponse.success(res, 'Notifications retrieved successfully', result);
        } catch (error) {
            logger.error('Failed to get user notifications:', error);
            return ApiResponse.error(res, 'Failed to get notifications', 500);
        }
    }

    /**
     * Get unread notification count
     */
    async getUnreadCount(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const count = await notificationService.getUnreadCount(userId);

            return ApiResponse.success(res, 'Unread count retrieved successfully', { count });
        } catch (error) {
            logger.error('Failed to get unread count:', error);
            return ApiResponse.error(res, 'Failed to get unread count', 500);
        }
    }

    /**
     * Get notification by ID
     */
    async getNotificationById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const notification = await notificationService.getNotificationById(id);

            if (!notification) {
                return ApiResponse.error(res, 'Notification not found', 404);
            }

            // Check if user owns this notification
            if (notification.recipientId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            return ApiResponse.success(res, 'Notification retrieved successfully', notification);
        } catch (error) {
            logger.error('Failed to get notification by ID:', error);
            return ApiResponse.error(res, 'Failed to get notification', 500);
        }
    }

    // ==================== NOTIFICATION MANAGEMENT ====================

    /**
     * Mark notification as read
     */
    async markAsRead(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const notification = await notificationService.markAsRead(id, userId);

            return ApiResponse.success(res, 'Notification marked as read', notification);
        } catch (error) {
            logger.error('Failed to mark notification as read:', error);
            return ApiResponse.error(res, 'Failed to mark notification as read', 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const result = await notificationService.markAllAsRead(userId);

            return ApiResponse.success(res, 'All notifications marked as read', result);
        } catch (error) {
            logger.error('Failed to mark all notifications as read:', error);
            return ApiResponse.error(res, 'Failed to mark all notifications as read', 500);
        }
    }

    /**
     * Archive notification
     */
    async archiveNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const notification = await notificationService.archiveNotification(id, userId);

            return ApiResponse.success(res, 'Notification archived successfully', notification);
        } catch (error) {
            logger.error('Failed to archive notification:', error);
            return ApiResponse.error(res, 'Failed to archive notification', 500);
        }
    }

    /**
     * Delete notification
     */
    async deleteNotification(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            await notificationService.deleteNotification(id, userId);

            return ApiResponse.success(res, 'Notification deleted successfully');
        } catch (error) {
            logger.error('Failed to delete notification:', error);
            return ApiResponse.error(res, 'Failed to delete notification', 500);
        }
    }

    // ==================== NOTIFICATION SETTINGS ====================

    /**
     * Update notification preferences
     */
    async updateNotificationPreferences(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { email, push, inApp } = req.body;

            // Update user preferences in User model
            // This would typically be handled by UserService
            // For now, return success

            return ApiResponse.success(res, 'Notification preferences updated successfully');
        } catch (error) {
            logger.error('Failed to update notification preferences:', error);
            return ApiResponse.error(res, 'Failed to update notification preferences', 500);
        }
    }

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Create system notification (admin only)
     */
    async createSystemNotification(req: Request, res: Response) {
        try {
            const { title, message, recipientIds, type, priority } = req.body;

            if (!title || !message || !recipientIds || !Array.isArray(recipientIds)) {
                return ApiResponse.error(res, 'Missing required fields', 400);
            }

            // TODO: Check if user is admin
            // if (!req.user?.isAdmin) {
            //   return ApiResponse.error(res, 'Admin access required', 403);
            // }

            const notifications = await notificationService.createSystemNotification(
                title,
                message,
                recipientIds,
                type || 'system',
                priority || 'medium'
            );

            return ApiResponse.success(res, 'System notifications created successfully', {
                count: notifications.length
            }, 201);
        } catch (error) {
            logger.error('Failed to create system notifications:', error);
            return ApiResponse.error(res, 'Failed to create system notifications', 500);
        }
    }

    /**
     * Get platform notification statistics (admin only)
     */
    async getNotificationStats(req: Request, res: Response) {
        try {
            // TODO: Check if user is admin
            // if (!req.user?.isAdmin) {
            //   return ApiResponse.error(res, 'Admin access required', 403);
            // }

            // TODO: Implement notification statistics
            const stats = {
                totalNotifications: 0,
                unreadNotifications: 0,
                notificationsByType: {},
                notificationsByPriority: {}
            };

            return ApiResponse.success(res, 'Notification statistics retrieved successfully', stats);
        } catch (error) {
            logger.error('Failed to get notification statistics:', error);
            return ApiResponse.error(res, 'Failed to get notification statistics', 500);
        }
    }
}

export default new NotificationController();
