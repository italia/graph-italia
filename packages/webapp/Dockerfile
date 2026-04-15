# BASE stage
FROM oven/bun:latest AS base

WORKDIR /app

# INSTALL stage
FROM base AS install
WORKDIR /app

# Copy root package.json only (no lockfile - regenerated without link: deps)
COPY package.json ./

# Copy workspace package.json files (exclude ui-example-app with link: protocol)
COPY packages/components/package.json ./packages/components/
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/server/package.json ./packages/server/

# Create minimal ui-example-app without link: dependency
RUN mkdir -p packages/ui-example-app && \
    echo '{"name":"graph-italia-uiexampleapp","private":true}' > packages/ui-example-app/package.json

# Copy components source directory (needed for workspace linking)
COPY packages/components ./packages/components

# Install dependencies
RUN bun install

# BUILD stage
FROM install AS build
WORKDIR /app

# Copy root tsconfig.json (needed for TypeScript compilation)
COPY tsconfig.json ./

# Copy source code
COPY packages/components ./packages/components
COPY packages/webapp ./packages/webapp

# Build components (rollup is in components/node_modules)
WORKDIR /app/packages/components
RUN bun node_modules/rollup/dist/bin/rollup -c

# Build webapp
WORKDIR /app/packages/webapp
RUN bun run build

# RELEASE stage
FROM nginx:1.27-alpine AS release

COPY --from=build /app/packages/webapp/dist /usr/share/nginx/html
COPY packages/webapp/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
