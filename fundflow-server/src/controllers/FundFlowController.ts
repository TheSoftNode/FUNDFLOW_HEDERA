import { Request, Response } from 'express';
import { fundFlowContractService } from '../services/FundFlowContractService';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export class FundFlowController {
  // ==================== CAMPAIGN MANAGEMENT ====================

  /**
   * Create a new campaign
   */
  async createCampaign(req: Request, res: Response) {
    try {
      const campaignData = {
        creator: (req as any).user.walletAddress,
        title: req.body.title,
        description: req.body.description,
        targetAmount: req.body.targetAmount,
        deadline: req.body.deadline,
        category: req.body.category,
        imageUrl: req.body.imageUrl || '',
        videoUrl: req.body.videoUrl || '',
        documents: req.body.documents || [],
        socialLinks: req.body.socialLinks || [],
        tags: req.body.tags || []
      };

      const result = await fundFlowContractService.createCampaign(campaignData);

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to create campaign', 500);
      }

      return ApiResponse.success(res, 'Campaign created successfully', {
        transactionId: result.transactionId,
        campaignData
      }, 201);
    } catch (error) {
      logger.error('Failed to create campaign:', error);
      return ApiResponse.error(res, 'Failed to create campaign', 500);
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaign(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;
      
      if (!campaignId) {
        return ApiResponse.error(res, 'Campaign ID is required', 400);
      }

      const result = await fundFlowContractService.getCampaign(parseInt(campaignId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get campaign', 500);
      }

      return ApiResponse.success(res, 'Campaign retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get campaign:', error);
      return ApiResponse.error(res, 'Failed to get campaign', 500);
    }
  }

  /**
   * Get campaigns with filters
   */
  async getCampaigns(req: Request, res: Response) {
    try {
      const { status, category, creator, page = 1, limit = 10 } = req.query;

      // For now, return active campaigns (this would be enhanced with database integration)
      const result = await fundFlowContractService.getActiveCampaigns();

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get campaigns', 500);
      }

      // Apply filters (in a real implementation, this would be done at the database level)
      let campaigns = result.data || [];
      
      if (status) {
        campaigns = campaigns.filter((c: any) => c.status === parseInt(status as string));
      }
      
      if (category) {
        campaigns = campaigns.filter((c: any) => c.category === category);
      }
      
      if (creator) {
        campaigns = campaigns.filter((c: any) => c.creator === creator);
      }

      // Simple pagination
      const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
      const endIndex = startIndex + parseInt(limit as string);
      const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

      return ApiResponse.success(res, 'Campaigns retrieved successfully', {
        campaigns: paginatedCampaigns,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: campaigns.length,
          totalPages: Math.ceil(campaigns.length / parseInt(limit as string))
        }
      });
    } catch (error) {
      logger.error('Failed to get campaigns:', error);
      return ApiResponse.error(res, 'Failed to get campaigns', 500);
    }
  }

  /**
   * Update campaign
   */
  async updateCampaign(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;
      const updates = req.body;
      const userWallet = (req as any).user.walletAddress;

      if (!campaignId) {
        return ApiResponse.error(res, 'Campaign ID is required', 400);
      }

      // Get campaign to verify ownership
      const campaignResult = await fundFlowContractService.getCampaign(parseInt(campaignId));
      
      if (!campaignResult.success) {
        return ApiResponse.error(res, 'Campaign not found', 404);
      }

      const campaign = campaignResult.data;
      if (campaign.creator !== userWallet) {
        return ApiResponse.forbidden(res, 'Only campaign creator can update campaign');
      }

      const result = await fundFlowContractService.updateCampaign(parseInt(campaignId), updates);

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to update campaign', 500);
      }

      return ApiResponse.success(res, 'Campaign updated successfully', {
        transactionId: result.transactionId,
        campaignId: parseInt(campaignId)
      });
    } catch (error) {
      logger.error('Failed to update campaign:', error);
      return ApiResponse.error(res, 'Failed to update campaign', 500);
    }
  }

  // ==================== INVESTMENT MANAGEMENT ====================

  /**
   * Make an investment
   */
  async makeInvestment(req: Request, res: Response) {
    try {
      const { campaignId, amount } = req.body;
      const investor = (req as any).user.walletAddress;

      const result = await fundFlowContractService.processInvestment(
        parseInt(campaignId),
        investor,
        amount
      );

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to process investment', 500);
      }

      return ApiResponse.success(res, 'Investment made successfully', {
        transactionId: result.transactionId,
        campaignId: parseInt(campaignId),
        investor,
        amount
      }, 201);
    } catch (error) {
      logger.error('Failed to make investment:', error);
      return ApiResponse.error(res, 'Failed to make investment', 500);
    }
  }

  /**
   * Get investments for a campaign
   */
  async getCampaignInvestments(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        return ApiResponse.error(res, 'Campaign ID is required', 400);
      }

      const result = await fundFlowContractService.getInvestmentsByCampaign(parseInt(campaignId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get campaign investments', 500);
      }

      return ApiResponse.success(res, 'Campaign investments retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get campaign investments:', error);
      return ApiResponse.error(res, 'Failed to get campaign investments', 500);
    }
  }

  /**
   * Get investments by investor
   */
  async getInvestorInvestments(req: Request, res: Response) {
    try {
      const { investorAddress } = req.params;

      if (!investorAddress) {
        return ApiResponse.error(res, 'Investor address is required', 400);
      }

      const result = await fundFlowContractService.getInvestmentsByInvestor(investorAddress);

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get investor investments', 500);
      }

      return ApiResponse.success(res, 'Investor investments retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get investor investments:', error);
      return ApiResponse.error(res, 'Failed to get investor investments', 500);
    }
  }

  // ==================== MILESTONE MANAGEMENT ====================

  /**
   * Add milestone to campaign
   */
  async addMilestone(req: Request, res: Response) {
    try {
      const milestoneData = {
        campaignId: parseInt(req.body.campaignId),
        title: req.body.title,
        description: req.body.description,
        targetAmount: req.body.targetAmount,
        deadline: req.body.deadline,
        votingDeadline: req.body.votingDeadline
      };

      const result = await fundFlowContractService.addMilestone(milestoneData);

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to add milestone', 500);
      }

      return ApiResponse.success(res, 'Milestone added successfully', {
        transactionId: result.transactionId,
        milestoneData
      }, 201);
    } catch (error) {
      logger.error('Failed to add milestone:', error);
      return ApiResponse.error(res, 'Failed to add milestone', 500);
    }
  }

  /**
   * Vote on milestone
   */
  async voteOnMilestone(req: Request, res: Response) {
    try {
      const { milestoneId } = req.params;
      const { vote, votingPower } = req.body;
      const voter = (req as any).user.walletAddress;

      const result = await fundFlowContractService.voteOnMilestone(
        parseInt(milestoneId),
        voter,
        vote,
        parseInt(votingPower)
      );

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to record vote', 500);
      }

      return ApiResponse.success(res, 'Vote recorded successfully', {
        transactionId: result.transactionId,
        milestoneId: parseInt(milestoneId),
        vote,
        votingPower: parseInt(votingPower)
      });
    } catch (error) {
      logger.error('Failed to record vote:', error);
      return ApiResponse.error(res, 'Failed to record vote', 500);
    }
  }

  /**
   * Execute milestone
   */
  async executeMilestone(req: Request, res: Response) {
    try {
      const { milestoneId } = req.params;

      const result = await fundFlowContractService.executeMilestone(parseInt(milestoneId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to execute milestone', 500);
      }

      return ApiResponse.success(res, 'Milestone executed successfully', {
        transactionId: result.transactionId,
        milestoneId: parseInt(milestoneId)
      });
    } catch (error) {
      logger.error('Failed to execute milestone:', error);
      return ApiResponse.error(res, 'Failed to execute milestone', 500);
    }
  }

  /**
   * Get milestones for a campaign
   */
  async getCampaignMilestones(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        return ApiResponse.error(res, 'Campaign ID is required', 400);
      }

      const result = await fundFlowContractService.getMilestonesByCampaign(parseInt(campaignId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get campaign milestones', 500);
      }

      return ApiResponse.success(res, 'Campaign milestones retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get campaign milestones:', error);
      return ApiResponse.error(res, 'Failed to get campaign milestones', 500);
    }
  }

  // ==================== ANALYTICS ====================

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics(req: Request, res: Response) {
    try {
      const result = await fundFlowContractService.getPlatformAnalytics();

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get platform analytics', 500);
      }

      return ApiResponse.success(res, 'Platform analytics retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get platform analytics:', error);
      return ApiResponse.error(res, 'Failed to get platform analytics', 500);
    }
  }

  /**
   * Get campaign analytics
   */
  async getCampaignAnalytics(req: Request, res: Response) {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        return ApiResponse.error(res, 'Campaign ID is required', 400);
      }

      const result = await fundFlowContractService.getCampaignAnalytics(parseInt(campaignId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get campaign analytics', 500);
      }

      return ApiResponse.success(res, 'Campaign analytics retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get campaign analytics:', error);
      return ApiResponse.error(res, 'Failed to get campaign analytics', 500);
    }
  }

  /**
   * Get investor analytics
   */
  async getInvestorAnalytics(req: Request, res: Response) {
    try {
      const { investorAddress } = req.params;

      if (!investorAddress) {
        return ApiResponse.error(res, 'Investor address is required', 400);
      }

      const result = await fundFlowContractService.getInvestorAnalytics(investorAddress);

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to get investor analytics', 500);
      }

      return ApiResponse.success(res, 'Investor analytics retrieved successfully', result.data);
    } catch (error) {
      logger.error('Failed to get investor analytics:', error);
      return ApiResponse.error(res, 'Failed to get investor analytics', 500);
    }
  }

  // ==================== GOVERNANCE ====================

  /**
   * Create governance proposal
   */
  async createProposal(req: Request, res: Response) {
    try {
      const { campaignId, proposalType, title, description, executionData } = req.body;

      const result = await fundFlowContractService.createProposal(
        parseInt(campaignId),
        parseInt(proposalType),
        title,
        description,
        executionData
      );

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to create proposal', 500);
      }

      return ApiResponse.success(res, 'Proposal created successfully', {
        transactionId: result.transactionId,
        proposalData: { campaignId, proposalType, title, description, executionData }
      }, 201);
    } catch (error) {
      logger.error('Failed to create proposal:', error);
      return ApiResponse.error(res, 'Failed to create proposal', 500);
    }
  }

  /**
   * Vote on governance proposal
   */
  async voteOnProposal(req: Request, res: Response) {
    try {
      const { proposalId } = req.params;
      const { vote, votingPower } = req.body;
      const voter = (req as any).user.walletAddress;

      const result = await fundFlowContractService.voteOnProposal(
        parseInt(proposalId),
        voter,
        vote,
        parseInt(votingPower)
      );

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to record vote', 500);
      }

      return ApiResponse.success(res, 'Vote recorded successfully', {
        transactionId: result.transactionId,
        proposalId: parseInt(proposalId),
        vote,
        votingPower: parseInt(votingPower)
      });
    } catch (error) {
      logger.error('Failed to record vote:', error);
      return ApiResponse.error(res, 'Failed to record vote', 500);
    }
  }

  /**
   * Execute governance proposal
   */
  async executeProposal(req: Request, res: Response) {
    try {
      const { proposalId } = req.params;

      const result = await fundFlowContractService.executeProposal(parseInt(proposalId));

      if (!result.success) {
        return ApiResponse.error(res, result.error || 'Failed to execute proposal', 500);
      }

      return ApiResponse.success(res, 'Proposal executed successfully', {
        transactionId: result.transactionId,
        proposalId: parseInt(proposalId)
      });
    } catch (error) {
      logger.error('Failed to execute proposal:', error);
      return ApiResponse.error(res, 'Failed to execute proposal', 500);
    }
  }
}
