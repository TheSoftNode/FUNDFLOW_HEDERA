# FundFlow Backend API

Enterprise-grade backend API for FundFlow - Blockchain-powered startup fundraising platform built on Hedera Hashgraph.

## 🚀 Features

- **Hedera Integration**: Full integration with Hedera Hashgraph blockchain
- **Smart Contract Management**: Complete FundFlow smart contract interaction
- **RESTful API**: Comprehensive REST API with OpenAPI/Swagger documentation
- **Authentication & Authorization**: JWT-based authentication system
- **Real-time Updates**: WebSocket support for real-time notifications
- **Rate Limiting**: Built-in rate limiting and DDoS protection
- **Comprehensive Logging**: Winston-based logging with multiple transports
- **Database Integration**: MongoDB with Mongoose ODM
- **Caching**: Redis-based caching layer
- **Queue Management**: Bull queue system for background jobs
- **File Upload**: Support for image and document uploads
- **Email & SMS**: Integration with email and SMS services
- **Payment Processing**: Stripe integration for fiat payments
- **AWS Integration**: S3 for file storage and other AWS services

## 🏗️ Architecture

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic and external integrations
├── utils/           # Utility functions
├── workers/         # Background job workers
└── server.ts        # Main application entry point
```

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Blockchain**: Hedera Hashgraph SDK
- **Authentication**: JWT with bcrypt
- **Validation**: Express-validator with Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston
- **Queue**: Bull with Redis
- **Testing**: Jest with Supertest
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 6+
- Redis 6+
- Hedera Testnet/Mainnet account

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd fundflow-server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3002

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fundflow

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Hedera Network Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.6514439
HEDERA_PRIVATE_KEY=0xe83d3c9a7c1f347321c378bd0b800b8b2f0bc95a2a5473589bf72312d353f5b2

# FundFlow Smart Contract Addresses
FUNDFLOWCORE_ADDRESS=00000000000000000000000000000000006411e2
CAMPAIGNMANAGER_ADDRESS=00000000000000000000000000000000006411e5
INVESTMENTMANAGER_ADDRESS=0000000000000000000000000000000000641223
MILESTONEMANAGER_ADDRESS=0000000000000000000000000000000000641225
ANALYTICSMANAGER_ADDRESS=0000000000000000000000000000000000641228
GOVERNANCEMANAGER_ADDRESS=000000000000000000000000000000000064122b

# Contract IDs (for Hedera SDK calls)
FUNDFLOWCORE_ID=0.0.6558178
CAMPAIGNMANAGER_ID=0.0.6558181
INVESTMENTMANAGER_ID=0.0.6558243
MILESTONEMANAGER_ID=0.0.6558245
ANALYTICSMANAGER_ID=0.0.6558248
GOVERNANCEMANAGER_ID=0.0.6558251

# Logging Configuration
LOG_LEVEL=info
```

### 3. Start Services

```bash
# Start MongoDB (if not running)
mongod

# Start Redis (if not running)
redis-server

# Start the backend
npm run dev
```

### 4. Access API Documentation

Open your browser and navigate to: `http://localhost:5000/api-docs`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{id}` - Get user by ID

### Campaigns
- `POST /api/fundflow/campaigns` - Create campaign
- `GET /api/fundflow/campaigns` - Get campaigns with filters
- `GET /api/fundflow/campaigns/{id}` - Get campaign by ID
- `PUT /api/fundflow/campaigns/{id}` - Update campaign

### Investments
- `POST /api/fundflow/investments` - Make investment
- `GET /api/fundflow/investments/campaign/{id}` - Get campaign investments
- `GET /api/fundflow/investments/investor/{address}` - Get investor investments

### Milestones
- `POST /api/fundflow/milestones` - Add milestone
- `POST /api/fundflow/milestones/{id}/vote` - Vote on milestone
- `POST /api/fundflow/milestones/{id}/execute` - Execute milestone
- `GET /api/fundflow/milestones/campaign/{id}` - Get campaign milestones

### Analytics
- `GET /api/fundflow/analytics/platform` - Platform analytics
- `GET /api/fundflow/analytics/campaign/{id}` - Campaign analytics
- `GET /api/fundflow/analytics/investor/{address}` - Investor analytics

### Governance
- `POST /api/fundflow/governance/proposals` - Create proposal
- `POST /api/fundflow/governance/proposals/{id}/vote` - Vote on proposal
- `POST /api/fundflow/governance/proposals/{id}/execute` - Execute proposal

### Blockchain
- `GET /api/blockchain/status` - Blockchain status
- `GET /api/blockchain/contracts` - Contract information
- `GET /api/blockchain/balance/{accountId}` - Account balance
- `GET /api/blockchain/transaction/{txId}` - Transaction details
- `POST /api/blockchain/contract/{id}/function/{name}` - Execute contract function
- `POST /api/blockchain/contract/{id}/query/{name}` - Query contract function

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server with nodemon
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier

# Database
npm run db:seed          # Seed database with sample data

# Background Workers
npm run workers          # Start background job workers
```

### Code Structure

#### Services Layer
- **HederaService**: Core blockchain interaction service
- **FundFlowContractService**: FundFlow smart contract operations
- **UserService**: User management operations
- **CampaignService**: Campaign business logic

#### Controllers Layer
- **BlockchainController**: Blockchain-related endpoints
- **FundFlowController**: FundFlow business logic endpoints
- **UserController**: User management endpoints
- **AuthController**: Authentication endpoints

#### Models Layer
- **User**: User data model
- **Campaign**: Campaign data model
- **Investment**: Investment data model
- **Milestone**: Milestone data model

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── fixtures/       # Test data fixtures
└── utils/          # Test utilities
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t fundflow-backend .

# Run container
docker run -p 5000:5000 --env-file .env fundflow-backend

# Using Docker Compose
docker-compose up -d
```

### Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database and Redis
3. Set up proper JWT secrets
4. Configure Hedera mainnet credentials
5. Set up monitoring and logging
6. Configure SSL/TLS certificates

## 📊 Monitoring & Logging

### Logging Levels
- **error**: Application errors and failures
- **warn**: Warning conditions
- **info**: General information
- **debug**: Detailed debugging information

### Health Checks
- `GET /health` - Application health status
- `GET /api/blockchain/health` - Blockchain service health

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: DDoS protection
- **Input Validation**: Request validation and sanitization
- **JWT Authentication**: Secure token-based authentication
- **HTTPS**: SSL/TLS encryption
- **Environment Variables**: Secure configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api-docs`

## 🔗 Related Links

- [Frontend Repository](../fundflow-frontend)
- [Smart Contracts](../fundflow-smartcontract)
- [Hedera Documentation](https://docs.hedera.com/)
- [FundFlow Project Overview](../../README.md)
