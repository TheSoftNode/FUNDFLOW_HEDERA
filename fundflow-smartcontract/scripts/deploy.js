const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting FundFlow deployment to Hedera...");
  
  // Get the network
  const network = hre.network.name;
  console.log(`📡 Network: ${network}`);
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log(`👤 Deployer: ${deployer.address}`);
  
  // Get deployer balance
  const balance = await deployer.getBalance();
  console.log(`💰 Balance: ${hre.ethers.utils.formatEther(balance)} HBAR`);
  
  // Deploy FundFlow contract
  console.log("📄 Deploying FundFlow contract...");
  const FundFlow = await hre.ethers.getContractFactory("FundFlow");
  
  // Deploy with constructor arguments if needed
  const fundFlow = await FundFlow.deploy();
  await fundFlow.deployed();
  
  console.log(`✅ FundFlow deployed to: ${fundFlow.address}`);
  console.log(`🔗 Transaction hash: ${fundFlow.deployTransaction.hash}`);
  
  // Get deployment transaction receipt
  const receipt = await fundFlow.deployTransaction.wait();
  console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
  console.log(`💸 Gas price: ${hre.ethers.utils.formatUnits(receipt.gasPrice || fundFlow.deployTransaction.gasPrice, "gwei")} Gwei`);
  
  // Calculate total cost
  const totalCost = receipt.gasUsed.mul(receipt.gasPrice || fundFlow.deployTransaction.gasPrice);
  console.log(`💰 Total deployment cost: ${hre.ethers.utils.formatEther(totalCost)} HBAR`);
  
  // Save deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: fundFlow.address,
    deployerAddress: deployer.address,
    transactionHash: fundFlow.deployTransaction.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    gasPrice: (receipt.gasPrice || fundFlow.deployTransaction.gasPrice).toString(),
    totalCost: totalCost.toString(),
    deployedAt: new Date().toISOString(),
    contractName: "FundFlow",
  };
  
  // Create config directory if it doesn't exist
  const configDir = path.join(__dirname, "../config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }
  
  // Save deployment info to file
  const deploymentFile = path.join(configDir, `deployment-${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📝 Deployment info saved to: ${deploymentFile}`);
  
  // Verify initial contract state
  console.log("🔍 Verifying initial contract state...");
  
  try {
    const platformFeePercent = await fundFlow.platformFeePercent();
    const nextCampaignId = await fundFlow.getNextCampaignId();
    const contractBalance = await fundFlow.getContractBalance();
    const owner = await fundFlow.owner();
    
    console.log(`├── Platform Fee: ${platformFeePercent.toString()} basis points (${platformFeePercent.toNumber() / 100}%)`);
    console.log(`├── Next Campaign ID: ${nextCampaignId.toString()}`);
    console.log(`├── Contract Balance: ${hre.ethers.utils.formatEther(contractBalance)} HBAR`);
    console.log(`└── Owner: ${owner}`);
    
    console.log("✅ Contract state verified successfully");
  } catch (error) {
    console.error("❌ Error verifying contract state:", error.message);
  }
  
  // Print HashScan links
  if (network.includes('hedera')) {
    const hashscanBase = network.includes('testnet') 
      ? 'https://hashscan.io/testnet' 
      : 'https://hashscan.io/mainnet';
    
    console.log("🔗 HashScan Links:");
    console.log(`├── Contract: ${hashscanBase}/contract/${fundFlow.address}`);
    console.log(`├── Transaction: ${hashscanBase}/transaction/${fundFlow.deployTransaction.hash}`);
    console.log(`└── Deployer: ${hashscanBase}/account/${deployer.address}`);
  }
  
  console.log("🎉 Deployment completed successfully!");
  
  // Return deployment info for use in scripts
  return {
    contract: fundFlow,
    address: fundFlow.address,
    deploymentInfo
  };
}

// Run the deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;