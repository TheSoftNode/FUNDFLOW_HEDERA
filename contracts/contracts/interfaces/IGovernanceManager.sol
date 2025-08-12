// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IFundFlowCore.sol";

/**
 * @title IGovernanceManager
 * @dev Interface for comprehensive governance and voting functionality
 * @author FundFlow Team
 */
interface IGovernanceManager {
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        uint256 indexed campaignId,
        ProposalType proposalType,
        string description,
        uint256 votingDeadline
    );

    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votingPower,
        string reason
    );

    event ProposalExecuted(
        uint256 indexed proposalId,
        bool successful,
        bytes32 executionHash
    );

    event GovernanceTokensAllocated(
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount,
        TokenAllocationReason reason
    );

    event VotingPowerUpdated(
        address indexed voter,
        uint256 campaignId,
        uint256 newVotingPower
    );

    event DelegationUpdated(
        address indexed delegator,
        address indexed delegate,
        uint256 campaignId,
        uint256 votingPower
    );

    event QuorumUpdated(uint256 indexed campaignId, uint256 newQuorum);

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

    enum TokenAllocationReason {
        InitialInvestment,
        MilestoneCompletion,
        GovernanceParticipation,
        PerformanceBonus,
        ReferralReward
    }

    // Structs
    struct ProposalData {
        uint256 id;
        uint256 campaignId;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        bytes executionData;
        uint256 creationTime;
        uint256 votingStart;
        uint256 votingEnd;
        uint256 executionDelay;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 quorum;
        ProposalStatus status;
        bool executed;
    }

    // Note: Vote struct is defined in IFundFlowCore

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

    struct VotingPower {
        uint256 baseTokens;
        uint256 stakingMultiplier;
        uint256 reputationBonus;
        uint256 delegatedPower;
        uint256 totalPower;
        uint256 lastUpdate;
    }

    struct DelegationInfo {
        address delegate;
        uint256 delegatedPower;
        uint256 delegationTime;
        bool isActive;
    }

    // Core Governance Functions
    function createProposal(
        uint256 campaignId,
        ProposalType proposalType,
        string memory title,
        string memory description,
        bytes memory executionData
    ) external returns (uint256 proposalId);

    function castVote(
        uint256 proposalId,
        bool support,
        string memory reason
    ) external;

    function castVoteWithSig(
        uint256 proposalId,
        bool support,
        string memory reason,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function executeProposal(uint256 proposalId) external;

    function cancelProposal(uint256 proposalId) external;

    function queueProposal(uint256 proposalId) external;

    // Delegation Functions
    function delegate(uint256 campaignId, address delegatee) external;
    function undelegate(uint256 campaignId) external;
    function getDelegationInfo(
        uint256 campaignId,
        address delegator
    ) external view returns (DelegationInfo memory);

    // Token Management
    function allocateGovernanceTokens(
        uint256 campaignId,
        address recipient,
        uint256 amount,
        TokenAllocationReason reason
    ) external;

    function burnGovernanceTokens(
        uint256 campaignId,
        address holder,
        uint256 amount
    ) external;

    function transferGovernanceTokens(
        uint256 campaignId,
        address from,
        address to,
        uint256 amount
    ) external;

    // Voting Power Calculations
    function calculateVotingPower(
        uint256 campaignId,
        address voter
    ) external view returns (VotingPower memory);

    function updateVotingPower(uint256 campaignId, address voter) external;

    function getVotingPower(
        uint256 campaignId,
        address voter
    ) external view returns (uint256);

    // Configuration Management
    function updateGovernanceConfig(
        uint256 campaignId,
        GovernanceConfig memory config
    ) external;

    function updateQuorum(uint256 campaignId, uint256 newQuorum) external;

    function updateVotingPeriod(uint256 campaignId, uint256 newPeriod) external;

    function updateProposalThreshold(
        uint256 campaignId,
        uint256 newThreshold
    ) external;

    // View Functions
    function getProposal(
        uint256 proposalId
    )
        external
        view
        returns (
            uint256 id,
            uint256 campaignId,
            address proposer,
            ProposalType proposalType,
            string memory title,
            string memory description,
            uint256 creationTime,
            uint256 votingStart,
            uint256 votingEnd,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            ProposalStatus status
        );

    function getVote(
        uint256 proposalId,
        address voter
    ) external view returns (IFundFlowCore.Vote memory);

    function getGovernanceConfig(
        uint256 campaignId
    ) external view returns (GovernanceConfig memory);

    function getActiveProposals(
        uint256 campaignId
    ) external view returns (uint256[] memory);

    function getProposalHistory(
        uint256 campaignId
    ) external view returns (uint256[] memory);

    function getUserProposals(
        address user
    ) external view returns (uint256[] memory);

    function getUserVotes(
        address user
    ) external view returns (uint256[] memory);

    function getGovernanceStats(
        uint256 campaignId
    )
        external
        view
        returns (
            uint256 totalProposals,
            uint256 executedProposals,
            uint256 totalVoters,
            uint256 averageParticipation,
            uint256 totalGovernanceTokens
        );

    // Proposal Status Functions
    function getProposalStatus(
        uint256 proposalId
    ) external view returns (ProposalStatus);

    function hasVoted(
        uint256 proposalId,
        address voter
    ) external view returns (bool);

    function canExecute(uint256 proposalId) external view returns (bool);

    function canCancel(uint256 proposalId) external view returns (bool);

    function getQuorum(uint256 proposalId) external view returns (uint256);

    function getVotingResults(
        uint256 proposalId
    )
        external
        view
        returns (
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            uint256 totalVotes,
            bool quorumReached
        );

    // Emergency Functions
    function emergencyPause(uint256 campaignId) external;
    function emergencyUnpause(uint256 campaignId) external;
    function emergencyExecute(
        uint256 proposalId,
        bytes memory executionData
    ) external;

    // Integration Functions
    function integrateWithOracle(address oracleAddress) external;
    function updateReputationScoring(address scoringContract) external;
    function syncWithCampaignManager(address campaignManager) external;
}
