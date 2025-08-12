import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Investment from '../models/Investment';
import { authenticateToken, requireRole, requireOwnership } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  return next();
};

// GET /api/investments/portfolio/:walletAddress - Get investor's portfolio
router.get('/portfolio/:walletAddress',
  [
    param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  authenticateToken,
  requireOwnership('walletAddress'),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { walletAddress } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const investments = await Investment.find({
        investorAddress: walletAddress?.toLowerCase() || ''
      })
        .populate('campaignId', 'title description status targetAmount raisedAmount deadline')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit));

      const totalInvestments = await Investment.countDocuments({
        investorAddress: walletAddress?.toLowerCase() || ''
      });

      res.json({
        success: true,
        data: investments,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalInvestments / Number(limit)),
          totalItems: totalInvestments,
          itemsPerPage: Number(limit)
        }
      });
    } catch (error) {
      logger.error('Error fetching portfolio:', error);
      next(error);
    }
  }
);

// GET /api/investments/stats/:walletAddress - Get investor's portfolio stats
router.get('/stats/:walletAddress',
  param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
  handleValidationErrors,
  authenticateToken,
  requireOwnership('walletAddress'),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: 'Wallet address is required'
        });
        return;
      }
      const stats = await Investment.getPortfolioStats(walletAddress);

      res.json({
        success: true,
        data: stats.length > 0 ? stats[0] : {
          totalInvested: 0,
          totalReturns: 0,
          investmentCount: 0,
          activeInvestments: 0,
          roiPercentage: 0
        }
      });
    } catch (error) {
      logger.error('Error fetching investment stats:', error);
      next(error);
    }
  }
);

// GET /api/investments/:id - Get investment details
router.get('/:id',
  param('id').isMongoId(),
  handleValidationErrors,
  authenticateToken,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params;

      const investment = await Investment.findById(id)
        .populate('campaignId', 'title description status targetAmount raisedAmount deadline creatorAddress');

      if (!investment) {
        res.status(404).json({
          success: false,
          error: 'Investment not found'
        });
        return;
      }

      // Check if user owns this investment or is the campaign creator
      if (req.user?.walletAddress.toLowerCase() !== investment.investorAddress.toLowerCase() &&
        req.user?.walletAddress.toLowerCase() !== investment.creatorAddress.toLowerCase()) {
        res.status(403).json({
          success: false,
          error: 'Access denied'
        });
        return;
      }

      res.json({
        success: true,
        data: investment
      });
    } catch (error) {
      logger.error('Error fetching investment:', error);
      next(error);
    }
  }
);

// PUT /api/investments/:id/status - Update investment status (admin only)
router.put('/:id/status',
  [
    param('id').isMongoId(),
    body('status').isIn(['pending', 'confirmed', 'failed', 'refunded'])
  ],
  handleValidationErrors,
  authenticateToken,
  // TODO: Add admin role check when implemented
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const investment = await Investment.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!investment) {
        res.status(404).json({
          success: false,
          error: 'Investment not found'
        });
        return;
      }

      res.json({
        success: true,
        data: investment,
        message: 'Investment status updated successfully'
      });
    } catch (error) {
      logger.error('Error updating investment status:', error);
      next(error);
    }
  }
);

export default router;