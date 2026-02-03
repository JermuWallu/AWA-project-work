# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run tsc

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Expose port (adjust if your server uses a different port)
EXPOSE 5000

# Start the application
CMD ["node", "dist/app.js"]
