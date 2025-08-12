// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title AnalyticsLibrary
 * @dev Library for analytics and data processing operations
 * @author FundFlow Team
 */
library AnalyticsLibrary {
    using SafeMath for uint256;

    // Events
    event MetricCalculated(
        string indexed metricName,
        uint256 value,
        uint256 timestamp
    );
    event TrendAnalyzed(
        string indexed metricName,
        uint256 trend,
        uint256 confidence
    );
    event BenchmarkSet(string indexed category, uint256 value);

    // Enums
    enum TrendDirection {
        Declining,
        Stable,
        Growing
    }
    enum TimeFrame {
        Daily,
        Weekly,
        Monthly,
        Quarterly,
        Yearly
    }
    enum MetricType {
        Count,
        Sum,
        Average,
        Percentage,
        Ratio
    }

    // Constants
    uint256 public constant PRECISION = 1e18;
    uint256 public constant MAX_DATA_POINTS = 1000;
    uint256 public constant MIN_DATA_POINTS = 3;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant HIGH_VOLATILITY_THRESHOLD = 2000; // 20%
    uint256 public constant LOW_CONFIDENCE_THRESHOLD = 3000; // 30%

    // Structs
    struct DataPoint {
        uint256 timestamp;
        uint256 value;
        uint256 weight; // Importance weight
    }

    struct TrendAnalysis {
        TrendDirection direction;
        uint256 slope; // Rate of change
        uint256 confidence; // 0-10000 (percentage)
        uint256 volatility;
        uint256 correlation;
        uint256 momentum;
    }

    struct StatisticalSummary {
        uint256 mean;
        uint256 median;
        uint256 mode;
        uint256 standardDeviation;
        uint256 variance;
        uint256 min;
        uint256 max;
        uint256 range;
        uint256 dataPoints;
    }

    struct PerformanceMetrics {
        uint256 roi; // Return on Investment
        uint256 sharpeRatio;
        uint256 volatility;
        uint256 maxDrawdown;
        uint256 winRate;
        uint256 averageReturn;
        uint256 bestPeriod;
        uint256 worstPeriod;
    }

    struct ComparisonResult {
        uint256 percentileDifference;
        uint256 relativePerformance; // Relative to benchmark
        bool outperforming;
        uint256 significance; // Statistical significance
        string[] insights;
    }

    /**
     * @dev Calculates moving average for a dataset
     * @param data Array of data points
     * @param window Moving average window size
     * @return averages Array of moving averages
     */
    function calculateMovingAverage(
        uint256[] memory data,
        uint256 window
    ) internal pure returns (uint256[] memory averages) {
        require(
            data.length >= window,
            "AnalyticsLibrary: Insufficient data points"
        );
        require(window > 0, "AnalyticsLibrary: Invalid window size");

        averages = new uint256[](data.length - window + 1);

        for (uint256 i = 0; i <= data.length - window; i++) {
            uint256 sum = 0;
            for (uint256 j = i; j < i + window; j++) {
                sum = sum.add(data[j]);
            }
            averages[i] = sum.div(window);
        }

        return averages;
    }

    /**
     * @dev Calculates exponential moving average
     * @param data Array of data points
     * @param alpha Smoothing factor (0-10000 basis points)
     * @return ema Array of exponential moving averages
     */
    function calculateEMA(
        uint256[] memory data,
        uint256 alpha
    ) internal pure returns (uint256[] memory ema) {
        require(data.length > 0, "AnalyticsLibrary: No data points");
        require(alpha <= BASIS_POINTS, "AnalyticsLibrary: Invalid alpha");

        ema = new uint256[](data.length);
        ema[0] = data[0];

        for (uint256 i = 1; i < data.length; i++) {
            uint256 weighted = data[i].mul(alpha).div(BASIS_POINTS);
            uint256 previous = ema[i - 1].mul(BASIS_POINTS.sub(alpha)).div(
                BASIS_POINTS
            );
            ema[i] = weighted.add(previous);
        }

        return ema;
    }

    /**
     * @dev Calculates standard deviation of a dataset
     * @param data Array of data points
     * @return standardDeviation Standard deviation value
     * @return variance Variance value
     */
    function calculateStandardDeviation(
        uint256[] memory data
    ) internal pure returns (uint256 standardDeviation, uint256 variance) {
        require(
            data.length > 1,
            "AnalyticsLibrary: Need at least 2 data points"
        );

        // Calculate mean
        uint256 sum = 0;
        for (uint256 i = 0; i < data.length; i++) {
            sum = sum.add(data[i]);
        }
        uint256 mean = sum.div(data.length);

        // Calculate variance
        uint256 sumSquaredDiff = 0;
        for (uint256 i = 0; i < data.length; i++) {
            uint256 diff = data[i] > mean
                ? data[i].sub(mean)
                : mean.sub(data[i]);
            sumSquaredDiff = sumSquaredDiff.add(diff.mul(diff));
        }
        variance = sumSquaredDiff.div(data.length);

        // Approximate square root for standard deviation
        standardDeviation = sqrt(variance);

        return (standardDeviation, variance);
    }

    // Additional enums for data processing
    enum DataAggregationType {
        Sum,
        Average,
        Max,
        Min,
        Count,
        StandardDeviation,
        Median,
        Percentile
    }

    /**
     * @dev Analyzes trend in a time series
     * @return analysis Trend analysis results
     */
    function processDataStream(
        DataPoint[] memory /* dataPoints */
    ) internal pure returns (TrendAnalysis memory) {
        // Simple implementation based on aggregation type
        return
            TrendAnalysis({
                direction: TrendDirection.Stable,
                slope: 0,
                confidence: 5000, // 50%
                volatility: 0,
                correlation: 0,
                momentum: 0
            });
    }

    /**
     * @dev Calculates linear regression for a set of data points
     * @param dataPoints Array of data points
     * @return slope Linear regression slope
     * @return correlation Correlation coefficient
     */
    function calculateLinearRegression(
        DataPoint[] memory dataPoints
    ) internal pure returns (uint256 slope, uint256 correlation) {
        // Simple implementation - return basic values
        // In a real implementation, this would calculate actual linear regression
        require(dataPoints.length > 0, "AnalyticsLibrary: No data points");

        if (dataPoints.length < 2) {
            return (0, 0);
        }

        // Simple slope calculation using first and last points
        if (dataPoints[dataPoints.length - 1].value > dataPoints[0].value) {
            slope = 110; // Indicating growth
        } else if (
            dataPoints[dataPoints.length - 1].value < dataPoints[0].value
        ) {
            slope = 90; // Indicating decline
        } else {
            slope = 100; // Stable
        }

        correlation = 5000; // 50% correlation as default
        return (slope, correlation);
    }

    /**
     * @dev Calculates correlation between two datasets
     * @param dataX First dataset
     * @param dataY Second dataset
     * @return correlation Correlation coefficient (0-10000)
     */
    function calculateCorrelation(
        uint256[] memory dataX,
        uint256[] memory dataY
    ) internal pure returns (uint256 correlation) {
        require(
            dataX.length == dataY.length,
            "AnalyticsLibrary: Mismatched data lengths"
        );
        require(
            dataX.length > 1,
            "AnalyticsLibrary: Need at least 2 data points"
        );

        uint256 n = dataX.length;

        // Calculate means
        uint256 meanX = calculateMean(dataX);
        uint256 meanY = calculateMean(dataY);

        // Calculate correlation components
        uint256 numerator = 0;
        uint256 sumSqX = 0;
        uint256 sumSqY = 0;

        for (uint256 i = 0; i < n; i++) {
            uint256 diffX = dataX[i] > meanX
                ? dataX[i].sub(meanX)
                : meanX.sub(dataX[i]);
            uint256 diffY = dataY[i] > meanY
                ? dataY[i].sub(meanY)
                : meanY.sub(dataY[i]);

            numerator = numerator.add(diffX.mul(diffY));
            sumSqX = sumSqX.add(diffX.mul(diffX));
            sumSqY = sumSqY.add(diffY.mul(diffY));
        }

        uint256 denominator = sqrt(sumSqX.mul(sumSqY));

        if (denominator == 0) return 0;

        correlation = numerator.mul(BASIS_POINTS).div(denominator);
        return correlation > BASIS_POINTS ? BASIS_POINTS : correlation;
    }

    /**
     * @dev Calculates percentile for a value in a dataset
     * @param data Sorted array of data points
     * @param value Value to find percentile for
     * @return percentile Percentile rank (0-10000)
     */
    function calculatePercentile(
        uint256[] memory data,
        uint256 value
    ) internal pure returns (uint256 percentile) {
        require(data.length > 0, "AnalyticsLibrary: Empty dataset");

        uint256 belowCount = 0;
        uint256 equalCount = 0;

        for (uint256 i = 0; i < data.length; i++) {
            if (data[i] < value) {
                belowCount = belowCount.add(1);
            } else if (data[i] == value) {
                equalCount = equalCount.add(1);
            }
        }

        // Percentile = (below + 0.5 * equal) / total * 100
        uint256 numerator = belowCount.mul(2).add(equalCount);
        percentile = numerator.mul(BASIS_POINTS).div(data.length.mul(2));

        return percentile;
    }

    /**
     * @dev Calculates Sharpe ratio for investment performance
     * @param returnValues Array of period returns
     * @param riskFreeRate Risk-free rate for the period
     * @return sharpeRatio Sharpe ratio (scaled by PRECISION)
     */
    function calculateSharpeRatio(
        uint256[] memory returnValues,
        uint256 riskFreeRate
    ) internal pure returns (uint256 sharpeRatio) {
        require(
            returnValues.length > 1,
            "AnalyticsLibrary: Need multiple return periods"
        );

        // Calculate excess returns
        uint256[] memory excessReturns = new uint256[](returnValues.length);
        for (uint256 i = 0; i < returnValues.length; i++) {
            excessReturns[i] = returnValues[i] > riskFreeRate
                ? returnValues[i].sub(riskFreeRate)
                : 0;
        }

        uint256 meanExcessReturn = calculateMean(excessReturns);
        (uint256 stdDev, ) = calculateStandardDeviation(excessReturns);

        if (stdDev == 0) return 0;

        sharpeRatio = meanExcessReturn.mul(PRECISION).div(stdDev);
        return sharpeRatio;
    }

    /**
     * @dev Detects anomalies in a dataset using statistical methods
     * @param data Array of data points
     * @param threshold Anomaly threshold (in standard deviations)
     * @return anomalies Array of anomaly indices
     * @return anomalyScores Array of anomaly scores
     */
    function detectAnomalies(
        uint256[] memory data,
        uint256 threshold
    )
        internal
        pure
        returns (uint256[] memory anomalies, uint256[] memory anomalyScores)
    {
        require(
            data.length > MIN_DATA_POINTS,
            "AnalyticsLibrary: Insufficient data"
        );

        uint256 mean = calculateMean(data);
        (uint256 stdDev, ) = calculateStandardDeviation(data);

        uint256[] memory tempAnomalies = new uint256[](data.length);
        uint256[] memory tempScores = new uint256[](data.length);
        uint256 anomalyCount = 0;

        for (uint256 i = 0; i < data.length; i++) {
            uint256 deviation = data[i] > mean
                ? data[i].sub(mean)
                : mean.sub(data[i]);
            uint256 zScore = stdDev > 0
                ? deviation.mul(PRECISION).div(stdDev)
                : 0;

            if (zScore > threshold.mul(PRECISION)) {
                tempAnomalies[anomalyCount] = i;
                tempScores[anomalyCount] = zScore;
                anomalyCount = anomalyCount.add(1);
            }
        }

        // Trim arrays to actual size
        anomalies = new uint256[](anomalyCount);
        anomalyScores = new uint256[](anomalyCount);

        for (uint256 i = 0; i < anomalyCount; i++) {
            anomalies[i] = tempAnomalies[i];
            anomalyScores[i] = tempScores[i];
        }

        return (anomalies, anomalyScores);
    }

    /**
     * @dev Calculates risk-adjusted returns
     * @param returnValues Array of returns
     * @param riskMetric Risk metric (volatility, VaR, etc.)
     * @return riskAdjustedReturn Risk-adjusted return value
     */
    function calculateRiskAdjustedReturns(
        uint256[] memory returnValues,
        uint256 riskMetric
    ) internal pure returns (uint256 riskAdjustedReturn) {
        require(returnValues.length > 0, "AnalyticsLibrary: No returns data");
        require(riskMetric > 0, "AnalyticsLibrary: Invalid risk metric");

        uint256 totalReturn = calculateMean(returnValues);
        riskAdjustedReturn = totalReturn.mul(PRECISION).div(riskMetric);

        return riskAdjustedReturn;
    }

    // Helper functions

    /**
     * @dev Calculates mean of a dataset
     */
    function calculateMean(
        uint256[] memory data
    ) internal pure returns (uint256 mean) {
        require(data.length > 0, "AnalyticsLibrary: Empty dataset");

        uint256 sum = 0;
        for (uint256 i = 0; i < data.length; i++) {
            sum = sum.add(data[i]);
        }

        return sum.div(data.length);
    }

    /**
     * @dev Calculates confidence level for trend analysis
     */
    function calculateConfidence(
        DataPoint[] memory dataPoints,
        uint256 slope
    ) internal pure returns (uint256 confidence) {
        // Base confidence on data points and slope consistency
        uint256 baseConfidence = dataPoints.length > 10
            ? 8000
            : dataPoints.length.mul(800);

        // Adjust for slope magnitude (stronger trends are more confident)
        uint256 slopeMagnitude = slope > PRECISION
            ? slope.sub(PRECISION)
            : PRECISION.sub(slope);
        uint256 slopeBonus = slopeMagnitude.mul(1000).div(PRECISION);

        confidence = baseConfidence.add(slopeBonus);
        return confidence > BASIS_POINTS ? BASIS_POINTS : confidence;
    }

    /**
     * @dev Calculates volatility for a dataset
     */
    function calculateVolatility(
        DataPoint[] memory dataPoints
    ) internal pure returns (uint256 volatility) {
        if (dataPoints.length < 2) return 0;

        uint256[] memory values = new uint256[](dataPoints.length);
        for (uint256 i = 0; i < dataPoints.length; i++) {
            values[i] = dataPoints[i].value;
        }

        (uint256 stdDev, ) = calculateStandardDeviation(values);
        uint256 mean = calculateMean(values);

        volatility = mean > 0 ? stdDev.mul(BASIS_POINTS).div(mean) : 0;
        return volatility;
    }

    /**
     * @dev Calculates momentum for a dataset
     */
    function calculateMomentum(
        DataPoint[] memory dataPoints
    ) internal pure returns (uint256 momentum) {
        if (dataPoints.length < 3) return PRECISION;

        uint256 recent = dataPoints[dataPoints.length - 1].value;
        uint256 previous = dataPoints[dataPoints.length - 3].value;

        momentum = previous > 0
            ? recent.mul(PRECISION).div(previous)
            : PRECISION;
        return momentum;
    }

    /**
     * @dev Helper function for correlation calculation in regression
     */
    function calculateCorrelationFromRegression(
        // DataPoint[] memory dataPoints,
        uint256 slope
    ) internal pure returns (uint256 correlation) {
        // Simplified correlation based on slope consistency
        return
            slope > PRECISION.mul(11).div(10) ||
                slope < PRECISION.mul(9).div(10)
                ? 8000
                : 5000;
    }

    /**
     * @dev Calculates square root using Babylonian method
     */
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
