FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 60000 || yarn cache clean

COPY . .

# Example build step (adjust based on your project)
# RUN yarn build

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
RUN yarn install --frozen-lockfile --production --network-timeout 60000 || yarn cache clean

COPY --from=builder /app/public ./public
COPY --from=builder /app/index.js ./
COPY --from=builder /app/.env ./ # Consider using Docker secrets for production
#COPY --from=builder /app/dist ./ # Uncomment if you have a dist folder

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000



RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh nodejs

USER nodejs

CMD ["node", "index.js"]