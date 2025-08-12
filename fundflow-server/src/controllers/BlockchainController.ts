import { Request, Response } from 'express';
import { hederaService } from '../services/HederaService';
import { fundFlowContractService } from '../services/FundFlowContractService';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export class BlockchainController {
    /**
     * Get blockchain status
     */
    async getBlockchainStatus(req: Request, res: Response) {
        try {
            const network = process.env.HEDERA_NETWORK || 'testnet';
            const operatorId = hederaService.getOperatorId();
            const contracts = fundFlowContractService.getContractAddresses();

            const status = {
                network,
                operatorId,
                contracts,
                timestamp: new Date().toISOString(),
                status: 'operational'
            };

            return ApiResponse.success(res, 'Blockchain status retrieved successfully', status);
        } catch (error) {
            logger.error('Failed to get blockchain status:', error);
            return ApiResponse.error(res, 'Failed to get blockchain status', 500);
        }
    }

    /**
     * Get deployed contract information
     */
    async getContractInfo(req: Request, res: Response) {
        try {
            const contracts = [
                {
                    name: 'FundFlowCore',
                    address: process.env.FUNDFLOWCORE_ADDRESS,
                    id: process.env.FUNDFLOWCORE_ID,
                    explorer: process.env.FUNDFLOWCORE_EXPLORER
                },
                {
                    name: 'CampaignManager',
                    address: process.env.CAMPAIGNMANAGER_ADDRESS,
                    id: process.env.CAMPAIGNMANAGER_ID,
                    explorer: process.env.CAMPAIGNMANAGER_EXPLORER
                },
                {
                    name: 'InvestmentManager',
                    address: process.env.INVESTMENTMANAGER_ADDRESS,
                    id: process.env.INVESTMENTMANAGER_ID,
                    explorer: process.env.INVESTMENTMANAGER_EXPLORER
                },
                {
                    name: 'MilestoneManager',
                    address: process.env.MILESTONEMANAGER_ADDRESS,
                    id: process.env.MILESTONEMANAGER_ID,
                    explorer: process.env.MILESTONEMANAGER_EXPLORER
                },
                {
                    name: 'AnalyticsManager',
                    address: process.env.ANALYTICSMANAGER_ADDRESS,
                    id: process.env.ANALYTICSMANAGER_ID,
                    explorer: process.env.ANALYTICSMANAGER_EXPLORER
                },
                {
                    name: 'GovernanceManager',
                    address: process.env.GOVERNANCEMANAGER_ADDRESS,
                    id: process.env.GOVERNANCEMANAGER_ID,
                    explorer: process.env.GOVERNANCEMANAGER_EXPLORER
                }
            ];

            return ApiResponse.success(res, 'Contract information retrieved successfully', contracts);
        } catch (error) {
            logger.error('Failed to get contract information:', error);
            return ApiResponse.error(res, 'Failed to get contract information', 500);
        }
    }

    /**
     * Get account balance
     */
    async getAccountBalance(req: Request, res: Response) {
        try {
            const { accountId } = req.params;

            if (!accountId) {
                return ApiResponse.error(res, 'Account ID is required', 400);
            }

            const balance = await hederaService.getAccountBalance(accountId);
            const balanceInHbar = balance.toTinybars().toNumber() / 100000000; // Convert tinybars to HBAR

            const balanceData = {
                accountId,
                balance: balance.toTinybars().toString(),
                balanceInHbar: parseFloat(balanceInHbar.toFixed(8))
            };

            return ApiResponse.success(res, 'Account balance retrieved successfully', balanceData);
        } catch (error) {
            logger.error(`Failed to get account balance for ${req.params.accountId}:`, error);
            return ApiResponse.error(res, 'Failed to get account balance', 500);
        }
    }

    /**
     * Get transaction details
     */
    async getTransactionDetails(req: Request, res: Response) {
        try {
            const { transactionId } = req.params;

            if (!transactionId) {
                return ApiResponse.error(res, 'Transaction ID is required', 400);
            }

            const receipt = await hederaService.getTransactionReceipt(transactionId);

            const transactionData = {
                transactionId,
                status: receipt.status.toString(),
                receipt: receipt,
                timestamp: new Date().toISOString()
            };

            return ApiResponse.success(res, 'Transaction details retrieved successfully', transactionData);
        } catch (error) {
            logger.error(`Failed to get transaction details for ${req.params.transactionId}:`, error);
            return ApiResponse.error(res, 'Failed to get transaction details', 500);
        }
    }

    /**
     * Execute contract function
     */
    async executeContractFunction(req: Request, res: Response) {
        try {
            const { contractId, functionName } = req.params;
            const { parameters = [], gas } = req.body;

            if (!contractId || !functionName) {
                return ApiResponse.error(res, 'Contract ID and function name are required', 400);
            }

            logger.info(`Executing contract function: ${functionName} on contract: ${contractId}`, {
                parameters,
                gas,
                userId: (req as any).user?.id
            });

            const result = await hederaService.executeContractFunction(
                contractId,
                functionName,
                parameters,
                gas
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Contract execution failed', 500);
            }

            return ApiResponse.success(res, 'Contract function executed successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to execute contract function:', error);
            return ApiResponse.error(res, 'Failed to execute contract function', 500);
        }
    }

    /**
     * Query contract function
     */
    async queryContractFunction(req: Request, res: Response) {
        try {
            const { contractId, functionName } = req.params;
            const { parameters = [] } = req.body;

            if (!contractId || !functionName) {
                return ApiResponse.error(res, 'Contract ID and function name are required', 400);
            }

            logger.info(`Querying contract function: ${functionName} on contract: ${contractId}`, {
                parameters
            });

            const result = await hederaService.queryContractFunction(
                contractId,
                functionName,
                parameters
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Contract query failed', 500);
            }

            return ApiResponse.success(res, 'Contract function queried successfully', result.data);
        } catch (error) {
            logger.error('Failed to query contract function:', error);
            return ApiResponse.error(res, 'Failed to query contract function', 500);
        }
    }

    /**
     * Get network information
     */
    async getNetworkInfo(req: Request, res: Response) {
        try {
            const network = process.env.HEDERA_NETWORK || 'testnet';
            const networkId = network === 'testnet' ? 296 : network === 'mainnet' ? 295 : 297;

            const networkInfo = {
                network,
                networkId,
                mirrorNode: `https://${network}.mirrornode.hedera.com`,
                explorer: `https://hashscan.io/${network}`,
                consensusNodes: [
                    '0.0.3',
                    '0.0.4',
                    '0.0.5',
                    '0.0.6',
                    '0.0.7',
                    '0.0.8',
                    '0.0.9',
                    '0.0.10',
                    '0.0.11',
                    '0.0.12',
                    '0.0.13',
                    '0.0.14',
                    '0.0.15',
                    '0.0.16',
                    '0.0.17',
                    '0.0.18',
                    '0.0.19',
                    '0.0.20',
                    '0.0.21',
                    '0.0.22',
                    '0.0.23',
                    '0.0.24',
                    '0.0.25',
                    '0.0.26',
                    '0.0.27',
                    '0.0.28',
                    '0.0.29',
                    '0.0.30',
                    '0.0.31',
                    '0.0.32',
                    '0.0.33',
                    '0.0.34',
                    '0.0.35'
                ],
                lastBlock: Date.now()
            };

            return ApiResponse.success(res, 'Network information retrieved successfully', networkInfo);
        } catch (error) {
            logger.error('Failed to get network information:', error);
            return ApiResponse.error(res, 'Failed to get network information', 500);
        }
    }

    /**
     * Get blockchain health
     */
    async getBlockchainHealth(req: Request, res: Response) {
        try {
            // Check if services are properly initialized
            const hederaInitialized = hederaService.getOperatorId() !== '';
            const contractsInitialized = fundFlowContractService.isInitialized();

            if (!hederaInitialized || !contractsInitialized) {
                return ApiResponse.error(res, 'Blockchain service is unhealthy', 503, {
                    hederaInitialized,
                    contractsInitialized,
                    timestamp: new Date().toISOString()
                });
            }

            // Try to get a simple query to verify connectivity
            try {
                await hederaService.getAccountBalance(hederaService.getOperatorId());
            } catch (error) {
                logger.error('Blockchain connectivity check failed:', error);
                return ApiResponse.error(res, 'Blockchain connectivity check failed', 503, {
                    hederaInitialized,
                    contractsInitialized,
                    connectivity: false,
                    timestamp: new Date().toISOString()
                });
            }

            const healthData = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                network: process.env.HEDERA_NETWORK || 'testnet',
                contracts: fundFlowContractService.getContractAddresses(),
                hederaInitialized,
                contractsInitialized,
                connectivity: true
            };

            return ApiResponse.success(res, 'Blockchain service is healthy', healthData);
        } catch (error) {
            logger.error('Failed to check blockchain health:', error);
            return ApiResponse.error(res, 'Failed to check blockchain health', 500);
        }
    }
}
