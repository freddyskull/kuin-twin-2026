# Dockerfile para React/Vite (Comandos estándar)
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

RUN npm install --legacy-peer-deps && \
    npm install @rollup/rollup-linux-x64-gnu --save-optional --legacy-peer-deps

# --- Etapa 2: Construcción ---
FROM dependencies AS build
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Compilar librerías locales primero
RUN npm run build --workspace=shared-types

# Construir Vite directamente desde el workspace
RUN npm run build --workspace=admin-panel

# --- Etapa 3: Ejecución (Nginx) ---
FROM nginx:alpine AS runner

# Copiar el build del admin-panel al directorio de nginx
COPY --from=build /app/apps/admin-panel/dist /usr/share/nginx/html/admin

# Configuración de nginx para el path /admin/
RUN echo 'server { \
    listen 80; \
    location /admin/ { \
        alias /usr/share/nginx/html/admin/; \
        try_files $uri $uri/ /admin/index.html; \
    } \
    location / { \
        return 301 /admin/; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
