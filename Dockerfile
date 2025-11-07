FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --network-timeout 60000 || yarn cache clean

COPY . .

RUN yarn build


FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./

RUN yarn install --frozen-lockfile --production --network-timeout 60000 || yarn cache clean

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.js ./
COPY --from=builder /app/.env ./


ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

# Show installed packages after install
RUN npm list --depth=0

# Show Node and npm versions before installing
RUN node -v && npm -v

RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh nodejs

USER nodejs

CMD ["node", "./dist/index.js"]