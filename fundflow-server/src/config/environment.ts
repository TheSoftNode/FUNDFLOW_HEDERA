import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface EnvironmentConfig {
    // Server Configuration
    NODE_ENV: string;
    PORT: number;
    API_VERSION: string;

    // Database Configuration
    MONGODB_URI: string;
    MONGODB_DB_NAME: string;
    REDIS_URL: string;

    // JWT Configuration
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;

    // Hedera Configuration
    HEDERA_NETWORK: string;
    HEDERA_ACCOUNT_ID: string;
    HEDERA_PRIVATE_KEY: string;
    HEDERA_OPERATOR_ID: string;
    HEDERA_OPERATOR_KEY: string;

    // Smart Contract Addresses
    FUNDFLOWCORE_ID: string;
    FUNDFLOWCORE_ADDRESS: string;
    CAMPAIGNMANAGER_ID: string;
    CAMPAIGNMANAGER_ADDRESS: string;
    INVESTMENTMANAGER_ID: string;
    INVESTMENTMANAGER_ADDRESS: string;
    MILESTONEMANAGER_ID: string;
    MILESTONEMANAGER_ADDRESS: string;
    ANALYTICSMANAGER_ID: string;
    ANALYTICSMANAGER_ADDRESS: string;
    GOVERNANCEMANAGER_ID: string;
    GOVERNANCEMANAGER_ADDRESS: string;

    // Blockchain Configuration
    GAS_LIMIT: number;
    MAX_TRANSACTION_FEE: string;
    PLATFORM_FEE_PERCENT: number;

    // Frontend Configuration
    FRONTEND_URL: string;
    CORS_ORIGINS: string[];

    // Security Configuration
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    BCRYPT_ROUNDS: number;

    // File Upload Configuration
    MAX_FILE_SIZE: number;
    ALLOWED_FILE_TYPES: string[];
    UPLOAD_PATH: string;

    // Email Configuration
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    FROM_EMAIL: string;

    // AWS Configuration
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_S3_BUCKET: string;

    // Monitoring Configuration
    LOG_LEVEL: string;
    ENABLE_METRICS: boolean;
    METRICS_PORT: number;

    // WebSocket Configuration
    ENABLE_WEBSOCKET: boolean;
    WEBSOCKET_PORT: number;

    // Background Jobs Configuration
    ENABLE_WORKERS: boolean;
    REDIS_QUEUE_PREFIX: string;

    // IPFS Configuration
    IPFS_GATEWAY: string;
    IPFS_API_URL: string;

    // External APIs
    WALLET_CONNECT_PROJECT_ID: string;
    COINGECKO_API_URL: string;
}

export const config: EnvironmentConfig = {
    // Server Configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    API_VERSION: process.env.API_VERSION || 'v1',

    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fundflow',
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'fundflow',
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-development',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-development',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // Hedera Configuration
    HEDERA_NETWORK: process.env.HEDERA_NETWORK || 'testnet',
    HEDERA_ACCOUNT_ID: process.env.HEDERA_ACCOUNT_ID || '',
    HEDERA_PRIVATE_KEY: process.env.HEDERA_PRIVATE_KEY || '',
    HEDERA_OPERATOR_ID: process.env.HEDERA_OPERATOR_ID || '',
    HEDERA_OPERATOR_KEY: process.env.HEDERA_OPERATOR_KEY || '',

    // Smart Contract Addresses
    FUNDFLOWCORE_ID: process.env.FUNDFLOWCORE_ID || '0.0.6558178',
    FUNDFLOWCORE_ADDRESS: process.env.FUNDFLOWCORE_ADDRESS || '00000000000000000000000000000000006411e2',
    CAMPAIGNMANAGER_ID: process.env.CAMPAIGNMANAGER_ID || '0.0.6558181',
    CAMPAIGNMANAGER_ADDRESS: process.env.CAMPAIGNMANAGER_ADDRESS || '00000000000000000000000000000000006411e5',
    INVESTMENTMANAGER_ID: process.env.INVESTMENTMANAGER_ID || '0.0.6558243',
    INVESTMENTMANAGER_ADDRESS: process.env.INVESTMENTMANAGER_ADDRESS || '0000000000000000000000000000000000641223',
    MILESTONEMANAGER_ID: process.env.MILESTONEMANAGER_ID || '0.0.6558245',
    MILESTONEMANAGER_ADDRESS: process.env.MILESTONEMANAGER_ADDRESS || '0000000000000000000000000000000000641225',
    ANALYTICSMANAGER_ID: process.env.ANALYTICSMANAGER_ID || '0.0.6558248',
    ANALYTICSMANAGER_ADDRESS: process.env.ANALYTICSMANAGER_ADDRESS || '0000000000000000000000000000000000641228',
    GOVERNANCEMANAGER_ID: process.env.GOVERNANCEMANAGER_ID || '0.0.6558251',
    GOVERNANCEMANAGER_ADDRESS: process.env.GOVERNANCEMANAGER_ADDRESS || '000000000000000000000000000000000064122b',

    // Blockchain Configuration
    GAS_LIMIT: parseInt(process.env.GAS_LIMIT || '8000000'),
    MAX_TRANSACTION_FEE: process.env.MAX_TRANSACTION_FEE || '20',
    PLATFORM_FEE_PERCENT: parseInt(process.env.PLATFORM_FEE_PERCENT || '250'),

    // Frontend Configuration
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),

    // Security Configuration
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12'),

    // File Upload Configuration
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
    UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

    // Email Configuration
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@fundflow.io',

    // AWS Configuration
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',

    // Monitoring Configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
    METRICS_PORT: parseInt(process.env.METRICS_PORT || '9090'),

    // WebSocket Configuration
    ENABLE_WEBSOCKET: process.env.ENABLE_WEBSOCKET === 'true',
    WEBSOCKET_PORT: parseInt(process.env.WEBSOCKET_PORT || '5001'),

    // Background Jobs Configuration
    ENABLE_WORKERS: process.env.ENABLE_WORKERS === 'true',
    REDIS_QUEUE_PREFIX: process.env.REDIS_QUEUE_PREFIX || 'fundflow',

    // IPFS Configuration
    IPFS_GATEWAY: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    IPFS_API_URL: process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001',

    // External APIs
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID || '',
    COINGECKO_API_URL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'
};

// Validation function
export function validateConfig(): void {
    const requiredFields = [
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
        'HEDERA_OPERATOR_ID',
        'HEDERA_OPERATOR_KEY',
        'FUNDFLOWCORE_ID',
        'CAMPAIGNMANAGER_ID',
        'INVESTMENTMANAGER_ID',
        'MILESTONEMANAGER_ID',
        'ANALYTICSMANAGER_ID',
        'GOVERNANCEMANAGER_ID'
    ];

    for (const field of requiredFields) {
        if (!config[field as keyof EnvironmentConfig]) {
            throw new Error(`Missing required environment variable: ${field}`);
        }
    }
}

// Export default config
export default config;
