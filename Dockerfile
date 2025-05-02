ARG NODE_VERSION=lts
ARG APP_VERSION=1.0.0

FROM node:${NODE_VERSION} AS base
LABEL org.opencontainers.image.version=${APP_VERSION}
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS deploy
# (Install wget so healthcheck works)
RUN apk add --no-cache wget

USER 101
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --quiet --spider http://localhost:8080/ || exit 1

EXPOSE 8080
