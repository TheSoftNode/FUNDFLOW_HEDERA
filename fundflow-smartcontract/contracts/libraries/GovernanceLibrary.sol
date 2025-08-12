// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title GovernanceLibrary
 * @dev Library for governance and voting-related operations
 * @author FundFlow Team
 */
library GovernanceLibrary {
    using SafeMath for uint256;

    // Constants
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MIN_VOTING_PERIOD = 1 days;
    uint256 public constant MAX_VOTING_PERIOD = 30 days;
    uint256 public constant MIN_EXECUTION_DELAY = 1 hours;
    uint256 public constant MAX_EXECUTION_DELAY = 7 days;
    uint256 public constant DEFAULT_QUORUM_FRACTION = 400; // 4%

    // Enums
    enum ProposalType {
        MilestoneApproval,
        FundRelease,
        CampaignTermination,
        ParameterChange,
        TeamChange,
        BudgetModification,
        PlatformUpgrade,
        Emergency
    }

    enum ProposalStatus {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Queued,
        Executed,
        Cancelled,
        Expired
    }

    enum VoteChoice {
        Against,
        For,
        Abstain
    }

    // Structs
    struct GovernanceConfig {
        uint256 votingDelay;
        uint256 votingPeriod;
        uint256 proposalThreshold;
        uint256 quorumFraction;
        uint256 executionDelay;
        bool requiresTokens;
        uint256 minimumTokensToPropose;
        uint256 minimumTokensToVote;
    }

    struct ProposalCore {
        uint256 id;
        uint256 campaignId;
        address proposer;
        ProposalType proposalType;
        uint256 creationTime;
        uint256 votingStart;
        uint256 votingEnd;
        uint256 executionDelay;
        ProposalStatus status;
        bool executed;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 quorum;
    }

    struct VotingPowerData {
        uint256 baseTokens;
        uint256 stakingMultiplier;
        uint256 reputationBonus;
        uint256 delegatedPower;
        uint256 totalPower;
        uint256 lastUpdate;
    }

    // Events
    event ProposalValidated(
        uint256 indexed proposalId,
        address indexed proposer
    );
    event VotingPowerCalculated(
        address indexed voter,
        uint256 campaignId,
        uint256 power
    );
    event QuorumCalculated(uint256 indexed proposalId, uint256 quorum);

    /**
     * @dev Validate governance configuration
     */
    function validateGovernanceConfig(
        GovernanceConfig memory config
    ) internal pure returns (bool isValid) {
        return
            config.votingPeriod >= MIN_VOTING_PERIOD &&
            config.votingPeriod <= MAX_VOTING_PERIOD &&
            config.executionDelay >= MIN_EXECUTION_DELAY &&
            config.executionDelay <= MAX_EXECUTION_DELAY &&
            config.quorumFraction > 0 &&
            config.quorumFraction <= BASIS_POINTS;
    }

    /**
     * @dev Validate a proposal before creation
     */
    function validateProposal(
        ProposalType /* proposalType */,
        uint256 votingPeriod,
        uint256 executionDelay,
        address proposer,
        uint256 minimumTokens,
        uint256 proposerTokens
    ) internal pure returns (bool isValid) {
        require(proposer != address(0), "GovernanceLibrary: Invalid proposer");
        require(
            votingPeriod >= MIN_VOTING_PERIOD &&
                votingPeriod <= MAX_VOTING_PERIOD,
            "GovernanceLibrary: Invalid voting period"
        );
        require(
            executionDelay >= MIN_EXECUTION_DELAY &&
                executionDelay <= MAX_EXECUTION_DELAY,
            "GovernanceLibrary: Invalid execution delay"
        );
        require(
            proposerTokens >= minimumTokens,
            "GovernanceLibrary: Insufficient tokens to propose"
        );

        return true;
    }

    /**
     * @dev Calculate quorum based on total supply and proposal type
     */
    function calculateQuorum(
        uint256 totalSupply,
        uint256 quorumFraction,
        ProposalType proposalType
    ) internal pure returns (uint256 quorum) {
        // Adjust quorum based on proposal type
        uint256 adjustedFraction = quorumFraction;

        if (proposalType == ProposalType.Emergency) {
            adjustedFraction = quorumFraction.mul(2); // Double quorum for emergency
        } else if (proposalType == ProposalType.PlatformUpgrade) {
            adjustedFraction = quorumFraction.mul(3).div(2); // 1.5x quorum for platform upgrades
        }

        return totalSupply.mul(adjustedFraction).div(BASIS_POINTS);
    }

    /**
     * @dev Calculate voting power for an address
     */
    function calculateVotingPower(
        uint256 baseTokens,
        uint256 stakingMultiplier,
        uint256 reputationBonus,
        uint256 delegatedPower
    ) internal pure returns (uint256 totalPower) {
        // Calculate base power with multipliers
        uint256 basePower = baseTokens
            .mul(stakingMultiplier)
            .div(BASIS_POINTS)
            .mul(BASIS_POINTS.add(reputationBonus))
            .div(BASIS_POINTS);

        // Add delegated power
        totalPower = basePower.add(delegatedPower);
    }

    /**
     * @dev Check if a proposal has succeeded
     */
    function hasSucceeded(
        uint256 forVotes,
        uint256 againstVotes,
        uint256 totalVotes,
        uint256 quorum,
        ProposalType proposalType
    ) internal pure returns (bool succeeded) {
        // Check quorum
        if (totalVotes < quorum) {
            return false;
        }

        // Check majority based on proposal type
        if (proposalType == ProposalType.Emergency) {
            // Emergency proposals need supermajority (2/3)
            return forVotes.mul(3) > totalVotes.mul(2);
        } else if (proposalType == ProposalType.PlatformUpgrade) {
            // Platform upgrades need supermajority (2/3)
            return forVotes.mul(3) > totalVotes.mul(2);
        } else {
            // Standard proposals need simple majority
            return forVotes > againstVotes;
        }
    }

    /**
     * @dev Calculate proposal status based on current time and voting results
     */
    function calculateProposalStatus(
        ProposalCore memory proposal,
        uint256 currentTime
    ) internal pure returns (ProposalStatus newStatus) {
        if (
            proposal.status == ProposalStatus.Executed ||
            proposal.status == ProposalStatus.Cancelled
        ) {
            return proposal.status;
        }

        if (currentTime < proposal.votingStart) {
            return ProposalStatus.Pending;
        }

        if (currentTime <= proposal.votingEnd) {
            return ProposalStatus.Active;
        }

        // Voting has ended, determine result
        uint256 totalVotes = proposal.forVotes.add(proposal.againstVotes).add(
            proposal.abstainVotes
        );

        if (
            hasSucceeded(
                proposal.forVotes,
                proposal.againstVotes,
                totalVotes,
                proposal.quorum,
                proposal.proposalType
            )
        ) {
            return ProposalStatus.Succeeded;
        } else {
            return ProposalStatus.Defeated;
        }
    }

    /**
     * @dev Process vote and update tallies
     */
    function processVote(
        ProposalCore memory proposal,
        VoteChoice voteChoice,
        uint256 votingPower
    ) internal pure returns (ProposalCore memory updatedProposal) {
        updatedProposal = proposal;

        if (voteChoice == VoteChoice.For) {
            updatedProposal.forVotes = proposal.forVotes.add(votingPower);
        } else if (voteChoice == VoteChoice.Against) {
            updatedProposal.againstVotes = proposal.againstVotes.add(
                votingPower
            );
        } else if (voteChoice == VoteChoice.Abstain) {
            updatedProposal.abstainVotes = proposal.abstainVotes.add(
                votingPower
            );
        }
    }

    /**
     * @dev Calculate delegation power changes
     */
    function calculateDelegationChange(
        uint256 currentDelegatedPower,
        uint256 newDelegation,
        bool isRemoving
    ) internal pure returns (uint256 newDelegatedPower) {
        if (isRemoving) {
            require(
                currentDelegatedPower >= newDelegation,
                "GovernanceLibrary: Insufficient delegated power"
            );
            return currentDelegatedPower.sub(newDelegation);
        } else {
            return currentDelegatedPower.add(newDelegation);
        }
    }

    /**
     * @dev Validate voting eligibility
     */
    function validateVotingEligibility(
        address voter,
        uint256 proposalStart,
        uint256 proposalEnd,
        uint256 currentTime,
        bool hasVoted,
        uint256 votingPower
    ) internal pure returns (bool isEligible) {
        require(voter != address(0), "GovernanceLibrary: Invalid voter");
        require(
            currentTime >= proposalStart,
            "GovernanceLibrary: Voting not started"
        );
        require(currentTime <= proposalEnd, "GovernanceLibrary: Voting ended");
        require(!hasVoted, "GovernanceLibrary: Already voted");
        require(votingPower > 0, "GovernanceLibrary: No voting power");

        return true;
    }
}
