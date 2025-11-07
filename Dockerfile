FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install --legacy-peer-deps --verbose

# Copy source code
COPY . .

# Build the application (if applicable - adjust command based on your build process)
RUN npm run build


# --- Stage 2: Production Stage ---
FROM node:18-alpine AS production

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./

# Install only production dependencies
RUN npm install --legacy-peer-deps --production --verbose

# Show Node version
RUN node -v

# Show npm version
RUN npm -v

# Set environment variables (can also be passed at runtime)
ENV NODE_ENV production
# Example:  ENV PORT 3000

# Expose the port your application listens on
EXPOSE 3000

# Define the command to start the application
CMD ["node", "dist/index.js"]