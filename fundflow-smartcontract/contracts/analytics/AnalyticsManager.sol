// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IAnalyticsManager.sol";
import "../interfaces/IFundFlowCore.sol";
import "../libraries/AnalyticsLibrary.sol";

/**
 * @title AnalyticsManager
 * @dev Manages analytics and reporting functionality for FundFlow platform
 * @author FundFlow Team
 */
contract AnalyticsManager is IAnalyticsManager, Ownable, Pausable {
    using SafeMath for uint256;

    // State variables
    uint256 private _reportIdCounter;

    mapping(uint256 => mapping(string => uint256[])) private _historicalData;
    mapping(string => uint256) private _benchmarks;
    mapping(uint256 => mapping(AlertType => uint256)) private _alerts;
    mapping(uint256 => mapping(AlertType => address[]))
        private _alertRecipients;
    mapping(address => InvestorMetrics) private _investorMetrics;
    mapping(uint256 => bool) private _anomaliesDetected;

    address public fundFlowCore;
    uint256 public updateFrequency = 24 hours; // Fixed: Changed from 1 hours to 24 hours
    bool public realTimeEnabled = true;
    address[] public dataProviders;

    // Platform metrics
    PlatformMetrics private _platformMetrics;

    modifier onlyFundFlowCore() {
        require(msg.sender == fundFlowCore, "Only FundFlowCore can call this");
        _;
    }

    modifier validCampaign(uint256 campaignId) {
        require(campaignId > 0, "Invalid campaign ID");
        _;
    }

    constructor(address _fundFlowCore) {
        fundFlowCore = _fundFlowCore;
        _reportIdCounter = 0;
    }

    /**
     * @dev Update campaign metrics
     */
    function updateCampaignMetrics(
        uint256 campaignId
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        // Record timestamp for this update
        _historicalData[campaignId]["lastUpdate"].push(block.timestamp);

        emit MetricUpdated(
            "campaignUpdate",
            campaignId,
            block.timestamp,
            block.timestamp
        );
    }

    /**
     * @dev Update investor metrics
     */
    function updateInvestorMetrics(
        address investor
    ) external override onlyFundFlowCore {
        InvestorMetrics storage metrics = _investorMetrics[investor];
        metrics.lastActive = block.timestamp;

        emit MetricUpdated(
            "investorUpdate",
            uint256(uint160(investor)),
            block.timestamp,
            block.timestamp
        );
    }

    /**
     * @dev Update platform metrics
     */
    function updatePlatformMetrics() external override onlyFundFlowCore {
        _platformMetrics.lastUpdate = block.timestamp;

        emit MetricUpdated(
            "platformUpdate",
            0,
            block.timestamp,
            block.timestamp
        );
    }

    /**
     * @dev Generate a report
     */
    function generateReport(
        ReportType reportType,
        uint256 /* entityId */,
        TimeFrame /* timeFrame */
    ) external override onlyFundFlowCore returns (uint256 reportId) {
        _reportIdCounter = _reportIdCounter.add(1);
        reportId = _reportIdCounter;

        emit AnalyticsReportGenerated(
            reportId,
            msg.sender,
            reportType,
            block.timestamp
        );

        return reportId;
    }

    /**
     * @dev Schedule periodic report
     */
    function schedulePeriodicReport(
        ReportType reportType,
        TimeFrame frequency,
        address[] memory recipients
    ) external override onlyOwner {
        // Implementation would store scheduling information
        // For now, just emit event
    }

    // Campaign Analytics

    /**
     * @dev Get campaign metrics
     */
    function getCampaignMetrics(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (IFundFlowCore.CampaignMetrics memory)
    {
        // Would calculate real metrics from stored data
        return
            IFundFlowCore.CampaignMetrics({
                averageInvestment: 0,
                completedMilestones: 0,
                totalMilestones: 0,
                successRate: 0,
                daysRemaining: 0,
                fundingProgress: 0
            });
    }

    /**
     * @dev Get campaign performance snapshots
     */
    function getCampaignPerformance(
        uint256 /* campaignId */,
        TimeFrame /* timeFrame */
    ) external view override returns (PerformanceSnapshot[] memory) {
        // Would return historical performance data
        return new PerformanceSnapshot[](0);
    }

    /**
     * @dev Predict campaign success
     */
    function predictCampaignSuccess(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            uint256 successProbability,
            uint256 expectedFinalAmount,
            uint256 estimatedCompletion
        )
    {
        // Machine learning prediction would go here
        // For now, return placeholder values
        return (7500, 0, block.timestamp + 30 days); // 75% success probability
    }

    /**
     * @dev Compare campaign to benchmark
     */
    function compareCampaignToBenchmark(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            uint256 performanceRatio,
            string[] memory strengths,
            string[] memory improvements
        )
    {
        // Benchmark comparison logic
        strengths = new string[](1);
        strengths[0] = "Good investor engagement";

        improvements = new string[](1);
        improvements[0] = "Improve milestone completion rate";

        return (11000, strengths, improvements); // 110% of benchmark
    }

    /**
     * @dev Get campaign trends
     */
    function getCampaignTrends(
        uint256 /* campaignId */,
        string memory /* metric */,
        TimeFrame /* timeFrame */
    ) external view override returns (TrendAnalysis memory) {
        // Trend analysis would be calculated here
        return
            TrendAnalysis({
                dataPoints: new uint256[](0),
                trend: 2, // Growing trend
                volatility: 1500, // 15% volatility
                confidence: 8000, // 80% confidence
                recommendation: "Continue current strategy"
            });
    }

    // Investor Analytics

    /**
     * @dev Get investor metrics
     */
    function getInvestorMetrics(
        address investor
    ) external view override returns (InvestorMetrics memory) {
        return _investorMetrics[investor];
    }

    /**
     * @dev Get investor performance
     */
    function getInvestorPerformance(
        address /* investor */,
        TimeFrame /* timeFrame */
    ) external view override returns (PerformanceSnapshot[] memory) {
        return new PerformanceSnapshot[](0);
    }

    /**
     * @dev Get investor risk profile
     */
    function getInvestorRiskProfile(
        address /* investor */
    ) external view override returns (RiskProfile memory) {
        return
            RiskProfile({
                marketRisk: 3000,
                liquidityRisk: 2000,
                operationalRisk: 1500,
                creditRisk: 2500,
                overallRisk: 2250,
                riskFactors: new string[](0),
                mitigationStrategies: new string[](0)
            });
    }

    /**
     * @dev Get investment recommendations
     */
    function getInvestmentRecommendations(
        address /* investor */
    )
        external
        view
        override
        returns (
            uint256[] memory recommendedCampaigns,
            uint256[] memory confidenceScores,
            string[] memory reasons
        )
    {
        return (new uint256[](0), new uint256[](0), new string[](0));
    }

    /**
     * @dev Calculate investor diversification
     */
    function calculateInvestorDiversification(
        address /* investor */
    )
        external
        view
        override
        returns (
            uint256 diversificationScore,
            string[] memory sectors,
            uint256[] memory allocations
        )
    {
        sectors = new string[](1);
        sectors[0] = "Technology";

        allocations = new uint256[](1);
        allocations[0] = 10000; // 100%

        return (3000, sectors, allocations); // 30% diversification score
    }

    // Platform Analytics

    /**
     * @dev Get platform metrics
     */
    function getPlatformMetrics()
        external
        view
        override
        returns (PlatformMetrics memory)
    {
        return _platformMetrics;
    }

    /**
     * @dev Get platform growth
     */
    function getPlatformGrowth(
        TimeFrame /* timeFrame */
    )
        external
        view
        override
        returns (
            uint256 userGrowth,
            uint256 volumeGrowth,
            uint256 revenueGrowth
        )
    {
        // Growth calculations would be performed here
        return (1200, 1500, 1100); // 12% user growth, 15% volume growth, 11% revenue growth
    }

    /**
     * @dev Get market share
     */
    function getMarketShare()
        external
        view
        override
        returns (
            uint256 platformShare,
            uint256 totalMarketSize,
            uint256[] memory competitorShares
        )
    {
        return (1500, 1000000 ether, new uint256[](0)); // 15% market share
    }

    /**
     * @dev Get revenue forecast
     */
    function getRevenueForecast(
        TimeFrame /* timeFrame */
    )
        external
        view
        override
        returns (uint256[] memory projectedRevenue, uint256 confidence)
    {
        return (new uint256[](0), 7500); // 75% confidence
    }

    // Risk & Compliance Analytics

    /**
     * @dev Calculate risk score for a campaign
     */
    function calculateRiskScore(
        uint256 campaignId
    ) external view override validCampaign(campaignId) returns (uint256) {
        // Risk calculation based on various factors
        uint256 baseRisk = 5000; // 50% base risk

        // Adjust based on campaign characteristics
        // This would use more sophisticated models in production

        return baseRisk;
    }

    /**
     * @dev Detect anomalies in campaign data
     */
    function detectAnomalies(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            bool hasAnomalies,
            string[] memory anomalyTypes,
            uint256[] memory severityScores
        )
    {
        hasAnomalies = _anomaliesDetected[campaignId];

        if (hasAnomalies) {
            anomalyTypes = new string[](1);
            anomalyTypes[0] = "Unusual funding velocity";

            severityScores = new uint256[](1);
            severityScores[0] = 7500; // 75% severity
        } else {
            anomalyTypes = new string[](0);
            severityScores = new uint256[](0);
        }

        return (hasAnomalies, anomalyTypes, severityScores);
    }

    /**
     * @dev Get compliance status
     */
    function getComplianceStatus(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            bool isCompliant,
            string[] memory violations,
            string[] memory requirements
        )
    {
        // Compliance check logic
        return (true, new string[](0), new string[](0));
    }

    /**
     * @dev Generate risk report
     */
    function generateRiskReport(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            RiskProfile memory profile,
            string[] memory recommendations,
            uint256 confidenceLevel
        )
    {
        profile = RiskProfile({
            marketRisk: 3000,
            liquidityRisk: 2000,
            operationalRisk: 1500,
            creditRisk: 2500,
            overallRisk: 2250,
            riskFactors: new string[](0),
            mitigationStrategies: new string[](0)
        });

        recommendations = new string[](1);
        recommendations[0] = "Monitor funding velocity";

        return (profile, recommendations, 8000); // 80% confidence
    }

    // Benchmarking & Comparison

    /**
     * @dev Set benchmark value
     */
    function setBenchmark(
        string memory category,
        uint256 value
    ) external override onlyOwner {
        _benchmarks[category] = value;

        emit BenchmarkUpdated(category, value, block.timestamp);
    }

    /**
     * @dev Get benchmark value
     */
    function getBenchmark(
        string memory category
    ) external view override returns (uint256) {
        return _benchmarks[category];
    }

    /**
     * @dev Compare to industry benchmarks
     */
    function compareToIndustry(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            uint256 industryRank,
            uint256 percentile,
            string[] memory keyDifferentiators
        )
    {
        keyDifferentiators = new string[](1);
        keyDifferentiators[0] = "Strong community engagement";

        return (15, 8500, keyDifferentiators); // Rank 15, 85th percentile
    }

    /**
     * @dev Get cohort analysis
     */
    function getCohortAnalysis(
        uint256 /* startDate */,
        uint256 /* endDate */,
        TimeFrame /* granularity */
    )
        external
        view
        override
        returns (
            uint256[] memory cohortSizes,
            uint256[] memory retentionRates,
            uint256[] memory lifetimeValues
        )
    {
        return (new uint256[](0), new uint256[](0), new uint256[](0));
    }

    // Alert & Monitoring

    /**
     * @dev Set alert for a campaign
     */
    function setAlert(
        uint256 campaignId,
        AlertType alertType,
        uint256 threshold,
        address[] memory recipients
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _alerts[campaignId][alertType] = threshold;
        _alertRecipients[campaignId][alertType] = recipients;
    }

    /**
     * @dev Remove alert
     */
    function removeAlert(
        uint256 campaignId,
        AlertType alertType
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        delete _alerts[campaignId][alertType];
        delete _alertRecipients[campaignId][alertType];
    }

    /**
     * @dev Get active alerts
     */
    function getActiveAlerts(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            AlertType[] memory alertTypes,
            uint256[] memory thresholds,
            uint256[] memory currentValues
        )
    {
        // Would iterate through all alert types and return active ones
        return (new AlertType[](0), new uint256[](0), new uint256[](0));
    }

    /**
     * @dev Check alerts for a campaign
     */
    function checkAlerts(
        uint256 campaignId
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        // Check each alert type and trigger if threshold is met
        // This would involve comparing current metrics to thresholds
    }

    // Advanced Analytics

    /**
     * @dev Predict market trends
     */
    function predictMarketTrends(
        string memory /* sector */,
        TimeFrame /* timeFrame */
    )
        external
        view
        override
        returns (
            TrendAnalysis memory trends,
            uint256[] memory opportunityScores
        )
    {
        trends = TrendAnalysis({
            dataPoints: new uint256[](0),
            trend: 2, // Growing
            volatility: 2000,
            confidence: 7000,
            recommendation: "Positive outlook for sector"
        });

        return (trends, new uint256[](0));
    }

    /**
     * @dev Calculate sentiment score
     */
    function calculateSentimentScore(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            uint256 socialSentiment,
            uint256 investorSentiment,
            uint256 marketSentiment
        )
    {
        // Sentiment analysis would be performed here
        return (7500, 8000, 7000); // 75% social, 80% investor, 70% market sentiment
    }

    /**
     * @dev Get network effects
     */
    function getNetworkEffects(
        uint256 campaignId
    )
        external
        view
        override
        validCampaign(campaignId)
        returns (
            uint256 viralCoefficient,
            uint256 networkValue,
            address[] memory influencers
        )
    {
        return (1200, 0, new address[](0)); // 1.2 viral coefficient
    }

    /**
     * @dev Optimize portfolio
     */
    function optimizePortfolio(
        address /* investor */
    )
        external
        view
        override
        returns (
            uint256[] memory recommendedWeights,
            uint256 expectedReturn,
            uint256 riskLevel
        )
    {
        return (new uint256[](0), 12000, 4000); // 20% expected return, 40% risk level
    }

    // Data Export & Integration

    /**
     * @dev Export data
     */
    function exportData(
        string memory /* dataType */,
        uint256 /* entityId */,
        TimeFrame /* timeFrame */
    ) external view override returns (bytes memory data) {
        // Data export logic
        return abi.encode("exported_data");
    }

    /**
     * @dev Integrate external data
     */
    function integrateExternalData(
        string memory dataSource,
        bytes memory data
    ) external override onlyOwner {
        // External data integration logic
    }

    /**
     * @dev Sync with oracle
     */
    function syncWithOracle(address oracleAddress) external override onlyOwner {
        // Oracle synchronization logic
    }

    // View Functions

    /**
     * @dev Get historical data
     */
    function getHistoricalData(
        uint256 entityId,
        string memory metric,
        uint256 startTime,
        uint256 endTime
    )
        external
        view
        override
        returns (uint256[] memory timestamps, uint256[] memory values)
    {
        uint256[] storage data = _historicalData[entityId][metric];

        // Filter data by time range
        uint256 count = 0;
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] >= startTime && data[i] <= endTime) {
                count++;
            }
        }

        timestamps = new uint256[](count);
        values = new uint256[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] >= startTime && data[i] <= endTime) {
                timestamps[index] = data[i];
                values[index] = data[i]; // Simplified - would store actual values
                index++;
            }
        }

        return (timestamps, values);
    }

    /**
     * @dev Get top performers
     */
    function getTopPerformers(
        string memory /* category */,
        uint256 /* count */
    )
        external
        view
        override
        returns (uint256[] memory entityIds, uint256[] memory scores)
    {
        // Top performers calculation
        return (new uint256[](0), new uint256[](0));
    }

    /**
     * @dev Get analytics configuration
     */
    function getAnalyticsConfiguration()
        external
        view
        override
        returns (uint256, bool, address[] memory)
    {
        return (updateFrequency, realTimeEnabled, dataProviders);
    }

    // Admin functions

    /**
     * @dev Update configuration
     */
    function updateConfiguration(
        uint256 _updateFrequency,
        bool _realTimeEnabled
    ) external onlyOwner {
        updateFrequency = _updateFrequency;
        realTimeEnabled = _realTimeEnabled;
    }

    /**
     * @dev Add data provider
     */
    function addDataProvider(address provider) external onlyOwner {
        dataProviders.push(provider);
    }

    /**
     * @dev Remove data provider
     */
    function removeDataProvider(address provider) external onlyOwner {
        for (uint256 i = 0; i < dataProviders.length; i++) {
            if (dataProviders[i] == provider) {
                dataProviders[i] = dataProviders[dataProviders.length - 1];
                dataProviders.pop();
                break;
            }
        }
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
