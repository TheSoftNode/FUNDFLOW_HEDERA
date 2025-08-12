const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FundFlow", function () {
  let fundFlow;
  let owner, creator, investor1, investor2;
  
  beforeEach(async function () {
    [owner, creator, investor1, investor2] = await ethers.getSigners();
    
    const FundFlow = await ethers.getContractFactory("FundFlow");
    fundFlow = await FundFlow.deploy();
    await fundFlow.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fundFlow.owner()).to.equal(owner.address);
    });

    it("Should set correct initial values", async function () {
      expect(await fundFlow.platformFeePercent()).to.equal(250); // 2.5%
      expect(await fundFlow.getNextCampaignId()).to.equal(1);
      expect(await fundFlow.totalPlatformFees()).to.equal(0);
    });
  });

  describe("Campaign Management", function () {
    it("Should create a campaign successfully", async function () {
      const title = "Test Campaign";
      const description = "Test Description";
      const targetAmount = ethers.utils.parseEther("10");
      const durationDays = 30;

      await expect(
        fundFlow.connect(creator).createCampaign(title, description, targetAmount, durationDays)
      ).to.emit(fundFlow, "CampaignCreated");

      const campaign = await fundFlow.getCampaign(1);
      expect(campaign.creator).to.equal(creator.address);
      expect(campaign.title).to.equal(title);
      expect(campaign.targetAmount).to.equal(targetAmount);
    });

    it("Should fail to create campaign with invalid parameters", async function () {
      await expect(
        fundFlow.createCampaign("", "desc", ethers.utils.parseEther("1"), 30)
      ).to.be.revertedWith("Title required");

      await expect(
        fundFlow.createCampaign("title", "", ethers.utils.parseEther("1"), 30)
      ).to.be.revertedWith("Description required");

      await expect(
        fundFlow.createCampaign("title", "desc", 0, 30)
      ).to.be.revertedWith("Invalid target amount");

      await expect(
        fundFlow.createCampaign("title", "desc", ethers.utils.parseEther("1"), 0)
      ).to.be.revertedWith("Invalid duration");
    });
  });

  describe("Investments", function () {
    beforeEach(async function () {
      // Create a campaign first
      await fundFlow.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description", 
        ethers.utils.parseEther("10"),
        30
      );
    });

    it("Should allow investment in campaign", async function () {
      const investmentAmount = ethers.utils.parseEther("1");
      const platformFee = await fundFlow.calculatePlatformFee(investmentAmount);
      const netInvestment = investmentAmount.sub(platformFee);

      await expect(
        fundFlow.connect(investor1).investInCampaign(1, { value: investmentAmount })
      ).to.emit(fundFlow, "InvestmentMade")
       .withArgs(1, investor1.address, investmentAmount, netInvestment);

      const investment = await fundFlow.getInvestment(1, investor1.address);
      expect(investment).to.equal(netInvestment);
    });

    it("Should calculate platform fees correctly", async function () {
      const amount = ethers.utils.parseEther("1");
      const expectedFee = amount.mul(250).div(10000); // 2.5%
      
      const calculatedFee = await fundFlow.calculatePlatformFee(amount);
      expect(calculatedFee).to.equal(expectedFee);
    });

    it("Should fail investment with zero amount", async function () {
      await expect(
        fundFlow.connect(investor1).investInCampaign(1, { value: 0 })
      ).to.be.revertedWith("Invalid investment amount");
    });

    it("Should fail investment in non-existent campaign", async function () {
      await expect(
        fundFlow.connect(investor1).investInCampaign(999, { value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Campaign does not exist");
    });
  });

  describe("Milestones", function () {
    beforeEach(async function () {
      // Create a campaign and make an investment
      await fundFlow.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        ethers.utils.parseEther("10"),
        30
      );
      
      await fundFlow.connect(investor1).investInCampaign(1, { 
        value: ethers.utils.parseEther("5") 
      });
    });

    it("Should allow campaign creator to add milestone", async function () {
      const title = "Milestone 1";
      const description = "First milestone";
      const targetAmount = ethers.utils.parseEther("2");
      const votingDays = 7;

      await expect(
        fundFlow.connect(creator).addMilestone(1, title, description, targetAmount, votingDays)
      ).to.emit(fundFlow, "MilestoneAdded");

      const milestone = await fundFlow.getMilestone(1, 0);
      expect(milestone.title).to.equal(title);
      expect(milestone.targetAmount).to.equal(targetAmount);
    });

    it("Should fail if non-creator tries to add milestone", async function () {
      await expect(
        fundFlow.connect(investor1).addMilestone(
          1, "title", "desc", ethers.utils.parseEther("1"), 7
        )
      ).to.be.revertedWith("Not campaign creator");
    });

    it("Should allow investors to vote on milestones", async function () {
      // Add milestone
      await fundFlow.connect(creator).addMilestone(
        1, "Milestone 1", "Description", ethers.utils.parseEther("2"), 7
      );

      // Vote on milestone
      await expect(
        fundFlow.connect(investor1).voteOnMilestone(1, 0, true)
      ).to.emit(fundFlow, "MilestoneVoted");

      const vote = await fundFlow.getVote(1, 0, investor1.address);
      expect(vote.hasVoted).to.be.true;
      expect(vote.vote).to.be.true;
    });

    it("Should fail if non-investor tries to vote", async function () {
      await fundFlow.connect(creator).addMilestone(
        1, "Milestone 1", "Description", ethers.utils.parseEther("2"), 7
      );

      await expect(
        fundFlow.connect(investor2).voteOnMilestone(1, 0, true)
      ).to.be.revertedWith("Must be an investor");
    });
  });

  describe("Platform Fee Management", function () {
    it("Should allow owner to update platform fee", async function () {
      const newFee = 500; // 5%
      
      await expect(
        fundFlow.setPlatformFeePercent(newFee)
      ).to.emit(fundFlow, "PlatformFeeUpdated")
       .withArgs(250, newFee);

      expect(await fundFlow.platformFeePercent()).to.equal(newFee);
    });

    it("Should fail to set fee above maximum", async function () {
      await expect(
        fundFlow.setPlatformFeePercent(1001) // > 10%
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to withdraw platform fees", async function () {
      // Create campaign and investment to generate fees
      await fundFlow.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        ethers.utils.parseEther("10"),
        30
      );
      
      const investmentAmount = ethers.utils.parseEther("1");
      await fundFlow.connect(investor1).investInCampaign(1, { value: investmentAmount });
      
      const fees = await fundFlow.totalPlatformFees();
      expect(fees).to.be.gt(0);
      
      const recipient = owner.address;
      await expect(
        fundFlow.withdrawPlatformFees(recipient)
      ).to.emit(fundFlow, "PlatformFeesWithdrawn")
       .withArgs(recipient, fees);
      
      expect(await fundFlow.totalPlatformFees()).to.equal(0);
    });
  });

  describe("Contract Control", function () {
    it("Should allow owner to pause and unpause", async function () {
      await fundFlow.pause();
      expect(await fundFlow.paused()).to.be.true;
      
      // Should fail to create campaign when paused
      await expect(
        fundFlow.createCampaign("title", "desc", ethers.utils.parseEther("1"), 30)
      ).to.be.revertedWith("Pausable: paused");
      
      await fundFlow.unpause();
      expect(await fundFlow.paused()).to.be.false;
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        fundFlow.connect(investor1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("View Functions", function () {
    it("Should return correct campaign investors", async function () {
      await fundFlow.connect(creator).createCampaign(
        "Test Campaign",
        "Test Description",
        ethers.utils.parseEther("10"),
        30
      );
      
      await fundFlow.connect(investor1).investInCampaign(1, { 
        value: ethers.utils.parseEther("1") 
      });
      await fundFlow.connect(investor2).investInCampaign(1, { 
        value: ethers.utils.parseEther("2") 
      });
      
      const investors = await fundFlow.getCampaignInvestors(1);
      expect(investors).to.include(investor1.address);
      expect(investors).to.include(investor2.address);
      expect(investors.length).to.equal(2);
    });

    it("Should return contract balance", async function () {
      const balance = await fundFlow.getContractBalance();
      expect(balance).to.equal(0);
    });
  });
});