#!/bin/bash

# FundFlow Smart Contract Deployment Script
# Usage: ./deploy.sh

echo "🚀 FundFlow Smart Contract Deployment"
echo "====================================="

# Load environment variables
if [ -f .env ]; then
    source .env
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found"
    exit 1
fi

# Check wallet balance
echo "📊 Checking wallet balance..."
BALANCE=$(stx balance $STACKS_TESTNET_ADDRESS -t | jq -r '.balance')
echo "Current balance: $BALANCE microSTX"

if [ "$BALANCE" = "0" ]; then
    echo "❌ Insufficient balance for deployment"
    echo "Please get testnet STX from: https://explorer.stacks.co/sandbox/faucet"
    echo "Your address: $STACKS_TESTNET_ADDRESS"
    exit 1
fi

# Deploy contract
echo "🚀 Deploying contract to testnet..."
clarinet deploy --testnet

# Check deployment status
if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully!"
    echo "Contract address: $STACKS_TESTNET_ADDRESS"
    echo "Contract name: $CONTRACT_NAME"
    echo "Network: Stacks Testnet"
    echo ""
    echo "🔗 View on Explorer:"
    echo "https://explorer.stacks.co/txid/CONTRACT_TX_ID?chain=testnet"
else
    echo "❌ Deployment failed"
    exit 1
fi