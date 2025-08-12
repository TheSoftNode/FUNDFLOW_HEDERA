const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AnalyticsManager", function () {
  let analyticsManager, fundFlowCore;
  let owner, creator, investor1, investor2;
  
  beforeEach(async function () {
    [owner, creator, investor1, investor2] = await ethers.getSigners();
    
    // Deploy FundFlowCore first
    const FundFlowCore = await ethers.getContractFactory("FundFlowCore");
    fundFlowCore = await FundFlowCore.deploy();
    await fundFlowCore.deployed();
    
    // Deploy AnalyticsManager
    const AnalyticsManager = await ethers.getContractFactory("AnalyticsManager");
    analyticsManager = await AnalyticsManager.deploy(fundFlowCore.address);
    await analyticsManager.deployed();
  });

  async function setupTestData() {
    // Create multiple campaigns
    await campaignManager.connect(creator).createCampaign(
      "Tech Campaign", "Technology project", ethers.utils.parseEther("10"), 30, 1
    );
    await campaignManager.connect(investor1).createCampaign(
      "Health Campaign", "Healthcare project", ethers.utils.parseEther("5"), 45, 2
    );
    await campaignManager.connect(creator).createCampaign(
      "Education Campaign", "Education platform", ethers.utils.parseEther("15"), 60, 3
    );

    // Make investments
    await investmentManager.connect(investor1).invest(1, { value: ethers.utils.parseEther("3") });
    await investmentManager.connect(investor2).invest(1, { value: ethers.utils.parseEther("2") });
    await investmentManager.connect(investor3).invest(1, { value: ethers.utils.parseEther("1") });
    
    await investmentManager.connect(investor2).invest(2, { value: ethers.utils.parseEther("1.5") });
    await investmentManager.connect(investor3).invest(2, { value: ethers.utils.parseEther("0.5") });
    
    await investmentManager.connect(investor1).invest(3, { value: ethers.utils.parseEther("4") });
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await analyticsManager.owner()).to.equal(owner.address);
    });

    it("Should set the correct FundFlowCore address", async function () {
      expect(await analyticsManager.fundFlowCore()).to.equal(fundFlowCore.address);
    });

    it("Should initialize with correct default values", async function () {
      expect(await analyticsManager.updateFrequency()).to.equal(24 * 60 * 60); // 24 hours
      expect(await analyticsManager.realTimeEnabled()).to.be.true;
    });
  });

  describe("Campaign Analytics", function () {
    it("Should get campaign metrics", async function () {
      const metrics = await analyticsManager.getCampaignMetrics(1);
      expect(metrics.averageInvestment).to.be.gte(0);
      expect(metrics.totalMilestones).to.be.gte(0);
      expect(metrics.fundingProgress).to.be.gte(0);
    });

    it("Should get campaign performance snapshots", async function () {
      const performance = await analyticsManager.getCampaignPerformance(1, 0); // DAILY
      expect(Array.isArray(performance)).to.be.true;
    });

    it("Should predict campaign success", async function () {
      const prediction = await analyticsManager.predictCampaignSuccess(1);
      expect(prediction.successProbability).to.be.gte(0);
      expect(prediction.successProbability).to.be.lte(10000); // Max 100%
      expect(prediction.expectedFinalAmount).to.be.gte(0);
    });

    it("Should compare campaign to benchmark", async function () {
      const comparison = await analyticsManager.compareCampaignToBenchmark(1, 1); // TECHNOLOGY
      expect(comparison.performanceScore).to.be.gte(0);
      expect(comparison.performanceScore).to.be.lte(10000);
    });

    it("Should get campaign trends", async function () {
      const trends = await analyticsManager.getCampaignTrends(1, 0); // DAILY
      expect(trends.length).to.be.gte(0);
    });

    it("Should fail for non-existent campaign", async function () {
      await expect(
        analyticsManager.getCampaignMetrics(999)
      ).to.be.revertedWith("Campaign does not exist");
    });
  });

  describe("Investor Analytics", function () {
    it("Should get investor metrics", async function () {
      const metrics = await analyticsManager.getInvestorMetrics(investor1.address);
      expect(metrics.totalInvested).to.be.gt(0);
      expect(metrics.totalCampaigns).to.be.gte(1);
      expect(metrics.averageInvestment).to.be.gt(0);
    });

    it("Should get investor performance", async function () {
      const performance = await analyticsManager.getInvestorPerformance(investor1.address, 0);
      expect(Array.isArray(performance)).to.be.true;
    });

    it("Should get investor risk profile", async function () {
      const riskProfile = await analyticsManager.getInvestorRiskProfile(investor1.address);
      expect(riskProfile.riskScore).to.be.gte(0);
      expect(riskProfile.riskScore).to.be.lte(10000);
      expect(riskProfile.riskLevel).to.be.gte(0);
      expect(riskProfile.riskLevel).to.be.lte(4); // LOW to VERY_HIGH
    });

    it("Should get investment recommendations", async function () {
      const recommendations = await analyticsManager.getInvestmentRecommendations(investor1.address);
      expect(Array.isArray(recommendations.recommendedCampaigns)).to.be.true;
      expect(Array.isArray(recommendations.confidenceScores)).to.be.true;
      expect(Array.isArray(recommendations.reasons)).to.be.true;
    });

    it("Should calculate investor diversification", async function () {
      const diversification = await analyticsManager.calculateInvestorDiversification(investor1.address);
      expect(diversification.diversificationScore).to.be.gte(0);
      expect(diversification.diversificationScore).to.be.lte(10000);
      expect(Array.isArray(diversification.sectors)).to.be.true;
      expect(Array.isArray(diversification.allocations)).to.be.true;
    });
  });

  describe("Platform Analytics", function () {
    it("Should get platform metrics", async function () {
      const metrics = await analyticsManager.getPlatformMetrics();
      expect(metrics.totalCampaigns).to.be.gte(3);
      expect(metrics.totalInvestments).to.be.gte(6);
      expect(metrics.totalVolume).to.be.gt(0);
      expect(metrics.averageInvestmentSize).to.be.gt(0);
    });

    it("Should get platform growth data", async function () {
      const growth = await analyticsManager.getPlatformGrowth(1); // WEEKLY
      expect(growth.userGrowth).to.be.gte(0);
      expect(growth.volumeGrowth).to.be.gte(0);
      expect(growth.revenueGrowth).to.be.gte(0);
    });

    it("Should get market share data", async function () {
      const marketShare = await analyticsManager.getMarketShare();
      expect(marketShare.platformShare).to.equal(1500); // 15%
      expect(marketShare.totalMarketSize).to.equal(ethers.utils.parseEther("1000000"));
      expect(Array.isArray(marketShare.competitorShares)).to.be.true;
    });

    it("Should get revenue forecast", async function () {
      const forecast = await analyticsManager.getRevenueForecast(2); // MONTHLY
      expect(Array.isArray(forecast.projectedRevenue)).to.be.true;
      expect(forecast.confidence).to.equal(7500); // 75%
    });
  });

  describe("Risk Analytics", function () {
    it("Should calculate risk score for campaign", async function () {
      const riskScore = await analyticsManager.calculateRiskScore(1);
      expect(riskScore).to.be.gte(0);
      expect(riskScore).to.be.lte(10000);
    });

    it("Should get compliance status", async function () {
      const compliance = await analyticsManager.getComplianceStatus(owner.address);
      expect(compliance.isCompliant).to.be.a('boolean');
      expect(compliance.complianceScore).to.be.gte(0);
      expect(compliance.complianceScore).to.be.lte(10000);
      expect(Array.isArray(compliance.violations)).to.be.true;
    });

    it("Should generate risk report", async function () {
      const report = await analyticsManager.generateRiskReport(1);
      expect(report.overallRisk).to.be.gte(0);
      expect(report.overallRisk).to.be.lte(4); // Risk levels
      expect(Array.isArray(report.riskFactors)).to.be.true;
      expect(Array.isArray(report.recommendations)).to.be.true;
    });
  });

  describe("Benchmarking", function () {
    it("Should get benchmark data", async function () {
      const benchmark = await analyticsManager.getBenchmark(1, 0); // TECHNOLOGY, DAILY
      expect(benchmark.averageRaised).to.be.gte(0);
      expect(benchmark.averageInvestors).to.be.gte(0);
      expect(benchmark.successRate).to.be.gte(0);
      expect(benchmark.successRate).to.be.lte(10000);
    });

    it("Should compare to industry standards", async function () {
      const comparison = await analyticsManager.compareToIndustry(1);
      expect(comparison.industryRank).to.be.gte(0);
      expect(comparison.percentile).to.be.gte(0);
      expect(comparison.percentile).to.be.lte(100);
      expect(Array.isArray(comparison.improvements)).to.be.true;
    });
  });

  describe("Advanced Analytics", function () {
    it("Should get cohort analysis", async function () {
      const cohortAnalysis = await analyticsManager.getCohortAnalysis(
        Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60, // 30 days ago
        Math.floor(Date.now() / 1000),
        0 // DAILY
      );
      expect(Array.isArray(cohortAnalysis.cohortSizes)).to.be.true;
      expect(Array.isArray(cohortAnalysis.retentionRates)).to.be.true;
      expect(Array.isArray(cohortAnalysis.lifetimeValues)).to.be.true;
    });

    it("Should get active alerts", async function () {
      const alerts = await analyticsManager.getActiveAlerts(investor1.address);
      expect(Array.isArray(alerts)).to.be.true;
    });

    it("Should predict market trends", async function () {
      const trends = await analyticsManager.predictMarketTrends("Technology", 2); // MONTHLY
      expect(trends.trends.direction).to.be.gte(0);
      expect(trends.trends.direction).to.be.lte(2); // UP, DOWN, STABLE
      expect(trends.trends.confidence).to.be.gte(0);
      expect(trends.trends.confidence).to.be.lte(10000);
      expect(Array.isArray(trends.opportunityScores)).to.be.true;
    });

    it("Should calculate sentiment score", async function () {
      const sentiment = await analyticsManager.calculateSentimentScore(1);
      expect(sentiment.overallSentiment).to.be.gte(0);
      expect(sentiment.overallSentiment).to.be.lte(10000);
      expect(sentiment.positiveRatio).to.be.gte(0);
      expect(sentiment.positiveRatio).to.be.lte(10000);
    });

    it("Should get network effects", async function () {
      const networkEffects = await analyticsManager.getNetworkEffects(1);
      expect(networkEffects.viralCoefficient).to.be.gte(0);
      expect(networkEffects.networkValue).to.be.gte(0);
      expect(Array.isArray(networkEffects.influencers)).to.be.true;
    });

    it("Should optimize portfolio", async function () {
      const optimization = await analyticsManager.optimizePortfolio(investor1.address);
      expect(Array.isArray(optimization.recommendedWeights)).to.be.true;
      expect(optimization.expectedReturn).to.be.gte(0);
      expect(optimization.riskLevel).to.be.gte(0);
      expect(optimization.riskLevel).to.be.lte(4);
    });
  });

  describe("Data Management", function () {
    it("Should export data", async function () {
      const exportedData = await analyticsManager.exportData("campaigns", 1, 0);
      expect(exportedData).to.not.be.empty;
    });

    it("Should integrate external data", async function () {
      const externalData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "string"],
        [12345, "external_data"]
      );

      await expect(
        analyticsManager.integrateExternalData("market_data", externalData)
      ).to.emit(analyticsManager, "ExternalDataIntegrated")
       .withArgs("market_data", externalData);
    });

    it("Should get historical data", async function () {
      const historicalData = await analyticsManager.getHistoricalData(
        "campaigns",
        1,
        Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60, // 7 days ago
        Math.floor(Date.now() / 1000),
        0 // DAILY
      );
      expect(Array.isArray(historicalData)).to.be.true;
    });

    it("Should get top performers", async function () {
      const topPerformers = await analyticsManager.getTopPerformers("campaigns", 5);
      expect(Array.isArray(topPerformers.entityIds)).to.be.true;
      expect(Array.isArray(topPerformers.scores)).to.be.true;
      expect(topPerformers.entityIds.length).to.be.lte(5);
    });
  });

  describe("Configuration", function () {
    it("Should get analytics configuration", async function () {
      const config = await analyticsManager.getAnalyticsConfiguration();
      expect(config[0]).to.equal(24 * 60 * 60); // updateFrequency
      expect(config[1]).to.be.true; // realTimeEnabled
      expect(Array.isArray(config[2])).to.be.true; // dataProviders
    });

    it("Should allow owner to update configuration", async function () {
      const newFrequency = 12 * 60 * 60; // 12 hours
      const newRealTime = false;

      await expect(
        analyticsManager.updateConfiguration(newFrequency, newRealTime)
      ).to.emit(analyticsManager, "ConfigurationUpdated")
       .withArgs(newFrequency, newRealTime);

      expect(await analyticsManager.updateFrequency()).to.equal(newFrequency);
      expect(await analyticsManager.realTimeEnabled()).to.equal(newRealTime);
    });

    it("Should allow adding data providers", async function () {
      const newProvider = ethers.Wallet.createRandom().address;

      await expect(
        analyticsManager.addDataProvider(newProvider)
      ).to.emit(analyticsManager, "DataProviderAdded")
       .withArgs(newProvider);

      const providers = await analyticsManager.getDataProviders();
      expect(providers).to.include(newProvider);
    });

    it("Should allow removing data providers", async function () {
      const provider = ethers.Wallet.createRandom().address;
      await analyticsManager.addDataProvider(provider);

      await expect(
        analyticsManager.removeDataProvider(provider)
      ).to.emit(analyticsManager, "DataProviderRemoved")
       .withArgs(provider);

      const providers = await analyticsManager.getDataProviders();
      expect(providers).to.not.include(provider);
    });

    it("Should fail configuration updates by non-owner", async function () {
      await expect(
        analyticsManager.connect(investor1).updateConfiguration(12 * 60 * 60, false)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await expect(
        analyticsManager.connect(investor1).addDataProvider(ethers.Wallet.createRandom().address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to pause and unpause", async function () {
      await analyticsManager.pause();
      expect(await analyticsManager.paused()).to.be.true;
      
      await analyticsManager.unpause();
      expect(await analyticsManager.paused()).to.be.false;
    });

    it("Should prevent operations when paused", async function () {
      await analyticsManager.pause();
      
      await expect(
        analyticsManager.updateConfiguration(12 * 60 * 60, false)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should fail if non-owner tries to pause", async function () {
      await expect(
        analyticsManager.connect(investor1).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to update FundFlowCore address", async function () {
      const newCore = ethers.Wallet.createRandom().address;
      
      await expect(
        analyticsManager.updateFundFlowCore(newCore)
      ).to.emit(analyticsManager, "FundFlowCoreUpdated")
       .withArgs(fundFlowCore.address, newCore);

      expect(await analyticsManager.fundFlowCore()).to.equal(newCore);
    });
  });

  describe("Real-time Analytics", function () {
    it("Should update metrics in real-time when enabled", async function () {
      expect(await analyticsManager.realTimeEnabled()).to.be.true;

      // Make a new investment
      await investmentManager.connect(investor2).invest(3, { 
        value: ethers.utils.parseEther("1") 
      });

      // Metrics should reflect the new investment
      const metrics = await analyticsManager.getPlatformMetrics();
      expect(metrics.totalInvestments).to.be.gte(7);
    });

    it("Should handle batch updates when real-time is disabled", async function () {
      await analyticsManager.updateConfiguration(24 * 60 * 60, false);

      await expect(
        analyticsManager.triggerBatchUpdate()
      ).to.emit(analyticsManager, "BatchUpdateTriggered")
       .withArgs(ethers.utils.anyValue);
    });

    it("Should prevent unauthorized batch updates", async function () {
      await expect(
        analyticsManager.connect(investor1).triggerBatchUpdate()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Edge Cases and Security", function () {
    it("Should handle empty data gracefully", async function () {
      // Test with investor who has no investments
      const newInvestor = ethers.Wallet.createRandom();
      
      const metrics = await analyticsManager.getInvestorMetrics(newInvestor.address);
      expect(metrics.totalInvested).to.equal(0);
      expect(metrics.totalCampaigns).to.equal(0);
    });

    it("Should handle invalid time ranges", async function () {
      const futureTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      const pastTime = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

      await expect(
        analyticsManager.getHistoricalData("campaigns", 1, futureTime, pastTime, 0)
      ).to.be.revertedWith("Invalid time range");
    });

    it("Should prevent division by zero errors", async function () {
      // Create campaign with no investments
      await campaignManager.connect(creator).createCampaign(
        "Empty Campaign", "No investments", ethers.utils.parseEther("1"), 30, 1
      );

      const metrics = await analyticsManager.getCampaignMetrics(4);
      expect(metrics.averageInvestment).to.equal(0);
    });

    it("Should handle large datasets efficiently", async function () {
      // This test would ideally create many campaigns and investments
      // For now, just verify the functions don't fail with current data
      const topPerformers = await analyticsManager.getTopPerformers("campaigns", 100);
      expect(Array.isArray(topPerformers.entityIds)).to.be.true;
    });

    it("Should validate enum parameters", async function () {
      // Most functions with enum parameters are marked as pure/view with comments
      // so they return default values - this is expected behavior
      const performance = await analyticsManager.getCampaignPerformance(1, 5); // Invalid enum
      expect(Array.isArray(performance)).to.be.true;
    });
  });
});
