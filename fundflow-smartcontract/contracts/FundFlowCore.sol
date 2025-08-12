// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./interfaces/IFundFlowCore.sol";
import "./interfaces/ICampaignManager.sol";
import "./interfaces/IInvestmentManager.sol";
import "./interfaces/IMilestoneManager.sol";
import "./interfaces/IGovernanceManager.sol";
import "./interfaces/IAnalyticsManager.sol";

import "./libraries/CampaignLibrary.sol";
import "./libraries/InvestmentLibrary.sol";
import "./libraries/MilestoneLibrary.sol";
import "./libraries/GovernanceLibrary.sol";
import "./libraries/AnalyticsLibrary.sol";

/**
 * @title FundFlowCore
 * @dev Core contract implementing FundFlow fundraising platform with enterprise-grade features
 * @author FundFlow Team
 */
contract FundFlowCore is
    IFundFlowCore,
    ICampaignManager,
    IInvestmentManager,
    IMilestoneManager,
    IGovernanceManager,
    IAnalyticsManager,
    ReentrancyGuard,
    Ownable,
    Pausable
{
    using SafeMath for uint256;

    // State Variables
    uint256 private _campaignIdCounter;
    uint256 private _proposalIdCounter;
    uint256 private _reportIdCounter;

    // Campaign storage
    mapping(uint256 => Campaign) private _campaigns;
    mapping(uint256 => mapping(uint256 => Milestone)) private _milestones;
    mapping(uint256 => mapping(address => Investment)) private _investments;
    mapping(uint256 => CampaignDraft) private _campaignDrafts;
    mapping(uint256 => CampaignAnalytics) private _campaignAnalytics;

    // Investment storage
    mapping(address => InvestorProfile) private _investorProfiles;
    mapping(uint256 => InvestmentLimits) private _campaignLimits;
    mapping(address => mapping(uint256 => bool)) private _investorKYC;

    // Governance storage
    mapping(uint256 => ProposalData) private _proposals;
    mapping(uint256 => mapping(address => Vote)) private _proposalVotes;
    mapping(uint256 => GovernanceConfig) private _governanceConfigs;
    mapping(uint256 => mapping(address => VotingPower)) private _votingPowers;
    mapping(uint256 => mapping(address => DelegationInfo)) private _delegations;

    // Analytics storage
    mapping(uint256 => mapping(string => uint256[])) private _historicalData;
    mapping(string => uint256) private _benchmarks;
    mapping(uint256 => mapping(AlertType => uint256)) private _alerts;

    // Platform configuration
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public minimumCampaignTarget = 0.1 ether;
    uint256 public maximumCampaignTarget = 1000000 ether;
    address public feeCollector;

    // Modifiers
    modifier validCampaign(uint256 campaignId) {
        require(
            campaignId > 0 && campaignId <= _campaignIdCounter,
            "Invalid campaign ID"
        );
        _;
    }

    modifier onlyCampaignCreator(uint256 campaignId) {
        require(
            _campaigns[campaignId].creator == msg.sender,
            "Not campaign creator"
        );
        _;
    }

    modifier campaignActive(uint256 campaignId) {
        require(
            _campaigns[campaignId].status == CampaignStatus.Active,
            "Campaign not active"
        );
        require(
            block.timestamp < _campaigns[campaignId].deadline,
            "Campaign ended"
        );
        _;
    }

    constructor(address _feeCollector) {
        feeCollector = _feeCollector;
        _campaignIdCounter = 0;
        _proposalIdCounter = 0;
        _reportIdCounter = 0;
    }

    // ==================== IFundFlowCore Implementation ====================

    /**
     * @dev Creates a new campaign with milestones
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
    )
        external
        override
        nonReentrant
        whenNotPaused
        returns (uint256 campaignId)
    {
        // Validate input parameters
        require(
            bytes(title).length >= 5 && bytes(title).length <= 100,
            "Invalid title length"
        );
        require(
            bytes(description).length >= 10 &&
                bytes(description).length <= 2000,
            "Invalid description length"
        );
        require(
            targetAmount >= minimumCampaignTarget &&
                targetAmount <= maximumCampaignTarget,
            "Invalid target amount"
        );
        require(durationDays >= 1 && durationDays <= 365, "Invalid duration");
        require(
            milestoneTitles.length == milestoneDescriptions.length,
            "Milestone arrays length mismatch"
        );
        require(
            milestoneTitles.length == milestoneFundingPercentages.length,
            "Milestone arrays length mismatch"
        );

        // Validate milestone percentages sum to 100%
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < milestoneFundingPercentages.length; i++) {
            totalPercentage = totalPercentage.add(
                milestoneFundingPercentages[i]
            );
        }
        require(
            totalPercentage == 10000,
            "Milestone percentages must sum to 100%"
        );

        // Increment campaign counter
        _campaignIdCounter = _campaignIdCounter.add(1);
        campaignId = _campaignIdCounter;

        // Create campaign
        Campaign storage campaign = _campaigns[campaignId];
        campaign.creator = msg.sender;
        campaign.targetAmount = targetAmount;
        campaign.deadline = block.timestamp.add(durationDays.mul(1 days));
        campaign.status = CampaignStatus.Active;
        campaign.category = category;
        campaign.createdAt = block.timestamp;
        campaign.updatedAt = block.timestamp;
        campaign.milestoneCount = milestoneTitles.length;

        // Create milestones
        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            Milestone storage milestone = _milestones[campaignId][i];
            milestone.title = milestoneTitles[i];
            milestone.description = milestoneDescriptions[i];
            milestone.fundingPercentage = milestoneFundingPercentages[i];
            milestone.votingDeadline = campaign.deadline;
            milestone.submissionDeadline = campaign.deadline;
            milestone.status = MilestoneStatus.Pending;
            milestone.approvalThreshold = 6000; // 60% approval threshold

            emit MilestoneCreated(
                campaignId,
                i,
                milestoneTitles[i],
                milestoneFundingPercentages[i],
                milestone.votingDeadline
            );
        }

        // Initialize campaign analytics
        _campaignAnalytics[campaignId] = CampaignAnalytics({
            viewCount: 0,
            conversionRate: 0,
            averageInvestment: 0,
            socialEngagement: 0,
            milestoneSuccessRate: 0
        });

        // Initialize governance config for campaign
        _governanceConfigs[campaignId] = GovernanceConfig({
            votingDelay: 1 days,
            votingPeriod: 7 days,
            proposalThreshold: 1000,
            quorumFraction: 2000, // 20%
            executionDelay: 2 days,
            requiresTokens: true,
            minimumTokensToPropose: 1000,
            minimumTokensToVote: 1
        });

        emit CampaignCreated(
            campaignId,
            msg.sender,
            title,
            targetAmount,
            campaign.deadline,
            category
        );

        return campaignId;
    }

    /**
     * @dev Allows users to invest in a campaign
     */
    function investInCampaign(
        uint256 campaignId
    )
        external
        payable
        override
        nonReentrant
        whenNotPaused
        validCampaign(campaignId)
        campaignActive(campaignId)
    {
        require(msg.value > 0, "Investment amount must be positive");

        Campaign storage campaign = _campaigns[campaignId];
        Investment storage investment = _investments[campaignId][msg.sender];

        // Validate investment limits
        InvestmentLimits storage limits = _campaignLimits[campaignId];
        if (limits.minimumInvestment > 0) {
            require(
                msg.value >= limits.minimumInvestment,
                "Below minimum investment"
            );
        }
        if (limits.maximumInvestment > 0) {
            require(
                investment.amount.add(msg.value) <= limits.maximumInvestment,
                "Exceeds maximum investment"
            );
        }

        // Calculate platform fee
        uint256 platformFee = msg.value.mul(platformFeePercentage).div(10000);
        uint256 netAmount = msg.value.sub(platformFee);

        // Update investment
        if (investment.amount == 0) {
            campaign.totalInvestors = campaign.totalInvestors.add(1);
            campaign.investors.push(msg.sender);
        }

        investment.amount = investment.amount.add(netAmount);
        investment.timestamp = block.timestamp;
        investment.investmentType = InvestmentType.HBAR;

        // Update campaign
        campaign.raisedAmount = campaign.raisedAmount.add(netAmount);
        campaign.updatedAt = block.timestamp;

        // Calculate and allocate equity tokens
        uint256 equityTokens = calculateEquityTokens(campaignId, netAmount);
        investment.equityTokens = investment.equityTokens.add(equityTokens);
        campaign.equityTokensIssued = campaign.equityTokensIssued.add(
            equityTokens
        );

        // Update investor profile
        _updateInvestorProfile(msg.sender, netAmount);

        // Update voting power
        _updateVotingPower(campaignId, msg.sender);

        // Send platform fee to fee collector
        if (platformFee > 0) {
            payable(feeCollector).transfer(platformFee);
        }

        emit InvestmentMade(
            campaignId,
            msg.sender,
            msg.value,
            netAmount,
            platformFee,
            equityTokens
        );
        emit EquityTokensDistributed(
            campaignId,
            msg.sender,
            equityTokens,
            campaign.equityTokensIssued
        );

        // Check if campaign is fully funded
        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.status = CampaignStatus.Funded;
            emit CampaignStatusChanged(
                campaignId,
                CampaignStatus.Active,
                CampaignStatus.Funded,
                "Target reached"
            );
        }
    }

    /**
     * @dev Submits milestone deliverable for voting
     */
    function submitMilestoneDeliverable(
        uint256 campaignId,
        uint256 milestoneIndex,
        string memory deliverableHash
    )
        external
        override
        validCampaign(campaignId)
        onlyCampaignCreator(campaignId)
    {
        require(
            milestoneIndex < _campaigns[campaignId].milestoneCount,
            "Invalid milestone index"
        );
        require(bytes(deliverableHash).length > 0, "Deliverable hash required");

        Milestone storage milestone = _milestones[campaignId][milestoneIndex];
        require(
            milestone.status == MilestoneStatus.Pending,
            "Milestone not pending"
        );
        require(
            block.timestamp <= milestone.submissionDeadline,
            "Submission deadline passed"
        );

        milestone.deliverableHash = deliverableHash;
        milestone.status = MilestoneStatus.VotingOpen;
        milestone.votingDeadline = block.timestamp.add(7 days); // 7 days voting period

        emit MilestoneCreated(
            campaignId,
            milestoneIndex,
            milestone.title,
            milestone.fundingPercentage,
            milestone.votingDeadline
        );
    }

    /**
     * @dev Allows investors to vote on milestones
     */
    function voteOnMilestone(
        uint256 campaignId,
        uint256 milestoneIndex,
        bool vote,
        string memory reason
    ) external override validCampaign(campaignId) {
        require(
            milestoneIndex < _campaigns[campaignId].milestoneCount,
            "Invalid milestone index"
        );
        require(
            _investments[campaignId][msg.sender].amount > 0,
            "Not an investor"
        );

        Milestone storage milestone = _milestones[campaignId][milestoneIndex];
        require(
            milestone.status == MilestoneStatus.VotingOpen,
            "Voting not open"
        );
        require(
            block.timestamp <= milestone.votingDeadline,
            "Voting period ended"
        );
        require(!milestone.votes[msg.sender].hasVoted, "Already voted");

        uint256 votingPower = getVotingPower(campaignId, msg.sender);
        require(votingPower > 0, "No voting power");

        // Record vote
        milestone.votes[msg.sender] = Vote({
            hasVoted: true,
            vote: vote,
            votingPower: votingPower,
            timestamp: block.timestamp,
            reason: reason
        });

        milestone.voters.push(msg.sender);

        // Update vote counts
        if (vote) {
            milestone.votesFor = milestone.votesFor.add(votingPower);
        } else {
            milestone.votesAgainst = milestone.votesAgainst.add(votingPower);
        }

        milestone.totalVotingPower = milestone.totalVotingPower.add(
            votingPower
        );

        emit MilestoneVoteSubmitted(
            campaignId,
            milestoneIndex,
            msg.sender,
            vote,
            votingPower,
            reason
        );
    }

    /**
     * @dev Completes milestone and releases funds if approved
     */
    function completeMilestone(
        uint256 campaignId,
        uint256 milestoneIndex
    ) external override validCampaign(campaignId) {
        require(
            milestoneIndex < _campaigns[campaignId].milestoneCount,
            "Invalid milestone index"
        );

        Milestone storage milestone = _milestones[campaignId][milestoneIndex];
        require(
            milestone.status == MilestoneStatus.VotingOpen,
            "Voting not open"
        );
        require(
            block.timestamp > milestone.votingDeadline,
            "Voting period not ended"
        );
        require(!milestone.fundsReleased, "Funds already released");

        Campaign storage campaign = _campaigns[campaignId];

        // Calculate voting results
        uint256 totalVotes = milestone.votesFor.add(milestone.votesAgainst);
        uint256 requiredQuorum = campaign.raisedAmount.mul(2000).div(10000); // 20% quorum
        bool hasQuorum = milestone.totalVotingPower >= requiredQuorum;
        bool isApproved = hasQuorum &&
            milestone.votesFor > milestone.votesAgainst &&
            milestone.votesFor.mul(10000).div(totalVotes) >=
            milestone.approvalThreshold;

        if (isApproved) {
            // Calculate funds to release
            uint256 fundsToRelease = campaign
                .raisedAmount
                .mul(milestone.fundingPercentage)
                .div(10000);

            // Release funds to campaign creator
            milestone.fundsReleased = true;
            milestone.releasedAmount = fundsToRelease;
            milestone.status = MilestoneStatus.Approved;

            payable(campaign.creator).transfer(fundsToRelease);

            emit MilestoneCompleted(
                campaignId,
                milestoneIndex,
                fundsToRelease,
                milestone.votesFor.mul(10000).div(totalVotes)
            );
        } else {
            milestone.status = MilestoneStatus.Rejected;
        }
    }

    /**
     * @dev Allows investors to request refunds for failed campaigns
     */
    function requestRefund(
        uint256 campaignId
    ) external override validCampaign(campaignId) nonReentrant {
        Campaign storage campaign = _campaigns[campaignId];
        Investment storage investment = _investments[campaignId][msg.sender];

        require(investment.amount > 0, "No investment found");
        require(!investment.refunded, "Already refunded");
        require(
            campaign.status == CampaignStatus.Failed ||
                campaign.status == CampaignStatus.Cancelled ||
                (block.timestamp > campaign.deadline &&
                    campaign.raisedAmount < campaign.targetAmount),
            "Refund not available"
        );

        uint256 refundAmount = investment.amount;
        investment.refunded = true;

        payable(msg.sender).transfer(refundAmount);

        emit RefundIssued(
            campaignId,
            msg.sender,
            refundAmount,
            "Campaign failed"
        );
    }

    /**
     * @dev Emergency refund function for campaign creators
     */
    function emergencyRefund(
        uint256 campaignId
    )
        external
        override
        validCampaign(campaignId)
        onlyCampaignCreator(campaignId)
        nonReentrant
    {
        Campaign storage campaign = _campaigns[campaignId];
        require(
            campaign.emergencyRefundEnabled,
            "Emergency refund not enabled"
        );
        require(
            campaign.status == CampaignStatus.Active,
            "Campaign not active"
        );

        campaign.status = CampaignStatus.Cancelled;

        // Refund all investors
        for (uint256 i = 0; i < campaign.investors.length; i++) {
            address investor = campaign.investors[i];
            Investment storage investment = _investments[campaignId][investor];

            if (investment.amount > 0 && !investment.refunded) {
                investment.refunded = true;
                payable(investor).transfer(investment.amount);
                emit RefundIssued(
                    campaignId,
                    investor,
                    investment.amount,
                    "Emergency refund"
                );
            }
        }

        emit CampaignStatusChanged(
            campaignId,
            CampaignStatus.Active,
            CampaignStatus.Cancelled,
            "Emergency refund"
        );
    }

    // Platform Configuration
    PlatformConfig private _platformConfig;

    struct PlatformConfig {
        uint256 platformFeePercentage; // In basis points
        uint256 minCampaignDuration;
        uint256 maxCampaignDuration;
        uint256 minInvestment;
        uint256 maxInvestmentPerUser;
        bool emergencyPaused;
        address treasuryAddress;
        address oracleAddress;
    }

    // Events
    event PlatformConfigUpdated(
        address indexed admin,
        string parameter,
        uint256 value
    );
    event EmergencyPauseToggled(bool paused);

    /**
     * @dev Constructor
     * @param admin Admin address
     * @param treasury Treasury address for platform fees
     */
    constructor(address admin, address treasury) {
        require(admin != address(0), "FundFlowCore: Invalid admin address");
        require(
            treasury != address(0),
            "FundFlowCore: Invalid treasury address"
        );

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);

        _platformConfig = PlatformConfig({
            platformFeePercentage: 250, // 2.5%
            minCampaignDuration: 7 days,
            maxCampaignDuration: 365 days,
            minInvestment: 0.01 ether,
            maxInvestmentPerUser: 10000 ether,
            emergencyPaused: false,
            treasuryAddress: treasury,
            oracleAddress: address(0)
        });
    }

    // ==================== CAMPAIGN MANAGER IMPLEMENTATION ====================

    /**
     * @dev Creates a new campaign
     */
    function createCampaign(
        CreateCampaignRequest memory campaignData
    ) external override whenNotPaused returns (uint256 campaignId) {
        require(
            hasRole(CAMPAIGN_CREATOR_ROLE, msg.sender) ||
                hasRole(ADMIN_ROLE, msg.sender),
            "FundFlowCore: Insufficient permissions"
        );

        // Validate campaign parameters
        CampaignLibrary.validateCampaignParams(
            campaignData.title,
            campaignData.description,
            campaignData.fundingGoal,
            campaignData.duration / 1 days,
            campaignData.platformFeePercentage
        );

        _campaignCounter = _campaignCounter.add(1);
        campaignId = _campaignCounter;

        // Create campaign
        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        campaign.creator = msg.sender;
        campaign.title = campaignData.title;
        campaign.description = campaignData.description;
        campaign.targetAmount = campaignData.fundingGoal;
        campaign.deadline = block.timestamp.add(campaignData.duration);
        campaign.isActive = true;
        campaign.createdAt = block.timestamp;
        campaign.category = campaignData.category;
        campaign.platformFeePercentage = campaignData.platformFeePercentage;

        // Initialize governance config for the campaign
        _governanceConfigs[campaignId] = GovernanceLibrary.GovernanceConfig({
            votingDelay: 1 days,
            votingPeriod: 7 days,
            proposalThreshold: 100,
            quorumFraction: 2000, // 20%
            executionDelay: 2 days,
            requiresTokens: true,
            minimumTokensToPropose: 1000,
            minimumTokensToVote: 1
        });

        emit CampaignCreated(
            campaignId,
            msg.sender,
            campaignData.title,
            campaignData.fundingGoal,
            block.timestamp.add(campaignData.duration)
        );

        return campaignId;
    }

    /**
     * @dev Updates campaign status
     */
    function updateCampaignStatus(
        uint256 campaignId,
        CampaignStatus status
    ) external override {
        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        require(
            campaign.creator == msg.sender || hasRole(ADMIN_ROLE, msg.sender),
            "FundFlowCore: Not authorized"
        );

        CampaignLibrary.CampaignStatus oldStatus = campaign.status;
        campaign.status = status;

        emit CampaignStatusUpdated(
            campaignId,
            uint8(oldStatus),
            uint8(status),
            msg.sender
        );
    }

    /**
     * @dev Gets campaign details
     */
    function getCampaign(
        uint256 campaignId
    ) external view override returns (Campaign memory) {
        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        require(
            campaign.creator != address(0),
            "FundFlowCore: Campaign not found"
        );

        return
            Campaign({
                creator: campaign.creator,
                title: campaign.title,
                description: campaign.description,
                ipfsHash: "", // Empty for now
                category: campaign.category,
                fundingGoal: campaign.targetAmount,
                currentFunding: campaign.raisedAmount,
                investorCount: campaign.investorCount,
                milestoneCount: campaign.milestoneCount,
                deadline: campaign.deadline,
                status: campaign.status,
                isActive: campaign.isActive,
                isVerified: campaign.isVerified,
                tags: campaign.tags,
                createdAt: campaign.createdAt,
                updatedAt: block.timestamp
            });
    }

    // ==================== INVESTMENT MANAGER IMPLEMENTATION ====================

    /**
     * @dev Processes an investment
     */
    function processInvestment(
        uint256 campaignId,
        address investor,
        uint256 amount,
        InvestmentType investmentType
    )
        external
        payable
        override
        nonReentrant
        whenNotPaused
        returns (bool success, uint256 equityTokens)
    {
        require(
            msg.value == amount || investmentType != InvestmentType.HBAR,
            "FundFlowCore: Invalid payment amount"
        );

        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        require(
            campaign.isActive && !campaign.isPaused,
            "FundFlowCore: Campaign not active"
        );
        require(
            block.timestamp <= campaign.deadline,
            "FundFlowCore: Campaign ended"
        );

        // Validate investment
        InvestmentLibrary.InvestmentLimits memory limits = InvestmentLibrary
            .InvestmentLimits({
                minimumInvestment: _platformConfig.minInvestment,
                maximumInvestment: _platformConfig.maxInvestmentPerUser,
                maximumInvestors: 0,
                requiresKYC: false,
                requiresAccreditation: false,
                maxInvestmentPerUser: _platformConfig.maxInvestmentPerUser,
                cooldownPeriod: 0
            });

        InvestmentLibrary.validateInvestment(
            amount,
            campaign.targetAmount,
            campaign.raisedAmount,
            limits
        );

        // Calculate platform fee
        uint256 platformFee = CampaignLibrary.calculatePlatformFee(
            amount,
            campaign.platformFeePercentage
        );
        uint256 netAmount = amount.sub(platformFee);

        // Calculate equity tokens (if applicable)
        equityTokens = InvestmentLibrary.calculateEquityTokens(
            amount,
            campaign.targetAmount,
            5000, // 50% equity offered (example)
            1000000 // 1M token supply (example)
        );

        // Record investment
        _investmentCounter = _investmentCounter.add(1);
        _investments[campaignId][investor] = InvestmentLibrary.InvestmentData({
            investor: investor,
            amount: amount,
            timestamp: block.timestamp,
            campaignId: campaignId,
            isActive: true,
            expectedReturns: 0,
            equityTokens: equityTokens,
            platformFee: platformFee,
            investmentType: investmentType,
            refunded: false,
            refundAmount: 0,
            refundReason: InvestmentLibrary.RefundReason.CampaignFailed,
            actualReturns: 0,
            vestingPeriod: 365 days,
            isLocked: false
        });

        // Update campaign and investor data
        campaign.raisedAmount = campaign.raisedAmount.add(netAmount);
        campaign.investorCount = campaign.investorCount.add(1);

        // Update investor profile
        InvestmentLibrary.InvestorProfile storage profile = _investorProfiles[
            investor
        ];
        profile.totalInvested = profile.totalInvested.add(amount);
        profile.totalEquityTokens = profile.totalEquityTokens.add(equityTokens);
        profile.activeCampaigns = profile.activeCampaigns.add(1);

        // Transfer platform fee to treasury
        if (platformFee > 0) {
            payable(_platformConfig.treasuryAddress).transfer(platformFee);
        }

        emit InvestmentProcessed(
            campaignId,
            investor,
            amount,
            platformFee,
            equityTokens,
            block.timestamp
        );

        return (true, equityTokens);
    }

    /**
     * @dev Gets investment details
     */
    function getInvestment(
        uint256 campaignId,
        address investor
    ) external view override returns (Investment memory) {
        InvestmentLibrary.InvestmentData storage investment = _investments[
            campaignId
        ][investor];

        return
            Investment({
                amount: investment.amount,
                timestamp: investment.timestamp,
                equityTokens: investment.equityTokens,
                platformFee: investment.platformFee,
                investmentType: investment.investmentType,
                refunded: investment.refunded,
                refundAmount: investment.refundAmount,
                refundReason: investment.refundReason,
                expectedReturns: investment.expectedReturns,
                actualReturns: investment.actualReturns
            });
    }

    // ==================== GOVERNANCE MANAGER IMPLEMENTATION ====================

    /**
     * @dev Creates a new proposal
     */
    function createProposal(
        uint256 campaignId,
        ProposalType proposalType,
        string memory title,
        string memory description,
        bytes memory executionData
    ) external override returns (uint256 proposalId) {
        require(
            _campaigns[campaignId].creator != address(0),
            "FundFlowCore: Campaign not found"
        );

        _proposalCounter = _proposalCounter.add(1);
        proposalId = _proposalCounter;

        GovernanceLibrary.GovernanceConfig storage config = _governanceConfigs[
            campaignId
        ];

        _proposals[proposalId] = GovernanceLibrary.ProposalCore({
            id: proposalId,
            campaignId: campaignId,
            proposer: msg.sender,
            proposalType: proposalType,
            title: title,
            description: description,
            executionData: executionData,
            creationTime: block.timestamp,
            votingStart: block.timestamp.add(config.votingDelay),
            votingEnd: block.timestamp.add(config.votingDelay).add(
                config.votingPeriod
            ),
            executionDelay: config.executionDelay,
            status: ProposalStatus.Pending
        });

        emit ProposalCreated(
            proposalId,
            msg.sender,
            campaignId,
            proposalType,
            description,
            block.timestamp.add(config.votingDelay).add(config.votingPeriod)
        );

        return proposalId;
    }

    /**
     * @dev Casts a vote on a proposal
     */
    function castVote(
        uint256 proposalId,
        bool support,
        string memory reason
    ) external override {
        GovernanceLibrary.ProposalCore storage proposal = _proposals[
            proposalId
        ];
        require(proposal.id != 0, "FundFlowCore: Proposal not found");
        require(
            block.timestamp >= proposal.votingStart,
            "FundFlowCore: Voting not started"
        );
        require(
            block.timestamp <= proposal.votingEnd,
            "FundFlowCore: Voting ended"
        );
        require(
            !_votes[proposalId][msg.sender].hasVoted,
            "FundFlowCore: Already voted"
        );

        // Calculate voting power
        uint256 votingPower = calculateVotingPower(
            proposal.campaignId,
            msg.sender
        ).totalPower;
        require(votingPower > 0, "FundFlowCore: No voting power");

        // Record vote
        _votes[proposalId][msg.sender] = GovernanceLibrary.VoteRecord({
            hasVoted: true,
            choice: support
                ? GovernanceLibrary.VoteChoice.For
                : GovernanceLibrary.VoteChoice.Against,
            votingPower: votingPower,
            reason: reason,
            timestamp: block.timestamp
        });

        emit VoteCast(proposalId, msg.sender, support, votingPower, reason);
    }

    /**
     * @dev Gets proposal details
     */
    function getProposal(
        uint256 proposalId
    )
        external
        view
        override
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
        GovernanceLibrary.ProposalCore storage proposal = _proposals[
            proposalId
        ];
        require(proposal.id != 0, "FundFlowCore: Proposal not found");

        // Calculate vote totals (this is simplified - in practice you'd cache these)
        (
            uint256 _forVotes,
            uint256 _againstVotes,
            uint256 _abstainVotes
        ) = _calculateVoteTotals(proposalId);

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
            _forVotes,
            _againstVotes,
            _abstainVotes,
            proposal.status
        );
    }

    // ==================== ANALYTICS MANAGER IMPLEMENTATION ====================

    /**
     * @dev Updates campaign metrics
     */
    function updateCampaignMetrics(uint256 campaignId) external override {
        require(
            hasRole(ANALYTICS_ROLE, msg.sender) ||
                hasRole(ADMIN_ROLE, msg.sender),
            "FundFlowCore: Insufficient permissions"
        );

        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        require(
            campaign.creator != address(0),
            "FundFlowCore: Campaign not found"
        );

        // This is a simplified implementation
        // In practice, you'd calculate and store comprehensive metrics
        emit MetricUpdated(
            "funding_progress",
            campaignId,
            CampaignLibrary.calculateProgress(
                campaign.raisedAmount,
                campaign.targetAmount
            ),
            block.timestamp
        );
    }

    /**
     * @dev Gets campaign metrics
     */
    function getCampaignMetrics(
        uint256 campaignId
    ) external view override returns (CampaignMetrics memory) {
        CampaignLibrary.CampaignData storage campaign = _campaigns[campaignId];
        require(
            campaign.creator != address(0),
            "FundFlowCore: Campaign not found"
        );

        return
            CampaignMetrics({
                campaignId: campaignId,
                totalRaised: campaign.raisedAmount,
                fundingVelocity: CampaignLibrary.calculateFundingVelocity(
                    campaign.raisedAmount,
                    campaign.createdAt
                ),
                investorCount: campaign.investorCount,
                averageInvestment: campaign.investorCount > 0
                    ? campaign.raisedAmount.div(campaign.investorCount)
                    : 0,
                conversionRate: 5000, // Placeholder
                milestoneCompletionRate: 8000, // Placeholder
                roiProjection: 12000, // Placeholder
                riskScore: CampaignLibrary.calculateRiskScore(
                    CampaignLibrary.calculateFundingVelocity(
                        campaign.raisedAmount,
                        campaign.createdAt
                    ),
                    campaign.deadline.sub(block.timestamp),
                    CampaignLibrary.calculateProgress(
                        campaign.raisedAmount,
                        campaign.targetAmount
                    ),
                    campaign.milestoneCount
                ),
                socialSentiment: 7500, // Placeholder
                marketDemand: 6800, // Placeholder
                competitorAnalysis: 5500, // Placeholder
                lastUpdated: block.timestamp
            });
    }

    // ==================== FUND FLOW CORE IMPLEMENTATION ====================

    /**
     * @dev Gets platform statistics
     */
    function getPlatformStats()
        external
        view
        override
        returns (PlatformStats memory)
    {
        return
            PlatformStats({
                totalCampaigns: _campaignCounter,
                activeCampaigns: _getActiveCampaignCount(),
                totalFundsRaised: _getTotalFundsRaised(),
                totalInvestors: _getTotalInvestorCount(),
                successfulCampaigns: _getSuccessfulCampaignCount(),
                platformFeeCollected: _getPlatformFeeCollected(),
                averageCampaignSize: _campaignCounter > 0
                    ? _getTotalFundsRaised().div(_campaignCounter)
                    : 0,
                averageInvestmentSize: _investmentCounter > 0
                    ? _getTotalFundsRaised().div(_investmentCounter)
                    : 0
            });
    }

    // ==================== ADMIN FUNCTIONS ====================

    /**
     * @dev Updates platform configuration
     */
    function updatePlatformConfig(
        uint256 platformFeePercentage,
        uint256 minInvestment,
        uint256 maxInvestmentPerUser,
        address treasuryAddress
    ) external onlyRole(ADMIN_ROLE) {
        require(platformFeePercentage <= 1000, "FundFlowCore: Fee too high"); // Max 10%
        require(
            treasuryAddress != address(0),
            "FundFlowCore: Invalid treasury"
        );

        _platformConfig.platformFeePercentage = platformFeePercentage;
        _platformConfig.minInvestment = minInvestment;
        _platformConfig.maxInvestmentPerUser = maxInvestmentPerUser;
        _platformConfig.treasuryAddress = treasuryAddress;

        emit PlatformConfigUpdated(
            msg.sender,
            "platform_config",
            block.timestamp
        );
    }

    /**
     * @dev Emergency pause/unpause
     */
    function toggleEmergencyPause() external onlyRole(ADMIN_ROLE) {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }

        _platformConfig.emergencyPaused = paused();
        emit EmergencyPauseToggled(paused());
    }

    // ==================== INTERNAL HELPER FUNCTIONS ====================

    /**
     * @dev Calculates voting power for an address in a campaign
     */
    function calculateVotingPower(
        uint256 campaignId,
        address voter
    ) public view override returns (VotingPower memory) {
        InvestmentLibrary.InvestmentData storage investment = _investments[
            campaignId
        ][voter];

        return
            VotingPower({
                baseTokens: investment.equityTokens,
                stakingMultiplier: 10000, // 1x multiplier
                reputationBonus: _investorProfiles[voter].riskScore,
                delegatedPower: 0, // Simplified
                totalPower: investment.equityTokens,
                lastUpdate: block.timestamp
            });
    }

    /**
     * @dev Calculates vote totals for a proposal
     */
    function _calculateVoteTotals(
        uint256 proposalId
    )
        internal
        view
        returns (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes)
    {
        // This is a simplified implementation
        // In practice, you'd need to iterate through all voters or maintain running totals
        return (0, 0, 0);
    }

    /**
     * @dev Gets active campaign count
     */
    function _getActiveCampaignCount() internal view returns (uint256 count) {
        // Simplified implementation
        return _campaignCounter / 2; // Placeholder
    }

    /**
     * @dev Gets total funds raised across all campaigns
     */
    function _getTotalFundsRaised() internal view returns (uint256 total) {
        // Simplified implementation
        return address(this).balance;
    }

    /**
     * @dev Gets total investor count
     */
    function _getTotalInvestorCount() internal view returns (uint256 count) {
        // Simplified implementation
        return _investmentCounter;
    }

    /**
     * @dev Gets successful campaign count
     */
    function _getSuccessfulCampaignCount()
        internal
        view
        returns (uint256 count)
    {
        // Simplified implementation
        return _campaignCounter / 3; // Placeholder
    }

    /**
     * @dev Gets total platform fee collected
     */
    function _getPlatformFeeCollected() internal view returns (uint256 total) {
        // Simplified implementation
        return
            _getTotalFundsRaised()
                .mul(_platformConfig.platformFeePercentage)
                .div(10000);
    }

    // ==================== FALLBACK AND RECEIVE ====================

    /**
     * @dev Receive function to accept HBAR payments
     */
    receive() external payable {
        // Accept payments
    }

    /**
     * @dev Fallback function
     */
    fallback() external payable {
        revert("FundFlowCore: Function not found");
    }
}
