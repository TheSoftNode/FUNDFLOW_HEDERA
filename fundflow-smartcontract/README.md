# FundFlow - Smart Contracts

This directory contains the smart contracts for FundFlow, a blockchain-based fundraising platform built on Hedera Hashgraph.

## 📚 Documentation

**Complete documentation is available in the [`docs/`](./docs/) directory:**

- **[📖 Documentation Hub](./docs/README.md)** - Complete documentation index
- **[🚀 Quick Start Guide](./docs/quick-start.md)** - Get started in 5 minutes
- **[⚙️ Installation Guide](./docs/installation.md)** - Detailed setup instructions
- **[🏗️ Architecture Overview](./docs/architecture.md)** - System design and components
- **[📄 Smart Contract Guide](./docs/smart-contracts/overview.md)** - Contract architecture
- **[🌐 Hedera Setup](./docs/hedera/setup.md)** - Hedera integration guide

## 🏗️ Architecture

### Core Contracts

- **FundFlow.sol** - Main contract implementing fundraising, milestone management, and governance
- **Interfaces/** - Contract interfaces for modular development
- **Libraries/** - Reusable libraries for campaign, investment, and milestone logic
- **Governance/** - Advanced governance mechanisms (coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn package manager
- Hedera testnet account with HBAR balance
- Git for version control

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your Hedera account details
   ```

3. **Compile contracts**

   ```bash
   npm run compile
   ```

4. **Run project setup validation**
   ```bash
   npm run setup
   ```

## 📋 Available Scripts

### Development Commands

```bash
# Compile smart contracts
npm run compile

# Run tests
npm run test

# Clean build artifacts
npm run clean

# Check contract sizes
npm run size

# Generate gas usage report
npm run gas-report

# Run security linting
npm run lint
npm run lint:fix
```

### Deployment Commands

```bash
# Deploy to testnet (default)
npm run deploy

# Deploy to specific networks
npm run deploy:testnet
npm run deploy:mainnet
npm run deploy:previewnet

# Verify deployed contracts
npm run verify

# Validate project setup
npm run setup
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with:

```env
# Hedera Network Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
HEDERA_PRIVATE_KEY=YOUR_PRIVATE_KEY

# Contract addresses (auto-populated after deployment)
CONTRACT_FUNDFLOW=
CONTRACT_CAMPAIGNMANAGER=
CONTRACT_INVESTMENTMANAGER=
CONTRACT_MILESTONEMANAGER=

# Optional: API Keys for additional services
GROQ_API_KEY=your_groq_key
```

### Network Configuration

The project supports multiple Hedera networks:

- **Testnet** (default): For development and testing
- **Mainnet**: For production deployment
- **Previewnet**: For preview features

## 📦 Deployment Process

### Step 1: Prepare Environment

1. Get a Hedera account from [portal.hedera.com](https://portal.hedera.com/)
2. Fund your account with testnet HBAR
3. Update `.env` with your account details

### Step 2: Validate Setup

```bash
npm run setup
```

This will:

- Validate your Hedera connection
- Check project structure
- Verify contract compilation
- Create missing environment files

### Step 3: Deploy Contracts

```bash
npm run deploy
```

The deployment script will:

- Deploy FundFlow contract
- Configure initial permissions
- Update environment files with contract addresses
- Save deployment info to `deployments/{network}.json`

### Step 4: Verify Deployment

```bash
npm run verify
```

This will:

- Test contract functionality
- Verify contract state
- Display HashScan explorer links
- Generate verification report

## 🏅 FundFlow Contract

### Features

- **Campaign Management**: Create and manage fundraising campaigns
- **Investment Tracking**: Track investments and investor ownership
- **Milestone System**: Milestone-based fund release with voting
- **Governance**: Investor voting on milestone completion
- **Fee Management**: Platform fee collection and management

### Key Functions

```solidity
// Create new campaign
function createCampaign(
    string memory title,
    string memory description,
    uint256 targetAmount,
    uint256 durationDays
) external returns (uint256)

// Invest in campaign
function investInCampaign(uint256 campaignId) external payable

// Add milestone to campaign
function addMilestone(
    uint256 campaignId,
    string memory title,
    string memory description,
    uint256 targetAmount,
    uint256 votingDurationDays
) external returns (uint256)

// Vote on milestone
function voteOnMilestone(
    uint256 campaignId,
    uint256 milestoneId,
    bool voteFor
) external

// Release milestone funds
function releaseMilestoneFunds(
    uint256 campaignId,
    uint256 milestoneId
) external
```

## 🔍 Testing

### Run Test Suite

```bash
npm run test
```

### Test Coverage

```bash
npm run coverage
```

### Gas Usage Analysis

```bash
npm run gas-report
```

## 📊 Deployment Tracking

Deployment information is automatically saved to:

- `deployments/{network}.json` - Detailed deployment data
- Environment files are updated with contract addresses
- Transaction IDs and explorer links are logged

### Sample Deployment Output

```json
{
  "network": "testnet",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "operator": "0.0.1234567",
  "contracts": {
    "fundflow": {
      "contractId": "0.0.2345678",
      "transactionId": "0.0.1234567@1705321800.123456789",
      "explorerUrl": "https://hashscan.io/testnet/contract/0.0.2345678"
    }
  }
}
```

## 🛡️ Security

### Security Features

- **Access Control**: Role-based permissions using OpenZeppelin
- **Reentrancy Protection**: Guards on all external calls
- **Pause Mechanism**: Emergency stop functionality
- **Input Validation**: Comprehensive parameter checking

### Security Best Practices

- All contracts use OpenZeppelin security libraries
- Extensive test coverage for edge cases
- Gas optimization without compromising security
- Regular security audits recommended

## 🔧 Advanced Configuration

### Hardhat Configuration

The `hardhat.config.js` includes:

- Hedera network definitions
- Gas optimization settings
- Contract size monitoring
- Test configuration

### Custom Hedera Settings

```javascript
hedera: {
  network: "testnet",
  accountId: process.env.HEDERA_ACCOUNT_ID,
  privateKey: process.env.HEDERA_PRIVATE_KEY,
  maxTransactionFee: "20", // HBAR
  maxQueryPayment: "1",   // HBAR
}
```

## 🔗 Integration

### Backend Integration

Contract addresses are automatically updated in:

- Root `.env` file
- `../fundflow-server/.env` file (if exists)
- `../fundflow-frontend/.env.local` file (if exists)

### Frontend Integration

Use the deployed contract addresses in your frontend:

```javascript
const FUNDFLOW_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_FUNDFLOW;
```

## 📚 Resources

- [Hedera Documentation](https://docs.hedera.com/)
- [Hedera SDK for JavaScript](https://github.com/hashgraph/hedera-sdk-js)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🐛 Troubleshooting

### Common Issues

#### "Insufficient Account Balance"

- **Solution**: Fund your Hedera account with more HBAR
- **Get testnet HBAR**: [portal.hedera.com](https://portal.hedera.com/)

#### "Contract artifact not found"

- **Solution**: Run `npm run compile` to compile contracts
- **Check**: Ensure contract files exist in the correct location

#### "Connection failed"

- **Solution**: Verify your `HEDERA_ACCOUNT_ID` and `HEDERA_PRIVATE_KEY`
- **Check**: Ensure you're using the correct network (testnet/mainnet)

#### "Deployment failed"

- **Solution**: Check gas limits and transaction fees
- **Verify**: Account has sufficient HBAR balance
- **Try**: Increase gas limit in deployment script

### Debug Mode

Enable debug logging:

```bash
DEBUG=true npm run deploy
```

### Support

- Check existing [GitHub Issues](https://github.com/TheSoftNode/FUNDFLOW_HEDERA/issues)
- Review [Hedera Discord](https://discord.gg/hedera)
- Read project documentation in `../docs/`

## 📈 Contract Architecture

### Directory Structure

```
contracts/
├── core/
│   └── FundFlow.sol           # Main contract
├── interfaces/
│   ├── IFundFlow.sol          # Main interface
│   ├── ICampaignManager.sol   # Campaign management
│   ├── IInvestmentManager.sol # Investment tracking
│   └── IMilestoneManager.sol  # Milestone management
├── libraries/
│   ├── CampaignLibrary.sol    # Campaign utilities
│   ├── InvestmentLibrary.sol  # Investment calculations
│   └── MilestoneLibrary.sol   # Milestone voting logic
├── governance/
│   └── (future governance contracts)
└── test/
    └── (test contracts)
```

### Library Functions

#### CampaignLibrary

- Campaign parameter validation
- Progress calculations
- Status checks

#### InvestmentLibrary

- Fee calculations
- Ownership percentages
- Risk assessments

#### MilestoneLibrary

- Voting mechanics
- Consensus calculations
- Approval thresholds

## 🚀 Future Enhancements

1. **Advanced Governance**

   - Proposal system
   - Voting delegation
   - Governance tokens

2. **Enhanced Security**

   - Multi-signature support
   - Time locks
   - Emergency mechanisms

3. **DeFi Integration**

   - Yield farming
   - Liquidity pools
   - Token staking

4. **Analytics**
   - Performance metrics
   - Investment analytics
   - Risk scoring

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**Happy Building! 🚀**

_Building the future of fundraising, one smart contract at a time._
