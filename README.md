# FundFlow - Blockchain-Powered Startup Fundraising Platform

**FundFlow** is a revolutionary decentralized fundraising platform that leverages **Hedera Hashgraph** blockchain technology to create transparent, milestone-based investment opportunities for startups and investors. Built with Next.js and modern web technologies, FundFlow eliminates traditional fundraising barriers by providing a secure, automated, and transparent investment ecosystem.

## 🚀 Key Features

### 🏢 **For Startups**
- **Milestone-Based Fundraising**: Release funds progressively as milestones are achieved
- **Smart Contract Automation**: Automated fund distribution based on milestone completion
- **Investor Voting System**: Community-driven milestone approval process
- **Transparent Campaign Management**: Real-time tracking of fundraising progress
- **Multi-Wallet Support**: Connect with HashPack, MetaMask, and WalletConnect
- **Comprehensive Dashboard**: Campaign management, investor tracking, and analytics
- **Milestone Management**: Create, track, and manage project milestones
- **Payment Processing**: Automated payment distribution and tracking

### 💰 **For Investors**
- **Portfolio Management**: Track investments across multiple startups
- **Milestone Monitoring**: Real-time updates on project progress
- **Voting Rights**: Participate in milestone approval decisions
- **Risk Assessment**: Comprehensive due diligence tools
- **Performance Analytics**: Detailed ROI and investment tracking
- **Investment Discovery**: Browse and filter startup opportunities
- **Portfolio Analytics**: Performance metrics and risk analysis
- **Community Features**: Connect with other investors and startups

### 🔒 **Blockchain Security**
- **Hedera Hashgraph Integration**: Enterprise-grade blockchain security
- **Smart Contract Automation**: Trustless milestone verification
- **Transparent Transactions**: All activities recorded on-chain
- **Multi-Signature Wallets**: Enhanced security for fund management

## 🏗️ Architecture Overview

FundFlow is built as a modern, scalable decentralized application with multiple layers:

### **Frontend Layer**
- **Next.js 15** with TypeScript for type-safe development
- **Tailwind CSS** for responsive, modern design
- **Hedera SDK** for blockchain integration
- **Multi-wallet support** (HashPack, MetaMask, WalletConnect)
- **Real-time updates** via WebSocket connections
- **Responsive Dashboard**: Adaptive layouts for all screen sizes
- **Dark/Light Theme**: User preference-based theming system

### **Backend Layer**
- **Node.js** with Express for API services
- **MongoDB** for flexible data persistence and analytics
- **Redis** for caching and session management
- **Background job processing** for blockchain synchronization
- **Hedera integration** for transaction processing
- **Comprehensive API**: RESTful endpoints for all platform features
- **Authentication System**: JWT-based secure user authentication
- **Real-time Notifications**: WebSocket-based notification system

### **Smart Contract Layer**
- **Solidity smart contracts** on Hedera EVM
- **Hedera consensus mechanism** for security
- **Automated governance** and fund management
- **Milestone-based funding** system

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **UI Components**: Shadcn/ui, Radix UI, Lucide React Icons
- **Blockchain**: Hedera SDK, Ethers.js
- **Wallets**: HashPack, MetaMask, WalletConnect
- **State Management**: React Hooks, Context API
- **Form Handling**: React Hook Form, Zod validation

### **Backend**
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Blockchain**: Hedera SDK
- **Testing**: Jest, Supertest
- **Documentation**: JSDoc, Swagger
- **Authentication**: JWT, bcrypt
- **Validation**: Joi, express-validator
- **File Upload**: Multer, Cloudinary integration

### **Smart Contracts**
- **Language**: Solidity
- **Framework**: Hardhat
- **Testing**: Hardhat Test
- **Deployment**: Hedera Testnet/Mainnet
- **Security**: OpenZeppelin Contracts

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint, Solhint
- **Formatting**: Prettier
- **Version Control**: Git
- **Containerization**: Docker

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher
- Redis 6 or higher
- Hedera Testnet account
- HashPack or MetaMask wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fundflow.git
cd fundflow

# Install dependencies for all packages
npm install
cd fundflow-frontend && npm install
cd ../fundflow-smartcontract && npm install
cd ../fundflow-server && npm install

# Set up environment variables
cp fundflow-frontend/.env.example fundflow-frontend/.env.local
cp fundflow-smartcontract/.env.example fundflow-smartcontract/.env
cp fundflow-server/.env.example fundflow-server/.env

# Configure your environment variables
# HEDERA_NETWORK=testnet
# HEDERA_OPERATOR_ID=your-operator-id
# HEDERA_OPERATOR_KEY=your-operator-key
# WALLET_CONNECT_PROJECT_ID=your-project-id

# Start with Docker Compose (recommended)
docker-compose up -d

# Or start services manually
cd fundflow-server && npm run dev
cd ../fundflow-frontend && npm run dev
```

Visit http://localhost:3000 to see the application.

### Smart Contract Setup

```bash
# Navigate to smart contracts directory
cd fundflow-smartcontract

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet

# For mainnet deployment
npm run deploy:mainnet
```

## 📁 Project Structure

```
fundflow/
├── fundflow-frontend/          # Next.js frontend application
│   ├── app/                   # App Router pages and layouts
│   │   ├── dashboard/         # Dashboard routes
│   │   │   ├── startup/       # Startup dashboard pages
│   │   │   │   ├── campaigns/ # Campaign management
│   │   │   │   ├── investors/ # Investor tracking
│   │   │   │   ├── milestones/# Milestone management
│   │   │   │   ├── payments/  # Payment tracking
│   │   │   │   ├── analytics/ # Performance analytics
│   │   │   │   ├── community/ # Community features
│   │   │   │   ├── help/      # Help & support
│   │   │   │   ├── settings/  # User settings
│   │   │   │   └── notifications/ # Notification center
│   │   │   └── investor/      # Investor dashboard pages
│   │   │       ├── investments/ # Investment portfolio
│   │   │       ├── discover/    # Startup discovery
│   │   │       ├── analytics/   # Portfolio analytics
│   │   │       ├── community/   # Community features
│   │   │       ├── help/        # Help & support
│   │   │       ├── settings/    # User settings
│   │   │       └── notifications/ # Notification center
│   │   ├── campaign/           # Campaign browsing and creation
│   │   └── auth/               # Authentication pages
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── startup/        # Startup-specific components
│   │   │   ├── investor/       # Investor-specific components
│   │   │   └── shared/         # Shared dashboard components
│   │   ├── shared/             # Shared UI components
│   │   │   ├── logo/           # Logo components
│   │   │   ├── layout/         # Layout components
│   │   │   ├── themes/         # Theme toggle components
│   │   │   └── wallet/         # Wallet integration components
│   │   ├── ui/                 # Shadcn/ui components
│   │   └── charts/             # Chart and visualization components
│   ├── lib/                    # Utilities and services
│   ├── hooks/                  # Custom React hooks
│   └── public/                 # Static assets
├── fundflow-smartcontract/     # Solidity smart contracts
│   ├── contracts/              # Smart contract source code
│   │   ├── core/               # Core contract logic
│   │   ├── campaign/           # Campaign management
│   │   ├── investment/         # Investment handling
│   │   ├── milestone/          # Milestone system
│   │   └── governance/         # Governance and voting
│   ├── test/                   # Contract tests
│   └── scripts/                # Deployment scripts
├── fundflow-server/            # Backend API server
│   ├── src/                    # Source code
│   │   ├── routes/             # API endpoints
│   │   │   ├── auth/           # Authentication routes
│   │   │   ├── campaigns/      # Campaign management
│   │   │   ├── investments/    # Investment handling
│   │   │   ├── milestones/     # Milestone management
│   │   │   ├── payments/       # Payment processing
│   │   │   ├── notifications/  # Notification system
│   │   │   ├── reports/        # Reporting system
│   │   │   ├── community/      # Community features
│   │   │   ├── support/        # Support ticket system
│   │   │   └── analytics/      # Analytics and metrics
│   │   ├── models/             # Database models
│   │   │   ├── User.ts         # User model
│   │   │   ├── Campaign.ts     # Campaign model
│   │   │   ├── Investment.ts   # Investment model
│   │   │   ├── Milestone.ts    # Milestone model
│   │   │   ├── Payment.ts      # Payment model
│   │   │   ├── Notification.ts # Notification model
│   │   │   ├── Report.ts       # Report model
│   │   │   ├── Community.ts    # Community model
│   │   │   ├── SupportTicket.ts# Support ticket model
│   │   │   └── Analytics.ts    # Analytics model
│   │   ├── services/           # Business logic
│   │   │   ├── CampaignService.ts    # Campaign management
│   │   │   ├── InvestmentService.ts  # Investment handling
│   │   │   ├── MilestoneService.ts   # Milestone processing
│   │   │   ├── PaymentService.ts     # Payment processing
│   │   │   ├── NotificationService.ts# Notification delivery
│   │   │   ├── ReportService.ts      # Report generation
│   │   │   ├── CommunityService.ts   # Community features
│   │   │   ├── SupportService.ts     # Support management
│   │   │   └── AnalyticsService.ts   # Analytics processing
│   │   ├── controllers/        # Request handlers
│   │   │   ├── AuthController.ts     # Authentication
│   │   │   ├── CampaignController.ts # Campaign operations
│   │   │   ├── InvestmentController.ts# Investment operations
│   │   │   ├── MilestoneController.ts# Milestone operations
│   │   │   ├── PaymentController.ts  # Payment operations
│   │   │   ├── NotificationController.ts# Notification operations
│   │   │   ├── ReportController.ts   # Report operations
│   │   │   ├── CommunityController.ts# Community operations
│   │   │   ├── SupportController.ts  # Support operations
│   │   │   └── AnalyticsController.ts# Analytics operations
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts         # Authentication middleware
│   │   │   ├── validation.ts   # Request validation
│   │   │   └── errorHandler.ts # Error handling
│   │   └── utils/              # Utility functions
│   │       ├── ApiResponse.ts  # Standardized API responses
│   │       └── database.ts     # Database connection
│   └── tests/                  # Backend tests
└── docs/                       # Documentation
```

## 🔧 Available Scripts

### Frontend
```bash
cd fundflow-frontend
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

### Smart Contracts
```bash
cd fundflow-smartcontract
npm run compile         # Compile contracts
npm run test            # Run tests
npm run deploy          # Deploy to network
npm run coverage        # Generate coverage report
```

### Backend
```bash
cd fundflow-server
npm run dev             # Start development server
npm run build           # Build TypeScript
npm run start           # Start production server
npm run test            # Run tests
npm run db:seed         # Seed database
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 🌐 Smart Contract Usage

### Creating a Campaign

```solidity
// Create a new fundraising campaign
function createCampaign(
    string memory title,
    string memory description,
    uint256 fundingGoal,
    uint256 duration,
    uint8 milestoneCount
) external returns (uint256 campaignId);
```

### Making an Investment

```solidity
// Invest in a campaign
function investInCampaign(
    uint256 campaignId,
    uint256 amount
) external payable;
```

### Creating Milestones

```solidity
// Create a milestone for a campaign
function createMilestone(
    uint256 campaignId,
    string memory title,
    string memory description,
    uint8 fundingPercentage,
    uint256 votingPeriod
) external;
```

### Voting on Milestones

```solidity
// Vote on milestone completion
function voteOnMilestone(
    uint256 campaignId,
    uint256 milestoneId,
    bool approve
) external;
```

## 🔐 Security Features

### Smart Contract Security
- **Access Control**: Role-based permissions and ownership controls
- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Input Validation**: Comprehensive parameter validation
- **Emergency Pause**: Ability to pause operations in emergencies
- **OpenZeppelin**: Battle-tested security libraries

### Backend Security
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API abuse prevention
- **Input Sanitization**: Protection against injection attacks
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers and middleware
- **Password Hashing**: bcrypt-based password security
- **Request Validation**: Comprehensive input validation

## 🧪 Testing

### Smart Contract Tests
```bash
cd fundflow-smartcontract
npm run test            # Run all tests
npm run test:coverage   # Generate coverage report
npm run gas-report      # Gas usage analysis
```

### Frontend Tests
```bash
cd fundflow-frontend
npm run test            # Run component tests
npm run test:e2e        # End-to-end testing
```

### Backend Tests
```bash
cd fundflow-server
npm run test            # Run unit tests
npm run test:integration # Integration tests
npm run test:coverage   # Coverage report
```

## 🚀 Deployment

### Environment Configuration

```bash
# Production environment variables
NODE_ENV=production
HEDERA_NETWORK=mainnet
HEDERA_OPERATOR_ID=your-mainnet-operator-id
HEDERA_OPERATOR_KEY=your-mainnet-operator-key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fundflow_prod
REDIS_URL=redis://redis:6379
JWT_SECRET=your-production-jwt-secret
WALLET_CONNECT_PROJECT_ID=your-project-id
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
# Build applications
cd fundflow-frontend && npm run build
cd ../fundflow-server && npm run build

# Deploy smart contracts
cd ../fundflow-smartcontract && npm run deploy:mainnet

# Start services
cd ../fundflow-server && npm start
cd ../fundflow-frontend && npm start
```

## 🎯 Current Implementation Status

### ✅ **Completed Features**

#### **Frontend Dashboard System**
- **Startup Dashboard**: Complete with all pages (Campaigns, Investors, Milestones, Payments, Analytics, Community, Help, Settings, Notifications)
- **Investor Dashboard**: Complete with all pages (Portfolio, Discover, Analytics, Community, Help, Settings, Notifications)
- **Responsive Design**: Mobile-first responsive layouts
- **Theme System**: Dark/Light mode with user preferences
- **Navigation**: Dynamic sidebar with collapse/expand functionality
- **Logo Integration**: Clickable logo that navigates to home page

#### **Backend API System**
- **Complete API**: All CRUD operations for campaigns, investments, milestones, payments
- **Authentication**: JWT-based secure authentication system
- **Database Models**: Comprehensive MongoDB schemas with relationships
- **Business Logic**: Service layer with business rules and validation
- **Error Handling**: Standardized error responses and logging
- **Real-time Features**: WebSocket support for live updates

#### **Smart Contract Integration**
- **Hedera Integration**: Full blockchain integration with Hedera Hashgraph
- **Contract Services**: Automated milestone verification and fund distribution
- **Multi-wallet Support**: HashPack, MetaMask, and WalletConnect integration

### 🚧 **In Development**
- **Advanced Analytics**: Machine learning-based investment recommendations
- **Mobile App**: React Native mobile application
- **Internationalization**: Multi-language support
- **Advanced Security**: Multi-signature wallet integration

### 📋 **Planned Features**
- **DeFi Integration**: Yield farming and liquidity pools
- **Governance Token**: Platform governance and voting system
- **Insurance Products**: Investment protection and risk mitigation
- **Regulatory Compliance**: KYC/AML integration and compliance tools

## 📚 Documentation

- **[Hedera Setup Guide](fundflow-frontend/HEDERA_SETUP.md)** - Complete Hedera integration guide
- **[Implementation Summary](fundflow-frontend/IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[Wallet Setup Guide](fundflow-frontend/WALLET_SETUP_GUIDE.md)** - Wallet integration instructions
- **[Smart Contract Docs](fundflow-smartcontract/README.md)** - Contract architecture and usage
- **[API Documentation](fundflow-server/docs/API.md)** - Complete API reference
- **[Database Schema](fundflow-server/docs/DATABASE.md)** - Database design and relationships

## 🤝 Contributing

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

### Development Guidelines

- **TypeScript**: Use strict typing and avoid `any` types
- **Testing**: Write tests for all new features
- **Documentation**: Update documentation for API changes
- **Performance**: Optimize for performance and scalability
- **Security**: Follow security best practices

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🌟 Why Hedera?

**Hedera Hashgraph** provides the ideal foundation for FundFlow:

- **Enterprise-Grade Security**: Byzantine fault tolerance with 1/3 malicious node tolerance
- **High Performance**: 10,000+ transactions per second
- **Low Cost**: Predictable, low transaction fees
- **Environmental**: Carbon-negative blockchain
- **Regulatory Ready**: Built with compliance in mind
- **EVM Compatible**: Seamless integration with existing Ethereum tools
- **Consensus**: Fast finality with high throughput
- **Governance**: Transparent and decentralized governance model

## 🎉 Getting Started

1. **Clone the repository** and install dependencies
2. **Set up environment variables** for Hedera and database connections
3. **Deploy smart contracts** to Hedera testnet
4. **Start the backend server** and frontend application
5. **Connect your wallet** and start exploring FundFlow!

**FundFlow** - Revolutionizing startup fundraising with blockchain technology. 🚀

---

*Built with ❤️ using Next.js, Hedera Hashgraph, and modern web technologies.*
