// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IMilestoneManager
 * @dev Interface for milestone management functionality
 * @author FundFlow Team
 */
interface IMilestoneManager {
    // Milestone management functions
    function createMilestone(
        uint256 campaignId,
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 votingDuration
    ) external returns (uint256 milestoneId);

    function updateMilestone(
        uint256 campaignId,
        uint256 milestoneId,
        string memory newTitle,
        string memory newDescription
    ) external;

    function deleteMilestone(uint256 campaignId, uint256 milestoneId) external;

    function submitMilestoneEvidence(
        uint256 campaignId,
        uint256 milestoneId,
        string memory evidenceUri
    ) external;

    function voteMilestone(
        uint256 campaignId,
        uint256 milestoneId,
        address voter,
        bool voteFor,
        uint256 votingPower
    ) external;

    function executeMilestone(
        uint256 campaignId,
        uint256 milestoneId
    ) external returns (bool success);

    function getMilestoneEvidence(
        uint256 campaignId,
        uint256 milestoneId
    ) external view returns (string memory evidenceUri);

    function getMilestoneVotingStatus(
        uint256 campaignId,
        uint256 milestoneId
    )
        external
        view
        returns (
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 totalVotingPower,
            bool isApproved
        );

    function getCampaignMilestones(
        uint256 campaignId
    ) external view returns (uint256[] memory milestoneIds);
}
