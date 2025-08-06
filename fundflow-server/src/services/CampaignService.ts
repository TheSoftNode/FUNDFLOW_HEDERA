import Campaign, { ICampaign } from '../models/Campaign';
import Investment, { IInvestment } from '../models/Investment';
import Milestone, { IMilestone } from '../models/Milestone';
import { UserService } from './UserService';
import { logger } from '../utils/logger';

export class CampaignService {
  // Create a new campaign
  static async createCampaign(campaignData: {
    chainId: number;
    creatorAddress: string;
    contractAddress: string;
    title: string;
    description: string;
    longDescription?: string;
    targetAmount: number;
    deadline: Date;
    category: string;
    industry: string;
    stage: string;
    team?: any[];
    media?: any;
    metrics?: any;
    fundingDetails: any;
  }): Promise<ICampaign> {
    try {
      const campaign = new Campaign({
        ...campaignData,
        creatorAddress: campaignData.creatorAddress.toLowerCase(),
        status: 'active',
        raisedAmount: 0,
        investorCount: 0,
        milestones: [],
        investments: [],
        views: 0,
        likes: 0,
        shares: 0,
        featured: false,
        verified: false,
        launchedAt: new Date()
      });

      await campaign.save();
      
      // Update creator's stats
      await UserService.updateUserStats(campaignData.creatorAddress, {
        activeCampaigns: await Campaign.countDocuments({
          creatorAddress: campaignData.creatorAddress.toLowerCase(),
          status: 'active'
        })
      });

      logger.info(`Campaign created: ${campaign._id} by ${campaignData.creatorAddress}`);
      return campaign;
    } catch (error) {
      logger.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Get campaign by ID
  static async getCampaignById(campaignId: string): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findById(campaignId);
      
      if (campaign) {
        // Increment view count
        campaign.views += 1;
        await campaign.save();
      }
      
      return campaign;
    } catch (error) {
      logger.error('Error fetching campaign:', error);
      throw error;
    }
  }

  // Get campaigns with filters and pagination
  static async getCampaigns(filters: {
    status?: string;
    industry?: string;
    category?: string;
    stage?: string;
    featured?: boolean;
    verified?: boolean;
    creatorAddress?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    try {
      const {
        status,
        industry,
        category,
        stage,
        featured,
        verified,
        creatorAddress,
        page = 1,
        limit = 20,
        sortBy = 'createdAt'
      } = filters;

      const filter: any = {};

      if (status) filter.status = status;
      if (industry) filter.industry = new RegExp(industry, 'i');
      if (category) filter.category = new RegExp(category, 'i');
      if (stage) filter.stage = stage;
      if (featured !== undefined) filter.featured = featured;
      if (verified !== undefined) filter.verified = verified;
      if (creatorAddress) filter.creatorAddress = creatorAddress.toLowerCase();

      const skip = (page - 1) * limit;
      
      let sortOptions: any = { createdAt: -1 };
      if (sortBy === 'raisedAmount') sortOptions = { raisedAmount: -1 };
      if (sortBy === 'deadline') sortOptions = { deadline: 1 };
      if (sortBy === 'views') sortOptions = { views: -1 };

      const campaigns = await Campaign.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalCampaigns = await Campaign.countDocuments(filter);

      return {
        campaigns,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCampaigns / limit),
          totalItems: totalCampaigns,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Update campaign
  static async updateCampaign(campaignId: string, updateData: any): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );

      if (campaign) {
        logger.info(`Campaign updated: ${campaignId}`);
      }

      return campaign;
    } catch (error) {
      logger.error('Error updating campaign:', error);
      throw error;
    }
  }

  // Add investment to campaign
  static async addInvestment(campaignId: string, investmentData: {
    investorAddress: string;
    amount: number;
    netAmount: number;
    platformFee: number;
    transactionId: string;
    blockHeight: number;
  }): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findById(campaignId);
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // Create investment record  
      const investment = new Investment({
        campaignId: campaign._id,
        investorAddress: investmentData.investorAddress.toLowerCase(),
        creatorAddress: campaign.creatorAddress,
        amount: investmentData.amount,
        netAmount: investmentData.netAmount,
        platformFee: investmentData.platformFee,
        transactionId: investmentData.transactionId,
        blockHeight: investmentData.blockHeight,
        timestamp: new Date(),
        status: 'confirmed',
        votingPower: investmentData.netAmount,
        expectedReturns: 0,
        actualReturns: 0,
        payouts: [],
        votes: []
      });

      await investment.save();

      // Update campaign with investment
      await campaign.addInvestment({
        investorAddress: investmentData.investorAddress.toLowerCase(),
        amount: investmentData.netAmount,
        timestamp: new Date(),
        transactionId: investmentData.transactionId
      });

      // Update investor stats
      const investorStats = await Investment.getPortfolioStats(investmentData.investorAddress);
      if (investorStats.length > 0) {
        const stats = investorStats[0];
        await UserService.updateUserStats(investmentData.investorAddress, {
          totalInvested: stats.totalInvested,
          activeInvestments: stats.investmentCount
        });
      }

      logger.info(`Investment added to campaign ${campaignId}: ${investmentData.amount} from ${investmentData.investorAddress}`);
      return campaign;
    } catch (error) {
      logger.error('Error adding investment:', error);
      throw error;
    }
  }

  // Add milestone to campaign
  static async addMilestone(campaignId: string, milestoneData: {
    title: string;
    description: string;
    targetAmount: number;
    deliverables: string[];
    expectedCompletionDate: Date;
    votingDurationDays: number;
  }): Promise<ICampaign | null> {
    try {
      const campaign = await Campaign.findById(campaignId);
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      const votingDeadline = new Date();
      votingDeadline.setDate(votingDeadline.getDate() + milestoneData.votingDurationDays);

      // Create milestone record
      const milestone = new Milestone({
        campaignId: campaign._id,
        milestoneIndex: campaign.milestones.length,
        title: milestoneData.title,
        description: milestoneData.description,
        targetAmount: milestoneData.targetAmount,
        deliverables: milestoneData.deliverables,
        startDate: new Date(),
        expectedCompletionDate: milestoneData.expectedCompletionDate,
        votingDeadline,
        status: 'pending',
        evidence: [],
        votes: [],
        votesFor: 0,
        votesAgainst: 0,
        totalVotingPower: 0,
        votingPowerFor: 0,
        votingPowerAgainst: 0,
        fundsReleased: false,
        releasedAmount: 0,
        requiredApprovalPercentage: 50,
        minimumVotingPower: 0
      });

      await milestone.save();

      // Add milestone to campaign
      await campaign.addMilestone({
        id: milestone.milestoneIndex,
        title: milestone.title,
        description: milestone.description,
        targetAmount: milestone.targetAmount,
        isCompleted: false,
        votesFor: 0,
        votesAgainst: 0,
        votingDeadline
      });

      logger.info(`Milestone added to campaign ${campaignId}: ${milestone.title}`);
      return campaign;
    } catch (error) {
      logger.error('Error adding milestone:', error);
      throw error;
    }
  }

  // Get campaigns by creator
  static async getCampaignsByCreator(creatorAddress: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const campaigns = await Campaign.find({ 
        creatorAddress: creatorAddress.toLowerCase() 
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCampaigns = await Campaign.countDocuments({ 
        creatorAddress: creatorAddress.toLowerCase() 
      });

      return {
        campaigns,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCampaigns / limit),
          totalItems: totalCampaigns,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error fetching campaigns by creator:', error);
      throw error;
    }
  }

  // Get campaigns by investor
  static async getCampaignsByInvestor(investorAddress: string, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const campaigns = await Campaign.find({ 
        'investments.investorAddress': investorAddress.toLowerCase() 
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCampaigns = await Campaign.countDocuments({ 
        'investments.investorAddress': investorAddress.toLowerCase() 
      });

      return {
        campaigns,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCampaigns / limit),
          totalItems: totalCampaigns,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error fetching campaigns by investor:', error);
      throw error;
    }
  }

  // Get campaign statistics
  static async getCampaignStats() {
    try {
      const totalCampaigns = await Campaign.countDocuments();
      const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
      const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });
      
      const totalRaisedResult = await Campaign.aggregate([
        { $group: { _id: null, total: { $sum: '$raisedAmount' } } }
      ]);
      
      const totalRaised = totalRaisedResult.length > 0 ? totalRaisedResult[0].total : 0;
      
      const totalInvestorsResult = await Campaign.aggregate([
        { $group: { _id: null, total: { $sum: '$investorCount' } } }
      ]);
      
      const totalInvestors = totalInvestorsResult.length > 0 ? totalInvestorsResult[0].total : 0;
      
      const avgCampaignSizeResult = await Campaign.aggregate([
        { $match: { raisedAmount: { $gt: 0 } } },
        { $group: { _id: null, avg: { $avg: '$raisedAmount' } } }
      ]);
      
      const averageCampaignSize = avgCampaignSizeResult.length > 0 ? avgCampaignSizeResult[0].avg : 0;
      
      const successRate = totalCampaigns > 0 ? (completedCampaigns / totalCampaigns) * 100 : 0;
      
      const topIndustries = await Campaign.aggregate([
        { $group: { _id: '$industry', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $project: { name: '$_id', count: 1, _id: 0 } }
      ]);

      return {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalRaised,
        totalInvestors,
        averageCampaignSize,
        successRate,
        topIndustries
      };
    } catch (error) {
      logger.error('Error fetching campaign stats:', error);
      throw error;
    }
  }

  // Update campaign status based on deadline and funding
  static async updateCampaignStatuses(): Promise<void> {
    try {
      const campaigns = await Campaign.find({ status: 'active' });
      
      for (const campaign of campaigns) {
        await campaign.updateStatus();
      }
      
      logger.info('Campaign statuses updated');
    } catch (error) {
      logger.error('Error updating campaign statuses:', error);
      throw error;
    }
  }

  // Search campaigns
  static async searchCampaigns(query: string, filters: any = {}, page = 1, limit = 20) {
    try {
      const searchFilter: any = {
        $or: [
          { title: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') },
          { category: new RegExp(query, 'i') },
          { industry: new RegExp(query, 'i') },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      };

      // Add additional filters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined) {
          searchFilter[key] = filters[key];
        }
      });

      const skip = (page - 1) * limit;
      
      const campaigns = await Campaign.find(searchFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCampaigns = await Campaign.countDocuments(searchFilter);

      return {
        campaigns,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCampaigns / limit),
          totalItems: totalCampaigns,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error searching campaigns:', error);
      throw error;
    }
  }
}