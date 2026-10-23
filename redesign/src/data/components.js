import { REACTBITS_ITEMS } from './componentsRef.js'

// Catálogo de componentes. Aquí conviven tres cosas que NO se licencian igual, y
// las distingue el campo `origin`:
//
//   - `canvasui` y `arlan` son de TERCEROS. Se usa el código original de su autor,
//     copiado sin reescribir (src/components/canvasui/ y src/components/arlan/), y
//     de ellos se sirve metadata más el comando de instalación del origen, nunca
//     el código. El único cambio propio ahí es el respaldo para navegadores sin
//     html-in-canvas (ver canvasui/htmlFallback.ts).
//   - `propio` es código de la casa, en src/components/propios/, MIT como el resto
//     del repositorio. De estos SÍ se enseña y se sirve el código entero.
//   - `reactbits` también es de un tercero, pero a diferencia de los dos primeros
//     NO se copia aquí ni una línea: su licencia (MIT con Commons Clause) prohíbe
//     redistribuir los componentes. Son fichas de análisis nuestras, sin demo, que
//     enlazan a su origen y dan su comando de instalación. Viven en componentsRef.js.
//
// Y conviven también tres clases de cosa, que las separa `clase`: PIEZAS que se
// copian y funcionan solas, RECETAS que enseñan una técnica (hoy, la matrioska) y
// REFERENCIAS, que son análisis de una pieza ajena sin demo ni código. Lo de la
// receta es una decisión de Munir del 2026-08-29 tomada a sabiendas, y por eso la
// web lo dice en la propia sección en vez de dejar que el visitante lo deduzca.

export const COMPONENT_GROUPS = [
  { key: 'canvas', label: { es: 'Canvas y WebGL', en: 'Canvas & WebGL' } },
  { key: 'cursor', label: { es: 'Puntero', en: 'Pointer' } },
  { key: 'scroll', label: { es: 'Scroll', en: 'Scroll' } },
  { key: 'texto', label: { es: 'Texto', en: 'Type' } },
  { key: 'ui', label: { es: 'Interfaz', en: 'Interface' } },
  { key: 'micro', label: { es: 'Micro-interacciones', en: 'Micro-interactions' } },
]

const ITEMS_EN_VIVO = [
  {
    key: 'bubble',
    wraps: true,
    group: 'cursor',
    origin: 'canvasui',
    name: 'Bubble',
    url: 'https://canvasui.dev/docs/components/bubble',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/bubble-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'gota de cristal que sigue al cursor', en: 'glass droplet trailing the cursor' },
    desc: {
      es: 'Una gota de cristal cabalga sobre tu cursor y deja un rastro de metabolas que se funden entre sí y refractan la página que hay debajo. Muévete rápido para estirarla; párate y vuelve a juntarse.',
      en: 'A glassy droplet rides your cursor, trailing into a string of blending metaballs that refract the live page beneath them. Move fast to stretch it, stop to let it pool back together.',
    },
    defaults: {
      size: 30, trail: 24, follow: 0.5, blend: 14, refraction: 80,
      dispersion: 1, frost: 0, shine: 0.25, rim: 0.5, iridescence: 1, intensity: 0.9,
    },
    controls: [
      { key: 'size', type: 'range', min: 8, max: 120, step: 1, label: { es: 'Tamaño', en: 'Size' } },
      { key: 'trail', type: 'range', min: 1, max: 24, step: 1, label: { es: 'Rastro', en: 'Trail' } },
      { key: 'follow', type: 'range', min: 0.05, max: 1, step: 0.05, label: { es: 'Seguimiento', en: 'Follow' } },
      { key: 'blend', type: 'range', min: 0, max: 40, step: 1, label: { es: 'Fusión', en: 'Blend' } },
      { key: 'refraction', type: 'range', min: 0, max: 200, step: 5, label: { es: 'Refracción', en: 'Refraction' } },
      { key: 'dispersion', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Dispersión', en: 'Dispersion' } },
      { key: 'frost', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Escarcha', en: 'Frost' } },
      { key: 'iridescence', type: 'range', min: 0, max: 2, step: 0.1, label: { es: 'Iridiscencia', en: 'Iridescence' } },
      { key: 'shine', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Brillo', en: 'Shine' } },
      { key: 'rim', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Borde', en: 'Rim' } },
    ],
  },
  {
    key: 'cloth',
    wraps: true,
    group: 'canvas',
    origin: 'canvasui',
    name: 'Cloth',
    url: 'https://canvasui.dev/docs/components/cloth',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/cloth-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'tu HTML colgado de una tela al viento', en: 'your HTML hanging on fabric in the wind' },
    desc: {
      es: 'Cuelga tu HTML de verdad sobre una tela que ondea al viento, con pliegues iluminados con suavidad. Pasa el cursor por encima para lanzar olas por el tejido. Todo el contenido sigue siendo interactivo.',
      en: 'Hangs your live HTML on a piece of fabric rippling in the wind, with softly lit folds. Brush it with your cursor to send waves across the cloth. Everything stays interactive.',
    },
    defaults: {
      pin: 'top', wind: 3, speed: 0.5, amplitude: 30, drape: 40,
      brush: 2.05, brushSize: 150, light: 0.5, sheen: 0.1, shadow: 0.25, cornerRadius: 20,
    },
    controls: [
      {
        key: 'pin', type: 'select', label: { es: 'Sujeta por', en: 'Pinned edge' },
        options: [
          { value: 'top', label: { es: 'Arriba', en: 'Top' } },
          { value: 'bottom', label: { es: 'Abajo', en: 'Bottom' } },
          { value: 'left', label: { es: 'Izquierda', en: 'Left' } },
          { value: 'right', label: { es: 'Derecha', en: 'Right' } },
        ],
      },
      { key: 'wind', type: 'range', min: 0, max: 10, step: 0.1, label: { es: 'Viento', en: 'Wind' } },
      { key: 'speed', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Velocidad', en: 'Speed' } },
      { key: 'amplitude', type: 'range', min: 0, max: 80, step: 1, label: { es: 'Pliegue', en: 'Amplitude' } },
      { key: 'drape', type: 'range', min: 0, max: 120, step: 1, label: { es: 'Vuelo', en: 'Drape' } },
      { key: 'brush', type: 'range', min: 0, max: 6, step: 0.05, label: { es: 'Roce del cursor', en: 'Brush' } },
      { key: 'brushSize', type: 'range', min: 20, max: 400, step: 10, label: { es: 'Radio del roce', en: 'Brush size' } },
      { key: 'light', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Luz', en: 'Light' } },
      { key: 'sheen', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Lustre', en: 'Sheen' } },
      { key: 'shadow', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Sombra', en: 'Shadow' } },
      { key: 'cornerRadius', type: 'range', min: 0, max: 60, step: 1, label: { es: 'Esquinas', en: 'Corner radius' } },
    ],
  },
  {
    key: 'dithered',
    group: 'canvas',
    origin: 'canvasui',
    name: 'Dithered Object',
    url: 'https://canvasui.dev/docs/components/dithered-object',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/dithered-object-react',
    deps: ['three'],
    labels: ['WebGL', 'three.js', '3D'],
    tag: { es: 'objeto 3D tramado a un bit', en: '1-bit dithered 3D object' },
    desc: {
      es: 'Apúntale a cualquier modelo GLB o glTF, SVG o imagen y flota en un estudio con luz, renderizado con trama de Bayer, semitono o Floyd-Steinberg. Aquí lo estrenamos con el logo de Vibeset. Arrastra para orbitarlo.',
      en: 'Point it at any GLB or glTF model, SVG, or image and it floats in a lit studio, rendered through a Bayer, halftone, or Floyd-Steinberg dither. Here it runs on the Vibeset logo. Drag to orbit it.',
    },
    defaults: {
      src: '/brand/logo-blanco.svg', method: 'bayer', gridSize: 4, pixelSizeRatio: 1,
      grayscale: true, invert: false, dither: true, highlight: '#4f46e5',
      environmentIntensity: 0.35, scale: 3, floatIntensity: 2, rotationIntensity: 1,
      floatSpeed: 2, orbit: true, autoRotate: false, autoRotateSpeed: 2, fov: 65,
    },
    controls: [
      {
        key: 'src', type: 'select', label: { es: 'Objeto', en: 'Object' },
        options: [
          { value: '/brand/logo-blanco.svg', label: { es: 'Logo de Vibeset', en: 'Vibeset logo' } },
          { value: '/brand/icon-512.png', label: { es: 'Icono 512', en: 'Icon 512' } },
          { value: '/brand/og.png', label: { es: 'Imagen social', en: 'Social image' } },
        ],
      },
      {
        key: 'method', type: 'select', label: { es: 'Trama', en: 'Dither' },
        options: [
          { value: 'bayer', label: { es: 'Bayer', en: 'Bayer' } },
          { value: 'halftone', label: { es: 'Semitono', en: 'Halftone' } },
          { value: 'floyd', label: { es: 'Floyd-Steinberg', en: 'Floyd-Steinberg' } },
        ],
      },
      { key: 'gridSize', type: 'range', min: 1, max: 16, step: 1, label: { es: 'Rejilla', en: 'Grid size' } },
      { key: 'pixelSizeRatio', type: 'range', min: 1, max: 10, step: 1, label: { es: 'Pixelado', en: 'Pixelation' } },
      { key: 'scale', type: 'range', min: 0.5, max: 6, step: 0.1, label: { es: 'Tamaño', en: 'Scale' } },
      { key: 'environmentIntensity', type: 'range', min: 0, max: 2, step: 0.05, label: { es: 'Luz del estudio', en: 'Studio light' } },
      { key: 'floatIntensity', type: 'range', min: 0, max: 5, step: 0.1, label: { es: 'Flotación', en: 'Float' } },
      { key: 'rotationIntensity', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Balanceo', en: 'Rocking' } },
      { key: 'fov', type: 'range', min: 20, max: 100, step: 1, label: { es: 'Campo de visión', en: 'Field of view' } },
      { key: 'highlight', type: 'color', label: { es: 'Luz de acento', en: 'Accent light' } },
      { key: 'grayscale', type: 'bool', label: { es: 'Escala de grises', en: 'Grayscale' } },
      { key: 'invert', type: 'bool', label: { es: 'Invertir', en: 'Invert' } },
      { key: 'dither', type: 'bool', label: { es: 'Aplicar trama', en: 'Dither pass' } },
      { key: 'autoRotate', type: 'bool', label: { es: 'Giro automático', en: 'Auto rotate' } },
    ],
  },
  {
    key: 'asciify',
    wraps: true,
    group: 'cursor',
    origin: 'canvasui',
    name: 'Asciify',
    url: 'https://canvasui.dev/docs/components/asciify',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/asciify-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'lente que reescribe la web en ASCII', en: 'lens that redraws the page as ASCII' },
    desc: {
      es: 'Una lente suave sigue a tu cursor y redibuja lo que hay debajo con caracteres ASCII de verdad, eligiendo cada glifo por la densidad del píxel. Puedes cambiar el juego de caracteres y ensanchar la lente hasta cubrir toda la pantalla.',
      en: 'A soft lens follows your cursor, redrawing the page beneath it as real ASCII characters, picking each glyph by pixel density. You can swap the character ramp and widen the lens until it covers the whole screen.',
    },
    defaults: {
      radius: 0.4, softness: 1, scale: 2, spacing: 1, charset: 'ascii',
      contrast: 1, brightness: 0, invert: 0, strength: 1, baseStrength: 0,
      followSpeed: 3, glow: 0.75, aberration: 0.75,
    },
    controls: [
      {
        key: 'charset', type: 'select', label: { es: 'Caracteres', en: 'Charset' },
        options: [
          { value: 'ascii', label: { es: 'ASCII', en: 'ASCII' } },
          { value: 'blocks', label: { es: 'Bloques', en: 'Blocks' } },
          { value: 'binary', label: { es: 'Binario', en: 'Binary' } },
        ],
      },
      { key: 'radius', type: 'range', min: 0.05, max: 1.5, step: 0.05, label: { es: 'Radio de la lente', en: 'Lens radius' } },
      { key: 'softness', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Difuminado del borde', en: 'Edge softness' } },
      { key: 'scale', type: 'range', min: 1, max: 6, step: 0.5, label: { es: 'Tamaño del glifo', en: 'Glyph size' } },
      { key: 'spacing', type: 'range', min: 0, max: 3, step: 1, label: { es: 'Separación', en: 'Spacing' } },
      { key: 'contrast', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Contraste', en: 'Contrast' } },
      { key: 'brightness', type: 'range', min: -1, max: 1, step: 0.05, label: { es: 'Brillo', en: 'Brightness' } },
      { key: 'invert', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Invertir', en: 'Invert' } },
      { key: 'strength', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Cobertura', en: 'Coverage' } },
      { key: 'baseStrength', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Fuera de la lente', en: 'Outside the lens' } },
      { key: 'followSpeed', type: 'range', min: 0.5, max: 12, step: 0.5, label: { es: 'Seguimiento', en: 'Follow speed' } },
      { key: 'glow', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Fósforo', en: 'Glow' } },
      { key: 'aberration', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Aberración', en: 'Aberration' } },
    ],
  },
  {
    key: 'peel',
    wraps: true,
    group: 'cursor',
    origin: 'canvasui',
    name: 'Peel',
    url: 'https://canvasui.dev/docs/components/peel',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/peel-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'la web se despega como una pegatina', en: 'the page peels back like a sticker' },
    desc: {
      es: 'Acerca el cursor al borde y la página se despega como una pegatina, curvándose con su sombra y su brillo, y dejando ver la capa que hay debajo. Aquí, debajo de la portada, está el catálogo.',
      en: 'Move the cursor toward the edge and the live page peels back like a sticker, curling with its own shading and shine, revealing the layer underneath. Here the catalog sits under the cover.',
    },
    defaults: {
      side: 'left', mode: 'cursor', reveal: 220, zone: 200, curl: 260,
      bow: 75, shade: 0.25, shine: 1, bulge: 50, perspective: 2000, smoothing: 0.3,
    },
    controls: [
      {
        key: 'side', type: 'select', label: { es: 'Se despega por', en: 'Peels from' },
        options: [
          { value: 'left', label: { es: 'Izquierda', en: 'Left' } },
          { value: 'right', label: { es: 'Derecha', en: 'Right' } },
          { value: 'top', label: { es: 'Arriba', en: 'Top' } },
          { value: 'bottom', label: { es: 'Abajo', en: 'Bottom' } },
        ],
      },
      {
        key: 'mode', type: 'select', label: { es: 'Se activa', en: 'Driven by' },
        options: [
          { value: 'cursor', label: { es: 'Siguiendo al cursor', en: 'Following the cursor' } },
          { value: 'hover', label: { es: 'De golpe al entrar', en: 'All at once on hover' } },
        ],
      },
      { key: 'reveal', type: 'range', min: 40, max: 500, step: 10, label: { es: 'Cuánto se levanta', en: 'Reveal' } },
      { key: 'zone', type: 'range', min: 40, max: 500, step: 10, label: { es: 'Zona sensible', en: 'Zone' } },
      { key: 'curl', type: 'range', min: 40, max: 600, step: 10, label: { es: 'Curvatura', en: 'Curl' } },
      { key: 'bow', type: 'range', min: -150, max: 250, step: 5, label: { es: 'Comba', en: 'Bow' } },
      { key: 'bulge', type: 'range', min: 0, max: 200, step: 5, label: { es: 'Bulto hacia el cursor', en: 'Bulge' } },
      { key: 'shade', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Sombra del pliegue', en: 'Shade' } },
      { key: 'shine', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Brillo del borde', en: 'Shine' } },
      { key: 'perspective', type: 'range', min: 400, max: 4000, step: 100, label: { es: 'Perspectiva', en: 'Perspective' } },
      { key: 'smoothing', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Suavizado', en: 'Smoothing' } },
    ],
  },
  {
    key: 'bend',
    wraps: true,
    group: 'scroll',
    origin: 'canvasui',
    name: 'Bend',
    url: 'https://canvasui.dev/docs/components/bend',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/bend-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'la web scrollea sobre la cara de un cubo', en: 'the page scrolls on the face of a cube' },
    desc: {
      es: 'Tu página scrollea sobre la cara de un cubo: los bordes de arriba y abajo se doblan sobre aristas invisibles y vuelven a aplanarse al llegar a los extremos. Haz scroll dentro de la demo para verlo.',
      en: 'Your page scrolls on the face of a cube. The top and bottom fold over virtual edges and flatten back out at the scroll ends. Scroll inside the demo to see it.',
    },
    defaults: {
      zone: 110, angle: 80, rounding: 90, perspective: 700, direction: 'in',
      ease: 240, smoothing: 0.1, top: true, bottom: true, tumble: 0.5, tilt: 0.5,
    },
    controls: [
      {
        key: 'direction', type: 'select', label: { es: 'Dobla hacia', en: 'Folds' },
        options: [
          { value: 'in', label: { es: 'Dentro', en: 'Inward' } },
          { value: 'out', label: { es: 'Fuera', en: 'Outward' } },
        ],
      },
      { key: 'zone', type: 'range', min: 40, max: 260, step: 10, label: { es: 'Alto del doblez', en: 'Fold zone' } },
      { key: 'angle', type: 'range', min: 0, max: 90, step: 1, label: { es: 'Ángulo', en: 'Angle' } },
      { key: 'rounding', type: 'range', min: 0, max: 260, step: 10, label: { es: 'Redondeo de la arista', en: 'Crease rounding' } },
      { key: 'perspective', type: 'range', min: 200, max: 2000, step: 50, label: { es: 'Perspectiva', en: 'Perspective' } },
      { key: 'ease', type: 'range', min: 40, max: 600, step: 20, label: { es: 'Aplanado al final', en: 'Flatten distance' } },
      { key: 'smoothing', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Suavizado', en: 'Smoothing' } },
      { key: 'tumble', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Vuelco al rebotar', en: 'Overscroll tumble' } },
      { key: 'tilt', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Inclinación al cursor', en: 'Pointer tilt' } },
      { key: 'top', type: 'bool', label: { es: 'Doblar arriba', en: 'Bend top' } },
      { key: 'bottom', type: 'bool', label: { es: 'Doblar abajo', en: 'Bend bottom' } },
    ],
  },
  {
    key: 'asciiObject',
    group: 'canvas',
    origin: 'canvasui',
    name: 'ASCII Object',
    component: 'AsciiObject',
    url: 'https://canvasui.dev/docs/components/ascii-object',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/ascii-object-react',
    deps: ['three'],
    labels: ['WebGL', 'three.js', '3D'],
    tag: { es: 'objeto 3D dibujado con letras', en: '3D object drawn with letters' },
    desc: {
      es: 'El mismo estudio 3D que el Dithered Object, pero redibujado en ASCII: cada glifo se elige por su forma, así que las letras trazan los bordes del objeto en vez de limitarse al brillo. También va con el logo de Vibeset.',
      en: 'The same 3D studio as Dithered Object, but redrawn in ASCII: each glyph is matched by shape, so the characters trace the object edges instead of just its brightness. It runs on the Vibeset logo too.',
    },
    defaults: {
      src: '/brand/logo-blanco.svg', ascii: true, cellSize: 8, cellAspect: 0.6,
      colored: true, color: '#ffffff', contrast: 1.5, edgeContrast: 3, exposure: 1,
      invert: false, highlight: '#4f46e5', environmentIntensity: 1, scale: 3,
      floatIntensity: 2, rotationIntensity: 1, floatSpeed: 2, orbit: true,
      autoRotate: false, fov: 65,
    },
    controls: [
      {
        key: 'src', type: 'select', label: { es: 'Objeto', en: 'Object' },
        options: [
          { value: '/brand/logo-blanco.svg', label: { es: 'Logo de Vibeset', en: 'Vibeset logo' } },
          { value: '/brand/icon-512.png', label: { es: 'Icono 512', en: 'Icon 512' } },
          { value: '/brand/og.png', label: { es: 'Imagen social', en: 'Social image' } },
        ],
      },
      { key: 'cellSize', type: 'range', min: 4, max: 24, step: 1, label: { es: 'Tamaño de letra', en: 'Cell size' } },
      { key: 'cellAspect', type: 'range', min: 0.3, max: 1.2, step: 0.05, label: { es: 'Proporción', en: 'Cell aspect' } },
      { key: 'contrast', type: 'range', min: 0, max: 4, step: 0.1, label: { es: 'Contraste', en: 'Contrast' } },
      { key: 'edgeContrast', type: 'range', min: 0, max: 8, step: 0.2, label: { es: 'Realce de bordes', en: 'Edge contrast' } },
      { key: 'exposure', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Exposición', en: 'Exposure' } },
      { key: 'scale', type: 'range', min: 0.5, max: 6, step: 0.1, label: { es: 'Tamaño', en: 'Scale' } },
      { key: 'environmentIntensity', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Luz del estudio', en: 'Studio light' } },
      { key: 'floatIntensity', type: 'range', min: 0, max: 5, step: 0.1, label: { es: 'Flotación', en: 'Float' } },
      { key: 'fov', type: 'range', min: 20, max: 100, step: 1, label: { es: 'Campo de visión', en: 'Field of view' } },
      { key: 'color', type: 'color', label: { es: 'Color del texto', en: 'Text color' } },
      { key: 'highlight', type: 'color', label: { es: 'Luz de acento', en: 'Accent light' } },
      { key: 'ascii', type: 'bool', label: { es: 'Modo ASCII', en: 'ASCII mode' } },
      { key: 'colored', type: 'bool', label: { es: 'Letras a color', en: 'Colored glyphs' } },
      { key: 'invert', type: 'bool', label: { es: 'Invertir', en: 'Invert' } },
      { key: 'autoRotate', type: 'bool', label: { es: 'Giro automático', en: 'Auto rotate' } },
    ],
  },
  {
    key: 'laser',
    wraps: true,
    group: 'scroll',
    origin: 'canvasui',
    name: 'Laser',
    url: 'https://canvasui.dev/docs/components/laser',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/laser-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'el contenido se imprime tras un rayo', en: 'content prints in from behind a beam' },
    desc: {
      es: 'Un rayo láser se queda cerca del borde inferior y tapa todo lo que hay debajo. Al hacer scroll, el contenido nuevo se imprime saliendo de detrás del rayo, todavía caliente y temblando. Haz scroll dentro de la demo.',
      en: 'A laser beam sits near the bottom edge and hides everything below it. As you scroll, new content prints in from behind the beam, still hot and shimmering. Scroll inside the demo.',
    },
    defaults: {
      speed: 0.3, offset: 120, thickness: 6, core: 1, radius: 20, glow: 2,
      wave: 10, width: 0.55, flicker: 0.2, reveal: 260, heat: 1.5,
      shimmer: 12, sparkle: 0.25, reactivity: 1,
    },
    controls: [
      { key: 'offset', type: 'range', min: 20, max: 320, step: 5, label: { es: 'Altura del rayo', en: 'Beam offset' } },
      { key: 'thickness', type: 'range', min: 1, max: 24, step: 1, label: { es: 'Grosor', en: 'Thickness' } },
      { key: 'core', type: 'range', min: 0, max: 2, step: 0.05, label: { es: 'Núcleo blanco', en: 'White core' } },
      { key: 'glow', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Resplandor', en: 'Glow' } },
      { key: 'radius', type: 'range', min: 0, max: 80, step: 2, label: { es: 'Alcance del halo', en: 'Glow reach' } },
      { key: 'wave', type: 'range', min: 0, max: 40, step: 1, label: { es: 'Ondulación', en: 'Waviness' } },
      { key: 'width', type: 'range', min: 0.1, max: 1, step: 0.05, label: { es: 'Largo del rayo', en: 'Beam length' } },
      { key: 'flicker', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Parpadeo', en: 'Flicker' } },
      { key: 'reveal', type: 'range', min: 60, max: 500, step: 10, label: { es: 'Banda caliente', en: 'Reveal band' } },
      { key: 'heat', type: 'range', min: 0, max: 1.5, step: 0.05, label: { es: 'Calor', en: 'Heat' } },
      { key: 'shimmer', type: 'range', min: 0, max: 40, step: 1, label: { es: 'Temblor', en: 'Shimmer' } },
      { key: 'sparkle', type: 'range', min: 0, max: 2, step: 0.05, label: { es: 'Chispas', en: 'Sparkle' } },
      { key: 'speed', type: 'range', min: 0, max: 3, step: 0.05, label: { es: 'Velocidad', en: 'Speed' } },
      { key: 'reactivity', type: 'range', min: 0, max: 3, step: 0.1, label: { es: 'Reacción al scroll', en: 'Scroll reactivity' } },
    ],
  },
  {
    key: 'particleScroll',
    wraps: true,
    group: 'scroll',
    origin: 'canvasui',
    name: 'Particle Scroll',
    url: 'https://canvasui.dev/docs/components/particle-scroll',
    install: 'pnpm dlx shadcn@latest add @canvas-ui/particle-scroll-react',
    deps: [],
    labels: ['WebGL2', 'html-in-canvas'],
    tag: { es: 'la web se deshace en arena', en: 'the page dissolves into sand' },
    desc: {
      es: 'Todo lo que queda por debajo de una línea se deshace en arena que flota. Al hacer scroll, la página se vuelve a montar grano a grano según cruza esa línea. Con una foto se ve espectacular.',
      en: 'Everything below a chosen line dissolves into drifting sand. Scroll and the page reassembles grain by grain as it crosses that line. With a photo it looks spectacular.',
    },
    defaults: {
      point: 0.68, band: 300, density: 2, size: 1.25, spread: 220,
      gravity: 0.35, drift: 0.7, swirl: 60, stagger: 0.7, fade: 0.85,
      settle: 1.2, smoothing: 0.6,
    },
    controls: [
      { key: 'point', type: 'range', min: 0.1, max: 0.95, step: 0.01, label: { es: 'Línea de montaje', en: 'Formation line' } },
      { key: 'band', type: 'range', min: 60, max: 600, step: 20, label: { es: 'Zona de transición', en: 'Transition band' } },
      { key: 'density', type: 'range', min: 1, max: 8, step: 0.5, label: { es: 'Grano', en: 'Grain spacing' } },
      { key: 'size', type: 'range', min: 0.5, max: 4, step: 0.25, label: { es: 'Tamaño del grano', en: 'Grain size' } },
      { key: 'spread', type: 'range', min: 20, max: 500, step: 10, label: { es: 'Dispersión', en: 'Spread' } },
      { key: 'gravity', type: 'range', min: -1, max: 1, step: 0.05, label: { es: 'Gravedad', en: 'Gravity' } },
      { key: 'drift', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Flotación', en: 'Drift' } },
      { key: 'swirl', type: 'range', min: 0, max: 200, step: 5, label: { es: 'Remolino', en: 'Swirl' } },
      { key: 'stagger', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Desorden', en: 'Stagger' } },
      { key: 'fade', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Opacidad del polvo', en: 'Dust opacity' } },
      { key: 'settle', type: 'range', min: 0.1, max: 4, step: 0.1, label: { es: 'Tiempo de posarse', en: 'Settle time' } },
      { key: 'smoothing', type: 'range', min: 0, max: 2, step: 0.05, label: { es: 'Suavizado', en: 'Smoothing' } },
    ],
  },
  {
    key: 'chromaGlow',
    group: 'texto',
    origin: 'arlan',
    name: 'Chromatic Glow',
    component: 'ChromaGlow',
    url: 'https://arlan.me/vault/chroma-glow',
    deps: [],
    labels: ['WebGL', 'Bloom', 'Aberración'],
    tag: { es: 'palabra de neón con borde arcoíris', en: 'neon word with a rainbow edge' },
    desc: {
      es: 'La palabra se desenfoca a varios tamaños y se suma consigo misma, así que brilla de verdad. Luego se parte en una copia cálida y otra fría que se separan en direcciones opuestas, y ese hueco es el borde arcoíris. Al pasar el cursor, la separación se inclina hacia él.',
      en: 'The word is blurred at a few sizes and added back together, so it glows for real. Then it splits into a warm copy and a cool copy drifting opposite ways, and that gap is the rainbow edge. Move over it and the split leans toward your cursor.',
    },
    defaults: {
      word: 'Vibeset', bloom: 1.62, split: 9, core: 1.06, spectral: 0.6, noise: 0.15,
      warm: '#ffa880', cool: '#6b99f2', fringe: '#ff6b99', bg: '#1c2133',
    },
    controls: [
      { key: 'word', type: 'text', maxLength: 14, label: { es: 'Palabra', en: 'Word' } },
      { key: 'bloom', type: 'range', min: 0.4, max: 2, step: 0.01, label: { es: 'Resplandor', en: 'Bloom' } },
      { key: 'split', type: 'range', min: 0, max: 20, step: 0.5, label: { es: 'Separación', en: 'Split' } },
      { key: 'core', type: 'range', min: 0, max: 1.4, step: 0.01, label: { es: 'Núcleo', en: 'Core' } },
      { key: 'spectral', type: 'range', min: 0, max: 1, step: 0.01, label: { es: 'Arcoíris', en: 'Spectral' } },
      { key: 'noise', type: 'range', min: 0, max: 0.4, step: 0.01, label: { es: 'Grano', en: 'Grain' } },
      { key: 'warm', type: 'color', label: { es: 'Cálido', en: 'Warm' } },
      { key: 'cool', type: 'color', label: { es: 'Frío', en: 'Cool' } },
      { key: 'fringe', type: 'color', label: { es: 'Franja', en: 'Fringe' } },
      { key: 'bg', type: 'color', label: { es: 'Fondo', en: 'Background' } },
    ],
  },
  {
    key: 'emboss',
    group: 'texto',
    origin: 'arlan',
    name: 'Realistic Emboss',
    component: 'Emboss',
    url: 'https://arlan.me/vault/emboss',
    deps: [],
    labels: ['WebGL', 'Relieve'],
    tag: { es: 'palabra prensada en una pared', en: 'a word pressed into a wall' },
    desc: {
      es: 'La palabra se estampa en relieve sobre una pared con textura, con su bisel, su luz rasante y su sombra. Mueve el ángulo de la luz y verás cómo cambia el volumen: el relieve se calcula de verdad a partir de la pendiente del trazo, no es una sombra pegada.',
      en: 'The word is pressed into a textured wall, with its bevel, raking light and shadow. Move the light angle and the volume changes: the relief is computed from the slope of the letters, not faked with a drop shadow.',
    },
    defaults: {
      word: 'Vibeset', depth: 0.78, size: 2.6, soften: 0.7, angle: 73, altitude: 21,
      highlight: 0.2, shadow: 0.2, contrast: 0.32, bright: 2, texScale: 1, tint: '#ff9e3d',
    },
    controls: [
      { key: 'word', type: 'text', maxLength: 16, label: { es: 'Palabra', en: 'Word' } },
      { key: 'depth', type: 'range', min: 0.2, max: 2, step: 0.01, label: { es: 'Profundidad', en: 'Depth' } },
      { key: 'size', type: 'range', min: 1, max: 24, step: 0.5, label: { es: 'Ancho del bisel', en: 'Bevel size' } },
      { key: 'soften', type: 'range', min: 0, max: 12, step: 0.5, label: { es: 'Suavizado', en: 'Soften' } },
      { key: 'angle', type: 'range', min: 0, max: 360, step: 1, label: { es: 'Ángulo de la luz', en: 'Light angle' } },
      { key: 'altitude', type: 'range', min: 0, max: 90, step: 1, label: { es: 'Altura de la luz', en: 'Light altitude' } },
      { key: 'highlight', type: 'range', min: 0, max: 0.6, step: 0.01, label: { es: 'Brillo', en: 'Highlight' } },
      { key: 'shadow', type: 'range', min: 0, max: 0.6, step: 0.01, label: { es: 'Sombra', en: 'Shadow' } },
      { key: 'bright', type: 'range', min: 0.8, max: 2.4, step: 0.01, label: { es: 'Luz de la pared', en: 'Brightness' } },
      { key: 'contrast', type: 'range', min: 0, max: 1.4, step: 0.01, label: { es: 'Grano', en: 'Grain' } },
      { key: 'texScale', type: 'range', min: 0.4, max: 2.4, step: 0.01, label: { es: 'Zoom de textura', en: 'Texture zoom' } },
      { key: 'tint', type: 'color', label: { es: 'Color de la pared', en: 'Wall tint' } },
    ],
  },
  {
    key: 'colorDepth',
    group: 'ui',
    origin: 'arlan',
    name: 'Color Depth',
    component: 'ColorDepth',
    url: 'https://arlan.me/vault/color-depth',
    deps: [],
    labels: ['CSS', 'Skeuomorfismo'],
    tag: { es: 'diez materiales para un botón', en: 'ten materials for one button' },
    desc: {
      es: 'Botones que parecen objetos de verdad: cristal, metal cepillado, un cojín mate. La profundidad no sale de una sombra, sino de capas apiladas en el mismo botón: un cuerpo con degradado, sombras interiores para el bisel, una capa que se enciende al pasar el cursor y una barra de luz arriba. Aquí está el mismo botón hecho de diez maneras, y todo es CSS.',
      en: 'Buttons that feel like real objects: glass, brushed metal, a soft cushion. The depth is not one shadow but layers stacked on the same button: a gradient body, inset shadows for the bevel, a layer that lights up on hover and a bar of light along the top. Here is the same button built ten ways, and it is all CSS.',
    },
    // La etiqueta la escribe quien mira la ficha; por defecto va la marca, que
    // vale igual en los dos idiomas (los ajustes no se rehacen al cambiar de idioma).
    defaults: { material: 'glossy', label: 'Vibeset' },
    controls: [
      {
        key: 'material', type: 'select', label: { es: 'Material', en: 'Material' },
        options: [
          { value: 'glossy', label: { es: 'Brillante', en: 'Glossy' } },
          { value: 'glow', label: { es: 'Encendido', en: 'Glow' } },
          { value: 'metal', label: { es: 'Metal', en: 'Metal' } },
          { value: 'foil', label: { es: 'Holográfico', en: 'Foil' } },
          { value: 'layered', label: { es: 'Por capas', en: 'Layered' } },
          { value: 'inset', label: { es: 'Hundido', en: 'Inset' } },
          { value: 'glass', label: { es: 'Cristal', en: 'Glass' } },
          { value: 'neon', label: { es: 'Neón', en: 'Neon' } },
          { value: 'duotone', label: { es: 'Tecla', en: 'Duotone' } },
          { value: 'satin', label: { es: 'Satinado', en: 'Satin' } },
        ],
      },
      { key: 'label', type: 'text', maxLength: 18, label: { es: 'Texto del botón', en: 'Button label' } },
    ],
  },
  // --- Piezas PROPIAS. Las tres primeras del catálogo, publicadas el 2026-08-29.
  // No llevan `install` porque no viven en ningún registro de shadcn: son nuestras,
  // así que lo que se enseña es el código, no un comando que instale el de otro. Y
  // llevan `component` porque el nombre del archivo no sale de capitalizar un
  // título con tildes y preposiciones dentro.
  {
    key: 'headerPildora',
    group: 'ui',
    origin: 'propio',
    clase: 'pieza',
    component: 'HeaderPildora',
    name: 'Header de píldora deslizante',
    nameEn: 'Sliding pill header',
    url: null,
    install: null,
    deps: [],
    labels: ['spring', 'sin dependencias', 'teclado'],
    tag: {
      es: 'una sola píldora viaja hasta el item señalado',
      en: 'a single pill travels to the item you point at',
    },
    desc: {
      es: 'Lo genérico es dar a cada item su propio fondo, y entonces el ojo ve cinco luces encendiéndose y apagándose, que no significan nada. Con un único objeto que se mueve, el ojo lee continuidad: es la misma cosa, que ahora está en otro sitio. La mueve un spring y no una transición, así que al recorrer el menú deprisa redirige a media trayectoria en vez de encadenar viajes. Recórrelo también con el tabulador.',
      en: 'The generic move is to give every item its own background, and then the eye just sees five lights blinking on and off, which mean nothing. With a single object that moves, the eye reads continuity: it is the same thing, now somewhere else. A spring moves it, not a transition, so sweeping the menu fast redirects mid-flight instead of queueing trips. Try it with the tab key too.',
    },
    defaults: { respuesta: 0.34, amortiguacion: 0.68, gain: 1 },
    controls: [
      { key: 'respuesta', type: 'range', min: 0.12, max: 0.8, step: 0.02, label: { es: 'Respuesta', en: 'Response' } },
      { key: 'amortiguacion', type: 'range', min: 0.3, max: 1, step: 0.02, label: { es: 'Amortiguación', en: 'Damping' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
  {
    key: 'acordeonFaq',
    group: 'ui',
    origin: 'propio',
    clase: 'pieza',
    component: 'AcordeonFaq',
    name: 'Acordeón de preguntas',
    nameEn: 'FAQ accordion',
    url: null,
    install: null,
    deps: [],
    labels: ['sin dependencias', 'indexable', 'ARIA'],
    tag: {
      es: 'se abre una a la vez, y la respuesta siempre está en el HTML',
      en: 'one open at a time, and the answer is always in the HTML',
    },
    desc: {
      es: 'Al pulsar otra pregunta, la que estaba se cierra en el mismo movimiento: es un solo índice en el estado, y es lo que evita el acordeón que se va llenando hasta que no se ve ninguna. Dos decisiones que se pierden al copiarlo de memoria: la respuesta SIEMPRE está en el DOM, porque si solo existe al abrirla un buscador no la lee nunca; y el alto se anima con una rejilla de 0fr a 1fr, no con un max-height puesto a ojo que recorta las respuestas largas.',
      en: 'Opening another question closes the previous one in the same movement: it is a single index in state, and it is what prevents the accordion that fills up until nothing is readable. Two decisions people lose when copying from memory: the answer is ALWAYS in the DOM, because if it only exists once open a search engine never reads it; and the height animates with a 0fr to 1fr grid row, not with a guessed max-height that clips the long answers.',
    },
    defaults: { duracion: 400 },
    controls: [
      { key: 'duracion', type: 'range', min: 0, max: 900, step: 20, label: { es: 'Duración', en: 'Duration' } },
    ],
  },
  {
    key: 'matrioska',
    group: 'scroll',
    origin: 'propio',
    clase: 'receta',
    component: 'MatrioskaParallax',
    name: 'Matrioska parallax',
    nameEn: 'Matryoshka parallax',
    url: null,
    install: null,
    deps: [],
    labels: ['scroll', 'sin dependencias', 'receta'],
    tag: {
      es: 'el scroll mueve una cámara, no la página',
      en: 'the scroll moves a camera, not the page',
    },
    desc: {
      es: 'Capas que se anidan y avanzan a distinta velocidad según el scroll: no hay desplazamiento lateral, lo que crece es el mundo. La cuenta entera cabe en tres líneas: la cámara avanza medida en capas, cada capa mira a cuántas queda de distancia, y esa distancia se convierte en escala elevando dos a ella. Con el dial de movimiento a cero la escala se queda en uno y el efecto degrada a un fundido encadenado: se queda sin trayecto, pero no se rompe.',
      en: 'Layers that nest and advance at different speeds as you scroll: there is no sideways travel, what grows is the world. The whole maths fits in three lines: the camera advances measured in layers, each layer checks how many layers away it is, and that distance becomes scale by raising two to it. With the motion dial at zero the scale stays at one and the effect degrades to a cross-fade: it loses the journey, but it does not break.',
    },
    defaults: { gain: 1, pantallasPorCapa: 1 },
    controls: [
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
      { key: 'pantallasPorCapa', type: 'range', min: 0.4, max: 2, step: 0.1, label: { es: 'Recorrido', en: 'Travel' } },
    ],
  },
]

// Primero lo que tiene demo, después las fichas de análisis: en la rejilla se ve
// antes lo que se mueve.
export const COMPONENT_ITEMS = [...ITEMS_EN_VIVO, ...REACTBITS_ITEMS]

// Solo las props que el usuario haya cambiado, como hacen las webs de componentes.
// El nombre de una pieza de la casa sí se traduce: «Header de píldora deslizante»
// en inglés no dice nada. Los de canvasui y arlan no tienen `nameEn` porque son
// nombres propios (Bubble, Cloth) y esos no se traducen.
export const nombreDe = (item, lang) => (lang === 'en' && item.nameEn) || item.name

// El peso del fuente de una ficha de referencia, con la coma de cada idioma.
export const formatoKb = (kb, lang) =>
  `${kb.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES', { maximumFractionDigits: 1 })} KB`

export function changedProps(item, values) {
  const out = {}
  for (const [k, v] of Object.entries(values)) {
    if (item.defaults[k] !== v) out[k] = v
  }
  return out
}

function formatValue(v) {
  if (typeof v === 'string') return `"${v}"`
  if (typeof v === 'boolean') return `{${v}}`
  return `{${v}}`
}

export function usageSnippet(item, values) {
  const changed = changedProps(item, values)
  const props = Object.entries(changed).map(([k, v]) => `${k}=${formatValue(v)}`)
  // `component` manda cuando el nombre del archivo no sale de capitalizar el título.
  const tag = item.component ||
    item.name.replace(/(?:^|\s)(\w)/g, (_, c) => c.toUpperCase()).replace(/\s+/g, '')
  const CARPETA = { canvasui: 'canvasui', propio: 'propios' }
  const carpeta = CARPETA[item.origin]
  const importLine = carpeta
    ? `import ${tag} from "@/components/${carpeta}/${tag}"\n\n`
    : ''

  const attrs = props.length ? `\n  ${props.join('\n  ')}\n` : ''

  if (!item.wraps) return `${importLine}<${tag}${attrs || ' '}/>`
  return `${importLine}<${tag}${attrs}>\n  {/* tu contenido */}\n</${tag}>`
}
