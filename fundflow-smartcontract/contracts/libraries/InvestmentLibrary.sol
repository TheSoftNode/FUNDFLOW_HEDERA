// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title InvestmentLibrary
 * @dev Library for investment-related operations and calculations
 * @author FundFlow Team
 */
library InvestmentLibrary {
    using SafeMath for uint256;

    // Constants
    uint256 public constant MIN_INVESTMENT = 0.01 ether; // 0.01 HBAR minimum
    uint256 public constant MAX_INVESTMENT_PER_USER = 10000 ether; // 10k HBAR maximum per user
    uint256 public constant BASIS_POINTS = 10000; // 100% = 10000 basis points
    uint256 public constant MAX_INVESTMENT_PERCENTAGE = 5000; // 50% of campaign goal
    uint256 public constant PLATFORM_FEE_BASIS_POINTS = 250; // 2.5%
    uint256 public constant HIGH_RISK_THRESHOLD = 700; // Risk score threshold
    uint256 public constant ACCREDITED_INVESTOR_MIN = 100 ether; // Minimum for accredited status

    // Enums
    enum InvestmentType {
        HBAR,
        HTS_Token,
        External_Token
    }
    enum RefundReason {
        CampaignFailed,
        CampaignCancelled,
        InvestorRequest,
        Emergency
    }
    enum RiskLevel {
        Low,
        Medium,
        High,
        VeryHigh
    }

    // Events
    event InvestmentProcessed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 grossAmount,
        uint256 netAmount,
        uint256 platformFee
    );
    event InvestmentValidated(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount
    );
    event ROICalculated(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 roi
    );
    event RiskAssessed(address indexed investor, uint256 riskScore);

    // Structs
    struct InvestmentData {
        address investor;
        uint256 amount;
        uint256 timestamp;
        uint256 campaignId;
        bool isActive;
        uint256 expectedReturns;
        uint256 equityTokens;
        uint256 platformFee;
        InvestmentType investmentType;
        bool refunded;
        uint256 refundAmount;
        RefundReason refundReason;
        uint256 actualReturns;
        uint256 vestingPeriod;
        bool isLocked;
    }

    struct InvestorProfile {
        uint256 totalInvested;
        uint256 totalCampaigns;
        uint256 successfulInvestments;
        uint256 averageInvestment;
        uint256 portfolioValue;
        uint256 totalEquityTokens;
        uint256 totalReturns;
        uint256 activeCampaigns;
        uint256 riskScore; // 1-1000
        bool isVerified;
        bool isAccredited;
        uint256 joinDate;
        uint256 lastActivityDate;
        RiskLevel riskTolerance;
    }

    struct InvestmentLimits {
        uint256 minimumInvestment;
        uint256 maximumInvestment;
        uint256 maximumInvestors;
        bool requiresKYC;
        bool requiresAccreditation;
        uint256 maxInvestmentPerUser;
        uint256 cooldownPeriod;
    }

    struct PortfolioMetrics {
        uint256 totalValue;
        uint256 totalInvested;
        uint256 totalReturns;
        uint256 portfolioROI;
        uint256 averageHoldingPeriod;
        uint256 diversificationScore;
        uint256 riskAdjustedReturns;
        uint256 sharpeRatio;
        uint256 volatility;
    }

    /**
     * @dev Validates investment parameters
     * @param amount Investment amount
     * @param campaignTarget Campaign target amount
     * @param currentRaised Current raised amount
     */
    function validateInvestment(
        uint256 amount,
        uint256 campaignTarget,
        uint256 currentRaised
    ) internal pure {
        require(amount >= MIN_INVESTMENT, "Investment too small");
        require(amount <= MAX_INVESTMENT_PER_USER, "Investment too large");
        require(
            currentRaised + amount <= campaignTarget * 2,
            "Would exceed 200% of target"
        );
    }

    /**
     * @dev Calculates platform fee for investment
     * @param amount Investment amount
     * @param feePercent Fee percentage in basis points
     * @return Platform fee amount
     */
    function calculatePlatformFee(
        uint256 amount,
        uint256 feePercent
    ) internal pure returns (uint256) {
        return (amount * feePercent) / BASIS_POINTS;
    }

    /**
     * @dev Calculates net investment after fees
     * @param grossAmount Gross investment amount
     * @param feePercent Fee percentage in basis points
     * @return netAmount Net investment amount and platform fee
     * @return platformFee Platform fee amount
     */
    function calculateNetInvestment(
        uint256 grossAmount,
        uint256 feePercent
    ) internal pure returns (uint256 netAmount, uint256 platformFee) {
        platformFee = calculatePlatformFee(grossAmount, feePercent);
        netAmount = grossAmount - platformFee;
    }

    /**
     * @dev Calculates investor's ownership percentage in campaign
     * @param investorAmount Investor's total investment
     * @param totalRaised Total amount raised in campaign
     * @return Ownership percentage in basis points
     */
    function calculateOwnershipPercentage(
        uint256 investorAmount,
        uint256 totalRaised
    ) internal pure returns (uint256) {
        if (totalRaised == 0) return 0;
        return (investorAmount * BASIS_POINTS) / totalRaised;
    }

    /**
     * @dev Calculates voting power for milestone voting
     * @param investorAmount Investor's investment amount
     * @param totalRaised Total amount raised
     * @param maxVotingPower Maximum voting power limit
     * @return Voting power amount
     */
    function calculateVotingPower(
        uint256 investorAmount,
        uint256 totalRaised,
        uint256 maxVotingPower
    ) internal pure returns (uint256) {
        uint256 votingPower = calculateOwnershipPercentage(
            investorAmount,
            totalRaised
        );
        return votingPower > maxVotingPower ? maxVotingPower : votingPower;
    }

    /**
     * @dev Calculates potential returns based on investment
     * @param investmentAmount Investment amount
     * @param expectedMultiplier Expected return multiplier (in basis points)
     * @return Potential returns amount
     */
    function calculatePotentialReturns(
        uint256 investmentAmount,
        uint256 expectedMultiplier
    ) internal pure returns (uint256) {
        return (investmentAmount * expectedMultiplier) / BASIS_POINTS;
    }

    /**
     * @dev Calculates refund amount for failed campaign
     * @param investorAmount Investor's investment amount
     * @param totalRaised Total amount raised
     * @param availableFunds Available funds for refund
     * @return Refund amount
     */
    function calculateRefundAmount(
        uint256 investorAmount,
        uint256 totalRaised,
        uint256 availableFunds
    ) internal pure returns (uint256) {
        if (totalRaised == 0 || availableFunds >= totalRaised) {
            return investorAmount;
        }
        // Proportional refund if not enough funds available
        return (investorAmount * availableFunds) / totalRaised;
    }

    /**
     * @dev Validates investor eligibility
     * @param investor Investor address
     * @param amount Investment amount
     * @param existingInvestment Existing investment in campaign
     */
    function validateInvestorEligibility(
        address investor,
        uint256 amount,
        uint256 existingInvestment
    ) internal pure {
        require(investor != address(0), "Invalid investor address");
        require(amount > 0, "Investment amount must be positive");
        require(
            existingInvestment + amount <= MAX_INVESTMENT_PER_USER,
            "Would exceed maximum investment per user"
        );
    }

    /**
     * @dev Calculates investment risk score
     * @param campaignAge Age of campaign in days
     * @param fundingProgress Funding progress percentage (0-10000)
     * @param milestonesCompleted Number of completed milestones
     * @param totalMilestones Total number of milestones
     * @return Risk score (0-10000, where 10000 is highest risk)
     */
    function calculateRiskScore(
        uint256 campaignAge,
        uint256 fundingProgress,
        uint256 milestonesCompleted,
        uint256 totalMilestones
    ) internal pure returns (uint256) {
        uint256 ageRisk = campaignAge > 30 ? 2000 : (campaignAge * 66); // Higher risk for older campaigns
        uint256 progressRisk = fundingProgress < 1000
            ? 3000
            : (10000 - fundingProgress) / 2; // Higher risk for low progress
        uint256 milestoneRisk = totalMilestones == 0
            ? 2000
            : ((totalMilestones - milestonesCompleted) * 2000) /
                totalMilestones;

        uint256 totalRisk = ageRisk + progressRisk + milestoneRisk;
        return totalRisk > 10000 ? 10000 : totalRisk;
    }

    /**
     * @dev Updates investor profile with new investment
     * @param profile Current investor profile
     * @param newInvestment New investment amount
     * @return Updated profile
     */
    function updateInvestorProfile(
        InvestorProfile memory profile,
        uint256 newInvestment
    ) internal pure returns (InvestorProfile memory) {
        profile.totalInvested += newInvestment;
        profile.totalCampaigns += 1;
        profile.averageInvestment =
            profile.totalInvested /
            profile.totalCampaigns;
        return profile;
    }
}
