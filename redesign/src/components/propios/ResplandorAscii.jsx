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
//      Las letras de una fila se agrupan por nivel de transparencia (ocho) y se pintan de una
//      vez, una `fillText` por fila y nivel y no una por celda: medido, 2,5 veces más barato.
//      (Se probó estampar miniaturas con `drawImage` y salió de 5 a 7 veces MÁS lento que
//      el texto, que Chrome tiene muy optimizado: no se repite.)
//   4. El bucle solo corre si se ve (fuera de pantalla para), pinta a 30 fotogramas por
//      segundo, y con el dial a cero no hay bucle: se dibuja UN fotograma y se queda, que es
//      un fondo estático legítimo.
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

    // La letra de una fuente monoespaciada mide lo que mide su fuente (7,15 px con una celda de
    // 13) y la celda, 0,6 de su alto (7,8): `letterSpacing` cierra la diferencia para que la
    // fila de letras caiga en la retícula. Si el navegador no lo trae, la celda pasa a medir lo
    // que mide la letra y el campo sigue llenando la caja.
    ctx.font = `${celda}px ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace`
    ctx.textBaseline = 'top'
    ctx.fillStyle = color
    const avance = ctx.measureText('M').width
    const conEspaciado = 'letterSpacing' in ctx
    const ancho = conEspaciado ? celda * 0.6 : avance
    if (conEspaciado) ctx.letterSpacing = `${(ancho - avance).toFixed(3)}px`
    const cols = Math.ceil(caja.w / ancho)
    const filas = Math.ceil(caja.h / celda)
    const rel = caja.w / caja.h
    const campo = FORMAS[forma] ?? FORMAS.horizonte
    const rampa = [...caracteres]
    const radio = 110
    const NIVELES = 8
    // La oscilación lenta es un seno que solo depende de la columna por un coseno que solo
    // depende de la fila: se calculan una vez por columna y por fila, no en cada celda.
    const senos = new Float32Array(cols)

    const dibujar = (t) => {
      ctx.clearRect(0, 0, caja.w, caja.h)
      const p = puntero.current
      const ahora = performance.now()
      ondas.current = ondas.current.filter((o) => ahora - o.t0 < 1100)
      const frentes = ondas.current.map((o) => {
        const edad = (ahora - o.t0) / 1100
        return { x: o.x, y: o.y, frente: edad * 520, vida: 0.7 * (1 - edad) }
      })
      for (let c = 0; c < cols; c++) senos[c] = Math.sin(((c + 0.5) / cols) * 7 + t * 0.9)
      for (let f = 0; f < filas; f++) {
        const v = (f + 0.5) / filas
        const y = f * celda
        const coseno = Math.cos(v * 6 - t * 0.65)
        // Una fila de letras (con huecos) por nivel de transparencia: se pinta de una vez cada
        // una y no una `fillText` por celda.
        const lineas = []
        for (let c = 0; c < cols; c++) {
          const u = (c + 0.5) / cols
          const x = c * ancho
          // Punto 1: la luz de la celda, de una fórmula y no de una imagen.
          let luz = campo(u, v, rel) + 0.16 * senos[c] * coseno
          let revuelta = false
          if (p.hay && g > 0) {
            const dx = x - p.x
            const dy = y - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < radio * radio) {
              const d = Math.sqrt(d2)
              luz += (1 - d / radio) * 0.55
              revuelta = revuelto && d < radio * 0.7
            }
          }
          for (const o of frentes) {
            const dx = x - o.x
            const dy = y - o.y
            const z = (Math.sqrt(dx * dx + dy * dy) - o.frente) / 28
            // A más de tres anchos del anillo la ola vale menos de 0,0002: no se calcula.
            if (z > 3 || z < -3) continue
            luz += Math.exp(-(z * z)) * o.vida
          }
          if (luz < 0.05) continue
          luz = Math.min(luz, 1)
          // Punto 3: las celdas casi apagadas no se pintan.
          const i = revuelta ? Math.floor(Math.random() * rampa.length) : Math.floor(luz * (rampa.length - 1))
          if (rampa[i] === ' ') continue
          const nivel = Math.max(1, Math.round(luz * NIVELES))
          const linea = lineas[nivel] ?? (lineas[nivel] = new Array(cols).fill(' '))
          linea[c] = rampa[i]
        }
        for (let n = 1; n <= NIVELES; n++) {
          if (!lineas[n]) continue
          ctx.globalAlpha = 0.18 + (n / NIVELES) * 0.82
          ctx.fillText(lineas[n].join(''), 0, y)
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
    // A 30 fotogramas por segundo: una oscilación lenta no gana nada a 60, y con el puntero
    // encima las letras que se desordenan obligan a dar forma a una fila distinta en cada
    // fotograma, que con la CPU a 4x rozaba los 16 ms. Con 30 ms de margen entre fotogramas,
    // una pantalla de 60 Hz pinta uno de cada dos, y una de 120 o 144 Hz también 30.
    let id = 0
    let previo = -1e9
    const bucle = (ms) => {
      id = requestAnimationFrame(bucle)
      if (ms - previo < 30) return
      previo = ms
      dibujar((ms / 1000) * velocidad * g)
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
