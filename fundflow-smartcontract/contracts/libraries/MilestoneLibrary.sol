// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IFundFlowCore.sol";
import "../interfaces/IMilestoneManager.sol";

/**
 * @title MilestoneLibrary
 * @dev Library for milestone-related operations and voting mechanics based on FundFlow interfaces
 * @author FundFlow Team
 */
library MilestoneLibrary {
    // Constants
    uint256 public constant MIN_VOTING_DURATION = 1 days;
    uint256 public constant MAX_VOTING_DURATION = 30 days;
    uint256 public constant MIN_MILESTONE_AMOUNT = 0.01 ether;
    uint256 public constant QUORUM_PERCENTAGE = 5000; // 50% in basis points
    uint256 public constant APPROVAL_THRESHOLD = 6000; // 60% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_TITLE_LENGTH = 3;
    uint256 public constant MAX_TITLE_LENGTH = 100;
    uint256 public constant MIN_DESCRIPTION_LENGTH = 10;
    uint256 public constant MAX_DESCRIPTION_LENGTH = 1000;

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

    /**
     * @dev Validates milestone creation parameters
     * @param title Milestone title
     * @param description Milestone description
     * @param targetAmount Target amount for milestone
     * @param votingDuration Voting duration in seconds
     * @param campaignTargetAmount Total campaign target amount
     * @param existingMilestonesAmount Sum of existing milestones amounts
     * @return isValid Whether parameters are valid
     * @return errorMessage Error message if validation fails
     */
    function validateMilestoneCreation(
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 votingDuration,
        uint256 campaignTargetAmount,
        uint256 existingMilestonesAmount
    ) internal pure returns (bool isValid, string memory errorMessage) {
        // Validate title
        if (
            bytes(title).length < MIN_TITLE_LENGTH ||
            bytes(title).length > MAX_TITLE_LENGTH
        ) {
            return (false, "Invalid title length");
        }

        // Validate description
        if (
            bytes(description).length < MIN_DESCRIPTION_LENGTH ||
            bytes(description).length > MAX_DESCRIPTION_LENGTH
        ) {
            return (false, "Invalid description length");
        }

        // Validate target amount
        if (targetAmount < MIN_MILESTONE_AMOUNT) {
            return (false, "Target amount too low");
        }

        // Check if milestone amount doesn't exceed remaining campaign amount
        if (existingMilestonesAmount + targetAmount > campaignTargetAmount) {
            return (false, "Milestone amount exceeds campaign target");
        }

        // Validate voting duration
        if (
            votingDuration < MIN_VOTING_DURATION ||
            votingDuration > MAX_VOTING_DURATION
        ) {
            return (false, "Invalid voting duration");
        }

        return (true, "");
    }

    /**
     * @dev Validates milestone update parameters
     * @param newTitle New milestone title
     * @param newDescription New milestone description
     * @param milestoneStatus Current milestone status
     * @return isValid Whether update is valid
     * @return errorMessage Error message if validation fails
     */
    function validateMilestoneUpdate(
        string memory newTitle,
        string memory newDescription,
        IFundFlowCore.MilestoneStatus milestoneStatus
    ) internal pure returns (bool isValid, string memory errorMessage) {
        // Can only update pending milestones
        if (milestoneStatus != IFundFlowCore.MilestoneStatus.Pending) {
            return (false, "Can only update pending milestones");
        }

        // Validate new title if provided
        if (bytes(newTitle).length > 0) {
            if (
                bytes(newTitle).length < MIN_TITLE_LENGTH ||
                bytes(newTitle).length > MAX_TITLE_LENGTH
            ) {
                return (false, "Invalid new title length");
            }
        }

        // Validate new description if provided
        if (bytes(newDescription).length > 0) {
            if (
                bytes(newDescription).length < MIN_DESCRIPTION_LENGTH ||
                bytes(newDescription).length > MAX_DESCRIPTION_LENGTH
            ) {
                return (false, "Invalid new description length");
            }
        }

        return (true, "");
    }

    /**
     * @dev Validates evidence submission
     * @param evidenceUri Evidence URI
     * @param submitter Submitter address
     * @param campaignCreator Campaign creator address
     * @param milestoneStatus Current milestone status
     * @return isValid Whether submission is valid
     * @return errorMessage Error message if validation fails
     */
    function validateEvidenceSubmission(
        string memory evidenceUri,
        address submitter,
        address campaignCreator,
        IFundFlowCore.MilestoneStatus milestoneStatus
    ) internal pure returns (bool isValid, string memory errorMessage) {
        // Check if evidence URI is provided
        if (bytes(evidenceUri).length == 0) {
            return (false, "Evidence URI required");
        }

        // Only campaign creator can submit evidence
        if (submitter != campaignCreator) {
            return (false, "Only creator can submit evidence");
        }

        // Can only submit evidence for pending milestones
        if (milestoneStatus != IFundFlowCore.MilestoneStatus.Pending) {
            return (false, "Can only submit evidence for pending milestones");
        }

        return (true, "");
    }

    /**
     * @dev Validates milestone voting
     * @param voter Voter address
     * @param votingPower Voter's voting power
     * @param milestoneStatus Current milestone status
     * @param votingDeadline Voting deadline timestamp
     * @param hasVoted Whether voter has already voted
     * @return isValid Whether vote is valid
     * @return errorMessage Error message if validation fails
     */
    function validateMilestoneVote(
        address voter,
        uint256 votingPower,
        IFundFlowCore.MilestoneStatus milestoneStatus,
        uint256 votingDeadline,
        bool hasVoted
    ) internal view returns (bool isValid, string memory errorMessage) {
        // Check voter address
        if (voter == address(0)) {
            return (false, "Invalid voter address");
        }

        // Check voting power
        if (votingPower == 0) {
            return (false, "No voting power");
        }

        // Check if already voted
        if (hasVoted) {
            return (false, "Already voted");
        }

        // Check milestone status
        if (milestoneStatus != IFundFlowCore.MilestoneStatus.VotingOpen) {
            return (false, "Voting not open for this milestone");
        }

        // Check voting deadline
        if (block.timestamp > votingDeadline) {
            return (false, "Voting period ended");
        }

        return (true, "");
    }

    /**
     * @dev Calculates voting results and determines approval
     * @param votesFor Total votes in favor
     * @param votesAgainst Total votes against
     * @param totalVotingPower Total voting power in campaign
     * @param approvalThreshold Custom approval threshold for this milestone
     * @return isApproved Whether milestone is approved
     * @return hasQuorum Whether quorum is reached
     * @return approvalRate Approval rate in basis points
     */
    function calculateVotingResult(
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 totalVotingPower,
        uint256 approvalThreshold
    )
        internal
        pure
        returns (bool isApproved, bool hasQuorum, uint256 approvalRate)
    {
        uint256 totalVotes = votesFor + votesAgainst;

        // Check if quorum is reached
        hasQuorum =
            (totalVotes * BASIS_POINTS) / totalVotingPower >= QUORUM_PERCENTAGE;

        if (!hasQuorum) {
            return (false, false, 0);
        }

        // Calculate approval rate
        approvalRate = totalVotes > 0
            ? (votesFor * BASIS_POINTS) / totalVotes
            : 0;

        // Use custom threshold if provided, otherwise use default
        uint256 threshold = approvalThreshold > 0
            ? approvalThreshold
            : APPROVAL_THRESHOLD;

        // Check if approval threshold is met
        isApproved = approvalRate >= threshold;

        return (isApproved, hasQuorum, approvalRate);
    }

    /**
     * @dev Validates milestone execution
     * @param milestoneStatus Current milestone status
     * @param votingDeadline Voting deadline
     * @param isApproved Whether milestone was approved
     * @param hasQuorum Whether quorum was reached
     * @param fundsReleased Whether funds were already released
     * @return canExecute Whether milestone can be executed
     * @return errorMessage Error message if execution not allowed
     */
    function validateMilestoneExecution(
        IFundFlowCore.MilestoneStatus milestoneStatus,
        uint256 votingDeadline,
        bool isApproved,
        bool hasQuorum,
        bool fundsReleased
    ) internal view returns (bool canExecute, string memory errorMessage) {
        // Check if voting period ended
        if (block.timestamp < votingDeadline) {
            return (false, "Voting period not ended");
        }

        // Check milestone status
        if (milestoneStatus == IFundFlowCore.MilestoneStatus.Completed) {
            return (false, "Milestone already completed");
        }

        if (milestoneStatus == IFundFlowCore.MilestoneStatus.Rejected) {
            return (false, "Milestone was rejected");
        }

        // Check if funds already released
        if (fundsReleased) {
            return (false, "Funds already released");
        }

        // Check voting requirements
        if (!hasQuorum) {
            return (false, "Quorum not reached");
        }

        if (!isApproved) {
            return (false, "Milestone not approved");
        }

        return (true, "");
    }

    /**
     * @dev Gets milestone voting status information
     * @param votesFor Votes in favor
     * @param votesAgainst Votes against
     * @param totalVotingPower Total voting power
     * @param approvalThreshold Approval threshold for milestone
     * @return votesForResult Votes in favor
     * @return votesAgainstResult Votes against
     * @return totalVotingPowerResult Total voting power
     * @return isApproved Whether milestone is approved
     */
    function getMilestoneVotingStatus(
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 totalVotingPower,
        uint256 approvalThreshold
    )
        internal
        pure
        returns (
            uint256 votesForResult,
            uint256 votesAgainstResult,
            uint256 totalVotingPowerResult,
            bool isApproved
        )
    {
        (bool approved, bool hasQuorum, ) = calculateVotingResult(
            votesFor,
            votesAgainst,
            totalVotingPower,
            approvalThreshold
        );

        return (
            votesFor,
            votesAgainst,
            totalVotingPower,
            approved && hasQuorum
        );
    }

    /**
     * @dev Validates milestone creation parameters
     * @param title Milestone title
     * @param description Milestone description
     * @param targetAmount Target amount for milestone
     * @param votingDurationDays Voting duration in days
     */
    function validateMilestoneParams(
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 votingDurationDays
    ) internal pure {
        require(
            bytes(title).length > 0 && bytes(title).length <= 100,
            "Invalid title length"
        );
        require(
            bytes(description).length > 0 && bytes(description).length <= 500,
            "Invalid description length"
        );
        require(targetAmount >= MIN_MILESTONE_AMOUNT, "Target amount too low");

        uint256 votingDuration = votingDurationDays * 1 days;
        require(
            votingDuration >= MIN_VOTING_DURATION,
            "Voting duration too short"
        );
        require(
            votingDuration <= MAX_VOTING_DURATION,
            "Voting duration too long"
        );
    }

    /**
     * @dev Validates voter eligibility and voting parameters
     * @param voter Voter address
     * @param votingPower Voter's voting power
     * @param hasVoted Whether voter has already voted
     * @param votingDeadline Voting deadline timestamp
     */
    function validateVote(
        address voter,
        uint256 votingPower,
        bool hasVoted,
        uint256 votingDeadline
    ) internal view {
        require(voter != address(0), "Invalid voter address");
        require(votingPower > 0, "No voting power");
        require(!hasVoted, "Already voted");
        require(block.timestamp < votingDeadline, "Voting period ended");
    }

    /**
     * @dev Calculates voting results and determines approval
     * @param votesFor Total votes in favor
     * @param votesAgainst Total votes against
     * @param totalVotingPower Total voting power in campaign
     * @return isApproved Whether milestone is approved
     * @return hasQuorum Whether quorum is reached
     */
    function calculateVotingResult(
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 totalVotingPower
    ) internal pure returns (bool isApproved, bool hasQuorum) {
        uint256 totalVotes = votesFor + votesAgainst;

        // Check if quorum is reached
        hasQuorum =
            (totalVotes * BASIS_POINTS) / totalVotingPower >= QUORUM_PERCENTAGE;

        if (!hasQuorum) {
            return (false, false);
        }

        // Check if approval threshold is met
        uint256 approvalRate = (votesFor * BASIS_POINTS) / totalVotes;
        isApproved = approvalRate >= APPROVAL_THRESHOLD;

        return (isApproved, hasQuorum);
    }

    /**
     * @dev Calculates milestone approval rate
     * @param votesFor Votes in favor
     * @param votesAgainst Votes against
     * @return Approval rate in basis points
     */
    function calculateApprovalRate(
        uint256 votesFor,
        uint256 votesAgainst
    ) internal pure returns (uint256) {
        uint256 totalVotes = votesFor + votesAgainst;
        if (totalVotes == 0) return 0;
        return (votesFor * BASIS_POINTS) / totalVotes;
    }

    /**
     * @dev Calculates voter participation rate
     * @param totalVoters Number of voters
     * @param totalEligibleVoters Total eligible voters
     * @return Participation rate in basis points
     */
    function calculateParticipationRate(
        uint256 totalVoters,
        uint256 totalEligibleVoters
    ) internal pure returns (uint256) {
        if (totalEligibleVoters == 0) return 0;
        return (totalVoters * BASIS_POINTS) / totalEligibleVoters;
    }

    /**
     * @dev Checks if voting period has ended
     * @param votingDeadline Voting deadline timestamp
     * @return True if voting has ended
     */
    function hasVotingEnded(
        uint256 votingDeadline
    ) internal view returns (bool) {
        return block.timestamp >= votingDeadline;
    }

    /**
     * @dev Calculates time remaining for voting
     * @param votingDeadline Voting deadline timestamp
     * @return Time remaining in seconds
     */
    function votingTimeRemaining(
        uint256 votingDeadline
    ) internal view returns (uint256) {
        if (hasVotingEnded(votingDeadline)) return 0;
        return votingDeadline - block.timestamp;
    }

    /**
     * @dev Validates milestone can be executed
     * @param isApproved Whether milestone is approved
     * @param isCompleted Whether milestone is already completed
     * @param votingDeadline Voting deadline
     * @param hasQuorum Whether quorum was reached
     */
    function validateMilestoneExecution(
        bool isApproved,
        bool isCompleted,
        uint256 votingDeadline,
        bool hasQuorum
    ) internal view {
        require(hasVotingEnded(votingDeadline), "Voting period not ended");
        require(!isCompleted, "Milestone already completed");
        require(hasQuorum, "Quorum not reached");
        require(isApproved, "Milestone not approved");
    }

    /**
     * @dev Calculates consensus score for milestone
     * @param votesFor Votes in favor
     * @param votesAgainst Votes against
     * @param totalVotingPower Total voting power
     * @return Consensus score (0-10000)
     */
    function calculateConsensusScore(
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 totalVotingPower
    ) internal pure returns (uint256) {
        uint256 totalVotes = votesFor + votesAgainst;
        if (totalVotes == 0) return 0;

        // Participation component (50% weight)
        uint256 participationScore = (totalVotes * 5000) / totalVotingPower;
        if (participationScore > 5000) participationScore = 5000;

        // Agreement component (50% weight)
        uint256 agreement = votesFor > votesAgainst ? votesFor : votesAgainst;
        uint256 agreementScore = (agreement * 5000) / totalVotes;

        return participationScore + agreementScore;
    }

    /**
     * @dev Generates milestone hash for verification
     * @param campaignId Campaign ID
     * @param title Milestone title
     * @param targetAmount Target amount
     * @param deadline Voting deadline
     * @return Milestone hash
     */
    function generateMilestoneHash(
        uint256 campaignId,
        string memory title,
        uint256 targetAmount,
        uint256 deadline
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(campaignId, title, targetAmount, deadline)
            );
    }

    /**
     * @dev Validates evidence submission
     * @param evidenceUri Evidence URI
     * @param submitter Submitter address
     * @param campaignCreator Campaign creator address
     */
    function validateEvidenceSubmission(
        string memory evidenceUri,
        address submitter,
        address campaignCreator
    ) internal pure {
        require(bytes(evidenceUri).length > 0, "Evidence URI required");
        require(
            submitter == campaignCreator,
            "Only creator can submit evidence"
        );
    }
}
