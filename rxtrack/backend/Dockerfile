# syntax=docker/dockerfile:1

# ---- Builder ----
FROM node:22-slim AS builder
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/package.json backend/package-lock.json ./backend/
COPY database ./database

WORKDIR /app/backend
RUN npm ci

COPY backend ./

# prisma.config.ts requires DATABASE_URL to resolve just to load the config —
# this value is never actually connected to, only read at build time.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npm run prisma:generate
RUN npm run build
RUN npm prune --omit=dev

# ---- Runner ----
FROM node:22-slim AS runner
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app/backend

COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/database /app/database

EXPOSE 4000
CMD ["node", "dist/server.js"]