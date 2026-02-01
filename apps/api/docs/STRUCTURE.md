# 📁 Estructura de Documentación

```
apps/api/
│
├── 📄 API_INDEX.md                    # Índice rápido de acceso
├── 📄 README.md                       # Documentación técnica completa
│
├── 📁 docs/                           # Carpeta de documentación
│   ├── 📄 INDEX.md                    # Índice de toda la documentación
│   ├── 📄 SWAGGER.md                  # Guía de Swagger/OpenAPI
│   ├── 📄 SANDBOX.md                  # Sandbox con ejemplos de Redis
│   ├── 📄 REDIS_CACHE.md              # Guía de caché con Redis
│   └── 📄 TEST_TOOLS.md               # Herramientas de testing
│
├── 🧪 test-websocket.js               # Cliente WebSocket de prueba
├── 📊 monitor-redis.js                # Monitor de Redis
│
├── 📝 *.http                          # Archivos de prueba HTTP
│   ├── user.http
│   ├── service.http
│   ├── booking_flow.http
│   └── chat_test.http
│
└── 📁 src/                            # Código fuente
    ├── user/
    ├── service/
    ├── booking/
    ├── chat/
    └── ...
```

## 🎯 Flujo de Lectura Recomendado

### Para Nuevos Desarrolladores
1. **[API_INDEX.md](../API_INDEX.md)** - Vista general
2. **[README.md](../README.md)** - Arquitectura y módulos
3. **[docs/SWAGGER.md](./SWAGGER.md)** - Probar endpoints
4. **[docs/SANDBOX.md](./SANDBOX.md)** - Ejemplos prácticos

### Para Testing
1. **[docs/TEST_TOOLS.md](./TEST_TOOLS.md)** - Herramientas disponibles
2. **[docs/SANDBOX.md](./SANDBOX.md)** - Flujos de prueba
3. **[docs/REDIS_CACHE.md](./REDIS_CACHE.md)** - Monitoreo de caché

### Para Integración
1. **[docs/SWAGGER.md](./SWAGGER.md)** - Especificación OpenAPI
2. **[README.md](../README.md)** - Endpoints y DTOs
3. Archivos `.http` - Ejemplos de requests

## 📚 Contenido por Archivo

### API_INDEX.md
- Acceso rápido
- Links principales
- Inicio rápido

### README.md (Principal)
- Descripción general
- Arquitectura completa
- Todos los módulos
- Modelo de datos
- Comandos útiles

### docs/INDEX.md
- Navegación de documentación
- Conceptos clave
- Tutoriales paso a paso

### docs/SWAGGER.md
- Acceso a Swagger UI
- Cómo usar la interfaz
- Exportar especificación
- Configuración técnica

### docs/SANDBOX.md
- Pruebas básicas
- **Ejemplos de Redis** ⭐
- Flujo de reserva completo
- Pruebas de WebSockets
- Benchmarks

### docs/REDIS_CACHE.md
- Configuración de Redis
- Servicios cacheados
- Estrategia de invalidación
- Comandos de monitoreo

### docs/TEST_TOOLS.md
- test-websocket.js
- monitor-redis.js
- Scripts NPM
- Troubleshooting

## 🔗 Links Rápidos

| Necesito... | Ver... |
|-------------|--------|
| Empezar rápido | [API_INDEX.md](../API_INDEX.md) |
| Entender la arquitectura | [README.md](../README.md) |
| Probar endpoints | [Swagger UI](http://localhost:3001/api-docs) |
| Ejemplos de Redis | [SANDBOX.md](./SANDBOX.md#pruebas-de-caché-con-redis) |
| Monitorear caché | [TEST_TOOLS.md](./TEST_TOOLS.md) |
| Ver todos los endpoints | [README.md - Módulos](../README.md#módulos-de-la-api) |
| Conectar WebSockets | [README.md - WebSockets](../README.md#websockets) |
| Exportar OpenAPI | [SWAGGER.md](./SWAGGER.md#exportar-documentación) |

---

**Última actualización**: 2026-01-31
