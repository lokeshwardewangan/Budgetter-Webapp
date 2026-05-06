# syntax=docker/dockerfile:1.7
#
# Server image — node:22-alpine, two stages:
#   1) "deps"    installs ONLY production node_modules (devDeps excluded).
#   2) "runtime" copies those modules + source into a fresh slim layer and
#                runs the app as the non-root `node` user.
#
# Build context: ./server (see docker-compose.yml).

# ---------- 1) deps ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Manifests first so this layer is cached unless dependencies change.
COPY package.json package-lock.json ./

# `npm ci --omit=dev` gives a deterministic, devDep-free install — smaller
# image and no build tooling lying around in production.
RUN npm ci --omit=dev --no-audit --no-fund \
 && npm cache clean --force

# ---------- 2) runtime -------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# Tini gives proper PID 1 signal handling so SIGTERM from `docker stop`
# reaches Node and graceful shutdown actually happens.
RUN apk add --no-cache tini

ENV NODE_ENV=production \
    PORT=5000

# Pull in the prod-only modules from the deps stage.
COPY --from=deps /app/node_modules ./node_modules

# App source last — this layer changes most often, so it's at the bottom.
COPY . .

# Drop privileges. The node:alpine image already provides the `node` user.
RUN chown -R node:node /app
USER node

EXPOSE 5000

# Healthcheck hits a lightweight endpoint exposed by the express app
# (see src/app.js — `/healthz`). node's built-in fetch keeps the image
# clean (no curl/wget dependency).
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
