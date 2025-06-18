#Docker Setup for Orderly Bite

This guide explains how to run the Orderly Bite application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

```bash
docker build -t orderly-bite .
```

## Running the Container

### Option 1: Using Docker directly

Run with default port (5000):
```bash
docker run -p 3000:5000 orderly-bite
```

Run with custom port (e.g., port 8080 inside container, accessible on host port 3000):
```bash
docker run -p 3000:8080 -e PORT=8080 orderly-bite
```

Run with environment variables:
```bash
docker run -p 3000:5000 \
  -e PORT=5000 \
  -e OPENAI_API_KEY=your_openai_key \
  -e TWILIO_ACCOUNT_SID=your_twilio_sid \
  -e TWILIO_AUTH_TOKEN=your_twilio_token \
  orderly-bite
```

### Option 2: Using Docker Compose

Create a `.env` file in the project root:
```env
HOST_PORT=3000
CONTAINER_PORT=5000
OPENAI_API_KEY=your_openai_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid_here
TWILIO_AUTH_TOKEN=your_twilio_token_here
```

Run with Docker Compose:
```bash
docker-compose up -d
```

## Port Configuration

- **HOST_PORT**: The port on your host machine (default: 3000)
- **CONTAINER_PORT**: The port inside the Docker container (default: 5000)
- **PORT environment variable**: Must match CONTAINER_PORT

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Port number for the application | No (default: 5000) |
| NODE_ENV | Environment mode | No (default: production) |
| OPENAI_API_KEY | OpenAI API key for AI recommendations | Yes* |
| TWILIO_ACCOUNT_SID | Twilio Account SID for SMS/voice | Yes* |
| TWILIO_AUTH_TOKEN | Twilio Auth Token | Yes* |

*Required for full functionality

## Accessing the Application

Once running, access the application at:
- http://localhost:3000 (or your chosen HOST_PORT)

## Stopping the Container

Using Docker:
```bash
docker stop <container_id>
```

Using Docker Compose:
```bash
docker-compose down
```

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (nginx, traefik)
2. Setting up proper logging
3. Configuring health checks
4. Using Docker secrets for sensitive data
5. Setting up proper backup strategies

## Troubleshooting

1. **Port already in use**: Change the HOST_PORT in your command or .env file
2. **Permission denied**: Ensure Docker daemon is running
3. **Build fails**: Check that all dependencies are properly installed

## Example Production Setup

```bash
# Build the image
docker build -t orderly-bite:latest .

# Run in production
docker run -d \
  --name orderly-bite-prod \
  --restart unless-stopped \
  -p 80:5000 \
  -e PORT=5000 \
  -e NODE_ENV=production \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  -e TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID \
  -e TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN \
  orderly-bite:latest
```
