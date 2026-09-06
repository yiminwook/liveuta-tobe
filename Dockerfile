# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat && corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV="production"
ENV HOST="0.0.0.0"
ENV PORT="3000"

COPY --from=builder --chown=node:node /app/.output ./.output

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
