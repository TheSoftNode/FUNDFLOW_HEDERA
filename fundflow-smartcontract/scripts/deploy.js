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
        mirrorNodeUrl: "https://previewnet.mirrornode.hedera.com"
    }
};

class HederaFundFlowDeployer {
    constructor() {
        this.network = process.env.HEDERA_NETWORK || "testnet";
        this.operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
        
        // Handle private key properly - try different formats
        let privateKeyString = process.env.HEDERA_PRIVATE_KEY;
        
        try {
            // Try DER format first (if it's a long hex string without 0x prefix)
            if (privateKeyString.length > 64 && !privateKeyString.startsWith("0x")) {
                console.log("🔑 Trying DER format private key...");
                this.operatorKey = PrivateKey.fromStringDer(privateKeyString);
            }
            // Try ECDSA format for hex-encoded keys
            else if (privateKeyString.startsWith("0x")) {
                console.log("🔑 Trying ECDSA format private key (with 0x prefix)...");
                privateKeyString = privateKeyString.slice(2); // Remove 0x prefix
                this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);
            }
            // Try ECDSA format for plain hex
            else {
                console.log("🔑 Trying ECDSA format private key...");
                this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);
            }
        } catch (error) {
            console.error("❌ Failed to parse private key:", error.message);
            console.log("💡 Please check your HEDERA_PRIVATE_KEY format in .env file");
            process.exit(1);
        }
        
        // Initialize client
        this.client = Client.forName(this.network);
        this.client.setOperator(this.operatorId, this.operatorKey);
        
        console.log(`🌐 Connected to Hedera ${this.network}`);
        console.log(`👤 Operator Account: ${this.operatorId.toString()}`);
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
            if (contractName === "FundFlow" && constructorParams.length > 0) {
                // FundFlow constructor doesn't take parameters currently
                // But we can add them if needed in the future
                constructorParams.forEach((param, index) => {
                    if (typeof param === "string" && param.startsWith("0.0.")) {
                        contractParams.addAddress(param);
                    } else if (typeof param === "string") {
                        contractParams.addString(param);
                    } else if (typeof param === "number" || typeof param === "bigint") {
                        contractParams.addUint256(param);
                    } else if (typeof param === "boolean") {
                        contractParams.addBool(param);
                    }
                });
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
                "FundFlow": "core/FundFlow.sol"
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
     * @param {Array} params - Function parameters
     * @param {number} gas - Gas limit
     * @returns {Object} Transaction result
     */
    async callContractFunction(contractId, functionName, params = [], gas = 100000) {
        try {
            console.log(`\n📞 Calling ${functionName} on contract ${contractId}...`);
            
            let contractParams = new ContractFunctionParameters();
            
            // Add parameters based on function
            params.forEach((param, index) => {
                if (typeof param === "string" && param.startsWith("0.0.")) {
                    contractParams.addAddress(param);
                } else if (typeof param === "string") {
                    contractParams.addString(param);
                } else if (typeof param === "number" || typeof param === "bigint") {
                    contractParams.addUint256(param);
                } else if (typeof param === "boolean") {
                    contractParams.addBool(param);
                }
            });
            
            const contractExecTx = new ContractExecuteTransaction()
                .setContractId(contractId)
                .setGas(gas)
                .setFunction(functionName, contractParams)
                .setMaxTransactionFee(new Hbar(5));
            
            const txResponse = await contractExecTx.execute(this.client);
            const receipt = await txResponse.getReceipt(this.client);
            
            console.log(`✅ Function ${functionName} executed successfully!`);
            console.log(`🔗 Transaction ID: ${txResponse.transactionId.toString()}`);
            
            return {
                success: true,
                transactionId: txResponse.transactionId.toString(),
                status: receipt.status.toString()
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
     * Query a contract function (read-only)
     * @param {string} contractId - Contract ID
     * @param {string} functionName - Function name
     * @param {Array} params - Function parameters
     * @returns {Object} Query result
     */
    async queryContractFunction(contractId, functionName, params = []) {
        try {
            console.log(`\n🔍 Querying ${functionName} on contract ${contractId}...`);
            
            let contractParams = new ContractFunctionParameters();
            
            params.forEach((param) => {
                if (typeof param === "string" && param.startsWith("0.0.")) {
                    contractParams.addAddress(param);
                } else if (typeof param === "string") {
                    contractParams.addString(param);
                } else if (typeof param === "number" || typeof param === "bigint") {
                    contractParams.addUint256(param);
                } else if (typeof param === "boolean") {
                    contractParams.addBool(param);
                }
            });
            
            const contractQuery = new ContractCallQuery()
                .setContractId(contractId)
                .setGas(50000)
                .setFunction(functionName, contractParams);
            
            const result = await contractQuery.execute(this.client);
            
            console.log(`✅ Query ${functionName} completed successfully!`);
            
            return {
                success: true,
                result: result
            };
            
        } catch (error) {
            console.error(`❌ Failed to query ${functionName}:`, error);
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
        const deploymentInfo = {
            network: this.network,
            timestamp: new Date().toISOString(),
            operator: this.operatorId.toString(),
            contracts: deployments,
            networkInfo: NETWORKS[this.network]
        };

        const outputPath = path.join(__dirname, "..", "deployments", `${this.network}.json`);
        
        // Create deployments directory if it doesn't exist
        const deploymentsDir = path.dirname(outputPath);
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
        console.log(`\n💾 Deployment info saved to: ${outputPath}`);
        
        // Update environment file
        this.updateEnvironmentFile(deployments);
    }

    /**
     * Update environment file with contract addresses
     * @param {Object} deployments - Deployment results
     */
    updateEnvironmentFile(deployments) {
        // Update root .env file
        const rootEnvPath = path.join(__dirname, "..", ".env");
        this.updateEnvFile(rootEnvPath, deployments, false);
        
        // Update frontend .env.local file if it exists
        const frontendEnvPath = path.join(__dirname, "..", "..", "fundflow-frontend", ".env.local");
        if (fs.existsSync(path.dirname(frontendEnvPath))) {
            this.updateEnvFile(frontendEnvPath, deployments, true);
        }
        
        // Update server .env file if it exists  
        const serverEnvPath = path.join(__dirname, "..", "..", "fundflow-server", ".env");
        if (fs.existsSync(path.dirname(serverEnvPath))) {
            this.updateEnvFile(serverEnvPath, deployments, false);
        }
    }
    
    /**
     * Helper method to update individual env files
     */
    updateEnvFile(envPath, deployments, includePublic = false) {
        let envContent = "";
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, "utf8");
        }
        
        // Update or add contract addresses
        Object.entries(deployments).forEach(([contractName, deployment]) => {
            if (deployment.success) {
                const envVar = `CONTRACT_${contractName.toUpperCase()}`;
                const publicEnvVar = `NEXT_PUBLIC_CONTRACT_${contractName.toUpperCase()}`;
                const contractId = deployment.contractId;
                
                // Update regular env var
                const regex = new RegExp(`^${envVar}=.*$`, "m");
                if (envContent.match(regex)) {
                    envContent = envContent.replace(regex, `${envVar}=${contractId}`);
                } else {
                    envContent += `\n${envVar}=${contractId}`;
                }
                
                // Update public env var for frontend
                if (includePublic) {
                    const publicRegex = new RegExp(`^${publicEnvVar}=.*$`, "m");
                    if (envContent.match(publicRegex)) {
                        envContent = envContent.replace(publicRegex, `${publicEnvVar}=${contractId}`);
                    } else {
                        envContent += `\n${publicEnvVar}=${contractId}`;
                    }
                }
            }
        });
        
        fs.writeFileSync(envPath, envContent);
        console.log(`📝 Environment file updated: ${envPath}`);
    }
}

/**
 * Main deployment script
 */
async function main() {
    console.log("🚀 FundFlow - Smart Contract Deployment");
    console.log("=" .repeat(50));
    
    const deployer = new HederaFundFlowDeployer();
    const deployments = {};
    
    try {
        // Check if contracts are compiled
        console.log("\n🔍 Checking compiled contracts...");
        
        let fundFlowBytecode;
        
        try {
            fundFlowBytecode = deployer.readContractBytecode("FundFlow");
            console.log(`✅ Found FundFlow contract`);
        } catch (error) {
            console.error("❌ FundFlow contract not found!");
            console.error("Please run 'npm run compile' first to compile the contracts.");
            process.exit(1);
        }

        // Deploy FundFlow contract
        console.log("\n1️⃣  Deploying FundFlow contract...");
        
        const fundFlowDeployment = await deployer.deployContract(
            "FundFlow",
            fundFlowBytecode,
            [], // No constructor parameters needed
            6000000  // Increased gas limit for complex contract
        );
        
        deployments.fundflow = fundFlowDeployment;
        
        if (!fundFlowDeployment.success) {
            console.error("❌ FundFlow deployment failed. Aborting.");
            process.exit(1);
        }
        
        // Wait a bit for the contract to be available
        console.log("⏳ Waiting for contract to be available...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test contract functionality
        console.log("\n2️⃣  Testing contract functionality...");
        
        // Query initial state
        const totalCampaignsResult = await deployer.queryContractFunction(
            fundFlowDeployment.contractId,
            "getTotalCampaigns",
            []
        );
        
        if (totalCampaignsResult.success) {
            console.log("✅ Contract state query successful");
        }
        
        const platformFeeResult = await deployer.queryContractFunction(
            fundFlowDeployment.contractId,
            "platformFeePercent",
            []
        );
        
        if (platformFeeResult.success) {
            console.log("✅ Platform fee query successful");
        }
        
        // Save deployment information
        deployer.saveDeploymentInfo(deployments);
        
        // Print deployment summary
        console.log("\n🎉 DEPLOYMENT COMPLETE!");
        console.log("=" .repeat(50));
        console.log(`Network: ${deployer.network}`);
        console.log(`Operator: ${deployer.operatorId.toString()}`);
        console.log("\nDeployed Contracts:");
        
        Object.entries(deployments).forEach(([name, deployment]) => {
            if (deployment.success) {
                console.log(`  📄 ${name}:`);
                console.log(`     Contract ID: ${deployment.contractId}`);
                console.log(`     Explorer: ${deployment.explorerUrl}`);
            }
        });
        
        console.log("\n💡 Next Steps:");
        console.log("1. Update your frontend with the contract addresses");
        console.log("2. Start the backend server to test API integration");
        console.log("3. Test contract functions through the web interface");
        console.log("4. Run verification script to validate deployment");
        
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
    HederaFundFlowDeployer,
    NETWORKS
};
