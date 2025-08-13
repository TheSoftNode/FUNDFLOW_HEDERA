import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
    /**
     * Get analytics for the authenticated user
     */
    static async getUserAnalytics(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 10, type, scope } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                type: type as string,
                scope: scope as string
            };

            const analytics = await analyticsService.getAnalytics(filters);
            return ApiResponse.success(res, 'Analytics retrieved successfully', analytics);
        } catch (error) {
            logger.error('Error getting user analytics:', error);
            return ApiResponse.error(res, 'Failed to retrieve analytics', 500);
        }
    }

    /**
     * Get analytics by ID
     */
    static async getAnalyticsById(req: Request, res: Response) {
        try {
            const { analyticsId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const analytics = await analyticsService.getAnalyticsById(analyticsId);
            if (!analytics) {
                return ApiResponse.error(res, 'Analytics not found', 404);
            }

            // Check if user has access to this analytics
            if (analytics.ownerId.toString() !== userId && !analytics.isPublic) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            return ApiResponse.success(res, 'Analytics retrieved successfully', analytics);
        } catch (error) {
            logger.error('Error getting analytics by ID:', error);
            return ApiResponse.error(res, 'Failed to retrieve analytics', 500);
        }
    }

    /**
     * Create new analytics
     */
    static async createAnalytics(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                name,
                description,
                type,
                scope,
                dataSource,
                timeConfig,
                metrics,
                dimensions,
                filters,
                visualization,
                isPublic = false
            } = req.body;

            if (!name || !description || !type || !scope) {
                return ApiResponse.error(res, 'Name, description, type, and scope are required', 400);
            }

            const analyticsData = {
                name,
                description,
                type,
                scope,
                dataSource,
                timeConfig,
                metrics,
                dimensions,
                filters,
                visualization,
                isPublic,
                ownerId: userId
            };

            const analytics = await analyticsService.createAnalytics(analyticsData);
            return ApiResponse.success(res, 'Analytics created successfully', analytics, 201);
        } catch (error) {
            logger.error('Error creating analytics:', error);
            return ApiResponse.error(res, 'Failed to create analytics', 500);
        }
    }

    /**
     * Update analytics
     */
    static async updateAnalytics(req: Request, res: Response) {
        try {
            const { analyticsId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const analytics = await analyticsService.getAnalyticsById(analyticsId);
            if (!analytics) {
                return ApiResponse.error(res, 'Analytics not found', 404);
            }

            // Check if user owns this analytics
            if (analytics.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const updateData = req.body;
            const updatedAnalytics = await analyticsService.updateAnalytics(analyticsId, updateData);
            return ApiResponse.success(res, 'Analytics updated successfully', updatedAnalytics);
        } catch (error) {
            logger.error('Error updating analytics:', error);
            return ApiResponse.error(res, 'Failed to update analytics', 500);
        }
    }

    /**
     * Delete analytics
     */
    static async deleteAnalytics(req: Request, res: Response) {
        try {
            const { analyticsId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const analytics = await analyticsService.getAnalyticsById(analyticsId);
            if (!analytics) {
                return ApiResponse.error(res, 'Analytics not found', 404);
            }

            // Check if user owns this analytics
            if (analytics.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            await analyticsService.deleteAnalytics(analyticsId);
            return ApiResponse.success(res, 'Analytics deleted successfully');
        } catch (error) {
            logger.error('Error deleting analytics:', error);
            return ApiResponse.error(res, 'Failed to delete analytics', 500);
        }
    }

    /**
     * Track user event
     */
    static async trackEvent(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                eventName,
                eventType,
                properties = {},
                timestamp = new Date(),
                sessionId,
                pageUrl,
                userAgent,
                ipAddress
            } = req.body;

            if (!eventName || !eventType) {
                return ApiResponse.error(res, 'Event name and type are required', 400);
            }

            const eventData = {
                eventName,
                eventType,
                properties,
                timestamp: new Date(timestamp),
                sessionId,
                pageUrl,
                userAgent,
                ipAddress,
                userId
            };

            await analyticsService.trackEvent(eventData);
            return ApiResponse.success(res, 'Event tracked successfully');
        } catch (error) {
            logger.error('Error tracking event:', error);
            return ApiResponse.error(res, 'Failed to track event', 500);
        }
    }

    /**
     * Track page view
     */
    static async trackPageView(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                pageUrl,
                pageTitle,
                referrer,
                sessionId,
                userAgent,
                ipAddress
            } = req.body;

            if (!pageUrl) {
                return ApiResponse.error(res, 'Page URL is required', 400);
            }

            const pageViewData = {
                pageUrl,
                pageTitle,
                referrer,
                sessionId,
                userAgent,
                ipAddress,
                userId
            };

            await analyticsService.trackPageView(pageViewData);
            return ApiResponse.success(res, 'Page view tracked successfully');
        } catch (error) {
            logger.error('Error tracking page view:', error);
            return ApiResponse.error(res, 'Failed to track page view', 500);
        }
    }

    /**
     * Track user action
     */
    static async trackUserAction(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                action,
                target,
                properties = {},
                timestamp = new Date(),
                sessionId
            } = req.body;

            if (!action || !target) {
                return ApiResponse.error(res, 'Action and target are required', 400);
            }

            const actionData = {
                action,
                target,
                properties,
                timestamp: new Date(timestamp),
                sessionId,
                userId
            };

            await analyticsService.trackUserAction(actionData);
            return ApiResponse.success(res, 'User action tracked successfully');
        } catch (error) {
            logger.error('Error tracking user action:', error);
            return ApiResponse.error(res, 'Failed to track user action', 500);
        }
    }

    /**
     * Track investment action
     */
    static async trackInvestmentAction(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                action,
                investmentId,
                campaignId,
                amount,
                properties = {},
                timestamp = new Date()
            } = req.body;

            if (!action || !investmentId) {
                return ApiResponse.error(res, 'Action and investment ID are required', 400);
            }

            const actionData = {
                action,
                investmentId,
                campaignId,
                amount,
                properties,
                timestamp: new Date(timestamp),
                userId
            };

            await analyticsService.trackInvestmentAction(actionData);
            return ApiResponse.success(res, 'Investment action tracked successfully');
        } catch (error) {
            logger.error('Error tracking investment action:', error);
            return ApiResponse.error(res, 'Failed to track investment action', 500);
        }
    }

    /**
     * Record metric
     */
    static async recordMetric(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                metricName,
                metricValue,
                metricType,
                unit,
                tags = {},
                timestamp = new Date()
            } = req.body;

            if (!metricName || metricValue === undefined || !metricType) {
                return ApiResponse.error(res, 'Metric name, value, and type are required', 400);
            }

            const metricData = {
                metricName,
                metricValue,
                metricType,
                unit,
                tags,
                timestamp: new Date(timestamp),
                userId
            };

            await analyticsService.recordMetric(metricData);
            return ApiResponse.success(res, 'Metric recorded successfully');
        } catch (error) {
            logger.error('Error recording metric:', error);
            return ApiResponse.error(res, 'Failed to record metric', 500);
        }
    }

    /**
     * Get metric history
     */
    static async getMetricHistory(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { metricName, startDate, endDate, interval = '1d' } = req.query;

            if (!metricName) {
                return ApiResponse.error(res, 'Metric name is required', 400);
            }

            const filters = {
                metricName: metricName as string,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                interval: interval as string
            };

            const history = await analyticsService.getMetricHistory(userId, filters);
            return ApiResponse.success(res, 'Metric history retrieved successfully', history);
        } catch (error) {
            logger.error('Error getting metric history:', error);
            return ApiResponse.error(res, 'Failed to retrieve metric history', 500);
        }
    }

    /**
     * Calculate platform metrics
     */
    static async calculatePlatformMetrics(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            // TODO: Check if user has admin role
            // For now, allow any authenticated user to view platform metrics

            const { timeRange = '30d', includeHistorical = false } = req.query;

            const metrics = await analyticsService.calculatePlatformMetrics({
                timeRange: timeRange as string,
                includeHistorical: includeHistorical === 'true'
            });

            return ApiResponse.success(res, 'Platform metrics calculated successfully', metrics);
        } catch (error) {
            logger.error('Error calculating platform metrics:', error);
            return ApiResponse.error(res, 'Failed to calculate platform metrics', 500);
        }
    }

    /**
     * Calculate user analytics
     */
    static async calculateUserAnalytics(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { timeRange = '30d', includeHistorical = false } = req.query;

            const analytics = await analyticsService.calculateUserAnalytics(userId, {
                timeRange: timeRange as string,
                includeHistorical: includeHistorical === 'true'
            });

            return ApiResponse.success(res, 'User analytics calculated successfully', analytics);
        } catch (error) {
            logger.error('Error calculating user analytics:', error);
            return ApiResponse.error(res, 'Failed to calculate user analytics', 500);
        }
    }

    /**
     * Create analytics dashboard
     */
    static async createDashboard(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                name,
                description,
                widgets = [],
                layout = {},
                isPublic = false
            } = req.body;

            if (!name || !description) {
                return ApiResponse.error(res, 'Name and description are required', 400);
            }

            const dashboardData = {
                name,
                description,
                widgets,
                layout,
                isPublic,
                ownerId: userId
            };

            const dashboard = await analyticsService.createDashboard(dashboardData);
            return ApiResponse.success(res, 'Dashboard created successfully', dashboard, 201);
        } catch (error) {
            logger.error('Error creating dashboard:', error);
            return ApiResponse.error(res, 'Failed to create dashboard', 500);
        }
    }

    /**
     * Get user dashboards
     */
    static async getUserDashboards(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 10 } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit)
            };

            const dashboards = await analyticsService.getUserDashboards(userId, filters);
            return ApiResponse.success(res, 'User dashboards retrieved successfully', dashboards);
        } catch (error) {
            logger.error('Error getting user dashboards:', error);
            return ApiResponse.error(res, 'Failed to retrieve user dashboards', 500);
        }
    }

    /**
     * Update dashboard
     */
    static async updateDashboard(req: Request, res: Response) {
        try {
            const { dashboardId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const dashboard = await analyticsService.getAnalyticsById(dashboardId);
            if (!dashboard) {
                return ApiResponse.error(res, 'Dashboard not found', 404);
            }

            // Check if user owns this dashboard
            if (dashboard.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const updateData = req.body;
            const updatedDashboard = await analyticsService.updateDashboard(dashboardId, updateData);
            return ApiResponse.success(res, 'Dashboard updated successfully', updatedDashboard);
        } catch (error) {
            logger.error('Error updating dashboard:', error);
            return ApiResponse.error(res, 'Failed to update dashboard', 500);
        }
    }

    /**
     * Generate analytics report
     */
    static async generateAnalyticsReport(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                reportType,
                timeRange,
                metrics = [],
                dimensions = [],
                filters = {},
                format = 'json'
            } = req.body;

            if (!reportType || !timeRange) {
                return ApiResponse.error(res, 'Report type and time range are required', 400);
            }

            const reportData = {
                reportType,
                timeRange,
                metrics,
                dimensions,
                filters,
                format,
                userId
            };

            const report = await analyticsService.generateAnalyticsReport(reportData);
            return ApiResponse.success(res, 'Analytics report generated successfully', report);
        } catch (error) {
            logger.error('Error generating analytics report:', error);
            return ApiResponse.error(res, 'Failed to generate analytics report', 500);
        }
    }
}
