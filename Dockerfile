# ── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Install production deps and generate Prisma client
RUN npm ci --omit=dev && npx prisma generate

COPY --from=builder /app/dist ./dist

# Create logs directory and grant write access to the non-root node user
RUN mkdir -p logs && chown node:node logs

EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]
