import Analytics, { IAnalytics, IAnalyticsEvent, IAnalyticsMetric, IAnalyticsDashboard } from '../models/Analytics';
import User from '../models/User';
import Campaign from '../models/Campaign';
import Investment from '../models/Investment';
import Milestone from '../models/Milestone';
import Payment from '../models/Payment';
import { logger } from '../utils/logger';
import { smartContractIntegration } from './SmartContractIntegrationService';

export interface CreateAnalyticsData {
    name: string;
    description?: string;
    type: 'user' | 'campaign' | 'investment' | 'platform' | 'custom';
    scope: 'individual' | 'campaign' | 'platform' | 'global';
    dataSource: {
        type: 'database' | 'smart-contract' | 'external-api' | 'calculated';
        source: string;
        query?: string;
        parameters?: Record<string, any>;
    };
    timeConfig: {
        granularity: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
        timezone?: string;
        startDate?: Date;
        endDate?: Date;
        isRealTime?: boolean;
        updateFrequency?: number;
    };
    metrics: string[];
    dimensions: string[];
    filters?: Record<string, any>;
    visualization: {
        type: 'chart' | 'table' | 'metric' | 'list';
        chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
        colors?: string[];
        options?: Record<string, any>;
    };
    isPublic?: boolean;
    accessList?: string[];
    ownerId: string;
    cache?: {
        isEnabled?: boolean;
        ttl?: number;
    };
}

export interface AnalyticsFilters {
    page?: number;
    limit?: number;
    type?: string;
    scope?: string;
    ownerId?: string;
    isPublic?: boolean;
}

export interface DashboardFilters {
    page?: number;
    limit?: number;
    userRole?: string;
    isDefault?: boolean;
}

export interface MetricQueryOptions {
    startDate?: Date;
    endDate?: Date;
    period?: string;
    category?: string;
    filters?: Record<string, any>;
    groupBy?: string[];
}

export interface EventTrackingData {
    eventType: string;
    userId?: string;
    userRole?: 'investor' | 'startup' | 'admin';
    sessionId: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
}

export interface PlatformMetrics {
    totalUsers: number;
    totalCampaigns: number;
    totalInvestments: number;
    totalVolume: number;
    activeUsers: number;
    conversionRate: number;
    averageInvestment: number;
    platformGrowth: number;
    userRetention: number;
    revenueMetrics: {
        totalFees: number;
        monthlyRecurringRevenue: number;
        averageRevenuePerUser: number;
    };
}

export interface UserAnalytics {
    userId: string;
    userRole: 'investor' | 'startup' | 'admin';
    metrics: {
        totalActivity: number;
        lastActive: Date;
        engagementScore: number;
        conversionRate: number;
        lifetimeValue: number;
    };
    behavior: {
        mostUsedFeatures: string[];
        averageSessionDuration: number;
        bounceRate: number;
        returnVisits: number;
    };
    performance: {
        totalInvestments?: number;
        totalRaised?: number;
        successRate?: number;
        averageReturn?: number;
    };
}

export class AnalyticsService {
    constructor() {
        logger.info('AnalyticsService initialized');
    }

    // ==================== ANALYTICS CREATION & MANAGEMENT ====================

    /**
     * Create new analytics configuration
     */
    async createAnalytics(data: CreateAnalyticsData): Promise<IAnalytics> {
        try {
            // Validate owner exists
            const owner = await User.findById(data.ownerId);
            if (!owner) {
                throw new Error('Analytics owner not found');
            }

            // Generate unique analytics ID
            const analyticsId = `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const analytics = new Analytics({
                ...data,
                analyticsId,
                timeConfig: {
                    timezone: 'UTC',
                    isRealTime: false,
                    updateFrequency: 60,
                    ...data.timeConfig
                },
                cache: {
                    isEnabled: true,
                    ttl: 300,
                    ...data.cache
                }
            });

            const savedAnalytics = await analytics.save();
            logger.info(`Analytics created: ${analyticsId} by ${data.ownerId}`);

            return savedAnalytics;
        } catch (error) {
            logger.error('Error creating analytics:', error);
            throw error;
        }
    }

    /**
     * Get analytics with filters
     */
    async getAnalytics(filters: AnalyticsFilters = {}): Promise<{ analytics: IAnalytics[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, type, scope, ownerId, isPublic } = filters;
            const skip = (page - 1) * limit;

            const query: any = {};

            if (type) {
                query.type = type;
            }

            if (scope) {
                query.scope = scope;
            }

            if (ownerId) {
                query.ownerId = ownerId;
            }

            if (isPublic !== undefined) {
                query.isPublic = isPublic;
            }

            const [analytics, total] = await Promise.all([
                Analytics.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('ownerId', 'profile.name role'),
                Analytics.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                analytics,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching analytics:', error);
            throw error;
        }
    }

    /**
     * Get analytics by ID
     */
    async getAnalyticsById(analyticsId: string): Promise<IAnalytics | null> {
        try {
            const analytics = await Analytics.findById(analyticsId)
                .populate('ownerId', 'profile.name role')
                .populate('accessList', 'profile.name role');

            return analytics;
        } catch (error) {
            logger.error('Error fetching analytics by ID:', error);
            throw error;
        }
    }

    /**
     * Update analytics
     */
    async updateAnalytics(analyticsId: string, updates: Partial<IAnalytics>, userId: string): Promise<IAnalytics> {
        try {
            const analytics = await Analytics.findById(analyticsId);
            if (!analytics) {
                throw new Error('Analytics not found');
            }

            // Check if user can update
            if (analytics.ownerId.toString() !== userId && !analytics.accessList.includes(userId)) {
                throw new Error('Access denied');
            }

            const updatedAnalytics = await Analytics.findByIdAndUpdate(
                analyticsId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!updatedAnalytics) {
                throw new Error('Analytics not found');
            }

            logger.info(`Analytics updated: ${analyticsId} by ${userId}`);
            return updatedAnalytics;
        } catch (error) {
            logger.error('Error updating analytics:', error);
            throw error;
        }
    }

    /**
     * Delete analytics
     */
    async deleteAnalytics(analyticsId: string, userId: string): Promise<boolean> {
        try {
            const analytics = await Analytics.findById(analyticsId);
            if (!analytics) {
                throw new Error('Analytics not found');
            }

            if (analytics.ownerId.toString() !== userId) {
                throw new Error('Access denied');
            }

            await Analytics.findByIdAndDelete(analyticsId);
            logger.info(`Analytics deleted: ${analyticsId} by ${userId}`);

            return true;
        } catch (error) {
            logger.error('Error deleting analytics:', error);
            throw error;
        }
    }

    // ==================== EVENT TRACKING ====================

    /**
     * Track user event
     */
    async trackEvent(data: EventTrackingData): Promise<IAnalyticsEvent> {
        try {
            const event = new AnalyticsEvent({
                ...data,
                timestamp: new Date()
            });

            const savedEvent = await event.save();
            logger.info(`Event tracked: ${data.eventType} for user ${data.userId}`);

            return savedEvent;
        } catch (error) {
            logger.error('Error tracking event:', error);
            throw error;
        }
    }

    /**
     * Track page view
     */
    async trackPageView(
        userId: string,
        userRole: string,
        sessionId: string,
        page: string,
        metadata?: Record<string, any>
    ): Promise<IAnalyticsEvent> {
        return this.trackEvent({
            eventType: 'page_view',
            userId,
            userRole: userRole as any,
            sessionId,
            metadata: {
                page,
                ...metadata
            }
        });
    }

    /**
     * Track user action
     */
    async trackUserAction(
        userId: string,
        userRole: string,
        sessionId: string,
        action: string,
        target?: string,
        metadata?: Record<string, any>
    ): Promise<IAnalyticsEvent> {
        return this.trackEvent({
            eventType: 'user_action',
            userId,
            userRole: userRole as any,
            sessionId,
            metadata: {
                action,
                target,
                ...metadata
            }
        });
    }

    /**
     * Track investment action
     */
    async trackInvestmentAction(
        userId: string,
        userRole: string,
        sessionId: string,
        action: 'view' | 'invest' | 'withdraw',
        campaignId?: string,
        amount?: number,
        metadata?: Record<string, any>
    ): Promise<IAnalyticsEvent> {
        return this.trackEvent({
            eventType: 'investment_action',
            userId,
            userRole: userRole as any,
            sessionId,
            metadata: {
                action,
                campaignId,
                amount,
                ...metadata
            }
        });
    }

    // ==================== METRICS & DATA COLLECTION ====================

    /**
     * Record metric
     */
    async recordMetric(
        name: string,
        value: number,
        unit: string,
        category: string,
        period: string,
        metadata?: Record<string, any>
    ): Promise<IAnalyticsMetric> {
        try {
            const metric = new AnalyticsMetric({
                name,
                value,
                unit,
                category,
                period,
                timestamp: new Date(),
                metadata
            });

            const savedMetric = await metric.save();
            logger.info(`Metric recorded: ${name} = ${value} ${unit}`);

            return savedMetric;
        } catch (error) {
            logger.error('Error recording metric:', error);
            throw error;
        }
    }

    /**
     * Get metric history
     */
    async getMetricHistory(metricName: string, options: MetricQueryOptions = {}): Promise<IAnalyticsMetric[]> {
        try {
            const { startDate, endDate, period, category, filters, groupBy } = options;

            const query: any = { name: metricName };

            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate) query.timestamp.$gte = startDate;
                if (endDate) query.timestamp.$lte = endDate;
            }

            if (period) {
                query.period = period;
            }

            if (category) {
                query.category = category;
            }

            if (filters) {
                Object.assign(query, filters);
            }

            let pipeline: any[] = [{ $match: query }];

            if (groupBy && groupBy.length > 0) {
                const groupStage: any = {
                    _id: {}
                };

                groupBy.forEach(field => {
                    groupStage[field] = { $first: `$${field}` };
                });

                groupStage.avgValue = { $avg: '$value' };
                groupStage.minValue = { $min: '$value' };
                groupStage.maxValue = { $max: '$value' };
                groupStage.count = { $sum: 1 };

                pipeline.push({ $group: groupStage });
            }

            pipeline.push({ $sort: { timestamp: 1 } });

            const metrics = await AnalyticsMetric.aggregate(pipeline);
            return metrics;
        } catch (error) {
            logger.error('Error getting metric history:', error);
            throw error;
        }
    }

    /**
     * Calculate platform metrics
     */
    async calculatePlatformMetrics(): Promise<PlatformMetrics> {
        try {
            // Get basic counts
            const [totalUsers, totalCampaigns, totalInvestments, totalPayments] = await Promise.all([
                User.countDocuments(),
                Campaign.countDocuments(),
                Investment.countDocuments(),
                Payment.countDocuments({ status: 'completed' })
            ]);

            // Calculate total volume
            const volumeResult = await Payment.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, totalVolume: { $sum: '$amount' } } }
            ]);

            const totalVolume = volumeResult.length > 0 ? volumeResult[0].totalVolume : 0;

            // Calculate active users (users active in last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const activeUsers = await User.countDocuments({
                'stats.lastActive': { $gte: thirtyDaysAgo }
            });

            // Calculate average investment
            const avgInvestmentResult = await Investment.aggregate([
                { $group: { _id: null, avgAmount: { $avg: '$amount' } } }
            ]);

            const averageInvestment = avgInvestmentResult.length > 0 ? avgInvestmentResult[0].avgAmount : 0;

            // Calculate conversion rate (users who have invested vs total users)
            const investorsWithInvestments = await Investment.distinct('investorAddress');
            const conversionRate = totalUsers > 0 ? (investorsWithInvestments.length / totalUsers) * 100 : 0;

            // Calculate platform growth (new users in last 30 days)
            const newUsers = await User.countDocuments({
                createdAt: { $gte: thirtyDaysAgo }
            });

            const platformGrowth = totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0;

            // Calculate revenue metrics
            const revenueResult = await Payment.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, totalFees: { $sum: '$platformFee' } } }
            ]);

            const totalFees = revenueResult.length > 0 ? revenueResult[0].totalFees : 0;

            // Calculate monthly recurring revenue (simplified)
            const monthlyRevenue = totalFees / 12; // Assuming annual fees
            const averageRevenuePerUser = totalUsers > 0 ? totalFees / totalUsers : 0;

            // Calculate user retention (users who returned after first visit)
            const retentionResult = await AnalyticsEvent.aggregate([
                { $match: { eventType: 'page_view' } },
                { $group: { _id: '$userId', visitCount: { $sum: 1 } } },
                { $match: { visitCount: { $gt: 1 } } },
                { $count: 'returningUsers' }
            ]);

            const returningUsers = retentionResult.length > 0 ? retentionResult[0].returningUsers : 0;
            const userRetention = totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0;

            return {
                totalUsers,
                totalCampaigns,
                totalInvestments,
                totalVolume,
                activeUsers,
                conversionRate,
                averageInvestment,
                platformGrowth,
                userRetention,
                revenueMetrics: {
                    totalFees,
                    monthlyRecurringRevenue: monthlyRevenue,
                    averageRevenuePerUser
                }
            };
        } catch (error) {
            logger.error('Error calculating platform metrics:', error);
            throw error;
        }
    }

    /**
     * Calculate user analytics
     */
    async calculateUserAnalytics(userId: string): Promise<UserAnalytics> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Get user activity metrics
            const userEvents = await AnalyticsEvent.find({ userId });
            const totalActivity = userEvents.length;
            const lastActive = user.stats.lastActive || user.createdAt;

            // Calculate engagement score based on activity frequency
            const daysSinceCreation = Math.ceil((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            const engagementScore = daysSinceCreation > 0 ? totalActivity / daysSinceCreation : 0;

            // Get most used features
            const featureUsage = await AnalyticsEvent.aggregate([
                { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
                { $group: { _id: '$eventType', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            const mostUsedFeatures = featureUsage.map(f => f._id);

            // Calculate conversion rate based on user role
            let conversionRate = 0;
            let totalInvestments = 0;
            let totalRaised = 0;
            let successRate = 0;
            let averageReturn = 0;

            if (user.role === 'investor') {
                const investments = await Investment.find({ investorAddress: user.walletAddress });
                totalInvestments = investments.length;
                conversionRate = totalInvestments > 0 ? 100 : 0; // Investor who has invested
            } else if (user.role === 'startup') {
                const campaigns = await Campaign.find({ creatorAddress: user.walletAddress });
                const totalRaisedResult = await Investment.aggregate([
                    { $match: { campaignId: { $in: campaigns.map(c => c._id) } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]);

                totalRaised = totalRaisedResult.length > 0 ? totalRaisedResult[0].total : 0;
                conversionRate = campaigns.length > 0 ? 100 : 0; // Startup who has created campaigns
            }

            // Calculate session metrics (simplified)
            const sessionEvents = userEvents.filter(e => e.eventType === 'page_view');
            const averageSessionDuration = sessionEvents.length > 0 ? 300 : 0; // Simplified: 5 minutes
            const bounceRate = sessionEvents.length > 0 ? 30 : 0; // Simplified: 30%
            const returnVisits = sessionEvents.length > 1 ? 1 : 0;

            return {
                userId,
                userRole: user.role,
                metrics: {
                    totalActivity,
                    lastActive,
                    engagementScore,
                    conversionRate,
                    lifetimeValue: totalRaised || totalInvestments
                },
                behavior: {
                    mostUsedFeatures,
                    averageSessionDuration,
                    bounceRate,
                    returnVisits
                },
                performance: {
                    totalInvestments,
                    totalRaised,
                    successRate,
                    averageReturn
                }
            };
        } catch (error) {
            logger.error('Error calculating user analytics:', error);
            throw error;
        }
    }

    // ==================== DASHBOARD MANAGEMENT ====================

    /**
     * Create analytics dashboard
     */
    async createDashboard(
        userId: string,
        userRole: string,
        name: string,
        description?: string,
        widgets?: any[]
    ): Promise<IAnalyticsDashboard> {
        try {
            const dashboard = new AnalyticsDashboard({
                userId,
                userRole,
                name,
                description,
                widgets: widgets || [],
                layout: 'grid',
                isDefault: false
            });

            const savedDashboard = await dashboard.save();
            logger.info(`Dashboard created: ${name} for user ${userId}`);

            return savedDashboard;
        } catch (error) {
            logger.error('Error creating dashboard:', error);
            throw error;
        }
    }

    /**
     * Get user dashboards
     */
    async getUserDashboards(userId: string, filters: DashboardFilters = {}): Promise<{ dashboards: IAnalyticsDashboard[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, userRole, isDefault } = filters;
            const skip = (page - 1) * limit;

            const query: any = { userId };

            if (userRole) {
                query.userRole = userRole;
            }

            if (isDefault !== undefined) {
                query.isDefault = isDefault;
            }

            const [dashboards, total] = await Promise.all([
                AnalyticsDashboard.find(query)
                    .sort({ isDefault: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                AnalyticsDashboard.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                dashboards,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching user dashboards:', error);
            throw error;
        }
    }

    /**
     * Update dashboard
     */
    async updateDashboard(dashboardId: string, updates: Partial<IAnalyticsDashboard>, userId: string): Promise<IAnalyticsDashboard> {
        try {
            const dashboard = await AnalyticsDashboard.findById(dashboardId);
            if (!dashboard) {
                throw new Error('Dashboard not found');
            }

            if (dashboard.userId.toString() !== userId) {
                throw new Error('Access denied');
            }

            const updatedDashboard = await AnalyticsDashboard.findByIdAndUpdate(
                dashboardId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!updatedDashboard) {
                throw new Error('Dashboard not found');
            }

            logger.info(`Dashboard updated: ${dashboardId} by ${userId}`);
            return updatedDashboard;
        } catch (error) {
            logger.error('Error updating dashboard:', error);
            throw error;
        }
    }

    // ==================== REPORTING & INSIGHTS ====================

    /**
     * Generate analytics report
     */
    async generateAnalyticsReport(
        type: string,
        scope: string,
        timeRange: string,
        filters?: Record<string, any>
    ): Promise<any> {
        try {
            let reportData: any = {};

            switch (type) {
                case 'platform_overview':
                    reportData = await this.calculatePlatformMetrics();
                    break;
                case 'user_behavior':
                    // Generate user behavior insights
                    reportData = await this.generateUserBehaviorReport(timeRange, filters);
                    break;
                case 'investment_analysis':
                    // Generate investment analysis
                    reportData = await this.generateInvestmentAnalysisReport(timeRange, filters);
                    break;
                case 'campaign_performance':
                    // Generate campaign performance report
                    reportData = await this.generateCampaignPerformanceReport(timeRange, filters);
                    break;
                default:
                    throw new Error(`Unknown report type: ${type}`);
            }

            // Add metadata
            reportData.metadata = {
                generatedAt: new Date(),
                type,
                scope,
                timeRange,
                filters
            };

            return reportData;
        } catch (error) {
            logger.error('Error generating analytics report:', error);
            throw error;
        }
    }

    /**
     * Generate user behavior report
     */
    private async generateUserBehaviorReport(timeRange: string, filters?: Record<string, any>): Promise<any> {
        // Implementation for user behavior analysis
        return {
            totalSessions: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            topPages: [],
            userJourney: []
        };
    }

    /**
     * Generate investment analysis report
     */
    private async generateInvestmentAnalysisReport(timeRange: string, filters?: Record<string, any>): Promise<any> {
        // Implementation for investment analysis
        return {
            totalInvestments: 0,
            averageInvestment: 0,
            investmentTrends: [],
            topInvestors: [],
            sectorBreakdown: []
        };
    }

    /**
     * Generate campaign performance report
     */
    private async generateCampaignPerformanceReport(timeRange: string, filters?: Record<string, any>): Promise<any> {
        // Implementation for campaign performance analysis
        return {
            totalCampaigns: 0,
            successRate: 0,
            averageFunding: 0,
            topCampaigns: [],
            categoryPerformance: []
        };
    }

    // ==================== DATA CLEANUP & MAINTENANCE ====================

    /**
     * Clean up old analytics data
     */
    async cleanupOldData(daysOld: number = 90): Promise<{ deletedEvents: number; deletedMetrics: number }> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const [eventsResult, metricsResult] = await Promise.all([
                AnalyticsEvent.deleteMany({ timestamp: { $lt: cutoffDate } }),
                AnalyticsMetric.deleteMany({ timestamp: { $lt: cutoffDate } })
            ]);

            const deletedEvents = eventsResult.deletedCount || 0;
            const deletedMetrics = metricsResult.deletedCount || 0;

            logger.info(`Cleaned up ${deletedEvents} old events and ${deletedMetrics} old metrics`);
            return { deletedEvents, deletedMetrics };
        } catch (error) {
            logger.error('Error cleaning up old analytics data:', error);
            throw error;
        }
    }

    /**
     * Update analytics cache
     */
    async updateAnalyticsCache(): Promise<{ updated: number; errors: number }> {
        try {
            const analytics = await Analytics.find({ 'cache.isEnabled': true });
            let updated = 0;
            let errors = 0;

            for (const analytic of analytics) {
                try {
                    // Check if cache needs updating
                    const now = new Date();
                    const lastUpdated = analytic.cache.lastUpdated;
                    const ttl = analytic.cache.ttl * 1000; // Convert to milliseconds

                    if (!lastUpdated || (now.getTime() - lastUpdated.getTime()) > ttl) {
                        // Update cache with fresh data
                        // This would typically involve executing the analytics query
                        analytic.cache.lastUpdated = now;
                        analytic.cache.data = {}; // Placeholder for actual data
                        await analytic.save();
                        updated++;
                    }
                } catch (error) {
                    logger.error(`Error updating cache for analytics ${analytic.analyticsId}:`, error);
                    errors++;
                }
            }

            logger.info(`Analytics cache update completed: ${updated} updated, ${errors} errors`);
            return { updated, errors };
        } catch (error) {
            logger.error('Error updating analytics cache:', error);
            throw error;
        }
    }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
