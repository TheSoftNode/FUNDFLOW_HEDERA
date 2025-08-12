# FundFlow System Architecture

## 🎯 Overview

FundFlow is built as a modern, scalable decentralized application with a multi-layer architecture that leverages blockchain technology, cloud services, and modern web technologies. This document provides a comprehensive overview of the system architecture, components, and design patterns.

## 🏗️ High-Level Architecture

### **System Overview**
```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│                   Blockchain Layer                         │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                     │
└─────────────────────────────────────────────────────────────┘
```

### **Component Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Smart         │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   Contracts     │
│                 │    │                 │    │   (Hedera)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Database      │    │   Blockchain    │
│   (Vercel)      │    │   (MongoDB)     │    │   (Hedera)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 Frontend Architecture

### **Technology Stack**
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4 with Framer Motion
- **State Management**: React Context API + Hooks
- **Build Tool**: Next.js built-in bundler
- **Deployment**: Vercel (recommended) or self-hosted

### **Component Architecture**

#### **Component Hierarchy**
```
App
├── RootLayout
│   ├── ThemeProvider
│   ├── AuthProvider
│   ├── Navbar
│   └── Footer
├── Page Components
│   ├── Landing Page
│   ├── Dashboard
│   ├── Campaign Pages
│   └── Wallet Pages
└── Shared Components
    ├── UI Components (Shadcn/ui)
    ├── Wallet Components
    ├── Layout Components
    └── Utility Components
```

#### **Component Categories**
- **Page Components**: Full-page components with routing
- **Layout Components**: Reusable layout structures
- **Feature Components**: Business logic components
- **UI Components**: Reusable UI primitives
- **Utility Components**: Helper and utility components

### **State Management**

#### **State Architecture**
```
Global State (Context)
├── Authentication State
│   ├── User Information
│   ├── Wallet Connection
│   └── Session Management
├── Application State
│   ├── Theme Preferences
│   ├── Navigation State
│   └── UI State
└── Business State
    ├── Campaign Data
    ├── Investment Data
    └── User Preferences
```

#### **State Patterns**
- **Context API**: Global state management
- **Local State**: Component-specific state
- **Server State**: Data fetched from APIs
- **Persistent State**: Local storage and cookies

### **Data Flow**

#### **Data Fetching**
```
Component → Hook → API Service → Backend → Database
    ↑                                    ↓
Component ← Hook ← API Service ← Backend ← Database
```

#### **Real-time Updates**
```
WebSocket → Event Handler → State Update → UI Re-render
    ↑           ↓              ↓           ↓
Blockchain → Backend → WebSocket → Frontend → UI
```

## 🔧 Backend Architecture

### **Technology Stack**
- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for session and data caching
- **Authentication**: JWT with refresh tokens
- **API**: RESTful API with WebSocket support
- **Validation**: Joi for request validation
- **Testing**: Jest with Supertest

### **API Architecture**

#### **REST API Structure**
```
/api/v1
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /refresh
│   └── POST /logout
├── /campaigns
│   ├── GET / (list campaigns)
│   ├── POST / (create campaign)
│   ├── GET /:id (get campaign)
│   ├── PUT /:id (update campaign)
│   └── DELETE /:id (delete campaign)
├── /investments
│   ├── GET / (list investments)
│   ├── POST / (create investment)
│   └── GET /:id (get investment)
├── /milestones
│   ├── GET / (list milestones)
│   ├── POST / (create milestone)
│   ├── PUT /:id (update milestone)
│   └── POST /:id/vote (vote on milestone)
└── /users
    ├── GET /profile (get user profile)
    ├── PUT /profile (update profile)
    └── GET /portfolio (get investment portfolio)
```

#### **WebSocket Events**
```
Connection Events
├── connect: User connects to WebSocket
├── disconnect: User disconnects
└── error: Connection error

Campaign Events
├── campaign_created: New campaign created
├── campaign_updated: Campaign updated
├── campaign_funded: Campaign fully funded
└── campaign_completed: Campaign completed

Investment Events
├── investment_made: New investment
├── milestone_submitted: Milestone submitted
├── milestone_voted: Milestone voted on
└── milestone_executed: Milestone executed
```

### **Service Layer Architecture**

#### **Service Structure**
```
Business Services
├── CampaignService
│   ├── createCampaign()
│   ├── updateCampaign()
│   ├── getCampaign()
│   └── deleteCampaign()
├── InvestmentService
│   ├── createInvestment()
│   ├── getInvestment()
│   ├── updateInvestment()
│   └── deleteInvestment()
├── MilestoneService
│   ├── createMilestone()
│   ├── updateMilestone()
│   ├── submitMilestone()
│   └── executeMilestone()
└── UserService
    ├── createUser()
    ├── updateUser()
    ├── getUser()
    └── deleteUser()
```

#### **Service Patterns**
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Object creation
- **Strategy Pattern**: Algorithm selection
- **Observer Pattern**: Event handling

### **Database Architecture**

#### **MongoDB Collections**
```
users
├── _id: ObjectId
├── walletAddress: String
├── walletType: String
├── profile: {
│   ├── name: String
│   ├── email: String
│   ├── avatar: String
│   └── bio: String
│ }
├── role: String (startup/investor)
├── createdAt: Date
└── updatedAt: Date

campaigns
├── _id: ObjectId
├── creatorId: ObjectId (ref: users)
├── title: String
├── description: String
├── fundingGoal: Number
├── raisedAmount: Number
├── duration: Number
├── milestoneCount: Number
├── status: String
├── category: String
├── tags: [String]
├── media: {
│   ├── logo: String
│   ├── coverImage: String
│   └── video: String
│ }
├── milestones: [{
│   ├── title: String
│   ├── description: String
│   ├── fundingPercentage: Number
│   ├── targetAmount: Number
│   ├── status: String
│   └── timeline: Number
│ }]
├── createdAt: Date
└── updatedAt: Date

investments
├── _id: ObjectId
├── campaignId: ObjectId (ref: campaigns)
├── investorId: ObjectId (ref: users)
├── amount: Number
├── timestamp: Date
├── status: String
└── transactionHash: String

milestones
├── _id: ObjectId
├── campaignId: ObjectId (ref: campaigns)
├── title: String
├── description: String
├── fundingPercentage: Number
├── targetAmount: Number
├── status: String
├── votingDuration: Number
├── votingEndTime: Date
├── votes: [{
│   ├── voterId: ObjectId
│   ├── vote: Boolean
│   ├── votingPower: Number
│   └── timestamp: Date
│ }]
├── createdAt: Date
└── updatedAt: Date
```

#### **Database Indexes**
```javascript
// Performance indexes
db.users.createIndex({ "walletAddress": 1 }, { unique: true });
db.campaigns.createIndex({ "status": 1, "createdAt": -1 });
db.campaigns.createIndex({ "category": 1, "status": 1 });
db.investments.createIndex({ "campaignId": 1, "investorId": 1 });
db.milestones.createIndex({ "campaignId": 1, "status": 1 });

// Text search indexes
db.campaigns.createIndex({ "title": "text", "description": "text" });
```

## ⛓️ Blockchain Architecture

### **Hedera Integration**

#### **Network Configuration**
```
Testnet Configuration
├── Network: Hedera Testnet
├── Chain ID: 296
├── RPC URL: https://testnet.hashio.io/api
├── Explorer: https://hashscan.io/testnet
└── Mirror Node: https://testnet.mirrornode.hedera.com

Mainnet Configuration
├── Network: Hedera Mainnet
├── Chain ID: 295
├── RPC URL: https://mainnet.hashio.io/api
├── Explorer: https://hashscan.io
└── Mirror Node: https://mainnet.mirrornode.hedera.com
```

#### **Smart Contract Architecture**
```
FundFlow Core System
├── FundFlowCore.sol (Main orchestrator)
├── CampaignManager.sol (Campaign management)
├── InvestmentManager.sol (Investment handling)
├── MilestoneManager.sol (Milestone system)
└── AnalyticsManager.sol (Analytics and reporting)
```

### **Contract Interactions**

#### **Contract Communication Flow**
```
Frontend → Backend → Smart Contract → Hedera Network
    ↑         ↑           ↓            ↓
Frontend ← Backend ← Smart Contract ← Hedera Network
```

#### **Transaction Flow**
```
1. User Action (Frontend)
2. Request Validation (Backend)
3. Transaction Creation (Backend)
4. User Approval (Wallet)
5. Transaction Submission (Hedera)
6. Confirmation (Blockchain)
7. Event Emission (Smart Contract)
8. Database Update (Backend)
9. UI Update (Frontend)
```

### **Event Handling**

#### **Smart Contract Events**
```solidity
// Campaign events
event CampaignCreated(uint256 indexed campaignId, address indexed creator);
event CampaignLaunched(uint256 indexed campaignId, uint256 timestamp);
event CampaignUpdated(uint256 indexed campaignId, uint256 timestamp);

// Investment events
event InvestmentMade(uint256 indexed campaignId, address indexed investor, uint256 amount);
event InvestmentWithdrawn(uint256 indexed campaignId, address indexed investor, uint256 amount);

// Milestone events
event MilestoneCreated(uint256 indexed campaignId, uint256 indexed milestoneId);
event MilestoneVoted(uint256 indexed milestoneId, address indexed voter, bool approved);
event MilestoneExecuted(uint256 indexed milestoneId, uint256 timestamp);
```

#### **Event Processing**
```
Smart Contract → Event Emission → Backend Listener → Database Update → WebSocket → Frontend
```

## 🔐 Security Architecture

### **Authentication & Authorization**

#### **JWT Token Structure**
```javascript
// Access Token
{
  "sub": "user_id",
  "wallet": "wallet_address",
  "role": "user_role",
  "iat": "issued_at",
  "exp": "expiration_time"
}

// Refresh Token
{
  "sub": "user_id",
  "type": "refresh",
  "iat": "issued_at",
  "exp": "expiration_time"
}
```

#### **Authorization Matrix**
```
Role Permissions
├── Anonymous Users
│   ├── View public campaigns
│   ├── Connect wallet
│   └── Register account
├── Authenticated Users
│   ├── View all campaigns
│   ├── Create investments
│   ├── Vote on milestones
│   └── Manage profile
├── Campaign Creators
│   ├── Update own campaigns
│   ├── Submit milestones
│   ├── Manage campaign settings
│   └── View campaign analytics
└── Platform Administrators
    ├── Manage all campaigns
    ├── Moderate content
    ├── Manage users
    └── Platform configuration
```

### **Data Security**

#### **Encryption Layers**
```
Data at Rest
├── Database Encryption (MongoDB)
├── File Storage Encryption (S3)
└── Backup Encryption

Data in Transit
├── HTTPS/TLS 1.3
├── WebSocket Security (WSS)
└── API Security Headers

Data Processing
├── Input Validation
├── Output Sanitization
└── SQL Injection Prevention
```

#### **Security Headers**
```javascript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📊 Performance Architecture

### **Caching Strategy**

#### **Multi-Layer Caching**
```
Frontend Caching
├── Browser Cache (Static assets)
├── Service Worker (Offline support)
└── Local Storage (User preferences)

Backend Caching
├── Redis Cache (Session data)
├── Database Query Cache
├── API Response Cache
└── File Cache (Static files)

CDN Caching
├── Edge Caching (Global distribution)
├── Image Optimization
└── Static Asset Delivery
```

#### **Cache Invalidation**
```javascript
// Cache invalidation patterns
const invalidateCache = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

// Invalidate campaign cache when updated
await invalidateCache('campaign:*');
await invalidateCache('campaigns:list:*');
```

### **Database Optimization**

#### **Query Optimization**
```javascript
// Efficient queries with pagination
const getCampaigns = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  
  const query = Campaign.find(filters)
    .select('title description fundingGoal raisedAmount status category createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
  const [campaigns, total] = await Promise.all([
    query.exec(),
    Campaign.countDocuments(filters)
  ]);
  
  return {
    campaigns,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};
```

#### **Connection Pooling**
```javascript
// MongoDB connection optimization
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0
});
```

## 🔄 Scalability Architecture

### **Horizontal Scaling**

#### **Load Balancing**
```
Internet → Load Balancer → Multiple Backend Instances
    ↓           ↓                    ↓
CDN/Edge    Health Check         Auto-scaling
    ↓           ↓                    ↓
Static Files  Failover         Load Distribution
```

#### **Database Scaling**
```
Primary Database → Read Replicas → Sharding
      ↓              ↓              ↓
Write Operations  Read Operations  Data Distribution
      ↓              ↓              ↓
Master Node     Slave Nodes     Shard Clusters
```

### **Microservices Architecture**

#### **Service Decomposition**
```
Monolithic → Microservices
├── User Service (Authentication & Profiles)
├── Campaign Service (Campaign Management)
├── Investment Service (Investment Processing)
├── Milestone Service (Milestone Management)
├── Notification Service (Email & Push Notifications)
└── Analytics Service (Data Analysis & Reporting)
```

#### **Service Communication**
```
Synchronous Communication
├── REST APIs (Direct service calls)
├── GraphQL (Flexible data queries)
└── gRPC (High-performance RPC)

Asynchronous Communication
├── Message Queues (RabbitMQ, Redis)
├── Event Streaming (Kafka, Redis Streams)
└── WebSockets (Real-time updates)
```

## 🚀 Deployment Architecture

### **Environment Configuration**

#### **Environment Tiers**
```
Development Environment
├── Local Development
├── Development Server
└── Development Database

Staging Environment
├── Staging Server
├── Staging Database
└── Test Smart Contracts

Production Environment
├── Production Servers
├── Production Database
└── Live Smart Contracts
```

#### **Configuration Management**
```javascript
// Environment configuration
const config = {
  development: {
    database: 'mongodb://localhost:27017/fundflow_dev',
    redis: 'redis://localhost:6379',
    hedera: 'testnet',
    cors: ['http://localhost:3000']
  },
  staging: {
    database: process.env.MONGODB_URI_STAGING,
    redis: process.env.REDIS_URL_STAGING,
    hedera: 'testnet',
    cors: ['https://staging.fundflow.io']
  },
  production: {
    database: process.env.MONGODB_URI_PROD,
    redis: process.env.REDIS_URL_PROD,
    hedera: 'mainnet',
    cors: ['https://fundflow.io']
  }
};
```

### **CI/CD Pipeline**

#### **Deployment Flow**
```
Code Commit → Automated Testing → Build → Deploy → Health Check
     ↓              ↓           ↓        ↓         ↓
Git Push      Unit Tests    Docker    Staging   Monitoring
     ↓              ↓           ↓        ↓         ↓
Trigger       Integration   Image     Production  Alerting
```

#### **Deployment Strategies**
```
Blue-Green Deployment
├── Blue Environment (Current)
├── Green Environment (New)
└── Traffic Switch

Rolling Deployment
├── Gradual Instance Updates
├── Health Check Validation
└── Rollback Capability

Canary Deployment
├── Small Traffic to New Version
├── Gradual Traffic Increase
└── Full Deployment on Success
```

## 📊 Monitoring & Observability

### **Application Monitoring**

#### **Performance Metrics**
```
Response Time Metrics
├── API Response Time (p50, p95, p99)
├── Database Query Time
├── External API Calls
└── Frontend Page Load Time

Throughput Metrics
├── Requests per Second
├── Transactions per Second
├── Concurrent Users
└── Database Connections

Error Metrics
├── Error Rate
├── Error Types
├── Stack Traces
└── User Impact
```

#### **Health Checks**
```javascript
// Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.APP_VERSION
  });
});

app.get('/health/detailed', async (req, res) => {
  try {
    const checks = await Promise.all([
      checkDatabase(),
      checkRedis(),
      checkHedera(),
      checkExternalAPIs()
    ]);
    
    const healthy = checks.every(check => check.status === 'healthy');
    res.status(healthy ? 200 : 503).json({ checks, healthy });
  } catch (error) {
    res.status(503).json({ error: error.message, healthy: false });
  }
});
```

### **Logging & Tracing**

#### **Structured Logging**
```javascript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  next();
});
```

#### **Distributed Tracing**
```javascript
// OpenTelemetry tracing
const { trace, context } = require('@opentelemetry/api');

const tracer = trace.getTracer('fundflow-api');

// Trace database operations
const traceDatabaseOperation = async (operation, query) => {
  const span = tracer.startSpan(`db.${operation}`);
  
  try {
    const result = await query;
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    throw error;
  } finally {
    span.end();
  }
};
```

## 🔮 Future Architecture

### **Planned Enhancements**

#### **Advanced Features**
```
AI-Powered Features
├── Investment Recommendations
├── Risk Assessment Models
├── Market Analysis Tools
└── Predictive Analytics

Blockchain Enhancements
├── Cross-Chain Integration
├── Layer 2 Solutions
├── Advanced DeFi Features
└── Token Economics

Platform Extensions
├── Mobile Applications
├── API Marketplace
├── Third-Party Integrations
└── Enterprise Features
```

#### **Architecture Evolution**
```
Current: Monolithic + Smart Contracts
    ↓
Phase 1: Microservices + Event-Driven
    ↓
Phase 2: Serverless + Edge Computing
    ↓
Phase 3: AI-Enhanced + Autonomous
```

---

**FundFlow System Architecture** provides a robust, scalable, and secure foundation for the future of startup fundraising. 🚀

For technical implementation details, refer to the [Development Guides](../frontend/README.md) and [Smart Contract Documentation](../smart-contracts/README.md).
