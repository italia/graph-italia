FROM oven/bun:debian

# Config Bun
ENV PATH="~/.bun/bin:${PATH}"
RUN ln -s /usr/local/bin/bun /usr/local/bin/node

# Update packages
RUN if [ "alpine" == "alpine" ] ; then apk update ; else apt-get update ; fi

# Install Git
RUN if [ "alpine" == "alpine" ] ; then apk add git ; else apt-get install -y git ; fi

RUN apt update \
    && apt install -y curl
ARG NODE_VERSION=20
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n    