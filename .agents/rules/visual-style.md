# 🎨 Guía de Estilo Visual: Kuin-Twin 2026

Este documento define la identidad visual unificada de todas las aplicaciones del ecosistema Kuin-Twin (admin-panel, web-store, etc.).

## 🍯 1. Paleta de Colores (Oro Kuin)
La identidad visual se centra en el **Oro Kuin**, un dorado vibrante que evoca lujo y tecnología.

- **Primary (Oro Kuin):** `hsl(43 96% 56%)`
- **Background (Light):** `hsl(210 40% 96.5%)`
- **Background (Dark):** `hsl(240 40% 5%)` (Azul Noche Profundo)
- **Secondary / Muted:** Tonos azulados suaves para contrastar con el oro.

## 🌌 2. Efectos y Texturas
1.  **Galaxy Starfield (Dark Mode):** En modo oscuro, los fondos de contenido principal deben usar un efecto de "campo de estrellas" con gradientes radiales sutiles.
2.  **Glassmorphism:** Uso intensivo de efectos de cristal (`backdrop-blur`) para modales, tarjetas destacadas y sidebars.
    - Clase `.glass`: Fondo semi-transparente con desenfoque.
    - Clase `.glass-card`: Tarjetas con profundidad y sombreado suave.
3.  **Pattern de Puntos:** El `body` general debe tener un patrón de puntos sutil (`radial-gradient` de 1px cada 32px).

## ✍️ 3. Tipografía
- **Headings:** Uso obligatorio de la fuente **Ubuntu** para un look moderno y tecnológico.
- **Body:** Fuente **Inter** o sans-serif estándar del sistema para máxima legibilidad.
- **Clases Utility:** `.font-heading` y `.font-heading-italic` deben aplicarse a títulos y secciones de énfasis.

## ✨ 4. Animaciones y Micro-interacciones
- **Framework:** Uso de `tw-animate-css` para animaciones suaves de entrada y transiciones.
- **Hover Effects:** Las interacciones deben sentirse vivas. Botones y tarjetas deben tener transiciones de color y elevación suaves (300ms).

## 📐 5. Layout y Contenedores
- **Ancho Máximo:** El contenido principal debe estar contenido en un `.container-app` con un `max-w-[80%]`.
- **Radios:** Bordes redondeados generosos (`--radius: 0.75rem`).

## 🛠️ 6. Implementación Técnica (La Única Verdad)
> [!IMPORTANT]
> **PROHIBIDO EL USO DE HOJAS DE ESTILO LOCALES (`.css`) EN LAS APLICACIONES.** Todo estilo global, reset o utilidad debe residir exclusivamente en:
> `libs/ui-components/src/styles/globals.css`

- **Importación:** Todas las aplicaciones deben importar este archivo mediante `@import "ui-components/styles"` (Vite) o la importación directa en el layout raíz (Next.js).
- **Redundancia:** No se permite la creación de `index.css`, `App.css` o `globals.css` dentro de los directorios `apps/`.
- **Sobreescritura:** Se permite extender los estilos en cada app únicamente mediante clases de Tailwind inline, pero los tokens de color y clases base (`.glass`, `.glass-card`, `.font-heading`) son inamovibles.

---
*Cualquier desviación de esta guía debe ser justificada y aprobada. El objetivo es que el usuario se sienta en el mismo ecosistema sin importar en qué aplicación esté.*
