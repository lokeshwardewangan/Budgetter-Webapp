# syntax=docker/dockerfile:1.7
#
# Client image — multi-stage:
#   1) "deps"  installs node_modules with cache-friendly layering
#   2) "build" runs `vite build` to produce static assets in /app/dist
#   3) "runtime" serves those assets with nginx:alpine (final image, ~25 MB)
#
# Build context: ./client (see docker-compose.yml). Build-time vars (anything
# Vite needs to inline into the bundle) are passed via `args` from compose.

# ---------- 1) deps ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

# Copy only manifests first so this layer is cached unless deps change.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- 2) build ---------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Vite inlines VITE_* variables at build time, so they must be ARGs (not runtime env).
# Pass them from docker-compose `build.args`. Defaults keep `docker build` standalone.
ARG VITE_BUDGETTER_API_HOST=/api
ARG VITE_CONTACT_FORM_HOST_URL=
ARG VITE_GOOGLE_CLIENT_ID=
ARG VITE_SENTRY_DSN=
ARG VITE_BUDGETTER_ADMIN_PASSWORD=

ENV VITE_BUDGETTER_API_HOST=$VITE_BUDGETTER_API_HOST \
    VITE_CONTACT_FORM_HOST_URL=$VITE_CONTACT_FORM_HOST_URL \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_SENTRY_DSN=$VITE_SENTRY_DSN \
    VITE_BUDGETTER_ADMIN_PASSWORD=$VITE_BUDGETTER_ADMIN_PASSWORD \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ---------- 3) runtime -------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Drop the default site config and ship our SPA + /api reverse-proxy config.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets only — no node_modules, no source — final image stays small.
COPY --from=build /app/dist /usr/share/nginx/html

# Run as the unprivileged "nginx" user (image already creates it).
# nginx:alpine listens on 80; expose for clarity (compose maps to host).
EXPOSE 80

# wget is available in nginx:alpine; healthcheck hits the SPA root.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
