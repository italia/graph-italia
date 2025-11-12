# BASE stage
FROM oven/bun:latest AS base

WORKDIR /app

# INSTALL stage
FROM base AS install
COPY package.json bun.lock ./
COPY packages/webapp/package.json ./
RUN bun install
# this step needs to be fixed
# RUN bun install --frozen-lockfile

# BUILD stage

FROM install AS build
COPY . .
RUN bun run build

# RELEASE stage
FROM nginx:alpine AS release
COPY --from=build /app/packages/webapp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
