import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { connectDatabase, checkDatabaseHealth } from './config/database';
import { connectRedis } from './config/redis';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import { specs, swaggerUi } from './config/swagger';
import { config, validateConfig } from './config/environment';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import campaignRoutes from './routes/campaignRoutes';
import blockchainRoutes from './routes/blockchainRoutes';
import fundflowRoutes from './routes/fundflowRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const PORT = config.PORT;

// Validate configuration
try {
  validateConfig();
  logger.info('Configuration validated successfully');
} catch (error) {
  logger.error('Configuration validation failed:', error);
  process.exit(1);
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const isHealthy = await checkDatabaseHealth();

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      database: {
        healthy: isHealthy,
        message: isHealthy ? 'Database connection is healthy' : 'Database connection failed'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FundFlow API Documentation',
  customfavIcon: '/favicon.ico'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/fundflow', fundflowRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    logger.info('Connected to MongoDB');

    // Connect to Redis
    await connectRedis();
    logger.info('Connected to Redis');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

if (require.main === module) {
  startServer();
}

export default app;