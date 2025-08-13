import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all report routes
router.use(authenticateToken);

// ==================== REPORT RETRIEVAL ====================

/**
 * @route   GET /api/reports
 * @desc    Get reports for the authenticated user
 * @access  Private
 */
router.get('/', ReportController.getUserReports);

/**
 * @route   GET /api/reports/public
 * @desc    Get public reports
 * @access  Public
 */
router.get('/public', ReportController.getPublicReports);

/**
 * @route   GET /api/reports/templates
 * @desc    Get report templates
 * @access  Public
 */
router.get('/templates', ReportController.getReportTemplates);

/**
 * @route   GET /api/reports/:reportId
 * @desc    Get report by ID
 * @access  Private/Public (depending on report visibility)
 */
router.get('/:reportId', ReportController.getReportById);

// ==================== REPORT CREATION ====================

/**
 * @route   POST /api/reports
 * @desc    Create a new report
 * @access  Private
 */
router.post('/', ReportController.createReport);

/**
 * @route   POST /api/reports/automated
 * @desc    Generate automated report
 * @access  Private
 */
router.post('/automated', ReportController.generateAutomatedReport);

// ==================== REPORT MANAGEMENT ====================

/**
 * @route   PUT /api/reports/:reportId
 * @desc    Update report
 * @access  Private
 */
router.put('/:reportId', ReportController.updateReport);

/**
 * @route   POST /api/reports/:reportId/publish
 * @desc    Publish report
 * @access  Private
 */
router.post('/:reportId/publish', ReportController.publishReport);

/**
 * @route   POST /api/reports/:reportId/archive
 * @desc    Archive report
 * @access  Private
 */
router.post('/:reportId/archive', ReportController.archiveReport);

/**
 * @route   DELETE /api/reports/:reportId
 * @desc    Delete report
 * @access  Private
 */
router.delete('/:reportId', ReportController.deleteReport);

export default router;
