# Configuración de Archivos Estáticos en NestJS

## Descripción

NestJS está configurado para servir tres tipos de archivos estáticos:

1. **API Uploads** (`/uploads`) - Archivos subidos por usuarios
2. **Admin Panel** (`/admin`) - Panel de administración (Vite + React)
3. **Web Store** (`/`) - Tienda web (Next.js)

## Estructura de Rutas

```
http://localhost:3001/
├── /api/*              → API REST endpoints
├── /api-docs           → Documentación Swagger
├── /uploads/*          → Archivos subidos
├── /admin/*            → Panel de administración
└── /*                  → Web Store (fallback)
```

## Orden de Prioridad

Las rutas se evalúan en el siguiente orden:

1. **Rutas de API** (`/api/*`) - Máxima prioridad
2. **Uploads** (`/uploads/*`) - Alta prioridad
3. **Admin Panel** (`/admin/*`) - Media prioridad
4. **Web Store** (`/*`) - Baja prioridad (fallback para todas las demás rutas)

## Configuración

La configuración se encuentra en `apps/api/src/app.module.ts`:

```typescript
ServeStaticModule.forRoot(
  // 1. API uploads
  {
    rootPath: join(__dirname, '..', '..', 'uploads'),
    serveRoot: '/uploads',
    serveStaticOptions: {
      index: false,
    },
  },
  // 2. Admin Panel
  {
    rootPath: join(__dirname, '../../..', 'apps/admin-panel/dist'),
    serveRoot: '/admin',
    serveStaticOptions: {
      index: ['index.html'],
    },
  },
  // 3. Web Store
  {
    rootPath: join(__dirname, '../../..', 'apps/web-store/out'),
    exclude: ['/api/(.*)', '/admin/(.*)', '/uploads/(.*)'],
    serveStaticOptions: {
      index: ['index.html'],
    },
  },
)
```

## Construcción de Aplicaciones

Antes de iniciar el servidor, asegúrate de construir todas las aplicaciones:

```bash
# Construir todo el monorepo
npm run build

# O construir aplicaciones individuales
npm run build --filter=admin-panel
npm run build --filter=web-store
npm run build --filter=api
```

## Iniciar el Servidor

```bash
# Modo desarrollo (con hot-reload)
npm run dev --filter=api

# Modo producción
npm run start
```

## Acceso a las Aplicaciones

Una vez iniciado el servidor:

- **API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api-docs
- **Web Store**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin
- **Uploads**: http://localhost:3001/uploads

## Notas Importantes

### SPA Routing

Tanto el Admin Panel como el Web Store son Single Page Applications (SPAs). Para que el routing del lado del cliente funcione correctamente:

- **Admin Panel (Vite)**: Todas las rutas bajo `/admin/*` sirven `index.html`
- **Web Store (Next.js)**: Exportado como sitio estático con `output: 'export'`

### Exclusiones

El Web Store excluye explícitamente:
- `/api/*` - Para evitar conflictos con la API
- `/admin/*` - Para evitar conflictos con el Admin Panel
- `/uploads/*` - Para evitar conflictos con archivos subidos

### Directorio Uploads

El directorio `apps/api/uploads` debe existir. Si no existe, créalo:

```bash
mkdir -p apps/api/uploads
```

## Troubleshooting

### Error: Cannot GET /admin

**Problema**: El Admin Panel no se carga.

**Solución**: 
1. Verifica que `apps/admin-panel/dist` existe
2. Reconstruye: `npm run build --filter=admin-panel`

### Error: Cannot GET /

**Problema**: El Web Store no se carga.

**Solución**:
1. Verifica que `apps/web-store/out` existe
2. Reconstruye: `npm run build --filter=web-store`

### Rutas de API no funcionan

**Problema**: Las rutas de API devuelven 404.

**Solución**:
1. Verifica que todas las rutas de API estén bajo el prefijo `/api`
2. Revisa la configuración de `exclude` en ServeStaticModule

## Desarrollo

Durante el desarrollo, puedes ejecutar las aplicaciones por separado:

```bash
# Terminal 1: API
npm run dev --filter=api

# Terminal 2: Admin Panel
npm run dev --filter=admin-panel

# Terminal 3: Web Store
npm run dev --filter=web-store
```

Esto permite hot-reload independiente para cada aplicación.

## Producción

En producción, solo necesitas ejecutar el servidor NestJS:

```bash
# Construir todo
npm run build

# Iniciar servidor
npm run start
```

Todas las aplicaciones se servirán desde un solo puerto (3001).
