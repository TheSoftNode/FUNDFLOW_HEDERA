import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { initializeDatabase } from './initDatabase';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fundflow';

    await mongoose.connect(mongoUri, {
      maxPoolSize: 20, // Increased for production
      minPoolSize: 5, // Maintain minimum connections
      serverSelectionTimeoutMS: 10000, // Increased timeout for cloud MongoDB
      socketTimeoutMS: 45000,
      bufferCommands: false,
      // MongoDB Atlas specific options
      retryWrites: true,
      w: 'majority',
      // Connection pooling and monitoring
      maxIdleTimeMS: 30000,
      // SSL/TLS for cloud MongoDB
      ssl: true,
      tls: true,
      // Authentication
      authSource: 'admin',
      // Read preferences
      readPreference: 'primaryPreferred',
    });

    logger.info('MongoDB connected successfully');

    // Initialize database after successful connection
    await initializeDatabase();

    mongoose.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

// Database health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) {
      return false;
    }
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    return result.ok === 1;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    if (!mongoose.connection.db) {
      return null;
    }
    const stats = await mongoose.connection.db.stats();
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      ok: stats.ok
    };
  } catch (error) {
    logger.error('Failed to get database stats:', error);
    return null;
  }
};