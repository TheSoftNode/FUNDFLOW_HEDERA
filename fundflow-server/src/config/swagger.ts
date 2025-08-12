import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FundFlow API',
      version: '1.0.0',
      description: 'Enterprise-grade API for FundFlow - Blockchain-powered startup fundraising platform',
      contact: {
        name: 'FundFlow Team',
        email: 'support@fundflow.io',
        url: 'https://fundflow.io'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.fundflow.io',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Campaign: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Campaign ID' },
            creator: { type: 'string', description: 'Creator wallet address' },
            title: { type: 'string', description: 'Campaign title' },
            description: { type: 'string', description: 'Campaign description' },
            targetAmount: { type: 'string', description: 'Target funding amount in wei' },
            raisedAmount: { type: 'string', description: 'Current raised amount in wei' },
            deadline: { type: 'number', description: 'Campaign deadline timestamp' },
            status: { type: 'number', description: 'Campaign status (0: Draft, 1: Active, 2: Funded, 3: Cancelled)' },
            category: { type: 'string', description: 'Campaign category' },
            imageUrl: { type: 'string', description: 'Campaign image URL' },
            videoUrl: { type: 'string', description: 'Campaign video URL' },
            documents: { type: 'array', items: { type: 'string' }, description: 'Document URLs' },
            socialLinks: { type: 'array', items: { type: 'string' }, description: 'Social media links' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Campaign tags' },
            createdAt: { type: 'number', description: 'Creation timestamp' },
            updatedAt: { type: 'number', description: 'Last update timestamp' }
          },
          required: ['creator', 'title', 'description', 'targetAmount', 'deadline', 'category']
        },
        Investment: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Investment ID' },
            campaignId: { type: 'number', description: 'Campaign ID' },
            investor: { type: 'string', description: 'Investor wallet address' },
            amount: { type: 'string', description: 'Investment amount in wei' },
            timestamp: { type: 'number', description: 'Investment timestamp' },
            transactionId: { type: 'string', description: 'Hedera transaction ID' }
          },
          required: ['campaignId', 'investor', 'amount']
        },
        Milestone: {
          type: 'object',
          properties: {
            id: { type: 'number', description: 'Milestone ID' },
            campaignId: { type: 'number', description: 'Campaign ID' },
            title: { type: 'string', description: 'Milestone title' },
            description: { type: 'string', description: 'Milestone description' },
            targetAmount: { type: 'string', description: 'Milestone target amount in wei' },
            deadline: { type: 'number', description: 'Milestone deadline timestamp' },
            status: { type: 'number', description: 'Milestone status' },
            votingDeadline: { type: 'number', description: 'Voting deadline timestamp' },
            votesFor: { type: 'number', description: 'Number of votes for' },
            votesAgainst: { type: 'number', description: 'Number of votes against' },
            totalVotingPower: { type: 'number', description: 'Total voting power' },
            executed: { type: 'boolean', description: 'Whether milestone is executed' },
            executedAt: { type: 'number', description: 'Execution timestamp' }
          },
          required: ['campaignId', 'title', 'description', 'targetAmount', 'deadline', 'votingDeadline']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            walletAddress: { type: 'string', description: 'Wallet address' },
            email: { type: 'string', description: 'Email address' },
            username: { type: 'string', description: 'Username' },
            role: { type: 'string', enum: ['startup', 'investor', 'admin'], description: 'User role' },
            profile: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                bio: { type: 'string' },
                avatar: { type: 'string' },
                company: { type: 'string' },
                website: { type: 'string' },
                location: { type: 'string' }
              }
            },
            isVerified: { type: 'boolean', description: 'Whether user is verified' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' },
            code: { type: 'string', description: 'Error code' },
            details: { type: 'object', description: 'Additional error details' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', description: 'Success status' },
            message: { type: 'string', description: 'Success message' },
            data: { type: 'object', description: 'Response data' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Campaigns',
        description: 'Campaign management endpoints'
      },
      {
        name: 'Investments',
        description: 'Investment management endpoints'
      },
      {
        name: 'Milestones',
        description: 'Milestone management endpoints'
      },
      {
        name: 'Analytics',
        description: 'Platform analytics endpoints'
      },
      {
        name: 'Governance',
        description: 'Governance and voting endpoints'
      },
      {
        name: 'Blockchain',
        description: 'Blockchain interaction endpoints'
      },
      {
        name: 'Health',
        description: 'Health check and system status endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/models/*.ts'
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
