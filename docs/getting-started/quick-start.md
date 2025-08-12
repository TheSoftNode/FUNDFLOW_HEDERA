# FundFlow Quick Start Guide

## 🚀 Get Started with FundFlow in Minutes

This guide will walk you through setting up FundFlow on your local machine, connecting your wallet, and creating your first campaign or making your first investment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **Git** for cloning the repository
- **MongoDB** 6.0 or higher (for backend)
- **Redis** 6.0 or higher (for caching)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fundflow.git
cd fundflow
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd fundflow-frontend
npm install

# Install smart contract dependencies
cd ../fundflow-smartcontract
npm install

# Install backend dependencies
cd ../fundflow-server
npm install

# Return to root
cd ..
```

### 3. Environment Setup

#### Frontend Environment

```bash
cd fundflow-frontend
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Hedera Network Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your-contract-address

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_HASHPACK_APP_NAME=FundFlow
NEXT_PUBLIC_METAMASK_CHAIN_ID=296

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Smart Contract Environment

```bash
cd fundflow-smartcontract
cp .env.example .env
```

Edit `.env` with your Hedera credentials:

```env
# Hedera Network
HEDERA_NETWORK=testnet

# Operator Account
HEDERA_OPERATOR_ID=your-operator-id
HEDERA_OPERATOR_KEY=your-operator-key

# Contract Deployment
CONTRACT_OWNER_ID=your-owner-id
CONTRACT_OWNER_KEY=your-owner-key
```

#### Backend Environment

```bash
cd fundflow-server
cp .env.example .env
```

Edit `.env` with your backend configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/fundflow
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret

# Hedera Integration
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=your-operator-id
HEDERA_OPERATOR_KEY=your-operator-key
```

## 🚀 Starting the Application

### Option 1: Docker Compose (Recommended)

```bash
# From the root directory
docker-compose up -d
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000
- MongoDB on localhost:27017
- Redis on localhost:6379

### Option 2: Manual Start

```bash
# Terminal 1: Start Backend
cd fundflow-server
npm run dev

# Terminal 2: Start Frontend
cd fundflow-frontend
npm run dev

# Terminal 3: Start Smart Contract Local Network (Optional)
cd fundflow-smartcontract
npx hardhat node
```

## 🔗 Wallet Setup

### 1. Install HashPack Wallet

1. Visit [HashPack.io](https://hashpack.app/)
2. Install the browser extension
3. Create a new account or import existing
4. Switch to Hedera Testnet

### 2. Get Testnet HBAR

1. Visit [Hedera Portal](https://portal.hedera.com/)
2. Create a testnet account
3. Copy your account ID
4. Request testnet HBAR

### 3. Connect Wallet to FundFlow

1. Open http://localhost:3000
2. Click "Connect Wallet" in the navigation
3. Select HashPack from the wallet options
4. Approve the connection in HashPack

## 🎯 First Steps

### For Startups: Create Your First Campaign

1. **Connect Wallet**: Ensure your HashPack wallet is connected
2. **Navigate to Dashboard**: Click "Dashboard" in the navigation
3. **Select Role**: Choose "Startup" when prompted
4. **Create Campaign**: Click "Create New Campaign"
5. **Fill Details**:
   - Title: "My First FundFlow Campaign"
   - Description: "A revolutionary project that will change the world"
   - Funding Goal: 1000 HBAR
   - Duration: 30 days
   - Milestones: 3
6. **Submit**: Click "Create Campaign"

### For Investors: Make Your First Investment

1. **Connect Wallet**: Ensure your HashPack wallet is connected
2. **Browse Campaigns**: Click "Browse Campaigns" in the navigation
3. **Select Campaign**: Choose a campaign that interests you
4. **Review Details**: Read the campaign description and milestones
5. **Invest**: Enter the amount you want to invest (minimum 10 HBAR)
6. **Confirm**: Approve the transaction in your wallet

## 🔍 Verifying Your Setup

### Check Smart Contract Deployment

```bash
cd fundflow-smartcontract
npm run test
```

You should see all tests passing.

### Check Frontend Functionality

1. Visit http://localhost:3000
2. Verify the page loads without errors
3. Test wallet connection
4. Navigate between different pages

### Check Backend API

```bash
curl http://localhost:5000/api/health
```

Should return a health status response.

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Fails

**Problem**: Wallet connection button doesn't respond
**Solution**: 
- Check browser console for errors
- Ensure wallet extension is installed and unlocked
- Verify you're on the correct network (testnet)

#### Smart Contract Tests Fail

**Problem**: `npm run test` shows errors
**Solution**:
- Check environment variables are set correctly
- Ensure Hedera testnet is accessible
- Verify operator account has sufficient HBAR

#### Frontend Build Errors

**Problem**: `npm run dev` fails to start
**Solution**:
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Verify TypeScript configuration

#### Backend Connection Issues

**Problem**: Frontend can't connect to backend
**Solution**:
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Ensure environment variables are set correctly

### Getting Help

If you encounter issues not covered here:

1. **Check the Console**: Browser and terminal logs often contain helpful error messages
2. **Review Environment**: Ensure all environment variables are set correctly
3. **Community Support**: Join our Discord for real-time help
4. **Issue Tracker**: Report bugs on our GitHub repository

## 🎉 Next Steps

Congratulations! You've successfully set up FundFlow. Here's what to explore next:

### For Developers
- [Smart Contract Documentation](../smart-contracts/README.md)
- [Frontend Development Guide](../frontend/README.md)
- [Backend API Reference](../backend/README.md)

### For Users
- [Startup User Guide](../user-guides/startup-guide.md)
- [Investor User Guide](../user-guides/investor-guide.md)
- [Wallet Integration Guide](../integration/wallet-integration.md)

### For Administrators
- [Deployment Guide](../deployment/README.md)
- [Security Architecture](../security/README.md)
- [Production Operations](../deployment/production-operations.md)

---

**Ready to revolutionize startup fundraising?** 🚀

Start building your campaign or exploring investment opportunities on FundFlow!

