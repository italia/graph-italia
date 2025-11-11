# BASE Stage
FROM oven/bun:1 AS base

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
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production


# PRERELEASE Stage

# copy node_modules from temp folder. then copy all (non-ignored) project files into the image
FROM install AS prerelease

WORKDIR /usr/src/app

COPY --from=install /temp/prod/node_modules node_modules
COPY . .
RUN npx prisma generate

# RELEASE Stage

FROM base AS release
COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/index.ts .
COPY --from=prerelease /usr/src/app/lib ./lib
COPY --from=prerelease /usr/src/app/routes ./routes
COPY --from=prerelease /usr/src/app/package.json .

# run the app
USER bun
EXPOSE 3003/tcp
CMD ["bun", "run", "index.ts"]