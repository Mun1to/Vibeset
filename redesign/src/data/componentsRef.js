// Fichas de ANÁLISIS de componentes de React Bits (https://reactbits.dev).
//
// Son una tercera clase de cosa en el catálogo, y no se parece a las otras dos:
// no hay demo y no hay código. Es la `clase: 'referencia'`.
//
// Por qué sin código ni demo. La licencia de React Bits es MIT con Commons Clause
// (copyright 2026 David Haz) y prohíbe vender, sublicenciar o redistribuir los
// componentes en sí, «solos, en paquete o como versión portada». Vibeset guarda en
// su repositorio público el código de canvasui y de arlan, y LICENSING.md lo
// justifica porque ninguno de los dos publica licencia. React Bits sí la publica, y
// es restrictiva: meter aquí su código sería redistribuirlo en paquete. Lo que sí se
// puede, y es lo que hace el MCP con todos los registros federados, es enlazarlo,
// analizarlo con palabras propias (CC BY) y dar su comando de instalación.
//
// Qué lleva cada ficha, y de dónde sale cada dato (lectura del fuente de la versión
// TypeScript con Tailwind y del registry de React Bits, el 2026-10-24):
//   - `labels`: con qué dibuja (WebGL, Canvas 2D, DOM, SVG, WebGPU, CSS 3D).
//   - `deps`: lo que declara su registry como dependencia, tal cual.
//   - `kb`: tamaño del fuente sin minificar.
//   - `pausa`: solo si el código trae un IntersectionObserver que lo detiene fuera de
//     pantalla. Donde no está, no se dice nada: que no lo vea no es que no lo haga.
//   - `cuando`, `cuidado`, `a11y`, `prompt`: texto propio, en los dos idiomas.
//
// Nada de esto está probado en ejecución: se ha leído el código, no se ha montado.
// «Tiene aria» no es «es accesible», y la ficha lo dice como lo que es: lo que se ve
// en el código.
const REACTBITS = 'https://reactbits.dev'

// El comando es el de la variante TypeScript con Tailwind, que es la del proyecto.
// React Bits publica cuatro (JS o TS, CSS o Tailwind) con el mismo nombre y ese sufijo.
const rb = ({ ruta, id, ...resto }) => ({
  origin: 'reactbits',
  clase: 'referencia',
  licenciaOrigen: 'MIT + Commons Clause',
  url: `${REACTBITS}/${ruta}`,
  install: `pnpm dlx shadcn@latest add @react-bits/${id}-TS-TW`,
  wraps: false,
  defaults: {},
  controls: [],
  ...resto,
})

export const REACTBITS_ITEMS = [
  // ---------------------------------------------------------------- Canvas y WebGL
  rb({
    key: 'gradientAscii',
    id: 'GradientASCII',
    ruta: 'backgrounds/gradient-ascii',
    group: 'canvas',
    name: 'Gradient ASCII',
    labels: ['WebGL', 'Canvas 2D'],
    deps: [],
    kb: 31.6,
    pausa: true,
    tag: { es: `resplandores en degradado hechos de letras`, en: `gradient glows drawn with letters` },
    desc: {
      es: `Un fondo de resplandores suaves dibujados con caracteres ASCII que se desordenan bajo el cursor. Tiene cuatro formas de degradado (horizonte, pinzamiento, subida y eclipse) y un efecto al hacer clic.`,
      en: `A background of soft glows drawn with ASCII characters that scramble under the cursor. It has four gradient shapes (horizon, pinch, rise and eclipse) and an effect on click.`,
    },
    cuando: {
      es: `Para el fondo de una portada que quiere sonar a terminal sin ser un terminal. Con poco contenido encima, para que respire.`,
      en: `For the background of a landing that wants to sound like a terminal without being one. Keep the content on top light so it can breathe.`,
    },
    cuidado: {
      es: `Es un fondo: el texto que lleve encima necesita su contraste medido contra la parte más clara del degradado, no contra el color medio.`,
      en: `It is a background: any text on top needs its contrast measured against the lightest part of the gradient, not the average colour.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y es puramente decorativo, así que no hay nada que leer en él.`,
      en: `It respects the system reduced-motion setting and is purely decorative, so there is nothing in it to read.`,
    },
    prompt: {
      es: `Pon el componente GradientASCII de React Bits como fondo de la sección principal, con el contenido encima en una capa con position relative. Mide el contraste del texto contra la zona más clara del degradado y, si no llega a 4,5 a 1, baja la opacidad de los glifos. Con prefers-reduced-motion tiene que quedarse quieto.`,
      en: `Use the GradientASCII component from React Bits as the background of the main section, with the content on top in a layer with position relative. Measure the text contrast against the lightest area of the gradient and, if it does not reach 4.5 to 1, lower the glyph opacity. With prefers-reduced-motion it must stay still.`,
    },
  }),
  rb({
    key: 'laserFlow',
    id: 'LaserFlow',
    ruta: 'animations/laser-flow',
    group: 'canvas',
    name: 'Laser Flow',
    labels: ['WebGL', 'Canvas 2D'],
    deps: [],
    kb: 34.8,
    pausa: true,
    tag: { es: `un haz de láser con niebla y polvo`, en: `a laser beam with fog and dust` },
    desc: {
      es: `Un haz de láser con niebla, polvo, destellos y vetas, que cae sobre una superficie de la página y, al pasar el ratón, revela una imagen. Se ajustan el color, la intensidad, el ancho del haz y la semilla.`,
      en: `A laser beam with fog, dust, flares and streaks that lands on a surface of the page and, as you move the mouse, reveals an image. Colour, intensity, beam width and seed are adjustable.`,
    },
    cuando: {
      es: `Para la portada de un producto técnico o de seguridad, con una superficie sobre la que apoyar el haz. El brillo vale si dice algo.`,
      en: `For the landing of a technical or security product, with a surface to rest the beam on. Glow works when it says something.`,
    },
    cuidado: {
      es: `Un láser de adorno en cada hero es justo lo que hoy se lee como «hecho por IA». Úsalo con una razón: que el haz apunte a lo que importa. Tiene una prop paused para pararlo.`,
      en: `A decorative laser on every hero is exactly what reads as "AI-made" today. Use it with a reason: let the beam point at what matters. It has a paused prop to stop it.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y es puramente decorativo.`,
      en: `It respects the system reduced-motion setting and is purely decorative.`,
    },
    prompt: {
      es: `Añade LaserFlow de React Bits como fondo del hero, con el haz cayendo sobre la tarjeta principal (con surfaceRef). Que se detenga fuera de pantalla y con prefers-reduced-motion, y comprueba que el texto cumple contraste sobre la parte más brillante.`,
      en: `Add LaserFlow from React Bits as the hero background, with the beam landing on the main card (using surfaceRef). It should stop off screen and with prefers-reduced-motion, and check the text passes contrast over the brightest part.`,
    },
  }),
  rb({
    key: 'metallicPaint',
    id: 'MetallicPaint',
    ruta: 'animations/metallic-paint',
    group: 'canvas',
    name: 'Metallic Paint',
    labels: ['WebGL', 'Canvas 2D'],
    deps: [],
    kb: 28,
    pausa: true,
    tag: { es: `tu logo hecho pintura metálica líquida`, en: `your logo turned into liquid metallic paint` },
    desc: {
      es: `Convierte un logo, una imagen o un texto en pintura metálica líquida con un shader, con distorsión, dispersión y un ligero giro según el ratón. Tiene modo claro y modo oscuro.`,
      en: `Turns a logo, an image or a text into liquid metallic paint with a shader, with distortion, dispersion and a slight tilt following the mouse. It has light and dark modes.`,
    },
    cuando: {
      es: `Para el logo grande de una portada de marca, que es lo único que hace falta que luzca. Con una forma simple y de mucho contraste, no con un logotipo lleno de detalle.`,
      en: `For the big logo on a brand landing, the one thing that needs to shine. With a simple, high-contrast shape, not a detailed wordmark.`,
    },
    cuidado: {
      es: `Con imageSrc descarga la imagen con fetch: que sea propia y esté en tu dominio. Y el logo deja de ser texto o imagen para el navegador: necesita su alternativa por fuera del canvas.`,
      en: `With imageSrc it downloads the image with fetch: make it your own and keep it on your domain. And the logo stops being text or an image to the browser: it needs its alternative outside the canvas.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema. No lleva ningún atributo aria: el texto alternativo del logo lo pones tú, en el elemento que lo envuelva.`,
      en: `It respects the system reduced-motion setting. It carries no aria attribute: you provide the logo's alt text yourself, on the element that wraps it.`,
    },
    prompt: {
      es: `Muestra mi logo con el componente MetallicPaint de React Bits, con la imagen en SVG servida desde mi propio dominio. Envuélvelo en un elemento con role img y aria-label con el nombre de la marca, y déjalo quieto con prefers-reduced-motion.`,
      en: `Show my logo with the MetallicPaint component from React Bits, with the image as an SVG served from my own domain. Wrap it in an element with role img and an aria-label with the brand name, and keep it still with prefers-reduced-motion.`,
    },
  }),
  rb({
    key: 'topography',
    id: 'Topography',
    ruta: 'backgrounds/topography',
    group: 'canvas',
    name: 'Topography',
    labels: ['WebGL'],
    deps: [],
    kb: 58.1,
    pausa: true,
    tag: { es: `curvas de nivel de un mapa en 3D`, en: `a 3D map of contour lines` },
    desc: {
      es: `Líneas de contorno de un mapa topográfico en 3D, con elevación, niebla, profundidad de campo, marcadores y efectos al pasar el ratón y al hacer clic. Tiene modo claro y modo oscuro.`,
      en: `Contour lines of a 3D topographic map, with elevation, fog, depth of field, markers and effects on hover and click. It has light and dark modes.`,
    },
    cuando: {
      es: `Para el fondo de una portada de datos, de mapas, de viajes o de naturaleza, donde el relieve cuenta algo.`,
      en: `For the background of a data, mapping, travel or outdoors landing, where relief says something.`,
    },
    cuidado: {
      es: `Es el que más código tiene de los que analizamos aquí: 58 KB de fuente. Cárgalo de forma perezosa y solo donde se vea.`,
      en: `It has the most code of the ones we analyse here: 58 KB of source. Load it lazily and only where it shows.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y recupera el contexto WebGL si el navegador lo pierde. Es decorativo.`,
      en: `It respects the system reduced-motion setting and recovers the WebGL context if the browser drops it. It is decorative.`,
    },
    prompt: {
      es: `Añade Topography de React Bits como fondo del hero cargándolo con lazy y Suspense, para que no entre en el bundle inicial. Que se detenga fuera de pantalla, que se quede quieto con prefers-reduced-motion, y comprueba el contraste del texto contra las líneas.`,
      en: `Add Topography from React Bits as the hero background, loading it with lazy and Suspense so it stays out of the initial bundle. It should stop off screen, stay still with prefers-reduced-motion, and the text contrast against the lines should be checked.`,
    },
  }),
  rb({
    key: 'elasticMesh',
    id: 'ElasticMesh',
    ruta: 'animations/elastic-mesh',
    group: 'canvas',
    name: 'Elastic Mesh',
    labels: ['WebGL', 'Canvas 2D'],
    deps: [],
    kb: 50.4,
    pausa: true,
    tag: { es: `texto o imagen hechos malla elástica`, en: `text or image as an elastic mesh` },
    desc: {
      es: `Un texto o una imagen convertidos en una malla elástica que se estira y rebota al agarrarla, con varios materiales y una sombra. Se ajustan la rigidez, el vaivén y el radio de agarre.`,
      en: `A text or an image turned into an elastic mesh that stretches and bounces when you grab it, with several materials and a shadow. Stiffness, wobble and grab radius are adjustable.`,
    },
    cuando: {
      es: `Para un juguete de portada en una web creativa: el logo que se estira. Es un adorno, no un modo de enseñar contenido.`,
      en: `For a toy on a creative site: a logo that stretches. It is decoration, not a way to present content.`,
    },
    cuidado: {
      es: `Con 50 KB de fuente es de los que más pesan entre los que analizamos aquí: mucho para un juguete. Cárgalo de forma perezosa y solo si el juguete es el punto.`,
      en: `At 50 KB of source it is among the heaviest of the ones we analyse here: a lot for a toy. Load it lazily and only if the toy is the point.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y trae tres señales aria. Se detiene fuera de pantalla.`,
      en: `It respects the system reduced-motion setting and carries three aria signals. It stops off screen.`,
    },
    prompt: {
      es: `Muestra mi logo con ElasticMesh de React Bits en la portada, con carga perezosa. Dale un texto alternativo al contenedor y que con prefers-reduced-motion no responda al arrastre.`,
      en: `Show my logo with ElasticMesh from React Bits on the landing, loaded lazily. Give the container an alt text, and with prefers-reduced-motion it should not respond to dragging.`,
    },
  }),
  rb({
    key: 'shapeWaves',
    id: 'ShapeWaves',
    ruta: 'backgrounds/shape-waves',
    group: 'canvas',
    name: 'Shape Waves',
    labels: ['WebGPU', 'Canvas 2D'],
    deps: ['vgpu'],
    kb: 33,
    pausa: true,
    tag: { es: `ondas de puntos que dibujan un texto`, en: `waves of dots drawing a text` },
    desc: {
      es: `Ondas de puntos y formas que dibujan un texto, con salpicadura al pasar el ratón, brillo y una entrada animada. Se pinta con WebGPU a través de la librería vgpu.`,
      en: `Waves of dots and shapes that draw a text, with a splash on hover, glow and an animated intro. It paints with WebGPU through the vgpu library.`,
    },
    cuando: {
      es: `Para un titular enorme en una portada de marca o de evento, en navegadores modernos. Solo si tienes plan B para el resto.`,
      en: `For a huge headline on a brand or event landing, in modern browsers. Only if you have a plan B for the rest.`,
    },
    cuidado: {
      es: `WebGPU no está en todos los navegadores, y vgpu es una librería de mayo de 2026 que en octubre iba por la versión 0.6. El registro de React Bits fijaba entonces la ^0.3.1, una versión vieja: mira cuál instala hoy. Hace falta un texto normal que se vea cuando falle (hay una prop onError).`,
      en: `WebGPU is not in every browser, and vgpu is a library from May 2026 that was at version 0.6 in October. The React Bits registry then pinned ^0.3.1, an old version: check which one it installs today. You need a normal text that shows up when it fails (there is an onError prop).`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema. El texto vive dentro del canvas: ponlo también en el HTML.`,
      en: `It respects the system reduced-motion setting. The text lives inside the canvas: put it in the HTML too.`,
    },
    prompt: {
      es: `Muestra el titular de la portada con ShapeWaves de React Bits y deja el mismo titular en un h1 normal que se vea mientras carga y si WebGPU falla (con onError). Revisa qué versión de vgpu instala el registro y cuál es la última. Con prefers-reduced-motion, sin animación.`,
      en: `Show the landing headline with ShapeWaves from React Bits and keep the same headline in a normal h1 that shows while it loads and if WebGPU fails (using onError). Check which vgpu version the registry installs and which is the latest. With prefers-reduced-motion, no animation.`,
    },
  }),

  // ---------------------------------------------------------------- Puntero
  rb({
    key: 'crosshair',
    id: 'Crosshair',
    ruta: 'animations/crosshair',
    group: 'cursor',
    name: 'Crosshair',
    labels: ['Canvas 2D'],
    deps: [],
    kb: 15.8,
    tag: { es: `una retícula que sigue al cursor`, en: `a crosshair that follows the cursor` },
    desc: {
      es: `Una retícula que sigue al cursor sobre un contenedor, con líneas continuas, discontinuas o de puntos, coordenadas en vivo, un efecto al apuntar a un elemento (bloqueo o glitch) y un pulso al hacer clic.`,
      en: `A crosshair that follows the cursor over a container, with solid, dashed or dotted lines, live coordinates, an effect when it points at an element (lock or glitch) and a pulse on click.`,
    },
    cuando: {
      es: `Para la portada de una herramienta técnica, de cartografía o de juego, donde apuntar es parte de la experiencia. No para una web de contenido.`,
      en: `For the landing of a technical tool, a mapping product or a game, where aiming is part of the experience. Not for a content site.`,
    },
    cuidado: {
      es: `Con hideCursor esconde el cursor real, y quien necesita verlo bien lo pierde: déjalo apagado. Solo reacciona al ratón: en táctil no hace nada, así que no puede ser la única forma de llegar a algo.`,
      en: `With hideCursor it hides the real cursor, and anyone who needs to see it clearly loses it: leave it off. It only reacts to the mouse: on touch it does nothing, so it cannot be the only way to reach anything.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema. Ignora a propósito los punteros que no son ratón. Es decorativo.`,
      en: `It respects the system reduced-motion setting. It deliberately ignores non-mouse pointers. It is decorative.`,
    },
    prompt: {
      es: `Añade el componente Crosshair de React Bits sobre el contenedor del hero, solo para punteros de tipo ratón. Deja hideCursor en false, no uses la retícula para nada que no se pueda hacer sin ella y desactívala con prefers-reduced-motion.`,
      en: `Add the Crosshair component from React Bits over the hero container, for mouse pointers only. Leave hideCursor false, do not use the crosshair for anything that cannot be done without it, and turn it off with prefers-reduced-motion.`,
    },
  }),
  rb({
    key: 'specularButton',
    id: 'SpecularButton',
    ruta: 'components/specular-button',
    group: 'cursor',
    name: 'Specular Button',
    labels: ['WebGL'],
    deps: [],
    kb: 17.6,
    pausa: true,
    tag: { es: `botón de cristal con brillo que sigue al ratón`, en: `glass button with a shine that follows the mouse` },
    desc: {
      es: `Un botón de cristal con un brillo especular que sigue al ratón, un borde luminoso y una animación en reposo opcional. Admite los atributos y el tipo de un button normal.`,
      en: `A glass button with a specular shine that follows the mouse, a glowing edge and an optional idle animation. It accepts the attributes and type of a normal button.`,
    },
    cuando: {
      es: `Para la llamada a la acción principal de una portada, una sola. Sobre un fondo oscuro o con color detrás, donde el cristal se nota.`,
      en: `For the main call to action on a landing, just one. Over a dark or coloured background, where glass shows.`,
    },
    cuidado: {
      es: `Cada botón lleva su propio canvas WebGL: dos o tres, bien; veinte, no.`,
      en: `Every button carries its own WebGL canvas: two or three are fine, twenty are not.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y acepta los atributos de un button, así que el nombre accesible y el tipo los controlas tú.`,
      en: `It respects the system reduced-motion setting and accepts button attributes, so you control the accessible name and the type.`,
    },
    prompt: {
      es: `Usa SpecularButton de React Bits para el botón principal de la portada, uno solo por pantalla, con el texto de la acción. Comprueba que el texto cumple contraste en reposo y que con prefers-reduced-motion no se anima en reposo.`,
      en: `Use SpecularButton from React Bits for the main landing button, only one per screen, with the action text. Check the text passes contrast at rest and that with prefers-reduced-motion it does not animate at rest.`,
    },
  }),

  // ---------------------------------------------------------------- Texto
  rb({
    key: 'shinyText',
    id: 'ShinyText',
    ruta: 'text-animations/shiny-text',
    group: 'texto',
    name: 'Shiny Text',
    labels: ['DOM', 'Canvas 2D'],
    deps: [],
    kb: 12.7,
    pausa: true,
    tag: { es: `un brillo que recorre el texto`, en: `a shine sweeping across the text` },
    desc: {
      es: `Texto con un brillo que lo recorre: en bucle, al pasar el ratón o al entrar en pantalla, y puede seguir al puntero. Se regulan el ángulo, el ancho del brillo, la suavidad y la velocidad.`,
      en: `Text with a shine sweeping across it: looping, on hover or when it enters the viewport, and it can follow the pointer. Angle, shine width, softness and speed are adjustable.`,
    },
    cuando: {
      es: `Para un solo titular o una llamada a la acción que quieras destacar. Es barata: sin dependencias y con 12,7 KB.`,
      en: `For a single headline or a call to action you want to stand out. It is cheap: no dependencies and 12.7 KB.`,
    },
    cuidado: {
      es: `Un brillo en bucle en cada titular cansa y le quita sentido: uno por pantalla. Y comprueba que el color de base, sin brillo, ya cumple el contraste.`,
      en: `A looping shine on every headline wears out and loses its meaning: one per screen. And check that the base colour, with no shine on it, already passes contrast.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema.`,
      en: `It respects the system reduced-motion setting.`,
    },
    prompt: {
      es: `Aplica el efecto ShinyText de React Bits a un único titular de la portada, con el brillo en bucle lento. No lo pongas en más de un texto por pantalla y asegúrate de que, con el brillo apagado, el color base cumple contraste AA. Con prefers-reduced-motion, sin animación.`,
      en: `Apply the ShinyText effect from React Bits to a single landing headline, with a slow looping shine. Do not put it on more than one text per screen and make sure that, with the shine off, the base colour passes AA contrast. With prefers-reduced-motion, no animation.`,
    },
  }),
  rb({
    key: 'countUp',
    id: 'CountUp',
    ruta: 'text-animations/count-up',
    group: 'texto',
    name: 'Count Up',
    labels: ['DOM'],
    deps: ['motion'],
    kb: 16.7,
    tag: { es: `cifras que suben hasta su valor`, en: `figures that count up to their value` },
    desc: {
      es: `Un contador que sube hasta una cifra, en modo cuenta o en modo rodillo, con separadores, prefijo y sufijo, formato compacto (1,2K) y decimales. Arranca al entrar en pantalla o al cargar, y puede repetirse al pasar el ratón.`,
      en: `A counter that runs up to a figure, in count or roll mode, with separators, prefix and suffix, compact format (1.2K) and decimals. It starts on entering the viewport or on load, and can replay on hover.`,
    },
    cuando: {
      es: `Para cifras reales que cuentan algo: usuarios, versiones, descargas. Una cifra inventada con animación sigue siendo inventada.`,
      en: `For real figures that tell something: users, releases, downloads. An invented figure with an animation is still invented.`,
    },
    cuidado: {
      es: `Antes de animar, comprueba qué texto sirve: lo que ve un robot que no ejecuta JavaScript tiene que ser la cifra final y no el cero de partida.`,
      en: `Before animating, check what text is served: what a bot that does not run JavaScript sees has to be the final figure, not the starting zero.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y trae algo de aria. Pruébalo con un lector de pantalla: un valor que cambia sin parar es lo que más cuesta de leer.`,
      en: `It respects the system reduced-motion setting and carries some aria. Try it with a screen reader: a value that keeps changing is the hardest thing to read.`,
    },
    prompt: {
      es: `Usa el componente CountUp de React Bits para las cifras de la sección de datos, con la cifra final ya escrita en el HTML inicial. Que cuente solo al entrar en pantalla y una sola vez, y que con prefers-reduced-motion muestre el valor final sin animar.`,
      en: `Use the CountUp component from React Bits for the figures in the data section, with the final figure already written in the initial HTML. It should count only on entering the viewport and only once, and with prefers-reduced-motion show the final value without animating.`,
    },
  }),
  rb({
    key: 'trueFocus',
    id: 'TrueFocus',
    ruta: 'text-animations/true-focus',
    group: 'texto',
    name: 'True Focus',
    labels: ['DOM'],
    deps: ['motion'],
    kb: 8.4,
    tag: { es: `las palabras se enfocan una a una`, en: `words come into focus one at a time` },
    desc: {
      es: `Una frase donde las palabras se enfocan de una en una: la activa se marca con corchetes, caja, subrayado o resaltado y el resto se desenfoca. Va sola en secuencia o sigue al ratón palabra a palabra.`,
      en: `A sentence where words come into focus one at a time: the active one is marked with brackets, a box, an underline or a highlight and the rest blurs. It runs on its own in sequence or follows the mouse word by word.`,
    },
    cuando: {
      es: `Para una frase corta y central que quieres que se lea despacio, una palabra cada vez. Es la que menos código tiene de las que analizamos aquí, con 8,4 KB.`,
      en: `For a short, central sentence you want read slowly, one word at a time. It has the least code of the ones we analyse here, at 8.4 KB.`,
    },
    cuidado: {
      es: `El desenfoque deja ilegible lo que no está activo: no sirve para texto que haya que leer entero, y menos para un párrafo.`,
      en: `The blur makes whatever is not active unreadable: it does not suit text that has to be read in full, least of all a paragraph.`,
    },
    a11y: {
      es: `Usa useReducedMotion para quitar el movimiento. Con el desenfoque puesto, el contraste de las palabras inactivas es lo que hay que medir.`,
      en: `It uses useReducedMotion to drop the movement. With the blur on, the contrast of the inactive words is what to measure.`,
    },
    prompt: {
      es: `Añade el componente TrueFocus de React Bits a la frase central del hero, con cuatro o cinco palabras como máximo. No lo uses en párrafos. Comprueba que las palabras desenfocadas siguen siendo legibles y que con prefers-reduced-motion se ven todas nítidas.`,
      en: `Add the TrueFocus component from React Bits to the central hero sentence, with four or five words at most. Do not use it on paragraphs. Check the blurred words are still legible and that with prefers-reduced-motion they are all sharp.`,
    },
  }),
  rb({
    key: 'fallingText',
    id: 'FallingText',
    ruta: 'text-animations/falling-text',
    group: 'texto',
    name: 'Falling Text',
    labels: ['DOM', 'Matter.js'],
    deps: ['matter-js'],
    kb: 22.5,
    pausa: true,
    tag: { es: `el texto cae con física de verdad`, en: `text that falls with real physics` },
    desc: {
      es: `El texto se convierte en cuerpos con física: cae al empezar, al pasar el ratón, al hacer clic o al hacer scroll, y se puede arrastrar y salpicar. Va por palabras o por letras, y también como fichas.`,
      en: `The text turns into physical bodies: it falls on load, on hover, on click or on scroll, and you can drag it around and scatter it. It works by words or by letters, and also as tiles.`,
    },
    cuando: {
      es: `Para un momento de juego en una portada creativa: una frase que se desmorona cuando pasa algo. No para texto que haya que leer.`,
      en: `For a playful moment on a creative landing: a sentence that falls apart when something happens. Not for text that has to be read.`,
    },
    cuidado: {
      es: `Llama mucho la atención y se lee mal. Pon el texto real en otro sitio de la página y deja esto como adorno. Trae la física de matter-js (MIT, 0,9 MB instalado).`,
      en: `It grabs attention and reads badly. Put the real text elsewhere on the page and keep this as decoration. It brings matter-js physics (MIT, 0.9 MB installed).`,
    },
    a11y: {
      es: `Menciona el movimiento reducido pero no lleva ni un atributo aria: un lector de pantalla recibe letras o palabras sueltas.`,
      en: `It mentions reduced motion but carries not a single aria attribute: a screen reader gets loose letters or words.`,
    },
    prompt: {
      es: `Usa FallingText de React Bits solo como adorno de un titular, y escribe el mismo texto en un elemento visible o con aria-label para los lectores de pantalla. Dispáralo con el scroll, una sola vez, y con prefers-reduced-motion deja el texto quieto.`,
      en: `Use FallingText from React Bits only as a headline decoration, and write the same text in a visible element or with an aria-label for screen readers. Trigger it on scroll, only once, and with prefers-reduced-motion keep the text still.`,
    },
  }),
  rb({
    key: 'textLoop',
    id: 'TextLoop',
    ruta: 'text-animations/text-loop',
    group: 'texto',
    name: 'Text Loop',
    labels: ['SVG'],
    deps: ['gsap'],
    kb: 21.6,
    pausa: true,
    tag: { es: `texto que recorre una forma en bucle`, en: `text running around a shape in a loop` },
    desc: {
      es: `Un texto que recorre una forma o un trazo en bucle (círculo, curva, cinta), con arrastre y aceleración al hacer scroll. Admite un trazo SVG propio, contorno y un efecto de cruce.`,
      en: `A text that runs around a shape or path in a loop (circle, curve, ribbon), with drag and scroll boost. It accepts your own SVG path, outline and a cross effect.`,
    },
    cuando: {
      es: `Para un sello giratorio o una cinta con el lema de la marca. Corto: una frase, no un párrafo.`,
      en: `For a rotating badge or a ribbon with the brand tagline. Short: one sentence, not a paragraph.`,
    },
    cuidado: {
      es: `Depende de GSAP, que no es MIT sino la licencia «Standard no charge» de GreenSock: gratis, pero con condiciones que MIT no tiene. Léela antes de meterla en un producto de pago.`,
      en: `It depends on GSAP, which is not MIT but GreenSock's "Standard no charge" licence: free, but with conditions MIT does not have. Read it before putting it in a paid product.`,
    },
    a11y: {
      es: `Siete señales aria y movimiento reducido. Comprueba qué lee un lector de pantalla cuando el texto recorre una curva.`,
      en: `Seven aria signals and reduced motion. Check what a screen reader announces when the text runs along a curve.`,
    },
    prompt: {
      es: `Pon un sello con TextLoop de React Bits con el lema de la marca en círculo, lento. Antes de instalarlo, dime que depende de GSAP (licencia propia, no MIT) para que lo decida yo. Con prefers-reduced-motion tiene que quedarse quieto.`,
      en: `Add a badge with TextLoop from React Bits with the brand tagline in a circle, slow. Before installing it, tell me it depends on GSAP (its own licence, not MIT) so I can decide. With prefers-reduced-motion it must stay still.`,
    },
  }),
  rb({
    key: 'splitFlapText',
    id: 'SplitFlapText',
    ruta: 'text-animations/split-flap-text',
    group: 'texto',
    name: 'Split Flap Text',
    labels: ['DOM', 'CSS 3D'],
    deps: [],
    kb: 21.7,
    tag: { es: `panel de aeropuerto con letras que giran`, en: `airport board with flipping letters` },
    desc: {
      es: `Un panel de aeropuerto: las letras giran como fichas hasta formar las palabras, en ciclo o una sola vez. Se elige el juego de caracteres, el color de las fichas, el orden y el brillo.`,
      en: `An airport departure board: letters flip like tiles until they spell the words, in a cycle or just once. You choose the character set, tile colour, order and glare.`,
    },
    cuando: {
      es: `Para una cifra, una ciudad o un estado que cambia, en una web con aire de viajes, de datos o retro. Una palabra corta cada vez.`,
      en: `For a figure, a city or a status that changes, on a site with a travel, data or retro feel. One short word at a time.`,
    },
    cuidado: {
      es: `Comprueba qué lee un lector de pantalla mientras las fichas giran y deja el texto final accesible en el HTML.`,
      en: `Check what a screen reader announces while the tiles flip and keep the final text accessible in the HTML.`,
    },
    a11y: {
      es: `Cuida mucho el movimiento reducido: nueve referencias en el código, más que ninguna de las que analizamos aquí. Lleva una sola etiqueta aria.`,
      en: `It cares a lot about reduced motion: nine references in the code, more than any of the ones we analyse here. It carries a single aria label.`,
    },
    prompt: {
      es: `Usa SplitFlapText de React Bits para mostrar el estado de un despliegue, con palabras cortas en mayúsculas. Pon el texto final también como texto visible o con aria-live polite, y con prefers-reduced-motion que cambie sin giro.`,
      en: `Use SplitFlapText from React Bits to show a deployment status, with short uppercase words. Put the final text also as visible text or with aria-live polite, and with prefers-reduced-motion let it change without the flip.`,
    },
  }),

  // ---------------------------------------------------------------- Interfaz
  rb({
    key: 'profileCard',
    id: 'ProfileCard',
    ruta: 'components/profile-card',
    group: 'ui',
    name: 'Profile Card',
    labels: ['DOM', 'CSS 3D'],
    deps: ['@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 20.9,
    tag: { es: `tarjeta de perfil con inclinación y brillo holográfico`, en: `profile card with tilt and a holographic sheen` },
    desc: {
      es: `Una tarjeta de perfil con inclinación 3D, brillo holográfico, parallax y avatar. En móvil se inclina con el giroscopio. Se le pasan el nombre, el cargo, el usuario, el estado y el botón de contacto.`,
      en: `A profile card with 3D tilt, holographic sheen, parallax and avatar. On mobile it tilts with the gyroscope. You give it a name, title, handle, status and a contact button.`,
    },
    cuando: {
      es: `Para presentar a una persona o a un equipo en una web de portfolio. Con una o pocas tarjetas: llama la atención y gasta.`,
      en: `For introducing a person or a team on a portfolio site. With one or a few cards: it is eye-catching and not free.`,
    },
    cuidado: {
      es: `Trae dos paquetes de iconos solo para pintar un sobre de correo: @hugeicons/core-free-icons pesa unos 80 MB instalado (se reparte por iconos, pero la instalación es la que es). Cambia el icono por uno que ya tengas.`,
      en: `It brings two icon packages just to draw an envelope: @hugeicons/core-free-icons is about 80 MB installed (it ships per icon, but the install is what it is). Swap the icon for one you already have.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema y trae textos alternativos. En iOS pide el permiso del sensor de orientación, como debe.`,
      en: `It respects the system reduced-motion setting and carries alt texts. On iOS it asks for the orientation sensor permission, as it should.`,
    },
    prompt: {
      es: `Haz una tarjeta de perfil con ProfileCard de React Bits para la sección Sobre mí, con mi foto servida en local. Cambia el icono de correo por uno de la librería de iconos que ya uso, para no instalar @hugeicons, y desactiva la inclinación con prefers-reduced-motion.`,
      en: `Build a profile card with ProfileCard from React Bits for the About section, with my photo served locally. Swap the mail icon for one from the icon library I already use, so @hugeicons is not installed, and turn the tilt off with prefers-reduced-motion.`,
    },
  }),
  rb({
    key: 'reflectiveCard',
    id: 'ReflectiveCard',
    ruta: 'components/reflective-card',
    group: 'ui',
    name: 'Reflective Card',
    labels: ['WebGL'],
    deps: ['@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 39.9,
    pausa: true,
    tag: { es: `carta de identidad metálica con reflejos`, en: `metallic ID card with reflections` },
    desc: {
      es: `Una carta de identidad con acabado metálico y reflejos hechos con un shader. Puede usar un vídeo, o la cámara del usuario, como superficie reflectante, y se inclina con el ratón.`,
      en: `An ID card with a metallic finish and shader-made reflections. It can use a video, or the user's camera, as the reflective surface, and it tilts with the mouse.`,
    },
    cuando: {
      es: `Para un acceso, un pase o una credencial en la demo de un producto. Con un vídeo propio como reflejo, no con la cámara.`,
      en: `For an access pass or credential in a product demo. With your own video as the reflection, not the camera.`,
    },
    cuidado: {
      es: `La opción webcam pide permiso de cámara al navegador: en una web que promete no rastrear a nadie, solo como demo explícita y apagada por defecto. Pesa 39,9 KB y lleva dos paquetes de iconos.`,
      en: `The webcam option asks the browser for camera permission: on a site that promises not to track anyone, only as an explicit demo, off by default. It is 39.9 KB and brings two icon packages.`,
    },
    a11y: {
      es: `Respeta el movimiento reducido del sistema. No trae soporte de teclado: es una pieza para mirar, no para manejar.`,
      en: `It respects the system reduced-motion setting. It has no keyboard support: it is a piece to look at, not to operate.`,
    },
    prompt: {
      es: `Muestra una credencial con ReflectiveCard de React Bits usando un vídeo propio como reflejo. No actives la prop webcam. Que se detenga fuera de pantalla y que con prefers-reduced-motion sea una tarjeta estática.`,
      en: `Show a credential with ReflectiveCard from React Bits using my own video as the reflection. Do not enable the webcam prop. It should stop off screen and, with prefers-reduced-motion, be a static card.`,
    },
  }),
  rb({
    key: 'logoLoop',
    id: 'LogoLoop',
    ruta: 'animations/logo-loop',
    group: 'ui',
    name: 'Logo Loop',
    labels: ['DOM'],
    deps: [],
    kb: 43.2,
    pausa: true,
    tag: { es: `cinta infinita de logos`, en: `infinite logo ribbon` },
    desc: {
      es: `Una cinta infinita de logos con cuatro disposiciones (recta, ola, arco y órbita), arrastre, aceleración con el scroll, etiquetas y desvanecido en los bordes. Se le pasan imágenes o nodos de React.`,
      en: `An infinite ribbon of logos with four layouts (line, wave, arc and orbit), dragging, scroll boost, labels and edge fade. You pass it images or React nodes.`,
    },
    cuando: {
      es: `Para una franja de «hecho con» o «lo usan», si es verdad. Está bien cuidada en accesibilidad.`,
      en: `For a "built with" or "used by" strip, as long as it is true. It is well cared for on accessibility.`,
    },
    cuidado: {
      es: `Pesa 43 KB de fuente, mucho para una cinta: si solo necesitas un marquee recto, basta una versión de CSS de veinte líneas. Cada logo necesita su texto alternativo.`,
      en: `It is 43 KB of source, a lot for a ribbon: if you only need a straight marquee, a twenty-line CSS version is enough. Each logo needs its own alt text.`,
    },
    a11y: {
      es: `Bien cuidada: nueve señales aria, tres etiquetas, soporte de teclado, un ariaLabel propio y movimiento reducido. Se detiene fuera de pantalla.`,
      en: `Well cared for: nine aria signals, three labels, keyboard support, its own ariaLabel and reduced motion. It stops off screen.`,
    },
    prompt: {
      es: `Pon una franja de logos con LogoLoop de React Bits en la disposición recta, solo con logos de proyectos o herramientas que sean reales. Cada logo con su alt, pausa al pasar el ratón y quieto con prefers-reduced-motion. Si la cinta es recta y nada más, valora una versión de CSS puro antes de instalar 43 KB.`,
      en: `Add a logo strip with LogoLoop from React Bits in the straight layout, only with logos of projects or tools that are real. Each logo with its alt, pause on hover and still with prefers-reduced-motion. If the ribbon is straight and nothing more, consider a pure CSS version before installing 43 KB.`,
    },
  }),
  rb({
    key: 'accordionGallery',
    id: 'AccordionGallery',
    ruta: 'components/accordion-gallery',
    group: 'ui',
    name: 'Accordion Gallery',
    labels: ['DOM'],
    deps: ['gsap'],
    kb: 9.8,
    tag: { es: `galería de paneles que se abren`, en: `gallery of panels that open` },
    desc: {
      es: `Una galería de paneles que se abren al pasar el ratón o al hacer clic, en horizontal o en vertical, con parallax e inclinación. Cada panel lleva imagen, etiqueta y enlace.`,
      en: `A gallery of panels that expand on hover or click, horizontally or vertically, with parallax and tilt. Each panel has an image, a label and a link.`,
    },
    cuando: {
      es: `Para enseñar entre cuatro y seis proyectos, destinos o productos con foto, ocupando poco alto. Con fotos buenas: sin ellas no tiene gracia.`,
      en: `To show four to six projects, destinations or products with photos, taking little height. With good photos: without them it has no charm.`,
    },
    cuidado: {
      es: `Trae cinco fotos de ejemplo cargadas desde picsum.photos: si no las cambias, tu web pide imágenes a un tercero. Y depende de GSAP, que no es MIT.`,
      en: `It ships five sample photos loaded from picsum.photos: if you do not replace them, your site requests images from a third party. And it depends on GSAP, which is not MIT.`,
    },
    a11y: {
      es: `De las mejor cuidadas: siete señales aria, tres etiquetas, soporte de teclado y movimiento reducido.`,
      en: `One of the best cared for: seven aria signals, three labels, keyboard support and reduced motion.`,
    },
    prompt: {
      es: `Haz una galería con AccordionGallery de React Bits con mis cinco proyectos, con imágenes locales (sin picsum.photos) y un enlace real en cada panel. Que se abra también con el teclado y con prefers-reduced-motion sin animación. Dime que usa GSAP, que no es MIT, antes de instalarlo.`,
      en: `Build a gallery with AccordionGallery from React Bits with my five projects, with local images (no picsum.photos) and a real link on each panel. It should open with the keyboard too and, with prefers-reduced-motion, without animation. Tell me it uses GSAP, which is not MIT, before installing it.`,
    },
  }),

  // ---------------------------------------------------------------- Micro-interacciones
  rb({
    key: 'thoughtLine',
    id: 'ThoughtLine',
    ruta: 'micro/thought-line',
    group: 'micro',
    name: 'Thought Line',
    labels: ['DOM'],
    deps: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 13.7,
    tag: { es: `la línea de «pensando…» de un agente`, en: `an agent's "thinking…" line` },
    desc: {
      es: `La línea de «pensando…» de un agente de IA: un texto que respira con un brillo, pasos que se pliegan al terminar y un temporizador. Se le dice cuándo ha terminado y avisa con la duración.`,
      en: `An AI agent's "thinking…" line: text that breathes with a shimmer, steps that fold away when it is done and a timer. You tell it when it has finished and it reports the duration.`,
    },
    cuando: {
      es: `En cualquier interfaz con un agente o con un proceso largo, justo donde hoy se pone un spinner. Es de las más útiles para quien construye con agentes.`,
      en: `In any interface with an agent or a long-running process, exactly where a spinner goes today. It is among the most useful for anyone building with agents.`,
    },
    cuidado: {
      es: `Entre sus glifos hay uno de chispas (SparklesIcon), el distintivo de «IA» que ya cansa a mucha gente: elige otro con la prop glyph.`,
      en: `Among its glyphs is a sparkles one (SparklesIcon), the "AI" badge many people are tired of: pick another with the glyph prop.`,
    },
    a11y: {
      es: `Ocho señales aria y movimiento reducido.`,
      en: `Eight aria signals and reduced motion.`,
    },
    prompt: {
      es: `Cambia el spinner de mi chat con un agente por ThoughtLine de React Bits, con los pasos reales que reporta el agente y no inventados. Que se pliegue al terminar y muestre la duración, con un glifo que no sea de chispas y sin brillo con prefers-reduced-motion.`,
      en: `Replace the spinner in my chat with an agent with ThoughtLine from React Bits, using the real steps the agent reports and not made-up ones. It should fold when done and show the duration, with a glyph that is not sparkles and no shimmer with prefers-reduced-motion.`,
    },
  }),
  rb({
    key: 'statusMark',
    id: 'StatusMark',
    ruta: 'micro/status-mark',
    group: 'micro',
    name: 'Status Mark',
    labels: ['SVG'],
    deps: ['motion'],
    kb: 9.4,
    tag: { es: `marca de estado que dibuja su trazo`, en: `status mark that draws its stroke` },
    desc: {
      es: `Una marca de estado que dibuja su propio trazo: pendiente, en curso, hecho, fallido o cancelado, con progreso y un tachado opcional. Sirve para una lista de tareas o para los pasos de un proceso.`,
      en: `A status mark that draws its own stroke: pending, running, done, failed or cancelled, with progress and an optional strike-through. It suits a task list or the steps of a process.`,
    },
    cuando: {
      es: `En una lista de pasos o de tareas: instalación, despliegue, comprobaciones. Sustituye a un spinner genérico y a un check suelto.`,
      en: `In a list of steps or tasks: install, deploy, checks. It replaces a generic spinner and a loose checkmark.`,
    },
    cuidado: {
      es: `Poco que objetar: pequeña, de SVG y con una dependencia. Comprueba que el estado también se dice con palabras y no solo con el trazo.`,
      en: `Little to object to: small, SVG, one dependency. Check that the state is also said in words and not only by the stroke.`,
    },
    a11y: {
      es: `Cuatro señales aria y movimiento reducido (seis referencias en el código).`,
      en: `Four aria signals and reduced motion (six references in the code).`,
    },
    prompt: {
      es: `Usa StatusMark de React Bits en la lista de pasos del despliegue: en curso, hecho y fallido. El estado debe estar también como texto visible o con aria-label, y con prefers-reduced-motion el trazo aparece ya dibujado.`,
      en: `Use StatusMark from React Bits in the deployment steps list: running, done and failed. The state must also be present as visible text or an aria-label, and with prefers-reduced-motion the stroke appears already drawn.`,
    },
  }),
  rb({
    key: 'slideCommit',
    id: 'SlideCommit',
    ruta: 'micro/slide-commit',
    group: 'micro',
    name: 'Slide Commit',
    labels: ['DOM'],
    deps: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 16.4,
    tag: { es: `desliza para confirmar una acción`, en: `slide to confirm an action` },
    desc: {
      es: `Un control de «desliza para confirmar» con acción asíncrona: muestra el estado de éxito o de error y rebota al soltar. Se le pasa onConfirm, que puede devolver una promesa.`,
      en: `A "slide to confirm" control with an async action: it shows success or error state and bounces back when released. You pass it onConfirm, which can return a promise.`,
    },
    cuando: {
      es: `Para acciones que no se deshacen: pagar, borrar, publicar. Pide un gesto deliberado, no un clic que se escapa.`,
      en: `For actions that cannot be undone: pay, delete, publish. It asks for a deliberate gesture, not a stray click.`,
    },
    cuidado: {
      es: `Un deslizador solo con puntero deja fuera a quien no puede arrastrar. Este trae teclado, pero comprueba que de verdad confirma con él y que existe otra vía visible.`,
      en: `A pointer-only slider leaves out anyone who cannot drag. This one has keyboard support, but check that it really confirms with it and that another visible route exists.`,
    },
    a11y: {
      es: `De las mejor cuidadas: quince señales aria, teclado y movimiento reducido.`,
      en: `One of the best cared for: fifteen aria signals, keyboard and reduced motion.`,
    },
    prompt: {
      es: `Protege la acción de borrar proyecto con SlideCommit de React Bits, con un onConfirm que llame a la API y muestre el error si falla. Debe poder confirmarse con el teclado y tener otra vía visible, y con prefers-reduced-motion sin rebote.`,
      en: `Protect the delete project action with SlideCommit from React Bits, with an onConfirm that calls the API and shows the error if it fails. It must be confirmable with the keyboard and have another visible route, and with prefers-reduced-motion no bounce.`,
    },
  }),
  rb({
    key: 'rubberSegment',
    id: 'RubberSegment',
    ruta: 'micro/rubber-segment',
    group: 'micro',
    name: 'Rubber Segment',
    labels: ['DOM'],
    deps: ['motion'],
    kb: 14.6,
    tag: { es: `selector segmentado con pieza de goma`, en: `segmented control with a rubbery thumb` },
    desc: {
      es: `Un control segmentado cuya pieza activa se estira y se aplasta como si fuera de goma al cambiar de opción. Se puede arrastrar y todas las opciones pueden tener el mismo ancho.`,
      en: `A segmented control whose active thumb stretches and squashes like rubber when you change option. It can be dragged and all options can share the same width.`,
    },
    cuando: {
      es: `Para alternar entre dos y cuatro vistas del mismo contenido (lista y rejilla, mes y semana), en una interfaz que ya sea juguetona.`,
      en: `To switch between two and four views of the same content (list and grid, month and week), in an interface that is already playful.`,
    },
    cuidado: {
      es: `Es un control segmentado en píldora: si tu interfaz usa pestañas de texto con una raya debajo, es otro lenguaje y mezclarlos se nota.`,
      en: `It is a pill-shaped segmented control: if your interface uses text tabs with an underline, it is a different language and mixing them shows.`,
    },
    a11y: {
      es: `Diez señales aria, tres etiquetas, teclado y movimiento reducido. Pide un aria-label para el grupo.`,
      en: `Ten aria signals, three labels, keyboard and reduced motion. It takes an aria-label for the group.`,
    },
    prompt: {
      es: `Haz el selector de vista (lista o rejilla) con RubberSegment de React Bits, con aria-label en el grupo y control por teclado con las flechas. Con prefers-reduced-motion que la pieza se mueva sin estirarse.`,
      en: `Build the view selector (list or grid) with RubberSegment from React Bits, with an aria-label on the group and arrow-key control. With prefers-reduced-motion the thumb should move without stretching.`,
    },
  }),
  rb({
    key: 'pulseHeart',
    id: 'PulseHeart',
    ruta: 'micro/pulse-heart',
    group: 'micro',
    name: 'Pulse Heart',
    labels: ['DOM'],
    deps: ['@hugeicons/core-free-icons'],
    kb: 11.7,
    tag: { es: `botón de «me gusta» con latido`, en: `a like button with a heartbeat` },
    desc: {
      es: `Un botón de «me gusta» con un latido al activarse y un contador que gira como un rodillo. Hay variantes de icono (corazón, estrella y pulgar) y se puede usar controlado o no.`,
      en: `A like button with a heartbeat when activated and a counter that rolls like a drum. There are icon variants (heart, star and thumbs-up) and it can be used controlled or uncontrolled.`,
    },
    cuando: {
      es: `Donde la gente pueda de verdad marcar algo: favoritos, valoraciones rápidas. No como decoración.`,
      en: `Where people can really mark something: favourites, quick ratings. Not as decoration.`,
    },
    cuidado: {
      es: `Un «me gusta» que no guarda nada es una mentira con animación: conéctalo a un estado real antes de enseñarlo.`,
      en: `A like that saves nothing is a lie with an animation: wire it to real state before showing it.`,
    },
    a11y: {
      es: `Movimiento reducido (siete referencias en el código), tres señales aria y teclado.`,
      en: `Reduced motion (seven references in the code), three aria signals and keyboard.`,
    },
    prompt: {
      es: `Añade PulseHeart de React Bits como botón de favoritos de cada ficha, guardando el estado en el navegador o en tu base de datos y con el contador real. Comprueba que expone aria-pressed y que con prefers-reduced-motion no late.`,
      en: `Add PulseHeart from React Bits as the favourites button on each card, saving the state in the browser or in your database and with the real counter. Check that it exposes aria-pressed and that with prefers-reduced-motion it does not beat.`,
    },
  }),
  rb({
    key: 'peekRating',
    id: 'PeekRating',
    ruta: 'micro/peek-rating',
    group: 'micro',
    name: 'Peek Rating',
    labels: ['DOM'],
    deps: ['@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 12.6,
    tag: { es: `valoración que asoma una etiqueta`, en: `a rating that peeks a label` },
    desc: {
      es: `Una valoración con estrellas, corazones o rayos que se levantan al pasar el ratón y dejan asomar una etiqueta con la nota. Admite borrar la nota, un modo de solo lectura y etiquetas propias.`,
      en: `A rating with stars, hearts or bolts that lift on hover and let a label with the score peek out. It allows clearing the score, a read-only mode and custom labels.`,
    },
    cuando: {
      es: `Para pedir una nota de 1 a 5 de forma amable, o para enseñar la media de algo en modo solo lectura.`,
      en: `To ask for a 1 to 5 score in a friendly way, or to show the average of something in read-only mode.`,
    },
    cuidado: {
      es: `Enseñar una media que nadie ha votado es inventar un dato. En modo readOnly pon cifras reales o no lo muestres.`,
      en: `Showing an average nobody voted for is inventing data. In readOnly mode use real figures or do not show it.`,
    },
    a11y: {
      es: `Nueve señales aria, teclado, modo de solo lectura y movimiento reducido (seis referencias en el código).`,
      en: `Nine aria signals, keyboard, read-only mode and reduced motion (six references in the code).`,
    },
    prompt: {
      es: `Añade PeekRating de React Bits a la ficha de cada recurso para que quien la use deje una nota del 1 al 5, guardada de verdad. Si muestras la media, solo con votos reales. Que se maneje con el teclado y con prefers-reduced-motion sin levantar.`,
      en: `Add PeekRating from React Bits to each resource card so users can leave a 1 to 5 score, really saved. If you show the average, only with real votes. It should work with the keyboard and, with prefers-reduced-motion, without the lift.`,
    },
  }),
  rb({
    key: 'holdButton',
    id: 'HoldButton',
    ruta: 'micro/hold-button',
    group: 'micro',
    name: 'Hold Button',
    labels: ['DOM'],
    deps: [],
    kb: 14.8,
    tag: { es: `botón que hay que mantener pulsado`, en: `a button you have to hold down` },
    desc: {
      es: `Un botón que se rellena con una onda mientras lo mantienes pulsado y confirma al completarse. El toque corto hace otra cosa (onTap), y se elige hacia dónde se rellena y cuánto tarda.`,
      en: `A button that fills with a wave while you hold it and confirms when it completes. A short tap does something else (onTap), and you choose which way it fills and how long it takes.`,
    },
    cuando: {
      es: `Para acciones destructivas o que cuestan dinero, donde preguntar «¿seguro?» no basta. Sin diálogos de por medio.`,
      en: `For destructive or costly actions, where asking "are you sure?" is not enough. No dialogs in between.`,
    },
    cuidado: {
      es: `Mantener pulsado exige pulso firme: da siempre otra vía de confirmar para quien no pueda. Y dile al usuario que hay que mantener, porque nadie lo adivina.`,
      en: `Holding demands a steady hand: always provide another way to confirm for anyone who cannot. And tell the user they have to hold, because nobody guesses it.`,
    },
    a11y: {
      es: `Cinco señales aria y teclado. El movimiento reducido aparece con una sola referencia: comprueba que la onda también se apaga.`,
      en: `Five aria signals and keyboard. Reduced motion appears with a single reference: check that the wave also switches off.`,
    },
    prompt: {
      es: `Usa HoldButton de React Bits para «Eliminar cuenta», con holdTime de un segundo y medio y un texto que diga «Mantén pulsado». Debe poder completarse con el teclado y existir otra vía de confirmar, y con prefers-reduced-motion sin onda.`,
      en: `Use HoldButton from React Bits for "Delete account", with a holdTime of one and a half seconds and a text that says "Hold to confirm". It must be completable with the keyboard and another way to confirm must exist, and with prefers-reduced-motion no wave.`,
    },
  }),
  rb({
    key: 'fuseButton',
    id: 'FuseButton',
    ruta: 'micro/fuse-button',
    group: 'micro',
    name: 'Fuse Button',
    labels: ['DOM'],
    deps: ['@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 13.8,
    tag: { es: `botón con mecha de deshacer`, en: `a button with an undo fuse` },
    desc: {
      es: `Un botón con una mecha de deshacer: la acción se confirma sola cuando acaba una cuenta atrás visible, y se puede deshacer mientras tanto. Se elige dónde va la mecha, cuánto dura y si se pausa al pasar el ratón.`,
      en: `A button with an undo fuse: the action commits on its own when a visible countdown ends, and you can undo it meanwhile. You choose where the fuse sits, how long it lasts and whether it pauses on hover.`,
    },
    cuando: {
      es: `Para acciones que sí se pueden deshacer: archivar, enviar, mover. Deshacer es mejor que preguntar «¿seguro?»: no interrumpe a quien acertó.`,
      en: `For actions that can be undone: archive, send, move. Undo beats asking "are you sure?": it does not interrupt the person who got it right.`,
    },
    cuidado: {
      es: `La acción ocurre sola al acabar la cuenta: que el deshacer sea de verdad (que revierta) y no solo un botón. Y no lo uses para algo que no se pueda revertir.`,
      en: `The action fires on its own when the countdown ends: make the undo real (it must revert) and not just a button. And do not use it for anything irreversible.`,
    },
    a11y: {
      es: `Nueve señales aria, teclado y movimiento reducido. Una cuenta atrás que confirma sola es difícil para quien necesita más tiempo: comprueba que se pausa con el foco y no solo con el ratón.`,
      en: `Nine aria signals, keyboard and reduced motion. A countdown that commits on its own is hard for anyone who needs more time: check that it pauses on focus and not only on hover.`,
    },
    prompt: {
      es: `Usa FuseButton de React Bits para «Archivar», con una ventana de deshacer de cinco segundos y un onUndo que revierta de verdad. Que la cuenta atrás se pause con el foco del teclado y que con prefers-reduced-motion se vea sin animación.`,
      en: `Use FuseButton from React Bits for "Archive", with a five-second undo window and an onUndo that really reverts. The countdown should pause on keyboard focus and, with prefers-reduced-motion, show without animation.`,
    },
  }),
  rb({
    key: 'codeSlots',
    id: 'CodeSlots',
    ruta: 'micro/code-slots',
    group: 'micro',
    name: 'Code Slots',
    labels: ['DOM'],
    deps: ['motion', '@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 17.9,
    tag: { es: `campo de código de un solo uso en casillas`, en: `one-time code field in slots` },
    desc: {
      es: `Un campo de código de un solo uso en casillas, con rebote al escribir, máscara opcional y estados de error y de éxito. Declara autocomplete one-time-code y gestiona el pegado de un código entero.`,
      en: `A one-time code field in slots, with a bounce as you type, optional masking and error and success states. It declares autocomplete one-time-code and handles pasting a whole code.`,
    },
    cuando: {
      es: `Para verificar un correo, un teléfono o un segundo factor. Es justo la pantalla donde una mala experiencia hace perder a la gente.`,
      en: `To verify an email, a phone or a second factor. It is exactly the screen where a bad experience loses people.`,
    },
    cuidado: {
      es: `Lo difícil de estos campos (el autocompletado del móvil, pegar el código entero) ya viene resuelto. Lo que falta es lo tuyo: validar el código en el servidor, con límite de intentos.`,
      en: `The hard parts of these fields (mobile autofill, pasting the whole code) already come solved. What is left is yours: validate the code on the server, with an attempt limit.`,
    },
    a11y: {
      es: `De las mejores: siete señales aria, teclado, autocompletado de código de un solo uso y movimiento reducido.`,
      en: `One of the best: seven aria signals, keyboard, one-time-code autofill and reduced motion.`,
    },
    prompt: {
      es: `Haz la pantalla de verificación con CodeSlots de React Bits para un código de seis dígitos. El código se valida en el servidor con un límite de intentos y nunca en el cliente, y el campo debe aceptar pegar y el autocompletado del móvil.`,
      en: `Build the verification screen with CodeSlots from React Bits for a six-digit code. The code is validated on the server with an attempt limit and never on the client, and the field must accept pasting and mobile autofill.`,
    },
  }),
  rb({
    key: 'branchedMenu',
    id: 'BranchedMenu',
    ruta: 'micro/branched-menu',
    group: 'micro',
    name: 'Branched Menu',
    labels: ['DOM', 'SVG'],
    deps: ['@hugeicons/react', '@hugeicons/core-free-icons'],
    kb: 10.9,
    tag: { es: `menú en árbol con ramas dibujadas`, en: `tree menu with drawn branches` },
    desc: {
      es: `Un menú en árbol con ramas que se dibujan y se pliegan al abrir y cerrar cada grupo. Se configuran el sangrado, el grosor de la línea y la velocidad, y avisa de qué opción se elige.`,
      en: `A tree menu whose branches draw themselves and fold as each group opens and closes. Indentation, line width and speed are configurable, and it reports which option is picked.`,
    },
    cuando: {
      es: `Para la navegación de unas docs o de un árbol de archivos, con dos niveles. Con muchos más niveles deja de leerse bien.`,
      en: `For docs navigation or a file tree, two levels deep. With many more levels it stops reading well.`,
    },
    cuidado: {
      es: `Es solo un menú: la ruta y el enlace de cada opción los pones tú. Si cada opción es una página, usa enlaces reales y no solo onSelect, o un buscador no llega a ellas.`,
      en: `It is only a menu: the route and the link for each option are yours. If each option is a page, use real links and not just onSelect, or a search engine will not reach them.`,
    },
    a11y: {
      es: `Seis señales aria, teclado y movimiento reducido.`,
      en: `Six aria signals, keyboard and reduced motion.`,
    },
    prompt: {
      es: `Haz la navegación lateral de la documentación con BranchedMenu de React Bits, con dos niveles y enlaces reales (a href) en cada opción, no solo onSelect. Que se maneje con el teclado y con prefers-reduced-motion se pliegue sin dibujar la rama.`,
      en: `Build the docs sidebar navigation with BranchedMenu from React Bits, two levels deep and with real links (a href) on each option, not just onSelect. It should work with the keyboard and, with prefers-reduced-motion, fold without drawing the branch.`,
    },
  }),
]
