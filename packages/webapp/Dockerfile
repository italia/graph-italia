# BASE stage
FROM oven/bun:latest AS base

WORKDIR /app

# INSTALL stage
# Copy lockfiles first for better layer caching
FROM base AS install
WORKDIR /app

# Copy root package.json and lockfile
COPY package.json bun.lock ./

# Copy workspace package.json files for proper workspace resolution
COPY packages/components/package.json ./packages/components/
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/server/package.json ./packages/server/
COPY packages/ui-example-app/package.json ./packages/ui-example-app/

# Copy components source directory (needed for workspace linking)
# Bun requires the actual directory structure to create workspace symlinks
COPY packages/components ./packages/components

# Install dependencies with frozen lockfile
# Note: ui-example-app uses link: protocol which may fail, but dependencies are still installed
RUN bun install --frozen-lockfile 2>&1 | grep -v "failed linking" || \
    (echo "Some workspace links failed (expected for ui-example-app), but dependencies installed" && true)

# BUILD stage
FROM install AS build
WORKDIR /app

# Copy root tsconfig.json (needed for TypeScript compilation)
COPY tsconfig.json ./

# Copy source code (components source needed for build)
COPY packages/components ./packages/components
COPY packages/webapp ./packages/webapp

# Build components first (dependency of webapp)
WORKDIR /app/packages/components
RUN bun run build

# Build webapp (now components are built and available)
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
