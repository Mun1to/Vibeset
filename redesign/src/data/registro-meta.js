// Campos de la casa que FrontLaxWeb necesita para elegir una pieza, apartados aquí
// para no ensuciar components.js, que alimenta la UI y las demos. Se cruzan por
// `key` con COMPONENT_ITEMS.
//
// - arquetipos: en qué casillas de la matriz de FrontLaxWeb encaja la pieza.
//   Vocabulario: 'marca-creativa', 'portfolio', 'lanzamiento', 'saas', 'fintech',
//   'ecommerce', 'editorial', 'evento'.
// - costeMovimiento: cuánto pesa y cuánto se mueve. 'alto' | 'medio' | 'bajo'.
// - cumpleDial: true si el movimiento respeta la política de la casa (se puede
//   graduar con --motion-gain, o lo dirige el usuario, que no se escala). false si
//   es movimiento decorativo de gran amplitud que hoy no trae el dial: esa es la
//   señal para que FrontLaxWeb no lo meta en un SaaS ni en un fintech.
// - a11y: nota de accesibilidad. 'ok' | 'decorativo' | 'requiere-refuerzo'.
//
// Llevan overlay los componentes con demo de canvasui y arlan y todas las piezas propias
// que se escribieron para sustituir a una de React Bits. Las skills no son piezas de
// movimiento, así que no tienen entrada, y las tres primeras piezas propias (píldora,
// acordeón, matrioska) tampoco (son sobrias). El código trata la ausencia como «sin
// restricción», y por eso las piezas de movimiento SÍ llevan entrada: sin ella, un
// `fintech` las habría recibido todas, láser incluido.
//
// Los valores de las piezas propias se asignaron PROBÁNDOLAS en pantalla, con el puntero,
// el teclado y el dial (ver su commit): todas traen `gain` y por eso cumplen el dial.
// `alto` es lo que se mueve solo y gasta (canvas y shaders), `bajo` lo que solo se mueve
// cuando la persona lo toca. `decorativo` es lo que no lleva contenido.
export const META_CASA = {
  bubble: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  cloth: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  dithered: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  asciify: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  peel: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  bend: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  asciiObject: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  laser: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  particleScroll: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  chromaGlow: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'medio', cumpleDial: false, a11y: 'decorativo' },
  emboss: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'medio', cumpleDial: false, a11y: 'decorativo' },
  // El único que no es WebGL decorativo: botones en CSS puro, movimiento solo al
  // pasar el cursor (dirigido por el usuario, la política del dial no lo escala).
  // Por eso entra en arquetipos sobrios donde los demás chocan.
  colorDepth: { arquetipos: ['saas', 'fintech', 'ecommerce', 'marca-creativa', 'portfolio', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },

  // --- Piezas propias que sustituyen a una de React Bits (componentsPropios.js).
  // El registro cruza por `key`, así que cada una entra con la clave de la pieza propia, no
  // con la de su original. Aquí SÍ se ha probado, no solo leído: todas traen el dial
  // (`gain`), y lo que dicen (el texto, el estado, la confirmación) es DOM real o una
  // imagen con su nombre, y no algo oculto a los lectores.
  textoDestello: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'saas', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  contadorSube: { arquetipos: ['saas', 'fintech', 'ecommerce', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  focoPalabras: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  marcaEstado: { arquetipos: ['saas', 'fintech', 'ecommerce'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  botonMantener: { arquetipos: ['saas', 'fintech', 'ecommerce'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  deslizaConfirma: { arquetipos: ['saas', 'fintech', 'ecommerce'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  corazonLatido: { arquetipos: ['ecommerce', 'editorial', 'saas', 'portfolio'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  notaAsoma: { arquetipos: ['ecommerce', 'saas', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  codigoCasillas: { arquetipos: ['saas', 'fintech', 'ecommerce'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  menuRamas: { arquetipos: ['saas', 'editorial'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  // Rueda sola, pero se para (botón, ratón, foco, fuera de pantalla) y respeta el dial.
  cintaLogos: { arquetipos: ['saas', 'portfolio', 'lanzamiento', 'ecommerce', 'editorial'], costeMovimiento: 'medio', cumpleDial: true, a11y: 'ok' },
  tarjetaHolo: { arquetipos: ['portfolio', 'marca-creativa', 'saas'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  galeriaPaneles: { arquetipos: ['portfolio', 'marca-creativa', 'ecommerce', 'editorial', 'lanzamiento'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  // Cambian de palabra y giran solos, pero se paran (botón, fuera de pantalla) y llevan su texto en el DOM.
  panelFichas: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'evento'], costeMovimiento: 'medio', cumpleDial: true, a11y: 'ok' },
  textoOrbita: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'evento'], costeMovimiento: 'medio', cumpleDial: true, a11y: 'ok' },
  selectorGoma: { arquetipos: ['saas', 'marca-creativa', 'portfolio'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  lineaPensando: { arquetipos: ['saas'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  botonMecha: { arquetipos: ['saas', 'fintech', 'ecommerce'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  // Solo se mueve con el ratón y es adorno: no cuenta para nada que dependa de ella.
  miraCursor: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'decorativo' },
  botonCristal: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'saas'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  cartaMetal: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'saas'], costeMovimiento: 'bajo', cumpleDial: true, a11y: 'ok' },
  // Física propia: cae sola al soltarse, pero la frase es texto del DOM, hay botón y con el dial a cero no cae.
  textoCae: { arquetipos: ['marca-creativa', 'portfolio', 'evento'], costeMovimiento: 'medio', cumpleDial: true, a11y: 'ok' },
  // Piezas de lienzo propias: el lienzo va oculto a los lectores, el texto va fuera de él o
  // el contenedor es una imagen con su nombre, y con el dial a cero se dibuja un fotograma.
  resplandorAscii: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: true, a11y: 'decorativo' },
  ondasPuntos: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'evento'], costeMovimiento: 'alto', cumpleDial: true, a11y: 'ok' },
  mallaElastica: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'medio', cumpleDial: true, a11y: 'decorativo' },
  // Shaders: se mueven solos y gastan, pero paran fuera de pantalla, un fotograma con el dial a
  // cero, y un degradado fijo si no hay WebGL.
  curvasNivel: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'alto', cumpleDial: true, a11y: 'decorativo' },
  hazLaser: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: true, a11y: 'decorativo' },
  pinturaMetal: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: true, a11y: 'ok' },
}
