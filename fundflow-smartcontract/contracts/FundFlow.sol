// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title FundFlow - Decentralized Fundraising Platform
 * @dev A transparent startup fundraising platform on Hedera blockchain
 * @author FundFlow Team
 */
contract FundFlow is Ownable, ReentrancyGuard, Pausable {
    
    // Constants
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10% maximum
    uint256 public constant BASIS_POINTS = 10000; // 100% = 10000 basis points
    
    // State Variables
    uint256 public platformFeePercent = 250; // 2.5% = 250 basis points
    uint256 public totalPlatformFees;
    uint256 public nextCampaignId = 1;
    
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
        mapping(address => uint256) investments;
        address[] investors;
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
        mapping(address => Vote) votes;
        address[] voters;
    }
    
    struct Vote {
        bool hasVoted;
        bool vote; // true for approve, false for reject
        uint256 votingPower;
    }
    
    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
    
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
    
    event PlatformFeesWithdrawn(address indexed recipient, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    
    // Modifiers
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId < nextCampaignId, "Campaign does not exist");
        _;
    }
    
    modifier onlyCampaignCreator(uint256 _campaignId) {
        require(campaigns[_campaignId].creator == msg.sender, "Not campaign creator");
        _;
    }
    
    modifier campaignActive(uint256 _campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Campaign not active");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        _;
    }
    
    modifier milestoneExists(uint256 _campaignId, uint256 _milestoneId) {
        require(_milestoneId < campaigns[_campaignId].milestoneCount, "Milestone does not exist");
        _;
    }
    
    modifier hasInvested(uint256 _campaignId) {
        require(campaigns[_campaignId].investments[msg.sender] > 0, "Must be an investor");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Create a new fundraising campaign
     * @param _title Campaign title
     * @param _description Campaign description  
     * @param _targetAmount Target amount to raise in wei
     * @param _durationDays Duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _durationDays
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title required");
        require(bytes(_description).length > 0, "Description required");
        require(_targetAmount > 0, "Invalid target amount");
        require(_durationDays > 0, "Invalid duration");
        
        uint256 campaignId = nextCampaignId++;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        
        Campaign storage campaign = campaigns[campaignId];
        campaign.creator = msg.sender;
        campaign.title = _title;
        campaign.description = _description;
        campaign.targetAmount = _targetAmount;
        campaign.raisedAmount = 0;
        campaign.deadline = deadline;
        campaign.isActive = true;
        campaign.milestoneCount = 0;
        campaign.totalInvestors = 0;
        
        emit CampaignCreated(campaignId, msg.sender, _title, _targetAmount, deadline);
        
        return campaignId;
    }
    
    /**
     * @dev Invest HBAR in a campaign
     * @param _campaignId Campaign to invest in
     */
    function investInCampaign(uint256 _campaignId) 
        external 
        payable 
        campaignExists(_campaignId) 
        campaignActive(_campaignId) 
        nonReentrant 
        whenNotPaused 
    {
        require(msg.value > 0, "Invalid investment amount");
        
        Campaign storage campaign = campaigns[_campaignId];
        uint256 platformFee = calculatePlatformFee(msg.value);
        uint256 netInvestment = msg.value - platformFee;
        
        // Update investment record
        if (campaign.investments[msg.sender] == 0) {
            campaign.investors.push(msg.sender);
            campaign.totalInvestors++;
        }
        
        campaign.investments[msg.sender] += netInvestment;
        campaign.raisedAmount += netInvestment;
        totalPlatformFees += platformFee;
        
        emit InvestmentMade(_campaignId, msg.sender, msg.value, netInvestment);
    }
    
    /**
     * @dev Add a milestone to a campaign
     * @param _campaignId Campaign ID
     * @param _title Milestone title
     * @param _description Milestone description
     * @param _targetAmount Amount to release for this milestone
     * @param _votingDurationDays Voting period in days
     */
    function addMilestone(
        uint256 _campaignId,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _votingDurationDays
    ) 
        external 
        campaignExists(_campaignId) 
        onlyCampaignCreator(_campaignId) 
        whenNotPaused
        returns (uint256) 
    {
        require(bytes(_title).length > 0, "Title required");
        require(_targetAmount > 0, "Invalid target amount");
        require(_votingDurationDays > 0, "Invalid voting duration");
        
        uint256 milestoneId = campaigns[_campaignId].milestoneCount++;
        uint256 votingDeadline = block.timestamp + (_votingDurationDays * 1 days);
        
        Milestone storage milestone = milestones[_campaignId][milestoneId];
        milestone.title = _title;
        milestone.description = _description;
        milestone.targetAmount = _targetAmount;
        milestone.isCompleted = false;
        milestone.votesFor = 0;
        milestone.votesAgainst = 0;
        milestone.votingDeadline = votingDeadline;
        
        emit MilestoneAdded(_campaignId, milestoneId, _title, _targetAmount, votingDeadline);
        
        return milestoneId;
    }
    
    /**
     * @dev Vote on a milestone
     * @param _campaignId Campaign ID
     * @param _milestoneId Milestone ID
     * @param _voteFor True to approve, false to reject
     */
    function voteOnMilestone(
        uint256 _campaignId,
        uint256 _milestoneId,
        bool _voteFor
    ) 
        external 
        campaignExists(_campaignId) 
        milestoneExists(_campaignId, _milestoneId) 
        hasInvested(_campaignId) 
        whenNotPaused 
    {
        Milestone storage milestone = milestones[_campaignId][_milestoneId];
        require(block.timestamp < milestone.votingDeadline, "Voting period ended");
        require(!milestone.votes[msg.sender].hasVoted, "Already voted");
        
        uint256 votingPower = campaigns[_campaignId].investments[msg.sender];
        require(votingPower > 0, "No voting power");
        
        milestone.votes[msg.sender] = Vote({
            hasVoted: true,
            vote: _voteFor,
            votingPower: votingPower
        });
        
        milestone.voters.push(msg.sender);
        
        if (_voteFor) {
            milestone.votesFor += votingPower;
        } else {
            milestone.votesAgainst += votingPower;
        }
        
        emit MilestoneVoted(_campaignId, _milestoneId, msg.sender, _voteFor, votingPower);
    }
    
    /**
     * @dev Release milestone funds if approved
     * @param _campaignId Campaign ID
     * @param _milestoneId Milestone ID
     */
    function releaseMilestoneFunds(
        uint256 _campaignId,
        uint256 _milestoneId
    ) 
        external 
        campaignExists(_campaignId) 
        milestoneExists(_campaignId, _milestoneId) 
        onlyCampaignCreator(_campaignId) 
        nonReentrant 
        whenNotPaused 
    {
        Milestone storage milestone = milestones[_campaignId][_milestoneId];
        require(block.timestamp >= milestone.votingDeadline, "Voting period not ended");
        require(!milestone.isCompleted, "Milestone already completed");
        require(milestone.votesFor > milestone.votesAgainst, "Milestone not approved");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(address(this).balance >= milestone.targetAmount, "Insufficient contract balance");
        
        milestone.isCompleted = true;
        
        // Transfer funds to campaign creator
        (bool success, ) = payable(campaign.creator).call{value: milestone.targetAmount}("");
        require(success, "Transfer failed");
        
        emit MilestoneFundsReleased(_campaignId, _milestoneId, campaign.creator, milestone.targetAmount);
    }
    
    /**
     * @dev Withdraw accumulated platform fees
     * @param _recipient Address to receive the fees
     */
    function withdrawPlatformFees(address payable _recipient) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(_recipient != address(0), "Invalid recipient");
        require(totalPlatformFees > 0, "No fees to withdraw");
        
        uint256 fees = totalPlatformFees;
        totalPlatformFees = 0;
        
        (bool success, ) = _recipient.call{value: fees}("");
        require(success, "Transfer failed");
        
        emit PlatformFeesWithdrawn(_recipient, fees);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param _newFeePercent New fee percentage in basis points
     */
    function setPlatformFeePercent(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= MAX_PLATFORM_FEE, "Fee too high");
        
        uint256 oldFee = platformFeePercent;
        platformFeePercent = _newFeePercent;
        
        emit PlatformFeeUpdated(oldFee, _newFeePercent);
    }
    
    /**
     * @dev Pause contract operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract operations  
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // View Functions
    
    /**
     * @dev Get campaign details
     * @param _campaignId Campaign ID
     */
    function getCampaign(uint256 _campaignId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (
            address creator,
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 raisedAmount,
            uint256 deadline,
            bool isActive,
            uint256 milestoneCount,
            uint256 totalInvestors
        ) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.targetAmount,
            campaign.raisedAmount,
            campaign.deadline,
            campaign.isActive,
            campaign.milestoneCount,
            campaign.totalInvestors
        );
    }
    
    /**
     * @dev Get milestone details
     * @param _campaignId Campaign ID
     * @param _milestoneId Milestone ID
     */
    function getMilestone(uint256 _campaignId, uint256 _milestoneId) 
        external 
        view 
        campaignExists(_campaignId) 
        milestoneExists(_campaignId, _milestoneId) 
        returns (
            string memory title,
            string memory description,
            uint256 targetAmount,
            bool isCompleted,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 votingDeadline
        ) 
    {
        Milestone storage milestone = milestones[_campaignId][_milestoneId];
        return (
            milestone.title,
            milestone.description,
            milestone.targetAmount,
            milestone.isCompleted,
            milestone.votesFor,
            milestone.votesAgainst,
            milestone.votingDeadline
        );
    }
    
    /**
     * @dev Get investment amount for a specific investor
     * @param _campaignId Campaign ID
     * @param _investor Investor address
     */
    function getInvestment(uint256 _campaignId, address _investor) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (uint256) 
    {
        return campaigns[_campaignId].investments[_investor];
    }
    
    /**
     * @dev Calculate platform fee for given amount
     * @param _amount Amount to calculate fee for
     */
    function calculatePlatformFee(uint256 _amount) public view returns (uint256) {
        return (_amount * platformFeePercent) / BASIS_POINTS;
    }
    
    /**
     * @dev Get campaign investors
     * @param _campaignId Campaign ID
     */
    function getCampaignInvestors(uint256 _campaignId) 
        external 
        view 
        campaignExists(_campaignId) 
        returns (address[] memory) 
    {
        return campaigns[_campaignId].investors;
    }
    
    /**
     * @dev Get milestone voters
     * @param _campaignId Campaign ID
     * @param _milestoneId Milestone ID
     */
    function getMilestoneVoters(uint256 _campaignId, uint256 _milestoneId) 
        external 
        view 
        campaignExists(_campaignId) 
        milestoneExists(_campaignId, _milestoneId) 
        returns (address[] memory) 
    {
        return milestones[_campaignId][_milestoneId].voters;
    }
    
    /**
     * @dev Get voter's vote details
     * @param _campaignId Campaign ID
     * @param _milestoneId Milestone ID
     * @param _voter Voter address
     */
    function getVote(uint256 _campaignId, uint256 _milestoneId, address _voter) 
        external 
        view 
        campaignExists(_campaignId) 
        milestoneExists(_campaignId, _milestoneId) 
        returns (bool hasVoted, bool vote, uint256 votingPower) 
    {
        Vote storage voterData = milestones[_campaignId][_milestoneId].votes[_voter];
        return (voterData.hasVoted, voterData.vote, voterData.votingPower);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get next campaign ID
     */
    function getNextCampaignId() external view returns (uint256) {
        return nextCampaignId;
    }
}