# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache dumb-init

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile && \
    npm install express compression helmet cors && \
    npm cache clean --force

# Copy built application and server files
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --chown=appuser:nodejs ./server ./server
COPY --chown=appuser:nodejs ./shared ./shared

# Switch to non-root user
USER appuser

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    HOST=0.0.0.0

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "const http = require('http'); const req = http.request({host: 'localhost', port: 5000, path: '/health'}, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); req.on('error', () => process.exit(1)); req.end();"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
