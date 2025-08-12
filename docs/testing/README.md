# FundFlow Testing Strategy

## 🎯 Overview

FundFlow implements a comprehensive testing strategy covering smart contracts, frontend components, backend APIs, and end-to-end user workflows. Our testing approach ensures code quality, security, and reliability across all platform components.

## 🏗️ Testing Architecture

### **Testing Pyramid**
```
    /\
   /  \     E2E Tests (Few, Slow)
  /____\    
 /      \   Integration Tests (Some, Medium)
/________\  Unit Tests (Many, Fast)
```

### **Test Categories**
- **Unit Tests**: Individual function and component testing
- **Integration Tests**: Cross-component and cross-contract testing
- **End-to-End Tests**: Complete user workflow testing
- **Security Tests**: Vulnerability and access control testing
- **Performance Tests**: Load and stress testing

## 🧪 Smart Contract Testing

### **Testing Framework**
- **Framework**: Hardhat Test (Mocha + Chai)
- **Coverage**: 100% function coverage target
- **Gas Analysis**: Automated gas usage reporting
- **Security**: Automated security pattern testing

### **Test Structure**
```
fundflow-smartcontract/test/
├── FundFlowCore.test.js          # Core contract tests
├── CampaignManager.test.js       # Campaign management tests
├── InvestmentManager.test.js     # Investment handling tests
├── MilestoneManager.test.js      # Milestone system tests
├── AnalyticsManager.test.js      # Analytics contract tests
├── integration/                  # Cross-contract tests
├── security/                     # Security vulnerability tests
└── utils/                        # Test utilities and helpers
```

### **Running Smart Contract Tests**

```bash
# Navigate to smart contracts directory
cd fundflow-smartcontract

# Run all tests
npm run test

# Run specific test file
npm run test test/FundFlowCore.test.js

# Run tests with coverage
npm run test:coverage

# Run gas analysis
npm run gas-report

# Run tests in watch mode
npm run test:watch
```

### **Test Examples**

#### **Unit Test Example**
```javascript
describe('FundFlowCore', () => {
  let fundFlowCore, owner, creator, investor;
  
  beforeEach(async () => {
    [owner, creator, investor] = await ethers.getSigners();
    const FundFlowCore = await ethers.getContractFactory('FundFlowCore');
    fundFlowCore = await FundFlowCore.deploy();
    await fundFlowCore.deployed();
  });
  
  describe('Campaign Creation', () => {
    it('should create a new campaign', async () => {
      const title = 'Test Campaign';
      const description = 'Test Description';
      const fundingGoal = ethers.utils.parseEther('1000');
      const duration = 30 * 24 * 60 * 60; // 30 days
      const milestoneCount = 3;
      
      const tx = await fundFlowCore.connect(creator).createCampaignDraft(
        title, description, fundingGoal, duration, milestoneCount
      );
      
      await expect(tx)
        .to.emit(fundFlowCore, 'CampaignCreated')
        .withArgs(1, creator.address);
    });
    
    it('should revert with invalid parameters', async () => {
      await expect(
        fundFlowCore.connect(creator).createCampaignDraft(
          '', '', 0, 0, 0
        )
      ).to.be.revertedWith('Invalid campaign parameters');
    });
  });
});
```

#### **Integration Test Example**
```javascript
describe('Campaign Investment Flow', () => {
  it('should complete full investment cycle', async () => {
    // 1. Create campaign
    const campaignId = await createTestCampaign();
    
    // 2. Launch campaign
    await fundFlowCore.connect(owner).launchCampaign(campaignId);
    
    // 3. Make investment
    const investmentAmount = ethers.utils.parseEther('100');
    await fundFlowCore.connect(investor).investInCampaign(
      campaignId, { value: investmentAmount }
    );
    
    // 4. Create milestone
    const milestoneId = await createTestMilestone(campaignId);
    
    // 5. Vote on milestone
    await fundFlowCore.connect(investor).voteOnMilestone(
      campaignId, milestoneId, true
    );
    
    // 6. Execute milestone
    await fundFlowCore.connect(creator).executeMilestone(
      campaignId, milestoneId
    );
    
    // Verify final state
    const campaign = await fundFlowCore.getCampaign(campaignId);
    expect(campaign.raisedAmount).to.equal(investmentAmount);
  });
});
```

### **Test Utilities**

#### **Test Data Factory**
```javascript
// Test utilities for creating test data
const createTestCampaign = async (overrides = {}) => {
  const defaultCampaign = {
    title: 'Test Campaign',
    description: 'Test Description',
    fundingGoal: ethers.utils.parseEther('1000'),
    duration: 30 * 24 * 60 * 60,
    milestoneCount: 3
  };
  
  const campaign = { ...defaultCampaign, ...overrides };
  
  const tx = await fundFlowCore.connect(creator).createCampaignDraft(
    campaign.title,
    campaign.description,
    campaign.fundingGoal,
    campaign.duration,
    campaign.milestoneCount
  );
  
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === 'CampaignCreated');
  return event.args.campaignId;
};
```

#### **Event Testing Helper**
```javascript
// Helper for testing events
const expectEvent = async (tx, eventName, args = null) => {
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === eventName);
  
  expect(event).to.not.be.undefined;
  
  if (args) {
    expect(event.args).to.deep.equal(args);
  }
  
  return event;
};
```

## 🎨 Frontend Testing

### **Testing Framework**
- **Framework**: Jest + React Testing Library
- **Coverage**: 90%+ component coverage target
- **Mocking**: MSW for API mocking
- **Visual Testing**: Storybook for component stories

### **Test Structure**
```
fundflow-frontend/
├── __tests__/                    # Test files
│   ├── components/               # Component tests
│   ├── hooks/                    # Hook tests
│   ├── lib/                      # Utility tests
│   └── pages/                    # Page tests
├── .storybook/                   # Storybook configuration
├── jest.config.js                # Jest configuration
└── setupTests.ts                 # Test setup
```

### **Running Frontend Tests**

```bash
# Navigate to frontend directory
cd fundflow-frontend

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- ConnectWalletButton.test.tsx

# Run Storybook
npm run storybook
```

### **Test Examples**

#### **Component Test Example**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConnectWalletButton } from '../ConnectWalletButton';

describe('ConnectWalletButton', () => {
  it('should display available wallets', () => {
    render(<ConnectWalletButton />);
    
    expect(screen.getByText('HashPack')).toBeInTheDocument();
    expect(screen.getByText('MetaMask')).toBeInTheDocument();
    expect(screen.getByText('WalletConnect')).toBeInTheDocument();
  });
  
  it('should connect to selected wallet', async () => {
    const mockConnect = jest.fn();
    render(<ConnectWalletButton onConnect={mockConnect} />);
    
    // Click connect button
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    // Select HashPack
    fireEvent.click(screen.getByText('HashPack'));
    
    // Verify connection call
    expect(mockConnect).toHaveBeenCalledWith('hashpack');
  });
  
  it('should handle connection errors gracefully', async () => {
    const mockConnect = jest.fn().mockRejectedValue(
      new Error('Connection failed')
    );
    
    render(<ConnectWalletButton onConnect={mockConnect} />);
    
    // Attempt connection
    fireEvent.click(screen.getByText('Connect Wallet'));
    fireEvent.click(screen.getByText('HashPack'));
    
    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });
  });
});
```

#### **Hook Test Example**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('should connect wallet successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isConnected).toBe(false);
    
    await act(async () => {
      await result.current.connectWallet('hashpack');
    });
    
    expect(result.current.isConnected).toBe(true);
    expect(result.current.walletType).toBe('hashpack');
  });
  
  it('should disconnect wallet', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Connect first
    await act(async () => {
      await result.current.connectWallet('hashpack');
    });
    
    expect(result.current.isConnected).toBe(true);
    
    // Disconnect
    act(() => {
      result.current.disconnectWallet();
    });
    
    expect(result.current.isConnected).toBe(false);
    expect(result.current.walletType).toBe(null);
  });
});
```

### **API Mocking with MSW**

```typescript
// API mocking setup
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  // Mock campaign API
  rest.get('/api/campaigns', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Test Campaign',
          description: 'Test Description',
          fundingGoal: '1000',
          raisedAmount: '500'
        }
      ])
    );
  }),
  
  // Mock wallet connection
  rest.post('/api/wallet/connect', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        accountId: '0.0.12345',
        walletType: 'hashpack'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🔧 Backend Testing

### **Testing Framework**
- **Framework**: Jest + Supertest
- **Coverage**: 90%+ API coverage target
- **Database**: Test database with fixtures
- **Mocking**: External service mocking

### **Test Structure**
```
fundflow-server/
├── __tests__/                    # Test files
│   ├── api/                      # API endpoint tests
│   ├── services/                 # Service layer tests
│   ├── models/                   # Database model tests
│   └── integration/              # Integration tests
├── jest.config.js                # Jest configuration
└── test-setup.js                 # Test environment setup
```

### **Running Backend Tests**

```bash
# Navigate to backend directory
cd fundflow-server

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

### **Test Examples**

#### **API Endpoint Test**
```javascript
import request from 'supertest';
import app from '../src/app';
import { setupTestDB, teardownTestDB } from './test-utils';

describe('Campaign API', () => {
  beforeAll(async () => {
    await setupTestDB();
  });
  
  afterAll(async () => {
    await teardownTestDB();
  });
  
  describe('GET /api/campaigns', () => {
    it('should return list of campaigns', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .expect(200);
      
      expect(response.body).toHaveProperty('campaigns');
      expect(Array.isArray(response.body.campaigns)).toBe(true);
    });
    
    it('should filter campaigns by status', async () => {
      const response = await request(app)
        .get('/api/campaigns?status=active')
        .expect(200);
      
      const campaigns = response.body.campaigns;
      campaigns.forEach(campaign => {
        expect(campaign.status).toBe('active');
      });
    });
  });
  
  describe('POST /api/campaigns', () => {
    it('should create new campaign', async () => {
      const campaignData = {
        title: 'Test Campaign',
        description: 'Test Description',
        fundingGoal: 1000,
        duration: 30,
        milestoneCount: 3
      };
      
      const response = await request(app)
        .post('/api/campaigns')
        .send(campaignData)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(campaignData.title);
    });
    
    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/campaigns')
        .send({})
        .expect(400);
      
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('Title is required');
    });
  });
});
```

#### **Service Layer Test**
```javascript
import { CampaignService } from '../src/services/CampaignService';
import { mockCampaignModel } from './mocks/campaignModel';

describe('CampaignService', () => {
  let campaignService;
  
  beforeEach(() => {
    campaignService = new CampaignService(mockCampaignModel);
  });
  
  describe('createCampaign', () => {
    it('should create campaign successfully', async () => {
      const campaignData = {
        title: 'Test Campaign',
        description: 'Test Description',
        fundingGoal: 1000,
        duration: 30,
        milestoneCount: 3
      };
      
      const result = await campaignService.createCampaign(campaignData);
      
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(campaignData.title);
      expect(mockCampaignModel.create).toHaveBeenCalledWith(campaignData);
    });
    
    it('should handle validation errors', async () => {
      const invalidData = { title: '' };
      
      await expect(
        campaignService.createCampaign(invalidData)
      ).rejects.toThrow('Title is required');
    });
  });
});
```

## 🔒 Security Testing

### **Smart Contract Security**
- **Access Control Testing**: Verify role-based permissions
- **Reentrancy Testing**: Check for reentrancy vulnerabilities
- **Input Validation**: Test parameter validation
- **Emergency Controls**: Verify emergency pause functionality

### **Frontend Security**
- **XSS Testing**: Check for cross-site scripting vulnerabilities
- **CSRF Testing**: Verify CSRF protection
- **Input Sanitization**: Test user input handling
- **Authentication Testing**: Verify secure authentication flows

### **Backend Security**
- **API Security**: Test rate limiting and authentication
- **SQL Injection**: Check for injection vulnerabilities
- **Authorization**: Verify proper access controls
- **Data Validation**: Test input validation and sanitization

## 📊 Test Coverage

### **Coverage Targets**
- **Smart Contracts**: 100% function coverage
- **Frontend Components**: 90%+ component coverage
- **Backend APIs**: 90%+ endpoint coverage
- **Integration Tests**: 80%+ workflow coverage

### **Coverage Reports**

#### **Smart Contract Coverage**
```bash
cd fundflow-smartcontract
npm run test:coverage
```

**Sample Output:**
```
| File                    | % Stmts | % Branch | % Funcs | % Lines |
|-------------------------|----------|----------|---------|---------|
| FundFlowCore.sol        |   100.00 |    100.00 |   100.00 |   100.00 |
| CampaignManager.sol     |   100.00 |    100.00 |   100.00 |   100.00 |
| InvestmentManager.sol   |   100.00 |    100.00 |   100.00 |   100.00 |
| MilestoneManager.sol    |   100.00 |    100.00 |   100.00 |   100.00 |
| AnalyticsManager.sol    |   100.00 |    100.00 |   100.00 |   100.00 |
|-------------------------|----------|----------|---------|---------|
| All files              |   100.00 |    100.00 |   100.00 |   100.00 |
```

#### **Frontend Coverage**
```bash
cd fundflow-frontend
npm run test:coverage
```

**Sample Output:**
```
| File                    | % Stmts | % Branch | % Funcs | % Lines |
|-------------------------|----------|----------|---------|---------|
| components/             |    92.5 |     87.3 |    94.1 |    92.5 |
| hooks/                  |    95.2 |     91.8 |    96.3 |    95.2 |
| lib/                    |    89.7 |     85.4 |    92.1 |    89.7 |
|-------------------------|----------|----------|---------|---------|
| All files              |    92.5 |     87.3 |    94.1 |    92.5 |
```

## 🚀 Performance Testing

### **Load Testing**
- **Tool**: Artillery or k6
- **Targets**: API endpoints, database operations
- **Metrics**: Response time, throughput, error rates

### **Stress Testing**
- **Smart Contracts**: Gas usage optimization
- **Frontend**: Bundle size and load time
- **Backend**: Database performance and scaling

### **Performance Benchmarks**
```javascript
// Performance test example
describe('Campaign API Performance', () => {
  it('should handle 100 concurrent requests', async () => {
    const startTime = Date.now();
    
    const promises = Array(100).fill().map(() =>
      request(app).get('/api/campaigns')
    );
    
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    const avgResponseTime = (endTime - startTime) / 100;
    
    expect(avgResponseTime).toBeLessThan(200); // 200ms target
    expect(responses.every(r => r.status === 200)).toBe(true);
  });
});
```

## 🔄 Continuous Integration

### **CI/CD Pipeline**
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd fundflow-smartcontract && npm ci
        cd ../fundflow-frontend && npm ci
        cd ../fundflow-server && npm ci
    
    - name: Run smart contract tests
      run: |
        cd fundflow-smartcontract
        npm run test
        npm run test:coverage
    
    - name: Run frontend tests
      run: |
        cd fundflow-frontend
        npm run test:coverage
    
    - name: Run backend tests
      run: |
        cd fundflow-server
        npm run test:coverage
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
```

### **Pre-commit Hooks**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:quick",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.sol": [
      "solhint --fix"
    ]
  }
}
```

## 📚 Testing Best Practices

### **Test Organization**
- **Descriptive Names**: Use clear, descriptive test names
- **Arrange-Act-Assert**: Follow AAA pattern for test structure
- **Test Isolation**: Each test should be independent
- **Meaningful Assertions**: Test behavior, not implementation

### **Mocking Strategy**
- **External Dependencies**: Mock external services and APIs
- **Database**: Use test database or in-memory database
- **Time**: Mock time-dependent operations
- **Randomness**: Control random values for deterministic tests

### **Error Testing**
- **Happy Path**: Test successful operations
- **Error Cases**: Test error handling and edge cases
- **Boundary Conditions**: Test limits and boundaries
- **Invalid Input**: Test with invalid data

## 🐛 Troubleshooting

### **Common Test Issues**

#### **Smart Contract Tests**
```bash
# Gas limit issues
export HARDHAT_GAS_LIMIT=8000000

# Network issues
export HEDERA_NETWORK=testnet

# Account issues
export HEDERA_OPERATOR_ID=your-operator-id
export HEDERA_OPERATOR_KEY=your-operator-key
```

#### **Frontend Tests**
```bash
# Environment issues
cp .env.example .env.test

# Mock service worker issues
npm run test:setup
```

#### **Backend Tests**
```bash
# Database connection issues
export MONGODB_URI=mongodb://localhost:27017/fundflow_test

# Port conflicts
export PORT=5001
```

### **Debugging Tests**
```bash
# Run tests with verbose output
npm run test -- --verbose

# Run single test with debugging
npm run test -- --runInBand --detectOpenHandles

# Debug specific test file
npm run test -- FundFlowCore.test.js --runInBand
```

## 📖 Additional Resources

### **Documentation**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

### **Community**
- [FundFlow Discord](https://discord.gg/fundflow)
- [Jest Community](https://discord.gg/jest)
- [React Testing Community](https://discord.gg/react-testing)

---

**FundFlow Testing Strategy** ensures code quality, security, and reliability across all platform components. 🚀

