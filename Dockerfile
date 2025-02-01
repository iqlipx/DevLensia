# Stage 1: Build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the application (this will create the "dist" folder)
RUN npm run build

# Stage 2: Serve the app and run the proxy server
FROM node:18-alpine

# Install global packages:
# - serve: to serve the static build folder
# - cors-anywhere: to run a proxy server that bypasses CORS restrictions
# - concurrently: to run both commands simultaneously
RUN npm install -g serve cors-anywhere concurrently

# Set working directory
WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

# Expose two ports:
# - Port 3000 for serving the built app
# - Port 8080 for the proxy server
EXPOSE 3000 8080

# The CMD will start both servers concurrently.
# The static server runs with: serve -s dist -l 3000
# The proxy server runs on port 8080.
CMD concurrently "serve -s dist -l 3000" "cors-anywhere --port 8080"
