import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
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

export default router;
