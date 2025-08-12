// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IFundFlowCore.sol";

/**
 * @title ICampaignManager
 * @dev Interface for comprehensive campaign management functionality
 * @author FundFlow Team
 */
interface ICampaignManager {
    // Events
    event CampaignDraftCreated(
        uint256 indexed campaignId,
        address indexed creator
    );
    event CampaignActivated(uint256 indexed campaignId, uint256 activationTime);
    event CampaignUpdated(
        uint256 indexed campaignId,
        string field,
        string oldValue,
        string newValue
    );
    event CampaignCancelled(uint256 indexed campaignId, string reason);
    event CampaignExtended(
        uint256 indexed campaignId,
        uint256 oldDeadline,
        uint256 newDeadline
    );
    event CampaignFeatured(uint256 indexed campaignId, uint256 featuredUntil);

    // Note: Enums and structs are defined in IFundFlowCore to avoid duplication

    // Structs
    struct CampaignDraft {
        string title;
        string description;
        IFundFlowCore.CampaignCategory category;
        uint256 fundingGoal;
        uint256 duration;
        string[] tags;
        string ipfsHash;
    }

    struct CampaignAnalytics {
        uint256 viewCount;
        uint256 conversionRate; // (investors / views) * 10000
        uint256 averageInvestment;
        uint256 socialEngagement;
        uint256 milestoneSuccessRate;
    }

    // Core Functions
    function createCampaignDraft(
        CampaignDraft memory draft
    ) external returns (uint256);
    function updateCampaignDraft(
        uint256 campaignId,
        CampaignDraft memory draft
    ) external;
    function activateCampaign(uint256 campaignId) external;
    function cancelCampaign(uint256 campaignId, string memory reason) external;
    function extendCampaignDeadline(
        uint256 campaignId,
        uint256 additionalDays
    ) external;
    function pauseCampaign(uint256 campaignId) external;
    function resumeCampaign(uint256 campaignId) external;
    function markCampaignFeatured(
        uint256 campaignId,
        uint256 durationDays
    ) external payable;

    // Analytics Functions
    function incrementCampaignViews(uint256 campaignId) external;
    function updateSocialEngagement(
        uint256 campaignId,
        uint256 engagementScore
    ) external;

    // View Functions
    function validateCampaignDraft(
        CampaignDraft memory draft
    ) external pure returns (bool, string memory);
    function getCampaignsByCreator(
        address creator
    ) external view returns (uint256[] memory);
    function getCampaignsByCategory(
        IFundFlowCore.CampaignCategory category
    ) external view returns (uint256[] memory);
    function getActiveCampaigns() external view returns (uint256[] memory);
    function getFeaturedCampaigns() external view returns (uint256[] memory);
    function getTrendingCampaigns() external view returns (uint256[] memory);
    function getCampaignAnalytics(
        uint256 campaignId
    ) external view returns (CampaignAnalytics memory);
    function searchCampaigns(
        string memory keyword
    ) external view returns (uint256[] memory);

    // Admin Functions
    function setMinimumTargetAmount(uint256 amount) external;
    function setMaximumDuration(uint256 durationInDays) external;
    function setFeaturedCampaignFee(uint256 fee) external;
}
