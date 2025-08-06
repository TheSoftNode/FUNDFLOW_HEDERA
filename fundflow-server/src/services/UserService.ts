import User, { IUser } from '../models/User';
import { logger } from '../utils/logger';

export class UserService {
  // Create or update user profile
  static async createOrUpdateUser(userData: {
    walletAddress: string;
    role: 'investor' | 'startup';
    profile: any;
    preferences?: any;
  }): Promise<IUser> {
    try {
      const { walletAddress, role, profile, preferences } = userData;
      
      // Check if user already exists
      let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      
      if (user) {
        // Update existing user
        user.role = role;
        user.profile = { ...user.profile, ...profile };
        if (preferences) {
          user.preferences = { ...user.preferences, ...preferences };
        }
        await user.save();
        
        logger.info(`User profile updated: ${walletAddress}`);
        return user;
      } else {
        // Create new user
        user = new User({
          walletAddress: walletAddress.toLowerCase(),
          role,
          profile,
          preferences: preferences || {
            interests: [],
            goals: [],
            notifications: {
              email: true,
              push: true,
              marketing: false
            },
            privacy: {
              profileVisibility: 'public',
              showInvestments: true,
              showCampaigns: true
            }
          }
        });
        await user.save();
        
        logger.info(`New user profile created: ${walletAddress}`);
        return user;
      }
    } catch (error) {
      logger.error('Error creating/updating user:', error);
      throw error;
    }
  }

  // Get user by wallet address
  static async getUserByWallet(walletAddress: string): Promise<IUser | null> {
    try {
      return await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    } catch (error) {
      logger.error('Error fetching user by wallet:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(
    walletAddress: string,
    updateData: {
      profile?: any;
      preferences?: any;
      settings?: any;
    }
  ): Promise<IUser | null> {
    try {
      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      
      if (!user) {
        return null;
      }

      // Update user fields
      if (updateData.profile) {
        user.profile = { ...user.profile, ...updateData.profile };
      }
      if (updateData.preferences) {
        user.preferences = { ...user.preferences, ...updateData.preferences };
      }
      if (updateData.settings) {
        user.settings = { ...user.settings, ...updateData.settings };
      }

      await user.save();
      
      logger.info(`User profile updated: ${walletAddress}`);
      return user;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Search users
  static async searchUsers(filters: {
    q?: string;
    role?: 'investor' | 'startup';
    industry?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const { q, role, industry, page = 1, limit = 20 } = filters;
      
      const filter: any = {
        'preferences.privacy.profileVisibility': { $in: ['public'] }
      };
      
      if (role) {
        filter.role = role;
      }
      
      if (industry) {
        filter['profile.industry'] = new RegExp(industry, 'i');
      }
      
      if (q) {
        filter.$or = [
          { 'profile.name': new RegExp(q, 'i') },
          { 'profile.company': new RegExp(q, 'i') },
          { 'profile.companyName': new RegExp(q, 'i') }
        ];
      }
      
      const skip = (page - 1) * limit;
      
      const users = await User.find(filter)
        .select('walletAddress role profile stats createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const totalUsers = await User.countDocuments(filter);
      
      return {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalItems: totalUsers,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error searching users:', error);
      throw error;
    }
  }

  // Get platform statistics
  static async getPlatformStats() {
    try {
      const totalUsers = await User.countDocuments();
      const totalInvestors = await User.countDocuments({ role: 'investor' });
      const totalStartups = await User.countDocuments({ role: 'startup' });
      
      const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
      
      const thisMonthUsers = await User.countDocuments({
        createdAt: { $gte: thisMonth }
      });
      
      const lastMonthUsers = await User.countDocuments({
        createdAt: {
          $gte: lastMonth,
          $lt: thisMonth
        }
      });
      
      return {
        totalUsers,
        totalInvestors,
        totalStartups,
        growth: {
          thisMonth: thisMonthUsers,
          lastMonth: lastMonthUsers,
          growthRate: lastMonthUsers > 0 ? 
            ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0
        }
      };
    } catch (error) {
      logger.error('Error fetching platform stats:', error);
      throw error;
    }
  }

  // Update user stats (called when investments/campaigns change)
  static async updateUserStats(walletAddress: string, statsUpdate: {
    totalInvested?: number;
    activeInvestments?: number;
    completedInvestments?: number;
    averageReturn?: number;
    totalRaised?: number;
    activeCampaigns?: number;
    completedCampaigns?: number;
    totalInvestors?: number;
  }): Promise<IUser | null> {
    try {
      const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
      
      if (!user) {
        return null;
      }

      user.stats = { ...user.stats, ...statsUpdate };
      await user.save();
      
      return user;
    } catch (error) {
      logger.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Get users by role with pagination
  static async getUsersByRole(role: 'investor' | 'startup', page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const users = await User.find({ 
        role,
        'preferences.privacy.profileVisibility': { $in: ['public'] }
      })
        .select('walletAddress profile stats createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const totalUsers = await User.countDocuments({ 
        role,
        'preferences.privacy.profileVisibility': { $in: ['public'] }
      });
      
      return {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalItems: totalUsers,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error('Error fetching users by role:', error);
      throw error;
    }
  }

  // Update last active timestamp
  static async updateLastActive(walletAddress: string): Promise<void> {
    try {
      await User.findOneAndUpdate(
        { walletAddress: walletAddress.toLowerCase() },
        { lastActive: new Date() }
      );
    } catch (error) {
      logger.error('Error updating last active:', error);
      // Don't throw error for this non-critical operation
    }
  }

  // Delete user (GDPR compliance)
  static async deleteUser(walletAddress: string): Promise<boolean> {
    try {
      const result = await User.deleteOne({ walletAddress: walletAddress.toLowerCase() });
      
      if (result.deletedCount > 0) {
        logger.info(`User deleted: ${walletAddress}`);
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}