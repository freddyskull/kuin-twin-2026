# 🧪 Herramientas de Testing

Este directorio contiene herramientas para probar y monitorear la API de Kuin Twin.

## 📦 Instalación

```bash
# Instalar dependencias de las herramientas de testing
npm install socket.io-client ioredis
```

## 🔌 Test de WebSockets

Monitorea eventos en tiempo real de la API.

### Uso:
```bash
node test-websocket.js
```

### Configuración:
Edita `test-websocket.js` y reemplaza:
```javascript
const VENDOR_ID = 'tu-vendor-uuid';
const CUSTOMER_ID = 'tu-customer-uuid';
```

### Eventos que escucha:
- ✅ `new_booking` - Nueva reserva (vendedor)
- 💰 `booking_paid` - Pago recibido (vendedor)
- ✅ `payment_confirmed` - Pago confirmado (cliente)
- 📝 `booking_status_changed` - Cambio de estado
- 📅 `slots_updated` - Actualización de disponibilidad
- 💬 `new_message` - Nuevo mensaje de chat

## 📊 Monitor de Redis

Visualiza el estado del caché en tiempo real.

### Modo Monitor (Actualización automática):
```bash
node monitor-redis.js --monitor
# o simplemente
node monitor-redis.js
```

### Modo Interactivo:
```bash
node monitor-redis.js --interactive
```

**Opciones disponibles:**
1. Ver todas las claves
2. Ver valor de una clave
3. Eliminar una clave
4. Limpiar todo el caché
5. Ver estadísticas
0. Salir

### Información mostrada:
- 📈 Estadísticas del servidor Redis
- 🔑 Número de claves en caché
- 🛠️ Servicios cacheados
- 📁 Categorías cacheadas
- 👤 Usuarios cacheados
- ⏱️ TTL (tiempo de vida) de cada clave
- 💾 Memoria usada

## 📝 Scripts NPM

Si prefieres, puedes agregar estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test:websocket": "node apps/api/test-websocket.js",
    "monitor:redis": "node apps/api/monitor-redis.js --monitor",
    "redis:interactive": "node apps/api/monitor-redis.js --interactive"
  }
}
```

Luego ejecutar:
```bash
npm run test:websocket
npm run monitor:redis
npm run redis:interactive
```

## 🎯 Flujo de Prueba Completo

### Terminal 1: Monitor de Redis
```bash
node monitor-redis.js --monitor
```

### Terminal 2: Cliente WebSocket
```bash
node test-websocket.js
```

### Terminal 3: API
```bash
npm run dev --filter=api
```

### Terminal 4: Pruebas HTTP
Usa tu cliente HTTP favorito (Postman, Thunder Client, REST Client) con los archivos `.http` incluidos:
- `user.http`
- `service.http`
- `booking_flow.http`
- `chat_test.http`

## 🔍 Ejemplo de Flujo de Prueba

1. **Inicia el monitor de Redis:**
   ```bash
   node monitor-redis.js
   ```

2. **Inicia el cliente WebSocket:**
   ```bash
   node test-websocket.js
   ```

3. **Crea un servicio** (desde Postman o archivo .http):
   - Observa en el monitor que NO se cachea (es una escritura)

4. **Consulta el servicio:**
   - Primera consulta: CACHE MISS (se guarda en Redis)
   - Segunda consulta: CACHE HIT (se sirve desde Redis)
   - Observa la diferencia de tiempo

5. **Crea una reserva:**
   - Observa las notificaciones WebSocket en tiempo real
   - El vendedor recibe `new_booking`
   - Los slots se actualizan (`slots_updated`)

6. **Simula un pago:**
   - El cliente recibe `payment_confirmed`
   - El vendedor recibe `booking_paid`
   - Ambos reciben `booking_status_changed`

## 🐛 Troubleshooting

### Error: Cannot find module 'socket.io-client'
```bash
npm install socket.io-client ioredis
```

### Error: ECONNREFUSED (Redis)
```bash
# Verificar que Redis esté corriendo
docker ps | grep redis

# Iniciar Redis
docker-compose up -d redis
```

### Error: ECONNREFUSED (WebSocket)
```bash
# Verificar que la API esté corriendo
curl http://localhost:3001

# Iniciar API
npm run dev --filter=api
```

## 📚 Recursos

- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [ioredis Docs](https://github.com/redis/ioredis)
- [Redis Commands](https://redis.io/commands/)

---

¡Feliz testing! 🚀
