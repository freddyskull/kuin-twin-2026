# 🛠️ Guía de Desarrollo

Este documento explica cómo configurar y trabajar en el monorepo de Kuin Twin.

## 📋 Prerrequisitos

*   **Node.js**: v18 o superior.
*   **PostgreSQL**: v13 o superior con la extensión **PostGIS** instalada.
*   **Docker** (Opcional): Para levantar la base de datos rápidamente.

## 🚀 Inicio Rápido

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno**:
    Copia los archivos `.env.example` a `.env` en las carpetas `apps/api` y `apps/web-store`.

3.  **Preparar la Base de Datos**:
    En `apps/api`, asegúrate de que tu `DATABASE_URL` sea correcta. Luego ejecuta:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    npx prisma db seed
    ```

4.  **Ejecutar el proyecto**:
    Desde la raíz del monorepo, inicia todas las aplicaciones en modo desarrollo:
    ```bash
    npm run dev
    ```
    Esto lanzará la API, el Admin Panel y la Web Store simultáneamente usando **Turbo**.

## 🏗️ Comandos del Monorepo (Turbo)

*   `npm run build`: Compila todas las aplicaciones y librerías.
*   `npm run lint`: Ejecuta el linter en todo el proyecto.
*   `npm run test`: Ejecuta las pruebas unitarias y de integración.
*   `npx turbo run build --filter=api`: Compila solo la aplicación de la API.

## 📍 Configuración de PostGIS (Geolocalización)

Kuin Twin utiliza **PostGIS** para realizar búsquedas espaciales (ej: "servicios a menos de 5km"). Si estás usando una base de datos local, asegúrate de activar la extensión:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

En Prisma, los campos de ubicación se manejan como `Unsupported("geography(Point, 4326)")`.

## 📂 Librerías Compartidas

Si realizas cambios en `libs/shared-types` o `libs/ui-components`, Turbo se encargará de reconstruir las aplicaciones dependientes automáticamente en el siguiente ciclo de `dev` o `build`.

## 🧪 Pruebas de API

En `apps/api/`, encontrarás archivos `.http` que puedes usar con la extensión **REST Client** de VS Code para probar los endpoints (Auth, Booking, Services) sin necesidad de una interfaz gráfica.
