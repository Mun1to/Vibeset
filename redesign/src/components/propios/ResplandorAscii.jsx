import { useEffect, useRef } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import './ResplandorAscii.css'

// Un fondo de resplandores dibujados con letras. Código PROPIO, escrito desde cero.
//
// Un campo de luz suave (una franja de horizonte, una subida desde abajo, un anillo de
// eclipse) pintado con caracteres de un abecedario de más oscuro a más claro: donde la luz
// es poca, un punto; donde es mucha, una `@`. Suena a terminal sin serlo. Bajo el puntero,
// las letras se desordenan, y al pulsar sale una onda.
//
// Lo que hay debajo:
//
//   1. NO es una imagen convertida a texto: el campo de luz se calcula celda a celda con
//      una fórmula (la forma elegida más una oscilación lenta) y de ese número sale el
//      carácter. Así cambia de forma sin cargar nada y escala a cualquier tamaño.
//   2. Es un fondo, y el texto que vaya encima manda: el lienzo va `aria-hidden` y detrás
//      del contenido, que es HTML normal. El contraste del texto hay que medirlo contra la
//      parte MÁS CLARA del campo, no contra el color medio; por eso el color por defecto es
//      uno contra el que el blanco aguanta.
//   3. Cada letra se pinta con una transparencia según su luz, y las celdas casi apagadas
//      no se pintan: de unas 2.500 celdas, la mayoría de las veces se dibujan unas cientos.
//   4. El bucle solo corre si se ve (fuera de pantalla para) y con el dial a cero no hay
//      bucle: se dibuja UN fotograma y se queda, que es un fondo estático legítimo.
//   5. La densidad de píxeles se limita a 2 y la caja se mide con un observador, así que
//      cambiar el tamaño de la ventana no deja el lienzo borroso ni estirado.
//
// El dial (`gain`) multiplica la velocidad de la oscilación y apaga el desorden y la onda
// cuando es cero.

const FORMAS = {
  // Una franja luminosa a media altura, con su halo.
  horizonte: (u, v) => Math.exp(-(((v - 0.62) / 0.14) ** 2)),
  // La luz sube desde abajo y se apaga arriba.
  subida: (u, v) => Math.max(0, v - 0.15) ** 1.6 * 1.25,
  // Un reloj de arena: la franja se estrecha en el centro.
  pinzamiento: (u, v) => {
    const ancho = 0.07 + 0.55 * (1 - Math.exp(-(((u - 0.5) / 0.28) ** 2)))
    return Math.exp(-(((v - 0.5) / ancho) ** 2)) * 0.95
  },
  // Un anillo de luz alrededor de un centro oscuro.
  eclipse: (u, v, rel) => {
    const d = Math.hypot((u - 0.5) * rel, v - 0.5)
    return Math.exp(-(((d - 0.3) / 0.075) ** 2))
  },
}

export default function ResplandorAscii({
  forma = 'horizonte',
  caracteres = ' .:-=+*#%@',
  celda = 14,
  color = '#3b82f6',
  velocidad = 1,
  revuelto = true,
  onda = true,
  gain = 1,
  className = '',
  style,
  children,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const puntero = useRef({ x: 0, y: 0, hay: false })
  const ondas = useRef([])
  const [caja, visible] = useCaja(raiz)

  useEffect(() => {
    const cv = lienzo.current
    if (!cv || !caja.w || !caja.h) return
    cv.width = Math.round(caja.w * caja.dpr)
    cv.height = Math.round(caja.h * caja.dpr)
    const ctx = cv.getContext('2d')
    ctx.setTransform(caja.dpr, 0, 0, caja.dpr, 0, 0)

    const ancho = celda * 0.6
    const cols = Math.ceil(caja.w / ancho)
    const filas = Math.ceil(caja.h / celda)
    const rel = caja.w / caja.h
    const campo = FORMAS[forma] ?? FORMAS.horizonte
    const rampa = [...caracteres]
    const radio = 110

    const dibujar = (t) => {
      ctx.clearRect(0, 0, caja.w, caja.h)
      ctx.font = `${celda}px ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace`
      ctx.textBaseline = 'top'
      ctx.fillStyle = color
      const p = puntero.current
      const ahora = performance.now()
      ondas.current = ondas.current.filter((o) => ahora - o.t0 < 1100)
      for (let f = 0; f < filas; f++) {
        const v = (f + 0.5) / filas
        const y = f * celda
        for (let c = 0; c < cols; c++) {
          const u = (c + 0.5) / cols
          const x = c * ancho
          // Punto 1: la luz de la celda, de una fórmula y no de una imagen.
          let luz = campo(u, v, rel) + 0.16 * Math.sin(u * 7 + t * 0.9) * Math.cos(v * 6 - t * 0.65)
          let revuelta = false
          if (p.hay && g > 0) {
            const d = Math.hypot(x - p.x, y - p.y)
            if (d < radio) {
              luz += (1 - d / radio) * 0.55
              revuelta = revuelto && d < radio * 0.7
            }
          }
          for (const o of ondas.current) {
            const dist = Math.hypot(x - o.x, y - o.y)
            const frente = ((ahora - o.t0) / 1100) * 520
            luz += Math.exp(-(((dist - frente) / 28) ** 2)) * 0.7 * (1 - (ahora - o.t0) / 1100)
          }
          if (luz < 0.05) continue
          luz = Math.min(luz, 1)
          // Punto 3: las celdas casi apagadas no se pintan.
          const i = revuelta ? Math.floor(Math.random() * rampa.length) : Math.floor(luz * (rampa.length - 1))
          if (rampa[i] === ' ') continue
          ctx.globalAlpha = 0.18 + luz * 0.82
          ctx.fillText(rampa[i], x, y)
        }
      }
      ctx.globalAlpha = 1
    }

    // Punto 4: con el dial a cero, un solo fotograma.
    if (g === 0) {
      dibujar(0)
      return
    }
    if (!visible) {
      dibujar(0)
      return
    }
    let id = 0
    const bucle = (ms) => {
      dibujar((ms / 1000) * velocidad * g)
      id = requestAnimationFrame(bucle)
    }
    id = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(id)
  }, [caja, visible, forma, caracteres, celda, color, velocidad, revuelto, g])

  const alMover = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = raiz.current.getBoundingClientRect()
    puntero.current = { x: e.clientX - r.left, y: e.clientY - r.top, hay: true }
  }

  const alPulsar = (e) => {
    if (!onda || g === 0 || e.pointerType !== 'mouse') return
    const r = raiz.current.getBoundingClientRect()
    ondas.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() })
  }

  return (
    <div
      ref={raiz}
      className={`ra ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={() => { puntero.current.hay = false }}
      onPointerDown={alPulsar}
      style={style}
    >
      {/* Punto 2: el fondo es dibujo, el contenido es HTML. */}
      <canvas ref={lienzo} className="ra-lienzo" aria-hidden="true" />
      <div className="ra-contenido">{children}</div>
    </div>
  )
}
