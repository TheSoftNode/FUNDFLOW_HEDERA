// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../interfaces/IMilestoneManager.sol";
import "../interfaces/IFundFlowCore.sol";
import "../libraries/MilestoneLibrary.sol";

/**
 * @title MilestoneManager
 * @dev Manages milestone creation, updates, evidence submission, and voting
 * @author FundFlow Team
 */
contract MilestoneManager is
    IMilestoneManager,
    ReentrancyGuard,
    Ownable,
    Pausable
{
    using MilestoneLibrary for *;

    // Events
    event MilestoneCreated(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        string title,
        uint256 targetAmount
    );
    event MilestoneUpdated(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        string field,
        string newValue
    );
    event MilestoneEvidenceSubmitted(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        string evidenceUri
    );
    event MilestoneVoteSubmitted(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        address indexed voter,
        bool vote,
        uint256 votingPower,
        string reason
    );
    event MilestoneExecuted(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        bool success
    );

    // Core contract reference
    IFundFlowCore public immutable fundFlowCore;

    // Storage
    mapping(uint256 => mapping(uint256 => string)) private _milestoneEvidence;
    mapping(uint256 => uint256[]) private _campaignMilestones;

    constructor(address _fundFlowCore) {
        require(_fundFlowCore != address(0), "Invalid FundFlowCore address");
        fundFlowCore = IFundFlowCore(_fundFlowCore);
    }

    // ==================== IMilestoneManager Implementation ====================

    /**
     * @dev Creates a milestone for a campaign
     */
    function createMilestone(
        uint256 campaignId,
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 votingDuration
    )
        external
        override
        nonReentrant
        whenNotPaused
        returns (uint256 milestoneId)
    {
        // Validate parameters
        (bool isValid, string memory errorMessage) = MilestoneLibrary
            .validateMilestoneCreation(
                title,
                description,
                targetAmount,
                votingDuration,
                1000 ether, // campaignTargetAmount - would get from FundFlowCore
                0 // existingMilestonesAmount - would calculate from existing milestones
            );
        require(isValid, errorMessage);

        // Generate milestone ID
        uint256 nextMilestoneIndex = _campaignMilestones[campaignId].length;
        _campaignMilestones[campaignId].push(nextMilestoneIndex);

        emit MilestoneCreated(
            campaignId,
            nextMilestoneIndex,
            title,
            targetAmount
        );

        return nextMilestoneIndex;
    }

    /**
     * @dev Updates milestone information
     */
    function updateMilestone(
        uint256 campaignId,
        uint256 milestoneId,
        string memory newTitle,
        string memory newDescription
    ) external override nonReentrant whenNotPaused {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // Validate update parameters
        (bool isValid, string memory errorMessage) = MilestoneLibrary
            .validateMilestoneUpdate(
                newTitle,
                newDescription,
                IFundFlowCore.MilestoneStatus.Pending // Would get actual status from FundFlowCore
            );
        require(isValid, errorMessage);

        emit MilestoneUpdated(campaignId, milestoneId, "title", newTitle);
        if (bytes(newDescription).length > 0) {
            emit MilestoneUpdated(
                campaignId,
                milestoneId,
                "description",
                newDescription
            );
        }
    }

    /**
     * @dev Deletes a milestone
     */
    function deleteMilestone(
        uint256 campaignId,
        uint256 milestoneId
    ) external override nonReentrant whenNotPaused {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // Validate that milestone can be deleted (only pending milestones)
        // This would check the status in FundFlowCore

        // Remove milestone from campaign milestones array
        // This is a simplified approach - in production you'd want to maintain the array properly
        delete _campaignMilestones[campaignId][milestoneId];

        emit MilestoneUpdated(campaignId, milestoneId, "status", "deleted");
    }

    /**
     * @dev Submits evidence for a milestone
     */
    function submitMilestoneEvidence(
        uint256 campaignId,
        uint256 milestoneId,
        string memory evidenceUri
    ) external override nonReentrant whenNotPaused {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // Validate evidence submission
        (bool isValid, string memory errorMessage) = MilestoneLibrary
            .validateEvidenceSubmission(
                evidenceUri,
                msg.sender,
                msg.sender, // campaignCreator - would get from FundFlowCore
                IFundFlowCore.MilestoneStatus.Pending // Would get actual status from FundFlowCore
            );
        require(isValid, errorMessage);

        _milestoneEvidence[campaignId][milestoneId] = evidenceUri;

        emit MilestoneEvidenceSubmitted(campaignId, milestoneId, evidenceUri);
    }

    /**
     * @dev Votes on a milestone
     */
    function voteMilestone(
        uint256 campaignId,
        uint256 milestoneId,
        address voter,
        bool voteFor,
        uint256 votingPower
    ) external override nonReentrant whenNotPaused {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // Validate vote
        (bool isValid, string memory errorMessage) = MilestoneLibrary
            .validateMilestoneVote(
                voter,
                votingPower,
                IFundFlowCore.MilestoneStatus.VotingOpen, // Would get actual status from FundFlowCore
                block.timestamp + 7 days, // votingDeadline - would get from FundFlowCore
                false // hasVoted - would check in FundFlowCore
            );
        require(isValid, errorMessage);

        // This would interact with FundFlowCore to record the vote
        emit MilestoneVoteSubmitted(
            campaignId,
            milestoneId,
            voter,
            voteFor,
            votingPower,
            ""
        );
    }

    /**
     * @dev Executes a milestone after voting
     */
    function executeMilestone(
        uint256 campaignId,
        uint256 milestoneId
    ) external override nonReentrant whenNotPaused returns (bool success) {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // Validate execution
        (bool canExecute, string memory errorMessage) = MilestoneLibrary
            .validateMilestoneExecution(
                IFundFlowCore.MilestoneStatus.VotingOpen, // Would get actual status from FundFlowCore
                block.timestamp - 1, // votingDeadline - would get from FundFlowCore
                true, // isApproved - would calculate from votes
                true, // hasQuorum - would calculate from votes
                false // fundsReleased - would get from FundFlowCore
            );
        require(canExecute, errorMessage);

        // This would interact with FundFlowCore to execute the milestone
        emit MilestoneExecuted(campaignId, milestoneId, true);

        return true;
    }

    // ==================== View Functions ====================

    /**
     * @dev Gets milestone evidence
     */
    function getMilestoneEvidence(
        uint256 campaignId,
        uint256 milestoneId
    ) external view override returns (string memory evidenceUri) {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );
        return _milestoneEvidence[campaignId][milestoneId];
    }

    /**
     * @dev Gets milestone voting status
     */
    function getMilestoneVotingStatus(
        uint256 campaignId,
        uint256 milestoneId
    )
        external
        view
        override
        returns (
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 totalVotingPower,
            bool isApproved
        )
    {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // This would get voting data from FundFlowCore
        return
            MilestoneLibrary.getMilestoneVotingStatus(
                100, // votesFor - would get from FundFlowCore
                50, // votesAgainst - would get from FundFlowCore
                200, // totalVotingPower - would get from FundFlowCore
                6000 // approvalThreshold - would get from FundFlowCore
            );
    }

    /**
     * @dev Gets all milestones for a campaign
     */
    function getCampaignMilestones(
        uint256 campaignId
    ) external view override returns (uint256[] memory milestoneIds) {
        return _campaignMilestones[campaignId];
    }

    // ==================== Admin Functions ====================

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
     * @dev Emergency function to update milestone status
     */
    function emergencyUpdateMilestoneStatus(
        uint256 campaignId,
        uint256 milestoneId,
        uint8 /* newStatus */
    ) external onlyOwner {
        require(
            milestoneId < _campaignMilestones[campaignId].length,
            "Invalid milestone ID"
        );

        // This would update the milestone status in FundFlowCore
        emit MilestoneUpdated(
            campaignId,
            milestoneId,
            "status",
            "emergency_updated"
        );
    }
}
