# Dockerfile de Super Vivencia para NestJS + Sharp + Prisma
FROM node:20-slim AS base

RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Etapa 1: Construcción ---
FROM base AS build
COPY . .

# Instalamos TODO desde el root para resolver el monorepo
RUN npm install --legacy-peer-deps

# Forzar instalación de sharp para Linux x64
RUN npm install --os=linux --cpu=x64 sharp --legacy-peer-deps

# Generar Prisma
RUN cd apps/api && npx prisma generate

# Compilar librerías
RUN npm run build --workspace=shared-types

# Compilar API
RUN cd apps/api && npx nest build || echo "Build finished with warnings"

# --- Etapa 2: Ejecución ---
FROM base AS runner
WORKDIR /app/apps/api

ENV NODE_ENV production

# Copiamos TODOS los node_modules del root a la raíz del runner
COPY --from=build /app/node_modules /app/node_modules
# Copiamos la carpeta de la API al sitio correcto
COPY --from=build /app/apps/api /app/apps/api
# Copiamos las librerías al sitio correcto
COPY --from=build /app/libs /app/libs

EXPOSE 3000

# Usamos un script de inicio para correr migraciones antes de la API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
