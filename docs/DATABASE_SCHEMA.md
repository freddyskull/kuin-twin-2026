# 🗄️ Esquema de Base de Datos

Kuin Twin utiliza **Prisma** como ORM y **PostgreSQL** con la extensión **PostGIS**.

## 🧩 Entidades Principales

### 👤 Usuarios y Perfiles (`User`, `Profile`)
*   **Roles**: `CUSTOMER`, `VENDOR`, `ADMIN`.
*   **Profile**: Contiene la biografía, redes sociales, promedio de calificación y ubicación geográfica.
*   **Relación**: Un perfil puede pertenecer a una empresa (`Company`).

### 🏢 Empresas y Sucursales (`Company`, `Branch`)
*   **Company**: Almacena datos comerciales y fiscales (SAT). Permite agrupar perfiles profesionales.
*   **Branch**: Representa las ubicaciones físicas de una empresa. Cada sucursal puede tener sus propios horarios y servicios.

### 🛠️ Catálogo de Servicios (`Category`, `Service`, `ServiceUnit`)
*   **Category**: Jerarquía de categorías (Ej: "Mantenimiento" -> "Plomería").
*   **Service**: El corazón del marketplace. Incluye título, precio base, galería de imágenes y atributos dinámicos.
*   **ServiceUnit**: Define la métrica del servicio (Ej: "Hora", "Metro Cuadrado", "Visita").

### 📅 Reservas y Pagos (`Booking`, `BookingDetails`, `Payment`)
*   **Booking**: Registra la cita entre cliente y proveedor. Estados: `PENDING`, `ACTIVE`, `COMPLETED`, `CANCELLED`.
*   **BookingDetails**: Guarda una "foto" (snapshot) del servicio al momento de la compra para evitar discrepancias si el proveedor cambia el precio después.
*   **Payment**: Registro de la transacción (Stripe, Mercado Pago, etc.).

### ⏱️ Gestión de Tiempo (`ServiceSlot`)
*   Los slots permiten definir ventanas de tiempo disponibles.
*   Estados: `AVAILABLE` (disponible), `BOOKED` (reservado), `BLOCKED` (bloqueado por el proveedor).

## 🗺️ Geolocalización (PostGIS)
*   Se utilizan tipos de datos `geography(Point, 4326)` en `Profile`, `Branch` y `Service`.
*   Esto permite realizar consultas SQL de tipo: `ST_DWithin(location, ST_MakePoint(lat, lng), radius)`.

## 📈 Próximas Implementaciones
*   **Modelos de Planes**: `Plan` (nombre, precio, límites) y `Subscription` (vincula un User/Company a un Plan).
*   **Sistema de Chat**: Se planea usar WebSockets para comunicación directa entre cliente y proveedor.
