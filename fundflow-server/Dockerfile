FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat make g++ python3 linux-headers
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Development stage
FROM base AS dev
RUN apk add --no-cache make g++ python3 linux-headers
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 fundflow

# Copy built application
COPY --from=builder --chown=fundflow:nodejs /app/dist ./dist
COPY --from=builder --chown=fundflow:nodejs /app/package.json ./package.json
COPY --from=deps --chown=fundflow:nodejs /app/node_modules ./node_modules

USER fundflow

EXPOSE 5000

CMD ["node", "dist/server.js"]