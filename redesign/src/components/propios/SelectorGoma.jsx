import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './SelectorGoma.css'

// Control segmentado cuya pieza se estira como si fuera de goma. Código PROPIO,
// escrito desde cero.
//
// Para alternar entre dos y cuatro vistas del mismo contenido (lista y rejilla, mes y
// semana). Una pieza señala la opción activa y, al cambiar, viaja hasta la nueva: se
// estira en el sentido del viaje mientras va deprisa y se encoge de alto para conservar
// su volumen, y al frenar vuelve a su forma con un rebote. Se puede agarrar y arrastrar.
//
// Lo que lo sostiene:
//
//   1. El movimiento es un MUELLE (posición y anchura con su velocidad), no una
//      transición de CSS. Una transición no sabe a qué velocidad va: el estiramiento sale
//      de esa velocidad, así que tiene que existir como número. Y un muelle redirige a
//      media trayectoria si cambias de opción antes de llegar, conservando la velocidad;
//      una transición se reinicia y da un tirón.
//   2. El estiramiento es la velocidad entre un tope, no un número fijo: parada, la pieza
//      mide lo que mide; a toda velocidad, hasta un 60 % más larga. Y el alto es el
//      inverso, con un suelo, para que parezca masa que se reparte y no una goma que se
//      alarga sin más.
//   3. El bucle solo corre mientras la pieza se mueve: cuando se asienta (menos de una
//      décima de píxel de error y casi sin velocidad) para y no gasta nada.
//   4. Arrastrar y pulsar son lo mismo. Si el puntero se mueve menos de cuatro píxeles es
//      un clic y se elige la opción; si más, es un arrastre y al soltar se elige la opción
//      más cercana al centro de la pieza. Y se evita el clic fantasma que llega justo
//      después de arrastrar.
//   5. Es un `radiogroup` de verdad: las flechas cambian de opción y mueven el foco, solo
//      una está en el tabulador. Los textos van siempre claros sobre una pieza oscura,
//      porque con una pieza clara el texto tendría que cambiar de color a mitad de viaje.
//
// El dial (`gain`) sube el amortiguamiento (menos rebote) y acorta el estiramiento. A
// cero la pieza salta a su sitio sin viaje ni deformación.

export default function SelectorGoma({
  opciones,
  valor,
  valorInicial,
  respuesta = 0.34,
  amortiguacion = 0.55,
  elasticidad = 1,
  igualAncho = true,
  arrastrable = true,
  rotulo = 'Vista',
  onCambio,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const grupo = useRef(null)
  const pieza = useRef(null)
  const botones = useRef([])
  const m = useRef({ x: 0, w: 0, vx: 0, tx: 0, tw: 0, corre: false, listo: false })
  const arrastre = useRef(null)
  const fantasma = useRef(false)
  const [interno, setInterno] = useState(valorInicial ?? opciones[0]?.valor)
  const actual = valor ?? interno
  const indice = Math.max(opciones.findIndex((o) => o.valor === actual), 0)

  const pintar = useCallback(() => {
    const p = pieza.current
    if (!p) return
    const s = m.current
    // Punto 2: el estiramiento sale de la velocidad, con tope; el alto es su inverso.
    const estira = Math.min(Math.abs(s.vx) / 1400, 0.6) * elasticidad * g
    const sx = 1 + estira
    const sy = Math.max(1 / sx, 0.7)
    p.style.width = `${s.w}px`
    p.style.transform = `translateX(${s.x.toFixed(2)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
  }, [elasticidad, g])

  const apuntar = useCallback((i) => {
    const b = botones.current[i]
    if (!b) return
    m.current.tx = b.offsetLeft
    m.current.tw = b.offsetWidth
  }, [])

  // Punto 3: el bucle existe solo mientras hay algo que mover.
  const correr = useCallback(() => {
    const s = m.current
    if (s.corre) return
    s.corre = true
    const f = (2 * Math.PI) / respuesta
    // El dial sube el amortiguamiento hacia 1, que es llegar sin rebotar.
    const zeta = 1 - (1 - amortiguacion) * g
    let previo = 0
    const paso = (t) => {
      const dt = previo ? Math.min((t - previo) / 1000, 1 / 30) : 1 / 60
      previo = t
      s.vx += (-(f * f) * (s.x - s.tx) - 2 * zeta * f * s.vx) * dt
      s.x += s.vx * dt
      // La anchura sigue a su destino sin rebotar: es la que cambia entre opciones desiguales.
      s.w += (s.tw - s.w) * Math.min(dt * f * 0.9, 1)
      pintar()
      const quieto = Math.abs(s.x - s.tx) < 0.1 && Math.abs(s.vx) < 2 && Math.abs(s.w - s.tw) < 0.1
      if (quieto) {
        s.x = s.tx
        s.w = s.tw
        s.vx = 0
        s.corre = false
        pintar()
        return
      }
      requestAnimationFrame(paso)
    }
    requestAnimationFrame(paso)
  }, [respuesta, amortiguacion, g, pintar])

  const ir = useCallback(() => {
    apuntar(indice)
    const s = m.current
    // La primera vez, o con el dial a cero, no hay viaje: se coloca.
    if (!s.listo || g === 0) {
      s.x = s.tx
      s.w = s.tw
      s.vx = 0
      s.listo = true
      pintar()
      return
    }
    correr()
  }, [indice, g, apuntar, correr, pintar])

  useLayoutEffect(() => {
    ir()
  }, [ir])

  // Si cambia el ancho de la caja o llega la tipografía, las medidas son otras.
  useEffect(() => {
    const el = grupo.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      apuntar(indice)
      const s = m.current
      if (!s.corre) {
        s.x = s.tx
        s.w = s.tw
        pintar()
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [indice, apuntar, pintar])

  const elegir = (i) => {
    const o = opciones[i]
    if (!o) return
    if (valor === undefined) setInterno(o.valor)
    onCambio?.(o.valor)
  }

  // Punto 4: arrastrar y pulsar son lo mismo.
  const alBajar = (e) => {
    if (!arrastrable || e.button !== 0) return
    // La diferencia entre donde se agarra y el centro de la pieza se conserva al arrastrar,
    // para que la pieza no dé un salto hacia el puntero.
    arrastre.current = { x0: e.clientX, mueve: false, offset: e.clientX - (grupo.current.getBoundingClientRect().left + m.current.x + m.current.w / 2) }
  }

  const alMover = (e) => {
    const a = arrastre.current
    if (!a) return
    if (!a.mueve && Math.abs(e.clientX - a.x0) < 4) return
    // El puntero se captura al EMPEZAR a arrastrar y no al pulsar: con captura, el clic
    // de una pulsación sin arrastre llegaría al grupo y no al botón, y no elegiría nada.
    if (!a.mueve) grupo.current.setPointerCapture(e.pointerId)
    a.mueve = true
    const caja = grupo.current.getBoundingClientRect()
    const s = m.current
    // La pieza se queda entre la primera opción y la última, no sobre el relleno de la caja.
    const primera = botones.current[0]
    const ultima = botones.current[botones.current.length - 1]
    const minimo = primera.offsetLeft
    const maximo = ultima.offsetLeft + ultima.offsetWidth - s.tw
    s.tx = Math.min(Math.max(e.clientX - caja.left - a.offset - s.tw / 2, minimo), maximo)
    if (g === 0) {
      s.x = s.tx
      pintar()
    } else {
      correr()
    }
  }

  const alSoltar = (e) => {
    const a = arrastre.current
    arrastre.current = null
    grupo.current?.releasePointerCapture?.(e.pointerId)
    if (!a?.mueve) return
    const s = m.current
    const centro = s.tx + s.tw / 2
    let mejor = 0
    let dist = Infinity
    botones.current.forEach((b, i) => {
      const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - centro)
      if (d < dist) {
        dist = d
        mejor = i
      }
    })
    // Aunque la opción no cambie, la pieza tiene que volver a ella.
    apuntar(mejor)
    correr()
    elegir(mejor)
    // El clic que llega tras soltar no debe elegir otra cosa.
    fantasma.current = true
    setTimeout(() => (fantasma.current = false), 0)
  }

  const alTeclear = (e, i) => {
    let sig
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') sig = (i + 1) % opciones.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') sig = (i - 1 + opciones.length) % opciones.length
    else if (e.key === 'Home') sig = 0
    else if (e.key === 'End') sig = opciones.length - 1
    else return
    e.preventDefault()
    elegir(sig)
    botones.current[sig]?.focus()
  }

  return (
    <div
      ref={grupo}
      className={`sg${igualAncho ? ' sg--igual' : ''}${arrastrable ? ' sg--arrastrable' : ''} ${className}`.trim()}
      role="radiogroup"
      aria-label={rotulo}
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
      style={style}
    >
      <span ref={pieza} className="sg-pieza" aria-hidden="true" />
      {opciones.map((o, i) => (
        <button
          key={o.valor}
          ref={(el) => (botones.current[i] = el)}
          type="button"
          role="radio"
          className="sg-opcion"
          aria-checked={i === indice}
          tabIndex={i === indice ? 0 : -1}
          onClick={() => {
            if (fantasma.current) return
            elegir(i)
          }}
          onKeyDown={(e) => alTeclear(e, i)}
        >
          {o.etiqueta}
        </button>
      ))}
    </div>
  )
}
