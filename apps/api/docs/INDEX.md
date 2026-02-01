# 📚 Documentación - Kuin Twin API

Bienvenido a la documentación completa de la API de Kuin Twin.

## 📖 Guías Disponibles

### 🚀 [README.md](../README.md)
**Documentación principal de la API**
- Descripción general del proyecto
- Arquitectura y tecnologías
- Instalación y configuración
- Guía completa de todos los módulos
- Modelo de datos y relaciones

### 📚 [SWAGGER.md](./SWAGGER.md)
**Documentación Interactiva con Swagger/OpenAPI**
- Acceso a la interfaz Swagger UI
- Cómo explorar y probar endpoints
- Exportar especificación OpenAPI
- Configuración técnica

### 🧪 [SANDBOX.md](./SANDBOX.md)
**Sandbox de Pruebas**
- Pruebas básicas de cada módulo
- **Pruebas de caché con Redis** (ejemplos prácticos)
- Flujo completo de reserva
- Pruebas de WebSockets
- Medición de rendimiento
- Ejercicios propuestos

### 🚀 [REDIS_CACHE.md](./REDIS_CACHE.md)
**Guía de Caché con Redis**
- Configuración de Redis
- Servicios cacheados y TTL
- Estrategia de invalidación
- Comandos de monitoreo
- Beneficios y optimización

### 🛠️ [TEST_TOOLS.md](./TEST_TOOLS.md)
**Herramientas de Testing**
- Cliente WebSocket (`test-websocket.js`)
- Monitor de Redis (`monitor-redis.js`)
- Scripts NPM disponibles
- Flujo de prueba completo

## 🎯 Inicio Rápido

### 1. Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/kuin-twin-2026.git
cd kuin-twin-2026

# Instalar dependencias
npm install

# Levantar servicios Docker (PostgreSQL + Redis)
docker-compose up -d

# Ejecutar migraciones
cd apps/api
npx prisma migrate dev

# Iniciar API
npm run dev --filter=api
```

### 2. Acceder a la Documentación
```
🌐 API: http://localhost:3001
📚 Swagger UI: http://localhost:3001/api-docs
```

### 3. Probar la API

**Opción 1: Swagger UI (Recomendado)**
- Abre `http://localhost:3001/api-docs`
- Explora y prueba endpoints interactivamente

**Opción 2: Archivos .http**
- Usa los archivos `.http` incluidos con VS Code REST Client
- `user.http`, `service.http`, `booking_flow.http`, `chat_test.http`

**Opción 3: Herramientas de Testing**
```bash
# Monitor de Redis
node apps/api/monitor-redis.js

# Cliente WebSocket
node apps/api/test-websocket.js
```

## 📂 Estructura de la Documentación

```
apps/api/
├── README.md                    # Documentación principal
├── docs/
│   ├── INDEX.md                 # Este archivo
│   ├── SWAGGER.md               # Guía de Swagger
│   ├── SANDBOX.md               # Sandbox de pruebas
│   ├── REDIS_CACHE.md           # Guía de Redis
│   └── TEST_TOOLS.md            # Herramientas de testing
├── test-websocket.js            # Cliente WebSocket
├── monitor-redis.js             # Monitor de Redis
├── *.http                       # Archivos de prueba HTTP
└── src/                         # Código fuente
```

## 🔑 Conceptos Clave

### Roles de Usuario
- **CUSTOMER**: Cliente que contrata servicios
- **VENDOR**: Proveedor de servicios
- **ADMIN**: Administrador del sistema

### Flujo de Reserva
1. Cliente busca servicios
2. Ve disponibilidad (slots)
3. Crea una reserva (status: PENDING)
4. Realiza el pago
5. Reserva se activa (status: ACTIVE)
6. Servicio se completa (status: COMPLETED)

### Caché con Redis
- **Servicios**: 5-10 min
- **Categorías**: 15 min
- **Usuarios**: 3-5 min
- Invalidación automática en escrituras

### WebSockets
Eventos en tiempo real:
- `new_message`: Nuevo mensaje de chat
- `new_booking`: Nueva reserva (vendedor)
- `booking_status_changed`: Cambio de estado
- `slots_updated`: Actualización de disponibilidad
- `payment_confirmed`: Pago confirmado (cliente)
- `booking_paid`: Pago recibido (vendedor)

## 🛠️ Tecnologías

- **Backend**: NestJS 10.x + TypeScript
- **Base de Datos**: PostgreSQL 15 + PostGIS
- **ORM**: Prisma 7.x
- **Caché**: Redis 7.x
- **Validación**: Zod + nestjs-zod
- **Documentación**: Swagger/OpenAPI 3.0
- **WebSockets**: Socket.io
- **Seguridad**: bcrypt

## 📊 Endpoints Principales

### Users (`/api/users`)
- `POST /` - Crear usuario
- `POST /register` - Registro completo (usuario + perfil)
- `GET /` - Listar usuarios
- `GET /:id` - Obtener usuario
- `PATCH /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario

### Services (`/api/services`)
- `POST /` - Crear servicio
- `GET /` - Listar servicios (con filtros)
- `GET /:id` - Obtener servicio
- `PATCH /:id` - Actualizar servicio
- `DELETE /:id` - Eliminar servicio

### Bookings (`/api/bookings`)
- `POST /` - Crear reserva
- `GET /` - Listar reservas (con filtros)
- `GET /:id` - Obtener reserva
- `PATCH /:id/status` - Actualizar estado

### Chat (`/api/chat`)
- `POST /send/:senderId` - Enviar mensaje
- `GET /messages/:userId/:otherUserId` - Historial
- `GET /conversations/:userId` - Conversaciones
- `PATCH /read/:userId/:senderId` - Marcar como leído

## 🔍 Recursos Adicionales

### Documentación Externa
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Redis Docs](https://redis.io/docs/)
- [Socket.io Docs](https://socket.io/docs/v4/)

### Archivos de Configuración
- `.env` - Variables de entorno
- `docker-compose.yml` - Servicios Docker
- `prisma/schema.prisma` - Esquema de base de datos

### Herramientas Recomendadas
- **VS Code** con extensiones:
  - REST Client
  - Prisma
  - ESLint
- **Postman** o **Insomnia** para pruebas
- **Redis Commander** para visualizar caché
- **Prisma Studio** para visualizar DB

## 🐛 Troubleshooting

### API no inicia
```bash
# Verificar servicios Docker
docker ps

# Ver logs
docker-compose logs -f

# Reiniciar servicios
docker-compose restart
```

### Redis no conecta
```bash
# Verificar Redis
docker logs kuin-twin-redis

# Reiniciar Redis
docker restart kuin-twin-redis
```

### Errores de Prisma
```bash
# Regenerar cliente
npx prisma generate

# Resetear DB (⚠️ borra datos)
npx prisma migrate reset --force
```

## 📞 Soporte

Para preguntas o problemas:
1. Revisa esta documentación
2. Consulta los archivos `.http` de ejemplo
3. Prueba en Swagger UI
4. Contacta al equipo de desarrollo

---

## 🎓 Tutoriales Paso a Paso

### Tutorial 1: Crear tu Primer Servicio
Ver: [SANDBOX.md - Flujo Completo de Reserva](./SANDBOX.md#flujo-completo-de-reserva)

### Tutorial 2: Probar el Caché de Redis
Ver: [SANDBOX.md - Pruebas de Caché](./SANDBOX.md#pruebas-de-caché-con-redis)

### Tutorial 3: Conectar WebSockets
Ver: [TEST_TOOLS.md - Test de WebSockets](./TEST_TOOLS.md#test-de-websockets)

---

**¡Feliz desarrollo!** 🚀

Si encuentras algún error en la documentación o tienes sugerencias, por favor crea un issue en el repositorio.
