# Kuin Twin API - Documentación Completa

> 📚 **[Ver Índice Completo de Documentación](./docs/INDEX.md)**

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Tecnologías](#tecnologías)
4. [Instalación](#instalación)
5. [Configuración](#configuración)
6. [Módulos de la API](#módulos-de-la-api)
7. [WebSockets](#websockets)
8. [Caché con Redis](#caché-con-redis)
9. [Testing](#testing)
10. [Documentación Swagger](#documentación-swagger)

---

## 📖 Descripción General

**Kuin Twin** es una plataforma de marketplace de servicios que conecta proveedores (vendors) con clientes. La API proporciona funcionalidades completas para:

- Gestión de usuarios (clientes y proveedores)
- Catálogo de servicios con categorías
- Sistema de reservas con slots de disponibilidad
- Procesamiento de pagos
- Chat interno en tiempo real
- Galería de medios para proveedores
- Portafolio de trabajos

---

## 🏗️ Arquitectura

### Estructura del Proyecto
```
apps/api/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── migrations/            # Migraciones
├── src/
│   ├── user/                  # Módulo de usuarios
│   ├── portfolio/             # Módulo de portafolio
│   ├── media/                 # Módulo de galería de medios
│   ├── category/              # Módulo de categorías
│   ├── service-unit/          # Módulo de unidades de medida
│   ├── service/               # Módulo de servicios
│   ├── slot/                  # Módulo de disponibilidad
│   ├── booking/               # Módulo de reservas
│   ├── payment/               # Módulo de pagos
│   ├── chat/                  # Módulo de mensajería
│   ├── socket/                # Gateway de WebSockets
│   ├── prisma.service.ts      # Servicio de Prisma
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Punto de entrada
└── uploads/                   # Archivos estáticos
```

### Patrón de Diseño
- **Arquitectura en capas**: Controller → Service → Repository (Prisma)
- **Inyección de dependencias**: NestJS DI Container
- **DTOs con validación**: Zod + nestjs-zod
- **Caché distribuido**: Redis para optimización

---

## 🛠️ Tecnologías

### Backend
- **Framework**: NestJS 10.x
- **Runtime**: Node.js 20.x
- **Lenguaje**: TypeScript 5.x

### Base de Datos
- **PostgreSQL 15** con extensión **PostGIS** (para geolocalización)
- **ORM**: Prisma 7.x
- **Caché**: Redis 7.x

### Validación
- **Zod**: Esquemas de validación
- **nestjs-zod**: Integración con NestJS

### Tiempo Real
- **Socket.io**: WebSockets para chat y notificaciones

### Seguridad
- **bcrypt**: Hash de contraseñas
- **CORS**: Configurado para desarrollo

---

## 📦 Instalación

### Prerrequisitos
```bash
# Node.js 20+
node --version

# Docker (para PostgreSQL y Redis)
docker --version
```

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/kuin-twin-2026.git
cd kuin-twin-2026
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Levantar servicios Docker**
```bash
docker-compose up -d
```

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

5. **Ejecutar migraciones**
```bash
cd apps/api
npx prisma migrate dev
```

6. **Generar cliente de Prisma**
```bash
npx prisma generate
```

7. **Iniciar servidor de desarrollo**
```bash
npm run dev --filter=api
```

La API estará disponible en: `http://localhost:3001`

---

## ⚙️ Configuración

### Variables de Entorno (.env)
```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kuin_twin?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Puerto de la API
PORT=3001

# JWT (si se implementa autenticación)
JWT_SECRET="tu-secreto-super-seguro"
```

### Docker Compose
```yaml
services:
  db:
    image: postgis/postgis:15-3.3
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: kuin_twin

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## 📚 Módulos de la API

### 1. **User Module** (`/api/users`)
Gestión de usuarios, perfiles y autenticación.

**Endpoints principales:**
- `POST /api/users` - Crear usuario
- `POST /api/users/register-nested` - Registro con perfil
- `GET /api/users` - Listar usuarios (cacheado 3 min)
- `GET /api/users/:id` - Obtener usuario (cacheado 5 min)
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario
- `POST /api/users/:id/profile` - Crear/actualizar perfil

**Roles disponibles:**
- `CUSTOMER`: Cliente que contrata servicios
- `VENDOR`: Proveedor de servicios
- `ADMIN`: Administrador del sistema

### 2. **Portfolio Module** (`/api/portfolio`)
Gestión del portafolio de trabajos de los proveedores.

**Endpoints:**
- `POST /api/portfolio/:userId` - Agregar item
- `GET /api/portfolio/user/:userId` - Ver portafolio
- `DELETE /api/portfolio/:itemId` - Eliminar item

### 3. **Media Module** (`/api/media`)
Galería de medios estilo WordPress para proveedores.

**Endpoints:**
- `POST /api/media/:userId` - Subir medio
- `GET /api/media/user/:userId` - Ver galería
- `DELETE /api/media/:mediaId` - Eliminar medio

**Validaciones:**
- Solo usuarios `VENDOR` o `ADMIN` pueden subir
- Metadatos: URL, fileName, mimeType, size, alt

### 4. **Category Module** (`/api/categories`)
Categorías jerárquicas para servicios.

**Endpoints:**
- `POST /api/categories` - Crear categoría
- `GET /api/categories` - Listar todas (cacheado 15 min)
- `GET /api/categories/roots` - Solo raíces (cacheado 15 min)
- `GET /api/categories/:idOrSlug` - Obtener una (cacheado 15 min)
- `PATCH /api/categories/:id` - Actualizar
- `DELETE /api/categories/:id` - Eliminar

**Características:**
- Soporte para subcategorías (parentId)
- Slug único para URLs amigables
- Icono opcional

### 5. **Service Unit Module** (`/api/service-units`)
Unidades de medida para servicios (hora, día, proyecto, etc.)

**Endpoints:**
- `POST /api/service-units` - Crear unidad
- `GET /api/service-units` - Listar todas
- `GET /api/service-units/:id` - Obtener una
- `PATCH /api/service-units/:id` - Actualizar
- `DELETE /api/service-units/:id` - Eliminar

### 6. **Service Module** (`/api/services`)
Catálogo de servicios ofrecidos por proveedores.

**Endpoints:**
- `POST /api/services` - Crear servicio
- `GET /api/services` - Listar servicios (cacheado 5 min)
  - Query params: `?vendorId=...&categoryId=...&isActive=true`
- `GET /api/services/:id` - Detalle del servicio (cacheado 10 min)
- `PATCH /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

**Validaciones:**
- Solo `VENDOR` o `ADMIN` pueden crear servicios
- Validación de categoría y unidad existentes

### 7. **Slot Module** (`/api/slots`)
Gestión de disponibilidad horaria para servicios.

**Endpoints:**
- `POST /api/slots` - Crear slot
- `GET /api/slots/service/:serviceId` - Listar slots
  - Query params: `?from=2026-02-01&to=2026-02-28`
- `GET /api/slots/:id` - Obtener slot
- `PATCH /api/slots/:id` - Actualizar slot
- `DELETE /api/slots/:id` - Eliminar slot

**Estados:**
- `AVAILABLE`: Disponible para reservar
- `BOOKED`: Reservado

**WebSocket:** Emite `slots_updated` al crear/eliminar slots

### 8. **Booking Module** (`/api/bookings`)
Sistema de reservas con snapshots de precios.

**Endpoints:**
- `POST /api/bookings` - Crear reserva
- `GET /api/bookings` - Listar reservas
  - Query params: `?customerId=...&vendorId=...&status=PENDING`
- `GET /api/bookings/:id` - Detalle de reserva
- `PATCH /api/bookings/:id/status` - Cambiar estado

**Estados:**
- `PENDING`: Pendiente de pago
- `ACTIVE`: Confirmada y pagada
- `COMPLETED`: Completada
- `CANCELLED`: Cancelada

**Características:**
- Snapshot de precios en `BookingDetails`
- Bloqueo automático de slots
- Liberación de slots al cancelar

**WebSocket:** 
- `new_booking`: Notifica al vendedor
- `booking_status_changed`: Notifica a ambas partes

### 9. **Payment Module** (`/api/payments`)
Registro de pagos vinculados a reservas.

**Características:**
- Al confirmar pago, la reserva pasa a `ACTIVE`
- Notificaciones WebSocket a cliente y vendedor

**WebSocket:**
- `payment_confirmed`: Notifica al cliente
- `booking_paid`: Notifica al vendedor

### 10. **Chat Module** (`/api/chat`)
Mensajería interna entre usuarios.

**Endpoints:**
- `POST /api/chat/send/:senderId` - Enviar mensaje
- `GET /api/chat/messages/:userId/:otherUserId` - Historial
- `GET /api/chat/conversations/:userId` - Lista de conversaciones
- `PATCH /api/chat/read/:userId/:senderId` - Marcar como leído

**WebSocket:** `new_message` - Notificación en tiempo real

---

## 🔌 WebSockets

### Conexión
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001', {
  query: { userId: 'tu-user-id' }
});
```

### Eventos Disponibles

| Evento | Descripción | Payload |
|--------|-------------|---------|
| `new_message` | Nuevo mensaje de chat | `{ id, content, sender, ... }` |
| `new_booking` | Nueva reserva (para vendedor) | `{ id, customer, service, ... }` |
| `booking_status_changed` | Cambio de estado de reserva | `{ id, status, ... }` |
| `slots_updated` | Actualización de disponibilidad | `{ serviceId, slotIds, status }` |
| `payment_confirmed` | Pago confirmado (para cliente) | `{ bookingId, amount, ... }` |
| `booking_paid` | Pago recibido (para vendedor) | `{ bookingId, amount }` |

---

## 🚀 Caché con Redis

### Configuración
- **URL**: `redis://localhost:6379`
- **TTL por defecto**: 10 minutos

### Servicios Cacheados

#### Services
- `services:all` → 5 min
- `services:vendor:{id}` → 5 min
- `services:category:{id}` → 5 min
- `service:{id}` → 10 min

#### Categories
- `categories:all` → 15 min
- `categories:roots` → 15 min
- `category:{idOrSlug}` → 15 min

#### Users
- `users:all` → 3 min
- `user:{id}` → 5 min

### Monitoreo de Redis
```bash
# Conectar a Redis CLI
docker exec -it kuin-twin-redis redis-cli

# Ver todas las claves
KEYS *

# Ver valor de una clave
GET service:uuid-example

# Ver TTL de una clave
TTL service:uuid-example

# Limpiar todo el cache
FLUSHALL
```

---

## 🧪 Testing

### Archivos de Prueba HTTP

La API incluye archivos `.http` para pruebas con REST Client (VS Code):

- `user.http` - Pruebas de usuarios y perfiles
- `service.http` - Pruebas de servicios
- `booking_flow.http` - Flujo completo de reservas
- `chat_test.http` - Pruebas de chat y WebSockets

### Ejemplo de Uso
```http
### Variables
@baseUrl = http://localhost:3001
@userId = uuid-del-usuario

### Crear Usuario
POST {{baseUrl}}/api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "role": "VENDOR"
}
```

---

## 📊 Modelo de Datos

### Relaciones Principales

```
User (1) ──── (1) Profile
  │
  ├── (1:N) Service
  ├── (1:N) Booking
  ├── (1:N) Media
  ├── (1:N) Message (sent)
  └── (1:N) Message (received)

Service (1) ──── (N) Category
  │
  ├── (1:N) ServiceSlot
  ├── (1:N) Booking
  └── (1) ServiceUnit

Booking (1) ──── (1) BookingDetails
  │
  ├── (N:N) ServiceSlot
  └── (1) Payment
```

---

## 🔐 Seguridad

### Implementado
- Hash de contraseñas con bcrypt (10 rounds)
- Validación de DTOs con Zod
- CORS configurado

### Pendiente (Recomendaciones)
- [ ] JWT Authentication
- [ ] Rate limiting
- [ ] Helmet para headers de seguridad
- [ ] Validación de archivos subidos
- [ ] Sanitización de inputs

---

## 📝 Notas de Desarrollo

### Comandos Útiles

```bash
# Desarrollo
npm run dev --filter=api

# Build
npm run build --filter=api

# Prisma
npx prisma studio                 # UI para ver la DB
npx prisma migrate dev            # Crear migración
npx prisma generate               # Generar cliente

# Docker
docker-compose up -d              # Iniciar servicios
docker-compose down               # Detener servicios
docker-compose logs -f db         # Ver logs de PostgreSQL
```

### Estructura de Respuestas

**Éxito:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "VENDOR",
  "createdAt": "2026-01-31T00:00:00.000Z"
}
```

**Error:**
```json
{
  "statusCode": 404,
  "message": "Usuario con ID xyz no encontrado",
  "error": "Not Found"
}
```

---

## 📚 Documentación Swagger

La API está completamente documentada con **Swagger/OpenAPI 3.0**.

### Acceso
```
http://localhost:3001/api-docs
```

### Características
- 🎯 Interfaz interactiva para probar endpoints
- 📝 Esquemas de datos completos
- 🔍 Búsqueda y filtros
- ⏱️ Medición de tiempos de respuesta
- 📥 Exportación en JSON/YAML

### Documentación Detallada
Ver [docs/SWAGGER.md](./docs/SWAGGER.md) para guía completa de uso.

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 📞 Contacto

Para más información, contacta al equipo de desarrollo.
