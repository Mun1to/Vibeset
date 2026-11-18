import { createAsciiObject } from './canvasui/AsciiObject'
import { LOGO_TRAZO } from './logoTrazo'

// El logo de la portada se dibuja en este hilo aparte. Arrancarlo cuesta segundos en un
// móvil (WebGL, el atlas de letras y la geometría del logo) y en el hilo principal esos
// segundos dejaban la página sin responder.
//
// `createAsciiObject` es la pieza de canvasui tal cual: lo que no existe en un worker se
// le da aquí con lo mínimo, y lo que pasa en la página llega por mensajes desde `LogoAscii`.
let movimientoReducido = false
let alCambiarTamano = null
let alCambiarVisibilidad = null
const oyentesMovimiento = new Set()

self.window = self
self.document = { createElement: () => new OffscreenCanvas(1, 1) }
self.matchMedia = () => ({
  get matches() { return movimientoReducido },
  addEventListener: (_, oyente) => oyentesMovimiento.add(oyente),
  removeEventListener: (_, oyente) => oyentesMovimiento.delete(oyente),
})
self.ResizeObserver = class {
  constructor(aviso) { alCambiarTamano = aviso }
  observe() {}
  disconnect() {}
}
self.IntersectionObserver = class {
  constructor(aviso) { alCambiarVisibilidad = aviso }
  observe() {}
  disconnect() {}
}

// El SVG del logo no se puede decodificar en un worker, así que se rasteriza su trazo al
// mismo tamaño al que lo hace la pieza con un SVG (2048 de lado) y se le entrega en PNG.
const LADO_SVG = 512
const LADO_RASTER = 2048

async function logoEnPng() {
  const lienzo = new OffscreenCanvas(LADO_RASTER, LADO_RASTER)
  const ctx = lienzo.getContext('2d')
  ctx.scale(LADO_RASTER / LADO_SVG, LADO_RASTER / LADO_SVG)
  ctx.fillStyle = '#ffffff'
  ctx.fill(new Path2D(LOGO_TRAZO), 'evenodd')
  return URL.createObjectURL(await lienzo.convertToBlob({ type: 'image/png' }))
}

// OrbitControls espera un elemento del DOM: se le da lo que lee de él.
function comoElemento(lienzo, documento) {
  lienzo.style = {
    set cursor(valor) { self.postMessage({ tipo: 'cursor', valor }) },
    touchAction: 'none',
  }
  lienzo.ownerDocument = documento
  lienzo.getRootNode = () => documento
  lienzo.setPointerCapture = () => {}
  lienzo.releasePointerCapture = () => {}
  lienzo.getBoundingClientRect = () => ({
    left: 0, top: 0, width: lienzo.clientWidth, height: lienzo.clientHeight,
  })
}

function medir(lienzo, { ancho, alto, dpr }) {
  lienzo.clientWidth = ancho
  lienzo.clientHeight = alto
  self.devicePixelRatio = dpr
}

let lienzo = null
let documento = null
let pieza = null

async function iniciar({ lienzo: recibido, opciones, reducido, ...medida }) {
  lienzo = recibido
  documento = new EventTarget()
  movimientoReducido = reducido
  medir(lienzo, medida)
  comoElemento(lienzo, documento)

  pieza = createAsciiObject({ canvas: lienzo }, {
    ...opciones,
    src: await logoEnPng(),
    onLoad: () => self.postMessage({ tipo: 'listo' }),
    onError: () => self.postMessage({ tipo: 'fallo' }),
  })
  if (!pieza) self.postMessage({ tipo: 'fallo' })
}

function puntero({ evento, datos }) {
  const suceso = Object.assign(new Event(evento), datos)
  // Mientras se arrastra, OrbitControls escucha el movimiento y el final en el documento.
  const destino = evento === 'pointermove' || evento === 'pointerup' ? documento : lienzo
  destino?.dispatchEvent(suceso)
}

self.onmessage = ({ data }) => {
  if (data.tipo === 'iniciar') {
    iniciar(data).catch(() => self.postMessage({ tipo: 'fallo' }))
  } else if (data.tipo === 'tamano' && lienzo) {
    medir(lienzo, data)
    alCambiarTamano?.()
  } else if (data.tipo === 'visible') {
    alCambiarVisibilidad?.([{ isIntersecting: data.visible }])
  } else if (data.tipo === 'movimiento') {
    movimientoReducido = data.reducido
    oyentesMovimiento.forEach((oyente) => oyente())
  } else if (data.tipo === 'opciones') {
    pieza?.setOptions(data.opciones)
  } else if (data.tipo === 'puntero') {
    puntero(data)
  }
}
