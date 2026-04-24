# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=dhi.io/node:24-alpine3.22-dev
ARG RUNTIME_IMAGE=dhi.io/node:24-alpine3.22

FROM ${NODE_IMAGE} AS deps
WORKDIR /app

COPY package.json ./
RUN npm install

FROM ${NODE_IMAGE} AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM ${RUNTIME_IMAGE} AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]

