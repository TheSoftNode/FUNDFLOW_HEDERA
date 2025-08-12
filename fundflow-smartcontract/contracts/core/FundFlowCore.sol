// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "../interfaces/IFundFlowCore.sol";
import "../interfaces/ICampaignManager.sol";
import "../interfaces/IInvestmentManager.sol";
import "../interfaces/IMilestoneManager.sol";

/**
 * @title FundFlowCore
 * @dev Core contract for FundFlow fundraising platform on Hedera
 * @author FundFlow Team
 */
contract FundFlowCore is IFundFlowCore, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;

    // Counters
    Counters.Counter private _campaignIdCounter;
    Counters.Counter private _milestoneIdCounter;
    Counters.Counter private _investmentIdCounter;

    // Manager contracts
    ICampaignManager public campaignManager;
    IInvestmentManager public investmentManager;
    IMilestoneManager public milestoneManager;

    // Platform settings
    uint256 public platformFeePercent = 250; // 2.5%
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10%
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public totalPlatformFees;

    // Additional Events (not in interface)
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformFeesWithdrawn(address recipient, uint256 amount);
    event MilestoneStatusChanged(
        uint256 indexed campaignId,
        uint256 indexed milestoneId,
        MilestoneStatus status
    );

    // Local structs for storage (interface structs have mappings that can't be returned)
    struct StoredCampaign {
        uint256 id;
        address creator;
        string title;
        string description;
        string ipfsHash;
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
    }

    struct StoredMilestone {
        uint256 id;
        uint256 campaignId;
        string title;
        string description;
        uint256 targetAmount;
        MilestoneStatus status;
        uint256 votingDeadline;
        uint256 createdAt;
        uint256 approvalCount;
        uint256 rejectionCount;
        bool completed;
        string deliverableHash;
    }

    struct StoredInvestment {
        uint256 amount;
        uint256 timestamp;
        uint256 equityTokens;
        bool refunded;
        InvestmentType investmentType;
        address tokenAddress;
        address investor;
    }

    // Storage mappings
    mapping(uint256 => StoredCampaign) private _campaigns;
    mapping(uint256 => mapping(uint256 => StoredMilestone)) private _milestones;
    mapping(uint256 => mapping(address => StoredInvestment))
        private _investments;
    mapping(uint256 => address[]) private _campaignInvestors;
    mapping(uint256 => uint256[]) private _campaignMilestones;
    mapping(address => uint256[]) private _userCampaigns;
    mapping(address => uint256[]) private _userInvestments;

    constructor() {
        _campaignIdCounter.increment(); // Start from 1
    }

    /**
     * @dev Set manager contracts (only owner)
     */
    function setManagers(
        address _campaignManager,
        address _investmentManager,
        address _milestoneManager
    ) external onlyOwner {
        require(_campaignManager != address(0), "Invalid campaign manager");
        require(_investmentManager != address(0), "Invalid investment manager");
        require(_milestoneManager != address(0), "Invalid milestone manager");

        campaignManager = ICampaignManager(_campaignManager);
        investmentManager = IInvestmentManager(_investmentManager);
        milestoneManager = IMilestoneManager(_milestoneManager);
    }

    /**
     * @dev Create a new campaign
     */
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
    ) external override whenNotPaused returns (uint256 campaignId) {
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        require(targetAmount > 0, "Invalid target amount");
        require(durationDays > 0, "Invalid duration");
        require(
            milestoneTitles.length == milestoneDescriptions.length,
            "Milestone arrays mismatch"
        );
        require(
            milestoneFundingPercentages.length == milestoneTitles.length,
            "Milestone funding mismatch"
        );

        campaignId = _campaignIdCounter.current();
        _campaignIdCounter.increment();

        StoredCampaign storage campaign = _campaigns[campaignId];
        campaign.id = campaignId;
        campaign.creator = msg.sender;
        campaign.title = title;
        campaign.description = description;
        campaign.ipfsHash = ipfsHash;
        campaign.targetAmount = targetAmount;
        campaign.raisedAmount = 0;
        campaign.deadline = block.timestamp + (durationDays * 1 days);
        campaign.status = CampaignStatus.Active;
        campaign.category = category;
        campaign.createdAt = block.timestamp;
        campaign.updatedAt = block.timestamp;
        campaign.milestoneCount = milestoneTitles.length;
        campaign.totalInvestors = 0;
        campaign.equityTokensIssued = 0;
        campaign.emergencyRefundEnabled = false;

        _userCampaigns[msg.sender].push(campaignId);

        // Create milestones
        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            uint256 milestoneTarget = (targetAmount *
                milestoneFundingPercentages[i]) / 10000;

            StoredMilestone storage milestone = _milestones[campaignId][i];
            milestone.id = i;
            milestone.campaignId = campaignId;
            milestone.title = milestoneTitles[i];
            milestone.description = milestoneDescriptions[i];
            milestone.targetAmount = milestoneTarget;
            milestone.status = MilestoneStatus.Pending;
            milestone.votingDeadline = 0;
            milestone.createdAt = block.timestamp;
            milestone.approvalCount = 0;
            milestone.rejectionCount = 0;
            milestone.completed = false;
            milestone.deliverableHash = "";

            _campaignMilestones[campaignId].push(i);
        }

        emit CampaignCreated(
            campaignId,
            msg.sender,
            title,
            targetAmount,
            campaign.deadline,
            category
        );
    }

    /**
     * @dev Make an investment in a campaign
     */
    function investInCampaign(
        uint256 campaignId
    ) external payable override whenNotPaused nonReentrant {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(
            campaign.status == CampaignStatus.Active,
            "Campaign not active"
        );
        require(block.timestamp < campaign.deadline, "Campaign expired");
        require(msg.value > 0, "Investment amount must be greater than 0");

        uint256 investmentAmount = msg.value;

        // Calculate platform fee
        uint256 platformFee = (investmentAmount * platformFeePercent) /
            BASIS_POINTS;
        uint256 netInvestment = investmentAmount - platformFee;

        // Store investment
        StoredInvestment storage investment = _investments[campaignId][
            msg.sender
        ];
        if (investment.amount == 0) {
            _campaignInvestors[campaignId].push(msg.sender);
            _userInvestments[msg.sender].push(campaignId);
            campaign.totalInvestors++;
        }
        investment.amount += netInvestment;
        investment.investmentType = InvestmentType.HBAR;
        investment.tokenAddress = address(0);
        investment.timestamp = block.timestamp;
        investment.investor = msg.sender;
        investment.refunded = false;
        investment.equityTokens = 0;

        // Update campaign
        campaign.raisedAmount += netInvestment;
        campaign.updatedAt = block.timestamp;
        totalPlatformFees += platformFee;

        // Check if campaign is funded
        if (campaign.raisedAmount >= campaign.targetAmount) {
            CampaignStatus oldStatus = campaign.status;
            campaign.status = CampaignStatus.Funded;
            emit CampaignStatusChanged(
                campaignId,
                oldStatus,
                CampaignStatus.Funded,
                "Target amount reached"
            );
        }

        emit InvestmentMade(
            campaignId,
            msg.sender,
            investmentAmount,
            netInvestment,
            platformFee,
            0 // Equity tokens (not implemented yet)
        );
    }

    /**
     * @dev Submit milestone deliverable
     */
    function submitMilestoneDeliverable(
        uint256 campaignId,
        uint256 milestoneIndex,
        string memory deliverableHash
    ) external override whenNotPaused {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(campaign.creator == msg.sender, "Not campaign creator");
        require(
            milestoneIndex < campaign.milestoneCount,
            "Invalid milestone index"
        );
        require(bytes(deliverableHash).length > 0, "Deliverable hash required");

        StoredMilestone storage milestone = _milestones[campaignId][
            milestoneIndex
        ];
        require(
            milestone.status == MilestoneStatus.Pending,
            "Milestone not pending"
        );

        milestone.deliverableHash = deliverableHash;
        milestone.status = MilestoneStatus.VotingOpen;
        milestone.votingDeadline = block.timestamp + 7 days; // 7 days to vote
    }

    /**
     * @dev Vote on milestone
     */
    function voteOnMilestone(
        uint256 campaignId,
        uint256 milestoneIndex,
        bool vote,
        string memory reason
    ) external override whenNotPaused {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(
            milestoneIndex < campaign.milestoneCount,
            "Invalid milestone index"
        );

        StoredInvestment storage investment = _investments[campaignId][
            msg.sender
        ];
        require(investment.amount > 0, "Must be an investor to vote");

        StoredMilestone storage milestone = _milestones[campaignId][
            milestoneIndex
        ];
        require(
            milestone.status == MilestoneStatus.VotingOpen,
            "Voting not open"
        );
        require(
            block.timestamp <= milestone.votingDeadline,
            "Voting period ended"
        );

        // Record vote (simplified - in production would need vote tracking)
        if (vote) {
            milestone.approvalCount++;
        } else {
            milestone.rejectionCount++;
        }

        emit MilestoneVoteSubmitted(
            campaignId,
            milestoneIndex,
            msg.sender,
            vote,
            investment.amount, // Voting power based on investment amount
            reason
        );
    }

    /**
     * @dev Complete milestone
     */
    function completeMilestone(
        uint256 campaignId,
        uint256 milestoneIndex
    ) external override whenNotPaused {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(
            milestoneIndex < campaign.milestoneCount,
            "Invalid milestone index"
        );

        StoredMilestone storage milestone = _milestones[campaignId][
            milestoneIndex
        ];
        require(
            milestone.status == MilestoneStatus.VotingOpen,
            "Voting not open"
        );
        require(
            block.timestamp > milestone.votingDeadline,
            "Voting period not ended"
        );
        require(!milestone.completed, "Milestone already completed");

        // Check if milestone passed (simple majority)
        bool approved = milestone.approvalCount > milestone.rejectionCount;

        if (approved) {
            milestone.status = MilestoneStatus.Approved;
            milestone.completed = true;
            // Release funds to campaign creator
            uint256 releaseAmount = milestone.targetAmount;
            if (releaseAmount <= address(this).balance) {
                payable(campaign.creator).transfer(releaseAmount);
            }

            uint256 approvalRate = (milestone.approvalCount * 10000) /
                (milestone.approvalCount + milestone.rejectionCount);

            emit MilestoneCompleted(
                campaignId,
                milestoneIndex,
                releaseAmount,
                approvalRate
            );
        } else {
            milestone.status = MilestoneStatus.Rejected;
            emit MilestoneCompleted(campaignId, milestoneIndex, 0, 0);
        }
    }

    /**
     * @dev Request refund
     */
    function requestRefund(
        uint256 campaignId
    ) external override whenNotPaused nonReentrant {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");
        require(
            campaign.status == CampaignStatus.Failed ||
                campaign.status == CampaignStatus.Cancelled ||
                campaign.emergencyRefundEnabled,
            "Refund not available"
        );

        StoredInvestment storage investment = _investments[campaignId][
            msg.sender
        ];
        require(investment.amount > 0, "No investment to refund");
        require(!investment.refunded, "Already refunded");

        uint256 refundAmount = investment.amount;
        investment.refunded = true;
        investment.amount = 0;

        payable(msg.sender).transfer(refundAmount);
        emit RefundIssued(
            campaignId,
            msg.sender,
            refundAmount,
            "Campaign failed or cancelled"
        );
    }

    /**
     * @dev Emergency refund
     */
    function emergencyRefund(uint256 campaignId) external override onlyOwner {
        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");

        campaign.emergencyRefundEnabled = true;
        CampaignStatus oldStatus = campaign.status;
        campaign.status = CampaignStatus.Cancelled;
        campaign.updatedAt = block.timestamp;

        emit CampaignStatusChanged(
            campaignId,
            oldStatus,
            CampaignStatus.Cancelled,
            "Emergency refund enabled"
        );
    }

    // View functions
    function getCampaign(
        uint256 campaignId
    )
        external
        view
        override
        returns (
            address creator,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 raisedAmount,
            uint256 deadline,
            CampaignStatus status,
            CampaignCategory category
        )
    {
        StoredCampaign storage campaign = _campaigns[campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.targetAmount,
            campaign.raisedAmount,
            campaign.deadline,
            campaign.status,
            campaign.category
        );
    }

    function getMilestone(
        uint256 campaignId,
        uint256 milestoneIndex
    )
        external
        view
        override
        returns (
            string memory title,
            string memory description,
            uint256 fundingPercentage,
            MilestoneStatus status,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 approvalThreshold
        )
    {
        StoredMilestone storage milestone = _milestones[campaignId][
            milestoneIndex
        ];
        StoredCampaign storage campaign = _campaigns[campaignId];
        uint256 calculatedFundingPercentage = 0;
        if (campaign.targetAmount > 0) {
            calculatedFundingPercentage =
                (milestone.targetAmount * 10000) /
                campaign.targetAmount;
        }
        return (
            milestone.title,
            milestone.description,
            calculatedFundingPercentage,
            milestone.status,
            milestone.approvalCount,
            milestone.rejectionCount,
            6000 // Default 60% approval threshold
        );
    }

    function getInvestment(
        uint256 campaignId,
        address investor
    )
        external
        view
        override
        returns (uint256 amount, uint256 equityTokens, bool refunded)
    {
        StoredInvestment storage investment = _investments[campaignId][
            investor
        ];
        return (
            investment.amount,
            investment.equityTokens,
            investment.refunded
        );
    }

    function getCampaignInvestors(
        uint256 campaignId
    ) external view returns (address[] memory) {
        return _campaignInvestors[campaignId];
    }

    function getUserCampaigns(
        address user
    ) external view returns (uint256[] memory) {
        return _userCampaigns[user];
    }

    function getUserInvestments(
        address user
    ) external view returns (uint256[] memory) {
        return _userInvestments[user];
    }

    function getCampaignMilestones(
        uint256 campaignId
    ) external view returns (uint256[] memory) {
        return _campaignMilestones[campaignId];
    }

    function getNextCampaignId() external view returns (uint256) {
        return _campaignIdCounter.current();
    }

    function calculatePlatformFee(
        uint256 amount
    ) external view returns (uint256) {
        return (amount * platformFeePercent) / BASIS_POINTS;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTotalCampaigns() external view override returns (uint256) {
        return _campaignIdCounter.current() - 1;
    }

    function getVotingPower(
        uint256 campaignId,
        address voter
    ) external view override returns (uint256) {
        StoredInvestment storage investment = _investments[campaignId][voter];
        return investment.amount; // Voting power based on investment amount
    }

    function getCampaignMetrics(
        uint256 campaignId
    ) external view override returns (CampaignMetrics memory) {
        StoredCampaign storage campaign = _campaigns[campaignId];

        uint256 completedMilestones = 0;
        uint256 totalMilestones = campaign.milestoneCount;

        for (uint256 i = 0; i < totalMilestones; i++) {
            if (_milestones[campaignId][i].completed) {
                completedMilestones++;
            }
        }

        uint256 daysRemaining = 0;
        if (block.timestamp < campaign.deadline) {
            daysRemaining = (campaign.deadline - block.timestamp) / 1 days;
        }

        uint256 averageInvestment = 0;
        if (campaign.totalInvestors > 0) {
            averageInvestment = campaign.raisedAmount / campaign.totalInvestors;
        }

        return
            CampaignMetrics({
                averageInvestment: averageInvestment,
                completedMilestones: completedMilestones,
                totalMilestones: totalMilestones,
                successRate: totalMilestones > 0
                    ? (completedMilestones * 10000) / totalMilestones
                    : 0,
                daysRemaining: daysRemaining,
                fundingProgress: campaign.targetAmount > 0
                    ? (campaign.raisedAmount * 10000) / campaign.targetAmount
                    : 0
            });
    }

    function getPlatformMetrics()
        external
        view
        override
        returns (
            uint256 totalCampaigns,
            uint256 totalFundsRaised,
            uint256 totalInvestors,
            uint256 successfulCampaigns,
            uint256 platformFeesCollected
        )
    {
        uint256 calculatedTotalFundsRaised = 0;
        uint256 calculatedSuccessfulCampaigns = 0;
        uint256 totalCampaignsCount = _campaignIdCounter.current() - 1;

        // Calculate total funds raised and successful campaigns
        for (uint256 i = 1; i <= totalCampaignsCount; i++) {
            StoredCampaign storage campaign = _campaigns[i];
            if (campaign.id != 0) {
                calculatedTotalFundsRaised += campaign.raisedAmount;
                if (
                    campaign.status == CampaignStatus.Completed ||
                    campaign.status == CampaignStatus.Funded
                ) {
                    calculatedSuccessfulCampaigns++;
                }
            }
        }

        return (
            totalCampaignsCount,
            calculatedTotalFundsRaised,
            0, // Would need to calculate unique investors across all campaigns
            calculatedSuccessfulCampaigns,
            totalPlatformFees
        );
    }

    // Admin functions
    function setPlatformFeePercent(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= MAX_PLATFORM_FEE, "Fee too high");
        uint256 oldFee = platformFeePercent;
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(oldFee, newFeePercent);
    }

    function withdrawPlatformFees(address recipient) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        uint256 amount = totalPlatformFees;
        require(amount > 0, "No fees to withdraw");

        totalPlatformFees = 0;
        payable(recipient).transfer(amount);

        emit PlatformFeesWithdrawn(recipient, amount);
    }

    function updateCampaignStatus(
        uint256 campaignId,
        CampaignStatus newStatus
    ) external {
        require(
            msg.sender == address(campaignManager) ||
                msg.sender == address(investmentManager) ||
                msg.sender == address(milestoneManager) ||
                msg.sender == owner(),
            "Unauthorized"
        );

        StoredCampaign storage campaign = _campaigns[campaignId];
        require(campaign.id != 0, "Campaign does not exist");

        CampaignStatus oldStatus = campaign.status;
        campaign.status = newStatus;

        emit CampaignStatusChanged(
            campaignId,
            oldStatus,
            newStatus,
            "Status updated by manager"
        );
    }

    function updateMilestoneStatus(
        uint256 campaignId,
        uint256 milestoneId,
        MilestoneStatus newStatus
    ) external {
        require(
            msg.sender == address(milestoneManager) || msg.sender == owner(),
            "Unauthorized"
        );

        StoredMilestone storage milestone = _milestones[campaignId][
            milestoneId
        ];
        require(milestone.campaignId == campaignId, "Milestone does not exist");

        milestone.status = newStatus;

        emit MilestoneStatusChanged(campaignId, milestoneId, newStatus);
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Fallback function to receive HBAR
    receive() external payable {}
}
