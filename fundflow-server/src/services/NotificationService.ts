import Notification, { INotification } from '../models/Notification';
import User from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export interface CreateNotificationData {
  recipientId: string;
  recipientType: 'investor' | 'startup';
  recipientAddress: string;
  title: string;
  message: string;
  type: 'investment' | 'milestone' | 'campaign' | 'payment' | 'system' | 'reminder' | 'alert';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  relatedCampaignId?: string;
  relatedInvestmentId?: string;
  relatedMilestoneId?: string;
  actionUrl?: string;
  actionText?: string;
  actionData?: Record<string, any>;
  deliveryChannels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: string;
  priority?: string;
  unreadOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export class NotificationService {
  constructor() {
    logger.info('NotificationService initialized');
  }

  // ==================== NOTIFICATION CREATION ====================

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<INotification> {
    try {
      // Validate recipient exists
      const recipient = await User.findById(data.recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      // Generate unique notification ID
      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const notification = new Notification({
        ...data,
        notificationId,
        deliveryChannels: data.deliveryChannels || {
          email: true,
          push: true,
          inApp: true
        }
      });

      const savedNotification = await notification.save();
      
      logger.info(`Notification created: ${notificationId} for user ${data.recipientId}`);
      
      // TODO: Trigger delivery based on delivery channels
      await this.triggerDelivery(savedNotification);
      
      return savedNotification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create multiple notifications for multiple recipients
   */
  async createBulkNotifications(
    notificationsData: CreateNotificationData[],
    recipientIds: string[]
  ): Promise<INotification[]> {
    try {
      const notifications: INotification[] = [];
      
      for (const recipientId of recipientIds) {
        for (const data of notificationsData) {
          const notificationData = {
            ...data,
            recipientId,
            recipientAddress: data.recipientAddress // This should be updated for each recipient
          };
          
          const notification = await this.createNotification(notificationData);
          notifications.push(notification);
        }
      }
      
      logger.info(`Created ${notifications.length} bulk notifications`);
      return notifications;
    } catch (error) {
      logger.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATION RETRIEVAL ====================

  /**
   * Get notifications for a user with filters
   */
  async getUserNotifications(
    userId: string,
    filters: NotificationFilters = {}
  ): Promise<{ notifications: INotification[]; total: number; page: number; totalPages: number }> {
    try {
      const { page = 1, limit = 20, type, priority, unreadOnly, startDate, endDate } = filters;
      const skip = (page - 1) * limit;

      const query: any = { recipientId: userId };
      
      if (type) {
        query.type = type;
      }
      
      if (priority) {
        query.priority = priority;
      }
      
      if (unreadOnly) {
        query.isRead = false;
      }
      
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }

      const [notifications, total] = await Promise.all([
        Notification.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('relatedCampaignId', 'title status')
          .populate('relatedInvestmentId', 'amount status')
          .populate('relatedMilestoneId', 'title status'),
        Notification.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        notifications,
        total,
        page,
        totalPages
      };
    } catch (error) {
      logger.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const count = await Notification.countDocuments({
        recipientId: userId,
        isRead: false,
        isArchived: false
      });
      
      return count;
    } catch (error) {
      logger.error('Error getting unread count:', error);
      throw error;
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId: string): Promise<INotification | null> {
    try {
      const notification = await Notification.findById(notificationId)
        .populate('relatedCampaignId', 'title status')
        .populate('relatedInvestmentId', 'amount status')
        .populate('relatedMilestoneId', 'title status');
      
      return notification;
    } catch (error) {
      logger.error('Error fetching notification by ID:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATION MANAGEMENT ====================

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipientId: userId
      });

      if (!notification) {
        throw new Error('Notification not found or access denied');
      }

      const updatedNotification = await notification.markAsRead();
      logger.info(`Notification marked as read: ${notificationId}`);
      
      return updatedNotification;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    try {
      const result = await Notification.markAllAsRead(userId);
      logger.info(`Marked all notifications as read for user: ${userId}`);
      
      return { modifiedCount: result.modifiedCount || 0 };
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Archive notification
   */
  async archiveNotification(notificationId: string, userId: string): Promise<INotification> {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        recipientId: userId
      });

      if (!notification) {
        throw new Error('Notification not found or access denied');
      }

      const updatedNotification = await notification.archive();
      logger.info(`Notification archived: ${notificationId}`);
      
      return updatedNotification;
    } catch (error) {
      logger.error('Error archiving notification:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    try {
      const result = await Notification.deleteOne({
        _id: notificationId,
        recipientId: userId
      });

      if (result.deletedCount === 0) {
        throw new Error('Notification not found or access denied');
      }

      logger.info(`Notification deleted: ${notificationId}`);
      return true;
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATION DELIVERY ====================

  /**
   * Trigger notification delivery based on delivery channels
   */
  private async triggerDelivery(notification: INotification): Promise<void> {
    try {
      const { deliveryChannels } = notification;

      if (deliveryChannels.email) {
        await this.sendEmailNotification(notification);
      }

      if (deliveryChannels.push) {
        await this.sendPushNotification(notification);
      }

      if (deliveryChannels.inApp) {
        // In-app notifications are already stored in the database
        await notification.markAsSent();
      }
    } catch (error) {
      logger.error('Error triggering notification delivery:', error);
      // Don't throw error to prevent notification creation from failing
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(notification: INotification): Promise<void> {
    try {
      // TODO: Implement email service integration
      logger.info(`Email notification sent for: ${notification._id}`);
    } catch (error) {
      logger.error('Error sending email notification:', error);
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(notification: INotification): Promise<void> {
    try {
      // TODO: Implement push notification service integration
      logger.info(`Push notification sent for: ${notification._id}`);
    } catch (error) {
      logger.error('Error sending push notification:', error);
    }
  }

  // ==================== NOTIFICATION TEMPLATES ====================

  /**
   * Create system notification
   */
  async createSystemNotification(
    title: string,
    message: string,
    recipientIds: string[],
    type: 'system' | 'reminder' | 'alert' = 'system',
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<INotification[]> {
    try {
      const notifications: INotification[] = [];
      
      for (const recipientId of recipientIds) {
        const user = await User.findById(recipientId);
        if (!user) continue;

        const notificationData: CreateNotificationData = {
          recipientId,
          recipientType: user.role,
          recipientAddress: user.walletAddress,
          title,
          message,
          type,
          priority,
          deliveryChannels: {
            email: true,
            push: true,
            inApp: true
          }
        };

        const notification = await this.createNotification(notificationData);
        notifications.push(notification);
      }

      logger.info(`Created ${notifications.length} system notifications`);
      return notifications;
    } catch (error) {
      logger.error('Error creating system notifications:', error);
      throw error;
    }
  }

  /**
   * Create milestone notification
   */
  async createMilestoneNotification(
    milestoneId: string,
    campaignId: string,
    recipientIds: string[],
    action: 'submitted' | 'approved' | 'rejected' | 'completed'
  ): Promise<INotification[]> {
    try {
      const actionMessages = {
        submitted: 'A milestone has been submitted for your review',
        approved: 'A milestone has been approved',
        rejected: 'A milestone has been rejected',
        completed: 'A milestone has been completed'
      };

      const actionUrls = {
        submitted: `/dashboard/milestones/${milestoneId}`,
        approved: `/dashboard/milestones/${milestoneId}`,
        rejected: `/dashboard/milestones/${milestoneId}`,
        completed: `/dashboard/milestones/${milestoneId}`
      };

      const notifications: INotification[] = [];
      
      for (const recipientId of recipientIds) {
        const user = await User.findById(recipientId);
        if (!user) continue;

        const notificationData: CreateNotificationData = {
          recipientId,
          recipientType: user.role,
          recipientAddress: user.walletAddress,
          title: `Milestone ${action}`,
          message: actionMessages[action],
          type: 'milestone',
          priority: action === 'rejected' ? 'high' : 'medium',
          relatedCampaignId: campaignId,
          relatedMilestoneId: milestoneId,
          actionUrl: actionUrls[action],
          actionText: 'View Milestone',
          deliveryChannels: {
            email: true,
            push: true,
            inApp: true
          }
        };

        const notification = await this.createNotification(notificationData);
        notifications.push(notification);
      }

      logger.info(`Created ${notifications.length} milestone notifications for action: ${action}`);
      return notifications;
    } catch (error) {
      logger.error('Error creating milestone notifications:', error);
      throw error;
    }
  }

  // ==================== NOTIFICATION CLEANUP ====================

  /**
   * Clean up old notifications
   */
  async cleanupOldNotifications(daysOld: number = 90): Promise<{ deletedCount: number }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        isArchived: true
      });

      logger.info(`Cleaned up ${result.deletedCount} old notifications`);
      return { deletedCount: result.deletedCount || 0 };
    } catch (error) {
      logger.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
