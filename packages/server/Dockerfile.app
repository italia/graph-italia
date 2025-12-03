# BASE Stage - Use slim Bun image
FROM oven/bun:1.3.1-slim AS base

# Install Node.js only for Prisma generation (will be removed in final stage)
# Reference: https://github.com/oven-sh/bun/issues/4848
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ARG NODE_VERSION=20
RUN curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n -o /tmp/n && \
    bash /tmp/n ${NODE_VERSION} && \
    rm /tmp/n && \
    npm install -g n && \
    rm -rf /tmp/* /var/tmp/*

# INSTALL Stage - Install ALL dependencies (needed for Prisma generate)
FROM base AS install
WORKDIR /temp/prod/

# Copy lockfiles first for better layer caching
COPY package.json bun.lock ./
# Copy workspace package.json files for proper workspace resolution
COPY packages/components/package.json ./packages/components/
COPY packages/server/package.json packages/server/bun.lockb ./packages/server/
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/ui-example-app/package.json ./packages/ui-example-app/

# Install all dependencies (needed for Prisma CLI)
# Note: ui-example-app uses link: protocol which may fail, but dependencies are still installed
RUN bun install --frozen-lockfile 2>&1 | grep -v "failed linking" || \
    (echo "Some workspace links failed (expected for ui-example-app), but dependencies installed" && true) && \
    # Clean Bun cache
    rm -rf ~/.bun/install/cache/* && \
    # Remove unnecessary files from node_modules
    find node_modules -type d \( -name "test" -o -name "tests" -o -name "__tests__" -o -name "*.test.*" \) -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -type f \( -name "*.md" -o -name "*.map" -o -name "*.ts" ! -path "*/types/*" \) -delete 2>/dev/null || true

# BUILD Stage
# Generate Prisma Client and prepare application
FROM install AS build
WORKDIR /usr/src/app

# Copy node_modules from install stage
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=install /temp/prod/packages/server/node_modules ./packages/server/node_modules

# Copy Prisma schema and generate client
# Note: Only schema.prisma is needed for client generation, not prisma.config.ts
COPY packages/server/prisma/schema.prisma ./packages/server/prisma/

WORKDIR /usr/src/app/packages/server
# Generate Prisma client - DATABASE_URL not required for generation
# Prisma generate only needs the schema file, not a database connection
RUN npx prisma generate --schema=prisma/schema.prisma

# Copy application code
WORKDIR /usr/src/app
COPY packages/server ./packages/server

# PRODUCTION DEPS Stage - Clean production dependencies from install stage
FROM install AS prod-deps
WORKDIR /tmp/clean

# Copy both root and server node_modules (Bun uses symlinks between them)
COPY --from=install /temp/prod/node_modules ./root_node_modules
COPY --from=install /temp/prod/packages/server/node_modules ./server_node_modules

# Clean unnecessary files from both node_modules
RUN for dir in root_node_modules server_node_modules; do \
        cd $dir && \
        # Remove test directories and files
        find . -type d \( -name "test" -o -name "tests" -o -name "__tests__" -o -name "*.test.*" -o -name "spec" \) -exec rm -rf {} + 2>/dev/null || true && \
        find . -type f \( -name "*.test.*" -o -name "*.spec.*" \) -delete 2>/dev/null || true && \
        # Remove documentation files
        find . -type f \( -name "*.md" -o -name "CHANGELOG*" -o -name "LICENSE*" -o -name "README*" \) -delete 2>/dev/null || true && \
        # Remove source maps
        find . -name "*.map" -delete 2>/dev/null || true && \
        # Remove TypeScript source files but keep .d.ts files
        find . -name "*.ts" ! -name "*.d.ts" ! -path "*/node_modules/@types/*" -delete 2>/dev/null || true && \
        # Remove example and doc directories
        find . -type d \( -name "examples" -o -name "docs" -o -name "doc" \) -exec rm -rf {} + 2>/dev/null || true && \
        # Clean up empty directories
        find . -type d -empty -delete 2>/dev/null || true && \
        cd ..; \
    done

# RELEASE Stage - Minimal runtime image
FROM oven/bun:1.3.1-slim AS release

WORKDIR /usr/src/app

# Install only runtime dependencies (no Node.js, no build tools)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends ca-certificates && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy cleaned production node_modules (Bun workspace structure)
COPY --from=prod-deps /tmp/clean/root_node_modules ./node_modules
COPY --from=prod-deps /tmp/clean/server_node_modules ./packages/server/node_modules

# Copy Prisma generated client
COPY --from=build /usr/src/app/packages/server/lib/generated ./packages/server/lib/generated

# Copy application files (only essential runtime files)
COPY --from=build /usr/src/app/packages/server/index.ts ./packages/server/
COPY --from=build /usr/src/app/packages/server/lib ./packages/server/lib
COPY --from=build /usr/src/app/packages/server/routes ./packages/server/routes
COPY --from=build /usr/src/app/packages/server/package.json ./packages/server/

# Run as non-root user
USER bun

EXPOSE 3003/tcp

CMD ["bun", "run", "packages/server/index.ts"]