# Redis Caching Implementation

## Configuración

La API ahora utiliza **Redis** como capa de caché para optimizar las consultas más frecuentes.

### Conexión
- **URL**: `redis://localhost:6379` (configurable vía `REDIS_URL` en `.env`)
- **TTL por defecto**: 10 minutos (600,000 ms)

## Servicios con Caché

### 1. **ServiceService**
- **`findAll()`**: Cache por 5 minutos
  - Claves: `services:all`, `services:vendor:{vendorId}`, `services:category:{categoryId}`
- **`findOne(id)`**: Cache por 10 minutos
  - Clave: `service:{id}`
- **Invalidación automática**: Al crear, actualizar o eliminar servicios

### 2. **CategoryService**
- **`findAll()`**: Cache por 15 minutos (las categorías cambian poco)
  - Claves: `categories:all`, `categories:roots`
- **`findOne(idOrSlug)`**: Cache por 15 minutos
  - Clave: `category:{idOrSlug}`
- **Invalidación automática**: Al crear, actualizar o eliminar categorías

### 3. **UserService**
- **`findAll()`**: Cache por 3 minutos
  - Clave: `users:all`
- **`findOne(id)`**: Cache por 5 minutos
  - Clave: `user:{id}`
- **Invalidación automática**: Al actualizar o eliminar usuarios

## Estrategia de Invalidación

Cada vez que se modifica un recurso (crear, actualizar, eliminar), se invalidan automáticamente:
1. El cache específico del recurso
2. Los caches de listados relacionados

Ejemplo: Al crear un servicio, se invalidan:
- `services:all`
- `services:vendor:{vendorId}`
- `services:category:{categoryId}`

## Beneficios

- **Reducción de carga en PostgreSQL**: Las consultas frecuentes se sirven desde Redis
- **Mejor rendimiento**: Respuestas más rápidas para endpoints de lectura
- **Escalabilidad**: Redis puede manejar miles de consultas por segundo
- **Consistencia**: La invalidación automática asegura que los datos estén actualizados

## Monitoreo

Para verificar el estado de Redis:
```bash
docker exec -it kuin-twin-redis redis-cli
> KEYS *
> GET service:uuid-example
```
