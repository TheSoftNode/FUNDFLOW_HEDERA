// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IFundFlowCore.sol";
import "../interfaces/ICampaignManager.sol";

/**
 * @title CampaignLibrary
 * @dev Comprehensive library for campaign management operations
 * @author FundFlow Team
 */
library CampaignLibrary {
    using CampaignLibrary for CampaignStorage;

    // Events mirroring interface events
    event CampaignDraftCreated(
        uint256 indexed campaignId,
        address indexed creator
    );
    event CampaignActivated(uint256 indexed campaignId, uint256 activationTime);
    event CampaignCancelled(uint256 indexed campaignId, string reason);
    event CampaignExtended(
        uint256 indexed campaignId,
        uint256 oldDeadline,
        uint256 newDeadline
    );

    // Errors
    error InvalidCampaignData();
    error CampaignNotFound();
    error UnauthorizedOperation();
    error CampaignAlreadyActive();
    error InvalidDeadlineExtension();

    // Storage struct for campaign data
    struct CampaignStorage {
        mapping(uint256 => CampaignData) campaigns;
        mapping(address => uint256[]) campaignsByCreator;
        mapping(IFundFlowCore.CampaignCategory => uint256[]) campaignsByCategory;
        mapping(uint256 => ICampaignManager.CampaignAnalytics) analytics;
        uint256[] activeCampaigns;
        uint256[] featuredCampaigns;
        uint256 nextCampaignId;
        uint256 minimumTargetAmount;
        uint256 maximumDuration;
        uint256 featuredCampaignFee;
    }

    struct CampaignData {
        IFundFlowCore.Campaign campaign;
        ICampaignManager.CampaignDraft draft;
        bool isDraft;
        bool isPaused;
        bool isFeatured;
        uint256 featuredUntil;
        string[] searchKeywords;
    }

    /**
     * @dev Creates a new campaign draft
     */
    function createCampaignDraft(
        CampaignStorage storage self,
        ICampaignManager.CampaignDraft memory draft,
        address creator
    ) external returns (uint256 campaignId) {
        (bool isValid, string memory error) = validateCampaignDraft(draft);
        if (!isValid) revert InvalidCampaignData();

        campaignId = self.nextCampaignId++;

        CampaignData storage campaignData = self.campaigns[campaignId];
        campaignData.draft = draft;
        campaignData.isDraft = true;

        // Initialize basic campaign data
        campaignData.campaign.creator = creator;
        campaignData.campaign.title = draft.title;
        campaignData.campaign.description = draft.description;
        campaignData.campaign.category = draft.category;
        campaignData.campaign.targetAmount = draft.fundingGoal;
        campaignData.campaign.status = IFundFlowCore.CampaignStatus.Draft;
        campaignData.campaign.createdAt = block.timestamp;
        campaignData.campaign.updatedAt = block.timestamp;

        // Add to creator's campaigns
        self.campaignsByCreator[creator].push(campaignId);

        // Add to category
        self.campaignsByCategory[draft.category].push(campaignId);

        // Generate search keywords
        campaignData.searchKeywords = _generateSearchKeywords(draft);

        emit CampaignDraftCreated(campaignId, creator);
    }

    /**
     * @dev Activates a campaign draft
     */
    function activateCampaign(
        CampaignStorage storage self,
        uint256 campaignId,
        address caller
    ) external {
        CampaignData storage campaignData = self.campaigns[campaignId];
        if (campaignData.campaign.creator == address(0))
            revert CampaignNotFound();
        if (campaignData.campaign.creator != caller)
            revert UnauthorizedOperation();
        if (!campaignData.isDraft) revert CampaignAlreadyActive();

        // Set campaign as active
        campaignData.isDraft = false;
        campaignData.campaign.status = IFundFlowCore.CampaignStatus.Active;
        campaignData.campaign.deadline =
            block.timestamp +
            (campaignData.draft.duration * 1 days);
        campaignData.campaign.updatedAt = block.timestamp;

        // Add to active campaigns
        self.activeCampaigns.push(campaignId);

        emit CampaignActivated(campaignId, block.timestamp);
    }

    /**
     * @dev Cancels a campaign
     */
    function cancelCampaign(
        CampaignStorage storage self,
        uint256 campaignId,
        address caller,
        string memory reason
    ) external {
        CampaignData storage campaignData = self.campaigns[campaignId];
        if (campaignData.campaign.creator == address(0))
            revert CampaignNotFound();
        if (campaignData.campaign.creator != caller)
            revert UnauthorizedOperation();

        campaignData.campaign.status = IFundFlowCore.CampaignStatus.Cancelled;
        campaignData.campaign.updatedAt = block.timestamp;

        // Remove from active campaigns
        _removeFromActiveCampaigns(self, campaignId);

        emit CampaignCancelled(campaignId, reason);
    }

    /**
     * @dev Extends campaign deadline
     */
    function extendCampaignDeadline(
        CampaignStorage storage self,
        uint256 campaignId,
        address caller,
        uint256 additionalDays
    ) external {
        CampaignData storage campaignData = self.campaigns[campaignId];
        if (campaignData.campaign.creator == address(0))
            revert CampaignNotFound();
        if (campaignData.campaign.creator != caller)
            revert UnauthorizedOperation();
        if (additionalDays == 0 || additionalDays > 90)
            revert InvalidDeadlineExtension();

        uint256 oldDeadline = campaignData.campaign.deadline;
        campaignData.campaign.deadline += (additionalDays * 1 days);
        campaignData.campaign.updatedAt = block.timestamp;

        emit CampaignExtended(
            campaignId,
            oldDeadline,
            campaignData.campaign.deadline
        );
    }

    /**
     * @dev Validates campaign draft data
     */
    function validateCampaignDraft(
        ICampaignManager.CampaignDraft memory draft
    ) public pure returns (bool isValid, string memory error) {
        if (bytes(draft.title).length == 0) {
            return (false, "Title cannot be empty");
        }
        if (bytes(draft.description).length == 0) {
            return (false, "Description cannot be empty");
        }
        if (draft.fundingGoal == 0) {
            return (false, "Funding goal must be greater than 0");
        }
        if (draft.duration == 0 || draft.duration > 365) {
            return (false, "Duration must be between 1 and 365 days");
        }
        return (true, "");
    }

    /**
     * @dev Gets campaigns by creator
     */
    function getCampaignsByCreator(
        CampaignStorage storage self,
        address creator
    ) external view returns (uint256[] memory) {
        return self.campaignsByCreator[creator];
    }

    /**
     * @dev Gets campaigns by category
     */
    function getCampaignsByCategory(
        CampaignStorage storage self,
        IFundFlowCore.CampaignCategory category
    ) external view returns (uint256[] memory) {
        return self.campaignsByCategory[category];
    }

    /**
     * @dev Gets active campaigns
     */
    function getActiveCampaigns(
        CampaignStorage storage self
    ) external view returns (uint256[] memory) {
        return self.activeCampaigns;
    }

    /**
     * @dev Gets featured campaigns
     */
    function getFeaturedCampaigns(
        CampaignStorage storage self
    ) external view returns (uint256[] memory) {
        uint256[] memory activeFeatured = new uint256[](
            self.featuredCampaigns.length
        );
        uint256 count = 0;

        for (uint256 i = 0; i < self.featuredCampaigns.length; i++) {
            uint256 campaignId = self.featuredCampaigns[i];
            if (self.campaigns[campaignId].featuredUntil > block.timestamp) {
                activeFeatured[count] = campaignId;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeFeatured[i];
        }

        return result;
    }

    /**
     * @dev Searches campaigns by keyword
     */
    function searchCampaigns(
        CampaignStorage storage self,
        string memory keyword
    ) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](self.nextCampaignId);
        uint256 count = 0;

        bytes32 keywordHash = keccak256(abi.encodePacked(_toLower(keyword)));

        for (uint256 i = 0; i < self.nextCampaignId; i++) {
            CampaignData storage campaignData = self.campaigns[i];
            if (campaignData.campaign.creator == address(0)) continue;

            // Search in keywords
            for (uint256 j = 0; j < campaignData.searchKeywords.length; j++) {
                if (
                    keccak256(
                        abi.encodePacked(campaignData.searchKeywords[j])
                    ) == keywordHash
                ) {
                    results[count] = i;
                    count++;
                    break;
                }
            }
        }

        // Resize array to actual count
        uint256[] memory finalResults = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResults[i] = results[i];
        }

        return finalResults;
    }

    /**
     * @dev Updates campaign analytics
     */
    function updateCampaignAnalytics(
        CampaignStorage storage self,
        uint256 campaignId,
        ICampaignManager.CampaignAnalytics memory analytics
    ) external {
        self.analytics[campaignId] = analytics;
    }

    /**
     * @dev Gets campaign analytics
     */
    function getCampaignAnalytics(
        CampaignStorage storage self,
        uint256 campaignId
    ) external view returns (ICampaignManager.CampaignAnalytics memory) {
        return self.analytics[campaignId];
    }

    // Internal helper functions
    function _generateSearchKeywords(
        ICampaignManager.CampaignDraft memory draft
    ) internal pure returns (string[] memory) {
        string[] memory keywords = new string[](draft.tags.length + 3);

        // Add title words
        keywords[0] = _toLower(draft.title);

        // Add category
        keywords[1] = _categoryToString(draft.category);

        // Add description (first word)
        keywords[2] = _extractFirstWord(draft.description);

        // Add tags
        for (uint256 i = 0; i < draft.tags.length; i++) {
            keywords[i + 3] = _toLower(draft.tags[i]);
        }

        return keywords;
    }

    function _removeFromActiveCampaigns(
        CampaignStorage storage self,
        uint256 campaignId
    ) internal {
        for (uint256 i = 0; i < self.activeCampaigns.length; i++) {
            if (self.activeCampaigns[i] == campaignId) {
                self.activeCampaigns[i] = self.activeCampaigns[
                    self.activeCampaigns.length - 1
                ];
                self.activeCampaigns.pop();
                break;
            }
        }
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);

        for (uint256 i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }

        return string(bLower);
    }

    function _categoryToString(
        IFundFlowCore.CampaignCategory category
    ) internal pure returns (string memory) {
        if (category == IFundFlowCore.CampaignCategory.Technology)
            return "technology";
        if (category == IFundFlowCore.CampaignCategory.Healthcare)
            return "healthcare";
        if (category == IFundFlowCore.CampaignCategory.Finance)
            return "finance";
        if (category == IFundFlowCore.CampaignCategory.Gaming) return "gaming";
        if (category == IFundFlowCore.CampaignCategory.Education)
            return "education";
        return "other";
    }

    function _extractFirstWord(
        string memory str
    ) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        if (bStr.length == 0) return "";

        uint256 length = 0;
        for (uint256 i = 0; i < bStr.length && bStr[i] != 0x20; i++) {
            length++;
        }

        bytes memory firstWord = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            firstWord[i] = bStr[i];
        }

        return _toLower(string(firstWord));
    }
}
