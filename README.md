# FundFlow

**Transparent Startup Fundraising Platform on Stacks Blockchain**

FundFlow revolutionizes startup fundraising by providing transparent, milestone-based funding with automated equity distribution and investor governance through smart contracts. Built on the Stacks blockchain with Bitcoin-level security.

## Key Features

### For Startups

- **Transparent Fundraising** - Create campaigns with clear funding goals and public timelines
- **Milestone-Based Releases** - Access funds only after achieving verified milestones through community voting
- **Automated Equity Distribution** - Proportional equity tokens distributed automatically to investors
- **Global Reach** - Accept investments from anywhere using STX tokens
- **AI-Powered Insights** - Get intelligent recommendations for campaign optimization

### For Investors

- **Investment Transparency** - Real-time visibility into fund usage and project progress
- **Governance Rights** - Vote on milestone completion before fund releases using weighted voting
- **Portfolio Analytics** - Advanced tracking with AI-powered performance insights
- **Risk Mitigation** - Community-driven milestone approval reduces investment risk
- **Diversification Tools** - Smart portfolio optimization recommendations

### Platform Benefits

- **Decentralized Security** - Core operations secured by Bitcoin through Stacks consensus
- **2.5% Platform Fee** - Sustainable and transparent revenue model
- **Compliance Ready** - Built-in transparency aids regulatory compliance
- **AI Integration** - Machine learning for fraud detection and recommendations

## Architecture Overview

FundFlow is built as a hybrid decentralized application with multiple layers:

**Frontend Layer**

- Next.js 15 with TypeScript for type-safe development
- Tailwind CSS for responsive design
- Stacks.js for blockchain integration
- Real-time updates via WebSocket connections

**Backend Layer**

- Node.js with Express for API services
- MongoDB for flexible data persistence and analytics
- Redis for caching and session management
- Background job processing for blockchain synchronization

**Smart Contract Layer**

- Clarity smart contracts on Stacks blockchain
- Bitcoin-secured consensus mechanism
- Formal verification capabilities
- Automated governance and fund management

**AI/ML Layer**

- TensorFlow.js for client-side inference
- Python-based models for complex analytics
- Real-time fraud detection and risk assessment
- Personalized investment recommendations

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Stacks.js
- **Backend**: Node.js, Express, MongoDB, Redis, Socket.io
- **Smart Contracts**: Clarity language on Stacks blockchain
- **AI/ML**: TensorFlow.js, Python TensorFlow/PyTorch, scikit-learn
- **Testing**: Vitest (smart contracts), Jest (backend), Playwright (E2E)
- **Development**: Clarinet, Docker, ESLint, Prettier
- **Deployment**: Docker Compose, Kubernetes, Vercel

## Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher
- Redis 6 or higher
- Clarinet for smart contract development
- Stacks wallet for testing

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fundflow.git
cd fundflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Configure your environment variables in .env.local
# MONGODB_URI="mongodb://localhost:27017/fundflow"
# REDIS_URL="redis://localhost:6379"
# STACKS_NETWORK="testnet"
# JWT_SECRET="your-super-secret-jwt-key"

# Start with Docker Compose (recommended)
docker-compose up -d

# Or start services manually
npm run db:seed
npm run dev
```

Visit http://localhost:3000 to see the application.

### Smart Contract Setup

```bash
# Navigate to contracts directory
cd contracts

# Check contract syntax
clarinet check

# Run contract tests with Vitest
npm run test:contracts

# Deploy to testnet
clarinet deploy --testnet

# For mainnet deployment
clarinet deploy --mainnet
```

## Smart Contract Usage

### Creating a Campaign

```clarity
(contract-call? .fundflow create-campaign
    u"Revolutionary AI Startup"
    u"Building the next generation of AI tools for developers"
    u10000000000  ;; 10,000 STX funding goal
    u8640         ;; 60 days duration (in blocks)
    u5)           ;; 5 milestones
```

### Making an Investment

```clarity
(contract-call? .fundflow invest-in-campaign
    u1            ;; Campaign ID
    u1000000000)  ;; 1,000 STX investment amount
```

### Creating Milestones

```clarity
(contract-call? .fundflow create-milestone
    u1               ;; Campaign ID
    u1               ;; Milestone ID
    u"MVP Development"
    u"Complete minimum viable product with core features"
    u25              ;; 25% of funds to release
    u1440)           ;; 10 days voting period
```

### Voting on Milestones

```clarity
(contract-call? .fundflow vote-on-milestone
    u1     ;; Campaign ID
    u1     ;; Milestone ID
    true)  ;; Vote: true = approve, false = reject
```

### Completing Milestones

```clarity
(contract-call? .fundflow complete-milestone
    u1     ;; Campaign ID
    u1)    ;; Milestone ID
```

## Development

### Project Structure

```
fundflow/
├── contracts/           # Clarity smart contracts
│   ├── fundflow.clar   # Main contract
│   └── tests/          # Vitest contract tests
├── src/
│   ├── components/     # React components
│   ├── pages/          # Next.js pages and API routes
│   ├── lib/            # Utilities and blockchain integration
│   ├── styles/         # CSS and styling
│   ├── hooks/          # Custom React hooks
│   │   └── useWallet.tsx # Wallet management hook
├── server/             # Backend API services
│   ├── routes/         # API endpoints
│   ├── models/         # MongoDB models
│   └── services/       # Business logic
├── ai/                 # AI/ML models and services
├── tests/              # Playwright E2E tests
└── __tests__/          # Jest unit tests
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run test            # Run all tests
npm run test:contracts  # Run Vitest smart contract tests
npm run test:e2e        # Run Playwright end-to-end tests
npm run test:unit       # Run Jest unit tests
npm run test:api        # Run backend API tests
npm run lint            # Run ESLint
npm run db:seed         # Seed MongoDB with test data
```

## Database Schema (MongoDB)

### Campaign Document Structure

```javascript
{
  _id: ObjectId,
  campaignId: 1,
  founder: "ST1234567890ABCDEF",
  title: "Revolutionary AI Startup",
  description: "Building next-gen AI tools",
  fundingGoal: 10000000000,
  totalRaised: 5000000000,
  deadline: ISODate("2025-03-15"),
  active: true,
  completed: false,
  milestoneCount: 5,
  createdAt: ISODate,
  updatedAt: ISODate,
  investments: [
    {
      investor: "ST0987654321ABCDEF",
      amount: 1000000000,
      timestamp: ISODate,
      equityTokens: 1000,
      transactionHash: "0x123..."
    }
  ],
  milestones: [
    {
      milestoneId: 1,
      title: "MVP Development",
      description: "Complete minimum viable product",
      fundingPercentage: 25,
      completed: false,
      votesFor: 750,
      votesAgainst: 250,
      votingDeadline: ISODate,
      fundsReleased: false,
      votes: [
        {
          voter: "ST0987654321",
          vote: true,
          timestamp: ISODate,
          votingPower: 500
        }
      ]
    }
  ],
  stats: {
    totalInvestors: 15,
    averageInvestment: 666666667,
    lastUpdate: ISODate
  }
}
```

### User Portfolio Document

```javascript
{
  _id: ObjectId,
  userAddress: "ST0987654321ABCDEF",
  totalInvested: 5000000000,
  activeCampaigns: 3,
  totalReturns: 1500000000,
  investments: [
    {
      campaignId: 1,
      amount: 1000000000,
      equityTokens: 1000,
      timestamp: ISODate,
      currentValue: 1200000000
    }
  ],
  aiProfile: {
    riskTolerance: "moderate",
    preferredSectors: ["AI", "Blockchain", "FinTech"],
    investmentPattern: "conservative",
    lastRecommendationUpdate: ISODate
  }
}
```

## Security Features

**Smart Contract Security**

- Formal verification with Clarity language
- Access control with role-based permissions
- Reentrancy protection built into Clarity
- Input validation for all parameters
- Emergency pause functionality

**Backend Security**

- JWT authentication with wallet signature verification
- Rate limiting to prevent API abuse
- MongoDB injection protection with parameterized queries
- CORS configuration for secure cross-origin requests
- Encryption for sensitive data

**AI Security**

- Model protection against adversarial attacks
- Privacy-preserving analytics with differential privacy
- Bias detection and mitigation in recommendation systems
- Secure model serving with input validation

## AI & Machine Learning Features

**Investment Recommendations**

- Collaborative filtering based on user investment behavior
- Content-based filtering using campaign characteristics
- Hybrid recommendation system combining multiple approaches
- Real-time adaptation to market conditions and user preferences

**Risk Assessment**

- Founder credibility scoring using on-chain transaction history
- Campaign risk evaluation based on multiple technical and market factors
- Market risk analysis incorporating macroeconomic indicators
- Technical risk assessment for smart contract implementations

**Fraud Detection**

- Real-time anomaly detection using isolation forests and autoencoders
- Behavioral pattern analysis for identifying suspicious investment activity
- Network analysis for detecting Sybil attacks and coordinated manipulation
- Cross-platform behavior correlation for comprehensive fraud prevention

**Portfolio Optimization**

- Modern Portfolio Theory implementation for risk-return optimization
- Dynamic rebalancing recommendations based on market conditions
- Risk-adjusted performance analytics and benchmarking
- Diversification scoring and investment allocation suggestions

## Testing

### Smart Contract Tests (Vitest)

```bash
# Run all contract tests
npm run test:contracts

# Run specific test suite
npm run test:contracts -- --run campaigns

# Watch mode for development
npm run test:contracts -- --watch

# Generate coverage report
npm run test:contracts -- --coverage
```

Example test structure:

```javascript
import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

describe("FundFlow Campaign Tests", () => {
  beforeEach(() => {
    simnet.mineEmptyBlocks(1);
  });

  it("should create campaign successfully", () => {
    const result = simnet.callPublicFn(
      "fundflow",
      "create-campaign",
      [
        Cl.stringUtf8("Test Campaign"),
        Cl.stringUtf8("Test Description"),
        Cl.uint(10000000000),
        Cl.uint(8640),
        Cl.uint(5),
      ],
      founder1
    );
    expect(result.result).toBeOk(Cl.uint(1));
  });
});
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e tests/campaign-flow.spec.ts

# Generate test report
npm run test:e2e -- --reporter=html
```

Example E2E test:

```javascript
import { test, expect } from "@playwright/test";

test("complete campaign creation and investment flow", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Connect wallet
  await page.click('[data-testid="connect-wallet"]');

  // Create campaign
  await page.click('[data-testid="create-campaign"]');
  await page.fill('[data-testid="campaign-title"]', "Test Campaign");
  await page.fill('[data-testid="funding-goal"]', "10000");
  await page.click('[data-testid="submit-campaign"]');

  // Verify campaign creation
  await expect(page.locator('[data-testid="campaign-success"]')).toBeVisible();
});
```

### Unit Tests (Jest)

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:unit -- --coverage

# Watch mode
npm run test:unit -- --watch
```

### API Tests

```bash
# Run API integration tests
npm run test:api

# Test specific endpoint
npm run test:api -- --grep "campaign creation"
```

## Deployment

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fundflow_prod
REDIS_URL=redis://redis:6379
STACKS_NETWORK=mainnet
STACKS_API_URL=https://stacks-node-api.mainnet.stacks.co
JWT_SECRET=your-production-jwt-secret
PLATFORM_FEE=250  # 2.5%
```

### Docker Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Check deployment status
docker-compose ps

# View logs
docker-compose logs -f
```

### Manual Deployment

```bash
# Build the application
npm run build

# Seed MongoDB
npm run db:seed

# Start production server
npm start

# Start background workers
npm run workers
```

## Key Smart Contract Functions

### Read-Only Functions

- `get-campaign-details(campaign-id)` - Retrieve complete campaign information
- `get-investment-details(campaign-id, investor)` - Get specific investment data
- `get-investor-portfolio(investor)` - View investor's complete portfolio
- `get-milestone-details(campaign-id, milestone-id)` - Milestone information and voting status
- `calculate-milestone-approval-rate(campaign-id, milestone-id)` - Real-time voting results

### Public Functions

- `create-campaign()` - Initialize new fundraising campaign
- `invest-in-campaign()` - Process STX investments with automatic fee calculation
- `create-milestone()` - Define project milestones with funding allocation
- `vote-on-milestone()` - Participate in milestone governance
- `complete-milestone()` - Release funds upon milestone approval

### Administrative Functions

- `set-platform-fee()` - Adjust platform fee percentage (owner only)
- `toggle-pause()` - Emergency pause functionality
- `withdraw-platform-fees()` - Collect platform revenue
- `emergency-close-campaign()` - Administrative campaign intervention

## Configuration

### Platform Settings

```javascript
const PLATFORM_CONFIG = {
  FEE_PERCENTAGE: 250, // 2.5% platform fee
  MIN_CAMPAIGN_GOAL: 1000, // Minimum 1,000 STX
  MAX_CAMPAIGN_GOAL: 1000000, // Maximum 1M STX
  MIN_CAMPAIGN_DURATION: 1440, // 10 days minimum
  MAX_CAMPAIGN_DURATION: 8640, // 60 days maximum
  MAX_MILESTONES: 10, // Maximum milestones per campaign
  VOTING_PERIOD: 1440, // 10 days voting period
  APPROVAL_THRESHOLD: 51, // 51% approval required
};
```

### MongoDB Configuration

```javascript
// MongoDB connection with options
const mongoConfig = {
  uri: process.env.MONGODB_URI,
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

// Indexes for performance
db.campaigns.createIndex({ campaignId: 1 }, { unique: true });
db.campaigns.createIndex({ founder: 1 });
db.campaigns.createIndex({ active: 1, deadline: 1 });
db.portfolios.createIndex({ userAddress: 1 }, { unique: true });
```

## Contributing

We welcome contributions from the community! Here's how you can contribute:

### Development Process

1. Fork the repository and create your feature branch
2. Make your changes with appropriate tests
3. Ensure all tests pass and code follows our style guidelines
4. Submit a pull request with a clear description of changes

### Code Style

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Roadmap

### Phase 1 - Foundation (Q1 2025)

- Core smart contract functionality
- Basic web interface for campaigns and investments
- Wallet integration and authentication
- Milestone creation and voting system

### Phase 2 - AI Integration (Q2 2025)

- Investment recommendation engine
- Fraud detection and risk assessment
- Portfolio optimization algorithms
- Advanced analytics dashboard

### Phase 3 - Enhanced Features (Q3 2025)

- Mobile applications for iOS and Android
- Advanced governance features
- Cross-chain bridge integration
- Institutional investor tools

### Phase 4 - Scale & Compliance (Q4 2025)

- Mainnet launch with full security audits
- Regulatory compliance framework
- Enterprise-grade features
- Global market expansion
# FUNDFLOW_HEDERA
