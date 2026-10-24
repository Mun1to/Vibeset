// Piezas PROPIAS escritas desde cero que hacen algo parecido a una de React Bits.
//
// Qué son y qué NO son. Son código de la casa, MIT, escrito sin abrir el fuente de
// React Bits (que su licencia, MIT con Commons Clause, no deja copiar ni portar: ver
// LICENSING.md y componentsRef.js). Con otro nombre y otras props, a propósito: que
// hagan algo parecido no las convierte en una versión portada, y que se llamen
// distinto evita insinuar que son suyas.
//
// `original` es la clave de su ficha de análisis en componentsRef.js. Cuando una
// pieza propia existe, esa ficha deja de ser una tarjeta aparte y pasa a ser un
// apartado de la ficha de la pieza («Y el original de React Bits»), así que cada
// efecto sale UNA vez en la rejilla, con su demo en vivo. Mientras no esté
// construida, la tarjeta de análisis sigue donde estaba.
//
// Una pieza se da por construida cuando se ha visto funcionando (pantalla, ratón,
// teclado, claro y oscuro) y no solo compilando; el cómo se comprobó cada una está
// en el historial de commits.
export const PROPIOS_NUEVOS = [
  {
    key: 'textoDestello',
    group: 'texto',
    origin: 'propio',
    clase: 'pieza',
    component: 'TextoDestello',
    original: 'shinyText',
    name: 'Texto con destello',
    nameEn: 'Shimmer text',
    url: null,
    install: null,
    deps: [],
    labels: ['CSS', 'sin dependencias', 'se pausa fuera de pantalla'],
    tag: {
      es: 'un destello que cruza las letras, hecho con el fondo del texto',
      en: 'a glint that crosses the letters, made from the text background',
    },
    desc: {
      es: 'El destello no es un elemento: es el fondo del texto. Las letras se pintan transparentes, detrás va un degradado y background-clip: text lo recorta con su forma, así que moverlo es mover una posición de fondo y lo hace el navegador sin un solo fotograma de JavaScript. Tres cosas que se pierden al copiarlo de memoria: el degradado se repite, porque con no-repeat el texto desaparece en cuanto la banda se aparta; la banda sale entera del texto antes de volver, calculado con su ancho y su ángulo; y con colores forzados se vuelve al color del sistema, porque sin fondo un texto transparente es un texto invisible.',
      en: 'The glint is not an element: it is the text background. The letters are painted transparent, a gradient sits behind them and background-clip: text cuts it to their shape, so moving it means moving a background position, which the browser does without a single frame of JavaScript. Three things people lose when copying from memory: the gradient repeats, because with no-repeat the text disappears the moment the band moves away; the band leaves the text completely before coming back, worked out from its width and angle; and under forced colours it falls back to the system colour, because without a background transparent text is invisible text.',
    },
    defaults: {
      color: '#9aa0aa', destello: '#ffffff', velocidad: 3, angulo: 105, ancho: 0.3, disparo: 'bucle', gain: 1,
    },
    controls: [
      {
        key: 'disparo', type: 'select', label: { es: 'Se dispara', en: 'Fires' },
        options: [
          { value: 'bucle', label: { es: 'En bucle', en: 'Looping' } },
          { value: 'hover', label: { es: 'Al pasar el ratón', en: 'On hover' } },
          { value: 'vista', label: { es: 'Al entrar en pantalla', en: 'When it enters view' } },
        ],
      },
      { key: 'velocidad', type: 'range', min: 1, max: 8, step: 0.25, label: { es: 'Duración del barrido (s)', en: 'Sweep length (s)' } },
      { key: 'angulo', type: 'range', min: 60, max: 150, step: 5, label: { es: 'Ángulo', en: 'Angle' } },
      { key: 'ancho', type: 'range', min: 0.1, max: 0.6, step: 0.05, label: { es: 'Ancho del destello', en: 'Glint width' } },
      { key: 'color', type: 'color', label: { es: 'Color base', en: 'Base colour' } },
      { key: 'destello', type: 'color', label: { es: 'Color del destello', en: 'Glint colour' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
  {
    key: 'contadorSube',
    group: 'texto',
    origin: 'propio',
    clase: 'pieza',
    component: 'ContadorSube',
    original: 'countUp',
    name: 'Contador que sube',
    nameEn: 'Rising counter',
    url: null,
    install: null,
    deps: [],
    labels: ['rAF', 'sin dependencias', 'lectores de pantalla'],
    tag: {
      es: 'sube hasta su cifra sin mover la página ni marear al lector',
      en: 'climbs to its figure without moving the page or confusing the reader',
    },
    desc: {
      es: 'Lo difícil de un contador no es contar, es que cuente sin estorbar. El número que sube se escribe directamente en el nodo y no pasa por el estado de React: son sesenta cambios por segundo y repintar un árbol por cada uno es un precio absurdo. El valor final vive siempre en el DOM, en un texto transparente que reserva el ancho justo, así que la página no se mueve mientras sube y un lector de pantalla oye «83» y no «17, 31, 52». La curva baja de golpe y se posa despacio: una subida lineal parece una barra de carga.',
      en: 'The hard part of a counter is not counting, it is counting without getting in the way. The rising number is written straight to the node and never goes through React state: that is sixty changes a second, and repainting a tree for each one is an absurd price. The final value always lives in the DOM, in transparent text that reserves exactly the right width, so the page does not move while it climbs and a screen reader hears "83", not "17, 31, 52". The curve drops fast and settles slowly: a linear climb looks like a loading bar.',
    },
    defaults: { duracion: 2, decimales: 0, disparo: 'vista', repetirAlPasar: false, gain: 1 },
    controls: [
      { key: 'duracion', type: 'range', min: 0.5, max: 6, step: 0.25, label: { es: 'Duración (s)', en: 'Duration (s)' } },
      { key: 'decimales', type: 'range', min: 0, max: 2, step: 1, label: { es: 'Decimales', en: 'Decimals' } },
      {
        key: 'disparo', type: 'select', label: { es: 'Arranca', en: 'Starts' },
        options: [
          { value: 'vista', label: { es: 'Al entrar en pantalla', en: 'When it enters view' } },
          { value: 'carga', label: { es: 'Al cargar', en: 'On load' } },
        ],
      },
      { key: 'repetirAlPasar', type: 'bool', label: { es: 'Repetir cada vez que entra', en: 'Replay every time it enters' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
  {
    key: 'focoPalabras',
    group: 'texto',
    origin: 'propio',
    clase: 'pieza',
    component: 'FocoPalabras',
    original: 'trueFocus',
    name: 'Frase con foco',
    nameEn: 'Focus sentence',
    url: null,
    install: null,
    deps: [],
    labels: ['DOM', 'sin dependencias', 'teclado'],
    tag: {
      es: 'un marcador viaja de palabra en palabra y desenfoca el resto',
      en: 'a marker travels word to word and blurs the rest',
    },
    desc: {
      es: 'La frase es texto normal, palabra a palabra con su espacio: desenfocar es un filtro visual y quien no ve lee la frase entera, de corrido. El marcador no se dibuja con una cuenta, se mide: cada palabra sabe dónde está y cuánto ocupa, así que funciona con cualquier fuente y con la frase partida en varias líneas, y se vuelve a medir cuando cambia el ancho de la caja o llegan las fuentes. Las transiciones se encienden después de colocarlo la primera vez, o el marcador nace en la esquina y cruza la frase volando. En modo manual tiene una sola parada de tabulador y se maneja con las flechas.',
      en: 'The sentence is plain text, word by word with its space: blurring is a visual filter, so anyone who cannot see it reads the whole sentence straight through. The marker is not drawn from a calculation, it is measured: every word knows where it is and how big it is, so it works with any font and with the sentence broken over several lines, and it is measured again when the box width changes or the fonts arrive. Transitions are switched on after the first placement, or the marker is born in the corner and flies across the sentence. In manual mode it has a single tab stop and is driven with the arrow keys.',
    },
    defaults: { marco: 'esquinas', pausa: 1.4, desenfoque: 4, color: '#60a5fa', manual: false, gain: 1 },
    controls: [
      {
        key: 'marco', type: 'select', label: { es: 'Marcador', en: 'Marker' },
        options: [
          { value: 'esquinas', label: { es: 'Esquinas', en: 'Corners' } },
          { value: 'caja', label: { es: 'Caja', en: 'Box' } },
          { value: 'subrayado', label: { es: 'Subrayado', en: 'Underline' } },
        ],
      },
      { key: 'pausa', type: 'range', min: 0.4, max: 4, step: 0.2, label: { es: 'Pausa en cada palabra (s)', en: 'Pause on each word (s)' } },
      { key: 'desenfoque', type: 'range', min: 0, max: 10, step: 0.5, label: { es: 'Desenfoque (px)', en: 'Blur (px)' } },
      { key: 'color', type: 'color', label: { es: 'Color del marcador', en: 'Marker colour' } },
      { key: 'manual', type: 'bool', label: { es: 'Lo manejo yo', en: 'I drive it' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
]
