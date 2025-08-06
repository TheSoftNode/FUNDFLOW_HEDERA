import express from 'express';
import { body, validationResult } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/authMiddleware';

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

// POST /api/auth/wallet-connect - Authenticate with wallet signature
router.post('/wallet-connect',
  [
    body('walletAddress').isString().isLength({ min: 34, max: 50 }).trim(),
    body('signature').isString().trim(),
    body('message').isString().trim()
  ],
  handleValidationErrors,
  AuthController.walletConnect
);

// POST /api/auth/verify-token - Verify JWT token
router.post('/verify-token',
  [
    body('token').isString().trim()
  ],
  handleValidationErrors,
  AuthController.verifyToken
);

// POST /api/auth/refresh-token - Refresh JWT token
router.post('/refresh-token',
  [
    body('token').isString().trim()
  ],
  handleValidationErrors,
  AuthController.refreshToken
);

// POST /api/auth/logout - Logout user
router.post('/logout',
  [
    body('walletAddress').optional().isString().isLength({ min: 34, max: 50 }).trim()
  ],
  handleValidationErrors,
  AuthController.logout
);

// GET /api/auth/me - Get current user from token
router.get('/me', AuthController.getCurrentUser);

export default router;