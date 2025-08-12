// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../interfaces/IFundFlowCore.sol";
import "../libraries/CampaignLibrary.sol";

/**
 * @title CampaignManager
 * @dev Manages campaign creation, updates, and analytics
 * @author FundFlow Team
 */
contract CampaignManager is
    ICampaignManager,
    ReentrancyGuard,
    Ownable,
    Pausable
{
    using CampaignLibrary for *;

    // Core contract reference
    IFundFlowCore public immutable fundFlowCore;

    // Storage
    uint256 private _draftIdCounter;
    mapping(uint256 => CampaignDraft) private _campaignDrafts;
    mapping(uint256 => CampaignAnalytics) private _campaignAnalytics;
    mapping(address => uint256[]) private _creatorCampaigns;
    mapping(IFundFlowCore.CampaignCategory => uint256[])
        private _categoryCampaigns;
    mapping(uint256 => bool) private _featuredCampaigns;
    mapping(uint256 => uint256) private _featuredUntil;

    // Configuration
    uint256 public minimumTargetAmount = 0.1 ether;
    uint256 public maximumDuration = 365 days;
    uint256 public featuredCampaignFee = 1 ether;

    constructor(address _fundFlowCore) {
        require(_fundFlowCore != address(0), "Invalid FundFlowCore address");
        fundFlowCore = IFundFlowCore(_fundFlowCore);
        _draftIdCounter = 0;
    }

    // ==================== ICampaignManager Implementation ====================

    /**
     * @dev Creates a campaign draft
     */
    function createCampaignDraft(
        CampaignDraft memory draft
    ) external override nonReentrant whenNotPaused returns (uint256 draftId) {
        // Validate draft
        (bool isValid, string memory errorMessage) = CampaignLibrary
            .validateCampaignDraft(draft);
        require(isValid, errorMessage);

        _draftIdCounter++;
        draftId = _draftIdCounter;

        _campaignDrafts[draftId] = draft;

        emit CampaignDraftCreated(draftId, msg.sender);
        return draftId;
    }

    /**
     * @dev Updates a campaign draft
     */
    function updateCampaignDraft(
        uint256 campaignId,
        CampaignDraft memory draft
    ) external override nonReentrant whenNotPaused {
        require(
            _campaignDrafts[campaignId].fundingGoal > 0,
            "Draft does not exist"
        );

        // Validate draft
        (bool isValid, string memory errorMessage) = CampaignLibrary
            .validateCampaignDraft(draft);
        require(isValid, errorMessage);

        _campaignDrafts[campaignId] = draft;

        emit CampaignUpdated(campaignId, "draft", "updated", "updated");
    }

    /**
     * @dev Activates a campaign from draft
     */
    function activateCampaign(
        uint256 campaignId
    ) external override nonReentrant whenNotPaused {
        require(
            _campaignDrafts[campaignId].fundingGoal > 0,
            "Draft does not exist"
        );

        // This would trigger the actual campaign creation in FundFlowCore
        // For now, just emit the event
        emit CampaignActivated(campaignId, block.timestamp);
    }

    /**
     * @dev Cancels a campaign
     */
    function cancelCampaign(
        uint256 campaignId,
        string memory reason
    ) external override {
        // Validate that sender can cancel the campaign
        // Implementation would interact with FundFlowCore
        emit CampaignCancelled(campaignId, reason);
    }

    /**
     * @dev Extends campaign deadline
     */
    function extendCampaignDeadline(
        uint256 campaignId,
        uint256 additionalDays
    ) external override {
        // Validate extension and update in FundFlowCore
        uint256 newDeadline = block.timestamp + (additionalDays * 1 days);
        emit CampaignExtended(campaignId, block.timestamp, newDeadline);
    }

    /**
     * @dev Pauses a campaign
     */
    function pauseCampaign(uint256 campaignId) external override {
        // Implementation would interact with FundFlowCore
        emit CampaignUpdated(campaignId, "status", "active", "paused");
    }

    /**
     * @dev Resumes a paused campaign
     */
    function resumeCampaign(uint256 campaignId) external override {
        // Implementation would interact with FundFlowCore
        emit CampaignUpdated(campaignId, "status", "paused", "active");
    }

    /**
     * @dev Marks a campaign as featured
     */
    function markCampaignFeatured(
        uint256 campaignId,
        uint256 durationDays
    ) external payable override nonReentrant {
        require(
            msg.value >= featuredCampaignFee,
            "Insufficient fee for featuring"
        );

        _featuredCampaigns[campaignId] = true;
        _featuredUntil[campaignId] = block.timestamp + (durationDays * 1 days);

        emit CampaignFeatured(campaignId, _featuredUntil[campaignId]);

        // Transfer fee to owner
        payable(owner()).transfer(msg.value);
    }

    /**
     * @dev Increments campaign view count
     */
    function incrementCampaignViews(uint256 campaignId) external override {
        _campaignAnalytics[campaignId].viewCount++;

        // Update conversion rate
        // This is a simplified calculation - in reality you'd get investor count from FundFlowCore
        uint256 investorCount = 0; // Would get from FundFlowCore
        if (_campaignAnalytics[campaignId].viewCount > 0) {
            _campaignAnalytics[campaignId].conversionRate =
                (investorCount * 10000) /
                _campaignAnalytics[campaignId].viewCount;
        }
    }

    /**
     * @dev Updates social engagement score
     */
    function updateSocialEngagement(
        uint256 campaignId,
        uint256 engagementScore
    ) external override {
        _campaignAnalytics[campaignId].socialEngagement = engagementScore;
    }

    // ==================== View Functions ====================

    /**
     * @dev Validates campaign draft
     */
    function validateCampaignDraft(
        CampaignDraft memory draft
    )
        external
        pure
        override
        returns (bool isValid, string memory errorMessage)
    {
        return CampaignLibrary.validateCampaignDraft(draft);
    }

    /**
     * @dev Gets campaigns by creator
     */
    function getCampaignsByCreator(
        address /* creator */
    ) external view override returns (uint256[] memory) {
        // This would query FundFlowCore for campaigns by creator
        // For now, return empty array
        return new uint256[](0);
    }

    /**
     * @dev Gets campaigns by category
     */
    function getCampaignsByCategory(
        IFundFlowCore.CampaignCategory /* category */
    ) external view override returns (uint256[] memory) {
        // This would query FundFlowCore for campaigns by category
        // For now, return empty array
        return new uint256[](0);
    }

    /**
     * @dev Gets active campaigns
     */
    function getActiveCampaigns()
        external
        view
        override
        returns (uint256[] memory)
    {
        // This would query FundFlowCore for active campaigns
        // For now, return empty array
        return new uint256[](0);
    }

    /**
     * @dev Gets featured campaigns
     */
    function getFeaturedCampaigns()
        external
        view
        override
        returns (uint256[] memory)
    {
        // This would query FundFlowCore for featured campaigns
        // For now, return empty array
        return new uint256[](0);
    }
    /**
     * @dev Gets trending campaigns
     */
    function getTrendingCampaigns()
        external
        pure
        override
        returns (uint256[] memory)
    {
        // Calculate trending campaigns based on various metrics
        // For now, return empty array
        return new uint256[](0);
    }

    /**
     * @dev Gets campaign analytics
     */
    function getCampaignAnalytics(
        uint256 campaignId
    ) external view override returns (CampaignAnalytics memory) {
        return _campaignAnalytics[campaignId];
    }

    /**
     * @dev Searches campaigns by keyword
     */
    function searchCampaigns(
        string memory /* keyword */
    ) external view override returns (uint256[] memory) {
        // This would search through campaign titles and descriptions
        // For now, return empty array
        return new uint256[](0);
    }

    // ==================== Admin Functions ====================

    /**
     * @dev Sets minimum target amount
     */
    function setMinimumTargetAmount(
        uint256 amount
    ) external override onlyOwner {
        minimumTargetAmount = amount;
    }

    /**
     * @dev Sets maximum duration
     */
    function setMaximumDuration(
        uint256 durationInDays
    ) external override onlyOwner {
        maximumDuration = durationInDays * 1 days;
    }

    /**
     * @dev Sets featured campaign fee
     */
    function setFeaturedCampaignFee(uint256 fee) external override onlyOwner {
        featuredCampaignFee = fee;
    }

    /**
     * @dev Pauses the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency withdrawal
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
