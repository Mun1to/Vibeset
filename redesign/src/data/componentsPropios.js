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
  {
    key: 'marcaEstado',
    group: 'micro',
    origin: 'propio',
    clase: 'pieza',
    component: 'MarcaEstado',
    original: 'statusMark',
    name: 'Marca de estado',
    nameEn: 'Status mark',
    url: null,
    install: null,
    deps: [],
    labels: ['SVG', 'sin dependencias', 'lectores de pantalla'],
    tag: {
      es: 'el estado de un paso, dibujado y dicho con palabras',
      en: 'the state of a step, drawn and said in words',
    },
    desc: {
      es: 'Cinco estados (pendiente, en curso, hecho, fallo y cancelado) en un SVG que dibuja su trazo al pasar de uno a otro, en lugar de cambiar de icono de golpe. Lo que no se ve: el estado nunca se dice solo con el dibujo, porque un círculo verde con un tick no sirve a quien no ve el color. Cada marca lleva su palabra en un texto solo para lectores («Hecho», «En curso, 40 %»). Todos los trazos miden 1, así que dibujar un anillo, un tick o una cruz es la misma cuenta. Con porcentaje el anillo se llena; sin él gira un arco, que es lo honesto cuando no se sabe cuánto falta.',
      en: 'Five states (pending, running, done, failed and cancelled) in an SVG that draws its stroke as it moves from one to the next, rather than swapping icons abruptly. What you do not see: the state is never said by the drawing alone, because a green circle with a tick is no use to someone who cannot see colour. Each mark carries its word in a screen-reader-only text ("Done", "Running, 40 %"). Every stroke measures 1, so drawing a ring, a tick or a cross is the same sum. With a percentage the ring fills; without one an arc spins, which is the honest thing when you do not know how much is left.',
    },
    defaults: { tachado: false, tamano: 22, gain: 1, fallar: false },
    controls: [
      { key: 'tachado', type: 'bool', label: { es: 'Tachar lo hecho y lo cancelado', en: 'Strike through done and cancelled' } },
      { key: 'tamano', type: 'range', min: 16, max: 40, step: 2, label: { es: 'Tamaño (px)', en: 'Size (px)' } },
      { key: 'fallar', type: 'bool', soloDemo: true, label: { es: 'Que falle el cuarto paso', en: 'Make step four fail' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
  {
    key: 'botonMantener',
    group: 'micro',
    origin: 'propio',
    clase: 'pieza',
    component: 'BotonMantener',
    original: 'holdButton',
    name: 'Botón de mantener',
    nameEn: 'Hold button',
    url: null,
    install: null,
    deps: [],
    labels: ['DOM', 'sin dependencias', 'teclado'],
    tag: {
      es: 'se confirma manteniéndolo pulsado, sin cuadro de por medio',
      en: 'confirmed by holding it down, no dialog in between',
    },
    desc: {
      es: 'Para lo que no se puede deshacer o cuesta dinero, un «¿Seguro?» se contesta sin leerlo. Mantener pulsado un rato obliga a querer hacerlo: el gesto es la confirmación. El progreso lo lleva un requestAnimationFrame que escribe una variable de CSS, no el estado de React. Hay dos capas con el mismo rótulo, una sobre otra y la de arriba recortada hasta donde llega el relleno, así que el texto se lee siempre. Y tres cosas de uso: el toque corto avisa en vez de no hacer nada, la pista va enlazada para lectores de pantalla, y puede pintar una vía visible para confirmar sin mantener, porque mantener excluye a quien no tiene pulso firme.',
      en: 'For things that cannot be undone or that cost money, an "Are you sure?" gets answered without being read. Holding for a while forces you to mean it: the gesture is the confirmation. Progress is driven by a requestAnimationFrame that writes a CSS variable, not React state. There are two layers with the same label, one on top of the other with the top one clipped to where the fill has got to, so the text always reads. And three usage details: a short tap warns instead of doing nothing, the hint is linked for screen readers, and it can draw a visible route to confirm without holding, because holding excludes anyone without a steady hand.',
    },
    defaults: { duracion: 1.5, direccion: 'derecha', conAlternativa: true, gain: 1 },
    controls: [
      { key: 'duracion', type: 'range', min: 0.5, max: 4, step: 0.25, label: { es: 'Hay que mantener (s)', en: 'Hold time (s)' } },
      {
        key: 'direccion', type: 'select', label: { es: 'Se rellena hacia', en: 'Fills towards' },
        options: [
          { value: 'derecha', label: { es: 'La derecha', en: 'The right' } },
          { value: 'arriba', label: { es: 'Arriba', en: 'Up' } },
        ],
      },
      { key: 'conAlternativa', type: 'bool', soloDemo: true, label: { es: 'Mostrar la vía sin mantener', en: 'Show the no-hold route' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
  {
    key: 'deslizaConfirma',
    group: 'micro',
    origin: 'propio',
    clase: 'pieza',
    component: 'DeslizaConfirma',
    original: 'slideCommit',
    name: 'Desliza para confirmar',
    nameEn: 'Slide to confirm',
    url: null,
    install: null,
    deps: [],
    labels: ['DOM', 'sin dependencias', 'teclado', 'acción asíncrona'],
    tag: {
      es: 'arrastra un tirador hasta el final para confirmar y espera a la respuesta',
      en: 'drag a handle to the end to confirm, and wait for the answer',
    },
    desc: {
      es: 'Un clic suelto es poco para una acción que no se deshace: se da sin querer. Arrastrar un tirador hasta el otro extremo es un gesto con principio, trayecto y final, y deja un punto donde arrepentirse. La acción es asíncrona: onConfirmar puede devolver una promesa y el control espera, tirador clavado al final, hasta que sale bien o mal. Un deslizador que dice «hecho» antes de que responda el servidor miente. El tirador es un deslizador de verdad (role slider): con teclado las flechas lo mueven de cuarto en cuarto y Fin confirma. Y la posición vive en variables de CSS escritas desde el gesto, no en el estado de React.',
      en: 'A single click is too little for something that cannot be undone: it happens by accident. Dragging a handle to the other end is a gesture with a start, a path and an end, and it leaves a point where you can change your mind. The action is asynchronous: onConfirmar can return a promise and the control waits, handle pinned at the end, until it succeeds or fails. A slider that says "done" before the server answers is lying. The handle is a real slider (role slider): with the keyboard the arrows move it a quarter at a time and End confirms. And the position lives in CSS variables written from the gesture, not in React state.',
    },
    defaults: { umbral: 0.9, fallar: false, gain: 1 },
    controls: [
      { key: 'umbral', type: 'range', min: 0.5, max: 1, step: 0.05, label: { es: 'Hasta dónde hay que llevarlo', en: 'How far to drag' } },
      { key: 'fallar', type: 'bool', soloDemo: true, label: { es: 'Que el servidor falle', en: 'Make the server fail' } },
      { key: 'gain', type: 'range', min: 0, max: 1, step: 0.05, label: { es: 'Movimiento', en: 'Motion' } },
    ],
  },
]
