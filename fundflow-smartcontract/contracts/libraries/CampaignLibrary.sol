// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../interfaces/IFundFlowCore.sol";
import "../interfaces/ICampaignManager.sol";

/**
 * @title CampaignLibrary
 * @dev Library for campaign-related operations and validations based on FundFlow interfaces
 * @author FundFlow Team
 */
library CampaignLibrary {
    using SafeMath for uint256;

    // Constants
    uint256 public constant MIN_CAMPAIGN_DURATION = 1 days;
    uint256 public constant MAX_CAMPAIGN_DURATION = 365 days;
    uint256 public constant MIN_TARGET_AMOUNT = 0.1 ether; // 0.1 HBAR minimum
    uint256 public constant MAX_TARGET_AMOUNT = 1000000 ether; // 1M HBAR maximum
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%
    uint256 public constant MAX_MILESTONES = 20;
    uint256 public constant MIN_TITLE_LENGTH = 5;
    uint256 public constant MAX_TITLE_LENGTH = 100;
    uint256 public constant MIN_DESCRIPTION_LENGTH = 10;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 2000;
    uint256 public constant MAX_TAGS = 10;
    uint256 public constant BASIS_POINTS = 10000;

    // Events
    event CampaignValidated(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 targetAmount,
        uint256 duration
    );
    event CampaignDraftValidated(
        uint256 indexed campaignId,
        address indexed creator
    );
    event CampaignAnalyticsUpdated(
        uint256 indexed campaignId,
        uint256 viewCount,
        uint256 conversionRate
    );
    event CampaignFeatured(uint256 indexed campaignId, uint256 featuredUntil);

    /**
     * @dev Validates campaign draft parameters
     * @param draft Campaign draft data
     * @return isValid Whether parameters are valid
     * @return errorMessage Error message if validation fails
     */
    function validateCampaignDraft(
        ICampaignManager.CampaignDraft memory draft
    ) internal pure returns (bool isValid, string memory errorMessage) {
        // Validate title
        if (
            bytes(draft.title).length < MIN_TITLE_LENGTH ||
            bytes(draft.title).length > MAX_TITLE_LENGTH
        ) {
            return (false, "Invalid title length");
        }

        // Validate description
        if (
            bytes(draft.description).length < MIN_DESCRIPTION_LENGTH ||
            bytes(draft.description).length > MAX_DESCRIPTION_LENGTH
        ) {
            return (false, "Invalid description length");
        }

        // Validate funding goal
        if (
            draft.fundingGoal < MIN_TARGET_AMOUNT ||
            draft.fundingGoal > MAX_TARGET_AMOUNT
        ) {
            return (false, "Invalid funding goal");
        }

        // Validate duration
        uint256 durationSeconds = draft.duration * 1 days;
        if (
            durationSeconds < MIN_CAMPAIGN_DURATION ||
            durationSeconds > MAX_CAMPAIGN_DURATION
        ) {
            return (false, "Invalid campaign duration");
        }

        // Validate tags
        if (draft.tags.length > MAX_TAGS) {
            return (false, "Too many tags");
        }

        // Validate category
        if (uint256(draft.category) > 5) {
            // Assuming 6 categories (0-5)
            return (false, "Invalid category");
        }

        return (true, "");
    }

    /**
     * @dev Calculates campaign analytics metrics
     * @param viewCount Number of views
     * @param totalInvestors Number of investors
     * @param raisedAmount Amount raised
     * @param milestoneData Array of completed milestones
     * @return analytics Campaign analytics data
     */
    function calculateCampaignAnalytics(
        uint256 viewCount,
        uint256 totalInvestors,
        uint256 raisedAmount,
        uint256 /* targetAmount */,
        bool[] memory milestoneData
    )
        internal
        pure
        returns (ICampaignManager.CampaignAnalytics memory analytics)
    {
        // Calculate conversion rate
        analytics.conversionRate = viewCount > 0
            ? (totalInvestors * BASIS_POINTS) / viewCount
            : 0;

        // Calculate average investment
        analytics.averageInvestment = totalInvestors > 0
            ? raisedAmount / totalInvestors
            : 0;

        // Count completed milestones
        uint256 completedMilestones = 0;
        for (uint256 i = 0; i < milestoneData.length; i++) {
            if (milestoneData[i]) {
                completedMilestones++;
            }
        }

        // Calculate milestone success rate
        analytics.milestoneSuccessRate = milestoneData.length > 0
            ? (completedMilestones * BASIS_POINTS) / milestoneData.length
            : 0;

        // Set view count
        analytics.viewCount = viewCount;

        // Social engagement (placeholder - would be calculated from external data)
        analytics.socialEngagement = 0;

        return analytics;
    }

    /**
     * @dev Filters campaigns by category
     * @param campaigns Array of campaign IDs
     * @param targetCategory Target category to filter by
     * @param campaignCategories Mapping of campaign ID to category
     * @return filtered Array of filtered campaign IDs
     */
    function filterCampaignsByCategory(
        uint256[] memory campaigns,
        IFundFlowCore.CampaignCategory targetCategory,
        mapping(uint256 => IFundFlowCore.CampaignCategory)
            storage campaignCategories
    ) internal view returns (uint256[] memory filtered) {
        uint256[] memory tempFiltered = new uint256[](campaigns.length);
        uint256 count = 0;

        for (uint256 i = 0; i < campaigns.length; i++) {
            if (campaignCategories[campaigns[i]] == targetCategory) {
                tempFiltered[count] = campaigns[i];
                count++;
            }
        }

        // Create properly sized array
        filtered = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            filtered[i] = tempFiltered[i];
        }

        return filtered;
    }

    /**
     * @dev Filters active campaigns
     * @param campaigns Array of campaign IDs
     * @param campaignStatuses Mapping of campaign ID to status
     * @return active Array of active campaign IDs
     */
    function filterActiveCampaigns(
        uint256[] memory campaigns,
        mapping(uint256 => IFundFlowCore.CampaignStatus)
            storage campaignStatuses
    ) internal view returns (uint256[] memory active) {
        uint256[] memory tempActive = new uint256[](campaigns.length);
        uint256 count = 0;

        for (uint256 i = 0; i < campaigns.length; i++) {
            if (
                campaignStatuses[campaigns[i]] ==
                IFundFlowCore.CampaignStatus.Active
            ) {
                tempActive[count] = campaigns[i];
                count++;
            }
        }

        // Create properly sized array
        active = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            active[i] = tempActive[i];
        }

        return active;
    }

    /**
     * @dev Calculates trending score for campaigns
     * @param fundingVelocity Recent funding velocity
     * @param socialEngagement Social engagement score
     * @param viewCount Number of views
     * @param timeActive Time campaign has been active
     * @return trendingScore Trending score for ranking
     */
    function calculateTrendingScore(
        uint256 /* campaignId */,
        uint256 fundingVelocity,
        uint256 socialEngagement,
        uint256 viewCount,
        uint256 timeActive
    ) internal pure returns (uint256 trendingScore) {
        // Avoid division by zero
        if (timeActive == 0) timeActive = 1;

        // Weight factors
        uint256 velocityWeight = 40; // 40%
        uint256 socialWeight = 30; // 30%
        uint256 viewWeight = 20; // 20%
        uint256 recencyWeight = 10; // 10%

        // Normalize funding velocity (per day)
        uint256 dailyVelocity = (fundingVelocity * 86400) / timeActive;
        uint256 velocityScore = (dailyVelocity * velocityWeight) / 100;

        // Social engagement component
        uint256 socialScore = (socialEngagement * socialWeight) / 100;

        // View momentum (views per day)
        uint256 viewMomentum = (viewCount * 86400) / timeActive;
        uint256 viewScore = (viewMomentum * viewWeight) / 100;

        // Recency bonus (higher for newer campaigns)
        uint256 recencyScore = timeActive < 7 days
            ? ((7 days - timeActive) * recencyWeight) / (7 days * 100)
            : 0;

        trendingScore = velocityScore + socialScore + viewScore + recencyScore;
        return trendingScore;
    }

    /**
     * @dev Validates campaign extension parameters
     * @param currentDeadline Current campaign deadline
     * @param additionalDays Additional days to extend
     * @param maxExtensionDays Maximum allowed extension
     * @return isValid Whether extension is valid
     * @return newDeadline New deadline timestamp
     */
    function validateCampaignExtension(
        uint256 currentDeadline,
        uint256 additionalDays,
        uint256 maxExtensionDays
    ) internal view returns (bool isValid, uint256 newDeadline) {
        // Check if campaign hasn't ended
        if (currentDeadline <= block.timestamp) {
            return (false, 0);
        }

        // Check extension limit
        if (additionalDays > maxExtensionDays) {
            return (false, 0);
        }

        // Calculate new deadline
        newDeadline = currentDeadline + (additionalDays * 1 days);

        // Check if new deadline doesn't exceed maximum duration from now
        if (newDeadline > block.timestamp + MAX_CAMPAIGN_DURATION) {
            return (false, 0);
        }

        return (true, newDeadline);
    }

    /**
     * @dev Searches campaigns by keyword in title or description
     * @param campaigns Array of campaign IDs to search
     * @param keyword Keyword to search for
     * @param campaignTitles Mapping of campaign ID to title
     * @param campaignDescriptions Mapping of campaign ID to description
     * @return matches Array of matching campaign IDs
     */
    function searchCampaignsByKeyword(
        uint256[] memory campaigns,
        string memory keyword,
        mapping(uint256 => string) storage campaignTitles,
        mapping(uint256 => string) storage campaignDescriptions
    ) internal view returns (uint256[] memory matches) {
        uint256[] memory tempMatches = new uint256[](campaigns.length);
        uint256 count = 0;

        bytes memory keywordBytes = bytes(keyword);
        if (keywordBytes.length == 0) {
            return new uint256[](0);
        }

        for (uint256 i = 0; i < campaigns.length; i++) {
            uint256 campaignId = campaigns[i];

            // Check title
            if (
                containsKeyword(campaignTitles[campaignId], keyword) ||
                containsKeyword(campaignDescriptions[campaignId], keyword)
            ) {
                tempMatches[count] = campaignId;
                count++;
            }
        }

        // Create properly sized array
        matches = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            matches[i] = tempMatches[i];
        }

        return matches;
    }

    /**
     * @dev Helper function to check if text contains keyword (case-insensitive)
     * @param text Text to search in
     * @param keyword Keyword to search for
     * @return contains Whether text contains keyword
     */
    function containsKeyword(
        string memory text,
        string memory keyword
    ) internal pure returns (bool contains) {
        bytes memory textBytes = bytes(text);
        bytes memory keywordBytes = bytes(keyword);

        if (
            keywordBytes.length == 0 || textBytes.length < keywordBytes.length
        ) {
            return false;
        }

        // Simple substring search (can be optimized)
        for (uint256 i = 0; i <= textBytes.length - keywordBytes.length; i++) {
            bool isMatch = true;
            for (uint256 j = 0; j < keywordBytes.length; j++) {
                // Convert to lowercase for case-insensitive comparison
                bytes1 textChar = textBytes[i + j];
                bytes1 keywordChar = keywordBytes[j];

                // Simple ASCII lowercase conversion
                if (textChar >= 0x41 && textChar <= 0x5A) {
                    textChar = bytes1(uint8(textChar) + 32);
                }
                if (keywordChar >= 0x41 && keywordChar <= 0x5A) {
                    keywordChar = bytes1(uint8(keywordChar) + 32);
                }

                if (textChar != keywordChar) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                return true;
            }
        }

        return false;
    }

    /**
     * @dev Calculates campaign progress metrics
     * @param raisedAmount Amount raised so far
     * @param targetAmount Target funding amount
     * @param deadline Campaign deadline
     * @param totalInvestors Number of total investors
     * @param completedMilestones Number of completed milestones
     * @param totalMilestones Total number of milestones
     * @return metrics Campaign metrics
     */
    function calculateCampaignMetrics(
        uint256 raisedAmount,
        uint256 targetAmount,
        uint256 deadline,
        uint256 /* createdAt */,
        uint256 totalInvestors,
        uint256 completedMilestones,
        uint256 totalMilestones
    ) internal view returns (IFundFlowCore.CampaignMetrics memory metrics) {
        // Calculate average investment
        metrics.averageInvestment = totalInvestors > 0
            ? raisedAmount / totalInvestors
            : 0;

        // Set milestone data
        metrics.completedMilestones = completedMilestones;
        metrics.totalMilestones = totalMilestones;

        // Calculate success rate
        metrics.successRate = totalMilestones > 0
            ? (completedMilestones * BASIS_POINTS) / totalMilestones
            : 0;

        // Calculate days remaining
        metrics.daysRemaining = deadline > block.timestamp
            ? (deadline - block.timestamp) / 1 days
            : 0;

        // Calculate funding progress
        metrics.fundingProgress = targetAmount > 0
            ? (raisedAmount * BASIS_POINTS) / targetAmount
            : 0;

        return metrics;
    }

    /**
     * @dev Calculates platform fee for a given amount
     * @param amount The investment amount
     * @param feePercentage Fee percentage in basis points
     * @return fee The calculated platform fee
     */
    function calculatePlatformFee(
        uint256 amount,
        uint256 feePercentage
    ) internal pure returns (uint256 fee) {
        return amount.mul(feePercentage).div(10000);
    }

    /**
     * @dev Calculates funding velocity (amount raised per day)
     * @param currentFunding Current funding amount
     * @param startTime Campaign start time
     * @return velocity Funding velocity in wei per day
     */
    function calculateFundingVelocity(
        uint256 currentFunding,
        uint256 startTime
    ) internal view returns (uint256 velocity) {
        if (block.timestamp <= startTime) return 0;

        uint256 elapsed = block.timestamp.sub(startTime);
        uint256 elapsedDays = elapsed.div(1 days);

        if (elapsedDays == 0) {
            // If less than a day, calculate based on hours
            uint256 elapsedHours = elapsed.div(1 hours);
            if (elapsedHours == 0) return 0;
            return currentFunding.mul(24).div(elapsedHours);
        }

        return currentFunding.div(elapsedDays);
    }

    /**
     * @dev Validates milestone parameters
     * @param targetAmount Milestone target amount
     * @param deadline Milestone deadline
     * @param campaignEndTime Campaign end time
     * @return isValid Whether milestone parameters are valid
     */
    function validateMilestone(
        uint256 targetAmount,
        uint256 deadline,
        uint256 campaignEndTime
    ) internal view returns (bool isValid) {
        require(targetAmount > 0, "CampaignLibrary: Invalid milestone amount");
        require(
            deadline > block.timestamp,
            "CampaignLibrary: Milestone deadline in past"
        );
        require(
            deadline <= campaignEndTime,
            "CampaignLibrary: Milestone deadline after campaign end"
        );

        return true;
    }

    /**
     * @dev Calculates campaign risk score based on various factors
     * @param fundingVelocity Current funding velocity
     * @param timeLeft Time remaining in campaign
     * @param progressPercentage Current funding progress
     * @param milestoneCount Number of milestones
     * @return riskScore Risk score (0-1000, higher is riskier)
     */
    function calculateRiskScore(
        uint256 fundingVelocity,
        uint256 timeLeft,
        uint256 progressPercentage,
        uint256 milestoneCount
    ) internal pure returns (uint256 riskScore) {
        uint256 score = 0;

        // Low funding velocity increases risk
        if (fundingVelocity < 1000) score = score.add(200);
        else if (fundingVelocity < 5000) score = score.add(100);

        // Low progress with little time remaining increases risk
        if (timeLeft < 7 days && progressPercentage < 5000) {
            score = score.add(300);
        } else if (timeLeft < 30 days && progressPercentage < 2000) {
            score = score.add(200);
        }

        // Too many milestones can be risky
        if (milestoneCount > 15) score = score.add(100);
        else if (milestoneCount > 10) score = score.add(50);

        // No milestones is also risky
        if (milestoneCount == 0) score = score.add(150);

        return score > 1000 ? 1000 : score;
    }

    /**
     * @dev Calculates equity percentage for an investment
     * @param investmentAmount Investment amount
     * @param fundingGoal Total funding goal
     * @param equityPercentage Total equity percentage being offered
     * @return equityShare Investor's equity share percentage
     */
    function calculateEquityShare(
        uint256 investmentAmount,
        uint256 fundingGoal,
        uint256 equityPercentage
    ) internal pure returns (uint256 equityShare) {
        if (fundingGoal == 0) return 0;
        return investmentAmount.mul(equityPercentage).div(fundingGoal);
    }

    /**
     * @dev Calculates campaign progress percentage
     * @param raisedAmount Amount raised so far
     * @param targetAmount Target amount
     * @return Progress percentage (0-10000, where 10000 = 100%)
     */
    function calculateProgress(
        uint256 raisedAmount,
        uint256 targetAmount
    ) internal pure returns (uint256) {
        if (targetAmount == 0) return 0;
        return raisedAmount.mul(10000).div(targetAmount);
    }

    /**
     * @dev Checks if campaign is successfully funded
     * @param raisedAmount Amount raised
     * @param targetAmount Target amount
     * @return True if campaign reached target
     */
    function isSuccessfullyFunded(
        uint256 raisedAmount,
        uint256 targetAmount
    ) internal pure returns (bool) {
        return raisedAmount >= targetAmount;
    }

    /**
     * @dev Checks if campaign deadline has passed
     * @param deadline Campaign deadline timestamp
     * @return True if campaign has ended
     */
    function hasEnded(uint256 deadline) internal view returns (bool) {
        return block.timestamp >= deadline;
    }

    /**
     * @dev Calculates time remaining for campaign
     * @param deadline Campaign deadline timestamp
     * @return Time remaining in seconds (0 if ended)
     */
    function timeRemaining(uint256 deadline) internal view returns (uint256) {
        if (hasEnded(deadline)) return 0;
        return deadline - block.timestamp;
    }

    /**
     * @dev Generates campaign hash for verification
     * @param creator Campaign creator address
     * @param title Campaign title
     * @param targetAmount Target amount
     * @param deadline Campaign deadline
     * @return Campaign hash
     */
    function generateCampaignHash(
        address creator,
        string memory title,
        uint256 targetAmount,
        uint256 deadline
    ) internal pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(creator, title, targetAmount, deadline));
    }

    /**
     * @dev Validates campaign is active and not ended
     * @param isActive Campaign active status
     * @param deadline Campaign deadline
     * @param isPaused Campaign pause status
     */
    function requireActiveAndNotEnded(
        bool isActive,
        uint256 deadline,
        bool isPaused
    ) internal view {
        require(isActive, "Campaign not active");
        require(!hasEnded(deadline), "Campaign ended");
        require(!isPaused, "Campaign paused");
    }

    /**
     * @dev Calculates funding success rate
     * @param raisedAmount Amount raised
     * @param targetAmount Target amount
     * @return Success rate percentage (0-10000)
     */
    function calculateSuccessRate(
        uint256 raisedAmount,
        uint256 targetAmount
    ) internal pure returns (uint256) {
        if (targetAmount == 0) return 0;
        uint256 rate = (raisedAmount * 10000) / targetAmount;
        return rate > 10000 ? 10000 : rate; // Cap at 100%
    }

    /**
     * @dev Validates campaign creator permissions
     * @param creator Campaign creator address
     * @param sender Message sender address
     */
    function requireCampaignCreator(
        address creator,
        address sender
    ) internal pure {
        require(creator == sender, "Not campaign creator");
    }

    /**
     * @dev Calculates average investment per investor
     * @param totalRaised Total amount raised
     * @param totalInvestors Number of investors
     * @return Average investment amount
     */
    function calculateAverageInvestment(
        uint256 totalRaised,
        uint256 totalInvestors
    ) internal pure returns (uint256) {
        if (totalInvestors == 0) return 0;
        return totalRaised / totalInvestors;
    }
}
