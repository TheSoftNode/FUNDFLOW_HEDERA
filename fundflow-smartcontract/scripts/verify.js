const {
    Client,
    PrivateKey,
    AccountId,
    ContractCallQuery,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar
} = require("@hashgraph/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Verification script for FundFlow deployed contracts
 * This script validates that contracts are properly deployed and functional
 */

class FundFlowVerifier {
    constructor() {
        this.network = process.env.HEDERA_NETWORK || "testnet";
        this.operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
        
        // Handle private key
        let privateKeyString = process.env.HEDERA_PRIVATE_KEY;
        try {
            if (privateKeyString.length > 64 && !privateKeyString.startsWith("0x")) {
                this.operatorKey = PrivateKey.fromStringDer(privateKeyString);
            } else if (privateKeyString.startsWith("0x")) {
                privateKeyString = privateKeyString.slice(2);
                this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);
            } else {
                this.operatorKey = PrivateKey.fromStringECDSA(privateKeyString);
            }
        } catch (error) {
            console.error("❌ Failed to parse private key:", error.message);
            process.exit(1);
        }
        
        // Initialize client
        this.client = Client.forName(this.network);
        this.client.setOperator(this.operatorId, this.operatorKey);
        
        console.log(`🌐 Connected to Hedera ${this.network}`);
        console.log(`👤 Operator Account: ${this.operatorId.toString()}`);
    }

    /**
     * Load deployment information
     */
    loadDeploymentInfo() {
        const deploymentPath = path.join(__dirname, "..", "deployments", `${this.network}.json`);
        
        if (!fs.existsSync(deploymentPath)) {
            throw new Error(`Deployment file not found: ${deploymentPath}. Please deploy first.`);
        }
        
        const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        console.log(`📄 Loaded deployment info for ${this.network}`);
        
        return deploymentInfo;
    }

    /**
     * Query contract function
     */
    async queryContract(contractId, functionName, params = []) {
        try {
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
            return { success: true, result };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify FundFlow contract functionality
     */
    async verifyFundFlowContract(contractId) {
        console.log(`\n🔍 Verifying FundFlow contract: ${contractId}`);
        
        const tests = [
            {
                name: "Platform Fee Percent",
                function: "platformFeePercent",
                params: [],
                expectedType: "uint256"
            },
            {
                name: "Total Campaigns",
                function: "getTotalCampaigns", 
                params: [],
                expectedType: "uint256"
            },
            {
                name: "Next Campaign ID",
                function: "getNextCampaignId",
                params: [],
                expectedType: "uint256"
            },
            {
                name: "Total Value Locked",
                function: "getTotalValueLocked",
                params: [],
                expectedType: "uint256"
            },
            {
                name: "Contract Balance",
                function: "getContractBalance",
                params: [],
                expectedType: "uint256"
            },
            {
                name: "Owner",
                function: "owner",
                params: [],
                expectedType: "address"
            }
        ];

        let passedTests = 0;
        let totalTests = tests.length;

        for (const test of tests) {
            console.log(`  Testing ${test.name}...`);
            
            const result = await this.queryContract(contractId, test.function, test.params);
            
            if (result.success) {
                console.log(`    ✅ ${test.name}: Query successful`);
                passedTests++;
                
                // Log the actual values for informational purposes
                try {
                    if (test.function === "platformFeePercent") {
                        const feePercent = result.result.getUint256(0);
                        console.log(`       Platform Fee: ${feePercent.toString()} basis points (${feePercent.toNumber() / 100}%)`);
                    } else if (test.function === "getTotalCampaigns") {
                        const totalCampaigns = result.result.getUint256(0);
                        console.log(`       Total Campaigns: ${totalCampaigns.toString()}`);
                    } else if (test.function === "getNextCampaignId") {
                        const nextId = result.result.getUint256(0);
                        console.log(`       Next Campaign ID: ${nextId.toString()}`);
                    } else if (test.function === "getTotalValueLocked") {
                        const tvl = result.result.getUint256(0);
                        console.log(`       Total Value Locked: ${tvl.toString()} tinybars`);
                    } else if (test.function === "getContractBalance") {
                        const balance = result.result.getUint256(0);
                        console.log(`       Contract Balance: ${balance.toString()} tinybars`);
                    } else if (test.function === "owner") {
                        const owner = result.result.getAddress(0);
                        console.log(`       Owner: ${owner}`);
                    }
                } catch (parseError) {
                    console.log(`       Result: Query successful (unable to parse value)`);
                }
            } else {
                console.log(`    ❌ ${test.name}: ${result.error}`);
            }
        }

        console.log(`\n📊 Contract Verification Results: ${passedTests}/${totalTests} tests passed`);
        
        return passedTests === totalTests;
    }

    /**
     * Test contract interaction capabilities
     */
    async testContractInteractions(contractId) {
        console.log(`\n🧪 Testing contract interactions...`);
        
        try {
            // Test platform fee calculation
            console.log("  Testing platform fee calculation...");
            const testAmount = 1000000; // 1 HBAR in tinybars
            
            const feeResult = await this.queryContract(contractId, "calculatePlatformFee", [testAmount]);
            
            if (feeResult.success) {
                const platformFee = feeResult.result.getUint256(0);
                console.log(`    ✅ Platform fee calculation works`);
                console.log(`       For ${testAmount} tinybars, fee would be: ${platformFee.toString()} tinybars`);
            } else {
                console.log(`    ❌ Platform fee calculation failed: ${feeResult.error}`);
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.log(`    ❌ Contract interaction test failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Verify contract state consistency
     */
    async verifyContractState(contractId) {
        console.log(`\n🔄 Verifying contract state consistency...`);
        
        try {
            // Get total campaigns and next campaign ID
            const totalCampaignsResult = await this.queryContract(contractId, "getTotalCampaigns", []);
            const nextIdResult = await this.queryContract(contractId, "getNextCampaignId", []);
            
            if (totalCampaignsResult.success && nextIdResult.success) {
                const totalCampaigns = totalCampaignsResult.result.getUint256(0);
                const nextId = nextIdResult.result.getUint256(0);
                
                // Next ID should be totalCampaigns + 1
                const expectedNextId = totalCampaigns.add(1);
                
                if (nextId.eq(expectedNextId)) {
                    console.log(`  ✅ Campaign ID consistency verified`);
                    console.log(`     Total campaigns: ${totalCampaigns.toString()}`);
                    console.log(`     Next campaign ID: ${nextId.toString()}`);
                    return true;
                } else {
                    console.log(`  ❌ Campaign ID inconsistency detected`);
                    console.log(`     Total campaigns: ${totalCampaigns.toString()}`);
                    console.log(`     Next campaign ID: ${nextId.toString()}`);
                    console.log(`     Expected next ID: ${expectedNextId.toString()}`);
                    return false;
                }
            } else {
                console.log(`  ❌ Unable to verify state consistency`);
                return false;
            }
            
        } catch (error) {
            console.log(`  ❌ State verification failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Generate verification report
     */
    generateReport(deploymentInfo, verificationResults) {
        const report = {
            network: this.network,
            verificationTimestamp: new Date().toISOString(),
            deploymentTimestamp: deploymentInfo.timestamp,
            operator: this.operatorId.toString(),
            contracts: {},
            summary: {
                totalContracts: 0,
                verifiedContracts: 0,
                overallStatus: "UNKNOWN"
            }
        };

        // Process verification results for each contract
        Object.entries(deploymentInfo.contracts).forEach(([contractName, contractInfo]) => {
            if (contractInfo.success) {
                report.contracts[contractName] = {
                    contractId: contractInfo.contractId,
                    explorerUrl: contractInfo.explorerUrl,
                    verificationStatus: verificationResults[contractName] ? "VERIFIED" : "FAILED",
                    lastVerified: new Date().toISOString()
                };
                
                report.summary.totalContracts++;
                if (verificationResults[contractName]) {
                    report.summary.verifiedContracts++;
                }
            }
        });

        // Set overall status
        if (report.summary.verifiedContracts === report.summary.totalContracts) {
            report.summary.overallStatus = "ALL_VERIFIED";
        } else if (report.summary.verifiedContracts > 0) {
            report.summary.overallStatus = "PARTIALLY_VERIFIED";
        } else {
            report.summary.overallStatus = "VERIFICATION_FAILED";
        }

        // Save report
        const reportPath = path.join(__dirname, "..", "deployments", `verification-${this.network}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n💾 Verification report saved to: ${reportPath}`);
        
        return report;
    }
}

/**
 * Main verification function
 */
async function main() {
    console.log("🔍 FundFlow - Contract Verification");
    console.log("=".repeat(50));
    
    const verifier = new FundFlowVerifier();
    const verificationResults = {};
    
    try {
        // Load deployment information
        const deploymentInfo = verifier.loadDeploymentInfo();
        
        console.log(`\n📋 Verifying deployment from: ${deploymentInfo.timestamp}`);
        console.log(`📋 Deployment operator: ${deploymentInfo.operator}`);
        
        // Verify each deployed contract
        for (const [contractName, contractInfo] of Object.entries(deploymentInfo.contracts)) {
            if (contractInfo.success) {
                console.log(`\n🔍 Verifying ${contractName}...`);
                
                let contractVerified = false;
                
                if (contractName === "fundflow") {
                    // Verify FundFlow contract
                    const basicVerification = await verifier.verifyFundFlowContract(contractInfo.contractId);
                    const interactionTest = await verifier.testContractInteractions(contractInfo.contractId);
                    const stateVerification = await verifier.verifyContractState(contractInfo.contractId);
                    
                    contractVerified = basicVerification && interactionTest && stateVerification;
                }
                
                verificationResults[contractName] = contractVerified;
                
                if (contractVerified) {
                    console.log(`✅ ${contractName} verification: PASSED`);
                } else {
                    console.log(`❌ ${contractName} verification: FAILED`);
                }
            } else {
                console.log(`⚠️  ${contractName} was not successfully deployed, skipping verification`);
                verificationResults[contractName] = false;
            }
        }
        
        // Generate and save verification report
        const report = verifier.generateReport(deploymentInfo, verificationResults);
        
        // Print summary
        console.log("\n" + "=".repeat(50));
        console.log("📊 VERIFICATION SUMMARY");
        console.log("=".repeat(50));
        console.log(`Total Contracts: ${report.summary.totalContracts}`);
        console.log(`Verified Contracts: ${report.summary.verifiedContracts}`);
        console.log(`Overall Status: ${report.summary.overallStatus}`);
        
        // Print individual contract statuses
        console.log("\n📄 Contract Status:");
        Object.entries(report.contracts).forEach(([name, info]) => {
            const status = info.verificationStatus === "VERIFIED" ? "✅" : "❌";
            console.log(`  ${status} ${name}: ${info.verificationStatus}`);
            console.log(`     Contract ID: ${info.contractId}`);
            console.log(`     Explorer: ${info.explorerUrl || 'N/A'}`);
        });
        
        if (report.summary.overallStatus === "ALL_VERIFIED") {
            console.log("\n🎉 All contracts verified successfully!");
            console.log("\n💡 Next Steps:");
            console.log("1. Your contracts are ready for use");
            console.log("2. Update your frontend/backend with contract addresses");
            console.log("3. Start testing your application");
        } else {
            console.log("\n⚠️  Some contracts failed verification. Please check the logs above.");
            console.log("Consider redeploying failed contracts or investigating the issues.");
        }
        
    } catch (error) {
        console.error("💥 Verification failed:", error);
        process.exit(1);
    }
}

// Execute verification if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = {
    FundFlowVerifier
};
