import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware';
import NotificationController from '../controllers/NotificationController';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    return next();
};

// ==================== USER NOTIFICATION ENDPOINTS ====================

// GET /api/notifications - Get user notifications with filters
router.get('/',
    [
        query('page').optional().isInt({ min: 1 }).toInt(),
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
        query('type').optional().isIn(['investment', 'milestone', 'campaign', 'payment', 'system', 'reminder', 'alert']),
        query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
        query('unreadOnly').optional().isBoolean(),
        query('startDate').optional().isISO8601().toDate(),
        query('endDate').optional().isISO8601().toDate()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.getUserNotifications(req, res);
        } catch (error) {
            logger.error('Error in getUserNotifications route:', error);
            next(error);
        }
    }
);

// GET /api/notifications/unread-count - Get unread notification count
router.get('/unread-count',
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.getUnreadCount(req, res);
        } catch (error) {
            logger.error('Error in getUnreadCount route:', error);
            next(error);
        }
    }
);

// GET /api/notifications/:id - Get notification by ID
router.get('/:id',
    [
        param('id').isMongoId()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.getNotificationById(req, res);
        } catch (error) {
            logger.error('Error in getNotificationById route:', error);
            next(error);
        }
    }
);

// ==================== NOTIFICATION MANAGEMENT ENDPOINTS ====================

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read',
    [
        param('id').isMongoId()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.markAsRead(req, res);
        } catch (error) {
            logger.error('Error in markAsRead route:', error);
            next(error);
        }
    }
);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all',
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.markAllAsRead(req, res);
        } catch (error) {
            logger.error('Error in markAllAsRead route:', error);
            next(error);
        }
    }
);

// PUT /api/notifications/:id/archive - Archive notification
router.put('/:id/archive',
    [
        param('id').isMongoId()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.archiveNotification(req, res);
        } catch (error) {
            logger.error('Error in archiveNotification route:', error);
            next(error);
        }
    }
);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id',
    [
        param('id').isMongoId()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.deleteNotification(req, res);
        } catch (error) {
            logger.error('Error in deleteNotification route:', error);
            next(error);
        }
    }
);

// ==================== NOTIFICATION SETTINGS ENDPOINTS ====================

// PUT /api/notifications/preferences - Update notification preferences
router.put('/preferences',
    [
        body('email').optional().isBoolean(),
        body('push').optional().isBoolean(),
        body('inApp').optional().isBoolean()
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.updateNotificationPreferences(req, res);
        } catch (error) {
            logger.error('Error in updateNotificationPreferences route:', error);
            next(error);
        }
    }
);

// ==================== ADMIN ENDPOINTS ====================

// POST /api/notifications/system - Create system notification (admin only)
router.post('/system',
    [
        body('title').isString().isLength({ min: 1, max: 200 }),
        body('message').isString().isLength({ min: 1, max: 1000 }),
        body('recipientIds').isArray({ min: 1 }),
        body('recipientIds.*').isMongoId(),
        body('type').optional().isIn(['system', 'reminder', 'alert']),
        body('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
    ],
    handleValidationErrors,
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.createSystemNotification(req, res);
        } catch (error) {
            logger.error('Error in createSystemNotification route:', error);
            next(error);
        }
    }
);

// GET /api/notifications/stats - Get notification statistics (admin only)
router.get('/stats',
    authenticateToken,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            await NotificationController.getNotificationStats(req, res);
        } catch (error) {
            logger.error('Error in getNotificationStats route:', error);
            next(error);
        }
    }
);

export default router;
