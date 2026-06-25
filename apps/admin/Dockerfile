FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/client/package.json ./apps/client/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages ./packages
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace=admin

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/admin ./apps/admin
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=admin"]