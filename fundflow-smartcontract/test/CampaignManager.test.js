const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CampaignManager", function () {
  let campaignManager, fundFlowCore, investmentManager, milestoneManager;
  let owner, creator, investor1, investor2;
  
  beforeEach(async function () {
    [owner, creator, investor1, investor2] = await ethers.getSigners();
    
    // Deploy FundFlowCore first
    const FundFlowCore = await ethers.getContractFactory("FundFlowCore");
    fundFlowCore = await FundFlowCore.deploy();
    await fundFlowCore.deployed();
    
    // Deploy InvestmentManager
    const InvestmentManager = await ethers.getContractFactory("InvestmentManager");
    investmentManager = await InvestmentManager.deploy(owner.address, fundFlowCore.address);
    await investmentManager.deployed();
    
    // Deploy MilestoneManager
    const MilestoneManager = await ethers.getContractFactory("MilestoneManager");
    milestoneManager = await MilestoneManager.deploy(fundFlowCore.address);
    await milestoneManager.deployed();
    
    // Deploy CampaignManager
    const CampaignManager = await ethers.getContractFactory("CampaignManager");
    campaignManager = await CampaignManager.deploy(fundFlowCore.address);
    await campaignManager.deployed();
    
    // Register managers with FundFlowCore using setManagers
    await fundFlowCore.setManagers(
      campaignManager.address,
      investmentManager.address,
      milestoneManager.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await campaignManager.owner()).to.equal(owner.address);
    });

    it("Should set the correct FundFlowCore address", async function () {
      expect(await campaignManager.fundFlowCore()).to.equal(fundFlowCore.address);
    });

    it("Should initialize with correct minimum target amount", async function () {
      expect(await campaignManager.minimumTargetAmount()).to.equal(ethers.utils.parseEther("0.1"));
    });
  });

  describe("Campaign Creation", function () {
    it("Should create campaign successfully", async function () {
      const title = "Test Campaign";
      const description = "Test Description";
      const targetAmount = ethers.utils.parseEther("10");
      const durationDays = 30;
      const category = 1; // TECHNOLOGY

      const draft = {
        title: title,
        description: description,
        category: category,
        fundingGoal: targetAmount,
        duration: durationDays,
        tags: ["tech", "innovation"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(draft)
      ).to.emit(campaignManager, "CampaignDraftCreated")
       .withArgs(1, creator.address);

      // Note: The campaign won't be active until activateCampaign is called
    });

    it("Should validate campaign parameters", async function () {
      const invalidDraft1 = {
        title: "", // Empty title
        description: "desc",
        category: 1,
        fundingGoal: ethers.utils.parseEther("1"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(invalidDraft1)
      ).to.be.revertedWith("Invalid title length");

      const invalidDraft2 = {
        title: "title",
        description: "", // Empty description
        category: 1,
        fundingGoal: ethers.utils.parseEther("1"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(invalidDraft2)
      ).to.be.revertedWith("Invalid description length");

      const invalidDraft3 = {
        title: "title",
        description: "Valid description",
        category: 1,
        fundingGoal: ethers.utils.parseEther("0.05"), // Too low
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(invalidDraft3)
      ).to.be.revertedWith("Invalid funding goal");
    });

    it("Should prevent creation when paused", async function () {
      await campaignManager.pause();
      const validDraft = {
        title: "title",
        description: "desc",
        category: 1,
        fundingGoal: ethers.utils.parseEther("1"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };
      
      await expect(
        campaignManager.connect(creator).createCampaignDraft(validDraft)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should prevent creation with very long title or description", async function () {
      const longTitle = "a".repeat(201);
      const longDescription = "a".repeat(1001);

      const draftWithLongTitle = {
        title: longTitle,
        description: "desc",
        category: 1,
        fundingGoal: ethers.utils.parseEther("1"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(draftWithLongTitle)
      ).to.be.revertedWith("Invalid title length");

      const draftWithLongDescription = {
        title: "title",
        description: longDescription,
        category: 1,
        fundingGoal: ethers.utils.parseEther("1"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };

      await expect(
        campaignManager.connect(creator).createCampaignDraft(draftWithLongDescription)
      ).to.be.revertedWith("Invalid description length");
    });
  });

  describe("Campaign Updates", function () {
    beforeEach(async function () {
      // Create a campaign first
      const draft = {
        title: "Test Campaign",
        description: "Test Description",
        category: 1,
        fundingGoal: ethers.utils.parseEther("10"),
        duration: 30,
        tags: ["tech"],
        ipfsHash: "QmTestHash"
      };
      await campaignManager.connect(creator).createCampaignDraft(draft);
    });

    it("Should allow campaign creator to update campaign", async function () {
      const newTitle = "Updated Campaign";
      const newDescription = "Updated Description";

      await expect(
        campaignManager.connect(creator).updateCampaign(1, newTitle, newDescription)
      ).to.emit(campaignManager, "CampaignUpdated")
       .withArgs(1, newTitle, newDescription);
    });

    it("Should fail if non-creator tries to update", async function () {
      await expect(
        campaignManager.connect(investor1).updateCampaign(1, "new title", "new desc")
      ).to.be.revertedWith("Not campaign creator");
    });

    it("Should fail to update non-existent campaign", async function () {
      await expect(
        campaignManager.connect(creator).updateCampaign(999, "title", "desc")
      ).to.be.revertedWith("Campaign does not exist");
    });

    it("Should allow owner to pause/unpause campaign", async function () {
      await expect(
        campaignManager.pauseCampaign(1)
      ).to.emit(fundFlowCore, "CampaignStatusUpdated")
       .withArgs(1, 1, 2); // From ACTIVE to PAUSED

      await expect(
        campaignManager.unpauseCampaign(1)
      ).to.emit(fundFlowCore, "CampaignStatusUpdated")
       .withArgs(1, 2, 1); // From PAUSED to ACTIVE
    });

    it("Should fail if non-owner tries to pause campaign", async function () {
      await expect(
        campaignManager.connect(creator).pauseCampaign(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Campaign Queries", function () {
    beforeEach(async function () {
      // Create multiple campaigns
      await campaignManager.connect(creator).createCampaign(
        "Campaign 1", "Description 1", ethers.utils.parseEther("5"), 30, 1
      );
      await campaignManager.connect(investor1).createCampaign(
        "Campaign 2", "Description 2", ethers.utils.parseEther("10"), 60, 2
      );
      await campaignManager.connect(creator).createCampaign(
        "Campaign 3", "Description 3", ethers.utils.parseEther("15"), 45, 1
      );
    });

    it("Should return campaigns by creator", async function () {
      const campaigns = await campaignManager.getCampaignsByCreator(creator.address);
      expect(campaigns.length).to.equal(2);
      expect(campaigns).to.include(ethers.BigNumber.from(1));
      expect(campaigns).to.include(ethers.BigNumber.from(3));
    });

    it("Should return campaigns by category", async function () {
      const techCampaigns = await campaignManager.getCampaignsByCategory(1); // TECHNOLOGY
      expect(techCampaigns.length).to.equal(2);
      expect(techCampaigns).to.include(ethers.BigNumber.from(1));
      expect(techCampaigns).to.include(ethers.BigNumber.from(3));

      const healthCampaigns = await campaignManager.getCampaignsByCategory(2); // HEALTH
      expect(healthCampaigns.length).to.equal(1);
      expect(healthCampaigns).to.include(ethers.BigNumber.from(2));
    });

    it("Should return active campaigns", async function () {
      const activeCampaigns = await campaignManager.getActiveCampaigns();
      expect(activeCampaigns.length).to.equal(3);
    });

    it("Should return featured campaigns", async function () {
      // Mark campaign as featured
      await campaignManager.setFeaturedCampaign(1, true);
      
      const featuredCampaigns = await campaignManager.getFeaturedCampaigns();
      expect(featuredCampaigns).to.include(ethers.BigNumber.from(1));
    });

    it("Should return trending campaigns", async function () {
      const trendingCampaigns = await campaignManager.getTrendingCampaigns();
      // Should return empty array or campaigns based on algorithm
      expect(Array.isArray(trendingCampaigns)).to.be.true;
    });

    it("Should search campaigns by keyword", async function () {
      const results = await campaignManager.searchCampaigns("Campaign");
      // Should return campaigns matching the keyword
      expect(Array.isArray(results)).to.be.true;
    });
  });

  describe("Campaign Analytics", function () {
    beforeEach(async function () {
      await campaignManager.connect(creator).createCampaign(
        "Test Campaign", "Description", ethers.utils.parseEther("10"), 30, 1
      );
    });

    it("Should return campaign analytics", async function () {
      const analytics = await campaignManager.getCampaignAnalytics(1);
      expect(analytics.totalInvestors).to.equal(0);
      expect(analytics.averageInvestment).to.equal(0);
      expect(analytics.fundingProgress).to.equal(0);
    });

    it("Should fail to get analytics for non-existent campaign", async function () {
      await expect(
        campaignManager.getCampaignAnalytics(999)
      ).to.be.revertedWith("Campaign does not exist");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set minimum target amount", async function () {
      const newMinimum = ethers.utils.parseEther("1");
      
      await expect(
        campaignManager.setMinimumTargetAmount(newMinimum)
      ).to.emit(campaignManager, "MinimumTargetAmountUpdated")
       .withArgs(ethers.utils.parseEther("0.1"), newMinimum);

      expect(await campaignManager.minimumTargetAmount()).to.equal(newMinimum);
    });

    it("Should allow owner to set featured campaigns", async function () {
      // Create campaign first
      await campaignManager.connect(creator).createCampaign(
        "Test Campaign", "Description", ethers.utils.parseEther("10"), 30, 1
      );

      await expect(
        campaignManager.setFeaturedCampaign(1, true)
      ).to.emit(campaignManager, "FeaturedCampaignUpdated")
       .withArgs(1, true);

      expect(await campaignManager.isFeaturedCampaign(1)).to.be.true;
    });

    it("Should fail if non-owner tries admin functions", async function () {
      await expect(
        campaignManager.connect(creator).setMinimumTargetAmount(ethers.utils.parseEther("1"))
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        campaignManager.connect(creator).setFeaturedCampaign(1, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to update FundFlowCore address", async function () {
      const newCore = ethers.Wallet.createRandom().address;
      
      await expect(
        campaignManager.updateFundFlowCore(newCore)
      ).to.emit(campaignManager, "FundFlowCoreUpdated")
       .withArgs(fundFlowCore.address, newCore);

      expect(await campaignManager.fundFlowCore()).to.equal(newCore);
    });

    it("Should reject zero address for FundFlowCore", async function () {
      await expect(
        campaignManager.updateFundFlowCore(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid address");
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to pause and unpause", async function () {
      await campaignManager.pause();
      expect(await campaignManager.paused()).to.be.true;
      
      await campaignManager.unpause();
      expect(await campaignManager.paused()).to.be.false;
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        campaignManager.connect(creator).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent operations when paused", async function () {
      await campaignManager.pause();
      
      await expect(
        campaignManager.connect(creator).createCampaign(
          "title", "desc", ethers.utils.parseEther("1"), 30, 1
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle campaign deadline correctly", async function () {
      // Create campaign with 1-day duration
      await campaignManager.connect(creator).createCampaign(
        "Short Campaign", "Description", ethers.utils.parseEther("1"), 1, 1
      );

      const campaign = await fundFlowCore.getCampaign(1);
      const currentTime = await ethers.provider.getBlock("latest").then(b => b.timestamp);
      const expectedDeadline = currentTime + (24 * 60 * 60); // 1 day
      
      expect(campaign.deadline).to.be.closeTo(expectedDeadline, 60); // Within 1 minute
    });

    it("Should handle multiple campaigns from same creator", async function () {
      // Create multiple campaigns
      for (let i = 0; i < 5; i++) {
        await campaignManager.connect(creator).createCampaign(
          `Campaign ${i + 1}`, `Description ${i + 1}`, ethers.utils.parseEther("1"), 30, 1
        );
      }

      const campaigns = await campaignManager.getCampaignsByCreator(creator.address);
      expect(campaigns.length).to.equal(5);
    });

    it("Should handle empty search results", async function () {
      const results = await campaignManager.searchCampaigns("nonexistent");
      expect(results.length).to.equal(0);
    });
  });
});
