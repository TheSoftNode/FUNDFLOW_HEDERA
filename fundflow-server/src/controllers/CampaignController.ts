import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/CampaignService';
import { logger } from '../utils/logger';

export class CampaignController {
  // GET /api/campaigns - Get all campaigns
  static async getCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        industry,
        category,
        stage,
        featured,
        verified,
        sortBy
      } = req.query;

      const result = await CampaignService.getCampaigns({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        industry: industry as string,
        category: category as string,
        stage: stage as string,
        featured: featured === 'true',
        verified: verified === 'true',
        sortBy: sortBy as string
      });

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getCampaigns:', error);
      next(error);
    }
  }

  // GET /api/campaigns/:id - Get campaign details
  static async getCampaignById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.getCampaignById(id);

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      logger.error('Error in getCampaignById:', error);
      next(error);
    }
  }

  // POST /api/campaigns - Create new campaign
  static async createCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const campaignData = req.body;

      const campaign = await CampaignService.createCampaign(campaignData);

      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campaign created successfully'
      });
    } catch (error) {
      logger.error('Error in createCampaign:', error);
      next(error);
    }
  }

  // PUT /api/campaigns/:id - Update campaign
  static async updateCampaign(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.updateCampaign(id, updateData);

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: campaign,
        message: 'Campaign updated successfully'
      });
    } catch (error) {
      logger.error('Error in updateCampaign:', error);
      next(error);
    }
  }

  // POST /api/campaigns/:id/invest - Add investment to campaign
  static async addInvestment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const investmentData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.addInvestment(id, investmentData);

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: campaign,
        message: 'Investment added successfully'
      });
    } catch (error) {
      logger.error('Error in addInvestment:', error);
      next(error);
    }
  }

  // POST /api/campaigns/:id/milestones - Add milestone to campaign
  static async addMilestone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const milestoneData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.addMilestone(id, milestoneData);

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: campaign,
        message: 'Milestone added successfully'
      });
    } catch (error) {
      logger.error('Error in addMilestone:', error);
      next(error);
    }
  }

  // GET /api/campaigns/creator/:walletAddress - Get campaigns by creator
  static async getCampaignsByCreator(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 20 } = req.query;

      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }

      const result = await CampaignService.getCampaignsByCreator(
        walletAddress,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getCampaignsByCreator:', error);
      next(error);
    }
  }

  // GET /api/campaigns/investor/:walletAddress - Get campaigns by investor
  static async getCampaignsByInvestor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 20 } = req.query;

      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }

      const result = await CampaignService.getCampaignsByInvestor(
        walletAddress,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getCampaignsByInvestor:', error);
      next(error);
    }
  }

  // GET /api/campaigns/search - Search campaigns
  static async searchCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, page = 1, limit = 20, ...filters } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
        return;
      }

      const result = await CampaignService.searchCampaigns(
        q as string,
        filters,
        Number(page),
        Number(limit)
      );

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in searchCampaigns:', error);
      next(error);
    }
  }

  // GET /api/campaigns/stats - Get campaign statistics
  static async getCampaignStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await CampaignService.getCampaignStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in getCampaignStats:', error);
      next(error);
    }
  }

  // GET /api/campaigns/featured - Get featured campaigns
  static async getFeaturedCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await CampaignService.getCampaigns({
        featured: true,
        status: 'active',
        page: Number(page),
        limit: Number(limit),
        sortBy: 'createdAt'
      });

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getFeaturedCampaigns:', error);
      next(error);
    }
  }

  // GET /api/campaigns/trending - Get trending campaigns
  static async getTrendingCampaigns(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await CampaignService.getCampaigns({
        status: 'active',
        page: Number(page),
        limit: Number(limit),
        sortBy: 'views'
      });

      res.json({
        success: true,
        data: result.campaigns,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getTrendingCampaigns:', error);
      next(error);
    }
  }

  // PUT /api/campaigns/:id/like - Like/unlike campaign
  static async toggleLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { liked } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.updateCampaign(id, {
        $inc: { likes: liked ? 1 : -1 }
      });

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { likes: campaign.likes },
        message: liked ? 'Campaign liked' : 'Campaign unliked'
      });
    } catch (error) {
      logger.error('Error in toggleLike:', error);
      next(error);
    }
  }

  // PUT /api/campaigns/:id/share - Increment share count
  static async incrementShare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Campaign ID is required'
        });
        return;
      }

      const campaign = await CampaignService.updateCampaign(id, {
        $inc: { shares: 1 }
      });

      if (!campaign) {
        res.status(404).json({
          success: false,
          error: 'Campaign not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { shares: campaign.shares },
        message: 'Share count updated'
      });
    } catch (error) {
      logger.error('Error in incrementShare:', error);
      next(error);
    }
  }
}