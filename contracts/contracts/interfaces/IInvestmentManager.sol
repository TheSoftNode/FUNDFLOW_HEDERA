// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IFundFlowCore.sol";

/**
 * @title IInvestmentManager
 * @dev Interface for comprehensive investment processing and portfolio management
 * @author FundFlow Team
 */
interface IInvestmentManager {
    // Events
    event InvestmentProcessed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        uint256 platformFee,
        uint256 equityTokens,
        uint256 timestamp
    );

    event RefundProcessed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        string reason
    );

    event EquityDistributed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 tokens,
        uint256 percentage
    );

    event DividendDistributed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        uint256 period
    );

    event InvestmentLimitSet(
        uint256 indexed campaignId,
        uint256 minAmount,
        uint256 maxAmount
    );

    // Note: InvestmentType enum and structs are defined in IFundFlowCore

    // Note: Investment struct is defined in IFundFlowCore

    struct InvestorProfile {
        uint256 totalInvested;
        uint256 totalEquityTokens;
        uint256 totalReturns;
        uint256 activeCampaigns;
        uint256 successfulInvestments;
        uint256 riskScore; // 1-100, calculated based on investment history
        bool isVerified;
        bool isAccredited;
    }

    struct InvestmentLimits {
        uint256 minimumInvestment;
        uint256 maximumInvestment;
        uint256 maximumInvestors;
        bool requiresKYC;
        bool requiresAccreditation;
    }

    struct PortfolioMetrics {
        uint256 totalValue;
        uint256 totalInvested;
        uint256 totalReturns;
        uint256 portfolioROI;
        uint256 averageHoldingPeriod;
        uint256 diversificationScore;
        uint256 riskAdjustedReturns;
    }

    // Core Investment Functions
    function processInvestment(
        uint256 campaignId,
        address investor,
        uint256 amount,
        IFundFlowCore.InvestmentType investmentType
    ) external payable returns (bool success, uint256 equityTokens);

    function processRefund(
        uint256 campaignId,
        address investor,
        IFundFlowCore.RefundReason reason
    ) external returns (uint256 refundAmount);

    function distributeEquityTokens(
        uint256 campaignId,
        address investor,
        uint256 tokens
    ) external;

    function distributeDividends(
        uint256 campaignId,
        uint256 totalDividends
    ) external;

    function batchProcessInvestments(
        uint256[] memory campaignIds,
        address[] memory investors,
        uint256[] memory amounts
    ) external;

    // Investment Configuration
    function setInvestmentLimits(
        uint256 campaignId,
        InvestmentLimits memory limits
    ) external;

    function updateMinimumInvestment(
        uint256 campaignId,
        uint256 amount
    ) external;
    function updateMaximumInvestment(
        uint256 campaignId,
        uint256 amount
    ) external;
    function toggleKYCRequirement(uint256 campaignId, bool required) external;

    // Portfolio Management
    function calculateExpectedReturns(
        uint256 campaignId,
        uint256 investmentAmount
    ) external view returns (uint256 expectedReturns, uint256 confidence);

    function calculateRiskScore(
        address investor
    ) external view returns (uint256 riskScore);

    function getPortfolioMetrics(
        address investor
    ) external view returns (PortfolioMetrics memory);

    function getDiversificationAdvice(
        address investor
    )
        external
        view
        returns (
            string[] memory recommendations,
            uint256[] memory suggestedCampaigns
        );

    // View Functions
    function getInvestment(
        uint256 campaignId,
        address investor
    ) external view returns (IFundFlowCore.Investment memory);

    function getInvestorProfile(
        address investor
    ) external view returns (InvestorProfile memory);

    function getInvestmentLimits(
        uint256 campaignId
    ) external view returns (InvestmentLimits memory);

    function getCampaignInvestors(
        uint256 campaignId
    ) external view returns (address[] memory);

    function getInvestmentHistory(
        address investor
    )
        external
        view
        returns (
            uint256[] memory campaignIds,
            IFundFlowCore.Investment[] memory investments
        );

    function calculateEquityPercentage(
        uint256 campaignId,
        address investor
    ) external view returns (uint256 percentage);

    function getPlatformInvestmentStats()
        external
        view
        returns (
            uint256 totalInvestments,
            uint256 totalInvestors,
            uint256 averageInvestment,
            uint256 totalRefunds
        );

    // Emergency Functions
    function emergencyRefundAll(uint256 campaignId) external;
    function freezeInvestments(uint256 campaignId) external;
    function unfreezeInvestments(uint256 campaignId) external;

    // Integration Functions
    function updateExternalTokenPrice(address token, uint256 price) external;
    function addSupportedToken(
        address token,
        string memory name,
        string memory symbol
    ) external;
    function removeSupportedToken(address token) external;
}
