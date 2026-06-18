FROM node:20-alpine AS base
RUN npm install -g turbo
WORKDIR /app

FROM base AS installer
COPY . .
RUN npm install

RUN turbo build

FROM base AS runner
COPY --from=installer /app .

EXPOSE 3000
EXPOSE 3001

CMD ["turbo", "run", "start", "--", "--hostname", "0.0.0.0"]
