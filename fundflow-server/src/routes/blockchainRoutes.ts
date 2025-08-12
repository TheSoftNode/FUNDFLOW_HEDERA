import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/authMiddleware';
import { BlockchainController } from '../controllers/BlockchainController';

const router = Router();
const blockchainController = new BlockchainController();

/**
 * @swagger
 * /api/blockchain/status:
 *   get:
 *     summary: Get blockchain status
 *     tags: [Blockchain]
 *     description: Get current Hedera network status and contract information
 *     responses:
 *       200:
 *         description: Blockchain status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     network:
 *                       type: string
 *                     operatorId:
 *                       type: string
 *                     contracts:
 *                       type: object
 *                     lastBlock:
 *                       type: number
 */
router.get('/status', blockchainController.getBlockchainStatus);

/**
 * @swagger
 * /api/blockchain/contracts:
 *   get:
 *     summary: Get deployed contract information
 *     tags: [Blockchain]
 *     description: Get information about all deployed FundFlow smart contracts
 *     responses:
 *       200:
 *         description: Contract information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       id:
 *                         type: string
 *                       explorer:
 *                         type: string
 */
router.get('/contracts', blockchainController.getContractInfo);

/**
 * @swagger
 * /api/blockchain/balance/{accountId}:
 *   get:
 *     summary: Get account balance
 *     tags: [Blockchain]
 *     description: Get HBAR balance for a specific Hedera account
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hedera account ID
 *     responses:
 *       200:
 *         description: Account balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: string
 *                     balance:
 *                       type: string
 *                     balanceInHbar:
 *                       type: number
 */
router.get('/balance/:accountId',
  param('accountId').isString().notEmpty(),
  validateRequest,
  blockchainController.getAccountBalance
);

/**
 * @swagger
 * /api/blockchain/transaction/{transactionId}:
 *   get:
 *     summary: Get transaction details
 *     tags: [Blockchain]
 *     description: Get detailed information about a specific Hedera transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hedera transaction ID
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: string
 *                     status:
 *                       type: string
 *                     receipt:
 *                       type: object
 *                     timestamp:
 *                       type: string
 */
router.get('/transaction/:transactionId',
  param('transactionId').isString().notEmpty(),
  validateRequest,
  blockchainController.getTransactionDetails
);

/**
 * @swagger
 * /api/blockchain/contract/{contractId}/function/{functionName}:
 *   post:
 *     summary: Execute contract function
 *     tags: [Blockchain]
 *     description: Execute a function on a specific smart contract
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: path
 *         name: functionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Function name to execute
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameters:
 *                 type: array
 *                 description: Function parameters
 *                 items:
 *                   type: any
 *               gas:
 *                 type: number
 *                 description: Gas limit for transaction
 *     responses:
 *       200:
 *         description: Contract function executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: string
 *                     receipt:
 *                       type: object
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Contract execution failed
 */
router.post('/contract/:contractId/function/:functionName',
  authenticateToken,
  param('contractId').isString().notEmpty(),
  param('functionName').isString().notEmpty(),
  body('parameters').optional().isArray(),
  body('gas').optional().isNumeric(),
  validateRequest,
  blockchainController.executeContractFunction
);

/**
 * @swagger
 * /api/blockchain/contract/{contractId}/query/{functionName}:
 *   post:
 *     summary: Query contract function
 *     tags: [Blockchain]
 *     description: Query a function on a specific smart contract (read-only)
 *     parameters:
 *       - in: path
 *         name: contractId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract ID
 *       - in: path
 *         name: functionName
 *         required: true
 *         schema:
 *           type: string
 *         description: Function name to query
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parameters:
 *                 type: array
 *                 description: Function parameters
 *                 items:
 *                   type: any
 *     responses:
 *       200:
 *         description: Contract function queried successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: any
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Contract query failed
 */
router.post('/contract/:contractId/query/:functionName',
  param('contractId').isString().notEmpty(),
  param('functionName').isString().notEmpty(),
  body('parameters').optional().isArray(),
  validateRequest,
  blockchainController.queryContractFunction
);

/**
 * @swagger
 * /api/blockchain/network/info:
 *   get:
 *     summary: Get network information
 *     tags: [Blockchain]
 *     description: Get detailed information about the Hedera network
 *     responses:
 *       200:
 *         description: Network information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     network:
 *                       type: string
 *                     networkId:
 *                       type: number
 *                     mirrorNode:
 *                       type: string
 *                     explorer:
 *                       type: string
 *                     consensusNodes:
 *                       type: array
 *                     lastBlock:
 *                       type: number
 */
router.get('/network/info', blockchainController.getNetworkInfo);

/**
 * @swagger
 * /api/blockchain/health:
 *   get:
 *     summary: Blockchain health check
 *     tags: [Blockchain, Health]
 *     description: Check the health and connectivity of the blockchain service
 *     responses:
 *       200:
 *         description: Blockchain service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                     network:
 *                       type: string
 *                     contracts:
 *                       type: object
 *       503:
 *         description: Blockchain service is unhealthy
 */
router.get('/health', blockchainController.getBlockchainHealth);

// ==================== SMART CONTRACT INTEGRATION ROUTES ====================

/**
 * @swagger
 * /api/blockchain/campaigns/create:
 *   post:
 *     summary: Create campaign on blockchain
 *     tags: [Blockchain, Campaigns]
 *     description: Create a new fundraising campaign on the blockchain
 *     security:
 *       - bearerAuth: []
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
 *               targetAmount:
 *                 type: string
 *               durationDays:
 *                 type: number
 *               category:
 *                 type: number
 *               milestoneFundingPercentages:
 *                 type: array
 *               milestoneTitles:
 *                 type: array
 *               milestoneDescriptions:
 *                 type: array
 *     responses:
 *       200:
 *         description: Campaign created successfully on blockchain
 */
router.post('/campaigns/create',
  authenticateToken,
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('targetAmount').isString().notEmpty(),
  body('durationDays').isNumeric(),
  body('category').isNumeric(),
  validateRequest,
  blockchainController.createCampaignOnBlockchain
);

/**
 * @swagger
 * /api/blockchain/campaigns/{campaignId}:
 *   get:
 *     summary: Get campaign from blockchain
 *     tags: [Blockchain, Campaigns]
 *     description: Retrieve campaign data directly from the blockchain
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign data retrieved successfully
 */
router.get('/campaigns/:campaignId',
  authenticateToken,
  param('campaignId').isNumeric(),
  validateRequest,
  blockchainController.getCampaignFromBlockchain
);

/**
 * @swagger
 * /api/blockchain/milestones/submit-deliverable:
 *   post:
 *     summary: Submit milestone deliverable
 *     tags: [Blockchain, Milestones]
 *     description: Submit a deliverable for milestone completion
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
 *               milestoneIndex:
 *                 type: number
 *               deliverableHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Milestone deliverable submitted successfully
 */
router.post('/milestones/submit-deliverable',
  authenticateToken,
  body('campaignId').isNumeric(),
  body('milestoneIndex').isNumeric(),
  body('deliverableHash').isString().notEmpty(),
  validateRequest,
  blockchainController.submitMilestoneDeliverable
);

/**
 * @swagger
 * /api/blockchain/milestones/vote:
 *   post:
 *     summary: Vote on milestone
 *     tags: [Blockchain, Milestones]
 *     description: Cast a vote on milestone completion
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
 *               milestoneIndex:
 *                 type: number
 *               vote:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vote submitted successfully
 */
router.post('/milestones/vote',
  authenticateToken,
  body('campaignId').isNumeric(),
  body('milestoneIndex').isNumeric(),
  body('vote').isBoolean(),
  body('reason').optional().isString(),
  validateRequest,
  blockchainController.voteOnMilestone
);

/**
 * @swagger
 * /api/blockchain/milestones/complete:
 *   post:
 *     summary: Complete milestone
 *     tags: [Blockchain, Milestones]
 *     description: Complete a milestone after voting period
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
 *               milestoneIndex:
 *                 type: number
 *     responses:
 *       200:
 *         description: Milestone completed successfully
 */
router.post('/milestones/complete',
  authenticateToken,
  body('campaignId').isNumeric(),
  body('milestoneIndex').isNumeric(),
  validateRequest,
  blockchainController.completeMilestone
);

/**
 * @swagger
 * /api/blockchain/governance/proposals/create:
 *   post:
 *     summary: Create governance proposal
 *     tags: [Blockchain, Governance]
 *     description: Create a new governance proposal
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
 *     responses:
 *       200:
 *         description: Governance proposal created successfully
 */
router.post('/governance/proposals/create',
  authenticateToken,
  body('campaignId').isNumeric(),
  body('title').isString().notEmpty(),
  body('description').isString().notEmpty(),
  body('proposalType').optional().isNumeric(),
  body('executionData').optional().isString(),
  validateRequest,
  blockchainController.createGovernanceProposal
);

/**
 * @swagger
 * /api/blockchain/governance/proposals/vote:
 *   post:
 *     summary: Cast governance vote
 *     tags: [Blockchain, Governance]
 *     description: Cast a vote on a governance proposal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposalId:
 *                 type: number
 *               support:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Governance vote cast successfully
 */
router.post('/governance/proposals/vote',
  authenticateToken,
  body('proposalId').isNumeric(),
  body('support').isBoolean(),
  body('reason').optional().isString(),
  validateRequest,
  blockchainController.castGovernanceVote
);

// ==================== BLOCKCHAIN SYNCHRONIZATION ROUTES ====================

/**
 * @swagger
 * /api/blockchain/sync/start:
 *   post:
 *     summary: Start blockchain synchronization
 *     tags: [Blockchain, Sync]
 *     description: Start automatic blockchain synchronization
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               intervalMinutes:
 *                 type: number
 *                 default: 5
 *     responses:
 *       200:
 *         description: Blockchain synchronization started successfully
 */
router.post('/sync/start',
  authenticateToken,
  body('intervalMinutes').optional().isNumeric(),
  validateRequest,
  blockchainController.startBlockchainSync
);

/**
 * @swagger
 * /api/blockchain/sync/stop:
 *   post:
 *     summary: Stop blockchain synchronization
 *     tags: [Blockchain, Sync]
 *     description: Stop automatic blockchain synchronization
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blockchain synchronization stopped successfully
 */
router.post('/sync/stop',
  authenticateToken,
  blockchainController.stopBlockchainSync
);

/**
 * @swagger
 * /api/blockchain/sync/status:
 *   get:
 *     summary: Get blockchain sync status
 *     tags: [Blockchain, Sync]
 *     description: Get current blockchain synchronization status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sync status retrieved successfully
 */
router.get('/sync/status',
  authenticateToken,
  blockchainController.getBlockchainSyncStatus
);

/**
 * @swagger
 * /api/blockchain/sync/trigger:
 *   post:
 *     summary: Trigger manual blockchain sync
 *     tags: [Blockchain, Sync]
 *     description: Trigger a manual blockchain synchronization
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: object
 *     responses:
 *       200:
 *         description: Blockchain synchronization completed
 */
router.post('/sync/trigger',
  authenticateToken,
  body('options').optional().isObject(),
  validateRequest,
  blockchainController.triggerBlockchainSync
);

// ==================== UTILITY ROUTES ====================

/**
 * @swagger
 * /api/blockchain/voting-power/{campaignId}/{voter}:
 *   get:
 *     summary: Get voting power
 *     tags: [Blockchain, Voting]
 *     description: Get voting power for a specific address in a campaign
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: campaignId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: voter
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voting power retrieved successfully
 */
router.get('/voting-power/:campaignId/:voter',
  authenticateToken,
  param('campaignId').isNumeric(),
  param('voter').isString().notEmpty(),
  validateRequest,
  blockchainController.getVotingPower
);

/**
 * @swagger
 * /api/blockchain/calculate-fee:
 *   post:
 *     summary: Calculate platform fee
 *     tags: [Blockchain, Fees]
 *     description: Calculate platform fee for a given amount
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Platform fee calculated successfully
 */
router.post('/calculate-fee',
  authenticateToken,
  body('amount').isString().notEmpty(),
  validateRequest,
  blockchainController.calculatePlatformFee
);

/**
 * @swagger
 * /api/blockchain/contract-balance:
 *   get:
 *     summary: Get contract balance
 *     tags: [Blockchain, Contracts]
 *     description: Get the current balance of the FundFlow contract
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contract balance retrieved successfully
 */
router.get('/contract-balance',
  authenticateToken,
  blockchainController.getContractBalance
);

export default router;

