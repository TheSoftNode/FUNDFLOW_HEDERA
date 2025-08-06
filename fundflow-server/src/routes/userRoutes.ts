import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireOwnership, optionalAuth } from '../middleware/authMiddleware';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// GET /api/users/profile/:walletAddress - Get user profile
router.get('/profile/:walletAddress',
  param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
  handleValidationErrors,
  optionalAuth,
  UserController.getUserProfile
);

// POST /api/users/profile - Create or update user profile
router.post('/profile',
  [
    body('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    body('role').isIn(['investor', 'startup']),
    body('profile.name').isString().isLength({ min: 1, max: 100 }).trim(),
    body('profile.email').optional().isEmail().normalizeEmail(),
    body('profile.company').optional().isString().isLength({ max: 100 }).trim(),
    body('profile.jobTitle').optional().isString().isLength({ max: 100 }).trim(),
    body('profile.experience').optional().isIn(['first-time', 'experienced', 'veteran']),
    body('profile.bio').optional().isString().isLength({ max: 500 }),
    body('profile.website').optional().isURL(),
    body('profile.linkedin').optional().isString().trim(),
    body('profile.twitter').optional().isString().trim(),
    body('preferences.interests').optional().isArray(),
    body('preferences.goals').optional().isArray()
  ],
  handleValidationErrors,
  UserController.createOrUpdateProfile
);

// PUT /api/users/profile/:walletAddress - Update user profile
router.put('/profile/:walletAddress',
  [
    param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    body('profile').optional().isObject(),
    body('preferences').optional().isObject(),
    body('settings').optional().isObject()
  ],
  handleValidationErrors,
  authenticateToken,
  requireOwnership('walletAddress'),
  UserController.updateProfile
);

// GET /api/users/search - Search users
router.get('/search',
  [
    query('q').optional().isString().trim(),
    query('role').optional().isIn(['investor', 'startup']),
    query('industry').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  UserController.searchUsers
);

// GET /api/users/stats - Get platform statistics
router.get('/stats', UserController.getPlatformStats);

// GET /api/users/investors - Get all investors
router.get('/investors',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  UserController.getInvestors
);

// GET /api/users/startups - Get all startups
router.get('/startups',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
  ],
  handleValidationErrors,
  UserController.getStartups
);

// PUT /api/users/:walletAddress/last-active - Update last active
router.put('/:walletAddress/last-active',
  param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
  handleValidationErrors,
  authenticateToken,
  requireOwnership('walletAddress'),
  UserController.updateLastActive
);

// DELETE /api/users/:walletAddress - Delete user (GDPR)
router.delete('/:walletAddress',
  param('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
  handleValidationErrors,
  authenticateToken,
  requireOwnership('walletAddress'),
  UserController.deleteUser
);

export default router;