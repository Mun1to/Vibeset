import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './FocoPalabras.css'

// Una frase que enfoca una palabra tras otra. Código PROPIO, escrito desde cero.
//
// Lo que se ve es un marcador que viaja de palabra en palabra mientras el resto de
// la frase se desenfoca. Lo que hay debajo, y lo que importa si se va a usar de
// verdad:
//
//   1. La frase es TEXTO NORMAL, palabra a palabra con su espacio de por medio. No
//      se parte en letras ni se esconde nada a los lectores de pantalla: desenfocar
//      es un filtro visual, así que quien no ve lee la frase entera, de corrido.
//   2. El marcador no se dibuja con una cuenta: se MIDE. Cada palabra sabe dónde está
//      y cuánto ocupa (`offsetLeft`, `offsetWidth`...), y el marcador va ahí. Así
//      funciona con cualquier fuente y con la frase partida en varias líneas, y se
//      vuelve a medir cuando cambia el ancho de la caja o terminan de cargar las
//      fuentes (sin eso, el marcador queda desplazado la primera vez).
//   3. Las transiciones se encienden DESPUÉS de colocarlo la primera vez. Si no, el
//      marcador nace en la esquina y cruza la frase volando hasta su sitio.
//   4. Hay dos modos que no se parecen: solo, que recorre la frase y se detiene
//      cuando sale de pantalla, y manual, que la maneja quien lo mira, con el ratón o
//      con las flechas. El manual tiene UNA parada de tabulador, no una por palabra.
//
// El dial (`gain`) alarga los movimientos, más lento cuanto más bajo. A cero no hay
// recorrido: todas las palabras se ven nítidas y no se dibuja marcador, salvo en
// modo manual, donde manda quien lo usa y el cambio es instantáneo.

// Lo que tarda el marcador en pasar de una palabra a la siguiente, con el dial al máximo.
const TRANSICION = 0.5

export default function FocoPalabras({
  frase,
  pausa = 1.4,
  desenfoque = 5,
  marco = 'esquinas',
  color = '#60a5fa',
  manual = false,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const marcador = useRef(null)
  const palabras = frase.trim().split(/\s+/)
  const [activa, setActiva] = useState(0)
  const [dentro, setDentro] = useState(true)

  // En modo solo con el dial a cero no hay recorrido, y entonces tampoco foco.
  const quieto = !manual && g === 0
  // Cuanto más bajo el dial, más lento: con 0,3 (movimiento reducido) tarda 1,6 s.
  const trans = g > 0 ? Math.min(TRANSICION / g, 1.6) : 0

  const colocar = useCallback(() => {
    const m = marcador.current
    const p = raiz.current?.querySelector(`[data-i="${activa}"]`)
    if (!m || !p) return
    m.style.transform = `translate(${p.offsetLeft}px, ${p.offsetTop}px)`
    m.style.width = `${p.offsetWidth}px`
    m.style.height = `${p.offsetHeight}px`
  }, [activa])

  // Antes de pintar: el marcador no puede enseñarse un fotograma en su sitio viejo.
  useLayoutEffect(() => {
    colocar()
    const m = marcador.current
    if (!m || m.classList.contains('fp-listo')) return
    // Punto 3: las transiciones se encienden cuando ya está colocado.
    const id = requestAnimationFrame(() => m.classList.add('fp-listo'))
    return () => cancelAnimationFrame(id)
  }, [colocar, frase, marco])

  // Punto 2: si la caja cambia de ancho o llegan las fuentes, hay que volver a medir.
  useEffect(() => {
    const el = raiz.current
    if (!el) return
    let ro
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(colocar)
      ro.observe(el)
    }
    document.fonts?.ready.then(colocar)
    return () => ro?.disconnect()
  }, [colocar])

  // El recorrido solo corre mientras se ve: animar lo que nadie mira no lo pidió nadie.
  useEffect(() => {
    if (manual || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setDentro(e.isIntersecting), { threshold: 0.2 })
    io.observe(raiz.current)
    return () => io.disconnect()
  }, [manual])

  useEffect(() => {
    if (manual || quieto || !dentro) return
    const id = setTimeout(() => setActiva((i) => (i + 1) % palabras.length), (pausa + trans) * 1000)
    return () => clearTimeout(id)
  }, [activa, manual, quieto, dentro, pausa, trans, palabras.length])

  // Si la frase se acorta y la palabra activa ya no existe, se vuelve a la primera.
  useEffect(() => {
    if (activa >= palabras.length) setActiva(0)
  }, [activa, palabras.length])

  const alTeclear = (e) => {
    const n = palabras.length
    const sig = {
      ArrowRight: (activa + 1) % n,
      ArrowDown: (activa + 1) % n,
      ArrowLeft: (activa - 1 + n) % n,
      ArrowUp: (activa - 1 + n) % n,
      Home: 0,
      End: n - 1,
    }[e.key]
    if (sig === undefined) return
    e.preventDefault()
    setActiva(sig)
  }

  return (
    <span
      ref={raiz}
      className={`fp fp--${marco}${quieto ? ' fp--quieto' : ''} ${className}`.trim()}
      style={{
        '--fp-color': color,
        '--fp-desenfoque': `${desenfoque}px`,
        '--fp-trans': `${trans.toFixed(2)}s`,
        ...style,
      }}
      tabIndex={manual ? 0 : undefined}
      onKeyDown={manual ? alTeclear : undefined}
    >
      {palabras.map((p, i) => (
        <span key={`${i}-${p}`}>
          <span
            data-i={i}
            className={`fp-palabra${i === activa ? ' fp-activa' : ''}`}
            onMouseEnter={manual ? () => setActiva(i) : undefined}
          >
            {p}
          </span>{' '}
        </span>
      ))}
      <span ref={marcador} className="fp-marcador" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
    </span>
  )
}
