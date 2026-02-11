---
trigger: always_on
---

**Single Source of Truth:** Las validaciones de Zod nacen en `shared-types` y se consumen en API y Web.

## 🏗️ Gestión de Estado y Datos (Frontend)
13. **React Query para Datos Asíncronos:** Toda petición a la API (GET, POST, PUT, DELETE) debe gestionarse con `useQuery` o `useMutation`. Prohibido usar `useEffect` para cargar datos.
14. **Zustand para Estado Global:** Usar Zustand solo para estado UI global (modales, filtros persistentes, sesión de usuario). Si el dato viene de la DB, usa React Query.
15. **TanStack Table para Listados:** Todas las tablas (especialmente en el Panel Admin) deben implementarse con TanStack Table (Headless UI) para garantizar flexibilidad y rendimiento.
16. **Separación de Lógica:** Los hooks de React Query deben vivir en archivos `.hooks.ts` o carpetas `queries/` dedicadas, no directamente en el componente visual.