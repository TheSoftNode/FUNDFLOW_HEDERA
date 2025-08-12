// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IFundFlowCore.sol";
import "../interfaces/IInvestmentManager.sol";

/**
 * @title InvestmentLibrary
 * @dev Comprehensive library for investment processing and portfolio management
 * @author FundFlow Team
 */
library InvestmentLibrary {
    using InvestmentLibrary for InvestmentStorage;

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

    // Errors
    error InvestmentNotFound();
    error InvalidInvestmentAmount();
    error InvestmentLimitExceeded();
    error RefundNotAvailable();
    error InsufficientBalance();

    // Constants
    uint256 private constant PERCENTAGE_PRECISION = 10000; // 100.00%
    uint256 private constant RISK_SCORE_PRECISION = 100;

    // Storage struct
    struct InvestmentStorage {
        mapping(uint256 => mapping(address => IFundFlowCore.Investment)) investments;
        mapping(uint256 => address[]) campaignInvestors;
        mapping(address => IInvestmentManager.InvestorProfile) investorProfiles;
        mapping(uint256 => IInvestmentManager.InvestmentLimits) investmentLimits;
        mapping(address => uint256[]) investorCampaigns;
        mapping(uint256 => bool) frozenCampaigns;
        mapping(address => uint256) totalInvestedByInvestor;
        mapping(uint256 => uint256) totalInvestedInCampaign;
        uint256 platformFeePercentage;
        address[] allInvestors;
    }

    /**
     * @dev Processes a new investment
     */
    function processInvestment(
        InvestmentStorage storage self,
        uint256 campaignId,
        address investor,
        uint256 amount,
        IFundFlowCore.InvestmentType investmentType
    ) external returns (bool success, uint256 equityTokens) {
        if (amount == 0) revert InvalidInvestmentAmount();
        if (self.frozenCampaigns[campaignId]) revert InvestmentLimitExceeded();

        // Check investment limits
        IInvestmentManager.InvestmentLimits memory limits = self
            .investmentLimits[campaignId];
        if (
            amount < limits.minimumInvestment ||
            amount > limits.maximumInvestment
        ) {
            revert InvestmentLimitExceeded();
        }

        // Calculate platform fee and equity tokens
        uint256 platformFee = (amount * self.platformFeePercentage) /
            PERCENTAGE_PRECISION;
        uint256 netAmount = amount - platformFee;
        equityTokens = _calculateEquityTokens(campaignId, netAmount);

        // Record investment
        IFundFlowCore.Investment storage investment = self.investments[
            campaignId
        ][investor];
        if (investment.amount == 0) {
            // First investment from this investor in this campaign
            self.campaignInvestors[campaignId].push(investor);
            self.investorCampaigns[investor].push(campaignId);
            _addToInvestorList(self, investor);
        }

        investment.amount += amount;
        investment.timestamp = block.timestamp;
        investment.equityTokens += equityTokens;
        investment.investmentType = investmentType;

        // Update totals
        self.totalInvestedByInvestor[investor] += amount;
        self.totalInvestedInCampaign[campaignId] += amount;

        // Update investor profile
        _updateInvestorProfile(self, investor, amount, equityTokens);

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
     * @dev Processes a refund
     */
    function processRefund(
        InvestmentStorage storage self,
        uint256 campaignId,
        address investor,
        IFundFlowCore.RefundReason reason
    ) external returns (uint256 refundAmount) {
        IFundFlowCore.Investment storage investment = self.investments[
            campaignId
        ][investor];
        if (investment.amount == 0 || investment.refunded)
            revert RefundNotAvailable();

        refundAmount = investment.amount;
        investment.refunded = true;

        // Update totals
        self.totalInvestedByInvestor[investor] -= refundAmount;
        self.totalInvestedInCampaign[campaignId] -= refundAmount;

        // Update investor profile
        IInvestmentManager.InvestorProfile storage profile = self
            .investorProfiles[investor];
        profile.totalInvested -= refundAmount;
        profile.activeCampaigns -= 1;

        string memory reasonStr = _refundReasonToString(reason);
        emit RefundProcessed(campaignId, investor, refundAmount, reasonStr);

        return refundAmount;
    }

    /**
     * @dev Distributes equity tokens
     */
    function distributeEquityTokens(
        InvestmentStorage storage self,
        uint256 campaignId,
        address investor,
        uint256 tokens
    ) external {
        IFundFlowCore.Investment storage investment = self.investments[
            campaignId
        ][investor];
        if (investment.amount == 0) revert InvestmentNotFound();

        investment.equityTokens += tokens;

        // Update investor profile
        self.investorProfiles[investor].totalEquityTokens += tokens;

        uint256 percentage = _calculateEquityPercentage(
            self,
            campaignId,
            investor
        );
        emit EquityDistributed(campaignId, investor, tokens, percentage);
    }

    /**
     * @dev Sets investment limits for a campaign
     */
    function setInvestmentLimits(
        InvestmentStorage storage self,
        uint256 campaignId,
        IInvestmentManager.InvestmentLimits memory limits
    ) external {
        self.investmentLimits[campaignId] = limits;
    }

    /**
     * @dev Calculates expected returns
     */
    function calculateExpectedReturns(
        InvestmentStorage storage self,
        uint256 campaignId,
        uint256 investmentAmount
    ) external view returns (uint256 expectedReturns, uint256 confidence) {
        // Simplified calculation - in practice would use more sophisticated models
        uint256 totalInvested = self.totalInvestedInCampaign[campaignId];
        uint256 baseReturn = (investmentAmount * 120) / 100; // 20% base return

        // Adjust based on campaign performance
        if (totalInvested > 1000000 ether) {
            expectedReturns = (baseReturn * 150) / 100; // Higher returns for well-funded campaigns
            confidence = 85;
        } else if (totalInvested > 100000 ether) {
            expectedReturns = (baseReturn * 130) / 100;
            confidence = 70;
        } else {
            expectedReturns = baseReturn;
            confidence = 50;
        }

        return (expectedReturns, confidence);
    }

    /**
     * @dev Calculates risk score for an investor
     */
    function calculateRiskScore(
        InvestmentStorage storage self,
        address investor
    ) external view returns (uint256 riskScore) {
        IInvestmentManager.InvestorProfile memory profile = self
            .investorProfiles[investor];

        if (profile.totalInvested == 0) return 0;

        // Base risk calculation
        uint256 successRate = (profile.successfulInvestments *
            RISK_SCORE_PRECISION) /
            (profile.activeCampaigns + profile.successfulInvestments);

        // Risk factors
        uint256 diversificationFactor = profile.activeCampaigns > 10
            ? 20
            : profile.activeCampaigns * 2;
        uint256 experienceFactor = profile.totalInvested > 1000000 ether
            ? 30
            : (profile.totalInvested / 33333 ether);

        riskScore = successRate + diversificationFactor + experienceFactor;
        if (riskScore > RISK_SCORE_PRECISION) riskScore = RISK_SCORE_PRECISION;

        return riskScore;
    }

    /**
     * @dev Gets portfolio metrics for an investor
     */
    function getPortfolioMetrics(
        InvestmentStorage storage self,
        address investor
    ) external view returns (IInvestmentManager.PortfolioMetrics memory) {
        IInvestmentManager.InvestorProfile memory profile = self
            .investorProfiles[investor];

        return
            IInvestmentManager.PortfolioMetrics({
                totalValue: profile.totalInvested + profile.totalReturns,
                totalInvested: profile.totalInvested,
                totalReturns: profile.totalReturns,
                portfolioROI: profile.totalInvested > 0
                    ? (profile.totalReturns * PERCENTAGE_PRECISION) /
                        profile.totalInvested
                    : 0,
                averageHoldingPeriod: _calculateAverageHoldingPeriod(
                    self,
                    investor
                ),
                diversificationScore: _calculateDiversificationScore(
                    self,
                    investor
                ),
                riskAdjustedReturns: _calculateRiskAdjustedReturns(
                    self,
                    investor
                )
            });
    }

    /**
     * @dev Gets investment history for an investor
     */
    function getInvestmentHistory(
        InvestmentStorage storage self,
        address investor
    )
        external
        view
        returns (
            uint256[] memory campaignIds,
            IFundFlowCore.Investment[] memory investments
        )
    {
        campaignIds = self.investorCampaigns[investor];
        investments = new IFundFlowCore.Investment[](campaignIds.length);

        for (uint256 i = 0; i < campaignIds.length; i++) {
            investments[i] = self.investments[campaignIds[i]][investor];
        }

        return (campaignIds, investments);
    }

    /**
     * @dev Calculates equity percentage for an investor in a campaign
     */
    function calculateEquityPercentage(
        InvestmentStorage storage self,
        uint256 campaignId,
        address investor
    ) external view returns (uint256 percentage) {
        return _calculateEquityPercentage(self, campaignId, investor);
    }

    /**
     * @dev Emergency refund for all investors in a campaign
     */
    function emergencyRefundAll(
        InvestmentStorage storage self,
        uint256 campaignId
    ) external {
        address[] memory investors = self.campaignInvestors[campaignId];

        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            IFundFlowCore.Investment storage investment = self.investments[
                campaignId
            ][investor];

            if (!investment.refunded && investment.amount > 0) {
                investment.refunded = true;

                // Update totals
                self.totalInvestedByInvestor[investor] -= investment.amount;
                self.totalInvestedInCampaign[campaignId] -= investment.amount;

                emit RefundProcessed(
                    campaignId,
                    investor,
                    investment.amount,
                    "Emergency refund"
                );
            }
        }
    }

    /**
     * @dev Freezes investments for a campaign
     */
    function freezeInvestments(
        InvestmentStorage storage self,
        uint256 campaignId
    ) external {
        self.frozenCampaigns[campaignId] = true;
    }

    /**
     * @dev Unfreezes investments for a campaign
     */
    function unfreezeInvestments(
        InvestmentStorage storage self,
        uint256 campaignId
    ) external {
        self.frozenCampaigns[campaignId] = false;
    }

    // Internal helper functions
    function _calculateEquityTokens(
        uint256 campaignId,
        uint256 netAmount
    ) internal pure returns (uint256) {
        // Simplified calculation - 1 token per 1000 wei invested
        return netAmount / 1000;
    }

    function _calculateEquityPercentage(
        InvestmentStorage storage self,
        uint256 campaignId,
        address investor
    ) internal view returns (uint256 percentage) {
        uint256 investorTokens = self
        .investments[campaignId][investor].equityTokens;
        uint256 totalTokens = _getTotalEquityTokens(self, campaignId);

        if (totalTokens == 0) return 0;
        return (investorTokens * PERCENTAGE_PRECISION) / totalTokens;
    }

    function _getTotalEquityTokens(
        InvestmentStorage storage self,
        uint256 campaignId
    ) internal view returns (uint256 total) {
        address[] memory investors = self.campaignInvestors[campaignId];

        for (uint256 i = 0; i < investors.length; i++) {
            total += self.investments[campaignId][investors[i]].equityTokens;
        }

        return total;
    }

    function _updateInvestorProfile(
        InvestmentStorage storage self,
        address investor,
        uint256 amount,
        uint256 equityTokens
    ) internal {
        IInvestmentManager.InvestorProfile storage profile = self
            .investorProfiles[investor];

        if (profile.totalInvested == 0) {
            // First time investor
            profile.isVerified = false;
            profile.isAccredited = false;
        }

        profile.totalInvested += amount;
        profile.totalEquityTokens += equityTokens;
        profile.activeCampaigns += 1;
        profile.riskScore = self.calculateRiskScore(investor);
    }

    function _addToInvestorList(
        InvestmentStorage storage self,
        address investor
    ) internal {
        // Check if investor is already in the list
        for (uint256 i = 0; i < self.allInvestors.length; i++) {
            if (self.allInvestors[i] == investor) return;
        }
        self.allInvestors.push(investor);
    }

    function _calculateAverageHoldingPeriod(
        InvestmentStorage storage self,
        address investor
    ) internal view returns (uint256) {
        uint256[] memory campaigns = self.investorCampaigns[investor];
        if (campaigns.length == 0) return 0;

        uint256 totalHoldingPeriod = 0;
        uint256 validInvestments = 0;

        for (uint256 i = 0; i < campaigns.length; i++) {
            IFundFlowCore.Investment memory investment = self.investments[
                campaigns[i]
            ][investor];
            if (investment.timestamp > 0) {
                totalHoldingPeriod += (block.timestamp - investment.timestamp);
                validInvestments++;
            }
        }

        return validInvestments > 0 ? totalHoldingPeriod / validInvestments : 0;
    }

    function _calculateDiversificationScore(
        InvestmentStorage storage self,
        address investor
    ) internal view returns (uint256) {
        uint256 activeCampaigns = self
            .investorProfiles[investor]
            .activeCampaigns;

        // Simple diversification score based on number of campaigns
        if (activeCampaigns >= 20) return 100;
        if (activeCampaigns >= 10) return 80;
        if (activeCampaigns >= 5) return 60;
        if (activeCampaigns >= 3) return 40;
        if (activeCampaigns >= 2) return 20;
        return 0;
    }

    function _calculateRiskAdjustedReturns(
        InvestmentStorage storage self,
        address investor
    ) internal view returns (uint256) {
        IInvestmentManager.InvestorProfile memory profile = self
            .investorProfiles[investor];
        if (profile.totalInvested == 0) return 0;

        uint256 roi = (profile.totalReturns * PERCENTAGE_PRECISION) /
            profile.totalInvested;
        uint256 riskScore = profile.riskScore;

        // Adjust returns based on risk score
        return (roi * riskScore) / RISK_SCORE_PRECISION;
    }

    function _refundReasonToString(
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
}
