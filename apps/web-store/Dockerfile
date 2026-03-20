# Dockerfile para Next.js (Comandos estándar)
FROM node:20-slim AS base

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Etapa 1: Dependencias ---
FROM base AS dependencies
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web-store/package*.json ./apps/web-store/
COPY apps/admin-panel/package*.json ./apps/admin-panel/
COPY libs/shared-types/package*.json ./libs/shared-types/
COPY libs/api-client/package*.json ./libs/api-client/
COPY libs/ui-components/package*.json ./libs/ui-components/

RUN npm install --legacy-peer-deps

# --- Etapa 2: Construcción ---
FROM dependencies AS build
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Compilar librerías locales primero
RUN npm run build --workspace=shared-types

# Construir Next.js directamente desde el workspace
RUN npm run build --workspace=web-store

# --- Etapa 3: Ejecución ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/apps/web-store/.next ./apps/web-store/.next
COPY --from=build /app/apps/web-store/package.json ./apps/web-store/package.json
COPY --from=build /app/apps/web-store/public ./apps/web-store/public
COPY --from=build /app/apps/web-store/next.config.ts ./apps/web-store/next.config.ts
COPY --from=build /app/libs ./libs

EXPOSE 3000

# Arrancar Next.js directamente desde el workspace especificando host y puerto
CMD ["npx", "next", "start", "apps/web-store", "--port", "3000", "--hostname", "0.0.0.0"]
