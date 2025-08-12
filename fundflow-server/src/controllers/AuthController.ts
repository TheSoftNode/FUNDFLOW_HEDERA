import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';



export class AuthController {
  // Generate JWT token
  private static generateToken(userId: string, walletAddress: string): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    return jwt.sign(
      { userId, walletAddress },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );
  }

  // POST /api/auth/wallet-connect - Authenticate with wallet signature
  static async walletConnect(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress, signature, message } = req.body;

      // TODO: Verify Stacks wallet signature
      // This would involve verifying the signature against the message using Stacks libraries
      // For now, we'll do basic validation

      if (!signature || !message) {
        res.status(400).json({
          success: false,
          error: 'Invalid signature or message'
        });
        return;
      }

      // Find or create user
      let user = await UserService.getUserByWallet(walletAddress);

      if (!user) {
        // Create basic user record - they'll complete profile in onboarding
        user = await UserService.createOrUpdateUser({
          walletAddress,
          role: 'startup', // Default role, will be updated during onboarding
          profile: {
            name: 'New User' // Placeholder name
          },
          preferences: {
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

        logger.info(`New user created via wallet connect: ${walletAddress}`);
      } else {
        // Update last active
        await UserService.updateLastActive(walletAddress);
        logger.info(`User authenticated via wallet: ${walletAddress}`);
      }

      // Generate JWT token
      const token = AuthController.generateToken((user._id as any).toString(), user.walletAddress);

      res.json({
        success: true,
        data: {
          token,
          user: user.toJSON(),
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        },
        message: 'Authentication successful'
      });
    } catch (error) {
      logger.error('Error in walletConnect:', error);
      next(error);
    }
  }

  // POST /api/auth/verify-token - Verify JWT token
  static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

      const decoded = jwt.verify(token, secret) as { userId: string; walletAddress: string };

      const user = await UserService.getUserByWallet(decoded.walletAddress);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Update last active
      await UserService.updateLastActive(decoded.walletAddress);

      res.json({
        success: true,
        data: {
          user: user.toJSON(),
          valid: true
        },
        message: 'Token is valid'
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
        return;
      }

      logger.error('Error in verifyToken:', error);
      next(error);
    }
  }

  // POST /api/auth/refresh-token - Refresh JWT token
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

      // Verify the current token (even if expired)
      const decoded = jwt.verify(token, secret, { ignoreExpiration: true }) as {
        userId: string;
        walletAddress: string
      };

      const user = await UserService.getUserByWallet(decoded.walletAddress);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Generate new token
      const newToken = AuthController.generateToken((user._id as any).toString(), user.walletAddress);

      // Update last active
      await UserService.updateLastActive(decoded.walletAddress);

      res.json({
        success: true,
        data: {
          token: newToken,
          user: user.toJSON(),
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      logger.error('Error in refreshToken:', error);
      next(error);
    }
  }

  // POST /api/auth/logout - Logout user
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { walletAddress } = req.body;

      if (walletAddress) {
        await UserService.updateLastActive(walletAddress);
        logger.info(`User logged out: ${walletAddress}`);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Error in logout:', error);
      next(error);
    }
  }

  // GET /api/auth/me - Get current user from token
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          error: 'No token provided'
        });
        return;
      }

      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

      const decoded = jwt.verify(token, secret) as { userId: string; walletAddress: string };

      const user = await UserService.getUserByWallet(decoded.walletAddress);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      // Update last active
      await UserService.updateLastActive(decoded.walletAddress);

      res.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: 'Invalid token'
        });
        return;
      }

      logger.error('Error in getCurrentUser:', error);
      next(error);
    }
  }
}