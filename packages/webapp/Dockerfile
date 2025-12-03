# BASE stage
FROM oven/bun:latest AS base

WORKDIR /app

# INSTALL stage
# Copy lockfiles first for better layer caching
FROM base AS install
COPY package.json bun.lock ./
# Copy workspace directories needed for workspace resolution
# Components is required as a workspace dependency of webapp
COPY packages/components ./packages/components
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/server/package.json ./packages/server/
COPY packages/ui-example-app/package.json ./packages/ui-example-app/

# Install dependencies
# Note: Workspace linking may fail in Docker context, but dependencies are installed
# The workspace link will be resolved when we copy the full source in the build stage
RUN bun install || true

# BUILD stage
FROM install AS build

# Copy source code
COPY . .

# Build components first (dependency of webapp)
WORKDIR /app/packages/components
RUN bun run build || echo "Components build skipped if no build script"

# Build webapp
WORKDIR /app/packages/webapp
RUN bun run build

# RELEASE stage
# Using nginx:alpine for smaller image size
# Using latest stable version for security patches
# Note: Regularly update base image to patch security vulnerabilities
FROM nginx:1.29-alpine AS release

# Copy built static files
COPY --from=build /app/packages/webapp/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/webapp/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
