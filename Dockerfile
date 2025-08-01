# Use Node.js runtime
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build

# Expose port

# Start the development server
CMD ["npm", "run", "dev"]
