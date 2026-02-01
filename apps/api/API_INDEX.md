# Kuin Twin API

> 🚀 **API completa para marketplace de servicios**

## 🌐 Acceso Rápido

- **API**: http://localhost:3001
- **📚 Swagger UI**: http://localhost:3001/api-docs
- **📖 Documentación**: [Ver docs completos](./README.md)

## 📚 Documentación

Toda la documentación está organizada en la carpeta `docs/`:

- **[INDEX.md](./docs/INDEX.md)** - Índice de toda la documentación
- **[README.md](./README.md)** - Documentación técnica completa
- **[SWAGGER.md](./docs/SWAGGER.md)** - Guía de Swagger/OpenAPI
- **[SANDBOX.md](./docs/SANDBOX.md)** - Sandbox de pruebas con ejemplos de Redis
- **[REDIS_CACHE.md](./docs/REDIS_CACHE.md)** - Guía de caché con Redis
- **[TEST_TOOLS.md](./docs/TEST_TOOLS.md)** - Herramientas de testing

## ⚡ Inicio Rápido

```bash
# 1. Levantar servicios (PostgreSQL + Redis)
docker-compose up -d

# 2. Ejecutar migraciones
cd apps/api
npx prisma migrate dev

# 3. Iniciar API
npm run dev --filter=api
```

## 🛠️ Herramientas de Testing

```bash
# Monitor de Redis en tiempo real
node apps/api/monitor-redis.js

# Cliente WebSocket
node apps/api/test-websocket.js
```

## 📊 Características

- ✅ 10 módulos completos (Users, Services, Bookings, Chat, etc.)
- ✅ Caché con Redis para optimización
- ✅ WebSockets para tiempo real
- ✅ Documentación Swagger interactiva
- ✅ Validación con Zod
- ✅ PostgreSQL + PostGIS
- ✅ Herramientas de testing incluidas

---

**[📖 Ver Documentación Completa →](./README.md)**
