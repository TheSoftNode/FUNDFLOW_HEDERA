import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/authMiddleware';
import { FundFlowController } from '../controllers/FundFlowController';

const router = Router();
const fundFlowController = new FundFlowController();

// ==================== CAMPAIGN ROUTES ====================

/**
 * @swagger
 * /api/fundflow/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/campaigns',
  authenticateToken,
  [
    body('title').isString().notEmpty().isLength({ min: 3, max: 100 }),
    body('description').isString().notEmpty().isLength({ min: 10, max: 2000 }),
    body('targetAmount').isString().notEmpty(),
    body('deadline').isNumeric().isInt({ min: Date.now() / 1000 }),
    body('category').isString().notEmpty(),
    body('imageUrl').optional().isURL(),
    body('videoUrl').optional().isURL(),
    body('documents').optional().isArray(),
    body('socialLinks').optional().isArray(),
    body('tags').optional().isArray()
  ],
  validateRequest,
  fundFlowController.createCampaign
);

/**
 * @swagger
 * /api/fundflow/campaigns/{campaignId}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaigns]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Campaign retrieved successfully
 *       404:
 *         description: Campaign not found
 */
router.get('/campaigns/:campaignId',
  param('campaignId').isNumeric(),
  validateRequest,
  fundFlowController.getCampaign
);

/**
 * @swagger
 * /api/fundflow/campaigns:
 *   get:
 *     summary: Get campaigns with filters
 *     tags: [Campaigns]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Campaign status filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *       - in: query
 *         name: creator
 *         schema:
 *           type: string
 *         description: Creator wallet address filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Campaigns retrieved successfully
 */
router.get('/campaigns',
  [
    query('status').optional().isString(),
    query('category').optional().isString(),
    query('creator').optional().isString(),
    query('page').optional().isNumeric(),
    query('limit').optional().isNumeric()
  ],
  validateRequest,
  fundFlowController.getCampaigns
);

/**
 * @swagger
 * /api/fundflow/campaigns/{campaignId}:
 *   put:
 *     summary: Update campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               documents:
 *                 type: array
 *               socialLinks:
 *                 type: array
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the campaign creator
 *       404:
 *         description: Campaign not found
 */
router.put('/campaigns/:campaignId',
  authenticateToken,
  param('campaignId').isNumeric(),
  [
    body('title').optional().isString().isLength({ min: 3, max: 100 }),
    body('description').optional().isString().isLength({ min: 10, max: 2000 }),
    body('imageUrl').optional().isURL(),
    body('videoUrl').optional().isURL(),
    body('documents').optional().isArray(),
    body('socialLinks').optional().isArray(),
    body('tags').optional().isArray()
  ],
  validateRequest,
  fundFlowController.updateCampaign
);

// ==================== INVESTMENT ROUTES ====================

/**
 * @swagger
 * /api/fundflow/investments:
 *   post:
 *     summary: Make an investment
 *     tags: [Investments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: number
 *               amount:
 *                 type: string
 *             required:
 *               - campaignId
 *               - amount
 *     responses:
 *       201:
 *         description: Investment made successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 */
router.post('/investments',
  authenticateToken,
  [
    body('campaignId').isNumeric(),
    body('amount').isString().notEmpty()
  ],
  validateRequest,
  fundFlowController.makeInvestment
);

/**
 * @swagger
 * /api/fundflow/investments/campaign/{campaignId}:
 *   get:
 *     summary: Get investments for a campaign
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Investments retrieved successfully
 */
router.get('/investments/campaign/:campaignId',
  param('campaignId').isNumeric(),
  validateRequest,
  fundFlowController.getCampaignInvestments
);

/**
 * @swagger
 * /api/fundflow/investments/investor/{investorAddress}:
 *   get:
 *     summary: Get investments by investor
 *     tags: [Investments]
 *     parameters:
 *       - in: path
 *         name: investorAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Investments retrieved successfully
 */
router.get('/investments/investor/:investorAddress',
  param('investorAddress').isString().notEmpty(),
  validateRequest,
  fundFlowController.getInvestorInvestments
);

// ==================== MILESTONE ROUTES ====================

/**
 * @swagger
 * /api/fundflow/milestones:
 *   post:
 *     summary: Add milestone to campaign
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Milestone'
 *     responses:
 *       201:
 *         description: Milestone added successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/milestones',
  authenticateToken,
  [
    body('campaignId').isNumeric(),
    body('title').isString().notEmpty().isLength({ min: 3, max: 100 }),
    body('description').isString().notEmpty().isLength({ min: 10, max: 1000 }),
    body('targetAmount').isString().notEmpty(),
    body('deadline').isNumeric().isInt({ min: Date.now() / 1000 }),
    body('votingDeadline').isNumeric().isInt({ min: Date.now() / 1000 })
  ],
  validateRequest,
  fundFlowController.addMilestone
);

/**
 * @swagger
 * /api/fundflow/milestones/{milestoneId}/vote:
 *   post:
 *     summary: Vote on milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: boolean
 *               votingPower:
 *                 type: number
 *             required:
 *               - vote
 *               - votingPower
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/milestones/:milestoneId/vote',
  authenticateToken,
  param('milestoneId').isNumeric(),
  [
    body('vote').isBoolean(),
    body('votingPower').isNumeric().isInt({ min: 1 })
  ],
  validateRequest,
  fundFlowController.voteOnMilestone
);

/**
 * @swagger
 * /api/fundflow/milestones/{milestoneId}/execute:
 *   post:
 *     summary: Execute milestone
 *     tags: [Milestones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: milestoneId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Milestone executed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - milestone not ready for execution
 */
router.post('/milestones/:milestoneId/execute',
  authenticateToken,
  param('milestoneId').isNumeric(),
  validateRequest,
  fundFlowController.executeMilestone
);

/**
 * @swagger
 * /api/fundflow/milestones/campaign/{campaignId}:
 *   get:
 *     summary: Get milestones for a campaign
 *     tags: [Milestones]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Milestones retrieved successfully
 */
router.get('/milestones/campaign/:campaignId',
  param('campaignId').isNumeric(),
  validateRequest,
  fundFlowController.getCampaignMilestones
);

// ==================== ANALYTICS ROUTES ====================

/**
 * @swagger
 * /api/fundflow/analytics/platform:
 *   get:
 *     summary: Get platform analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Platform analytics retrieved successfully
 */
router.get('/analytics/platform', fundFlowController.getPlatformAnalytics);

/**
 * @swagger
 * /api/fundflow/analytics/campaign/{campaignId}:
 *   get:
 *     summary: Get campaign analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Campaign analytics retrieved successfully
 */
router.get('/analytics/campaign/:campaignId',
  param('campaignId').isNumeric(),
  validateRequest,
  fundFlowController.getCampaignAnalytics
);

/**
 * @swagger
 * /api/fundflow/analytics/investor/{investorAddress}:
 *   get:
 *     summary: Get investor analytics
 *     tags: [Analytics]
 *     parameters:
 *       - in: path
 *         name: investorAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Investor analytics retrieved successfully
 */
router.get('/analytics/investor/:investorAddress',
  param('investorAddress').isString().notEmpty(),
  validateRequest,
  fundFlowController.getInvestorAnalytics
);

// ==================== GOVERNANCE ROUTES ====================

/**
 * @swagger
 * /api/fundflow/governance/proposals:
 *   post:
 *     summary: Create governance proposal
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: number
 *               proposalType:
 *                 type: number
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               executionData:
 *                 type: string
 *             required:
 *               - campaignId
 *               - proposalType
 *               - title
 *               - description
 *               - executionData
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/governance/proposals',
  authenticateToken,
  [
    body('campaignId').isNumeric(),
    body('proposalType').isNumeric().isInt({ min: 0 }),
    body('title').isString().notEmpty().isLength({ min: 3, max: 100 }),
    body('description').isString().notEmpty().isLength({ min: 10, max: 1000 }),
    body('executionData').isString().notEmpty()
  ],
  validateRequest,
  fundFlowController.createProposal
);

/**
 * @swagger
 * /api/fundflow/governance/proposals/{proposalId}/vote:
 *   post:
 *     summary: Vote on governance proposal
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: boolean
 *               votingPower:
 *                 type: number
 *             required:
 *               - vote
 *               - votingPower
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/governance/proposals/:proposalId/vote',
  authenticateToken,
  param('proposalId').isNumeric(),
  [
    body('vote').isBoolean(),
    body('votingPower').isNumeric().isInt({ min: 1 })
  ],
  validateRequest,
  fundFlowController.voteOnProposal
);

/**
 * @swagger
 * /api/fundflow/governance/proposals/{proposalId}/execute:
 *   post:
 *     summary: Execute governance proposal
 *     tags: [Governance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Proposal executed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - proposal not ready for execution
 */
router.post('/governance/proposals/:proposalId/execute',
  authenticateToken,
  param('proposalId').isNumeric(),
  validateRequest,
  fundFlowController.executeProposal
);

export default router;

