FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for native modules (e.g., bcrypt)
RUN apk add --no-cache python3 make g++

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set default node environment
ENV NODE_ENV=production

# Start application
CMD ["node", "src/server.js"]
