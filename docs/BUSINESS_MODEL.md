# 💼 Modelo de Negocio: Mercado de Servicios

Kuin Twin funciona como un ecosistema donde convergen clientes que buscan soluciones y proveedores que ofrecen su talento o infraestructura.

## 👥 Roles de Usuario

1.  **CUSTOMER (Cliente)**: Usuarios que buscan, comparan y reservan servicios. Pueden dejar reseñas y gestionar sus citas desde un panel personal.
2.  **VENDOR (Proveedor)**: Usuarios que ofrecen servicios. Pueden ser de dos tipos:
    *   **Independientes**: Profesionales que operan bajo su propio nombre (ej: un electricista, un diseñador freelance). Gestionan su propio perfil y servicios.
    *   **Empresas (Companies)**: Entidades legales que pueden tener múltiples sucursales (`Branch`) y varios perfiles de profesionales asociados. Estas empresas pueden estar validadas mediante datos del SAT para generar confianza.

## 💎 Sistema de Planes de Publicación

Para publicar servicios en la plataforma, los proveedores deben estar suscritos a un **Plan**. Esto asegura la calidad de los anuncios y genera ingresos para la plataforma.

### 📋 Estructura Propuesta de Planes

*   **Plan Básico (Gratis/Económico)**:
    *   Permite publicar hasta 3 servicios.
    *   Visibilidad estándar en los resultados de búsqueda.
    *   Gestión de reservas básica.
*   **Plan Profesional (Pago Mensual)**:
    *   Servicios ilimitados.
    *   Visibilidad prioritaria ("Destacados").
    *   Estadísticas avanzadas de visualizaciones y clics.
    *   Insignia de "Verificado" (tras validación de identidad).
*   **Plan Corporativo (Empresas)**:
    *   Gestión de múltiples sucursales.
    *   Asignación de perfiles a sucursales específicas.
    *   Herramientas de marketing exclusivas.
    *   Soporte prioritario.

## 🏢 Verificación de Empresas (SAT México)

Para garantizar la seguridad y confianza en el marketplace, Kuin Twin implementa un proceso riguroso de verificación para personas morales y físicas con actividad empresarial a través del **SAT (Servicio de Administración Tributaria)**.

### 📋 Requisitos de Verificación
1.  **RFC (Registro Federal de Contribuyentes)**: Validación de estructura y estatus activo.
2.  **Razón Social**: Debe coincidir exactamente con la cédula de identificación fiscal.
3.  **Régimen Fiscal**: Identificación del régimen para propósitos de facturación y cumplimiento.
4.  **Constancia de Situación Fiscal (CSF)**: Documento oficial (PDF) que el administrador debe validar.
5.  **Comprobante de Domicilio Fiscal**: Para verificar la existencia física de la sucursal matriz.

### 🔄 Proceso de Validación
1.  **Registro**: La empresa completa su perfil y carga los documentos solicitados.
2.  **Estado "En Revisión"**: El perfil de la empresa aparece con un aviso de "Verificación en proceso". Sus servicios pueden publicarse pero no aparecen como "Destacados".
3.  **Auditoría Admin**: Un administrador desde el `admin-panel` revisa la autenticidad de los documentos y cruza datos con el portal del SAT.
4.  **Aprobación/Rechazo**:
    *   **Aprobado**: Se otorga el sello de **"Empresa Verificada"**, se habilitan planes corporativos y prioridad en búsquedas.
    *   **Rechazado**: Se notifica el motivo (ej: RFC inválido, CSF vencida) y se permite la corrección.

### 🛡️ Beneficios de la Verificación
*   **Confianza del Cliente**: Los servicios verificados tienen una tasa de reserva 40% mayor.
*   **Facturación**: Habilita la capacidad de emitir facturas legales a través de la plataforma.
*   **Acceso a Sucursales**: Solo empresas verificadas pueden gestionar múltiples sucursales (`Branches`).

## 📅 Ciclo de Vida del Servicio

1.  **Creación**: El proveedor elige una categoría y detalla el servicio (título, fotos, etiquetas, precio base).
2.  **Disponibilidad**: Se configuran los **Slots** (horarios disponibles) para que los clientes puedan reservar.
3.  **Reserva (Booking)**: El cliente selecciona un horario y realiza el pago/reserva. El proveedor recibe una notificación.
4.  **Ejecución y Reseña**: Una vez completado el servicio, el cliente califica la experiencia (estrellas y comentario), alimentando la reputación del proveedor.
