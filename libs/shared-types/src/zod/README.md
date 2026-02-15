# 📚 Shared Types - Estructura de Zod Schemas

## 🎯 Objetivo

Esta librería contiene todos los esquemas de validación Zod compartidos entre el backend (API) y el frontend (Admin Panel). Los esquemas están sincronizados con los modelos de Prisma.

## 📁 Estructura de Archivos

```
src/zod/
├── common/                    # Utilidades y helpers compartidos
│   ├── json.ts               # Helpers para validación de JSON
│   ├── decimal.ts            # Helpers para tipos Decimal de Prisma
│   ├── enums.ts              # Enums de negocio y scalar fields
│   └── index.ts              # Barrel file
├── index.legacy.ts           # Esquemas generados por Prisma (REORGANIZADO)
├── index.ts                  # Punto de entrada principal
└── README.md                 # Este archivo
```

## 🏗️ Arquitectura

### ¿Por qué un solo archivo `index.legacy.ts`?

Los esquemas de Zod generados automáticamente por Prisma tienen **dependencias circulares inevitables** entre dominios. Por ejemplo:

- `User` tiene relación con `Profile`, `Service`, `Booking`, etc.
- `Profile` tiene relación con `User`, `Company`, `PortfolioItem`, etc.
- `Service` tiene relación con `User`, `Category`, `Booking`, etc.

Intentar separar estos esquemas en archivos por dominio genera errores de importación circular que TypeScript no puede resolver.

### Solución Implementada

1. **Archivo único con secciones claras**: `index.legacy.ts` contiene todos los esquemas pero está organizado con encabezados visuales por dominio:

```typescript
///////////////////////////////////////////////////////////////////////////
// AUTH DOMAIN - User Schemas
// Domain: auth
///////////////////////////////////////////////////////////////////////////

export const UserSchema = z.object({...})
export const UserWhereInputSchema = z.object({...})
// ... más esquemas de User

///////////////////////////////////////////////////////////////////////////
// PROFILES DOMAIN - Profile & Portfolio Schemas
// Domain: profiles
///////////////////////////////////////////////////////////////////////////

export const ProfileSchema = z.object({...})
// ... más esquemas de Profile
```

2. **Módulo `common/` separado**: Los helpers y utilidades que NO tienen dependencias circulares están en archivos separados para mejor organización.

## 🔄 Regeneración de Esquemas

Cuando modifiques el schema de Prisma (`prisma/schema.prisma`), debes regenerar los esquemas de Zod:

```bash
# Desde la raíz del proyecto
npm run db:generate

# Luego reorganiza el archivo con secciones claras
cd libs/shared-types/src/zod
node reorganize-legacy.js
```

## 📖 Uso

### En el Backend (API)

```typescript
import { UserCreateInputSchema, ServiceWhereInputSchema } from 'shared-types/zod';

// Validar input de creación de usuario
const validatedData = UserCreateInputSchema.parse(req.body);

// Validar filtros de búsqueda de servicios
const filters = ServiceWhereInputSchema.parse(query);
```

### En el Frontend (Admin Panel)

```typescript
import { UserSchema, ServiceSchema } from 'shared-types/zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Usar en formularios con React Hook Form
const form = useForm({
  resolver: zodResolver(UserSchema),
});
```

## 🎨 Screaming Architecture

Aunque los esquemas están en un solo archivo por necesidad técnica, están **organizados por dominios de negocio**:

- **auth**: User, Role
- **messaging**: Message
- **media**: Media
- **profiles**: Profile, PortfolioItem
- **companies**: Company, Branch
- **services**: Service, Category, ServiceUnit, ServiceMetadata
- **bookings**: Booking, BookingDetails, ServiceSlot
- **payments**: Payment

Esto facilita encontrar y mantener los esquemas relacionados con cada dominio del negocio.

## 🛠️ Scripts Útiles

- `split-schemas.js`: Intento de separar esquemas por dominio (no funcional por dependencias circulares)
- `reorganize-legacy.js`: ✅ Reorganiza `index.legacy.ts` con encabezados por dominio
- `extract-schemas.js`: Script auxiliar para análisis de esquemas

## 📝 Notas Importantes

1. **NO edites `index.legacy.ts` manualmente**: Este archivo es generado automáticamente. Usa el script `reorganize-legacy.js` después de regenerar.

2. **Helpers en `common/`**: Si necesitas agregar helpers personalizados, agrégalos en el módulo `common/` y expórtalos desde `common/index.ts`.

3. **Enums de negocio**: Los enums como `RoleSchema`, `BookingStatusSchema`, etc. están en `common/enums.ts` para facilitar su reutilización.

## 🔍 Búsqueda Rápida

Para encontrar esquemas específicos en `index.legacy.ts`, busca por:

- **Dominio**: `// AUTH DOMAIN`, `// SERVICES DOMAIN`, etc.
- **Modelo**: `export const UserSchema`, `export const ServiceWhereInputSchema`, etc.
- **Tipo de operación**: `CreateInput`, `UpdateInput`, `WhereInput`, `OrderBy`, etc.

---

**Última actualización**: 2026-02-15
**Mantenido por**: Equipo Kuin-Twin
