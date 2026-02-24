---
trigger: always_on
---

# 📜 Manual de Estilo: Kuin-Twin 2026

Este documento define las reglas técnicas y de arquitectura exclusivas para el desarrollo de **Kuin-Twin**.

## 🏗️ Arquitectura de Dominio (Screaming Architecture)
1.  **Organización por Features:** El proyecto se estructura según los dominios de negocio (ej: `features/companies`, `features/bookings`).
2.  **Encapsulamiento:** Cada feature contiene su propia lógica: componentes, hooks, servicios y esquemas de validación.
3.  **Barrel Files:** Uso obligatorio de archivos `index.ts` en cada carpeta. Toda exportación debe pasar por el index del directorio.
4.  **Spanish First:** Todas las explicaciones, comentarios de código y mensajes de commit deben ser exclusivamente en **español**.

## 🦺 Validación y Single Source of Truth (Zod Absolute)
5.  **Single Source of Truth:** La verdad absoluta reside en `libs/shared-types` mediante esquemas de Zod atomizados.
6.  **Zod en Backend:** Se prohíbe el uso de `class-validator` y Swagger. La validación en NestJS se realiza exclusivamente mediante esquemas de Zod importados de `shared-types`.
7.  **DTOs Dinámicos:** Los DTOs en el backend se definen mediante la inferencia de tipos de Zod, eliminando la creación de clases manuales y decoradores innecesarios.
8.  **Atomización (Screaming-Zod):** Cada esquema debe vivir en su propio archivo dentro de su feature correspondiente en `shared-types`.

## ⚙️ Modularización de Backend (Evitar Archivos Extensos)
9.  **Regla de las 250 líneas:** Ningún archivo de lógica (`.service.ts` o `.controller.ts`) debe exceder las 250 líneas. Si crece más, debe fragmentarse en utilitarios o sub-servicios.
10. **División de Responsabilidades:**
    * **Controllers:** Solo gestionan rutas, parámetros y respuestas HTTP.
    * **Services:** Solo contienen lógica de negocio core y llamadas a Prisma.
    * **Mappers/Utils:** Transformaciones de datos o cálculos complejos (como PostGIS) deben vivir en archivos independientes.
11. **DTOs Independientes:** Cada validación de entrada debe tener su propio archivo en una carpeta `/dto` dentro de la feature.

## 📝 Manejo de Formularios y UI (Frontend)
12. **CustomForm Wrapper:** Uso obligatorio de un componente centralizado con `FormProvider` y `zodResolver`.
13. **Smart Submit Button:** Debe manejar estados de carga y deshabilitarse automáticamente si el formulario es inválido (`!isValid`) o no ha sido modificado (`!isDirty`).
14. **Indicadores de Obligatoriedad:** Todo input requerido según el esquema Zod debe mostrar visualmente un asterisco (`*`) en su etiqueta.

## 📊 Gestión de Estado y Datos (Frontend)
15. **React Query:** Estándar obligatorio para manejar datos asíncronos. **Prohibido el uso de `useEffect` para cargar datos**.
16. **Zustand:** Se utiliza exclusivamente para estado de UI global (filtros, sesión, modales).
17. **TanStack Table:** Estándar para todos los listados de datos y paneles administrativos.
18. **Separación de Lógica:** Los hooks de React Query deben residir en archivos `.hooks.ts` específicos dentro de su feature.

## 🌍 Geolocalización y Mapas
19. **Google Maps Optimization:** Uso obligatorio de API Keys restringidas y Session Tokens para Autocomplete.
20. **Cálculo Local:** Prohibido usar APIs externas para cálculos de distancia. Toda la lógica espacial debe ejecutarse en el servidor mediante **PostGIS**.
21. **Persistencia:** Las coordenadas obtenidas deben guardarse inmediatamente en la DB para evitar re-consultas pagas a APIs de terceros.

## 🧪 Estándar de Pruebas (Testing)
22. **Prioridad de Pruebas:** Se priorizan los tests de integración en el Backend y los tests de comportamiento en el Frontend.
23. **Vitest como Runner:** Uso obligatorio de Vitest por su velocidad y compatibilidad.
24. **Mocks de API:** Uso de MSW en el frontend para tests de componentes.

## 🌐 Storefront / Parte Pública (Cliente)
25. **Framework:** Uso de Next.js para la parte pública por beneficios de SEO y SSR.
26. **SEO Optimization:** Cada página de servicio debe usar metadatos dinámicos basados en el `title` y `description` del modelo.
27. **Performance:** Imágenes optimizadas obligatoriamente mediante el componente `<Image />` de Next.js.
28. **Mobile First:** El diseño debe ser 100% responsivo, priorizando la experiencia en celulares.

## 🚀 Git Workflow & Commits
29. **Mensaje de Commit Obligatorio:** Al finalizar cualquier modificación, el agente debe proporcionar un mensaje de commit siguiendo el formato: `[scope/app] emoji tipo: descripción`.
    * **Scopes:** `backend`, `frontend`, `mobile`, `docs` o `ambos`.
    * **Apps:** Nombre de la aplicación (ej: `api`, `web-store`, `admin-panel`).
    * **Emojis:** Usar la convención de Gitmojis (✨ feat, 🐛 fix, ♻️ refactor, 🎨 style, 💄 ui, 🔧 config, etc.).
    * **Idioma:** Exclusivamente en **español**.

**Instrucción para el Agente:** *Gemini, utiliza este archivo como la guía definitiva para Kuin-Twin. Aplica la fragmentación de archivos, la atomización de esquemas de Zod y la generación de mensajes de commit de forma estricta.*