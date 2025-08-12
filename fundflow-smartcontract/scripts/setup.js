const {
    Client,
    PrivateKey,
    AccountId
} = require("@hashgraph/sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Setup script for FundFlow
 * This script helps with initial configuration and validation
 */

class FundFlowSetup {
    constructor() {
        this.rootPath = path.join(__dirname, "..", "..");
    }

    /**
     * Validate environment configuration
     */
    async validateEnvironment() {
        console.log("🔍 Validating environment configuration...\n");

        // Check for required environment variables
        const requiredVars = [
            'HEDERA_NETWORK',
            'HEDERA_ACCOUNT_ID', 
            'HEDERA_PRIVATE_KEY'
        ];

        const missing = [];
        requiredVars.forEach(varName => {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        });

        if (missing.length > 0) {
            console.error("❌ Missing required environment variables:");
            missing.forEach(varName => {
                console.error(`   - ${varName}`);
            });
            console.error("\nPlease copy .env.example to .env and fill in your Hedera account details.");
            console.error("You can get a Hedera testnet account at: https://portal.hedera.com/");
            return false;
        }

        // Validate Hedera connection
        try {
            const network = process.env.HEDERA_NETWORK || "testnet";
            const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
            
            let privateKey;
            try {
                privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
            } catch (error) {
                // Try different formats
                if (process.env.HEDERA_PRIVATE_KEY.startsWith("0x")) {
                    privateKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY.slice(2));
                } else {
                    privateKey = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);
                }
            }

            let client;
            if (network === "mainnet") {
                client = Client.forMainnet();
            } else if (network === "previewnet") {
                client = Client.forPreviewnet();
            } else {
                client = Client.forTestnet();
            }

            client.setOperator(accountId, privateKey);

            // Test connection by getting account balance
            const balance = await client.getAccountBalance(accountId);
            
            console.log("✅ Hedera connection validated successfully!");
            console.log(`   Network: ${network}`);
            console.log(`   Account: ${accountId.toString()}`);
            console.log(`   Balance: ${balance.hbars.toString()}`);

            client.close();
            return true;

        } catch (error) {
            console.error("❌ Hedera connection failed:", error.message);
            console.error("\nPlease check your HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY in .env file.");
            return false;
        }
    }

    /**
     * Check project structure and dependencies
     */
    async checkProjectStructure() {
        console.log("\n🏗️  Checking project structure...\n");

        const requiredDirs = [
            'fundflow-smartcontract',
            'fundflow-frontend',
            'fundflow-server'
        ];

        const optionalDirs = [
            'docs',
            'scripts'
        ];

        // Check required directories
        let allGood = true;
        requiredDirs.forEach(dir => {
            const dirPath = path.join(this.rootPath, dir);
            if (fs.existsSync(dirPath)) {
                console.log(`✅ ${dir}/ directory exists`);
            } else {
                console.error(`❌ ${dir}/ directory missing`);
                allGood = false;
            }
        });

        // Check optional directories
        optionalDirs.forEach(dir => {
            const dirPath = path.join(this.rootPath, dir);
            if (fs.existsSync(dirPath)) {
                console.log(`✅ ${dir}/ directory exists`);
            } else {
                console.log(`⚠️  ${dir}/ directory missing (optional)`);
            }
        });

        return allGood;
    }

    /**
     * Check smart contract compilation
     */
    async checkContractCompilation() {
        console.log("\n🔧 Checking smart contract compilation...\n");

        const artifactsPath = path.join(__dirname, "..", "artifacts");
        
        if (!fs.existsSync(artifactsPath)) {
            console.log("⚠️  Contracts not compiled yet");
            console.log("   Run: npm run compile");
            return false;
        }

        // Check for specific contract artifacts
        const contractChecks = [
            "core/FundFlow.sol",
            "interfaces/IFundFlow.sol",
            "libraries/CampaignLibrary.sol",
            "libraries/InvestmentLibrary.sol",
            "libraries/MilestoneLibrary.sol"
        ];

        let foundContracts = 0;
        contractChecks.forEach(contractPath => {
            const contractName = path.basename(contractPath, '.sol');
            const artifactPath = path.join(artifactsPath, "contracts", contractPath, `${contractName}.json`);
            
            if (fs.existsSync(artifactPath)) {
                console.log(`✅ ${contractName} compiled successfully`);
                foundContracts++;
            }
        });

        if (foundContracts === 0) {
            console.log("❌ No contract artifacts found");
            console.log("   Run: npm run compile");
            return false;
        }

        console.log(`\n✅ Found ${foundContracts} compiled contract(s)`);
        return true;
    }

    /**
     * Create missing environment files
     */
    async createEnvironmentFiles() {
        console.log("\n📝 Setting up environment files...\n");

        // Smart contract .env file
        const contractEnvPath = path.join(__dirname, "..", ".env");
        const contractEnvExamplePath = path.join(__dirname, "..", ".env.example");
        
        if (!fs.existsSync(contractEnvPath) && fs.existsSync(contractEnvExamplePath)) {
            fs.copyFileSync(contractEnvExamplePath, contractEnvPath);
            console.log("✅ Created smart contract .env file from .env.example");
            console.log("   Please update .env with your Hedera account details");
        }

        // Frontend .env.local file
        const frontendDir = path.join(this.rootPath, "fundflow-frontend");
        if (fs.existsSync(frontendDir)) {
            const frontendEnvPath = path.join(frontendDir, ".env.local");
            const frontendEnvExamplePath = path.join(frontendDir, ".env.local.example");
            
            if (!fs.existsSync(frontendEnvPath)) {
                if (fs.existsSync(frontendEnvExamplePath)) {
                    fs.copyFileSync(frontendEnvExamplePath, frontendEnvPath);
                    console.log("✅ Created frontend/.env.local file");
                } else {
                    // Create basic frontend env file
                    const frontendEnvContent = `# FundFlow Frontend Environment Variables
# These will be auto-populated after contract deployment

NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_FUNDFLOW=
NEXT_PUBLIC_HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
`;
                    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
                    console.log("✅ Created frontend/.env.local file");
                }
            }
        }

        // Server .env file
        const serverDir = path.join(this.rootPath, "fundflow-server");
        if (fs.existsSync(serverDir)) {
            const serverEnvPath = path.join(serverDir, ".env");
            const serverEnvExamplePath = path.join(serverDir, ".env.example");
            
            if (!fs.existsSync(serverEnvPath)) {
                if (fs.existsSync(serverEnvExamplePath)) {
                    fs.copyFileSync(serverEnvExamplePath, serverEnvPath);
                    console.log("✅ Created server/.env file");
                } else {
                    // Create basic server env file
                    const serverEnvContent = `# FundFlow Server Environment Variables
# These will be auto-populated after contract deployment

NODE_ENV=development
PORT=3001

# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=
HEDERA_PRIVATE_KEY=

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fundflow
DATABASE_URL=mongodb://localhost:27017/fundflow

# Contract Addresses (auto-populated)
CONTRACT_FUNDFLOW=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
`;
                    fs.writeFileSync(serverEnvPath, serverEnvContent);
                    console.log("✅ Created server/.env file");
                }
            }
        }
    }

    /**
     * Check Node.js dependencies
     */
    async checkDependencies() {
        console.log("\n📦 Checking dependencies...\n");

        const packageJsonPath = path.join(__dirname, "..", "package.json");
        
        if (!fs.existsSync(packageJsonPath)) {
            console.error("❌ package.json not found");
            return false;
        }

        const nodeModulesPath = path.join(__dirname, "..", "node_modules");
        
        if (!fs.existsSync(nodeModulesPath)) {
            console.log("⚠️  Node modules not installed");
            console.log("   Run: npm install");
            return false;
        }

        // Check for key dependencies
        const keyDependencies = [
            "@hashgraph/sdk",
            "@openzeppelin/contracts",
            "hardhat",
            "dotenv"
        ];

        let allInstalled = true;
        keyDependencies.forEach(dep => {
            const depPath = path.join(nodeModulesPath, dep);
            if (fs.existsSync(depPath)) {
                console.log(`✅ ${dep} installed`);
            } else {
                console.error(`❌ ${dep} not installed`);
                allInstalled = false;
            }
        });

        return allInstalled;
    }

    /**
     * Display deployment readiness status
     */
    displayDeploymentStatus(envValid, structureValid, contractsCompiled, depsInstalled) {
        console.log("\n" + "=".repeat(50));
        console.log("🚀 DEPLOYMENT READINESS STATUS");
        console.log("=".repeat(50));

        console.log(`Environment Configuration: ${envValid ? '✅ Ready' : '❌ Not Ready'}`);
        console.log(`Project Structure: ${structureValid ? '✅ Ready' : '❌ Not Ready'}`);
        console.log(`Dependencies: ${depsInstalled ? '✅ Installed' : '❌ Missing'}`);
        console.log(`Smart Contracts: ${contractsCompiled ? '✅ Compiled' : '⚠️  Need Compilation'}`);

        if (envValid && structureValid && contractsCompiled && depsInstalled) {
            console.log("\n🎉 Ready for deployment!");
            console.log("\nNext steps:");
            console.log("1. Run: npm run deploy");
            console.log("2. Start backend: cd ../fundflow-server && npm run dev");
            console.log("3. Start frontend: cd ../fundflow-frontend && npm run dev");
        } else {
            console.log("\n⚠️  Please resolve the issues above before deployment.");
            
            if (!envValid) {
                console.log("\n📋 Environment Setup:");
                console.log("1. Get a Hedera testnet account: https://portal.hedera.com/");
                console.log("2. Copy .env.example to .env");
                console.log("3. Add your HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY");
            }
            
            if (!depsInstalled) {
                console.log("\n📋 Dependencies:");
                console.log("1. npm install");
            }
            
            if (!contractsCompiled) {
                console.log("\n📋 Contract Compilation:");
                console.log("1. npm run compile");
            }
        }
        
        console.log("\n📚 Documentation:");
        console.log("- Project README: ../../README.md");
        console.log("- Smart Contract README: ../README.md");
        console.log("- Hedera Docs: https://docs.hedera.com/");
        console.log("- FundFlow Docs: Coming soon!");
    }
}

/**
 * Main setup function
 */
async function main() {
    console.log("🌟 FundFlow - Project Setup & Validation");
    console.log("=".repeat(50));
    
    const setup = new FundFlowSetup();
    
    try {
        // Create missing environment files first
        await setup.createEnvironmentFiles();
        
        // Check dependencies
        const depsInstalled = await setup.checkDependencies();
        
        // Validate environment
        const envValid = await setup.validateEnvironment();
        
        // Check project structure
        const structureValid = await setup.checkProjectStructure();
        
        // Check contract compilation
        const contractsCompiled = await setup.checkContractCompilation();
        
        // Display final status
        setup.displayDeploymentStatus(envValid, structureValid, contractsCompiled, depsInstalled);
        
    } catch (error) {
        console.error("💥 Setup failed:", error);
        process.exit(1);
    }
}

// Execute setup if called directly
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = {
    FundFlowSetup
};
