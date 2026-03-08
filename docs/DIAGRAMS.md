# 📊 Diagramas del Sistema

En esta sección se visualizan los flujos y estructuras principales de Kuin Twin.

## 🏗️ Arquitectura del Monorepo

Este diagrama muestra cómo se conectan las aplicaciones con las librerías compartidas.

```mermaid
graph TD
    subgraph Apps
        Admin[Admin Panel - Vite/React]
        Web[Web Store - Next.js]
        API[API - NestJS/Prisma]
    end

    subgraph Libs
        ST[shared-types - Zod/TS]
        UI[ui-components - Tailwind/shadcn]
        AC[api-client - SDK]
    end

    Admin --> ST
    Admin --> UI
    Admin --> AC

    Web --> ST
    Web --> UI
    Web --> AC

    API --> ST
    API --> DB[(PostgreSQL + PostGIS)]
```

## 🗄️ Modelo de Datos (ERD)

Representación de las entidades principales y sus relaciones.

```mermaid
erDiagram
    USER ||--o| PROFILE : has
    PROFILE ||--o{ SERVICE : manages
    COMPANY ||--o{ BRANCH : owns
    COMPANY ||--o{ PROFILE : employs
    BRANCH ||--o{ SERVICE : offers
    SERVICE ||--o{ BOOKING : receives
    SERVICE }|--|| CATEGORY : belongs_to
    USER ||--o{ BOOKING : makes

    USER {
        string id PK
        string email UK
        string role "CUSTOMER, VENDOR, ADMIN"
    }
    PROFILE {
        string id PK
        string bio
        point location "PostGIS Point"
        float rating
    }
    COMPANY {
        string id PK
        string rfc UK
        string name "Razón Social"
        boolean isVerified
    }
    SERVICE {
        string id PK
        string title
        float basePrice
        string status "ACTIVE, INACTIVE"
    }
```

## 🛡️ Flujo de Verificación SAT

Proceso de validación de una empresa por parte de un administrador.

```mermaid
sequenceDiagram
    participant V as Vendor (Empresa)
    participant S as Web/Admin App
    participant A as API / Database
    participant AD as Administrator

    V->>S: Sube RFC y Constancia Fiscal (CSF)
    S->>A: Guarda datos con status 'PENDING'
    A-->>AD: Notifica nueva solicitud de verificación
    AD->>A: Consulta datos en portal SAT
    alt Datos Correctos
        AD->>A: Aprueba Empresa
        A->>V: Notifica éxito y activa sello "Verificado"
    else Datos Incorrectos
        AD->>A: Rechaza con motivo
        A->>V: Notifica motivo de rechazo (ej: RFC inválido)
    end
```
