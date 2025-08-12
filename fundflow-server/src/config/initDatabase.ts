import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from './environment';

// Import models to ensure they're registered
import '../models/User';
import '../models/Campaign';
import '../models/Investment';
import '../models/Milestone';

export const initializeDatabase = async (): Promise<void> => {
    try {
        logger.info('Initializing database...');

        // Get database instance
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database not connected');
        }

        // Create collections if they don't exist
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        // Ensure required collections exist
        const requiredCollections = ['users', 'campaigns', 'investments', 'milestones'];

        for (const collectionName of requiredCollections) {
            if (!collectionNames.includes(collectionName)) {
                await db.createCollection(collectionName);
                logger.info(`Created collection: ${collectionName}`);
            }
        }

        // Create indexes for better performance
        await createIndexes();

        // Create initial admin user if it doesn't exist
        await createInitialAdminUser();

        logger.info('Database initialization completed successfully');
    } catch (error) {
        logger.error('Database initialization failed:', error);
        throw error;
    }
};

const createIndexes = async (): Promise<void> => {
    try {
        const db = mongoose.connection.db;
        if (!db) return;

        // Users collection indexes
        const usersCollection = db.collection('users');
        await usersCollection.createIndex({ walletAddress: 1 }, { unique: true });
        await usersCollection.createIndex({ accountId: 1 }, { unique: true });
        await usersCollection.createIndex({ role: 1 });
        await usersCollection.createIndex({ 'verification.kyc.status': 1 });

        // Campaigns collection indexes
        const campaignsCollection = db.collection('campaigns');
        await campaignsCollection.createIndex({ creatorAddress: 1 });
        await campaignsCollection.createIndex({ status: 1 });
        await campaignsCollection.createIndex({ category: 1 });
        await campaignsCollection.createIndex({ featured: 1 });
        await campaignsCollection.createIndex({ deadline: 1 });
        await campaignsCollection.createIndex({ 'investments.investorAddress': 1 });
        await campaignsCollection.createIndex({ title: 'text', description: 'text' });

        // Investments collection indexes
        const investmentsCollection = db.collection('investments');
        await investmentsCollection.createIndex({ campaignId: 1 });
        await investmentsCollection.createIndex({ investorAddress: 1 });
        await investmentsCollection.createIndex({ status: 1 });
        await investmentsCollection.createIndex({ transactionId: 1 }, { unique: true });
        await investmentsCollection.createIndex({ timestamp: -1 });

        // Milestones collection indexes
        const milestonesCollection = db.collection('milestones');
        await milestonesCollection.createIndex({ campaignId: 1 });
        await milestonesCollection.createIndex({ status: 1 });
        await milestonesCollection.createIndex({ votingDeadline: 1 });

        logger.info('Database indexes created successfully');
    } catch (error) {
        logger.error('Failed to create indexes:', error);
        throw error;
    }
};

const createInitialAdminUser = async (): Promise<void> => {
    try {
        const db = mongoose.connection.db;
        if (!db) return;

        const usersCollection = db.collection('users');

        // Check if admin user already exists
        const adminExists = await usersCollection.findOne({ role: 'admin' });

        if (!adminExists) {
            const adminUser = {
                walletAddress: '0x0000000000000000000000000000000000000000', // Placeholder
                accountId: '0.0.0', // Placeholder
                walletType: 'hashpack',
                role: 'admin',
                profile: {
                    name: 'FundFlow Admin',
                    email: 'admin@fundflow.io',
                    company: 'FundFlow',
                    jobTitle: 'System Administrator'
                },
                preferences: {
                    interests: ['blockchain', 'startups', 'investing'],
                    goals: ['platform-success'],
                    notifications: {
                        email: true,
                        push: true,
                        marketing: false
                    },
                    privacy: {
                        profileVisibility: 'private',
                        showInvestments: false,
                        showCampaigns: false
                    }
                },
                stats: {},
                verification: {
                    email: { verified: true, verifiedAt: new Date() },
                    kyc: { status: 'approved', approvedAt: new Date() }
                },
                settings: {
                    currency: 'USD',
                    timezone: 'UTC',
                    language: 'en',
                    twoFactorEnabled: false
                },
                lastActive: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await usersCollection.insertOne(adminUser);
            logger.info('Initial admin user created');
        }
    } catch (error) {
        logger.error('Failed to create initial admin user:', error);
        // Don't throw error as this is not critical
    }
};

// Database cleanup and maintenance
export const cleanupDatabase = async (): Promise<void> => {
    try {
        logger.info('Starting database cleanup...');

        const db = mongoose.connection.db;
        if (!db) return;

        // Clean up expired sessions (if you have a sessions collection)
        // Clean up old logs (if you have a logs collection)
        // Clean up temporary files (if you have a files collection)

        logger.info('Database cleanup completed');
    } catch (error) {
        logger.error('Database cleanup failed:', error);
        // Don't throw error as this is not critical
    }
};

// Export database utilities
export const getDatabaseInfo = async () => {
    try {
        const db = mongoose.connection.db;
        if (!db) return null;

        const stats = await db.stats();
        const collections = await db.listCollections().toArray();

        return {
            name: db.databaseName,
            collections: collections.length,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize,
            connections: 'unknown' // Connection pool info not available in newer Mongoose versions
        };
    } catch (error) {
        logger.error('Failed to get database info:', error);
        return null;
    }
};
