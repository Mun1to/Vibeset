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
// Llevan overlay los 12 componentes con demo de canvasui y arlan y las 28 fichas de
// análisis de React Bits. Las skills no son piezas de movimiento, así que no tienen
// entrada, y las tres piezas propias tampoco (son sobrias). El código trata la
// ausencia como «sin restricción», y por eso las 28 de React Bits SÍ llevan entrada:
// sin ella, un `fintech` las habría recibido todas, láser incluido.
//
// Los valores de las 28 se asignaron el 2026-10-24 LEYENDO su código, no probándolo:
// WebGL o física que se mueve sola es `alto` y no cumple el dial (no trae
// `--motion-gain`); lo que solo se mueve cuando la persona lo toca es `bajo` y sí lo
// cumple. `requiere-refuerzo` es donde el texto vive dentro de un canvas o no trae
// ningún atributo aria (FallingText, MetallicPaint, ShapeWaves, SplitFlapText).
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

  // --- React Bits: fichas de análisis (ver componentsRef.js).
  // Fondos y shaders: se mueven solos y son decorativos.
  gradientAscii: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  laserFlow: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  topography: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'editorial'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  elasticMesh: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'decorativo' },
  // El texto o el logo viven dentro del canvas, o no hay ni un atributo aria.
  metallicPaint: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'requiere-refuerzo' },
  shapeWaves: { arquetipos: ['marca-creativa', 'portfolio', 'lanzamiento', 'evento'], costeMovimiento: 'alto', cumpleDial: false, a11y: 'requiere-refuerzo' },
  // Puntero y texto: movimiento propio, de menos recorrido.
  // Piezas de interfaz que solo se mueven cuando la persona las toca.
  // Micro-interacciones: pequeñas y dirigidas por quien las usa.

  // --- Piezas propias que sustituyen a una ficha de análisis (componentsPropios.js).
  // Aquí SÍ se ha probado, no solo leído: todas traen el dial (`gain`), y lo que dicen
  // (el texto, el estado, la confirmación) es DOM real, sin canvas ni nada oculto a los
  // lectores. Al construir una, su entrada de arriba (la del original) se borra y la
  // propia entra aquí con su clave, porque el registro cruza por `key`.
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
}
