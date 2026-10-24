import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './MiraCursor.css'

// Una mira que sigue al puntero sobre una zona. Código PROPIO, escrito desde cero.
//
// Dos líneas que cruzan la zona por donde está el puntero, con sus coordenadas, un marco
// que se cierra sobre lo que se señala y un pulso al pulsar. Es para la portada de una
// herramienta técnica, de cartografía o de juego, donde apuntar es parte de la
// experiencia; en una web de contenido es ruido.
//
// Lo que importa, que es lo que cuesta dejarla bien:
//
//   1. Es DECORACIÓN SOBRE EL RATÓN, y se comporta como tal. La capa de la mira lleva
//      `aria-hidden` y `pointer-events: none`: no tapa nada, no recibe nada y un lector no
//      sabe que existe. Lo de debajo (botones, enlaces) es HTML normal y se maneja igual
//      con o sin mira. Solo reacciona al ratón: con el dedo o el teclado no hace nada, y
//      por eso nada puede depender de ella.
//   2. NO esconde el cursor del sistema, salvo que se pida (`ocultarCursor`). Quien necesita
//      ver bien dónde está el puntero lo pierde si se esconde, y la mira se queda como
//      lo que es: un acompañante.
//   3. Sigue con SUAVIZADO, y el bucle solo existe mientras hay distancia que recorrer. Con
//      el ratón quieto, no corre nada. El suavizado se corrige con el tiempo real entre
//      fotogramas, para que en 144 Hz se sienta igual que en 60.
//   4. «Bloqueo»: si el puntero pasa por un elemento marcado con `data-mira="Nombre"`, la
//      mira se centra en él, un marco de cuatro esquinas se cierra sobre su caja y la
//      etiqueta dice su nombre en lugar de las coordenadas. Marcar un elemento es una
//      línea de HTML y no hay que registrarlo en ningún sitio.
//   5. La etiqueta de coordenadas se da la vuelta en los bordes (a la izquierda cerca del
//      borde derecho, encima cerca del inferior), o se saldría de la zona y se cortaría.
//
// El dial (`gain`) alarga el suavizado y apaga el pulso. A cero la mira sigue al puntero
// sin retraso y sin pulso.

export default function MiraCursor({
  children,
  trazo = 'continua',
  coordenadas = true,
  bloqueo = true,
  pulso = true,
  suavizado = 0.5,
  ocultarCursor = false,
  color = '#60a5fa',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const zona = useRef(null)
  const capa = useRef(null)
  const etiqueta = useRef(null)
  const marco = useRef(null)
  const e = useRef({ x: 0, y: 0, tx: 0, ty: 0, corre: false, hay: false, caja: null, nombre: '' })
  const [golpe, setGolpe] = useState(null)
  const [enZona, setEnZona] = useState(false)

  const pintar = () => {
    const s = e.current
    const c = capa.current
    if (!c) return
    c.style.setProperty('--mc-x', `${s.x.toFixed(1)}px`)
    c.style.setProperty('--mc-y', `${s.y.toFixed(1)}px`)
    // Punto 5: la etiqueta se da la vuelta en los bordes.
    const z = zona.current
    const alDer = z && s.x > z.clientWidth - 150
    const abajo = z && s.y > z.clientHeight - 36
    etiqueta.current?.setAttribute('data-der', alDer ? 'true' : 'false')
    etiqueta.current?.setAttribute('data-abajo', abajo ? 'true' : 'false')
  }

  const correr = () => {
    const s = e.current
    if (s.corre) return
    s.corre = true
    let previo = 0
    const paso = (t) => {
      const dt = previo ? Math.min((t - previo) / 1000, 0.1) : 1 / 60
      previo = t
      // Punto 3: el suavizado, corregido con el tiempo real.
      const base = 1 / (1 + 12 * suavizado * g)
      const f = 1 - Math.pow(1 - base, dt * 60)
      s.x += (s.tx - s.x) * f
      s.y += (s.ty - s.y) * f
      pintar()
      if (Math.abs(s.tx - s.x) < 0.2 && Math.abs(s.ty - s.y) < 0.2) {
        s.x = s.tx
        s.y = s.ty
        s.corre = false
        pintar()
        return
      }
      requestAnimationFrame(paso)
    }
    requestAnimationFrame(paso)
  }

  const colocarMarco = (caja) => {
    const m = marco.current
    if (!m) return
    if (!caja) {
      m.style.opacity = '0'
      return
    }
    m.style.opacity = '1'
    m.style.transform = `translate(${caja.x}px, ${caja.y}px)`
    m.style.width = `${caja.w}px`
    m.style.height = `${caja.h}px`
  }

  const alMover = (ev) => {
    if (ev.pointerType !== 'mouse' || !zona.current) return
    const z = zona.current.getBoundingClientRect()
    const s = e.current
    let tx = ev.clientX - z.left
    let ty = ev.clientY - z.top
    let nombre = ''
    let caja = null
    // Punto 4: si el puntero pasa por un elemento marcado, la mira se centra en él.
    if (bloqueo) {
      const objetivo = ev.target.closest?.('[data-mira]')
      if (objetivo && zona.current.contains(objetivo)) {
        const r = objetivo.getBoundingClientRect()
        caja = { x: r.left - z.left, y: r.top - z.top, w: r.width, h: r.height }
        tx = caja.x + caja.w / 2
        ty = caja.y + caja.h / 2
        nombre = objetivo.getAttribute('data-mira')
      }
    }
    s.tx = tx
    s.ty = ty
    s.nombre = nombre
    colocarMarco(caja)
    if (etiqueta.current) {
      etiqueta.current.textContent = nombre || `x ${Math.round(ev.clientX - z.left)}  y ${Math.round(ev.clientY - z.top)}`
    }
    if (!s.hay) {
      // La primera vez la mira aparece donde está el puntero, sin viajar desde la esquina.
      s.x = tx
      s.y = ty
      s.hay = true
      setEnZona(true)
      pintar()
      return
    }
    if (suavizado * g === 0) {
      s.x = tx
      s.y = ty
      pintar()
    } else {
      correr()
    }
  }

  const alSalir = () => {
    e.current.hay = false
    setEnZona(false)
    colocarMarco(null)
  }

  const alPulsar = (ev) => {
    if (!pulso || g === 0 || ev.pointerType !== 'mouse' || !zona.current) return
    const z = zona.current.getBoundingClientRect()
    setGolpe({ n: (golpe?.n ?? 0) + 1, x: ev.clientX - z.left, y: ev.clientY - z.top })
  }

  // Si el trazo, el bloqueo o lo que sea cambia, lo que quedara en pantalla se retira.
  useEffect(() => {
    if (!bloqueo) colocarMarco(null)
  }, [bloqueo])

  return (
    <div
      ref={zona}
      className={`mc mc--${trazo}${ocultarCursor ? ' mc--sin-cursor' : ''}${enZona ? ' mc--dentro' : ''} ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      onPointerDown={alPulsar}
      style={{ '--mc-color': color, ...style }}
    >
      {children}

      {/* Punto 1: la capa de la mira no se ve para un lector ni recibe el puntero. */}
      <div ref={capa} className="mc-capa" aria-hidden="true">
        <span className="mc-linea mc-v" />
        <span className="mc-linea mc-h" />
        <span ref={marco} className="mc-marco"><i /><i /><i /><i /></span>
        <span ref={etiqueta} className="mc-etiqueta" hidden={!coordenadas} data-der="false" data-abajo="false" />
        {golpe && (
          <span
            key={golpe.n}
            className="mc-pulso"
            style={{ left: golpe.x, top: golpe.y }}
            onAnimationEnd={() => setGolpe(null)}
          />
        )}
      </div>
    </div>
  )
}
