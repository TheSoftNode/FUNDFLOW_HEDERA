// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IFundFlow
 * @dev Interface for the main FundFlow contract
 * @author FundFlow Team
 */
interface IFundFlow {
    // Structs
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 deadline;
        bool isActive;
        uint256 milestoneCount;
        uint256 totalInvestors;
    }

    struct Milestone {
        string title;
        string description;
        uint256 targetAmount;
        bool isCompleted;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votingDeadline;
    }

    struct Investment {
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 targetAmount,
        uint256 deadline
    );

    event InvestmentMade(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount,
        uint256 netAmount
    );

    event MilestoneAdded(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        string title,
        uint256 targetAmount,
        uint256 votingDeadline
    );

    event MilestoneVoted(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        address indexed voter,
        bool vote,
        uint256 votingPower
    );

    event MilestoneFundsReleased(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        address indexed recipient,
        uint256 amount
    );

    event CampaignCancelled(
        uint256 indexed campaignId,
        address indexed creator,
        string reason
    );

    event RefundIssued(
        uint256 indexed campaignId,
        address indexed investor,
        uint256 amount
    );

    // Core Functions
    function createCampaign(
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 durationDays
    ) external returns (uint256);

    function investInCampaign(uint256 campaignId) external payable;

    function addMilestone(
        uint256 campaignId,
        string memory title,
        string memory description,
        uint256 targetAmount,
        uint256 votingDurationDays
    ) external returns (uint256);

    function voteOnMilestone(
        uint256 campaignId,
        uint256 milestoneId,
        bool voteFor
    ) external;

    function releaseMilestoneFunds(
        uint256 campaignId,
        uint256 milestoneId
    ) external;

    function cancelCampaign(uint256 campaignId, string memory reason) external;

    function claimRefund(uint256 campaignId) external;

    // View Functions
    function getCampaign(
        uint256 campaignId
    ) external view returns (Campaign memory);

    function getMilestone(
        uint256 campaignId,
        uint256 milestoneId
    ) external view returns (Milestone memory);

    function getInvestment(
        uint256 campaignId,
        address investor
    ) external view returns (uint256);

    function getCampaignInvestors(
        uint256 campaignId
    ) external view returns (address[] memory);

    function calculatePlatformFee(
        uint256 amount
    ) external view returns (uint256);

    function getNextCampaignId() external view returns (uint256);

    function getTotalCampaigns() external view returns (uint256);

    function getTotalValueLocked() external view returns (uint256);
}
