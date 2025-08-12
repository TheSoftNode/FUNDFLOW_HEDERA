const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundFlowCore", function () {
  let fundFlowCore;
  let owner, creator, investor1, investor2, milestoneManager, campaignManager, investmentManager;
  
  beforeEach(async function () {
    [owner, creator, investor1, investor2, milestoneManager, campaignManager, investmentManager] = await ethers.getSigners();
    
    const FundFlowCore = await ethers.getContractFactory("FundFlowCore");
    fundFlowCore = await FundFlowCore.deploy();
    await fundFlowCore.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fundFlowCore.owner()).to.equal(owner.address);
    });

    it("Should set correct initial values", async function () {
      expect(await fundFlowCore.platformFeePercent()).to.equal(250); // 2.5%
      expect(await fundFlowCore.getNextCampaignId()).to.equal(1);
      expect(await fundFlowCore.totalPlatformFees()).to.equal(0);
    });

    it("Should initialize with correct status", async function () {
      expect(await fundFlowCore.paused()).to.be.false;
    });
  });

  describe("Manager Registration", function () {
    it("Should allow owner to register managers", async function () {
      await fundFlowCore.setManagers(
        campaignManager.address,
        investmentManager.address,
        milestoneManager.address
      );

      expect(await fundFlowCore.campaignManager()).to.equal(campaignManager.address);
      expect(await fundFlowCore.investmentManager()).to.equal(investmentManager.address);
      expect(await fundFlowCore.milestoneManager()).to.equal(milestoneManager.address);
    });

    it("Should fail if non-owner tries to register managers", async function () {
      await expect(
        fundFlowCore.connect(investor1).setManagers(
          campaignManager.address,
          investmentManager.address,
          milestoneManager.address
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should reject zero address for managers", async function () {
      await expect(
        fundFlowCore.setManagers(
          ethers.constants.AddressZero,
          investmentManager.address,
          milestoneManager.address
        )
      ).to.be.revertedWith("Invalid campaign manager");

      await expect(
        fundFlowCore.setManagers(
          campaignManager.address,
          ethers.constants.AddressZero,
          milestoneManager.address
        )
      ).to.be.revertedWith("Invalid investment manager");

      await expect(
        fundFlowCore.setManagers(
          campaignManager.address,
          investmentManager.address,
          ethers.constants.AddressZero
        )
      ).to.be.revertedWith("Invalid milestone manager");
    });
  });

  describe("Campaign Management", function () {
    beforeEach(async function () {
      // Register campaign manager
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);
    });

    it("Should allow campaign manager to create campaign", async function () {
      const title = "Test Campaign";
      const description = "Test Description";
      const ipfsHash = "QmTestHash123";
      const targetAmount = ethers.utils.parseEther("10");
      const durationDays = 30;
      const category = 1; // TECHNOLOGY
      const milestoneFundingPercentages = [5000, 5000]; // 50%, 50%
      const milestoneTitles = ["Milestone 1", "Milestone 2"];
      const milestoneDescriptions = ["First milestone", "Second milestone"];

      await expect(
        fundFlowCore.createCampaign(
          title, description, ipfsHash, targetAmount, durationDays, category,
          milestoneFundingPercentages, milestoneTitles, milestoneDescriptions
        )
      ).to.emit(fundFlowCore, "CampaignCreated");

      const campaign = await fundFlowCore.getCampaign(1);
      expect(campaign.creator).to.equal(owner.address); // creator should be the caller
      expect(campaign.title).to.equal(title);
      expect(campaign.targetAmount).to.equal(targetAmount);
      expect(campaign.status).to.equal(1); // ACTIVE
    });

    it("Should allow anyone to create campaign (current implementation)", async function () {
      // Current implementation doesn't restrict campaign creation to managers
      await expect(
        fundFlowCore.connect(creator).createCampaign(
          "title", "desc", "QmTestHash", ethers.utils.parseEther("1"), 30, 1,
          [10000], ["Milestone 1"], ["First milestone"]
        )
      ).to.emit(fundFlowCore, "CampaignCreated");
    });

    it("Should validate campaign parameters", async function () {
      await expect(
        fundFlowCore.connect(campaignManager).createCampaign(
          "", "desc", "QmTestHash", ethers.utils.parseEther("1"), 30, 1,
          [10000], ["Milestone 1"], ["First milestone"]
        )
      ).to.be.revertedWith("Title required");

      await expect(
        fundFlowCore.connect(campaignManager).createCampaign(
          "title", "", "QmTestHash", ethers.utils.parseEther("1"), 30, 1,
          [10000], ["Milestone 1"], ["First milestone"]
        )
      ).to.be.revertedWith("Description required");

      await expect(
        fundFlowCore.connect(campaignManager).createCampaign(
          "title", "desc", "QmTestHash", 0, 30, 1,
          [10000], ["Milestone 1"], ["First milestone"]
        )
      ).to.be.revertedWith("Invalid target amount");

      await expect(
        fundFlowCore.connect(campaignManager).createCampaign(
          "title", "desc", "QmTestHash", ethers.utils.parseEther("1"), 0, 1,
          [10000], ["Milestone 1"], ["First milestone"]
        )
      ).to.be.revertedWith("Invalid duration");
    });

    it("Should allow campaign manager to update campaign status", async function () {
      // Create campaign first
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "QmTestHash", ethers.utils.parseEther("10"), 30, 1,
        [10000], ["Milestone 1"], ["First milestone"]
      );

      // Update status to paused
      await expect(
        fundFlowCore.connect(campaignManager).updateCampaignStatus(1, 2) // PAUSED
      ).to.emit(fundFlowCore, "CampaignStatusChanged")
       .withArgs(1, 1, 2, "Status updated by manager"); // From ACTIVE to PAUSED with reason

      const campaign = await fundFlowCore.getCampaign(1);
      expect(campaign.status).to.equal(2); // PAUSED
    });
  });

  describe("Investment Management", function () {
    beforeEach(async function () {
      // Register managers
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);

      // Create a campaign
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "ipfsHash", ethers.utils.parseEther("10"), 
        30, 0, [50, 50], ["Milestone 1", "Milestone 2"], ["Description 1", "Description 2"]
      );
    });

    it("Should allow investment manager to record investment", async function () {
      const investmentAmount = ethers.utils.parseEther("1");
      const platformFee = await fundFlowCore.calculatePlatformFee(investmentAmount);
      const netInvestment = investmentAmount.sub(platformFee);

      await expect(
        fundFlowCore.connect(investmentManager).investInCampaign(
          1, { value: investmentAmount }
        )
      ).to.emit(fundFlowCore, "InvestmentMade")
       .withArgs(1, investmentManager.address, investmentAmount, netInvestment, platformFee, 0);

      const [investmentAmount_returned, equityTokens, refunded] = await fundFlowCore.getInvestment(1, investmentManager.address);
      expect(investmentAmount_returned).to.equal(netInvestment);
      expect(equityTokens).to.equal(0);
      expect(refunded).to.equal(false);
    });

    it("Should fail if non-manager tries to record investment", async function () {
      await expect(
        fundFlowCore.connect(investor1).recordInvestment(
          1, investor1.address, ethers.utils.parseEther("1")
        )
      ).to.be.revertedWith("Only investment manager");
    });

    it("Should calculate platform fees correctly", async function () {
      const amount = ethers.utils.parseEther("1");
      const expectedFee = amount.mul(250).div(10000); // 2.5%
      
      const calculatedFee = await fundFlowCore.calculatePlatformFee(amount);
      expect(calculatedFee).to.equal(expectedFee);
    });

    it("Should update total raised amount", async function () {
      const investmentAmount = ethers.utils.parseEther("2");
      
      await fundFlowCore.connect(investmentManager).recordInvestment(
        1, investor1.address, investmentAmount, { value: investmentAmount }
      );

      const campaign = await fundFlowCore.getCampaign(1);
      const platformFee = await fundFlowCore.calculatePlatformFee(investmentAmount);
      const expectedRaised = investmentAmount.sub(platformFee);
      
      expect(campaign.currentAmount).to.equal(expectedRaised);
    });
  });

  describe("Milestone Management", function () {
    beforeEach(async function () {
      // Register managers
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);

      // Create a campaign
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "ipfsHash", ethers.utils.parseEther("10"), 
        30, 0, [50, 50], ["Milestone 1", "Milestone 2"], ["Description 1", "Description 2"]
      );
    });

    it("Should allow milestone manager to add milestone", async function () {
      const title = "Milestone 1";
      const description = "First milestone";
      const targetAmount = ethers.utils.parseEther("2");
      const votingDays = 7;

      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          1, title, description, targetAmount, votingDays
        )
      ).to.emit(fundFlowCore, "MilestoneAdded")
       .withArgs(1, 0, title, targetAmount, ethers.utils.anyValue);

      const milestone = await fundFlowCore.getMilestone(1, 0);
      expect(milestone.title).to.equal(title);
      expect(milestone.targetAmount).to.equal(targetAmount);
    });

    it("Should fail if non-manager tries to add milestone", async function () {
      await expect(
        fundFlowCore.connect(creator).addMilestone(
          1, "title", "desc", ethers.utils.parseEther("1"), 7
        )
      ).to.be.revertedWith("Only milestone manager");
    });

    it("Should validate milestone parameters", async function () {
      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          999, "title", "desc", ethers.utils.parseEther("1"), 7
        )
      ).to.be.revertedWith("Campaign does not exist");

      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          1, "", "desc", ethers.utils.parseEther("1"), 7
        )
      ).to.be.revertedWith("Title required");

      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          1, "title", "", ethers.utils.parseEther("1"), 7
        )
      ).to.be.revertedWith("Description required");

      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          1, "title", "desc", 0, 7
        )
      ).to.be.revertedWith("Invalid target amount");

      await expect(
        fundFlowCore.connect(milestoneManager).addMilestone(
          1, "title", "desc", ethers.utils.parseEther("1"), 0
        )
      ).to.be.revertedWith("Invalid voting duration");
    });
  });

  describe("Platform Fee Management", function () {
    it("Should allow owner to update platform fee", async function () {
      const newFee = 500; // 5%
      
      await expect(
        fundFlowCore.setPlatformFeePercent(newFee)
      ).to.emit(fundFlowCore, "PlatformFeeUpdated")
       .withArgs(250, newFee);

      expect(await fundFlowCore.platformFeePercent()).to.equal(newFee);
    });

    it("Should fail to set fee above maximum", async function () {
      await expect(
        fundFlowCore.setPlatformFeePercent(1001) // > 10%
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to withdraw platform fees", async function () {
      // Register managers and create scenario with fees
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);
      
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "ipfsHash", ethers.utils.parseEther("10"), 
        30, 0, [50, 50], ["Milestone 1", "Milestone 2"], ["Description 1", "Description 2"]
      );
      
      const investmentAmount = ethers.utils.parseEther("1");
      await fundFlowCore.connect(investmentManager).recordInvestment(
        1, investor1.address, investmentAmount, { value: investmentAmount }
      );
      
      const fees = await fundFlowCore.totalPlatformFees();
      expect(fees).to.be.gt(0);
      
      const recipient = owner.address;
      await expect(
        fundFlowCore.withdrawPlatformFees(recipient)
      ).to.emit(fundFlowCore, "PlatformFeesWithdrawn")
       .withArgs(recipient, fees);
      
      expect(await fundFlowCore.totalPlatformFees()).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to pause and unpause", async function () {
      await fundFlowCore.pause();
      expect(await fundFlowCore.paused()).to.be.true;
      
      await fundFlowCore.unpause();
      expect(await fundFlowCore.paused()).to.be.false;
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        fundFlowCore.connect(investor1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent operations when paused", async function () {
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);
      await fundFlowCore.pause();
      
      await expect(
        fundFlowCore.connect(campaignManager).createCampaign(
          "title", "desc", "ipfs", ethers.utils.parseEther("1"), 
          30, 0, [100], ["Milestone"], ["Description"]
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);
      
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "ipfsHash", ethers.utils.parseEther("10"), 
        30, 0, [50, 50], ["Milestone 1", "Milestone 2"], ["Description 1", "Description 2"]
      );
      
      await fundFlowCore.connect(investmentManager).recordInvestment(
        1, investor1.address, ethers.utils.parseEther("1"), { value: ethers.utils.parseEther("1") }
      );
      await fundFlowCore.connect(investmentManager).recordInvestment(
        1, investor2.address, ethers.utils.parseEther("2"), { value: ethers.utils.parseEther("2") }
      );
    });

    it("Should return correct campaign investors", async function () {
      const investors = await fundFlowCore.getCampaignInvestors(1);
      expect(investors).to.include(investor1.address);
      expect(investors).to.include(investor2.address);
      expect(investors.length).to.equal(2);
    });

    it("Should return campaign count", async function () {
      const count = await fundFlowCore.getCampaignCount();
      expect(count).to.equal(1);
    });

    it("Should return contract balance", async function () {
      const balance = await fundFlowCore.getContractBalance();
      expect(balance).to.be.gt(0);
    });

    it("Should return next campaign ID", async function () {
      const nextId = await fundFlowCore.getNextCampaignId();
      expect(nextId).to.equal(2);
    });
  });

  describe("Emergency Functions", function () {
    it("Should allow owner to enable emergency refund", async function () {
      // Setup scenario with funds
      await fundFlowCore.setManagers(campaignManager.address, investmentManager.address, milestoneManager.address);
      
      await fundFlowCore.connect(campaignManager).createCampaign(
        "Test Campaign", "Description", "ipfsHash", ethers.utils.parseEther("10"), 
        30, 0, [50, 50], ["Milestone 1", "Milestone 2"], ["Description 1", "Description 2"]
      );
      
      await fundFlowCore.connect(investmentManager).recordInvestment(
        1, investor1.address, ethers.utils.parseEther("1"), { value: ethers.utils.parseEther("1") }
      );
      
      await expect(
        fundFlowCore.emergencyRefund(1)
      ).to.emit(fundFlowCore, "CampaignStatusChanged")
       .withArgs(1, 1, 4, "Emergency refund enabled"); // Active -> Cancelled
    });

    it("Should fail if non-owner tries emergency refund", async function () {
      await expect(
        fundFlowCore.connect(investor1).emergencyRefund(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
