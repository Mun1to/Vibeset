import { useRef } from 'react'
import { useGain } from './movimiento'
import './TarjetaHolo.css'

// Tarjeta de presentación con inclinación 3D y brillo holográfico. Código PROPIO,
// escrito desde cero.
//
// Una tarjeta para una persona o un equipo que reacciona al puntero: se inclina hacia
// donde se la mira, una capa de brillo con colores desplazados sigue al puntero como
// el holograma de una tarjeta de coleccionista, y el avatar y el texto se mueven un
// poco a distinto ritmo para dar profundidad.
//
// Cómo es por dentro, que es lo que la hace barata:
//
//   1. NO hay bucle de animación. El puntero escribe dos números (su posición relativa a
//      la tarjeta, de 0 a 1) en variables de CSS, y TODO lo demás (la inclinación, el
//      brillo, el parallax) es una cuenta de CSS sobre esas variables. El suavizado lo
//      pone una `transition`, no un `requestAnimationFrame`. Cuesta una escritura de
//      estilo por movimiento del ratón y ninguna comparación en JavaScript.
//   2. La inclinación se reparte entre dos ejes con la misma cuenta: la posición menos
//      la mitad, por el ángulo máximo. En el centro la tarjeta está plana, y en una
//      esquina llega justo al máximo, sin saltos.
//   3. Al soltar el puntero (salir de la tarjeta) las variables vuelven al centro con
//      una transición más lenta que la de seguir: la tarjeta se posa, no se cae.
//   4. El brillo es un adorno y no lleva contenido: va `aria-hidden` y con
//      `pointer-events: none`, y debajo el texto y el botón son HTML normal. La acción
//      es un enlace o un botón de verdad, con su foco, y con el teclado la tarjeta se
//      queda plana, que no hay puntero al que seguir.
//
// No usa el giroscopio del móvil. En iOS pide un permiso explícito al usuario y eso es
// una decisión de quien la use, no de una pieza suelta; en táctil se inclina mientras se
// arrastra el dedo.
//
// El dial (`gain`) reduce la inclinación y el parallax; a cero la tarjeta no se inclina
// ni se desplaza y el brillo se queda quieto en el centro.

export default function TarjetaHolo({
  nombre,
  cargo,
  usuario,
  estado,
  avatar,
  accion,
  inclinacion = 14,
  brillo = 0.6,
  parallax = 1,
  disposicion = 'vertical',
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)

  const poner = (px, py) => {
    const el = raiz.current
    if (!el) return
    el.style.setProperty('--th-px', px.toFixed(3))
    el.style.setProperty('--th-py', py.toFixed(3))
  }

  const alMover = (e) => {
    if (g === 0 || !raiz.current) return
    const r = raiz.current.getBoundingClientRect()
    const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1)
    const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1)
    raiz.current.classList.remove('th--suelta')
    poner(px, py)
  }

  // Punto 3: al irse el puntero vuelve al centro, más despacio de lo que sigue.
  const alSalir = () => {
    raiz.current?.classList.add('th--suelta')
    poner(0.5, 0.5)
  }

  const iniciales = (nombre ?? '')
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const botonAccion = accion && (
    accion.href ? (
      <a className="th-accion" href={accion.href} target={accion.externo ? '_blank' : undefined} rel={accion.externo ? 'noreferrer' : undefined}>
        {accion.rotulo}
      </a>
    ) : (
      <button type="button" className="th-accion" onClick={accion.onClick}>
        {accion.rotulo}
      </button>
    )
  )

  return (
    <article
      ref={raiz}
      className={`th th--${disposicion}${g === 0 ? ' th--quieta' : ''} ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      onPointerCancel={alSalir}
      style={{
        '--th-px': 0.5,
        '--th-py': 0.5,
        '--th-ang': `${(inclinacion * g).toFixed(2)}deg`,
        '--th-brillo': brillo,
        '--th-par': `${(14 * parallax * g).toFixed(2)}px`,
        ...style,
      }}
      lang={idioma}
    >
      <div className="th-giro">
        <span className="th-holo" aria-hidden="true" />
        <span className="th-luz" aria-hidden="true" />

        <div className="th-contenido">
          <div className="th-avatar" aria-hidden="true">
            {avatar ? <img src={avatar} alt="" width="96" height="96" /> : <span>{iniciales}</span>}
          </div>

          <div className="th-datos">
            <h3 className="th-nombre">{nombre}</h3>
            {cargo && <p className="th-cargo">{cargo}</p>}
            {usuario && <p className="th-usuario">{usuario}</p>}
          </div>

          <div className="th-pie">
            {estado && (
              <span className="th-estado">
                <span className="th-punto" aria-hidden="true" />
                {estado}
              </span>
            )}
            {botonAccion}
          </div>
        </div>
      </div>
    </article>
  )
}
