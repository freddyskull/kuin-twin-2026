---
trigger: always_on
---

**Single Source of Truth:** Las validaciones de Zod nacen en `shared-types` y se consumen en API y Web.
**Esquemas Compartidos:** Siempre que sea posible, el esquema de Zod del formulario debe extender o reutilizar los esquemas definidos en la carpeta `shared-types` (los mismos que usa Prisma/NestJS).

## 🏗️ Gestión de Estado y Datos (Frontend)
**React Query para Datos Asíncronos:** Toda petición a la API (GET, POST, PUT, DELETE) debe gestionarse con `useQuery` o `useMutation`. Prohibido usar `useEffect` para cargar datos.
**Zustand para Estado Global:** Usar Zustand solo para estado UI global (modales, filtros persistentes, sesión de usuario). Si el dato viene de la DB, usa React Query.
**TanStack Table para Listados:** Todas las tablas (especialmente en el Panel Admin) deben implementarse con TanStack Table (Headless UI) para garantizar flexibilidad y rendimiento.
**Separación de Lógica:** Los hooks de React Query deben vivir en archivos `.hooks.ts` o carpetas `queries/` dedicadas, no directamente en el componente visual.