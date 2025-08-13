import Report, { IReport } from '../models/Report';
import User from '../models/User';
import Campaign from '../models/Campaign';
import Investment from '../models/Investment';
import Milestone from '../models/Milestone';
import { logger } from '../utils/logger';
import { smartContractIntegration } from './SmartContractIntegrationService';

export interface CreateReportData {
    title: string;
    description: string;
    reportType: 'performance' | 'financial' | 'milestone' | 'tax' | 'due-diligence' | 'compliance' | 'analytics';
    category: 'investor' | 'startup' | 'campaign' | 'platform' | 'regulatory';
    ownerId: string;
    ownerType: 'investor' | 'startup' | 'admin';
    isPublic?: boolean;
    accessList?: string[];
    campaignId?: string;
    investmentId?: string;
    milestoneId?: string;
    content?: {
        sections: Array<{
            title: string;
            content: string;
            data?: any;
            charts?: Array<{
                type: string;
                data: any;
                options?: any;
            }>;
        }>;
        summary: string;
        keyMetrics: Record<string, any>;
        recommendations?: string[];
    };
    generationSettings?: {
        frequency: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
        autoGenerate?: boolean;
        template?: string;
    };
    tags?: string[];
}

export interface ReportFilters {
    page?: number;
    limit?: number;
    reportType?: string;
    category?: string;
    status?: string;
    ownerId?: string;
    isPublic?: boolean;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
}

export interface ReportGenerationOptions {
    includeCharts?: boolean;
    includeRecommendations?: boolean;
    timeRange?: string;
    format?: 'json' | 'pdf' | 'csv';
}

export class ReportService {
    constructor() {
        logger.info('ReportService initialized');
    }

    // ==================== REPORT CREATION ====================

    /**
     * Create a new report
     */
    async createReport(data: CreateReportData): Promise<IReport> {
        try {
            // Validate owner exists
            const owner = await User.findById(data.ownerId);
            if (!owner) {
                throw new Error('Report owner not found');
            }

            // Generate unique report ID
            const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const report = new Report({
                ...data,
                reportId,
                status: 'draft',
                version: '1.0.0',
                tags: data.tags || [],
                content: data.content || {
                    sections: [],
                    summary: '',
                    keyMetrics: {}
                },
                generationSettings: {
                    frequency: 'one-time',
                    autoGenerate: false,
                    ...data.generationSettings
                }
            });

            const savedReport = await report.save();
            logger.info(`Report created: ${reportId} by ${data.ownerId}`);

            return savedReport;
        } catch (error) {
            logger.error('Error creating report:', error);
            throw error;
        }
    }

    /**
     * Generate report content automatically
     */
    async generateReportContent(reportId: string, options: ReportGenerationOptions = {}): Promise<IReport> {
        try {
            const report = await Report.findById(reportId);
            if (!report) {
                throw new Error('Report not found');
            }

            // Generate content based on report type
            const content = await this.generateContentByType(report, options);

            report.content = content;
            report.status = 'generated';
            report.generatedAt = new Date();

            if (report.generationSettings.frequency !== 'one-time') {
                report.generationSettings.lastGenerated = new Date();
                // Calculate next generation date
                const nextDate = this.calculateNextGenerationDate(report.generationSettings.frequency);
                report.generationSettings.nextGeneration = nextDate;
            }

            const updatedReport = await report.save();
            logger.info(`Report content generated: ${reportId}`);

            return updatedReport;
        } catch (error) {
            logger.error('Error generating report content:', error);
            throw error;
        }
    }

    /**
     * Generate performance report for investor
     */
    async generateInvestorPerformanceReport(
        investorId: string,
        timeRange: string = '1y'
    ): Promise<IReport> {
        try {
            const investor = await User.findById(investorId);
            if (!investor || investor.role !== 'investor') {
                throw new Error('Investor not found');
            }

            // Get investment data
            const investments = await Investment.find({ investorAddress: investor.walletAddress })
                .populate('campaignId', 'title status category');

            // Calculate performance metrics
            const metrics = await this.calculateInvestmentMetrics(investments, timeRange);

            const reportData: CreateReportData = {
                title: `Investment Performance Report - ${investor.profile.name}`,
                description: `Comprehensive performance analysis for ${investor.profile.name}`,
                reportType: 'performance',
                category: 'investor',
                ownerId: investorId,
                ownerType: 'investor',
                isPublic: false,
                content: {
                    sections: [
                        {
                            title: 'Portfolio Overview',
                            content: `Portfolio performance analysis for ${timeRange}`,
                            data: metrics.overview
                        },
                        {
                            title: 'Investment Breakdown',
                            content: 'Detailed breakdown by campaign and category',
                            data: metrics.breakdown
                        },
                        {
                            title: 'Performance Metrics',
                            content: 'Key performance indicators and returns',
                            data: metrics.performance
                        }
                    ],
                    summary: `Portfolio shows ${metrics.overview.totalReturn > 0 ? 'positive' : 'negative'} performance with ${Math.abs(metrics.overview.totalReturn).toFixed(2)}% return over ${timeRange}`,
                    keyMetrics: metrics.overview,
                    recommendations: metrics.recommendations
                },
                generationSettings: {
                    frequency: 'monthly',
                    autoGenerate: true
                }
            };

            const report = await this.createReport(reportData);
            return await this.generateReportContent(report._id.toString(), { includeCharts: true });
        } catch (error) {
            logger.error('Error generating investor performance report:', error);
            throw error;
        }
    }

    /**
     * Generate campaign report for startup
     */
    async generateCampaignReport(
        campaignId: string,
        startupId: string
    ): Promise<IReport> {
        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                throw new Error('Campaign not found');
            }

            const startup = await User.findById(startupId);
            if (!startup || startup.role !== 'startup') {
                throw new Error('Startup not found');
            }

            // Get campaign data
            const investments = await Investment.find({ campaignId });
            const milestones = await Milestone.find({ campaignId });

            // Calculate campaign metrics
            const metrics = await this.calculateCampaignMetrics(campaign, investments, milestones);

            const reportData: CreateReportData = {
                title: `Campaign Report - ${campaign.title}`,
                description: `Comprehensive analysis of campaign performance and progress`,
                reportType: 'campaign',
                category: 'startup',
                ownerId: startupId,
                ownerType: 'startup',
                isPublic: false,
                campaignId: campaignId,
                content: {
                    sections: [
                        {
                            title: 'Campaign Overview',
                            content: 'Campaign status and key metrics',
                            data: metrics.overview
                        },
                        {
                            title: 'Investment Analysis',
                            content: 'Investment patterns and investor insights',
                            data: metrics.investments
                        },
                        {
                            title: 'Milestone Progress',
                            content: 'Milestone completion and fund release status',
                            data: metrics.milestones
                        }
                    ],
                    summary: `Campaign has raised ${metrics.overview.totalRaised} HBAR with ${metrics.overview.investorCount} investors`,
                    keyMetrics: metrics.overview,
                    recommendations: metrics.recommendations
                },
                generationSettings: {
                    frequency: 'weekly',
                    autoGenerate: true
                }
            };

            const report = await this.createReport(reportData);
            return await this.generateReportContent(report._id.toString(), { includeCharts: true });
        } catch (error) {
            logger.error('Error generating campaign report:', error);
            throw error;
        }
    }

    // ==================== REPORT RETRIEVAL ====================

    /**
     * Get reports with filters
     */
    async getReports(filters: ReportFilters = {}): Promise<{ reports: IReport[]; total: number; page: number; totalPages: number }> {
        try {
            const { page = 1, limit = 20, reportType, category, status, ownerId, isPublic, tags, startDate, endDate } = filters;
            const skip = (page - 1) * limit;

            const query: any = {};

            if (reportType) {
                query.reportType = reportType;
            }

            if (category) {
                query.category = category;
            }

            if (status) {
                query.status = status;
            }

            if (ownerId) {
                query.ownerId = ownerId;
            }

            if (isPublic !== undefined) {
                query.isPublic = isPublic;
            }

            if (tags && tags.length > 0) {
                query.tags = { $in: tags };
            }

            if (startDate || endDate) {
                query.createdAt = {};
                if (startDate) query.createdAt.$gte = startDate;
                if (endDate) query.createdAt.$lte = endDate;
            }

            const [reports, total] = await Promise.all([
                Report.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('ownerId', 'profile.name role')
                    .populate('campaignId', 'title status')
                    .populate('investmentId', 'amount status')
                    .populate('milestoneId', 'title status'),
                Report.countDocuments(query)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                reports,
                total,
                page,
                totalPages
            };
        } catch (error) {
            logger.error('Error fetching reports:', error);
            throw error;
        }
    }

    /**
     * Get report by ID
     */
    async getReportById(reportId: string): Promise<IReport | null> {
        try {
            const report = await Report.findById(reportId)
                .populate('ownerId', 'profile.name role')
                .populate('campaignId', 'title status')
                .populate('investmentId', 'amount status')
                .populate('milestoneId', 'title status')
                .populate('accessList', 'profile.name role');

            return report;
        } catch (error) {
            logger.error('Error fetching report by ID:', error);
            throw error;
        }
    }

    /**
     * Get reports by owner
     */
    async getReportsByOwner(ownerId: string, filters: ReportFilters = {}): Promise<{ reports: IReport[]; total: number; page: number; totalPages: number }> {
        return this.getReports({ ...filters, ownerId });
    }

    /**
     * Get public reports
     */
    async getPublicReports(filters: ReportFilters = {}): Promise<{ reports: IReport[]; total: number; page: number; totalPages: number }> {
        return this.getReports({ ...filters, isPublic: true });
    }

    // ==================== REPORT MANAGEMENT ====================

    /**
     * Update report
     */
    async updateReport(reportId: string, updates: Partial<IReport>): Promise<IReport> {
        try {
            const report = await Report.findByIdAndUpdate(
                reportId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            );

            if (!report) {
                throw new Error('Report not found');
            }

            logger.info(`Report updated: ${reportId}`);
            return report;
        } catch (error) {
            logger.error('Error updating report:', error);
            throw error;
        }
    }

    /**
     * Publish report
     */
    async publishReport(reportId: string): Promise<IReport> {
        try {
            const report = await Report.findById(reportId);
            if (!report) {
                throw new Error('Report not found');
            }

            if (report.status !== 'generated') {
                throw new Error('Only generated reports can be published');
            }

            const updatedReport = await report.publish();
            logger.info(`Report published: ${reportId}`);

            return updatedReport;
        } catch (error) {
            logger.error('Error publishing report:', error);
            throw error;
        }
    }

    /**
     * Archive report
     */
    async archiveReport(reportId: string): Promise<IReport> {
        try {
            const report = await Report.findById(reportId);
            if (!report) {
                throw new Error('Report not found');
            }

            const updatedReport = await report.archive();
            logger.info(`Report archived: ${reportId}`);

            return updatedReport;
        } catch (error) {
            logger.error('Error archiving report:', error);
            throw error;
        }
    }

    /**
     * Delete report
     */
    async deleteReport(reportId: string, ownerId: string): Promise<boolean> {
        try {
            const report = await Report.findById(reportId);
            if (!report) {
                throw new Error('Report not found');
            }

            if (report.ownerId.toString() !== ownerId) {
                throw new Error('Access denied');
            }

            await Report.findByIdAndDelete(reportId);
            logger.info(`Report deleted: ${reportId}`);

            return true;
        } catch (error) {
            logger.error('Error deleting report:', error);
            throw error;
        }
    }

    // ==================== REPORT TEMPLATES ====================

    /**
     * Get report templates
     */
    async getReportTemplates(): Promise<Array<{ id: string; name: string; description: string; type: string; category: string }>> {
        return [
            {
                id: 'investor_performance',
                name: 'Investor Performance Report',
                description: 'Comprehensive investment performance analysis',
                type: 'performance',
                category: 'investor'
            },
            {
                id: 'campaign_summary',
                name: 'Campaign Summary Report',
                description: 'Campaign overview and progress tracking',
                type: 'campaign',
                category: 'startup'
            },
            {
                id: 'milestone_progress',
                name: 'Milestone Progress Report',
                description: 'Milestone completion and fund release status',
                type: 'milestone',
                category: 'startup'
            },
            {
                id: 'financial_summary',
                name: 'Financial Summary Report',
                description: 'Financial overview and cash flow analysis',
                type: 'financial',
                category: 'startup'
            }
        ];
    }

    // ==================== AUTOMATED REPORT GENERATION ====================

    /**
     * Process automated report generation
     */
    async processAutomatedReports(): Promise<{ generated: number; errors: number }> {
        try {
            const now = new Date();
            const reports = await Report.find({
                'generationSettings.autoGenerate': true,
                'generationSettings.nextGeneration': { $lte: now }
            });

            let generated = 0;
            let errors = 0;

            for (const report of reports) {
                try {
                    await this.generateReportContent(report._id.toString());
                    generated++;
                } catch (error) {
                    logger.error(`Error generating automated report ${report.reportId}:`, error);
                    errors++;
                }
            }

            logger.info(`Automated report generation completed: ${generated} generated, ${errors} errors`);
            return { generated, errors };
        } catch (error) {
            logger.error('Error processing automated reports:', error);
            throw error;
        }
    }

    // ==================== PRIVATE HELPER METHODS ====================

    /**
     * Generate content based on report type
     */
    private async generateContentByType(report: IReport, options: ReportGenerationOptions): Promise<any> {
        switch (report.reportType) {
            case 'performance':
                return await this.generatePerformanceContent(report, options);
            case 'campaign':
                return await this.generateCampaignContent(report, options);
            case 'financial':
                return await this.generateFinancialContent(report, options);
            default:
                return report.content;
        }
    }

    /**
     * Generate performance report content
     */
    private async generatePerformanceContent(report: IReport, options: ReportGenerationOptions): Promise<any> {
        // Implementation for performance content generation
        return {
            sections: [
                {
                    title: 'Performance Overview',
                    content: 'Performance analysis and insights',
                    data: {}
                }
            ],
            summary: 'Performance report generated successfully',
            keyMetrics: {},
            recommendations: []
        };
    }

    /**
     * Generate campaign report content
     */
    private async generateCampaignContent(report: IReport, options: ReportGenerationOptions): Promise<any> {
        // Implementation for campaign content generation
        return {
            sections: [
                {
                    title: 'Campaign Overview',
                    content: 'Campaign analysis and insights',
                    data: {}
                }
            ],
            summary: 'Campaign report generated successfully',
            keyMetrics: {},
            recommendations: []
        };
    }

    /**
     * Generate financial report content
     */
    private async generateFinancialContent(report: IReport, options: ReportGenerationOptions): Promise<any> {
        // Implementation for financial content generation
        return {
            sections: [
                {
                    title: 'Financial Overview',
                    content: 'Financial analysis and insights',
                    data: {}
                }
            ],
            summary: 'Financial report generated successfully',
            keyMetrics: {},
            recommendations: []
        };
    }

    /**
     * Calculate investment metrics
     */
    private async calculateInvestmentMetrics(investments: any[], timeRange: string): Promise<any> {
        // Implementation for calculating investment metrics
        return {
            overview: {
                totalInvested: 0,
                totalReturn: 0,
                activeInvestments: 0
            },
            breakdown: {},
            performance: {},
            recommendations: []
        };
    }

    /**
     * Calculate campaign metrics
     */
    private async calculateCampaignMetrics(campaign: any, investments: any[], milestones: any[]): Promise<any> {
        // Implementation for calculating campaign metrics
        return {
            overview: {
                totalRaised: 0,
                investorCount: 0,
                progress: 0
            },
            investments: {},
            milestones: {},
            recommendations: []
        };
    }

    /**
     * Calculate next generation date
     */
    private calculateNextGenerationDate(frequency: string): Date {
        const nextDate = new Date();

        switch (frequency) {
            case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'quarterly':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }

        return nextDate;
    }
}

export const reportService = new ReportService();
export default reportService;
