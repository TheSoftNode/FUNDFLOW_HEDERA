import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all analytics routes
router.use(authenticateToken);

// ==================== ANALYTICS RETRIEVAL ====================

/**
 * @route   GET /api/analytics
 * @desc    Get analytics for the authenticated user
 * @access  Private
 */
router.get('/', AnalyticsController.getUserAnalytics);

/**
 * @route   GET /api/analytics/:analyticsId
 * @desc    Get analytics by ID
 * @access  Private
 */
router.get('/:analyticsId', AnalyticsController.getAnalyticsById);

/**
 * @route   GET /api/analytics/metrics/:metricName/history
 * @desc    Get metric history
 * @access  Private
 */
router.get('/metrics/:metricName/history', AnalyticsController.getMetricHistory);

// ==================== ANALYTICS CREATION ====================

/**
 * @route   POST /api/analytics
 * @desc    Create new analytics
 * @access  Private
 */
router.post('/', AnalyticsController.createAnalytics);

/**
 * @route   POST /api/analytics/dashboards
 * @desc    Create analytics dashboard
 * @access  Private
 */
router.post('/dashboards', AnalyticsController.createDashboard);

// ==================== ANALYTICS MANAGEMENT ====================

/**
 * @route   PUT /api/analytics/:analyticsId
 * @desc    Update analytics
 * @access  Private
 */
router.put('/:analyticsId', AnalyticsController.updateAnalytics);

/**
 * @route   DELETE /api/analytics/:analyticsId
 * @desc    Delete analytics
 * @access  Private
 */
router.delete('/:analyticsId', AnalyticsController.deleteAnalytics);

/**
 * @route   PUT /api/analytics/dashboards/:dashboardId
 * @desc    Update dashboard
 * @access  Private
 */
router.put('/dashboards/:dashboardId', AnalyticsController.updateDashboard);

// ==================== DASHBOARD RETRIEVAL ====================

/**
 * @route   GET /api/analytics/dashboards
 * @desc    Get user dashboards
 * @access  Private
 */
router.get('/dashboards', AnalyticsController.getUserDashboards);

// ==================== EVENT TRACKING ====================

/**
 * @route   POST /api/analytics/events
 * @desc    Track user event
 * @access  Private
 */
router.post('/events', AnalyticsController.trackEvent);

/**
 * @route   POST /api/analytics/pageviews
 * @desc    Track page view
 * @access  Private
 */
router.post('/pageviews', AnalyticsController.trackPageView);

/**
 * @route   POST /api/analytics/actions
 * @desc    Track user action
 * @access  Private
 */
router.post('/actions', AnalyticsController.trackUserAction);

/**
 * @route   POST /api/analytics/investments
 * @desc    Track investment action
 * @access  Private
 */
router.post('/investments', AnalyticsController.trackInvestmentAction);

/**
 * @route   POST /api/analytics/metrics
 * @desc    Record metric
 * @access  Private
 */
router.post('/metrics', AnalyticsController.recordMetric);

// ==================== METRICS CALCULATION ====================

/**
 * @route   GET /api/analytics/platform/metrics
 * @desc    Calculate platform metrics
 * @access  Private (Admin only)
 */
router.get('/platform/metrics', AnalyticsController.calculatePlatformMetrics);

/**
 * @route   GET /api/analytics/user/metrics
 * @desc    Calculate user analytics
 * @access  Private
 */
router.get('/user/metrics', AnalyticsController.calculateUserAnalytics);

// ==================== REPORT GENERATION ====================

/**
 * @route   POST /api/analytics/reports
 * @desc    Generate analytics report
 * @access  Private
 */
router.post('/reports', AnalyticsController.generateAnalyticsReport);

export default router;
