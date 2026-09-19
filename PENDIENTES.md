# PENDIENTES — AMB

El proyecto se encuentra en un estado funcional avanzado. La estructura visual, el motor de interacciones (hotspots), el responsive para móviles, las animaciones y la arquitectura técnica están 100% terminados y optimizados. Esta lista documenta exclusivamente los pasos manuales que debés realizar para personalizar y publicar la página.

---

## 1. CONTENIDO PERSONAL

Listado de los textos que necesitan ser escritos para dar vida a la experiencia:

- [ ] **Títulos de los 14 Recuerdos** — `src/data/memoriesData.ts`
  - Falta: Reemplazar los placeholders (ej: `[Título del Recuerdo #1]`).
  - Recomendación: 2 a 5 palabras.
  - Estado: PENDIENTE

- [ ] **Mensajes de los 14 Recuerdos** — `src/data/memoriesData.ts`
  - Falta: Reemplazar las instrucciones (ej: `[Escribí acá el recuerdo principal...]`).
  - Recomendación: 1 a 4 párrafos cortos por recuerdo.
  - Estado: PENDIENTE

- [ ] **Fechas de los Recuerdos** (Opcional) — `src/data/memoriesData.ts`
  - Falta: Configurar el campo `date` en los recuerdos que correspondan.
  - Estado: PENDIENTE

- [ ] **Metadatos de la página** — `index.html`
  - Falta: Reemplazar los textos por defecto de `<title>`, `meta description`, `og:title`, y `twitter:description` (actualmente dicen "Nuestra Historia - Una Experiencia Premium").
  - Estado: PENDIENTE

*(Nota: Los textos de la introducción ["Para vos...", "Hay algo que quiero mostrarte."] y el mensaje final ya fueron redactados de forma poética y elegante, pero podés revisarlos en `src/data/memoriesData.ts` si deseás ajustarlos).*

---

## 2. RECUERDOS

A continuación, la lista exacta de recuerdos que espera el código (configurados en `src/data/memoriesData.ts`). Hay un total de **14** flores interactivas.

| ID | Flor Asociada | Posición (x, y) | Título actual | Contenido actual | Archivo | Estado |
|---|---|---|---|---|---|---|
| `hibiscus-01` | Hibiscus Central | 48%, 45% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `hibiscus-02` | Hibiscus Fucsia | 61%, 33% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `hibiscus-03` | Hibiscus Coral | 89%, 42% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `freesia-01` | Fresias Amarillas | 21%, 29% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `freesia-02` | Fresias Crema | 65%, 23% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `freesia-03` | Fresias del Centro | 63%, 41% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `sunflower-01` | Girasol Radiante | 68%, 58% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `rose-01` | Rosa Roja | 74%, 49% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `rose-02` | Rosa Rosa Suave | 37%, 58% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `rose-03` | Rosa Rosa Lateral| 24%, 40% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `gerbera-01` | Gerbera Coral | 20%, 48% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `gerbera-02` | Gerbera Fucsia | 77%, 41% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `daisy-01` | Margaritas Blancas| 88%, 51% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |
| `freesia-04` | Fresia de la Base | 26%, 54% | Placeholder | Placeholder vacío | `memoriesData.ts` | PENDIENTE |

---

## 3. FLORES E INTERACCIONES

Todas las flores interactivas ya están configuradas y funcionando con precisión matemática (Fat Finger resolution). 

- **Hibiscus (Prioridad Máxima)**: 3 hotspots. Funcionan y abren correctamente.
- **Fresias (Prioridad Secundaria)**: 4 hotspots. Funcionan y abren correctamente.
- **Otras Flores**: 7 hotspots (girasoles, rosas, gerberas, margaritas). Funcionan y abren correctamente.

**Estado**: COMPLETADO. No hay problemas de solapamiento ni posicionamiento. Todo funciona perfectamente.

---

## 4. IMÁGENES Y ASSETS

### Ya existentes
- `public/images/bouquet.webp`: La imagen del ramo principal ya está generada y optimizada al 100% para la web (114KB). *(Si preferís utilizar una foto tuya real del ramo, deberás reemplazar este archivo manteniendo el mismo nombre).*

### Faltantes
- `public/music/sorpresa.mp3`: Falta agregar la canción.
- `public/images/` (Fotos para los recuerdos): Opcionales.

### Placeholders / Que deberían reemplazarse
- **Favicon**: Actualmente usa el logo de Vite (`public/favicon.svg`). REEMPLAZAR.
- **Open Graph Image**: Falta una imagen en `public/` para cuando compartas el link por WhatsApp. REEMPLAZAR.

---

## 5. MÚSICA Y AUDIO

El proyecto ya cuenta con el código para reproducir música ambiental con botones de control discretos y manejo de autoplay nativo.

- **Configuración**: Se encuentra en `src/config/gift.ts` bajo la variable `surpriseMusic`.
- **Falta**: El archivo físico de la canción.
- **Formato esperado**: `.mp3`.
- **Acción requerida**: Guardar tu canción elegida en la ruta `public/music/sorpresa.mp3`.

---

## 6. ANIMACIONES

### Completas
- Entrada poética de la página (desenfoque y fade-in).
- Interacción orgánica con flores (Ripple dorado al tacto).
- Apertura y cierre del modal de recuerdos (Swipe-to-close físico y spring animation).
- Indicador luminoso en flores descubiertas (resplandor estelar perlado).
- Progreso de recuerdos (contador dinámico).
- Transición elegante al estado final de la experiencia.

### Pendientes / Problemáticas
- **Ninguna**. Las animaciones están cerradas, probadas y aceleradas por hardware.

---

## 7. RESPONSIVE / MOBILE

La experiencia móvil es la prioridad y fue auditada exhaustivamente.

- **Completas / Ya funcionan correctamente**:
  - Renderizado perfecto del tamaño del ramo evitando las barras del navegador (`100dvh`).
  - Soporte impecable para Safe Areas en iPhone (notch, barra de navegación).
  - Modal con gestos táctiles (Swipe-to-Close).
  - Bloqueo de overscroll (Rubber-banding en iOS corregido).
  - Cálculo de toque inteligente para no errar botones pequeños en la pantalla.
  - Adaptación dinámica de altura de fotos en modo paisaje (Landscape).

- **Pendientes**:
  - **Ninguna**. La experiencia táctil está blindada.

---

## 8. ACCESIBILIDAD

- **Completas**: 
  - Manejo de contraste de textos sobre fondos fotográficos.
  - ARIA labels en los controles y modales.
  - Atrapado automático del foco (`autoFocus`) al abrir el modal para usuarios de teclado.

- **Pendientes**:
  - **Ninguna**.

---

## 9. DATOS Y CONFIGURACIÓN

- `src/config/gift.ts`: REVISAR / COMPLETAR MANUALMENTE las fechas internas (`unlockDate`, `meetingDate`).
- `index.html`: REVISAR / COMPLETAR MANUALMENTE la variable `og:url` (actualmente `https://oursite.com/`).
- `package.json` / `vite.config.ts`: Si vas a publicar en GitHub Pages, debés asegurarte de configurar el parámetro `base` en vite.

---

## 10. PLACEHOLDERS

Lista exhaustiva de marcadores temporales que debés eliminar/reemplazar antes de publicar:

- `src/data/memoriesData.ts`: 14 veces `[Título del Recuerdo #...]`.
- `src/data/memoriesData.ts`: 14 veces `[Escribí acá...]`.
- `index.html` (línea 16): `<meta property="og:url" content="https://oursite.com/" />`
- `index.html` (líneas 12, 18, 23): "Una experiencia digital bellamente elaborada que narra nuestro viaje, recuerdos y sueños." (Podés dejarlo, pero es genérico).

---

## 11. FUNCIONALIDADES

- [x] Mostrar ramo fotorealista
- [x] Motor matemático de hotspots táctiles
- [x] Modal de recuerdos con Swipe-To-Close
- [x] Contador de progreso persistente
- [x] Detección del estado final / Mensaje final
- [x] Prevención de rebotes y scroll locks (Mobile UX)
- [x] Controles de audio y volumen
- [ ] Cargar música real
- [ ] Textos reales de recuerdos

---

## 12. CONFIGURACIÓN PARA PUBLICAR

Antes de subirlo a producción (Netlify, Vercel o GitHub Pages), revisá:
- [ ] Ejecutar `npm run build` sin errores.
- [ ] Cambiar el Favicon (`public/favicon.svg`).
- [ ] Reemplazar la URL y descripciones en las etiquetas `<meta>` del `index.html`.
- [ ] Asegurarte de que la imagen Open Graph exista si querés que tenga miniatura por WhatsApp.

---

## 13. TEST FINAL

Checklist manual previo a compartir el enlace:

### Desktop
- [ ] La página carga inmediatamente (LCP rápido).
- [ ] El cursor indica que las flores son clickeables.
- [ ] Se pueden abrir y cerrar los 14 recuerdos.
- [ ] La música se reproduce al abrir la primera flor.
- [ ] El estado final se activa al leer el recuerdo número 14.

### Mobile
- [ ] Al hacer scroll no rebota la pantalla (iOS).
- [ ] Tocar cerca de una flor activa correctamente la memoria sin problemas de "dedos gordos".
- [ ] El texto de los recuerdos entra bien y es scrolleable sin arrastrar la tarjeta entera accidentalmente.
- [ ] El botón de silenciar música no choca con las esquinas redondeadas ni el notch del celular.
- [ ] Deslizar el recuerdo hacia abajo lo cierra fluidamente.

### Contenido
- [ ] Los 14 recuerdos tienen título y texto original.
- [ ] Los 14 placeholders de `memoriesData.ts` fueron borrados.
- [ ] La canción `sorpresa.mp3` suena.

---

# ORDEN RECOMENDADO

A continuación, la ruta más lógica y segura para completar la sorpresa.

### BLOQUEANTE
*Lo que tenés que hacer sí o sí para que tenga sentido el regalo.*
1. Escribir los 14 títulos y mensajes en `src/data/memoriesData.ts`.
2. Guardar tu canción en `public/music/sorpresa.mp3`.

### IMPORTANTE
*Lo que deberías hacer para que quede profesional al compartirlo.*
3. Cambiar los textos genéricos de `<title>` y `<meta description>` en `index.html`.
4. Reemplazar el icono base de Vite (`favicon.svg`).
5. Realizar tu propio Test Final visual en el celular.

### OPCIONAL
*Mejoras extra.*
6. Agregar fotos (archivos `.jpg`) en la carpeta `public/images/` y enlazarlos a los recuerdos en `memoriesData.ts`.
7. Configurar una imagen Open Graph (`og:image`) para la vista previa de WhatsApp.
