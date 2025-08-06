import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';

export class UserController {
  // GET /api/users/profile/:walletAddress - Get user profile
  static async getUserProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }
      
      const user = await UserService.getUserByWallet(walletAddress);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      logger.error('Error in getUserProfile:', error);
      next(error);
    }
  }

  // POST /api/users/profile - Create or update user profile
  static async createOrUpdateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress, role, profile, preferences } = req.body;
      
      const user = await UserService.createOrUpdateUser({
        walletAddress,
        role,
        profile,
        preferences
      });

      const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();

      res.status(isNewUser ? 201 : 200).json({
        success: true,
        data: user.toJSON(),
        message: isNewUser ? 'Profile created successfully' : 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Error in createOrUpdateProfile:', error);
      next(error);
    }
  }

  // PUT /api/users/profile/:walletAddress - Update user profile
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      const updateData = req.body;
      
      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }
      
      const user = await UserService.updateUserProfile(walletAddress, updateData);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: user.toJSON(),
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logger.error('Error in updateProfile:', error);
      next(error);
    }
  }

  // GET /api/users/search - Search users
  static async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q, role, industry, page = 1, limit = 20 } = req.query;
      
      const result = await UserService.searchUsers({
        q: q as string,
        role: role as 'investor' | 'startup',
        industry: industry as string,
        page: Number(page),
        limit: Number(limit)
      });
      
      res.json({
        success: true,
        data: result.users.map(user => user.toJSON()),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in searchUsers:', error);
      next(error);
    }
  }

  // GET /api/users/stats - Get platform statistics
  static async getPlatformStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await UserService.getPlatformStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in getPlatformStats:', error);
      next(error);
    }
  }

  // GET /api/users/investors - Get all investors
  static async getInvestors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await UserService.getUsersByRole('investor', Number(page), Number(limit));
      
      res.json({
        success: true,
        data: result.users.map(user => user.toJSON()),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getInvestors:', error);
      next(error);
    }
  }

  // GET /api/users/startups - Get all startups
  static async getStartups(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await UserService.getUsersByRole('startup', Number(page), Number(limit));
      
      res.json({
        success: true,
        data: result.users.map(user => user.toJSON()),
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getStartups:', error);
      next(error);
    }
  }

  // PUT /api/users/:walletAddress/last-active - Update last active
  static async updateLastActive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }
      
      await UserService.updateLastActive(walletAddress);
      
      res.json({
        success: true,
        message: 'Last active updated'
      });
    } catch (error) {
      logger.error('Error in updateLastActive:', error);
      next(error);
    }
  }

  // DELETE /api/users/:walletAddress - Delete user (GDPR)
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }
      
      const deleted = await UserService.deleteUser(walletAddress);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      next(error);
    }
  }
}