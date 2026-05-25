# syntax=docker/dockerfile:1.7
#
# Server image — node:22-alpine, three stages:
#   1) "deps"    installs ALL node_modules (incl. devDeps for `tsc`).
#   2) "build"   runs `npm run build` → ./dist (compiled JS).
#   3) "runtime" copies prod-only modules + dist + assets into a slim layer
#                and runs the app as the non-root `node` user.
#
# Build context: ./server (see docker-compose.yml).

# ---------- 1) deps ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- 2) build ---------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3) runtime -------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# Tini gives proper PID 1 signal handling so SIGTERM from `docker stop`
# reaches Node and graceful shutdown actually happens.
RUN apk add --no-cache tini

ENV NODE_ENV=production \
    PORT=5000

# Prod-only modules (smaller image, no build tooling).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
 && npm cache clean --force

# Compiled JS + static assets.
COPY --from=build /app/dist ./dist
COPY public ./public

RUN chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]
