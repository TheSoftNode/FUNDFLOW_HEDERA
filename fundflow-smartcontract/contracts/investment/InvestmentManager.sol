// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IInvestmentManager.sol";
import "../interfaces/IFundFlowCore.sol";
import "../libraries/InvestmentLibrary.sol";

/**
 * @title InvestmentManager
 * @dev Manages all investment-related operations for FundFlow platform
 * @author FundFlow Team
 */
contract InvestmentManager is
    IInvestmentManager,
    ReentrancyGuard,
    Ownable,
    Pausable
{
    using SafeMath for uint256;

    // State variables
    mapping(uint256 => mapping(address => IFundFlowCore.Investment))
        private _investments;
    mapping(address => InvestorProfile) private _investorProfiles;
    mapping(uint256 => InvestmentLimits) private _campaignLimits;
    mapping(address => bool) private _verifiedInvestors;
    mapping(address => bool) private _accreditedInvestors;

    // Platform configuration
    uint256 public platformFeePercentage = 250; // 2.5%
    address public feeCollector;
    address public fundFlowCore;

    // Modifiers
    modifier onlyFundFlowCore() {
        require(msg.sender == fundFlowCore, "Only FundFlowCore can call this");
        _;
    }

    modifier validCampaign(uint256 campaignId) {
        require(campaignId > 0, "Invalid campaign ID");
        _;
    }

    constructor(address _feeCollector, address _fundFlowCore) {
        feeCollector = _feeCollector;
        fundFlowCore = _fundFlowCore;
    }

    /**
     * @dev Process an investment in a campaign
     */
    function processInvestment(
        uint256 campaignId,
        address investor,
        uint256 amount,
        IFundFlowCore.InvestmentType investmentType
    )
        external
        payable
        override
        onlyFundFlowCore
        validCampaign(campaignId)
        nonReentrant
        whenNotPaused
        returns (bool success, uint256 equityTokens)
    {
        require(investor != address(0), "Invalid investor address");
        require(amount > 0, "Investment amount must be positive");

        // Check investment limits
        InvestmentLimits storage limits = _campaignLimits[campaignId];
        if (limits.minimumInvestment > 0) {
            require(
                amount >= limits.minimumInvestment,
                "Below minimum investment"
            );
        }
        if (limits.maximumInvestment > 0) {
            require(
                _investments[campaignId][investor].amount.add(amount) <=
                    limits.maximumInvestment,
                "Exceeds maximum investment"
            );
        }

        // Check KYC requirements
        if (limits.requiresKYC) {
            require(_verifiedInvestors[investor], "KYC verification required");
        }
        if (limits.requiresAccreditation) {
            require(
                _accreditedInvestors[investor],
                "Accredited investor status required"
            );
        }

        // Calculate platform fee
        uint256 platformFee = amount.mul(platformFeePercentage).div(10000);
        uint256 netAmount = amount.sub(platformFee);

        // Update investment record
        IFundFlowCore.Investment storage investment = _investments[campaignId][
            investor
        ];
        investment.amount = investment.amount.add(netAmount);
        investment.timestamp = block.timestamp;
        investment.investmentType = investmentType;

        // Calculate equity tokens (simplified calculation)
        equityTokens = netAmount.div(0.01 ether); // 1 token per 0.01 HBAR
        investment.equityTokens = investment.equityTokens.add(equityTokens);

        // Update investor profile
        _updateInvestorProfile(investor, netAmount);

        // Transfer platform fee
        if (platformFee > 0) {
            payable(feeCollector).transfer(platformFee);
        }

        emit InvestmentProcessed(
            campaignId,
            investor,
            amount,
            platformFee,
            equityTokens,
            block.timestamp
        );

        return (true, equityTokens);
    }

    /**
     * @dev Process a refund for an investor
     */
    function processRefund(
        uint256 campaignId,
        address investor,
        IFundFlowCore.RefundReason reason
    )
        external
        override
        onlyFundFlowCore
        validCampaign(campaignId)
        nonReentrant
        returns (uint256 refundAmount)
    {
        IFundFlowCore.Investment storage investment = _investments[campaignId][
            investor
        ];
        require(investment.amount > 0, "No investment found");
        require(!investment.refunded, "Already refunded");

        refundAmount = investment.amount;
        investment.refunded = true;

        // Transfer refund
        payable(investor).transfer(refundAmount);

        emit RefundProcessed(
            campaignId,
            investor,
            refundAmount,
            _getRefundReasonString(reason)
        );

        return refundAmount;
    }

    /**
     * @dev Distribute equity tokens to an investor
     */
    function distributeEquityTokens(
        uint256 campaignId,
        address investor,
        uint256 tokens
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        IFundFlowCore.Investment storage investment = _investments[campaignId][
            investor
        ];
        investment.equityTokens = investment.equityTokens.add(tokens);

        // Calculate ownership percentage (simplified)
        uint256 percentage = tokens.mul(10000).div(1000000); // Assuming 1M total tokens

        emit EquityDistributed(campaignId, investor, tokens, percentage);
    }

    /**
     * @dev Distribute dividends to all investors in a campaign
     */
    function distributeDividends(
        uint256 campaignId,
        uint256 totalDividends
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        // This would require iterating through all investors
        // For now, emit event - full implementation would calculate proportional dividends
        emit DividendDistributed(
            campaignId,
            address(0),
            totalDividends,
            block.timestamp
        );
    }

    /**
     * @dev Batch process multiple investments
     */
    function batchProcessInvestments(
        uint256[] memory campaignIds,
        address[] memory investors,
        uint256[] memory amounts
    ) external override onlyFundFlowCore {
        require(
            campaignIds.length == investors.length &&
                investors.length == amounts.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < campaignIds.length; i++) {
            this.processInvestment(
                campaignIds[i],
                investors[i],
                amounts[i],
                IFundFlowCore.InvestmentType.HBAR
            );
        }
    }

    /**
     * @dev Set investment limits for a campaign
     */
    function setInvestmentLimits(
        uint256 campaignId,
        InvestmentLimits memory limits
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _campaignLimits[campaignId] = limits;

        emit InvestmentLimitSet(
            campaignId,
            limits.minimumInvestment,
            limits.maximumInvestment
        );
    }

    /**
     * @dev Update minimum investment for a campaign
     */
    function updateMinimumInvestment(
        uint256 campaignId,
        uint256 amount
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _campaignLimits[campaignId].minimumInvestment = amount;
    }

    /**
     * @dev Update maximum investment for a campaign
     */
    function updateMaximumInvestment(
        uint256 campaignId,
        uint256 amount
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _campaignLimits[campaignId].maximumInvestment = amount;
    }

    /**
     * @dev Toggle KYC requirement for a campaign
     */
    function toggleKYCRequirement(
        uint256 campaignId,
        bool required
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _campaignLimits[campaignId].requiresKYC = required;
    }

    // View functions

    /**
     * @dev Calculate expected returns for an investment
     */
    function calculateExpectedReturns(
        uint256 campaignId,
        uint256 investmentAmount
    )
        external
        pure
        override
        validCampaign(campaignId)
        returns (uint256 expectedReturns, uint256 confidence)
    {
        // Simplified calculation - would use more sophisticated models in production
        expectedReturns = investmentAmount.mul(120).div(100); // 20% expected return
        confidence = 7500; // 75% confidence

        return (expectedReturns, confidence);
    }

    /**
     * @dev Calculate risk score for an investor
     */
    function calculateRiskScore(
        address investor
    ) external view override returns (uint256 riskScore) {
        InvestorProfile storage profile = _investorProfiles[investor];

        // Simple risk calculation based on profile
        riskScore = 500; // Base score

        if (profile.activeCampaigns < 3) {
            riskScore = riskScore.add(200);
        }

        if (profile.totalInvested > 100 ether) {
            riskScore = riskScore.sub(100);
        }

        return riskScore > 1000 ? 1000 : riskScore;
    }

    /**
     * @dev Get portfolio metrics for an investor
     */
    function getPortfolioMetrics(
        address investor
    ) external view override returns (PortfolioMetrics memory) {
        InvestorProfile storage profile = _investorProfiles[investor];

        return
            PortfolioMetrics({
                totalValue: profile.totalInvested.add(profile.totalReturns),
                totalInvested: profile.totalInvested,
                totalReturns: profile.totalReturns,
                portfolioROI: profile.totalInvested > 0
                    ? profile.totalReturns.mul(10000).div(profile.totalInvested)
                    : 0,
                averageHoldingPeriod: 0, // Would calculate from investment history
                diversificationScore: profile.activeCampaigns.mul(100),
                riskAdjustedReturns: 0 // Would calculate with risk metrics
            });
    }

    /**
     * @dev Get diversification advice for an investor
     */
    function getDiversificationAdvice(
        address /* investor */
    )
        external
        pure
        override
        returns (
            string[] memory recommendations,
            uint256[] memory suggestedCampaigns
        )
    {
        // Simplified implementation
        recommendations = new string[](1);
        recommendations[
            0
        ] = "Consider diversifying across different campaign categories";

        suggestedCampaigns = new uint256[](0);

        return (recommendations, suggestedCampaigns);
    }

    // Additional view functions

    function getInvestment(
        uint256 campaignId,
        address investor
    ) external view override returns (IFundFlowCore.Investment memory) {
        return _investments[campaignId][investor];
    }

    function getInvestorProfile(
        address investor
    ) external view override returns (InvestorProfile memory) {
        return _investorProfiles[investor];
    }

    function getInvestmentLimits(
        uint256 campaignId
    ) external view override returns (InvestmentLimits memory) {
        return _campaignLimits[campaignId];
    }

    function getCampaignInvestors(
        uint256 /* campaignId */
    ) external pure override returns (address[] memory) {
        // Would maintain a list of investors per campaign
        return new address[](0);
    }

    function getInvestmentHistory(
        address /* investor */
    )
        external
        pure
        override
        returns (
            uint256[] memory campaignIds,
            IFundFlowCore.Investment[] memory investments
        )
    {
        // Would maintain investment history
        return (new uint256[](0), new IFundFlowCore.Investment[](0));
    }

    function calculateEquityPercentage(
        uint256 /* campaignId */,
        address /* investor */
    ) external pure override returns (uint256) {
        // Would calculate based on total campaign equity
        return 0;
    }

    function getPlatformInvestmentStats()
        external
        pure
        override
        returns (
            uint256 totalInvestments,
            uint256 totalInvestors,
            uint256 averageInvestment,
            uint256 totalRefunds
        )
    {
        // Would aggregate platform-wide statistics
        return (0, 0, 0, 0);
    }

    // Emergency functions

    function emergencyRefundAll(
        uint256 campaignId
    ) external override onlyOwner validCampaign(campaignId) {
        // Emergency refund implementation
    }

    function freezeInvestments(
        uint256 campaignId
    ) external override onlyOwner validCampaign(campaignId) {
        // Freeze implementation
    }

    function unfreezeInvestments(
        uint256 campaignId
    ) external override onlyOwner validCampaign(campaignId) {
        // Unfreeze implementation
    }

    // Token management functions

    function updateExternalTokenPrice(
        address /* token */,
        uint256 /* price */
    ) external override onlyOwner {
        // Token price update implementation
    }

    function addSupportedToken(
        address /* token */,
        string memory /* name */,
        string memory /* symbol */
    ) external override onlyOwner {
        // Add supported token implementation
    }

    function removeSupportedToken(
        address /* token */
    ) external override onlyOwner {
        // Remove supported token implementation
    }

    // Internal functions

    function _updateInvestorProfile(
        address investor,
        uint256 investmentAmount
    ) internal {
        InvestorProfile storage profile = _investorProfiles[investor];

        if (profile.totalInvested == 0) {
            // First time investor - could set additional tracking here
        }

        profile.totalInvested = profile.totalInvested.add(investmentAmount);
        profile.activeCampaigns = profile.activeCampaigns.add(1);
        profile.riskScore = this.calculateRiskScore(investor);
    }

    function _getRefundReasonString(
        IFundFlowCore.RefundReason reason
    ) internal pure returns (string memory) {
        if (reason == IFundFlowCore.RefundReason.CampaignFailed)
            return "Campaign failed";
        if (reason == IFundFlowCore.RefundReason.CampaignCancelled)
            return "Campaign cancelled";
        if (reason == IFundFlowCore.RefundReason.InvestorRequest)
            return "Investor request";
        if (reason == IFundFlowCore.RefundReason.Emergency) return "Emergency";
        return "Unknown";
    }

    // Admin functions

    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee too high");
        platformFeePercentage = newFeePercentage;
    }

    function updateFeeCollector(address newFeeCollector) external onlyOwner {
        require(newFeeCollector != address(0), "Invalid address");
        feeCollector = newFeeCollector;
    }

    function setVerifiedInvestor(
        address investor,
        bool verified
    ) external onlyOwner {
        _verifiedInvestors[investor] = verified;
    }

    function setAccreditedInvestor(
        address investor,
        bool accredited
    ) external onlyOwner {
        _accreditedInvestors[investor] = accredited;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
