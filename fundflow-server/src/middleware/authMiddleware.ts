import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        walletAddress: string;
        role?: 'investor' | 'startup';
      };
    }
  }
}

// Middleware to verify JWT token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    
    const decoded = jwt.verify(token, secret) as { userId: string; walletAddress: string };
    
    // Verify user still exists
    const user = await UserService.getUserByWallet(decoded.walletAddress);
    
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      walletAddress: decoded.walletAddress,
      role: user.role
    };

    // Update last active (non-blocking)
    UserService.updateLastActive(decoded.walletAddress).catch(error => {
      logger.error('Error updating last active:', error);
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }
    
    logger.error('Error in authenticateToken middleware:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

// Middleware to check if user has specific role
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Middleware to check if user owns the resource (by wallet address)
export const requireOwnership = (paramName = 'walletAddress') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const resourceWallet = req.params[paramName];
    
    if (!resourceWallet) {
      res.status(400).json({
        success: false,
        error: `${paramName} parameter is required`
      });
      return;
    }

    if (req.user.walletAddress.toLowerCase() !== resourceWallet.toLowerCase()) {
      res.status(403).json({
        success: false,
        error: 'Access denied: You can only access your own resources'
      });
      return;
    }

    next();
  };
};

// Optional authentication middleware (doesn't require token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      next();
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    
    try {
      const decoded = jwt.verify(token, secret) as { userId: string; walletAddress: string };
      
      // Verify user still exists
      const user = await UserService.getUserByWallet(decoded.walletAddress);
      
      if (user) {
        // Add user info to request
        req.user = {
          userId: decoded.userId,
          walletAddress: decoded.walletAddress,
          role: user.role
        };

        // Update last active (non-blocking)
        UserService.updateLastActive(decoded.walletAddress).catch(error => {
          logger.error('Error updating last active:', error);
        });
      }
    } catch (tokenError) {
      // Invalid token, but that's okay for optional auth
      logger.debug('Invalid token in optional auth:', tokenError);
    }

    next();
  } catch (error) {
    logger.error('Error in optionalAuth middleware:', error);
    next(); // Continue without authentication
  }
};

// Rate limiting for sensitive endpoints
export const rateLimitAuth = (req: Request, res: Response, next: NextFunction): void => {
  // This would typically integrate with Redis or memory store
  // For now, we'll just pass through
  // TODO: Implement proper rate limiting
  next();
};