// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../interfaces/IGovernanceManager.sol";
import "../interfaces/IFundFlowCore.sol";
import "../libraries/GovernanceLibrary.sol";

/**
 * @title GovernanceManager
 * @dev Manages governance and voting functionality for FundFlow platform
 * @author FundFlow Team
 */
contract GovernanceManager is
    IGovernanceManager,
    ReentrancyGuard,
    Ownable,
    Pausable
{
    using SafeMath for uint256;

    // State variables
    uint256 private _proposalIdCounter;

    mapping(uint256 => ProposalData) private _proposals;
    mapping(uint256 => mapping(address => IFundFlowCore.Vote)) private _votes;
    mapping(uint256 => GovernanceConfig) private _governanceConfigs;
    mapping(uint256 => mapping(address => VotingPower)) private _votingPowers;
    mapping(uint256 => mapping(address => DelegationInfo)) private _delegations;
    mapping(uint256 => mapping(address => uint256)) private _governanceTokens;

    address public fundFlowCore;

    modifier onlyFundFlowCore() {
        require(msg.sender == fundFlowCore, "Only FundFlowCore can call this");
        _;
    }

    modifier validProposal(uint256 proposalId) {
        require(
            proposalId > 0 && proposalId <= _proposalIdCounter,
            "Invalid proposal ID"
        );
        _;
    }

    modifier validCampaign(uint256 campaignId) {
        require(campaignId > 0, "Invalid campaign ID");
        _;
    }

    constructor(address _fundFlowCore) {
        fundFlowCore = _fundFlowCore;
        _proposalIdCounter = 0;
    }

    /**
     * @dev Create a new governance proposal
     */
    function createProposal(
        uint256 campaignId,
        ProposalType proposalType,
        string memory title,
        string memory description,
        bytes memory executionData
    ) external override validCampaign(campaignId) returns (uint256 proposalId) {
        GovernanceConfig storage config = _governanceConfigs[campaignId];

        // Use library to validate proposal
        require(
            GovernanceLibrary.validateProposal(
                GovernanceLibrary.ProposalType(uint256(proposalType)),
                config.votingPeriod,
                config.executionDelay,
                msg.sender,
                config.minimumTokensToPropose,
                _governanceTokens[campaignId][msg.sender]
            ),
            "Invalid proposal"
        );

        // Increment proposal counter
        _proposalIdCounter = _proposalIdCounter.add(1);
        proposalId = _proposalIdCounter;

        // Create proposal using library struct
        ProposalData storage proposal = _proposals[proposalId];
        proposal.id = proposalId;
        proposal.campaignId = campaignId;
        proposal.proposer = msg.sender;
        proposal.proposalType = proposalType;
        proposal.title = title;
        proposal.description = description;
        proposal.executionData = executionData;
        proposal.creationTime = block.timestamp;
        proposal.votingStart = block.timestamp.add(config.votingDelay);
        proposal.votingEnd = proposal.votingStart.add(config.votingPeriod);
        proposal.executionDelay = config.executionDelay;
        proposal.status = ProposalStatus.Pending;

        // Use library to calculate quorum
        proposal.quorum = GovernanceLibrary.calculateQuorum(
            _getTotalSupply(campaignId),
            config.quorumFraction,
            GovernanceLibrary.ProposalType(uint256(proposalType))
        );

        emit ProposalCreated(
            proposalId,
            msg.sender,
            campaignId,
            proposalType,
            title,
            proposal.votingEnd
        );

        return proposalId;
    }

    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(
        uint256 proposalId,
        bool support,
        string memory reason
    ) external override validProposal(proposalId) {
        ProposalData storage proposal = _proposals[proposalId];

        uint256 votingPower = this.getVotingPower(
            proposal.campaignId,
            msg.sender
        );

        // Use library to validate voting eligibility
        require(
            GovernanceLibrary.validateVotingEligibility(
                msg.sender,
                proposal.votingStart,
                proposal.votingEnd,
                block.timestamp,
                _votes[proposalId][msg.sender].hasVoted,
                votingPower
            ),
            "Not eligible to vote"
        );

        // Record vote
        _votes[proposalId][msg.sender] = IFundFlowCore.Vote({
            hasVoted: true,
            vote: support,
            votingPower: votingPower,
            timestamp: block.timestamp,
            reason: reason
        });

        // Update vote tallies using library
        GovernanceLibrary.VoteChoice voteChoice = support
            ? GovernanceLibrary.VoteChoice.For
            : GovernanceLibrary.VoteChoice.Against;

        GovernanceLibrary.ProposalCore memory proposalCore = GovernanceLibrary
            .ProposalCore({
                id: proposal.id,
                campaignId: proposal.campaignId,
                proposer: proposal.proposer,
                proposalType: GovernanceLibrary.ProposalType(
                    uint256(proposal.proposalType)
                ),
                creationTime: proposal.creationTime,
                votingStart: proposal.votingStart,
                votingEnd: proposal.votingEnd,
                executionDelay: proposal.executionDelay,
                status: GovernanceLibrary.ProposalStatus(
                    uint256(proposal.status)
                ),
                executed: proposal.executed,
                forVotes: proposal.forVotes,
                againstVotes: proposal.againstVotes,
                abstainVotes: proposal.abstainVotes,
                quorum: proposal.quorum
            });

        GovernanceLibrary.ProposalCore
            memory updatedProposal = GovernanceLibrary.processVote(
                proposalCore,
                voteChoice,
                votingPower
            );

        // Update storage with new vote tallies
        proposal.forVotes = updatedProposal.forVotes;
        proposal.againstVotes = updatedProposal.againstVotes;
        proposal.abstainVotes = updatedProposal.abstainVotes;

        emit VoteCast(proposalId, msg.sender, support, votingPower, reason);

        // Update proposal status using library
        _updateProposalStatusUsingLibrary(proposalId);
    }

    /**
     * @dev Cast vote with signature (for gasless voting)
     */
    function castVoteWithSig(
        uint256 proposalId,
        bool support,
        string memory reason,
        uint8 /* v */,
        bytes32 /* r */,
        bytes32 /* s */
    ) external override validProposal(proposalId) {
        // Signature verification would go here
        // For now, just delegate to regular voting
        this.castVote(proposalId, support, reason);
    }

    /**
     * @dev Execute a proposal that has been approved
     */
    function executeProposal(
        uint256 proposalId
    ) external override validProposal(proposalId) {
        ProposalData storage proposal = _proposals[proposalId];
        require(
            proposal.status == ProposalStatus.Queued,
            "Proposal not queued"
        );
        require(
            block.timestamp >= proposal.votingEnd.add(proposal.executionDelay),
            "Execution delay not met"
        );

        // Check if proposal succeeded
        bool succeeded = GovernanceLibrary.hasSucceeded(
            proposal.forVotes,
            proposal.againstVotes,
            proposal.forVotes.add(proposal.againstVotes),
            proposal.quorum,
            GovernanceLibrary.ProposalType(uint256(proposal.proposalType))
        );

        require(succeeded, "Proposal did not succeed");

        proposal.status = ProposalStatus.Executed;
        proposal.executed = true;

        // Execute proposal logic based on type
        bytes32 executionHash = _executeProposalLogic(proposal);

        emit ProposalExecuted(proposalId, true, executionHash);
    }

    /**
     * @dev Cancel a proposal
     */
    function cancelProposal(
        uint256 proposalId
    ) external override validProposal(proposalId) {
        ProposalData storage proposal = _proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Not authorized to cancel"
        );
        require(
            proposal.status != ProposalStatus.Executed,
            "Cannot cancel executed proposal"
        );

        proposal.status = ProposalStatus.Cancelled;
    }

    /**
     * @dev Queue a proposal for execution
     */
    function queueProposal(
        uint256 proposalId
    ) external override validProposal(proposalId) {
        ProposalData storage proposal = _proposals[proposalId];
        require(block.timestamp > proposal.votingEnd, "Voting not ended");
        require(
            proposal.status == ProposalStatus.Pending,
            "Proposal not pending"
        );

        // Check if proposal succeeded
        bool succeeded = GovernanceLibrary.hasSucceeded(
            proposal.forVotes,
            proposal.againstVotes,
            proposal.forVotes.add(proposal.againstVotes),
            proposal.quorum,
            GovernanceLibrary.ProposalType(uint256(proposal.proposalType))
        );

        if (succeeded) {
            proposal.status = ProposalStatus.Queued;
        } else {
            proposal.status = ProposalStatus.Defeated;
        }
    }

    // Delegation functions

    /**
     * @dev Delegate voting power to another address
     */
    function delegate(
        uint256 campaignId,
        address delegatee
    ) external override validCampaign(campaignId) {
        require(delegatee != address(0), "Cannot delegate to zero address");
        require(delegatee != msg.sender, "Cannot delegate to self");

        DelegationInfo storage delegation = _delegations[campaignId][
            msg.sender
        ];

        // Remove previous delegation
        if (delegation.isActive) {
            _votingPowers[campaignId][delegation.delegate]
                .delegatedPower = GovernanceLibrary.calculateDelegationChange(
                _votingPowers[campaignId][delegation.delegate].delegatedPower,
                delegation.delegatedPower,
                true // isRemoving = true
            );
        }

        // Set new delegation
        uint256 delegatedPower = _governanceTokens[campaignId][msg.sender];
        delegation.delegate = delegatee;
        delegation.delegatedPower = delegatedPower;
        delegation.delegationTime = block.timestamp;
        delegation.isActive = true;

        // Update delegatee's voting power using library
        _votingPowers[campaignId][delegatee].delegatedPower = GovernanceLibrary
            .calculateDelegationChange(
                _votingPowers[campaignId][delegatee].delegatedPower,
                delegatedPower,
                false // isRemoving = false
            );

        emit DelegationUpdated(
            msg.sender,
            delegatee,
            campaignId,
            delegatedPower
        );
    }

    /**
     * @dev Remove delegation
     */
    function undelegate(
        uint256 campaignId
    ) external override validCampaign(campaignId) {
        DelegationInfo storage delegation = _delegations[campaignId][
            msg.sender
        ];
        require(delegation.isActive, "No active delegation");

        // Use library to calculate delegation change
        _votingPowers[campaignId][delegation.delegate]
            .delegatedPower = GovernanceLibrary.calculateDelegationChange(
            _votingPowers[campaignId][delegation.delegate].delegatedPower,
            delegation.delegatedPower,
            true // isRemoving = true
        );

        // Clear delegation
        delegation.isActive = false;
        delegation.delegatedPower = 0;

        emit DelegationUpdated(msg.sender, address(0), campaignId, 0);
    }

    /**
     * @dev Get delegation information
     */
    function getDelegationInfo(
        uint256 campaignId,
        address delegator
    ) external view override returns (DelegationInfo memory) {
        return _delegations[campaignId][delegator];
    }

    // Token management functions

    /**
     * @dev Allocate governance tokens
     */
    function allocateGovernanceTokens(
        uint256 campaignId,
        address recipient,
        uint256 amount,
        TokenAllocationReason reason
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        _governanceTokens[campaignId][recipient] = _governanceTokens[
            campaignId
        ][recipient].add(amount);

        // Update voting power
        this.updateVotingPower(campaignId, recipient);

        emit GovernanceTokensAllocated(campaignId, recipient, amount, reason);
    }

    /**
     * @dev Burn governance tokens
     */
    function burnGovernanceTokens(
        uint256 campaignId,
        address holder,
        uint256 amount
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        require(
            _governanceTokens[campaignId][holder] >= amount,
            "Insufficient tokens"
        );

        _governanceTokens[campaignId][holder] = _governanceTokens[campaignId][
            holder
        ].sub(amount);

        // Update voting power
        this.updateVotingPower(campaignId, holder);
    }

    /**
     * @dev Transfer governance tokens
     */
    function transferGovernanceTokens(
        uint256 campaignId,
        address from,
        address to,
        uint256 amount
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        require(
            _governanceTokens[campaignId][from] >= amount,
            "Insufficient tokens"
        );

        _governanceTokens[campaignId][from] = _governanceTokens[campaignId][
            from
        ].sub(amount);
        _governanceTokens[campaignId][to] = _governanceTokens[campaignId][to]
            .add(amount);

        // Update voting power for both addresses
        this.updateVotingPower(campaignId, from);
        this.updateVotingPower(campaignId, to);
    }

    // Voting power calculations

    /**
     * @dev Calculate voting power for an address
     */
    function calculateVotingPower(
        uint256 campaignId,
        address voter
    ) external view override returns (VotingPower memory) {
        return _votingPowers[campaignId][voter];
    }

    /**
     * @dev Update voting power for an address
     */
    function updateVotingPower(
        uint256 campaignId,
        address voter
    ) external override validCampaign(campaignId) {
        VotingPower storage power = _votingPowers[campaignId][voter];

        power.baseTokens = _governanceTokens[campaignId][voter];
        power.stakingMultiplier = 10000; // 1x multiplier (no staking for now)
        power.reputationBonus = 0; // No reputation system for now
        // delegatedPower is updated in delegation functions

        // Use library to calculate voting power
        power.totalPower = GovernanceLibrary.calculateVotingPower(
            power.baseTokens,
            power.stakingMultiplier,
            power.reputationBonus,
            power.delegatedPower
        );

        power.lastUpdate = block.timestamp;

        emit VotingPowerUpdated(voter, campaignId, power.totalPower);
    }

    /**
     * @dev Get voting power for an address
     */
    function getVotingPower(
        uint256 campaignId,
        address voter
    ) external view override returns (uint256) {
        return _votingPowers[campaignId][voter].totalPower;
    }

    // Configuration management

    /**
     * @dev Set governance configuration
     */
    function setGovernanceConfig(
        uint256 campaignId,
        GovernanceConfig memory config
    ) external onlyFundFlowCore validCampaign(campaignId) {
        // Convert interface struct to library struct
        GovernanceLibrary.GovernanceConfig memory libConfig = GovernanceLibrary
            .GovernanceConfig({
                votingDelay: config.votingDelay,
                votingPeriod: config.votingPeriod,
                proposalThreshold: config.proposalThreshold,
                quorumFraction: config.quorumFraction,
                executionDelay: config.executionDelay,
                requiresTokens: config.requiresTokens,
                minimumTokensToPropose: config.minimumTokensToPropose,
                minimumTokensToVote: config.minimumTokensToVote
            });

        require(
            GovernanceLibrary.validateGovernanceConfig(libConfig),
            "Invalid config"
        );

        _governanceConfigs[campaignId] = config;
    }

    /**
     * @dev Update governance configuration
     */
    function updateGovernanceConfig(
        uint256 campaignId,
        GovernanceConfig memory config
    ) external override onlyFundFlowCore validCampaign(campaignId) {
        // Convert interface struct to library struct
        GovernanceLibrary.GovernanceConfig memory libConfig = GovernanceLibrary
            .GovernanceConfig({
                votingDelay: config.votingDelay,
                votingPeriod: config.votingPeriod,
                proposalThreshold: config.proposalThreshold,
                quorumFraction: config.quorumFraction,
                executionDelay: config.executionDelay,
                requiresTokens: config.requiresTokens,
                minimumTokensToPropose: config.minimumTokensToPropose,
                minimumTokensToVote: config.minimumTokensToVote
            });

        require(
            GovernanceLibrary.validateGovernanceConfig(libConfig),
            "Invalid config"
        );

        _governanceConfigs[campaignId] = config;
    }

    /**
     * @dev Update quorum for a campaign
     */
    function updateQuorum(
        uint256 campaignId,
        uint256 newQuorum
    ) external override onlyOwner validCampaign(campaignId) {
        _governanceConfigs[campaignId].quorumFraction = newQuorum;

        emit QuorumUpdated(campaignId, newQuorum);
    }

    /**
     * @dev Update voting period
     */
    function updateVotingPeriod(
        uint256 campaignId,
        uint256 newPeriod
    ) external override onlyOwner validCampaign(campaignId) {
        _governanceConfigs[campaignId].votingPeriod = newPeriod;
    }

    /**
     * @dev Update proposal threshold
     */
    function updateProposalThreshold(
        uint256 campaignId,
        uint256 newThreshold
    ) external override onlyOwner validCampaign(campaignId) {
        _governanceConfigs[campaignId].proposalThreshold = newThreshold;
    }

    // View functions

    /**
     * @dev Get proposal information
     */
    function getProposal(
        uint256 proposalId
    )
        external
        view
        override
        validProposal(proposalId)
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
        )
    {
        ProposalData storage proposal = _proposals[proposalId];
        return (
            proposal.id,
            proposal.campaignId,
            proposal.proposer,
            proposal.proposalType,
            proposal.title,
            proposal.description,
            proposal.creationTime,
            proposal.votingStart,
            proposal.votingEnd,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            proposal.status
        );
    }

    /**
     * @dev Get vote information
     */
    function getVote(
        uint256 proposalId,
        address voter
    ) external view override returns (IFundFlowCore.Vote memory) {
        return _votes[proposalId][voter];
    }

    /**
     * @dev Get governance configuration
     */
    function getGovernanceConfig(
        uint256 campaignId
    ) external view override returns (GovernanceConfig memory) {
        return _governanceConfigs[campaignId];
    }

    /**
     * @dev Get active proposals for a campaign
     */
    function getActiveProposals(
        uint256 /* campaignId */
    ) external pure override returns (uint256[] memory) {
        // Would maintain a list of active proposals per campaign
        return new uint256[](0);
    }

    /**
     * @dev Get proposal history for a campaign
     */
    function getProposalHistory(
        uint256 /* campaignId */
    ) external pure override returns (uint256[] memory) {
        // Would maintain proposal history per campaign
        return new uint256[](0);
    }

    /**
     * @dev Get user's proposals
     */
    function getUserProposals(
        address /* user */
    ) external pure override returns (uint256[] memory) {
        // Would maintain user proposal mapping
        return new uint256[](0);
    }

    /**
     * @dev Get user's votes
     */
    function getUserVotes(
        address /* user */
    ) external pure override returns (uint256[] memory) {
        // Would maintain user vote mapping
        return new uint256[](0);
    }

    /**
     * @dev Get governance statistics
     */
    function getGovernanceStats(
        uint256 campaignId
    )
        external
        view
        override
        returns (
            uint256 totalProposals,
            uint256 executedProposals,
            uint256 totalVoters,
            uint256 averageParticipation,
            uint256 totalGovernanceTokens
        )
    {
        // Would calculate from stored data
        return (0, 0, 0, 0, _getTotalSupply(campaignId));
    }

    // Proposal status functions

    function getProposalStatus(
        uint256 proposalId
    ) external view override returns (ProposalStatus) {
        return _proposals[proposalId].status;
    }

    function hasVoted(
        uint256 proposalId,
        address voter
    ) external view override returns (bool) {
        return _votes[proposalId][voter].hasVoted;
    }

    function canExecute(
        uint256 proposalId
    ) external view override returns (bool) {
        ProposalData storage proposal = _proposals[proposalId];
        return
            proposal.status == ProposalStatus.Queued &&
            block.timestamp >= proposal.votingEnd.add(proposal.executionDelay);
    }

    function canCancel(
        uint256 proposalId
    ) external view override returns (bool) {
        ProposalData storage proposal = _proposals[proposalId];
        return proposal.status != ProposalStatus.Executed;
    }

    function getQuorum(
        uint256 proposalId
    ) external view override returns (uint256) {
        return _proposals[proposalId].quorum;
    }

    function getVotingResults(
        uint256 proposalId
    )
        external
        view
        override
        returns (
            uint256 forVotes,
            uint256 againstVotes,
            uint256 abstainVotes,
            uint256 totalVotes,
            bool quorumReached
        )
    {
        ProposalData storage proposal = _proposals[proposalId];
        totalVotes = proposal.forVotes.add(proposal.againstVotes).add(
            proposal.abstainVotes
        );
        quorumReached = totalVotes >= proposal.quorum;

        return (
            proposal.forVotes,
            proposal.againstVotes,
            proposal.abstainVotes,
            totalVotes,
            quorumReached
        );
    }

    // Emergency functions

    function emergencyPause(
        uint256 /* campaignId */
    ) external override onlyOwner {
        // Pause governance for a campaign
    }

    function emergencyUnpause(
        uint256 /* campaignId */
    ) external override onlyOwner {
        // Unpause governance for a campaign
    }

    function emergencyExecute(
        uint256 /* proposalId */,
        bytes memory /* executionData */
    ) external override onlyOwner {
        // Emergency execute a proposal
    }

    // Integration functions

    function integrateWithOracle(
        address /* oracleAddress */
    ) external override onlyOwner {
        // Integrate with external oracle
    }

    function updateReputationScoring(
        address /* scoringContract */
    ) external override onlyOwner {
        // Update reputation scoring contract
    }

    function syncWithCampaignManager(
        address /* campaignManager */
    ) external override onlyOwner {
        // Sync with campaign manager
    }

    // Internal functions

    function _updateProposalStatus(uint256 proposalId) internal {
        _updateProposalStatusUsingLibrary(proposalId);
    }

    function _updateProposalStatusUsingLibrary(uint256 proposalId) internal {
        ProposalData storage proposal = _proposals[proposalId];

        // Create library proposal struct
        GovernanceLibrary.ProposalCore memory proposalCore = GovernanceLibrary
            .ProposalCore({
                id: proposal.id,
                campaignId: proposal.campaignId,
                proposer: proposal.proposer,
                proposalType: GovernanceLibrary.ProposalType(
                    uint256(proposal.proposalType)
                ),
                creationTime: proposal.creationTime,
                votingStart: proposal.votingStart,
                votingEnd: proposal.votingEnd,
                executionDelay: proposal.executionDelay,
                status: GovernanceLibrary.ProposalStatus(
                    uint256(proposal.status)
                ),
                executed: proposal.executed,
                forVotes: proposal.forVotes,
                againstVotes: proposal.againstVotes,
                abstainVotes: proposal.abstainVotes,
                quorum: proposal.quorum
            });

        // Use library to calculate new status
        GovernanceLibrary.ProposalStatus newStatus = GovernanceLibrary
            .calculateProposalStatus(proposalCore, block.timestamp);

        // Update storage
        proposal.status = ProposalStatus(uint256(newStatus));
    }

    function _executeProposalLogic(
        ProposalData storage proposal
    ) internal returns (bytes32) {
        // Execute proposal based on type
        if (proposal.proposalType == ProposalType.FundRelease) {
            // Release funds logic
        } else if (proposal.proposalType == ProposalType.CampaignTermination) {
            // Terminate campaign logic
        }
        // Add more proposal types as needed

        return keccak256(abi.encodePacked(proposal.id, block.timestamp));
    }

    function _getTotalSupply(
        uint256 /* campaignId */
    ) internal pure returns (uint256) {
        // Would calculate total governance tokens for campaign
        return 1000000; // Placeholder
    }
}
