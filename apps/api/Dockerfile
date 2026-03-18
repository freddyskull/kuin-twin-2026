FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
COPY turbo.json ./
# Copy ALL package.json files for workspaces
COPY apps/api/package*.json ./apps/api/
COPY apps/web-store/package*.json ./apps/web-store/
COPY apps/admin-panel/package*.json ./apps/admin-panel/
COPY libs/shared-types/package*.json ./libs/shared-types/
COPY libs/api-client/package*.json ./libs/api-client/
COPY libs/ui-components/package*.json ./libs/ui-components/

RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Build the project (use turbo)
RUN npx turbo build --filter=api

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/package.json ./apps/api/package.json
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "apps/api/dist/src/main.js"]
