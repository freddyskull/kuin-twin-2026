---
trigger: always_on
---

# 📜 Manual de Estilo y Mejores Prácticas: Kuin-Twin 2026

Este documento define las reglas técnicas y de arquitectura exclusivas para el desarrollo de **Kuin-Twin**. Es la guía definitiva para el agente y el equipo.

## 🏗️ 1. Arquitectura de Dominio (Screaming Architecture)
1.  **Organización por Features:** El proyecto se estructura según los dominios de negocio (ej: `features/companies`, `features/bookings`).
2.  **Encapsulamiento:** Cada feature contiene su propia lógica: componentes, hooks, servicios y esquemas de validación.
3.  **Barrel Files:** Uso obligatorio de archivos `index.ts` en cada carpeta. Toda exportación debe pasar por el index del directorio.
4.  **Spanish First:** Todas las explicaciones, comentarios de código y mensajes de commit deben ser exclusivamente en **español**.

## 🛡️ 2. Validación y Single Source of Truth (Zod Absolute)
5.  **Single Source of Truth:** La verdad absoluta reside en `libs/shared-types` mediante esquemas de Zod atomizados.
6.  **Zod en Backend:** Se prohíbe el uso de `class-validator` y decoradores de Swagger en DTOs. La validación en NestJS se realiza exclusivamente mediante esquemas de Zod importados.
7.  **DTOs Dinámicos:** Los DTOs se definen mediante la inferencia de tipos: `export type CreateUserDto = z.infer<typeof createUserSchema>;`.
8.  **Atomización (Screaming-Zod):** Cada esquema debe vivir en su propio archivo dentro de su feature correspondiente en `shared-types`.

## ⚙️ 3. Reglas de Backend (NestJS + Prisma)
9.  **Regla de las 250 líneas:** Ningún archivo de lógica (`.service.ts` o `.controller.ts`) debe exceder las 250 líneas.
10. **Thin Controllers:** Los controladores solo gestionan rutas, parámetros y respuestas HTTP. No contienen lógica de negocio.
11. **Prisma Centralizado:** Uso del `PrismaService` inyectado. Las consultas complejas (PostGIS) deben ir en servicios dedicados o utilitarios.
12. **Manejo de Errores:** Usar `HttpException` de NestJS con mensajes claros en español. Implementar filtros globales para estandarizar respuestas de error.
13. **Dependency Injection:** Seguir estrictamente el patrón de NestJS. Evitar el uso de `new` para instanciar clases que deberían ser proveedores.

## 📝 4. Reglas de Frontend (React + Next.js + Vite)
14. **React Query:** Estándar obligatorio para manejar datos asíncronos. **Prohibido el uso de `useEffect` para cargar datos**.
15. **Zustand:** Exclusivamente para estado de UI global (filtros, sesión, modales).
16. **CustomForm Wrapper:** Uso obligatorio de un componente centralizado con `FormProvider` y `zodResolver`.
17. **Smart Submit Button:** Manejo automático de estados `loading`, `disabled` (si `!isValid` o `!isDirty`).
18. **Next.js (web-store):** 
    - Priorizar **React Server Components (RSC)** para el SEO y performance.
    - Usar `next/image` y `next/font` obligatoriamente.
19. **Vite (admin-panel):** Enfoque en SPA altamente interactiva usando TanStack Table para listados masivos.

## 🌍 5. Geolocalización (PostGIS)
20. **Lógica en Servidor:** Toda lógica espacial (distancias, áreas) debe ejecutarse en PostgreSQL mediante **PostGIS**.
21. **Tipado Geográfico:** Usar los tipos de `shared-types` que reflejen la estructura `Point` de la base de datos.

## 🧪 6. Estándar de Pruebas (Vitest)
22. **Runner:** Vitest es el único runner permitido.
23. **Mocking:** Usar `vi.mock` para dependencias externas y MSW para interceptar peticiones de red en frontend.

## 🚀 7. Git Workflow & Commits
24. **Mensaje de Commit Obligatorio:** Formato: `[scope/app] emoji tipo: descripción`.
    * **Scopes:** `backend`, `frontend`, `shared`, `infra`.
    * **Apps:** `api`, `web-store`, `admin-panel`.
    * **Tipos:** `feat`, `fix`, `refactor`, `style`, `ui`, `test`, `docs`, `config`.
    * **Ejemplo:** `[backend/api] ✨ feat: implementación de búsqueda por PostGIS`.

---
**Instrucción para el Agente:** *Gemini, aplica estas reglas con rigor quirúrgico. Si encuentras código que las viola, propone una refactorización inmediata.*
