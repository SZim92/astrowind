# 1) Build stage (needs devDependencies)
ARG NODE_VERSION=lts
ARG APP_VERSION=1.0.0

FROM node:${NODE_VERSION} AS builder
LABEL org.opencontainers.image.version=${APP_VERSION}
WORKDIR /app

# Install everything (dev + prod) so we can run the build
COPY package.json package-lock.json ./
RUN npm ci

# Copy your source and run your build
COPY . .
RUN npm run build

# 2) Runtime stage (only prod deps, just in case you're serving via Node;
#    you can omit the node_modules if it's purely static)
FROM node:${NODE_VERSION} AS runtime
WORKDIR /app

# Install only "dependencies"
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 3) Final nginx image
FROM nginx:stable-alpine AS final

# Add wget for healthchecks
RUN apk add --no-cache wget

# Drop privileges
USER 101

# Copy built assets and (optionally) node_modules
COPY --from=builder /app/dist   /usr/share/nginx/html
COPY --from=runtime  /app/node_modules /app/node_modules

# Custom Nginx config
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Healthcheck against your serving port
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --quiet --spider http://localhost:8080/ || exit 1

EXPOSE 8080
