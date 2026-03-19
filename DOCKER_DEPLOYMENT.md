# 🚀 Guía de Despliegue con Docker - Kuin Twin

Este documento describe cómo desplegar el ecosistema completo de **Kuin Twin** utilizando Docker y Docker Compose. La configuración ha sido optimizada para entornos de producción y staging, eliminando dependencias de desarrollo como Turborepo para garantizar la máxima estabilidad.

## 📋 Requisitos Previos

*   **Docker** (v20.10+)
*   **Docker Compose** (v2.0+)
*   Mínimo **4GB de RAM** recomendados para la construcción de imágenes.

## 🏗️ Arquitectura de Servicios

El despliegue consta de 5 contenedores principales:

1.  **`kuin-twin-db`**: Base de datos PostgreSQL 15 con extensión **PostGIS** para servicios geoespaciales.
2.  **`kuin-twin-redis`**: Servidor Redis 7 para gestión de caché y sesiones.
3.  **`kuin-twin-api`**: Backend NestJS. Incluye soporte nativo para procesamiento de imágenes (`sharp`) y cliente de Prisma optimizado.
4.  **`kuin-twin-web-store`**: Portal de cliente desarrollado en Next.js.
5.  **`kuin-twin-admin-panel`**: Dashboard administrativo (React/Vite) servido mediante **Nginx** optimizado.

---

## 🚀 Pasos para el Despliegue

### 1. Preparación del Entorno
Asegúrate de que los puertos 3000, 3001, 3002, 5432 y 6379 estén disponibles en tu host.

### 2. Construcción e Inicio
Ejecuta el siguiente comando en la raíz del proyecto para construir las imágenes e iniciar los servicios en segundo plano:

```bash
docker-compose up -d --build
```

### 3. Verificación de los Servicios
Puedes comprobar que todos los contenedores están corriendo correctamente con:

```bash
docker ps
```

---

## 🔗 Accesos Directos

| Servicio | URL | Puerto Host |
| :--- | :--- | :--- |
| **API Backend** | [http://localhost:3000/api](http://localhost:3000/api) | 3000 |
| **Web Store** | [http://localhost:3001](http://localhost:3001) | 3001 |
| **Admin Panel** | [http://localhost:3002/admin/](http://localhost:3002/admin/) | 3002 |
| **Documentación API (Swagger)** | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) | 3000 |

---

## 🛠️ Gestión de Base de Datos y Migraciones

La **API gestiona automáticamente las migraciones** al arrancar. No es necesario ejecutar comandos manuales para sincronizar el esquema.

### Ejecutar Seeders (Opcional)
Si necesitas poblar la base de datos con datos de prueba una vez que la API esté corriendo:

```bash
# Seed básico (Usuarios, categorías base)
docker exec kuin-twin-api npx ts-node -r tsconfig-paths/register --transpile-only prisma/seed-nest.ts

# Seed avanzado (Servicios, empresas y portafolios)
docker exec kuin-twin-api npx ts-node -r tsconfig-paths/register --transpile-only prisma/seed-services-fast.ts
```

---

## 🔍 Resolución de Problemas (Troubleshooting)

### Ver logs en tiempo real
Si algún servicio no responde, revisa los logs específicos:
```bash
docker logs -f kuin-twin-api
docker logs -f kuin-twin-web-store
docker logs -f kuin-twin-admin-panel
```

### Problemas con dependencias nativas (Sharp/Prisma)
Los Dockerfiles utilizan imágenes `node:20-slim` (Debian) y fuerzan la instalación de binarios para `linux-x64`. Si cambias de arquitectura (ej. ARM/M1), asegúrate de actualizar los flags `--cpu` en los Dockerfiles correspondientes.

### Reset completo del entorno
Para borrar bases de datos, volúmenes y empezar desde cero:
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📝 Notas de Configuración (DevOps)

*   **Sin Turbo**: Por estabilidad, el despliegue Docker no utiliza Turborepo. Usa comandos `npm` nativos con el flag `--workspace`.
*   **Admin Path**: El `admin-panel` está configurado para servirse estrictamente bajo el prefijo `/admin/` mediante una regla de alias en Nginx.
*   **Prisma Client**: Se genera durante el build y se copia íntegro en `node_modules` para evitar errores de "Module not found".
