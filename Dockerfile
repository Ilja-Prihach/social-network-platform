# dependencies
FROM node:20.11-alpine as dependencies
WORKDIR /app

# ⬇️ ВАЖНО
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# builder
FROM node:20.11-alpine as builder
WORKDIR /app

RUN npm install -g pnpm

COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build:production

# runner
FROM node:20.11-alpine as runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

USER node
COPY --from=builder /app ./
EXPOSE 3000
CMD ["pnpm", "start"]
