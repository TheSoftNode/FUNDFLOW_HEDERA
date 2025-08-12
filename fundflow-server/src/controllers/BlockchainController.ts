import { Request, Response } from 'express';
import { hederaService } from '../services/HederaService';
import { fundFlowContractService } from '../services/FundFlowContractService';
import { smartContractIntegration } from '../services/SmartContractIntegrationService';
import { blockchainSyncService } from '../services/BlockchainSyncService';
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
            const smartContractIntegrationStatus = smartContractIntegration.getServiceStatus();

            if (!hederaInitialized || !contractsInitialized) {
                return ApiResponse.error(res, 'Blockchain service is unhealthy', 503, {
                    hederaInitialized,
                    contractsInitialized,
                    smartContractIntegrationStatus,
                    timestamp: new Date().toISOString()
                });
            }

            // Try to get a simple query to verify connectivity
            try {
                await hederaService.getAccountBalance(hederaService.getOperatorId());
                smartContractIntegrationStatus.blockchainHealth = true;
            } catch (error) {
                logger.error('Blockchain connectivity check failed:', error);
                smartContractIntegrationStatus.blockchainHealth = false;
                return ApiResponse.error(res, 'Blockchain connectivity check failed', 503, {
                    hederaInitialized,
                    contractsInitialized,
                    smartContractIntegrationStatus,
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
                smartContractIntegrationStatus,
                connectivity: true
            };

            return ApiResponse.success(res, 'Blockchain service is healthy', healthData);
        } catch (error) {
            logger.error('Failed to check blockchain health:', error);
            return ApiResponse.error(res, 'Failed to check blockchain health', 500);
        }
    }

    // ==================== SMART CONTRACT INTEGRATION ENDPOINTS ====================

    /**
     * Create campaign on blockchain
     */
    async createCampaignOnBlockchain(req: Request, res: Response) {
        try {
            const campaignData = req.body;
            
            if (!campaignData.title || !campaignData.description || !campaignData.targetAmount) {
                return ApiResponse.error(res, 'Missing required campaign data', 400);
            }

            logger.info('Creating campaign on blockchain:', { title: campaignData.title });

            const result = await smartContractIntegration.createCampaignOnChain(campaignData);

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to create campaign on blockchain', 500);
            }

            return ApiResponse.success(res, 'Campaign created on blockchain successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to create campaign on blockchain:', error);
            return ApiResponse.error(res, 'Failed to create campaign on blockchain', 500);
        }
    }

    /**
     * Get campaign from blockchain
     */
    async getCampaignFromBlockchain(req: Request, res: Response) {
        try {
            const { campaignId } = req.params;

            if (!campaignId) {
                return ApiResponse.error(res, 'Campaign ID is required', 400);
            }

            const result = await smartContractIntegration.getCampaignFromChain(parseInt(campaignId));

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to get campaign from blockchain', 500);
            }

            return ApiResponse.success(res, 'Campaign retrieved from blockchain successfully', result.data);
        } catch (error) {
            logger.error(`Failed to get campaign ${req.params.campaignId} from blockchain:`, error);
            return ApiResponse.error(res, 'Failed to get campaign from blockchain', 500);
        }
    }

    /**
     * Submit milestone deliverable
     */
    async submitMilestoneDeliverable(req: Request, res: Response) {
        try {
            const { campaignId, milestoneIndex, deliverableHash } = req.body;

            if (!campaignId || milestoneIndex === undefined || !deliverableHash) {
                return ApiResponse.error(res, 'Missing required milestone data', 400);
            }

            logger.info(`Submitting milestone deliverable: Campaign ${campaignId}, Milestone ${milestoneIndex}`);

            const result = await smartContractIntegration.submitMilestoneDeliverable(
                parseInt(campaignId),
                parseInt(milestoneIndex),
                deliverableHash
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to submit milestone deliverable', 500);
            }

            return ApiResponse.success(res, 'Milestone deliverable submitted successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to submit milestone deliverable:', error);
            return ApiResponse.error(res, 'Failed to submit milestone deliverable', 500);
        }
    }

    /**
     * Vote on milestone
     */
    async voteOnMilestone(req: Request, res: Response) {
        try {
            const { campaignId, milestoneIndex, vote, reason } = req.body;

            if (!campaignId || milestoneIndex === undefined || vote === undefined) {
                return ApiResponse.error(res, 'Missing required voting data', 400);
            }

            logger.info(`Voting on milestone: Campaign ${campaignId}, Milestone ${milestoneIndex}, Vote ${vote}`);

            const result = await smartContractIntegration.voteOnMilestone(
                parseInt(campaignId),
                parseInt(milestoneIndex),
                vote,
                reason || ''
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to vote on milestone', 500);
            }

            return ApiResponse.success(res, 'Vote submitted successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to vote on milestone:', error);
            return ApiResponse.error(res, 'Failed to vote on milestone', 500);
        }
    }

    /**
     * Complete milestone
     */
    async completeMilestone(req: Request, res: Response) {
        try {
            const { campaignId, milestoneIndex } = req.body;

            if (!campaignId || milestoneIndex === undefined) {
                return ApiResponse.error(res, 'Missing required milestone data', 400);
            }

            logger.info(`Completing milestone: Campaign ${campaignId}, Milestone ${milestoneIndex}`);

            const result = await smartContractIntegration.completeMilestone(
                parseInt(campaignId),
                parseInt(milestoneIndex)
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to complete milestone', 500);
            }

            return ApiResponse.success(res, 'Milestone completed successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to complete milestone:', error);
            return ApiResponse.error(res, 'Failed to complete milestone', 500);
        }
    }

    /**
     * Create governance proposal
     */
    async createGovernanceProposal(req: Request, res: Response) {
        try {
            const { campaignId, proposalType, title, description, executionData } = req.body;

            if (!campaignId || !title || !description) {
                return ApiResponse.error(res, 'Missing required proposal data', 400);
            }

            logger.info(`Creating governance proposal: Campaign ${campaignId}, Type ${proposalType}`);

            const result = await smartContractIntegration.createGovernanceProposal(
                parseInt(campaignId),
                proposalType || 0,
                title,
                description,
                executionData || ''
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to create governance proposal', 500);
            }

            return ApiResponse.success(res, 'Governance proposal created successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to create governance proposal:', error);
            return ApiResponse.error(res, 'Failed to create governance proposal', 500);
        }
    }

    /**
     * Cast governance vote
     */
    async castGovernanceVote(req: Request, res: Response) {
        try {
            const { proposalId, support, reason } = req.body;

            if (!proposalId || support === undefined) {
                return ApiResponse.error(res, 'Missing required voting data', 400);
            }

            logger.info(`Casting governance vote: Proposal ${proposalId}, Support ${support}`);

            const result = await smartContractIntegration.castGovernanceVote(
                parseInt(proposalId),
                support,
                reason || ''
            );

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to cast governance vote', 500);
            }

            return ApiResponse.success(res, 'Governance vote cast successfully', {
                transactionId: result.transactionId,
                receipt: result.receipt
            });
        } catch (error) {
            logger.error('Failed to cast governance vote:', error);
            return ApiResponse.error(res, 'Failed to cast governance vote', 500);
        }
    }

    // ==================== BLOCKCHAIN SYNCHRONIZATION ENDPOINTS ====================

    /**
     * Start blockchain synchronization
     */
    async startBlockchainSync(req: Request, res: Response) {
        try {
            const { intervalMinutes = 5 } = req.body;

            blockchainSyncService.startAutoSync(intervalMinutes);

            return ApiResponse.success(res, 'Blockchain synchronization started successfully', {
                intervalMinutes,
                status: 'started'
            });
        } catch (error) {
            logger.error('Failed to start blockchain synchronization:', error);
            return ApiResponse.error(res, 'Failed to start blockchain synchronization', 500);
        }
    }

    /**
     * Stop blockchain synchronization
     */
    async stopBlockchainSync(req: Request, res: Response) {
        try {
            blockchainSyncService.stopAutoSync();

            return ApiResponse.success(res, 'Blockchain synchronization stopped successfully', {
                status: 'stopped'
            });
        } catch (error) {
            logger.error('Failed to stop blockchain synchronization:', error);
            return ApiResponse.error(res, 'Failed to stop blockchain synchronization', 500);
        }
    }

    /**
     * Get blockchain sync status
     */
    async getBlockchainSyncStatus(req: Request, res: Response) {
        try {
            const syncStatus = blockchainSyncService.getSyncStatus();

            return ApiResponse.success(res, 'Blockchain sync status retrieved successfully', syncStatus);
        } catch (error) {
            logger.error('Failed to get blockchain sync status:', error);
            return ApiResponse.error(res, 'Failed to get blockchain sync status', 500);
        }
    }

    /**
     * Trigger manual blockchain sync
     */
    async triggerBlockchainSync(req: Request, res: Response) {
        try {
            const { options = {} } = req.body;

            logger.info('Triggering manual blockchain synchronization');

            const syncStatus = await blockchainSyncService.syncAll(options);

            return ApiResponse.success(res, 'Blockchain synchronization completed', syncStatus);
        } catch (error) {
            logger.error('Failed to trigger blockchain synchronization:', error);
            return ApiResponse.error(res, 'Failed to trigger blockchain synchronization', 500);
        }
    }

    // ==================== UTILITY ENDPOINTS ====================

    /**
     * Get voting power
     */
    async getVotingPower(req: Request, res: Response) {
        try {
            const { campaignId, voter } = req.params;

            if (!campaignId || !voter) {
                return ApiResponse.error(res, 'Campaign ID and voter address are required', 400);
            }

            const result = await smartContractIntegration.getVotingPower(parseInt(campaignId), voter);

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to get voting power', 500);
            }

            return ApiResponse.success(res, 'Voting power retrieved successfully', result.data);
        } catch (error) {
            logger.error(`Failed to get voting power for campaign ${req.params.campaignId}, voter ${req.params.voter}:`, error);
            return ApiResponse.error(res, 'Failed to get voting power', 500);
        }
    }

    /**
     * Calculate platform fee
     */
    async calculatePlatformFee(req: Request, res: Response) {
        try {
            const { amount } = req.body;

            if (!amount) {
                return ApiResponse.error(res, 'Amount is required', 400);
            }

            const result = await smartContractIntegration.calculatePlatformFee(amount);

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to calculate platform fee', 500);
            }

            return ApiResponse.success(res, 'Platform fee calculated successfully', result.data);
        } catch (error) {
            logger.error('Failed to calculate platform fee:', error);
            return ApiResponse.error(res, 'Failed to calculate platform fee', 500);
        }
    }

    /**
     * Get contract balance
     */
    async getContractBalance(req: Request, res: Response) {
        try {
            const result = await smartContractIntegration.getContractBalance();

            if (!result.success) {
                return ApiResponse.error(res, result.error || 'Failed to get contract balance', 500);
            }

            return ApiResponse.success(res, 'Contract balance retrieved successfully', result.data);
        } catch (error) {
            logger.error('Failed to get contract balance:', error);
            return ApiResponse.error(res, 'Failed to get contract balance', 500);
        }
    }
}
