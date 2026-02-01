# 🚀 Acceso Rápido a Swagger

## 📍 URL de Swagger UI

```
http://localhost:3001/api-docs
```

## ✅ Verificación Rápida

### 1. Verificar que la API esté corriendo
```bash
curl http://localhost:3001
```

### 2. Abrir Swagger UI
Abre tu navegador y ve a:
```
http://localhost:3001/api-docs
```

### 3. Explorar Endpoints
- Haz clic en cualquier tag (Users, Services, etc.)
- Expande un endpoint
- Click en "Try it out"
- Completa los parámetros
- Click en "Execute"

## 📥 Exportar Especificación OpenAPI

### JSON
```
http://localhost:3001/api-docs-json
```

### YAML
```
http://localhost:3001/api-docs-yaml
```

## 🎯 Ejemplos Rápidos

### Crear Usuario
1. Abre Swagger UI
2. Busca el tag "Users"
3. Click en `POST /api/users`
4. Click en "Try it out"
5. Pega este JSON:
```json
{
  "email": "test@example.com",
  "password": "password123",
  "role": "VENDOR"
}
```
6. Click en "Execute"
7. Ve la respuesta abajo

### Listar Servicios
1. Tag "Services"
2. `GET /api/services`
3. "Try it out"
4. "Execute"
5. Ve los servicios cacheados

## 🔍 Características

- ✅ Todos los endpoints documentados
- ✅ Esquemas de datos completos
- ✅ Códigos de respuesta
- ✅ Ejemplos de uso
- ✅ Búsqueda integrada
- ✅ Medición de tiempos

## 📚 Más Información

Ver [SWAGGER.md](./SWAGGER.md) para guía completa.

---

**¡Disfruta explorando la API!** 🎉
