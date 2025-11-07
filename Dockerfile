FROM node:18-alpine AS builder

WORKDIR /app

# Copy package and lock files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies - leveraging caching
RUN yarn install --frozen-lockfile --network-timeout 60000 || yarn cache clean

# Copy source code
COPY . .

# Build the application (if necessary, e.g., for TypeScript projects)
# Example for a project that uses a build step (e.g., TypeScript):
# RUN yarn build

# --- Production Stage ---
FROM node:18-alpine AS production

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/node_modules ./
#COPY --from=builder /app/dist ./   <- If you have a dist folder after build
COPY --from=builder /app/public ./
COPY --from=builder /app/index.js ./  # Or your main entry point
COPY --from=builder /app/.env ./

# Set environment variables (consider using Docker secrets for sensitive data)
ENV NODE_ENV production
ENV PORT 3000
# Define any other environment variables required by your application
# ENV API_KEY=your_api_key

# Expose port
EXPOSE 3000

# User for security (non-root)
RUN addgroup -g 1001 nodejs
RUN adduser -u 1001 -G nodejs -s /bin/sh nodejs
USER nodejs

# Show Node and npm versions before installing
RUN node -v && npm -v
# Show installed packages after install
RUN npm list --depth=0

# Start application
CMD ["node", "index.js"] # Or your startup script using node directly