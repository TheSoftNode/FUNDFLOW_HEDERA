// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IFundFlowCore
 * @dev Core interface for FundFlow fundraising platform
 * @author FundFlow Team
 */
interface IFundFlowCore {
    // Enums
    enum CampaignStatus {
        Draft,
        Active,
        Funded,
        Completed,
        Cancelled,
        Failed,
        Expired
    }
    enum MilestoneStatus {
        Pending,
        VotingOpen,
        Approved,
        Rejected,
        Completed,
        Expired
    }
    enum InvestmentType {
        HBAR,
        Token
    }
    enum RefundReason {
        CampaignFailed,
        CampaignCancelled,
        InvestorRequest,
        Emergency
    }
    enum CampaignCategory {
        Technology,
        Healthcare,
        Finance,
        Gaming,
        Education,
        Other
    }

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 targetAmount,
        uint256 deadline,
        CampaignCategory category
    );

    event InvestmentMade(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        uint256 netAmount,
        uint256 platformFee,
        uint256 equityTokens
    );

    event MilestoneCreated(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        string title,
        uint256 fundingPercentage,
        uint256 votingPeriod
    );

    event MilestoneVoteSubmitted(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        address indexed voter,
        bool vote,
        uint256 votingPower,
        string reason
    );

    event MilestoneCompleted(
        uint256 indexed campaignId,
        uint256 indexed milestoneIndex,
        uint256 fundsReleased,
        uint256 approvalRate
    );

    event CampaignStatusChanged(
        uint256 indexed campaignId,
        CampaignStatus oldStatus,
        CampaignStatus newStatus,
        string reason
    );

    event RefundIssued(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        string reason
    );

    event EquityTokensDistributed(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 tokens,
        uint256 totalSupply
    );

    // Structs
    struct CreateCampaignRequest {
        string title;
        string description;
        string category;
        uint256 fundingGoal;
        uint256 duration;
        uint256 platformFeePercentage;
        string[] tags;
    }

    struct Campaign {
        address creator;
        string title;
        string description;
        string ipfsHash; // Detailed docs, business plan, etc.
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 deadline;
        CampaignStatus status;
        CampaignCategory category;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 milestoneCount;
        uint256 totalInvestors;
        uint256 equityTokensIssued;
        bool emergencyRefundEnabled;
        address[] investors;
        mapping(address => Investment) investments;
    }

    struct Investment {
        uint256 amount;
        uint256 timestamp;
        uint256 equityTokens;
        bool refunded;
        InvestmentType investmentType;
    }

    struct Milestone {
        string title;
        string description;
        string deliverableHash; // IPFS hash of deliverables
        uint256 fundingPercentage; // Percentage of total funds to release
        uint256 votingDeadline;
        uint256 submissionDeadline;
        MilestoneStatus status;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 totalVotingPower;
        uint256 approvalThreshold; // Percentage needed to approve
        bool fundsReleased;
        uint256 releasedAmount;
        address[] voters;
        mapping(address => Vote) votes;
    }

    struct Vote {
        bool hasVoted;
        bool vote; // true = approve, false = reject
        uint256 votingPower;
        uint256 timestamp;
        string reason; // Optional voting reason
    }

    struct CampaignMetrics {
        uint256 averageInvestment;
        uint256 completedMilestones;
        uint256 totalMilestones;
        uint256 successRate; // Percentage of completed milestones
        uint256 daysRemaining;
        uint256 fundingProgress; // Percentage of target reached
    }

    // Core Functions
    function createCampaign(
        string memory title,
        string memory description,
        string memory ipfsHash,
        uint256 targetAmount,
        uint256 durationDays,
        CampaignCategory category,
        uint256[] memory milestoneFundingPercentages,
        string[] memory milestoneTitles,
        string[] memory milestoneDescriptions
    ) external returns (uint256 campaignId);

    function investInCampaign(uint256 campaignId) external payable;

    function submitMilestoneDeliverable(
        uint256 campaignId,
        uint256 milestoneIndex,
        string memory deliverableHash
    ) external;

    function voteOnMilestone(
        uint256 campaignId,
        uint256 milestoneIndex,
        bool vote,
        string memory reason
    ) external;

    function completeMilestone(
        uint256 campaignId,
        uint256 milestoneIndex
    ) external;

    function requestRefund(uint256 campaignId) external;

    function emergencyRefund(uint256 campaignId) external;

    // View Functions
    function getCampaign(
        uint256 campaignId
    )
        external
        view
        returns (
            address creator,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 raisedAmount,
            uint256 deadline,
            CampaignStatus status,
            CampaignCategory category
        );

    function getMilestone(
        uint256 campaignId,
        uint256 milestoneIndex
    )
        external
        view
        returns (
            string memory title,
            string memory description,
            uint256 fundingPercentage,
            MilestoneStatus status,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 approvalThreshold
        );

    function getInvestment(
        uint256 campaignId,
        address investor
    )
        external
        view
        returns (uint256 amount, uint256 equityTokens, bool refunded);

    function getCampaignMetrics(
        uint256 campaignId
    ) external view returns (CampaignMetrics memory);

    function getVotingPower(
        uint256 campaignId,
        address voter
    ) external view returns (uint256);

    function getTotalCampaigns() external view returns (uint256);

    function getPlatformMetrics()
        external
        view
        returns (
            uint256 totalCampaigns,
            uint256 totalFundsRaised,
            uint256 totalInvestors,
            uint256 successfulCampaigns,
            uint256 platformFeesCollected
        );
}
