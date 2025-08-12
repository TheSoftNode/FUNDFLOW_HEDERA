// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IFundFlowCore.sol";

/**
 * @title IAnalyticsManager
 * @dev Interface for comprehensive analytics and reporting functionality
 * @author FundFlow Team
 */
interface IAnalyticsManager {
    // Events
    event MetricUpdated(
        string indexed metricName,
        uint256 indexed entityId,
        uint256 value,
        uint256 timestamp
    );

    event AnalyticsReportGenerated(
        uint256 indexed reportId,
        address indexed requester,
        ReportType reportType,
        uint256 timestamp
    );

    event BenchmarkUpdated(
        string indexed category,
        uint256 benchmarkValue,
        uint256 timestamp
    );

    event AlertTriggered(
        uint256 indexed campaignId,
        AlertType alertType,
        uint256 threshold,
        uint256 actualValue
    );

    // Enums
    enum ReportType {
        CampaignPerformance,
        InvestorAnalytics,
        PlatformOverview,
        RiskAssessment,
        ROIAnalysis,
        MarketTrends,
        ComplianceReport
    }

    enum AlertType {
        FundingGoalReached,
        LowFundingVelocity,
        HighRiskDetected,
        MilestoneDelayed,
        UnusualActivity,
        ComplianceViolation
    }

    enum TimeFrame {
        Daily,
        Weekly,
        Monthly,
        Quarterly,
        Yearly,
        AllTime
    }

    // Note: CampaignMetrics struct is defined in IFundFlowCore

    struct InvestorMetrics {
        address investor;
        uint256 totalInvested;
        uint256 portfolioValue;
        uint256 averageROI;
        uint256 investmentCount;
        uint256 successfulInvestments;
        uint256 riskTolerance;
        uint256 diversificationScore;
        uint256 avgHoldingPeriod;
        uint256 referralCount;
        uint256 reputationScore;
        uint256 lastActive;
    }

    struct PlatformMetrics {
        uint256 totalCampaigns;
        uint256 activeCampaigns;
        uint256 successfulCampaigns;
        uint256 totalFundsRaised;
        uint256 totalInvestors;
        uint256 averageCampaignSize;
        uint256 platformFeeCollected;
        uint256 averageROI;
        uint256 defaultRate;
        uint256 userGrowthRate;
        uint256 marketCapture;
        uint256 customerAcquisitionCost;
    }

    struct PerformanceSnapshot {
        uint256 timestamp;
        uint256 value;
        uint256 change;
        uint256 percentageChange;
        bool isPositive;
    }

    struct TrendAnalysis {
        uint256[] dataPoints;
        uint256 trend; // 1 = upward, 2 = downward, 3 = stable
        uint256 volatility;
        uint256 confidence;
        string recommendation;
    }

    struct RiskProfile {
        uint256 marketRisk;
        uint256 liquidityRisk;
        uint256 operationalRisk;
        uint256 creditRisk;
        uint256 overallRisk;
        string[] riskFactors;
        string[] mitigationStrategies;
    }

    // Core Analytics Functions
    function updateCampaignMetrics(uint256 campaignId) external;
    function updateInvestorMetrics(address investor) external;
    function updatePlatformMetrics() external;

    function generateReport(
        ReportType reportType,
        uint256 entityId,
        TimeFrame timeFrame
    ) external returns (uint256 reportId);

    function schedulePeriodicReport(
        ReportType reportType,
        TimeFrame frequency,
        address[] memory recipients
    ) external;

    // Campaign Analytics
    function getCampaignMetrics(
        uint256 campaignId
    ) external view returns (IFundFlowCore.CampaignMetrics memory);

    function getCampaignPerformance(
        uint256 campaignId,
        TimeFrame timeFrame
    ) external view returns (PerformanceSnapshot[] memory);

    function predictCampaignSuccess(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 successProbability,
            uint256 expectedFinalAmount,
            uint256 estimatedCompletion
        );

    function compareCampaignToBenchmark(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 performanceRatio,
            string[] memory strengths,
            string[] memory improvements
        );

    function getCampaignTrends(
        uint256 campaignId,
        string memory metric,
        TimeFrame timeFrame
    ) external view returns (TrendAnalysis memory);

    // Investor Analytics
    function getInvestorMetrics(
        address investor
    ) external view returns (InvestorMetrics memory);

    function getInvestorPerformance(
        address investor,
        TimeFrame timeFrame
    ) external view returns (PerformanceSnapshot[] memory);

    function getInvestorRiskProfile(
        address investor
    ) external view returns (RiskProfile memory);

    function getInvestmentRecommendations(
        address investor
    )
        external
        view
        returns (
            uint256[] memory recommendedCampaigns,
            uint256[] memory confidenceScores,
            string[] memory reasons
        );

    function calculateInvestorDiversification(
        address investor
    )
        external
        view
        returns (
            uint256 diversificationScore,
            string[] memory sectors,
            uint256[] memory allocations
        );

    // Platform Analytics
    function getPlatformMetrics()
        external
        view
        returns (PlatformMetrics memory);

    function getPlatformGrowth(
        TimeFrame timeFrame
    )
        external
        view
        returns (
            uint256 userGrowth,
            uint256 volumeGrowth,
            uint256 revenueGrowth
        );

    function getMarketShare()
        external
        view
        returns (
            uint256 platformShare,
            uint256 totalMarketSize,
            uint256[] memory competitorShares
        );

    function getRevenueForecast(
        TimeFrame timeFrame
    )
        external
        view
        returns (uint256[] memory projectedRevenue, uint256 confidence);

    // Risk & Compliance Analytics
    function calculateRiskScore(
        uint256 campaignId
    ) external view returns (uint256);

    function detectAnomalies(
        uint256 campaignId
    )
        external
        view
        returns (
            bool hasAnomalies,
            string[] memory anomalyTypes,
            uint256[] memory severityScores
        );

    function getComplianceStatus(
        uint256 campaignId
    )
        external
        view
        returns (
            bool isCompliant,
            string[] memory violations,
            string[] memory requirements
        );

    function generateRiskReport(
        uint256 campaignId
    )
        external
        view
        returns (
            RiskProfile memory profile,
            string[] memory recommendations,
            uint256 confidenceLevel
        );

    // Benchmarking & Comparison
    function setBenchmark(string memory category, uint256 value) external;
    function getBenchmark(
        string memory category
    ) external view returns (uint256);

    function compareToIndustry(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 industryRank,
            uint256 percentile,
            string[] memory keyDifferentiators
        );

    function getCohortAnalysis(
        uint256 startDate,
        uint256 endDate,
        TimeFrame granularity
    )
        external
        view
        returns (
            uint256[] memory cohortSizes,
            uint256[] memory retentionRates,
            uint256[] memory lifetimeValues
        );

    // Alert & Monitoring
    function setAlert(
        uint256 campaignId,
        AlertType alertType,
        uint256 threshold,
        address[] memory recipients
    ) external;

    function removeAlert(uint256 campaignId, AlertType alertType) external;

    function getActiveAlerts(
        uint256 campaignId
    )
        external
        view
        returns (
            AlertType[] memory alertTypes,
            uint256[] memory thresholds,
            uint256[] memory currentValues
        );

    function checkAlerts(uint256 campaignId) external;

    // Advanced Analytics
    function predictMarketTrends(
        string memory sector,
        TimeFrame timeFrame
    )
        external
        view
        returns (
            TrendAnalysis memory trends,
            uint256[] memory opportunityScores
        );

    function calculateSentimentScore(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 socialSentiment,
            uint256 investorSentiment,
            uint256 marketSentiment
        );

    function getNetworkEffects(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 viralCoefficient,
            uint256 networkValue,
            address[] memory influencers
        );

    function optimizePortfolio(
        address investor
    )
        external
        view
        returns (
            uint256[] memory recommendedWeights,
            uint256 expectedReturn,
            uint256 riskLevel
        );

    // Data Export & Integration
    function exportData(
        string memory dataType,
        uint256 entityId,
        TimeFrame timeFrame
    ) external view returns (bytes memory data);

    function integrateExternalData(
        string memory dataSource,
        bytes memory data
    ) external;

    function syncWithOracle(address oracleAddress) external;

    // View Functions
    function getHistoricalData(
        uint256 entityId,
        string memory metric,
        uint256 startTime,
        uint256 endTime
    )
        external
        view
        returns (uint256[] memory timestamps, uint256[] memory values);

    function getTopPerformers(
        string memory category,
        uint256 count
    )
        external
        view
        returns (uint256[] memory entityIds, uint256[] memory scores);

    function getAnalyticsConfiguration()
        external
        view
        returns (
            uint256 updateFrequency,
            bool realTimeEnabled,
            address[] memory dataProviders
        );
}
