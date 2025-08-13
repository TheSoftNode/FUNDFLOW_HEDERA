import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

const reportService = new ReportService();

export class ReportController {
    /**
     * Get reports for the authenticated user
     */
    static async getUserReports(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { page = 1, limit = 10, reportType, category, status } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                reportType: reportType as string,
                category: category as string,
                status: status as string
            };

            const reports = await reportService.getReportsByOwner(userId, filters);
            return ApiResponse.success(res, 'Reports retrieved successfully', reports);
        } catch (error) {
            logger.error('Error getting user reports:', error);
            return ApiResponse.error(res, 'Failed to retrieve reports', 500);
        }
    }

    /**
     * Get public reports
     */
    static async getPublicReports(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, reportType, category } = req.query;

            const filters = {
                page: Number(page),
                limit: Number(limit),
                reportType: reportType as string,
                category: category as string
            };

            const reports = await reportService.getPublicReports(filters);
            return ApiResponse.success(res, 'Public reports retrieved successfully', reports);
        } catch (error) {
            logger.error('Error getting public reports:', error);
            return ApiResponse.error(res, 'Failed to retrieve public reports', 500);
        }
    }

    /**
     * Get report by ID
     */
    static async getReportById(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            const userId = (req as any).user?.id;

            const report = await reportService.getReportById(reportId);
            if (!report) {
                return ApiResponse.error(res, 'Report not found', 404);
            }

            // Check if user has access to this report
            if (!report.isPublic && report.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            return ApiResponse.success(res, 'Report retrieved successfully', report);
        } catch (error) {
            logger.error('Error getting report by ID:', error);
            return ApiResponse.error(res, 'Failed to retrieve report', 500);
        }
    }

    /**
     * Create a new report
     */
    static async createReport(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const {
                title,
                description,
                reportType,
                category,
                isPublic = false,
                campaignId,
                investmentId,
                milestoneId,
                content,
                tags = []
            } = req.body;

            if (!title || !description || !reportType || !category) {
                return ApiResponse.error(res, 'Title, description, report type, and category are required', 400);
            }

            const reportData = {
                title,
                description,
                reportType,
                category,
                ownerId: userId,
                ownerType: 'user',
                isPublic,
                campaignId,
                investmentId,
                milestoneId,
                content,
                tags
            };

            const report = await reportService.createReport(reportData);
            return ApiResponse.success(res, 'Report created successfully', report, 201);
        } catch (error) {
            logger.error('Error creating report:', error);
            return ApiResponse.error(res, 'Failed to create report', 500);
        }
    }

    /**
     * Update report
     */
    static async updateReport(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const report = await reportService.getReportById(reportId);
            if (!report) {
                return ApiResponse.error(res, 'Report not found', 404);
            }

            // Check if user owns this report
            if (report.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const updateData = req.body;
            const updatedReport = await reportService.updateReport(reportId, updateData);
            return ApiResponse.success(res, 'Report updated successfully', updatedReport);
        } catch (error) {
            logger.error('Error updating report:', error);
            return ApiResponse.error(res, 'Failed to update report', 500);
        }
    }

    /**
     * Publish report
     */
    static async publishReport(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const report = await reportService.getReportById(reportId);
            if (!report) {
                return ApiResponse.error(res, 'Report not found', 404);
            }

            // Check if user owns this report
            if (report.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const publishedReport = await reportService.publishReport(reportId);
            return ApiResponse.success(res, 'Report published successfully', publishedReport);
        } catch (error) {
            logger.error('Error publishing report:', error);
            return ApiResponse.error(res, 'Failed to publish report', 500);
        }
    }

    /**
     * Archive report
     */
    static async archiveReport(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const report = await reportService.getReportById(reportId);
            if (!report) {
                return ApiResponse.error(res, 'Report not found', 404);
            }

            // Check if user owns this report
            if (report.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            const archivedReport = await reportService.archiveReport(reportId);
            return ApiResponse.success(res, 'Report archived successfully', archivedReport);
        } catch (error) {
            logger.error('Error archiving report:', error);
            return ApiResponse.error(res, 'Failed to archive report', 500);
        }
    }

    /**
     * Delete report
     */
    static async deleteReport(req: Request, res: Response) {
        try {
            const { reportId } = req.params;
            const userId = (req as any).user?.id;

            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const report = await reportService.getReportById(reportId);
            if (!report) {
                return ApiResponse.error(res, 'Report not found', 404);
            }

            // Check if user owns this report
            if (report.ownerId.toString() !== userId) {
                return ApiResponse.error(res, 'Access denied', 403);
            }

            await reportService.deleteReport(reportId);
            return ApiResponse.success(res, 'Report deleted successfully');
        } catch (error) {
            logger.error('Error deleting report:', error);
            return ApiResponse.error(res, 'Failed to delete report', 500);
        }
    }

    /**
     * Get report templates
     */
    static async getReportTemplates(req: Request, res: Response) {
        try {
            const { reportType, category } = req.query;

            const filters = {
                reportType: reportType as string,
                category: category as string
            };

            const templates = await reportService.getReportTemplates(filters);
            return ApiResponse.success(res, 'Report templates retrieved successfully', templates);
        } catch (error) {
            logger.error('Error getting report templates:', error);
            return ApiResponse.error(res, 'Failed to retrieve report templates', 500);
        }
    }

    /**
     * Generate automated report
     */
    static async generateAutomatedReport(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            if (!userId) {
                return ApiResponse.error(res, 'User not authenticated', 401);
            }

            const { reportType, category, campaignId, investmentId, milestoneId } = req.body;

            if (!reportType || !category) {
                return ApiResponse.error(res, 'Report type and category are required', 400);
            }

            const report = await reportService.processAutomatedReports({
                reportType,
                category,
                ownerId: userId,
                campaignId,
                investmentId,
                milestoneId
            });

            return ApiResponse.success(res, 'Automated report generated successfully', report, 201);
        } catch (error) {
            logger.error('Error generating automated report:', error);
            return ApiResponse.error(res, 'Failed to generate automated report', 500);
        }
    }
}
