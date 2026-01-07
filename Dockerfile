FROM node:22-alpine3.21 AS base
ARG IMAGE_NAME
ENV IMAGE_NAME=$IMAGE_NAME

FROM base as devcontainer
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN apk add git
RUN apk add bash
RUN yarn global add yarn@latest
RUN yarn global add pnpm@latest

FROM base as prod
WORKDIR /webserver
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build
CMD ["yarn", "start"]
