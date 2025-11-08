FROM node:18-alpine AS base

WORKDIR /app

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Copy package.json and yarn.lock first for caching
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 60000 || yarn cache clean

# Copy source code
COPY . .

# Build the application
FROM base AS builder

RUN yarn build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./

# Install production dependencies only
RUN yarn install --frozen-lockfile --production --network-timeout 60000 || yarn cache clean

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.js ./
COPY --from=builder /app/.env ./

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Create a non-root user and group
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh nodejs

USER nodejs

#ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "./dist/index.js"]

