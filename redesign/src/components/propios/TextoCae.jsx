import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './TextoCae.css'

// Texto cuyas palabras caen, rebotan y se apilan. Código PROPIO, escrito desde cero, con
// la física también escrita aquí: ninguna librería de física detrás.
//
// Una frase que se lee normal hasta que algo la suelta: entonces cada palabra se convierte
// en una pieza que cae donde estaba, choca con el suelo, con las paredes y con las demás
// palabras, y se queda amontonada abajo. Se puede coger una palabra y tirarla.
//
// Lo que hay debajo:
//
//   1. Antes de caer, las palabras son TEXTO NORMAL de un párrafo, con su salto de línea y
//      su tipografía. Al soltarlas se MIDE dónde está cada una y se pasa a posición
//      absoluta en ese mismo sitio, en el mismo fotograma: no hay salto. Y como siguen en
//      el DOM en su orden, un lector de pantalla lee la frase entera esté donde esté cada
//      palabra.
//   2. La física son cajas alineadas con los ejes (no giran; la inclinación que se ve es
//      solo de adorno). Cada paso mueve las piezas con la gravedad, las mantiene dentro de
//      la caja y resuelve los choques de dos en dos por el eje en que se solapan MENOS:
//      las separa a partes iguales y reparte las velocidades con el rebote. Se repite
//      varias veces por paso, que es lo que consigue que una pila no se hunda.
//   3. El paso es FIJO (1/120 s) y el tiempo real se gasta en trozos de ese tamaño. Con un
//      paso variable, una pestaña dormida que vuelve da un salto enorme y las palabras
//      atraviesan el suelo.
//   4. Cuando todo se ha quedado casi quieto, el bucle PARA. Vuelve a despertar al coger o
//      soltar una palabra. Una pila en reposo no debe gastar nada.
//   5. Se suelta con un botón (teclado, táctil) además de con el clic en el texto, y otro
//      botón lo recoloca. No depende del ratón.
//
// El dial (`gain`) quita rebote y la tirada inicial al bajar. Con el dial a cero las
// palabras no se sueltan: es un párrafo, que es lo que hay que servir a quien no quiere
// movimiento.

const PASO = 1 / 120
const ITERACIONES = 4

const TEXTO = {
  es: { soltar: 'Soltar las palabras', recoger: 'Recoger las palabras' },
  en: { soltar: 'Drop the words', recoger: 'Pick the words up' },
}

export default function TextoCae({
  texto,
  disparo = 'clic',
  gravedad = 1800,
  rebote = 0.3,
  rozamiento = 0.08,
  alto = 16,
  tamano = 1.7,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const caja = useRef(null)
  const cuerpos = useRef([])
  const medidas = useRef({ ancho: 0, alto: 0 })
  const bucle = useRef({ id: 0, corre: false, quietos: 0 })
  const [estado, setEstado] = useState('flujo') // flujo | cayendo
  const palabras = texto.trim().split(/\s+/)

  // Punto 2: un paso de física.
  const paso = useCallback(() => {
    const { ancho, alto: H } = medidas.current
    const c = cuerpos.current
    const e = Math.min(Math.max(rebote * g, 0), 0.9)
    for (const b of c) {
      if (b.fijo) continue
      b.vy += gravedad * PASO
      b.x += b.vx * PASO
      b.y += b.vy * PASO
      if (b.y + b.h > H) {
        b.y = H - b.h
        if (b.vy > 0) b.vy = -b.vy * e
        b.vx *= 1 - rozamiento
      }
      if (b.y < 0) {
        b.y = 0
        if (b.vy < 0) b.vy = -b.vy * e
      }
      const tope = Math.max(ancho - b.w, 0)
      if (b.x < 0) { b.x = 0; if (b.vx < 0) b.vx = -b.vx * e }
      if (b.x > tope) { b.x = tope; if (b.vx > 0) b.vx = -b.vx * e }
    }
    for (let it = 0; it < ITERACIONES; it++) {
      for (let i = 0; i < c.length; i++) {
        for (let j = i + 1; j < c.length; j++) {
          const A = c[i]
          const B = c[j]
          if (A.fijo && B.fijo) continue
          const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)
          const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y)
          if (ox <= 0 || oy <= 0) continue
          // Cuánto se lleva cada una: si una está cogida, la otra se lleva todo.
          const fa = A.fijo ? 0 : B.fijo ? 1 : 0.5
          const fb = 1 - fa
          if (oy < ox) {
            const s = A.y + A.h / 2 < B.y + B.h / 2 ? -1 : 1
            A.y += s * oy * fa
            B.y -= s * oy * fb
            const vm = A.fijo ? A.vy : B.fijo ? B.vy : (A.vy + B.vy) / 2
            if (!A.fijo) A.vy = vm - (A.vy - vm) * e
            if (!B.fijo) B.vy = vm - (B.vy - vm) * e
            if (!A.fijo) A.vx *= 1 - rozamiento
            if (!B.fijo) B.vx *= 1 - rozamiento
          } else {
            const s = A.x + A.w / 2 < B.x + B.w / 2 ? -1 : 1
            A.x += s * ox * fa
            B.x -= s * ox * fb
            const vm = A.fijo ? A.vx : B.fijo ? B.vx : (A.vx + B.vx) / 2
            if (!A.fijo) A.vx = vm - (A.vx - vm) * e
            if (!B.fijo) B.vx = vm - (B.vx - vm) * e
          }
        }
      }
    }
  }, [gravedad, rebote, rozamiento, g])

  const pintar = () => {
    for (const b of cuerpos.current) {
      b.el.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) rotate(${b.rot}deg)`
    }
  }

  // Punto 3 y punto 4: paso fijo, y el bucle para cuando todo está casi quieto.
  const correr = useCallback(() => {
    const b = bucle.current
    if (b.corre) return
    b.corre = true
    b.quietos = 0
    let previo = 0
    let resto = 0
    const marco = (t) => {
      const dt = previo ? Math.min((t - previo) / 1000, 0.1) : PASO
      previo = t
      resto += dt
      while (resto >= PASO) {
        paso()
        resto -= PASO
      }
      pintar()
      const rapido = cuerpos.current.some((c) => c.fijo || Math.abs(c.vx) > 25 || Math.abs(c.vy) > 40)
      b.quietos = rapido ? 0 : b.quietos + 1
      if (b.quietos > 45) {
        b.corre = false
        return
      }
      b.id = requestAnimationFrame(marco)
    }
    b.id = requestAnimationFrame(marco)
  }, [paso])

  // Punto 1: se mide donde está cada palabra y se pasa a absoluta en ese mismo sitio.
  const soltar = useCallback(() => {
    if (g === 0 || estado === 'cayendo' || !caja.current) return
    // El origen de las posiciones absolutas es el borde interior (sin el borde de la caja).
    const z = caja.current.getBoundingClientRect()
    const ox = z.left + caja.current.clientLeft
    const oy = z.top + caja.current.clientTop
    medidas.current = { ancho: caja.current.clientWidth, alto: caja.current.clientHeight }
    const els = [...caja.current.querySelectorAll('.tc-palabra')]
    cuerpos.current = els.map((el, i) => {
      const r = el.getBoundingClientRect()
      return {
        el,
        x: r.left - ox,
        y: r.top - oy,
        w: r.width,
        h: r.height,
        vx: (Math.sin(i * 12.9898) * 43758.5453 % 1) * 160 * g,
        vy: 0,
        rot: ((Math.sin(i * 78.233) * 43758.5453 % 1) * 6 * g),
        fijo: false,
      }
    })
    setEstado('cayendo')
    // La clase `tc--cayendo` pone las palabras en absoluto; se pintan ya en su sitio.
    requestAnimationFrame(() => {
      pintar()
      correr()
    })
  }, [g, estado, correr])

  const recoger = () => {
    cancelAnimationFrame(bucle.current.id)
    bucle.current.corre = false
    for (const b of cuerpos.current) b.el.style.transform = ''
    cuerpos.current = []
    setEstado('flujo')
  }

  // El tamaño de la caja manda en los límites, también si cambia con las palabras caídas.
  useEffect(() => {
    const el = caja.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      medidas.current = { ancho: el.clientWidth, alto: el.clientHeight }
      if (cuerpos.current.length) correr()
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [correr])

  useEffect(() => () => cancelAnimationFrame(bucle.current.id), [])

  // Los disparos automáticos: al entrar en pantalla o al cargar.
  useEffect(() => {
    if (g === 0) return
    if (disparo === 'cargar') {
      const id = setTimeout(soltar, 700)
      return () => clearTimeout(id)
    }
    if (disparo === 'vista' && typeof IntersectionObserver !== 'undefined' && caja.current) {
      const io = new IntersectionObserver((es) => {
        if (es[es.length - 1].isIntersecting) soltar()
      }, { threshold: 0.6 })
      io.observe(caja.current)
      return () => io.disconnect()
    }
  }, [disparo, g, soltar])

  // Coger y tirar una palabra.
  const coger = (ev, i) => {
    if (estado !== 'cayendo') return
    const b = cuerpos.current[i]
    const z = caja.current.getBoundingClientRect()
    const zx = z.left + caja.current.clientLeft
    const zy = z.top + caja.current.clientTop
    const dx = ev.clientX - zx - b.x
    const dy = ev.clientY - zy - b.y
    b.fijo = true
    b.vx = 0
    b.vy = 0
    let ult = { x: b.x, y: b.y, t: performance.now() }
    // Se guarda el elemento ahora: `ev.currentTarget` vale `null` en cuanto acaba este manejador.
    const el = ev.currentTarget
    el.setPointerCapture(ev.pointerId)
    correr()
    const mover = (m) => {
      const nx = Math.min(Math.max(m.clientX - zx - dx, 0), Math.max(medidas.current.ancho - b.w, 0))
      const ny = Math.min(Math.max(m.clientY - zy - dy, 0), medidas.current.alto - b.h)
      const ahora = performance.now()
      const dt = Math.max((ahora - ult.t) / 1000, 0.001)
      b.vx = (nx - ult.x) / dt
      b.vy = (ny - ult.y) / dt
      ult = { x: nx, y: ny, t: ahora }
      b.x = nx
      b.y = ny
    }
    const soltarla = () => {
      b.fijo = false
      // Se tira con la velocidad con que se movía, con un tope.
      b.vx = Math.max(Math.min(b.vx, 2200), -2200)
      b.vy = Math.max(Math.min(b.vy, 2200), -2200)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltarla)
      el.removeEventListener('pointercancel', soltarla)
      correr()
    }
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', soltarla)
    el.addEventListener('pointercancel', soltarla)
  }

  return (
    <div
      ref={caja}
      className={`tc tc--${estado} ${className}`.trim()}
      style={{ '--tc-alto': `${alto}rem`, '--tc-tam': `${tamano}rem`, ...style }}
      onClick={() => { if (disparo === 'clic') soltar() }}
    >
      <p className="tc-texto">
        {palabras.map((p, i) => (
          <Fragment key={i}>
            <span className="tc-palabra" onPointerDown={(ev) => coger(ev, i)}>{p}</span>{' '}
          </Fragment>
        ))}
      </p>

      {/* Punto 5: la vía que no depende del ratón. */}
      {g > 0 && (
        <button
          type="button"
          className="tc-boton"
          onClick={(e) => {
            e.stopPropagation()
            if (estado === 'flujo') soltar()
            else recoger()
          }}
        >
          {estado === 'flujo' ? txt.soltar : txt.recoger}
        </button>
      )}
    </div>
  )
}
