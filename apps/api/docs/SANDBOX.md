# 🧪 Sandbox de Pruebas - Kuin Twin API

Este sandbox te permite probar todas las funcionalidades de la API, incluyendo el sistema de caché con Redis.

## 📋 Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Pruebas Básicas](#pruebas-básicas)
3. [Pruebas de Caché con Redis](#pruebas-de-caché-con-redis)
4. [Flujo Completo de Reserva](#flujo-completo-de-reserva)
5. [Pruebas de WebSockets](#pruebas-de-websockets)

---

## 🚀 Configuración Inicial

### 1. Verificar que los servicios estén corriendo

```bash
# Verificar PostgreSQL
docker ps | grep kuin-twin-db

# Verificar Redis
docker ps | grep kuin-twin-redis

# Verificar API
curl http://localhost:3001
```

### 2. Limpiar la base de datos (opcional)

```bash
cd apps/api
npx prisma migrate reset --force
```

### 3. Seed de datos de prueba

Ejecuta estos comandos en orden para crear datos de prueba:

```bash
# Conectar a Redis para monitorear
docker exec -it kuin-twin-redis redis-cli
> MONITOR
```

---

## 🧪 Pruebas Básicas

### Crear Categoría
```http
POST http://localhost:3001/api/categories
Content-Type: application/json

{
  "name": "Mantenimiento del Hogar",
  "slug": "mantenimiento-hogar",
  "description": "Servicios de mantenimiento y reparación",
  "icon": "🔧"
}
```

**Respuesta esperada:**
```json
{
  "id": "cat-uuid-123",
  "name": "Mantenimiento del Hogar",
  "slug": "mantenimiento-hogar",
  "description": "Servicios de mantenimiento y reparación",
  "icon": "🔧",
  "parentId": null,
  "createdAt": "2026-01-31T20:00:00.000Z"
}
```

### Crear Unidad de Servicio
```http
POST http://localhost:3001/api/service-units
Content-Type: application/json

{
  "name": "Hora",
  "symbol": "hr",
  "description": "Cobro por hora de trabajo"
}
```

### Crear Usuario Vendedor
```http
POST http://localhost:3001/api/users/register-nested
Content-Type: application/json

{
  "email": "vendor@test.com",
  "password": "password123",
  "role": "VENDOR",
  "profile": {
    "displayName": "Juan Pérez - Técnico",
    "bio": "Técnico especializado en aires acondicionados",
    "avatarUrl": "https://i.pravatar.cc/150?img=12",
    "serviceRadiusKm": 10.5,
    "businessHours": {
      "monday": { "open": "08:00", "close": "18:00" },
      "tuesday": { "open": "08:00", "close": "18:00" }
    }
  }
}
```

**Guarda el `id` del usuario para los siguientes pasos.**

---

## 🔥 Pruebas de Caché con Redis

### Escenario 1: Cache Miss → Cache Hit

#### Paso 1: Primera consulta (CACHE MISS)
```http
GET http://localhost:3001/api/categories
```

**En Redis CLI verás:**
```
1706736000.123456 [0 127.0.0.1:54321] "get" "categories:all"
1706736000.234567 [0 127.0.0.1:54321] "set" "categories:all" "..." "PX" "900000"
```

#### Paso 2: Segunda consulta (CACHE HIT)
```http
GET http://localhost:3001/api/categories
```

**En Redis CLI verás:**
```
1706736001.123456 [0 127.0.0.1:54321] "get" "categories:all"
```

**Nota:** La segunda consulta es mucho más rápida (< 5ms vs ~50ms)

### Escenario 2: Invalidación de Caché

#### Paso 1: Consultar categorías (se cachea)
```http
GET http://localhost:3001/api/categories
```

#### Paso 2: Crear nueva categoría (invalida cache)
```http
POST http://localhost:3001/api/categories
Content-Type: application/json

{
  "name": "Electricidad",
  "slug": "electricidad",
  "icon": "⚡"
}
```

**En Redis CLI verás:**
```
1706736002.123456 [0 127.0.0.1:54321] "del" "categories:all"
1706736002.234567 [0 127.0.0.1:54321] "del" "categories:roots"
```

#### Paso 3: Consultar de nuevo (cache miss, se vuelve a cachear)
```http
GET http://localhost:3001/api/categories
```

### Escenario 3: Caché por Filtros

#### Consulta general (clave: services:all)
```http
GET http://localhost:3001/api/services
```

#### Consulta por vendedor (clave: services:vendor:{id})
```http
GET http://localhost:3001/api/services?vendorId=vendor-uuid-123
```

#### Consulta por categoría (clave: services:category:{id})
```http
GET http://localhost:3001/api/services?categoryId=cat-uuid-123
```

**Cada filtro tiene su propia clave de caché independiente.**

### Verificar Caché Manualmente

```bash
# Conectar a Redis
docker exec -it kuin-twin-redis redis-cli

# Ver todas las claves
KEYS *

# Ejemplo de salida:
# 1) "categories:all"
# 2) "categories:roots"
# 3) "service:abc-123"
# 4) "services:vendor:xyz-456"

# Ver contenido de una clave
GET categories:all

# Ver tiempo de vida restante (en segundos)
TTL categories:all

# Eliminar una clave específica
DEL categories:all

# Limpiar todo el caché
FLUSHALL
```

### Medir Rendimiento

#### Sin Caché (primera consulta)
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3001/api/services
# Time: 0.052s
```

#### Con Caché (segunda consulta)
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3001/api/services
# Time: 0.003s
```

**Mejora: ~17x más rápido** 🚀

---

## 🎯 Flujo Completo de Reserva

### 1. Crear Servicio

```http
POST http://localhost:3001/api/services
Content-Type: application/json

{
  "vendorId": "vendor-uuid-123",
  "categoryId": "cat-uuid-123",
  "unitId": "unit-uuid-123",
  "title": "Instalación de Aire Acondicionado",
  "description": "Instalación profesional de equipos split",
  "basePrice": 150.00,
  "imageUrl": "https://images.unsplash.com/photo-1590486803833-ffc9409f5831",
  "isActive": true
}
```

**Guarda el `serviceId`**

### 2. Crear Slots de Disponibilidad

```http
POST http://localhost:3001/api/slots
Content-Type: application/json

{
  "serviceId": "service-uuid-123",
  "startTime": "2026-02-15T10:00:00Z",
  "endTime": "2026-02-15T12:00:00Z",
  "status": "AVAILABLE"
}
```

**Guarda el `slotId`**

### 3. Crear Usuario Cliente

```http
POST http://localhost:3001/api/users
Content-Type: application/json

{
  "email": "customer@test.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Guarda el `customerId`**

### 4. Crear Reserva

```http
POST http://localhost:3001/api/bookings
Content-Type: application/json

{
  "customerId": "customer-uuid-123",
  "serviceId": "service-uuid-123",
  "scheduledDate": "2026-02-15T10:00:00Z",
  "slotIds": ["slot-uuid-123"],
  "quantity": 1
}
```

**Respuesta esperada:**
```json
{
  "id": "booking-uuid-123",
  "customerId": "customer-uuid-123",
  "serviceId": "service-uuid-123",
  "scheduledDate": "2026-02-15T10:00:00.000Z",
  "status": "PENDING",
  "details": {
    "unitPrice": 150.00,
    "quantity": 1,
    "grandTotal": 150.00
  },
  "slots": [
    {
      "id": "slot-uuid-123",
      "status": "BOOKED"
    }
  ]
}
```

### 5. Verificar Caché de Servicios

```http
# Esta consulta debería mostrar el servicio cacheado
GET http://localhost:3001/api/services/service-uuid-123
```

```bash
# En Redis CLI
GET service:service-uuid-123
TTL service:service-uuid-123
# Debería mostrar ~600 (10 minutos)
```

### 6. Simular Pago

```http
POST http://localhost:3001/api/payments
Content-Type: application/json

{
  "bookingId": "booking-uuid-123",
  "amount": 150.00,
  "processorId": "stripe_ch_123456",
  "status": "succeeded"
}
```

### 7. Verificar Estado de Reserva

```http
GET http://localhost:3001/api/bookings/booking-uuid-123
```

**Estado debería ser `ACTIVE`**

---

## 🔌 Pruebas de WebSockets

### Cliente de Prueba (Node.js)

Crea un archivo `test-websocket.js`:

```javascript
const io = require('socket.io-client');

// Conectar como vendedor
const vendorSocket = io('http://localhost:3001', {
  query: { userId: 'vendor-uuid-123' }
});

// Conectar como cliente
const customerSocket = io('http://localhost:3001', {
  query: { userId: 'customer-uuid-123' }
});

// Escuchar eventos del vendedor
vendorSocket.on('connect', () => {
  console.log('✅ Vendedor conectado');
});

vendorSocket.on('new_booking', (data) => {
  console.log('🔔 Nueva reserva recibida:', data);
});

vendorSocket.on('booking_paid', (data) => {
  console.log('💰 Pago recibido:', data);
});

// Escuchar eventos del cliente
customerSocket.on('connect', () => {
  console.log('✅ Cliente conectado');
});

customerSocket.on('payment_confirmed', (data) => {
  console.log('✅ Pago confirmado:', data);
});

customerSocket.on('booking_status_changed', (data) => {
  console.log('📝 Estado de reserva actualizado:', data);
});

// Escuchar actualizaciones de slots (ambos)
vendorSocket.on('slots_updated', (data) => {
  console.log('📅 Slots actualizados (vendedor):', data);
});

customerSocket.on('slots_updated', (data) => {
  console.log('📅 Slots actualizados (cliente):', data);
});
```

Ejecutar:
```bash
node test-websocket.js
```

Luego crea una reserva y verás las notificaciones en tiempo real.

---

## 📊 Monitoreo de Redis en Tiempo Real

### Opción 1: Redis CLI Monitor
```bash
docker exec -it kuin-twin-redis redis-cli MONITOR
```

### Opción 2: Redis Commander (GUI)
```bash
docker run --rm --name redis-commander \
  -p 8081:8081 \
  --env REDIS_HOSTS=local:host.docker.internal:6379 \
  rediscommander/redis-commander:latest
```

Abre: `http://localhost:8081`

### Opción 3: Script de Monitoreo

Crea `monitor-cache.js`:

```javascript
const Redis = require('ioredis');
const redis = new Redis('redis://localhost:6379');

async function monitorCache() {
  const keys = await redis.keys('*');
  
  console.log('\n📊 Estado del Caché Redis\n');
  console.log(`Total de claves: ${keys.length}\n`);
  
  for (const key of keys) {
    const ttl = await redis.ttl(key);
    const type = await redis.type(key);
    
    console.log(`🔑 ${key}`);
    console.log(`   Tipo: ${type}`);
    console.log(`   TTL: ${ttl}s (${Math.floor(ttl / 60)}m ${ttl % 60}s)`);
    console.log('');
  }
}

setInterval(monitorCache, 5000);
monitorCache();
```

---

## 🧹 Limpieza de Datos

### Limpiar solo el caché
```bash
docker exec -it kuin-twin-redis redis-cli FLUSHALL
```

### Resetear base de datos
```bash
cd apps/api
npx prisma migrate reset --force
```

### Reiniciar todo
```bash
docker-compose down
docker-compose up -d
cd apps/api
npx prisma migrate dev
npm run dev --filter=api
```

---

## 📈 Benchmarks Esperados

### Sin Caché (Primera Consulta)
- **Categorías**: ~30-50ms
- **Servicios**: ~50-80ms
- **Usuarios**: ~40-60ms

### Con Caché (Consultas Subsecuentes)
- **Categorías**: ~2-5ms (15x más rápido)
- **Servicios**: ~3-6ms (13x más rápido)
- **Usuarios**: ~2-4ms (15x más rápido)

### Carga Concurrente
```bash
# Instalar Apache Bench
# Windows: Descargar desde Apache Lounge

# Test: 1000 requests, 10 concurrentes
ab -n 1000 -c 10 http://localhost:3001/api/categories

# Resultados esperados con caché:
# Requests per second: ~300-500
# Time per request: ~2-3ms (mean)
```

---

## 🎓 Ejercicios Propuestos

### Ejercicio 1: Medir el Impacto del Caché
1. Limpia el caché de Redis
2. Haz 10 consultas a `/api/services` y mide el tiempo
3. Compara los tiempos de la primera vs las siguientes

### Ejercicio 2: Invalidación Inteligente
1. Crea un servicio
2. Consulta la lista de servicios (se cachea)
3. Actualiza el servicio
4. Verifica que el caché se invalidó
5. Consulta de nuevo y verifica que se volvió a cachear

### Ejercicio 3: WebSockets en Acción
1. Conecta dos clientes WebSocket
2. Crea una reserva desde la API
3. Verifica que ambos clientes reciban notificaciones
4. Simula un pago y verifica las notificaciones

---

## 🐛 Troubleshooting

### Redis no conecta
```bash
# Verificar que Redis esté corriendo
docker ps | grep redis

# Ver logs
docker logs kuin-twin-redis

# Reiniciar
docker restart kuin-twin-redis
```

### Caché no se invalida
```bash
# Verificar que las claves se están eliminando
docker exec -it kuin-twin-redis redis-cli MONITOR

# Limpiar manualmente
docker exec -it kuin-twin-redis redis-cli FLUSHALL
```

### WebSockets no funcionan
```bash
# Verificar que la API esté corriendo
curl http://localhost:3001

# Ver logs de la API
npm run dev --filter=api
```

---

## 📚 Recursos Adicionales

- [Documentación de Redis](https://redis.io/docs/)
- [Socket.io Docs](https://socket.io/docs/v4/)
- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [Prisma Docs](https://www.prisma.io/docs)

---

¡Feliz testing! 🚀
