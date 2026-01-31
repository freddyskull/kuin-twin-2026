# User API - Documentación

## Endpoints Disponibles

### 1. Crear Usuario
**POST** `/api/users`

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "CUSTOMER"  // Opcional: ADMIN | VENDOR | CUSTOMER (default: CUSTOMER)
}
```

**Respuesta (201):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "role": "CUSTOMER",
  "createdAt": "2026-01-31T...",
  "updatedAt": "2026-01-31T..."
}
```

**Errores:**
- `400`: Validación fallida (email inválido, contraseña muy corta)
- `409`: Email ya registrado

---

### 2. Obtener Todos los Usuarios
**GET** `/api/users`

**Respuesta (200):**
```json
[
  {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "role": "CUSTOMER",
    "createdAt": "2026-01-31T...",
    "updatedAt": "2026-01-31T...",
    "profile": {
      "id": "uuid",
      "displayName": "Nombre Usuario",
      ...
    }
  }
]
```

---

### 3. Obtener Usuario por ID
**GET** `/api/users/:id`

**Parámetros:**
- `id`: UUID del usuario

**Respuesta (200):**
```json
{
  "id": "uuid",
  "email": "usuario@ejemplo.com",
  "role": "CUSTOMER",
  "createdAt": "2026-01-31T...",
  "updatedAt": "2026-01-31T...",
  "profile": { ... },
  "services": [ ... ],
  "bookings": [ ... ]
}
```

**Errores:**
- `404`: Usuario no encontrado

---

### 4. Actualizar Usuario
**PATCH** `/api/users/:id`

**Parámetros:**
- `id`: UUID del usuario

**Body (todos los campos opcionales):**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "newpassword123",
  "role": "VENDOR"
}
```

**Respuesta (200):**
```json
{
  "id": "uuid",
  "email": "nuevo@ejemplo.com",
  "role": "VENDOR",
  "createdAt": "2026-01-31T...",
  "updatedAt": "2026-01-31T..."
}
```

**Errores:**
- `400`: Validación fallida
- `404`: Usuario no encontrado
- `409`: Email ya registrado

---

### 5. Eliminar Usuario
**DELETE** `/api/users/:id`

**Parámetros:**
- `id`: UUID del usuario

**Respuesta (204):** Sin contenido

**Errores:**
- `404`: Usuario no encontrado

---

## Validaciones Implementadas

### Email
- Debe ser un email válido
- Debe ser único en el sistema

### Password
- Mínimo 8 caracteres
- Se hashea automáticamente con bcrypt
- Nunca se retorna en las respuestas

### Role
- Valores permitidos: `ADMIN`, `VENDOR`, `CUSTOMER`
- Default: `CUSTOMER`

---

## Seguridad

- ✅ Las contraseñas se hashean con bcrypt (10 rounds)
- ✅ El password nunca se retorna en las respuestas
- ✅ Validación de emails únicos
- ✅ Validación de datos con Zod schemas

---

## Ejemplos de Uso con cURL

### Crear usuario
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

### Obtener todos los usuarios
```bash
curl http://localhost:3001/api/users
```

### Obtener usuario por ID
```bash
curl http://localhost:3001/api/users/{user-id}
```

### Actualizar usuario
```bash
curl -X PATCH http://localhost:3001/api/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newemail@example.com"
  }'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3001/api/users/{user-id}
```

---

## Próximos Pasos

1. **Autenticación**: Implementar JWT para proteger los endpoints
2. **Autorización**: Implementar guards para verificar roles
3. **Profile**: Crear endpoints para gestionar perfiles de usuario
4. **Paginación**: Agregar paginación a GET /users
5. **Filtros**: Agregar filtros por role, fecha, etc.
