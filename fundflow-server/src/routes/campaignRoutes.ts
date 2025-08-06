import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { CampaignController } from '../controllers/CampaignController';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/authMiddleware';

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
  next();
};

// GET /api/campaigns - Get all campaigns
router.get('/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('status').optional().isIn(['active', 'completed', 'cancelled', 'funded']),
    query('industry').optional().isString().trim(),
    query('category').optional().isString().trim(),
    query('stage').optional().isString().trim(),
    query('featured').optional().isBoolean(),
    query('verified').optional().isBoolean(),
    query('sortBy').optional().isString().trim()
  ],
  handleValidationErrors,
  optionalAuth,
  CampaignController.getCampaigns
);

// GET /api/campaigns/:id - Get campaign details
router.get('/:id',
  param('id').isMongoId(),
  handleValidationErrors,
  optionalAuth,
  CampaignController.getCampaignById
);

// POST /api/campaigns - Create new campaign
router.post('/',
  [
    body('chainId').isInt(),
    body('creatorAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    body('contractAddress').isString().trim(),
    body('title').isString().isLength({ min: 1, max: 200 }).trim(),
    body('description').isString().isLength({ min: 1, max: 500 }).trim(),
    body('longDescription').optional().isString().isLength({ max: 5000 }),
    body('targetAmount').isInt({ min: 1 }),
    body('deadline').isISO8601().toDate(),
    body('category').isString().trim(),
    body('industry').isString().trim(),
    body('stage').isString().trim(),
    body('team').optional().isArray(),
    body('media').optional().isObject(),
    body('metrics').optional().isObject(),
    body('fundingDetails').isObject()
  ],
  handleValidationErrors,
  authenticateToken,
  requireRole('startup'),
  CampaignController.createCampaign
);

// PUT /api/campaigns/:id - Update campaign
router.put('/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1, max: 200 }).trim(),
    body('description').optional().isString().isLength({ min: 1, max: 500 }).trim(),
    body('longDescription').optional().isString().isLength({ max: 5000 }),
    body('deadline').optional().isISO8601().toDate(),
    body('team').optional().isArray(),
    body('media').optional().isObject(),
    body('metrics').optional().isObject()
  ],
  handleValidationErrors,
  authenticateToken,
  requireRole('startup'),
  CampaignController.updateCampaign
);

// POST /api/campaigns/:id/invest - Add investment to campaign
router.post('/:id/invest',
  [
    param('id').isMongoId(),
    body('investorAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    body('amount').isInt({ min: 1 }),
    body('netAmount').isInt({ min: 1 }),
    body('platformFee').isInt({ min: 0 }),
    body('transactionId').isString().trim(),
    body('blockHeight').isInt({ min: 1 })
  ],
  handleValidationErrors,
  authenticateToken,
  requireRole('investor'),
  CampaignController.addInvestment
);

// POST /api/campaigns/:id/milestones - Add milestone to campaign 
router.post('/:id/milestones',
  [
    param('id').isMongoId(),
    body('title').isString().isLength({ min: 1, max: 200 }).trim(),
    body('description').isString().isLength({ min: 1, max: 1000 }).trim(),
    body('targetAmount').isInt({ min: 1 }),
    body('deliverables').isArray(),
    body('expectedCompletionDate').isISO8601().toDate(),
    body('votingDurationDays').isInt({ min: 1, max: 30 })
  ],
  handleValidationErrors,
  authenticateToken,
  requireRole('startup'),
  CampaignController.addMilestone
);

// GET /api/campaigns/creator/:walletAddress - Get campaigns by creator
router.get('/creator/:walletAddress',
  [
    param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  optionalAuth,
  CampaignController.getCampaignsByCreator
);

// GET /api/campaigns/investor/:walletAddress - Get campaigns by investor
router.get('/investor/:walletAddress',
  [
    param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  optionalAuth,
  CampaignController.getCampaignsByInvestor
);

// GET /api/campaigns/search - Search campaigns
router.get('/search',
  [
    query('q').isString().isLength({ min: 1 }).trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  CampaignController.searchCampaigns
);

// GET /api/campaigns/featured - Get featured campaigns
router.get('/featured',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  CampaignController.getFeaturedCampaigns
);

// GET /api/campaigns/trending - Get trending campaigns
router.get('/trending',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  CampaignController.getTrendingCampaigns
);

// GET /api/campaigns/stats - Get campaign statistics
router.get('/stats', CampaignController.getCampaignStats);

// PUT /api/campaigns/:id/like - Like/unlike campaign
router.put('/:id/like',
  [
    param('id').isMongoId(),
    body('liked').isBoolean()
  ],
  handleValidationErrors,
  authenticateToken,
  CampaignController.toggleLike
);

// PUT /api/campaigns/:id/share - Increment share count
router.put('/:id/share',
  param('id').isMongoId(),
  handleValidationErrors,
  CampaignController.incrementShare
);

export default router;