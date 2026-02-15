---
trigger: always_on
---

# 📜 Manual de Estilo: Kuin-Twin 2026

Este documento define las reglas técnicas y de arquitectura exclusivas para el proyecto **Kuin-Twin**.

## 🏗️ Arquitectura de Dominio (Screaming Architecture)
1.  **Organización por Features:** El proyecto se estructura según los dominios de negocio (ej: `features/companies`, `features/bookings`).
2.  **Single Source of Truth:** Las validaciones de Zod nacen en la librería `shared-types` y se consumen tanto en la API como en la Web.
3.  **Esquemas Compartidos:** El esquema de Zod del formulario debe extender o reutilizar los esquemas definidos en `shared-types`.
4.  **Barrel Files:** Uso obligatorio de archivos `index.ts` en cada carpeta. Toda exportación debe pasar por el index del directorio.
5.  **Spanish First:** Todas las explicaciones, comentarios y mensajes de commit deben ser exclusivamente en **español**.

## ⚙️ Modularización de Backend (Evitar Archivos Extensos)
6.  **Regla de las 250 líneas:** Ningún archivo de lógica (`.service.ts` o `.controller.ts`) debe exceder las 250 líneas. Si crece más, debe fragmentarse.
7.  **División de Responsabilidades:**
    * **Controllers:** Solo gestionan rutas, parámetros y respuestas HTTP.
    * **Services:** Solo contienen lógica de negocio core y llamadas a Prisma.
    * **Mappers/Utils:** La lógica de transformación de datos o cálculos complejos debe vivir en archivos independientes dentro de la misma feature.
8.  **DTOs Independientes:** Cada validación de entrada debe tener su propio archivo en una carpeta `/dto` dentro de la feature.

## 📝 Manejo de Formularios y UI (Frontend)
9.  **CustomForm Wrapper:** Todos los formularios deben envolverse en un componente centralizado que gestione el envío y la validación.
10. **Smart Submit Button:** El botón de envío debe manejar estados de carga y deshabilitarse si el formulario es inválido (`!isValid`) o no ha sido modificado (`!isDirty`).
11. **Indicadores de Obligatoriedad:** Todo input requerido debe mostrar visualmente un asterisco (`*`) en su etiqueta.

## 📊 Gestión de Estado y Datos (Frontend)
12. **React Query para Datos Asíncronos:** Obligatorio para peticiones API. **Prohibido usar `useEffect` para cargar datos**.
13. **Zustand para Estado Global:** Solo para estado de UI global (modales, filtros, sesión).
14. **TanStack Table para Listados:** Estándar para todas las tablas del panel administrativo.
15. **Separación de Lógica:** Los hooks de React Query deben vivir en archivos `.hooks.ts`, no en el componente visual.

## 🚀 Git Workflow & Commits
Formato: `[scope] emoji tipo: descripción` (Scope: **backend**, **frontend**, **shared**).

| Icono | Tipo | Descripción |
| :--- | :--- | :--- |
| 🎉 | **tada** | Inicio de un dominio o módulo. |
| ✨ | **feat** | Nueva funcionalidad de negocio. |
| 🗃️ | **db** | Cambios en modelos de Prisma o base de datos. |
| 🦺 | **validation** | Cambios en esquemas de Zod o validaciones. |

---
**Instrucción para el Agente:** *Gemini, utiliza este archivo como la guía definitiva para Kuin-Twin. Aplica la fragmentación de archivos de backend de forma estricta.*