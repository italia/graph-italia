# BASE Stage
FROM oven/bun:1.3.1 AS base

# setup all global artifacts. why Node? A: https://github.com/oven-sh/bun/issues/4848
RUN apt update \
    && apt install -y curl

ARG NODE_VERSION=20
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n   
    

# INSTALL Stage

# install dependencies into temp folder. this will cache them and speed up future builds
FROM base AS install
WORKDIR /temp/prod/
COPY package.json bun.lock ./
COPY packages/server/package.json packages/server/bun.lockb ./packages/server/
# this step needs a fix
RUN bun install
# RUN bun install --frozen-lockfile --production


# PRERELEASE Stage

# copy node_modules from temp folder. then copy all (non-ignored) project files into the image
FROM install AS prerelease

WORKDIR /usr/src/app

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/prod/packages/server/node_modules packages/server/node_modules
COPY . .
## fix this step
# RUN npx prisma generate --schema packages/server/prisma/schema.prisma

# RELEASE Stage

FROM base AS release
COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/packages/server/node_modules ./packages/server/node_modules
COPY --from=prerelease /usr/src/app/packages/server/index.ts ./packages/server
COPY --from=prerelease /usr/src/app/packages/server/lib ./packages/server/lib
COPY --from=prerelease /usr/src/app/packages/server/routes ./packages/server/routes
COPY --from=prerelease /usr/src/app/packages/server/package.json ./packages/server

# run the app
USER bun
EXPOSE 3003/tcp
CMD ["bun", "run", "packages/server/index.ts"]