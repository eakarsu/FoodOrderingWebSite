# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build the client application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies and express
RUN npm ci --only=production && npm install express && npm cache clean --force

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist

# Copy server file and other necessary files
COPY --chown=nextjs:nodejs ./server.js ./
COPY --chown=nextjs:nodejs ./shared ./shared

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD node -e "const http = require('http'); const options = { host: 'localhost', port: process.env.PORT || 5000, timeout: 2000 }; const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); req.on('error', () => process.exit(1)); req.end();"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies and security updates
RUN apk add --no-cache \
    dumb-init \
    tini \
    && apk upgrade --no-cache

# Set working directory
WORKDIR /app

# Create a non-root user with specific UID/GID
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --frozen-lockfile && \
    npm install express compression helmet cors && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/*

# Copy built application from builder stage
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist

# Copy server files and other necessary files
COPY --chown=appuser:nodejs ./server ./server
COPY --chown=appuser:nodejs ./shared ./shared

# Create server.js for production
COPY --chown=appuser:nodejs <<'EOF' ./server.js
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "https:", "wss:", "ws:"],
      mediaSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Enable compression
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com', 'https://www.your-domain.com']
    : true,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'ServiceHub AI API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Handle client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 ServiceHub AI server running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check available at: http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.error('⏰ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

module.exports = app;
EOF

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/tmp && \
    chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose port (configurable via environment)
EXPOSE ${PORT:-5000}

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=1024" \
    NPM_CONFIG_CACHE=/tmp/.npm

# Add labels for better container management
LABEL maintainer="ServiceHub AI Team" \
      version="1.0.0" \
      description="AI-powered multi-sector service platform" \
      org.opencontainers.image.source="https://github.com/your-org/servicehub-ai"

# Health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e " \
        const http = require('http'); \
        const options = { \
            hostname: '127.0.0.1', \
            port: process.env.PORT || 5000, \
            path: '/health', \
            timeout: 5000, \
            method: 'GET' \
        }; \
        const req = http.request(options, (res) => { \
            console.log('Health check status:', res.statusCode); \
            process.exit(res.statusCode === 200 ? 0 : 1); \
        }); \
        req.on('error', (err) => { \
            console.error('Health check failed:', err.message); \
            process.exit(1); \
        }); \
        req.on('timeout', () => { \
            console.error('Health check timeout'); \
            req.destroy(); \
            process.exit(1); \
        }); \
        req.end();" || exit 1

# Use tini as PID 1 for proper signal handling
ENTRYPOINT ["tini", "--"]

# Start the application with proper signal handling
CMD ["node", "server.js"]
