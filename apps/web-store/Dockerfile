FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web-store/package*.json ./apps/web-store/
COPY apps/admin-panel/package*.json ./apps/admin-panel/
COPY libs/shared-types/package*.json ./libs/shared-types/
COPY libs/api-client/package*.json ./libs/api-client/
COPY libs/ui-components/package*.json ./libs/ui-components/

RUN npm install --legacy-peer-deps

COPY . .

RUN npx turbo build --filter=web-store

# --- Runner Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/web-store/package.json ./apps/web-store/package.json
COPY --from=base /app/apps/web-store/.next ./apps/web-store/.next
COPY --from=base /app/apps/web-store/public ./apps/web-store/public
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start", "--workspace=web-store"]
