// MongoDB initialization script for Docker
// This script runs when the MongoDB container starts for the first time

// Switch to the FundFlow database
db = db.getSiblingDB('fundflow_dev');

// Create a user for the application
db.createUser({
  user: 'fundflow_app',
  pwd: 'fundflow_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'fundflow_dev'
    }
  ]
});

// Create indexes for better performance
db.users.createIndex({ walletAddress: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ 'profile.email': 1 }, { sparse: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ lastActive: -1 });

// Create campaigns collection indexes (for future use)
db.campaigns.createIndex({ creatorAddress: 1 });
db.campaigns.createIndex({ status: 1 });
db.campaigns.createIndex({ industry: 1 });
db.campaigns.createIndex({ deadline: 1 });
db.campaigns.createIndex({ createdAt: -1 });

print('MongoDB initialization completed for FundFlow development database');