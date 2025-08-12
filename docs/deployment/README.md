# FundFlow Deployment Guide

## 🎯 Overview

This guide covers the complete deployment process for FundFlow, from development environment setup to production deployment on Hedera mainnet. The deployment process includes smart contracts, frontend, backend, and infrastructure components.

## 🏗️ Deployment Architecture

### **Production Environment**
```
Internet
    │
    ▼
┌─────────────────┐
│   Load Balancer │
│   (Cloudflare)  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Frontend      │
│   (Vercel/Netlify) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Backend API   │
│   (DigitalOcean) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Database      │
│   (MongoDB Atlas) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Hedera        │
│   Mainnet       │
└─────────────────┘
```

### **Development Environment**
```
Local Development
    │
    ▼
┌─────────────────┐
│   Frontend      │
│   (localhost:3000) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Backend       │
│   (localhost:5000) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Local DB      │
│   (MongoDB)    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│   Hedera        │
│   Testnet       │
└─────────────────┘
```

## 🔧 Prerequisites

### **Required Accounts & Services**
- **Hedera Account**: Testnet and mainnet accounts with HBAR
- **Cloud Provider**: DigitalOcean, AWS, or similar
- **Domain Name**: Custom domain for production
- **SSL Certificate**: Let's Encrypt or paid certificate
- **Monitoring**: Sentry, LogRocket, or similar

### **Required Software**
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **Git**: Version control
- **Docker**: Containerization (optional)
- **Hardhat**: Smart contract deployment

### **Required Environment Variables**
```env
# Hedera Configuration
HEDERA_NETWORK=mainnet
HEDERA_OPERATOR_ID=your-operator-id
HEDERA_OPERATOR_KEY=your-operator-key
HEDERA_MIRROR_NODE=https://mainnet-public.mirrornode.hedera.com

# Database Configuration
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fundflow_prod
REDIS_URL=redis://redis:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Wallet Configuration
WALLET_CONNECT_PROJECT_ID=your-project-id
HASHPACK_APP_NAME=FundFlow

# API Configuration
API_BASE_URL=https://api.fundflow.io
FRONTEND_URL=https://fundflow.io

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

## 🚀 Smart Contract Deployment

### **1. Prepare Hedera Account**

```bash
# Create Hedera account (if not exists)
# Visit: https://portal.hedera.com/

# Get account ID and private key
# Ensure sufficient HBAR for deployment
```

### **2. Configure Environment**

```bash
cd fundflow-smartcontract

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Environment Configuration:**
```env
# Hedera Network
HEDERA_NETWORK=mainnet

# Operator Account
HEDERA_OPERATOR_ID=0.0.12345
HEDERA_OPERATOR_KEY=your-private-key

# Contract Owner
CONTRACT_OWNER_ID=0.0.12345
CONTRACT_OWNER_KEY=your-private-key

# Gas Configuration
HARDHAT_GAS_LIMIT=8000000
HARDHAT_GAS_PRICE=1000000000
```

### **3. Deploy Smart Contracts**

```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to mainnet
npm run deploy:mainnet
```

**Deployment Script:**
```javascript
// scripts/deploy-mainnet.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying FundFlow contracts to mainnet...");
  
  // Deploy FundFlowCore
  const FundFlowCore = await hre.ethers.getContractFactory("FundFlowCore");
  const fundFlowCore = await FundFlowCore.deploy();
  await fundFlowCore.deployed();
  
  console.log("FundFlowCore deployed to:", fundFlowCore.address);
  
  // Deploy other contracts...
  
  // Verify contracts on Hedera
  await hre.run("verify:verify", {
    address: fundFlowCore.address,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### **4. Verify Deployment**

```bash
# Check contract addresses
cat deployments/mainnet.json

# Verify on Hedera Explorer
# Visit: https://hashscan.io/mainnet
```

## 🌐 Frontend Deployment

### **Option 1: Vercel (Recommended)**

#### **1. Prepare for Deployment**

```bash
cd fundflow-frontend

# Build application
npm run build

# Test build locally
npm run start
```

#### **2. Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **3. Configure Environment Variables**

In Vercel dashboard:
```env
NEXT_PUBLIC_HEDERA_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your-mainnet-contract-address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_HASHPACK_APP_NAME=FundFlow
NEXT_PUBLIC_METAMASK_CHAIN_ID=295
NEXT_PUBLIC_API_URL=https://api.fundflow.io
```

#### **4. Custom Domain Setup**

```bash
# Add custom domain in Vercel
vercel domains add fundflow.io

# Configure DNS records
# A record: 76.76.19.67
# CNAME record: www -> fundflow.io
```

### **Option 2: Netlify**

#### **1. Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### **2. Environment Configuration**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_HEDERA_NETWORK = "mainnet"
  NEXT_PUBLIC_CONTRACT_ADDRESS = "your-contract-address"
```

### **Option 3: Self-Hosted**

#### **1. Build Application**

```bash
cd fundflow-frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Create production bundle
npm run export
```

#### **2. Deploy to Server**

```bash
# Copy build files to server
scp -r out/* user@server:/var/www/fundflow/

# Configure Nginx
sudo nano /etc/nginx/sites-available/fundflow
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name fundflow.io www.fundflow.io;
    
    root /var/www/fundflow;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## 🔧 Backend Deployment

### **Option 1: DigitalOcean Droplet**

#### **1. Create Droplet**

```bash
# Create Ubuntu 22.04 droplet
# Minimum specs: 2GB RAM, 1 CPU, 50GB SSD
```

#### **2. Server Setup**

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

#### **3. Deploy Application**

```bash
# Clone repository
git clone https://github.com/yourusername/fundflow.git
cd fundflow/fundflow-server

# Install dependencies
npm ci

# Create environment file
cp .env.example .env
nano .env
```

**Production Environment:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fundflow_prod
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
HEDERA_NETWORK=mainnet
HEDERA_OPERATOR_ID=your-operator-id
HEDERA_OPERATOR_KEY=your-operator-key
```

#### **4. Start Application**

```bash
# Build application
npm run build

# Start with PM2
pm2 start dist/index.js --name "fundflow-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### **5. Configure Nginx**

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/fundflow-api
```

**API Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.fundflow.io;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/fundflow-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **Option 2: Docker Deployment**

#### **1. Create Docker Compose**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  api:
    build: ./fundflow-server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/fundflow_prod
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

#### **2. Deploy with Docker**

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔐 SSL Certificate Setup

### **Let's Encrypt (Free)**

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Obtain certificate
certbot --nginx -d fundflow.io -d www.fundflow.io
certbot --nginx -d api.fundflow.io

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Paid Certificate**

```bash
# Upload certificate files
sudo mkdir -p /etc/nginx/ssl
sudo cp your-certificate.crt /etc/nginx/ssl/
sudo cp your-private-key.key /etc/nginx/ssl/

# Update Nginx configuration
sudo nano /etc/nginx/sites-available/fundflow
```

**SSL Configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name fundflow.io www.fundflow.io;
    
    ssl_certificate /etc/nginx/ssl/your-certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/your-private-key.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name fundflow.io www.fundflow.io;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoring & Logging

### **Application Monitoring**

#### **PM2 Monitoring**

```bash
# Monitor application
pm2 monit

# View logs
pm2 logs fundflow-api

# Restart application
pm2 restart fundflow-api
```

#### **Sentry Integration**

```javascript
// fundflow-server/src/app.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Error handling
app.use(Sentry.Handlers.errorHandler());
```

### **System Monitoring**

#### **Install Monitoring Tools**

```bash
# Install htop for system monitoring
apt install htop -y

# Install nginx status module
apt install nginx-module-status -y

# Configure nginx status
echo "location /nginx_status { stub_status; }" >> /etc/nginx/sites-available/fundflow-api
```

#### **Log Rotation**

```bash
# Configure log rotation
nano /etc/logrotate.d/fundflow

# Add configuration
/var/log/fundflow/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

## 🚨 Backup & Recovery

### **Database Backup**

```bash
# Create backup script
nano /root/backup-mongo.sh
```

**Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb"
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db fundflow_prod --out $BACKUP_DIR/fundflow_$DATE

# Compress backup
tar -czf $BACKUP_DIR/fundflow_$DATE.tar.gz $BACKUP_DIR/fundflow_$DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/fundflow_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "fundflow_*.tar.gz" -mtime +7 -delete

echo "Backup completed: fundflow_$DATE.tar.gz"
```

```bash
# Make executable
chmod +x /root/backup-mongo.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /root/backup-mongo.sh
```

### **Application Backup**

```bash
# Backup application files
tar -czf /backup/app/fundflow_$(date +%Y%m%d).tar.gz /var/www/fundflow/

# Backup configuration files
tar -czf /backup/config/fundflow_config_$(date +%Y%m%d).tar.gz /etc/nginx/sites-available/ /etc/nginx/sites-enabled/
```

## 🔄 CI/CD Pipeline

### **GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/fundflow
          git pull origin main
          npm ci
          npm run build
          pm2 restart fundflow-api
```

### **Deployment Commands**

```bash
# Manual deployment
ssh user@server "cd /var/www/fundflow && git pull origin main && npm ci && npm run build && pm2 restart fundflow-api"

# Rollback deployment
ssh user@server "cd /var/www/fundflow && git checkout HEAD~1 && npm ci && npm run build && pm2 restart fundflow-api"
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Smart Contract Deployment**
```bash
# Insufficient HBAR
# Solution: Add more HBAR to account

# Network issues
# Solution: Check Hedera network status

# Gas limit issues
# Solution: Increase gas limit in hardhat config
```

#### **Frontend Deployment**
```bash
# Build errors
# Solution: Check environment variables and dependencies

# 404 errors
# Solution: Configure proper routing in hosting platform
```

#### **Backend Deployment**
```bash
# Port conflicts
# Solution: Check if port 5000 is available

# Database connection
# Solution: Verify MongoDB is running and accessible

# Permission issues
# Solution: Check file permissions and ownership
```

### **Debug Commands**

```bash
# Check application status
pm2 status
pm2 logs fundflow-api

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check MongoDB status
sudo systemctl status mongod
mongo --eval "db.serverStatus()"

# Check system resources
htop
df -h
free -h
```

## 📚 Additional Resources

### **Documentation**
- [Hedera Deployment Guide](https://docs.hedera.com/guides/getting-started/deploy-your-first-smart-contract)
- [Vercel Deployment](https://vercel.com/docs)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Nginx Documentation](https://nginx.org/en/docs/)

### **Community Support**
- [FundFlow Discord](https://discord.gg/fundflow)
- [Hedera Discord](https://discord.gg/hedera)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**FundFlow Deployment Guide** provides comprehensive instructions for deploying the platform to production environments. 🚀
