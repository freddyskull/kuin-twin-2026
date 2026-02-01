# 📚 Documentación Swagger/OpenAPI

La API de Kuin Twin está completamente documentada con **Swagger/OpenAPI 3.0**, proporcionando una interfaz interactiva para explorar y probar todos los endpoints.

## 🌐 Acceso a la Documentación

### Desarrollo Local
```
http://localhost:3001/api-docs
```

### Producción
```
https://api.kuintwin.com/api-docs
```

## ✨ Características

### Interfaz Interactiva
- 🎯 **Try it out**: Prueba cada endpoint directamente desde el navegador
- 📝 **Esquemas**: Visualiza los modelos de datos y DTOs
- 🔍 **Filtros**: Busca endpoints por nombre o tag
- ⏱️ **Medición**: Ve el tiempo de respuesta de cada request
- 💾 **Persistencia**: La autenticación se guarda en localStorage

### Organización por Tags

Los endpoints están organizados en las siguientes categorías:

| Tag | Descripción | Endpoints |
|-----|-------------|-----------|
| **Users** | Gestión de usuarios y perfiles | 6 endpoints |
| **Portfolio** | Portafolio de trabajos | 3 endpoints |
| **Media** | Galería de medios | 3 endpoints |
| **Categories** | Categorías de servicios | 5 endpoints |
| **Service Units** | Unidades de medida | 5 endpoints |
| **Services** | Catálogo de servicios | 5 endpoints |
| **Slots** | Disponibilidad horaria | 5 endpoints |
| **Bookings** | Reservas | 4 endpoints |
| **Payments** | Procesamiento de pagos | 2 endpoints |
| **Chat** | Mensajería interna | 4 endpoints |

### Información Detallada

Cada endpoint incluye:
- ✅ Descripción completa
- 📋 Parámetros requeridos y opcionales
- 📦 Esquemas de request/response
- ⚠️ Códigos de estado HTTP
- 💡 Ejemplos de uso
- 🔒 Requisitos de autenticación (cuando aplique)

## 🚀 Cómo Usar

### 1. Explorar Endpoints

1. Abre `http://localhost:3001/api-docs`
2. Navega por los tags en el menú lateral
3. Haz clic en cualquier endpoint para ver sus detalles

### 2. Probar un Endpoint

1. Haz clic en el endpoint que quieras probar
2. Click en **"Try it out"**
3. Completa los parámetros requeridos
4. Click en **"Execute"**
5. Ve la respuesta en tiempo real

### Ejemplo: Crear un Usuario

```http
POST /api/users
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "role": "VENDOR"
}
```

**Respuesta esperada (201):**
```json
{
  "id": "uuid-123",
  "email": "test@example.com",
  "role": "VENDOR",
  "createdAt": "2026-01-31T20:00:00.000Z"
}
```

### 3. Ver Esquemas

1. Scroll hasta la sección **"Schemas"** al final de la página
2. Explora los modelos de datos:
   - `CreateUserDto`
   - `UserResponseDto`
   - `Service`
   - `Booking`
   - etc.

## 📖 Información Adicional

### Caché
La documentación indica qué endpoints están cacheados:
- ⚡ **Servicios**: 5-10 minutos
- ⚡ **Categorías**: 15 minutos
- ⚡ **Usuarios**: 3-5 minutos

### WebSockets
Los eventos de WebSocket están documentados en la descripción general:
- `new_message`
- `new_booking`
- `booking_status_changed`
- `slots_updated`
- `payment_confirmed`
- `booking_paid`

### Servidores

La documentación incluye dos servidores configurados:
1. **Desarrollo Local**: `http://localhost:3001`
2. **Producción**: `https://api.kuintwin.com`

Puedes cambiar entre ellos usando el dropdown en la parte superior.

## 🎨 Personalización

### Tema Oscuro
La interfaz usa el tema **Monokai** para syntax highlighting, optimizado para lectura de código.

### CSS Personalizado
- Topbar oculto para más espacio
- Título más grande y prominente
- Márgenes optimizados

## 📥 Exportar Documentación

### Formato JSON
```
http://localhost:3001/api-docs-json
```

### Formato YAML
```
http://localhost:3001/api-docs-yaml
```

Puedes importar estos archivos en:
- **Postman**: Import → OpenAPI 3.0
- **Insomnia**: Import → OpenAPI
- **API Clients**: Cualquier cliente compatible con OpenAPI

## 🔧 Configuración Técnica

### Instalación
```bash
npm install @nestjs/swagger --legacy-peer-deps
```

### Configuración (main.ts)
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Kuin Twin API')
  .setDescription('API completa para marketplace de servicios')
  .setVersion('1.0.0')
  .addTag('Users', 'Gestión de usuarios')
  // ... más tags
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

### Decoradores en Controladores

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @ApiResponse({ status: 409, description: 'Email ya existe' })
  async create(@Body() dto: CreateUserDto) {
    // ...
  }
}
```

## 🌟 Mejores Prácticas

### 1. Descripciones Claras
Cada endpoint tiene una descripción que explica:
- Qué hace
- Cuándo usarlo
- Efectos secundarios (ej: invalidación de caché)

### 2. Códigos de Estado
Todos los posibles códigos de respuesta están documentados:
- `200`: Éxito
- `201`: Creado
- `204`: Sin contenido
- `400`: Bad request
- `404`: No encontrado
- `409`: Conflicto

### 3. Ejemplos Realistas
Los ejemplos usan datos que realmente funcionan en el sistema.

## 🔗 Recursos

- [Documentación de NestJS Swagger](https://docs.nestjs.com/openapi/introduction)
- [Especificación OpenAPI 3.0](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## 💡 Tips

### Búsqueda Rápida
Usa `Ctrl+F` (o `Cmd+F` en Mac) para buscar endpoints específicos.

### Colapsar Todo
Click en "List Operations" para colapsar todos los endpoints y tener una vista general.

### Copiar cURL
Cada request ejecutado genera un comando cURL que puedes copiar y usar en terminal.

### Persistencia
Los valores que ingreses en "Try it out" se guardan automáticamente para la próxima vez.

---

## 🎯 Próximos Pasos

1. ✅ Explora la documentación en `http://localhost:3001/api-docs`
2. ✅ Prueba algunos endpoints
3. ✅ Exporta la especificación OpenAPI
4. ✅ Importa en tu cliente HTTP favorito
5. ✅ Comparte con tu equipo

---

**¡La documentación está viva!** Se actualiza automáticamente cada vez que modificas los controladores o DTOs. 🚀
