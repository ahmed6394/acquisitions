# Multi-stage Dockerfile for Node.js acquisitions application

# Base image with Node.js
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries= \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }.on('error', () => { process.exit(1); }));"

# Development stage
FROM base AS development
USER root
RUN npm ci && npm cache clean --force
USER nodejs
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
CMD ["node", "start"]