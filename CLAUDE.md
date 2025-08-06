# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FundFlow is a transparent startup fundraising platform built on the Hedera blockchain. It's a multi-component application with three main parts:

- **fundflow-frontend**: Next.js 15 frontend with TypeScript and Tailwind CSS
- **fundflow-server**: Node.js backend API with Express, MongoDB, and Redis
- **fundflow-smartcontract**: Solidity smart contracts for Hedera blockchain

## Development Commands

### Frontend (fundflow-frontend)
```bash
cd fundflow-frontend
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend (fundflow-server)
```bash
cd fundflow-server
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run all tests
npm run test:unit    # Run unit tests only
npm run test:integration  # Run integration tests only
npm run test:watch   # Run tests in watch mode
npm run test:coverage     # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run db:seed      # Seed MongoDB with test data
npm run workers      # Start background workers
```

### Smart Contracts (fundflow-smartcontract)
```bash
cd fundflow-smartcontract
npm run test         # Run Hardhat contract tests
npm run compile      # Compile Solidity contracts
npm run deploy:testnet    # Deploy to Hedera testnet
npm run deploy:mainnet    # Deploy to Hedera mainnet
npm run coverage     # Run test coverage
npm run gas-report   # Generate gas usage report
```

### Root Level
```bash
npm install          # Install all dependencies across projects
npm run dev          # Start all development servers
npm run build        # Build all projects
npm run test         # Run all tests across projects
```

## Architecture

### Frontend Structure
- **Next.js App Router**: Uses the new `app/` directory structure
- **Components**: Organized by feature (dashboard, investment, campaigns, etc.)
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: Zustand for client state
- **Blockchain Integration**: Hedera wallet integration (HashPack, MetaMask)
- **Styling**: Tailwind CSS with custom design system

### Key Frontend Directories
- `app/`: Next.js app router pages and layouts
- `components/`: Reusable React components organized by feature
- `hooks/`: Custom React hooks (especially `useAuth.tsx`)
- `lib/`: Utility functions and configurations
- `public/`: Static assets

### Backend Architecture
- **Express.js**: RESTful API server
- **MongoDB**: Document database with Mongoose ODM
- **Redis**: Caching and session management
- **Background Jobs**: Bull queue for blockchain synchronization
- **Authentication**: JWT with wallet signature verification
- **Rate Limiting**: Express rate limiter for API protection

### Smart Contract Layer
- **Solidity Language**: Hedera blockchain smart contracts
- **Testing**: Hardhat with Mocha/Chai for contract testing
- **Deployment**: Hardhat deployment scripts for testnet/mainnet

## Tech Stack Details

### Frontend Dependencies
- Next.js 15 with React 19
- TypeScript for type safety
- Tailwind CSS v4 for styling
- Hedera SDK and wallet integrations for blockchain interaction
- Radix UI for accessible components
- Framer Motion for animations
- Lucide React for icons
- Next Themes for dark mode

### Backend Dependencies
- Express 5 for API server
- Mongoose for MongoDB ORM
- Redis for caching
- Bull for job queues
- Socket.io for real-time features
- Winston for logging
- Jest for testing

### Development Tools
- TypeScript across all projects
- ESLint for code linting
- Prettier for code formatting
- Nodemon for backend development
- Hardhat for smart contract testing

## Environment Configuration

The project uses environment variables for configuration. Key variables include:
- `NEXT_PUBLIC_HEDERA_NETWORK`: testnet/mainnet
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Deployed smart contract address
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- `MONGODB_URI`: MongoDB connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: JWT signing secret
- `HEDERA_ACCOUNT_ID`: Backend service account ID
- `HEDERA_PRIVATE_KEY`: Backend service private key

## Testing Strategy

- **Frontend**: Component testing and E2E testing with Playwright
- **Backend**: Unit and integration tests with Jest
- **Smart Contracts**: Contract testing with Hardhat and Mocha
- **Coverage**: Comprehensive test coverage across all layers

## Key Features Implementation

### Campaign Management
- Create fundraising campaigns with funding goals
- Milestone-based fund releases
- Investor governance through voting

### Wallet Integration
- Multi-wallet support (HashPack, MetaMask)
- Hedera account integration
- Transaction signing and broadcasting
- Secure authentication with wallet signatures

### Investment Flow
- HBAR token investments
- Automated equity token distribution
- Real-time portfolio tracking

### Milestone Voting
- Community-driven milestone approval
- Weighted voting based on investment amounts
- Automated fund releases upon approval

## Platform Fee Structure
- 2.5% platform fee on successful fundraising
- Configurable fee percentage in smart contracts
- Transparent fee collection and distribution

## Blockchain Integration Notes
- Built on Hedera Hashgraph for enterprise-grade DLT
- Uses Solidity language for smart contracts
- Ultra-fast finality (3-5 seconds)
- Low and predictable fees
- Carbon-negative network
- Testnet development with mainnet deployment ready