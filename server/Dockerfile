# Build stage
FROM node:20-alpine AS build

WORKDIR /

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (adjust if your server uses a different port)
EXPOSE 8001

# Start the application
CMD ["npm", "run", "dev"]
