#!/bin/bash

# ServiceHub AI Deployment Script
set -e

echo "🚀 Starting ServiceHub AI deployment..."

# Configuration
IMAGE_NAME="servicehub-ai"
CONTAINER_NAME="servicehub-ai-app"
PORT=${PORT:-5000}
ENV=${NODE_ENV:-production}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    log_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing container
log_info "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Remove old image
log_info "Removing old image..."
docker rmi $IMAGE_NAME:latest 2>/dev/null || true

# Build new image
log_info "Building new Docker image..."
docker build -t $IMAGE_NAME:latest .

# Run container
log_info "Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:5000 \
    -e NODE_ENV=$ENV \
    -e PORT=5000 \
    --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1" \
    --health-interval=30s \
    --health-timeout=10s \
    --health-retries=3 \
    --health-start-period=40s \
    $IMAGE_NAME:latest

# Wait for container to be healthy
log_info "Waiting for container to be healthy..."
timeout=120
counter=0

while [ $counter -lt $timeout ]; do
    if docker inspect --format='{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null | grep -q "healthy"; then
        log_info "✅ Container is healthy!"
        break
    fi
    
    if [ $counter -eq 0 ]; then
        echo -n "Waiting"
    else
        echo -n "."
    fi
    
    sleep 2
    counter=$((counter + 2))
done

echo "" # New line

if [ $counter -ge $timeout ]; then
    log_error "❌ Container failed to become healthy within $timeout seconds"
    log_info "Container logs:"
    docker logs $CONTAINER_NAME --tail 50
    exit 1
fi

# Show container status
log_info "Container status:"
docker ps --filter name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Show application URL
log_info "🎉 ServiceHub AI is now running!"
log_info "📱 Application: http://localhost:$PORT"
log_info "🏥 Health check: http://localhost:$PORT/health"
log_info "📊 API status: http://localhost:$PORT/api/status"

# Show logs
log_info "Recent logs:"
docker logs $CONTAINER_NAME --tail 10

log_info "✅ Deployment completed successfully!"
log_info "To view logs: docker logs -f $CONTAINER_NAME"
log_info "To stop: docker stop $CONTAINER_NAME"
