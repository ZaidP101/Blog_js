FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./

# Install dependencies - leveraging cache
RUN npm install --legacy-peer-deps --verbose

# Copy source code
COPY . .

# Build the application (if applicable)
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
RUN npm install --legacy-peer-deps --production --verbose --omit=dev

# Show Node version
RUN node -v

# Show npm version
RUN npm -v

# Set environment variables
ENV NODE_ENV production

# User to run the application (security best practice)
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose the port your application listens on
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=5m --timeout=3s CMD curl -f http://localhost:3000 || exit 1

# Define the command to start the application
CMD ["node", "dist/index.js"]