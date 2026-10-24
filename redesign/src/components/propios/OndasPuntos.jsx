import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import './OndasPuntos.css'

// Una retícula de puntos cuyas olas dibujan un texto. Código PROPIO, escrito desde cero.
//
// Un titular enorme hecho de puntos: todos los puntos de la caja tiemblan con una ola que
// la cruza en diagonal, pero los que caen dentro de las letras son más grandes y más
// claros, y eso dibuja el texto. Al pasar el puntero salpica: salen ondas circulares desde
// él que levantan los puntos. Al aparecer, el texto se descubre de izquierda a derecha.
//
// Lo que hay debajo:
//
//   1. La máscara del texto se saca de DIBUJARLO. Se escribe el texto en un lienzo
//      auxiliar de una celda por píxel (columnas por filas de la retícula) y se lee su
//      transparencia: lo que vale 1 es dentro de la letra, 0 es fuera, y los bordes tienen
//      el valor intermedio que da el suavizado del propio navegador. Cualquier tipografía,
//      cualquier texto, sin una lista de coordenadas.
//   2. El texto se ESCALA para llenar el ancho de la caja y no pasarse del alto, midiéndolo
//      con la fuente real, y se recalcula al cambiar el tamaño.
//   3. Nada de esto es el texto: el lienzo va oculto a los lectores y el contenedor es una
//      imagen con el texto como nombre. Quien no ve los puntos lee el titular; y como un
//      titular hecho de puntos se lee peor que uno normal, el contraste va por tamaño.
//   4. La densidad de píxeles se limita a 2 y el bucle solo corre si la caja se ve. Con el
//      dial a cero no hay bucle: un solo fotograma, con el texto ya descubierto.
//
// El dial (`gain`) multiplica la velocidad de las olas y apaga la salpicadura cuando es cero.

export default function OndasPuntos({
  texto,
  paso = 12,
  color = '#7dd3fc',
  velocidad = 1,
  amplitud = 1,
  salpicadura = true,
  entrada = 1.4,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const ondas = useRef([])
  const ultima = useRef({ x: -999, y: -999, t: 0 })
  const [caja, visible] = useCaja(raiz)
  // La máscara se mide con la tipografía real: si aún no ha llegado, se rehace al llegar.
  const [fuentes, setFuentes] = useState(false)
  useEffect(() => {
    document.fonts?.ready.then(() => setFuentes(true))
  }, [])

  useEffect(() => {
    const cv = lienzo.current
    if (!cv || !caja.w || !caja.h) return
    cv.width = Math.round(caja.w * caja.dpr)
    cv.height = Math.round(caja.h * caja.dpr)
    const ctx = cv.getContext('2d')
    ctx.setTransform(caja.dpr, 0, 0, caja.dpr, 0, 0)

    const cols = Math.floor(caja.w / paso)
    const filas = Math.floor(caja.h / paso)
    if (cols < 4 || filas < 3) return
    const ox = (caja.w - (cols - 1) * paso) / 2
    const oy = (caja.h - (filas - 1) * paso) / 2

    // Punto 1 y 2: la máscara sale de dibujar el texto, ajustado al ancho.
    const aux = document.createElement('canvas')
    aux.width = cols
    aux.height = filas
    const c2 = aux.getContext('2d', { willReadFrequently: true })
    const familia = "'Inter', system-ui, sans-serif"
    c2.font = `800 100px ${familia}`
    const medido = c2.measureText(texto).width || 1
    const tam = Math.min((100 * cols * 0.94) / medido, filas * 0.8)
    c2.font = `800 ${tam}px ${familia}`
    c2.textAlign = 'center'
    c2.textBaseline = 'middle'
    c2.fillStyle = '#fff'
    c2.fillText(texto, cols / 2, filas / 2 + tam * 0.04)
    const px = c2.getImageData(0, 0, cols, filas).data
    const mascara = new Float32Array(cols * filas)
    for (let i = 0; i < mascara.length; i++) mascara[i] = px[i * 4 + 3] / 255

    const r0 = paso * 0.1
    const r1 = paso * 0.42
    const inicio = performance.now()

    const dibujar = (t, ahora) => {
      ctx.clearRect(0, 0, caja.w, caja.h)
      ctx.fillStyle = color
      ondas.current = ondas.current.filter((o) => ahora - o.t0 < 1400)
      // Descubierta de izquierda a derecha al aparecer; con el dial a cero, ya completa.
      const desc = g === 0 || entrada <= 0 ? 1.2 : ((ahora - inicio) / 1000 / entrada) * 1.2
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const m = mascara[f * cols + c]
          const x = ox + c * paso
          const y = oy + f * paso
          // La ola que cruza la caja en diagonal.
          const ola = Math.sin((c * 0.42 + f * 0.3) - t * 2.2)
          let eleva = 0
          let extra = 0
          for (const o of ondas.current) {
            const d = Math.hypot(x - o.x, y - o.y)
            const frente = ((ahora - o.t0) / 1400) * 380
            const k = Math.exp(-(((d - frente) / 34) ** 2)) * (1 - (ahora - o.t0) / 1400)
            eleva += k * paso * 0.9
            extra += k * 0.5
          }
          const visibleTexto = c / cols < desc ? m : 0
          const tamano = r0 + (r1 - r0) * visibleTexto
          const radio = tamano * (1 + 0.28 * ola * amplitud) + extra * paso * 0.25
          if (radio < 0.3) continue
          ctx.globalAlpha = Math.min(0.28 + visibleTexto * 0.72 + extra * 0.3, 1)
          ctx.beginPath()
          ctx.arc(x, y - eleva - ola * amplitud * paso * 0.12 * visibleTexto, radio, 0, 6.2832)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    if (g === 0 || !visible) {
      dibujar(0, performance.now() + 10000)
      return
    }
    let id = 0
    const bucle = (ms) => {
      dibujar((ms / 1000) * velocidad * g, performance.now())
      id = requestAnimationFrame(bucle)
    }
    id = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(id)
  }, [caja, visible, texto, paso, color, velocidad, amplitud, entrada, g, fuentes])

  const alMover = (e) => {
    if (!salpicadura || g === 0 || e.pointerType !== 'mouse') return
    const r = raiz.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const u = ultima.current
    const ahora = performance.now()
    // Una onda cada tanto, no una por cada evento de movimiento.
    if (Math.hypot(x - u.x, y - u.y) < 46 || ahora - u.t < 90) return
    ultima.current = { x, y, t: ahora }
    ondas.current.push({ x, y, t0: ahora })
    if (ondas.current.length > 8) ondas.current.shift()
  }

  return (
    <div
      ref={raiz}
      className={`op ${className}`.trim()}
      role="img"
      aria-label={texto}
      onPointerMove={alMover}
      style={style}
    >
      <canvas ref={lienzo} className="op-lienzo" aria-hidden="true" />
    </div>
  )
}
