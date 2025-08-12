const {
    Client,
    PrivateKey,
    AccountId,
    ContractCreateFlow,
    ContractFunctionParameters,
    Hbar,
    FileCreateTransaction,
    FileAppendTransaction,
    ContractCallQuery,
    ContractExecuteTransaction
} = require("@hashgraph/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Network configuration
const NETWORKS = {
    testnet: {
        nodeId: "0.0.3",
        nodeAccountId: AccountId.fromString("0.0.3"),
        nodeAddress: "testnet.hedera.com:50211",
        mirrorNodeUrl: "https://testnet.mirrornode.hedera.com"
    },
    mainnet: {
        nodeId: "0.0.3",
        nodeAccountId: AccountId.fromString("0.0.3"),
        nodeAddress: "mainnet-public.mirrornode.hedera.com:443",
        mirrorNodeUrl: "https://mainnet-public.mirrornode.hedera.com"
    },
    previewnet: {
        nodeId: "0.0.3",
        nodeAccountId: AccountId.fromString("0.0.3"),
        nodeAddress: "previewnet.hedera.com:50211",
        mirrorNodeUrl: "https://previewnet.hedera.com"
    }
};

class FundFlowDeployer {
    constructor() {
        this.network = process.env.HEDERA_NETWORK || "testnet";
        this.operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);

        // Handle private key properly - using ECDSA format
        let privateKeyString = process.env.HEDERA_PRIVATE_KEY;

        try {
            // Remove 0x prefix if present for ECDSA format
            if (privateKeyString.startsWith("0x")) {
                console.log("🔑 Using ECDSA format private key (with 0x prefix)...");
                privateKeyString = privateKeyString.slice(2); // Remove 0x prefix
            }

            // Create ECDSA private key
            this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);
            console.log("✅ Private key parsed successfully");

        } catch (error) {
            console.error("❌ Failed to parse private key:", error.message);
            console.log("💡 Please check your HEDERA_PRIVATE_KEY format in .env file");
            console.log("💡 Expected format: 0x followed by 64 hex characters");
            process.exit(1);
        }

        // Initialize client
        this.client = Client.forName(this.network);
        this.client.setOperator(this.operatorId, this.operatorKey);

        console.log(`🌐 Connected to Hedera ${this.network}`);
        console.log(`👤 Operator Account: ${this.operatorId.toString()}`);

        // Create deployments directory if it doesn't exist
        this.deploymentsDir = path.join(__dirname, "..", "deployments");
        if (!fs.existsSync(this.deploymentsDir)) {
            fs.mkdirSync(this.deploymentsDir, { recursive: true });
        }
    }

    /**
     * Deploy smart contract using Hedera SDK
     * @param {string} contractName - Name of the contract
     * @param {string} bytecode - Contract bytecode (hex string)
     * @param {Array} constructorParams - Constructor parameters
     * @param {number} gas - Gas limit for deployment
     * @returns {Object} Deployment result with contract ID and transaction ID
     */
    async deployContract(contractName, bytecode, constructorParams = [], gas = 4000000) {
        try {
            console.log(`\n🚀 Deploying ${contractName} contract...`);
            console.log(`⛽ Gas limit: ${gas.toLocaleString()}`);

            // Remove 0x prefix if present
            const cleanBytecode = bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode;

            // Create contract parameters
            let contractParams = new ContractFunctionParameters();

            // Add constructor parameters based on contract type
            if (contractName === "FundFlowCore" && constructorParams.length >= 2) {
                contractParams.addUint8(constructorParams[0]); // platformFeePercentage
                contractParams.addAddress(constructorParams[1]); // feeCollector
            } else if (contractName === "CampaignManager" && constructorParams.length >= 1) {
                contractParams.addAddress(constructorParams[0]); // fundFlowCore address
            } else if (contractName === "InvestmentManager" && constructorParams.length >= 2) {
                contractParams.addAddress(constructorParams[0]); // fundFlowCore address
                contractParams.addUint256(constructorParams[1]); // minInvestmentAmount
            } else if (contractName === "MilestoneManager" && constructorParams.length >= 2) {
                contractParams.addAddress(constructorParams[0]); // fundFlowCore address
                contractParams.addUint256(constructorParams[1]); // defaultVotingDuration
            } else if (contractName === "AnalyticsManager" && constructorParams.length >= 1) {
                contractParams.addAddress(constructorParams[0]); // fundFlowCore address
            } else if (contractName === "GovernanceManager" && constructorParams.length >= 1) {
                contractParams.addAddress(constructorParams[0]); // fundFlowCore address
            }

            // Deploy contract
            const contractCreateFlow = new ContractCreateFlow()
                .setGas(gas)
                .setBytecode(cleanBytecode);

            if (constructorParams.length > 0) {
                contractCreateFlow.setConstructorParameters(contractParams);
            }

            console.log("📝 Submitting contract creation transaction...");
            const txResponse = await contractCreateFlow.execute(this.client);
            const receipt = await txResponse.getReceipt(this.client);

            const contractId = receipt.contractId;
            const transactionId = txResponse.transactionId;

            console.log(`✅ ${contractName} deployed successfully!`);
            console.log(`📄 Contract ID: ${contractId.toString()}`);
            console.log(`🔗 Transaction ID: ${transactionId.toString()}`);
            console.log(`🔍 Explorer: https://hashscan.io/${this.network}/contract/${contractId.toString()}`);

            return {
                contractId: contractId.toString(),
                transactionId: transactionId.toString(),
                contractAddress: contractId.toSolidityAddress(),
                explorerUrl: `https://hashscan.io/${this.network}/contract/${contractId.toString()}`,
                success: true
            };

        } catch (error) {
            console.error(`❌ Failed to deploy ${contractName}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Read contract bytecode from artifacts
     * @param {string} contractName - Name of the contract
     * @returns {string} Contract bytecode
     */
    readContractBytecode(contractName) {
        try {
            // Map contract names to their directory structure
            const contractPaths = {
                "FundFlowCore": "core/FundFlowCore.sol",
                "CampaignManager": "campaign/CampaignManager.sol",
                "InvestmentManager": "investment/InvestmentManager.sol",
                "MilestoneManager": "milestone/MilestoneManager.sol",
                "AnalyticsManager": "analytics/AnalyticsManager.sol",
                "GovernanceManager": "governance/GovernanceManager.sol"
            };

            const contractPath = contractPaths[contractName];
            if (!contractPath) {
                throw new Error(`Unknown contract: ${contractName}`);
            }

            const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", contractPath, `${contractName}.json`);

            if (!fs.existsSync(artifactPath)) {
                throw new Error(`Contract artifact not found for ${contractName}. Please compile first. Expected: ${artifactPath}`);
            }

            const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
            return artifact.bytecode;

        } catch (error) {
            console.error(`Failed to read ${contractName} bytecode:`, error.message);
            throw error;
        }
    }

    /**
     * Call a contract function
     * @param {string} contractId - Contract ID
     * @param {string} functionName - Function name
     * @param {Array} parameters - Function parameters
     * @param {number} gas - Gas limit
     * @returns {Object} Function call result
     */
    async callContractFunction(contractId, functionName, parameters = [], gas = 200000) {
        try {
            console.log(`📞 Calling ${functionName} on contract ${contractId}...`);

            const contractParams = new ContractFunctionParameters();

            // Add parameters based on function
            parameters.forEach(param => {
                if (typeof param === 'string') {
                    if (param.startsWith('0x') && param.length === 42) {
                        // Ethereum address
                        contractParams.addAddress(param);
                    } else {
                        // Regular string
                        contractParams.addString(param);
                    }
                } else if (typeof param === 'number') {
                    contractParams.addUint256(param);
                } else if (typeof param === 'bigint') {
                    contractParams.addUint256(param);
                } else if (typeof param === 'boolean') {
                    contractParams.addBool(param);
                }
            });

            const transaction = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(gas)
                .setFunction(functionName, contractParams);

            const txResponse = await transaction.execute(this.client);
            const receipt = await txResponse.getReceipt(this.client);

            console.log(`✅ ${functionName} called successfully`);
            return {
                success: true,
                transactionId: txResponse.transactionId.toString(),
                receipt: receipt
            };

        } catch (error) {
            console.error(`❌ Failed to call ${functionName}:`, error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Save deployment information to file
     * @param {Object} deployments - Deployment results
     */
    saveDeploymentInfo(deployments) {
        try {
            const deploymentInfo = {
                network: this.network,
                operatorId: this.operatorId.toString(),
                deployedAt: new Date().toISOString(),
                contracts: deployments
            };

            const filePath = path.join(this.deploymentsDir, `${this.network}-deployment.json`);
            fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

            console.log(`💾 Deployment info saved to: ${filePath}`);

            // Also save environment variables for easy use
            const envContent = this.generateEnvContent(deployments);
            const envPath = path.join(this.deploymentsDir, `${this.network}-contracts.env`);
            fs.writeFileSync(envPath, envContent);

            console.log(`💾 Environment variables saved to: ${envPath}`);

        } catch (error) {
            console.error("Failed to save deployment info:", error);
        }
    }

    /**
     * Generate environment variables content
     * @param {Object} deployments - Deployment results
     * @returns {string} Environment variables content
     */
    generateEnvContent(deployments) {
        let content = `# FundFlow Smart Contract Addresses - ${this.network.toUpperCase()}\n`;
        content += `# Generated on: ${new Date().toISOString()}\n\n`;

        Object.entries(deployments).forEach(([name, deployment]) => {
            if (deployment.success) {
                content += `# ${name} Contract\n`;
                content += `NEXT_PUBLIC_${name.toUpperCase()}_ADDRESS=${deployment.contractAddress}\n`;
                content += `NEXT_PUBLIC_${name.toUpperCase()}_ID=${deployment.contractId}\n`;
                content += `NEXT_PUBLIC_${name.toUpperCase()}_EXPLORER=${deployment.explorerUrl}\n\n`;
            }
        });

        content += `# Network Configuration\n`;
        content += `NEXT_PUBLIC_HEDERA_NETWORK=${this.network}\n`;
        content += `NEXT_PUBLIC_MIRROR_NODE_URL=${NETWORKS[this.network].mirrorNodeUrl}\n`;

        return content;
    }
}

/**
 * Main deployment function
 */
async function main() {
    try {
        console.log("🚀 Starting FundFlow Smart Contract Deployment");
        console.log("=".repeat(50));

        const deployer = new FundFlowDeployer();
        const deployments = {};

        // Deploy FundFlowCore first (main contract)
        console.log("\n1️⃣  Deploying FundFlowCore contract...");
        const fundFlowCoreBytecode = deployer.readContractBytecode("FundFlowCore");

        const fundFlowCoreParams = [
            parseInt(process.env.PLATFORM_FEE_PERCENTAGE || "2"), // platformFeePercentage
            deployer.operatorId.toSolidityAddress() // feeCollector
        ];

        const fundFlowCoreDeployment = await deployer.deployContract(
            "FundFlowCore",
            fundFlowCoreBytecode,
            fundFlowCoreParams,
            8000000  // 8M gas limit
        );

        deployments.fundFlowCore = fundFlowCoreDeployment;

        if (!fundFlowCoreDeployment.success) {
            console.error("❌ FundFlowCore deployment failed. Aborting.");
            process.exit(1);
        }

        // Wait for contract to be available
        console.log("⏳ Waiting for FundFlowCore contract to be available...");
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Deploy CampaignManager contract
        console.log("\n2️⃣  Deploying CampaignManager contract...");
        const campaignManagerBytecode = deployer.readContractBytecode("CampaignManager");

        const campaignManagerParams = [
            fundFlowCoreDeployment.contractAddress // fundFlowCore address
        ];

        const campaignManagerDeployment = await deployer.deployContract(
            "CampaignManager",
            campaignManagerBytecode,
            campaignManagerParams,
            6000000  // 6M gas limit
        );

        deployments.campaignManager = campaignManagerDeployment;

        if (!campaignManagerDeployment.success) {
            console.error("❌ CampaignManager deployment failed. Aborting.");
            process.exit(1);
        }

        // Deploy InvestmentManager contract
        console.log("\n3️⃣  Deploying InvestmentManager contract...");
        const investmentManagerBytecode = deployer.readContractBytecode("InvestmentManager");

        const investmentManagerParams = [
            fundFlowCoreDeployment.contractAddress, // fundFlowCore address
            process.env.MIN_INVESTMENT_AMOUNT || "10000000000000000000" // minInvestmentAmount (10 HBAR)
        ];

        const investmentManagerDeployment = await deployer.deployContract(
            "InvestmentManager",
            investmentManagerBytecode,
            investmentManagerParams,
            6000000  // 6M gas limit
        );

        deployments.investmentManager = investmentManagerDeployment;

        if (!investmentManagerDeployment.success) {
            console.error("❌ InvestmentManager deployment failed. Aborting.");
            process.exit(1);
        }

        // Deploy MilestoneManager contract
        console.log("\n4️⃣  Deploying MilestoneManager contract...");
        const milestoneManagerBytecode = deployer.readContractBytecode("MilestoneManager");

        const milestoneManagerParams = [
            fundFlowCoreDeployment.contractId, // fundFlowCore address
            (7 * 24 * 60 * 60).toString() // defaultVotingDuration (7 days in seconds)
        ];

        const milestoneManagerDeployment = await deployer.deployContract(
            "MilestoneManager",
            milestoneManagerBytecode,
            milestoneManagerParams,
            6000000  // 6M gas limit
        );

        deployments.milestoneManager = milestoneManagerDeployment;

        if (!milestoneManagerDeployment.success) {
            console.error("❌ MilestoneManager deployment failed. Aborting.");
            process.exit(1);
        }

        // Deploy AnalyticsManager contract
        console.log("\n5️⃣  Deploying AnalyticsManager contract...");
        const analyticsManagerBytecode = deployer.readContractBytecode("AnalyticsManager");

        const analyticsManagerParams = [
            fundFlowCoreDeployment.contractAddress // fundFlowCore address
        ];

        const analyticsManagerDeployment = await deployer.deployContract(
            "AnalyticsManager",
            analyticsManagerBytecode,
            analyticsManagerParams,
            6000000  // 6M gas limit
        );

        deployments.analyticsManager = analyticsManagerDeployment;

        if (!analyticsManagerDeployment.success) {
            console.error("❌ AnalyticsManager deployment failed. Aborting.");
            process.exit(1);
        }

        // Deploy GovernanceManager contract
        console.log("\n6️⃣  Deploying GovernanceManager contract...");
        const governanceManagerBytecode = deployer.readContractBytecode("GovernanceManager");

        const governanceManagerParams = [
            fundFlowCoreDeployment.contractAddress // fundFlowCore address
        ];

        const governanceManagerDeployment = await deployer.deployContract(
            "GovernanceManager",
            governanceManagerBytecode,
            governanceManagerParams,
            6000000  // 6M gas limit
        );

        deployments.governanceManager = governanceManagerDeployment;

        if (!governanceManagerDeployment.success) {
            console.error("❌ GovernanceManager deployment failed. Aborting.");
            process.exit(1);
        }

        // Setup contract relationships
        console.log("\n7️⃣  Setting up contract relationships...");

        // Register managers in FundFlowCore
        const registerCampaignManager = await deployer.callContractFunction(
            fundFlowCoreDeployment.contractId,
            "setCampaignManager",
            [campaignManagerDeployment.contractAddress],
            200000
        );

        if (registerCampaignManager.success) {
            console.log("✅ CampaignManager registered in FundFlowCore");
        }

        const registerInvestmentManager = await deployer.callContractFunction(
            fundFlowCoreDeployment.contractId,
            "setInvestmentManager",
            [investmentManagerDeployment.contractAddress],
            200000
        );

        if (registerInvestmentManager.success) {
            console.log("✅ InvestmentManager registered in FundFlowCore");
        }

        const registerMilestoneManager = await deployer.callContractFunction(
            fundFlowCoreDeployment.contractId,
            "setMilestoneManager",
            [milestoneManagerDeployment.contractAddress],
            200000
        );

        if (registerMilestoneManager.success) {
            console.log("✅ MilestoneManager registered in FundFlowCore");
        }

        const registerAnalyticsManager = await deployer.callContractFunction(
            fundFlowCoreDeployment.contractId,
            "setAnalyticsManager",
            [analyticsManagerDeployment.contractAddress],
            200000
        );

        if (registerAnalyticsManager.success) {
            console.log("✅ AnalyticsManager registered in FundFlowCore");
        }

        const registerGovernanceManager = await deployer.callContractFunction(
            fundFlowCoreDeployment.contractId,
            "setGovernanceManager",
            [governanceManagerDeployment.contractAddress],
            200000
        );

        if (registerGovernanceManager.success) {
            console.log("✅ GovernanceManager registered in FundFlowCore");
        }

        // Save deployment information
        deployer.saveDeploymentInfo(deployments);

        // Print deployment summary
        console.log("\n🎉 FUNDFLOW DEPLOYMENT COMPLETE!");
        console.log("=".repeat(50));
        console.log(`Network: ${deployer.network}`);
        console.log(`Operator: ${deployer.operatorId.toString()}`);
        console.log("\nDeployed Contracts:");

        Object.entries(deployments).forEach(([name, deployment]) => {
            if (deployment.success) {
                console.log(`  📄 ${name}:`);
                console.log(`     Contract ID: ${deployment.contractId}`);
                console.log(`     Solidity Address: ${deployment.contractAddress}`);
                console.log(`     Explorer: ${deployment.explorerUrl}`);
            }
        });

        console.log("\n💡 Next Steps:");
        console.log("1. Copy the contract addresses to your frontend .env.local file");
        console.log("2. Update your backend configuration with the contract addresses");
        console.log("3. Test contract functions through the web interface");
        console.log("4. Run the test suite to verify deployment");

        console.log("\n📁 Files Created:");
        console.log(`   - Deployments: ${path.join(deployer.deploymentsDir, `${deployer.network}-deployment.json`)}`);
        console.log(`   - Environment: ${path.join(deployer.deploymentsDir, `${deployer.network}-contracts.env`)}`);

    } catch (error) {
        console.error("💥 Deployment failed:", error);
        process.exit(1);
    }
}

// Execute deployment if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = {
    FundFlowDeployer,
    NETWORKS
};
