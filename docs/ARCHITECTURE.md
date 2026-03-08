# 🏗️ Arquitectura de Kuin Twin

Kuin Twin es un monorepo gestionado con **Turbo** que implementa un mercado libre de servicios profesionales y empresariales.

## 📦 Estructura del Proyecto

La plataforma se divide en tres áreas principales: aplicaciones, librerías compartidas y servicios de backend.

### 🚀 Aplicaciones (`apps/`)

*   **`admin-panel`**: Dashboard de administración construido con Vite + React + shadcn/ui. Permite la gestión global de usuarios, empresas, categorías y la moderación de servicios.
*   **`api`**: Backend core desarrollado con NestJS y Prisma. Utiliza PostgreSQL con extensiones de **PostGIS** para búsquedas geolocalizadas (encontrar servicios cerca del usuario).
*   **`web-store`**: El portal público para clientes construido con Next.js (App Router). Optimizado para SEO, permite buscar, filtrar y reservar servicios.

### 📚 Librerías Compartidas (`libs/`)

*   **`shared-types`**: La "Fuente Única de Verdad". Contiene esquemas de **Zod**, interfaces de TypeScript y constantes compartidas entre el frontend y el backend para evitar errores de validación.
*   **`ui-components`**: Biblioteca de componentes de UI (shadcn/ui adaptado) compartida entre el `admin-panel` y `web-store` para mantener una identidad visual coherente.
*   **`api-client`**: SDK generado o manual para consumir la API de forma tipada desde cualquier aplicación frontend.

## 🔄 Flujo de Datos

1.  **Validación de Extremo a Extremo**: Los esquemas de Zod en `libs/shared-types` se usan en el backend para validar entradas (DTOs) y en el frontend para los formularios (react-hook-form).
2.  **Geolocalización**: El backend procesa coordenadas (Lat/Lng) usando tipos de geografía de PostGIS para calcular distancias precisas entre proveedores y clientes.
3.  **Monorepo Workflow**: Se utiliza `turbo` para ejecutar compilaciones, linting y pruebas en paralelo, aprovechando el caché para acelerar el desarrollo.

## 🛠️ Stack Tecnológico

*   **Frameworks**: NestJS (API), Next.js (Web), Vite/React (Admin).
*   **Base de Datos**: PostgreSQL + Prisma ORM + PostGIS.
*   **Estilos**: Tailwind CSS + shadcn/ui.
*   **Validación**: Zod.
*   **Gestión de Monorepo**: TurboRepo.
