import { useRef } from 'react'
import { useGain } from './movimiento'
import './CartaMetal.css'

// Credencial de metal que refleja una luz que se mueve. Código PROPIO, escrito desde cero.
//
// Una tarjeta de identificación (una licencia, un pase, un carné) que parece de acero
// cepillado: su superficie refleja una luz que se desplaza según donde pongas el puntero,
// con las vetas del cepillado cruzándola. Es solo CSS, y no pide la cámara.
//
// Cómo se hace, y qué se evita:
//
//   1. El metal es una pila de capas de fondo, sin elementos extra: el cepillado (rayas
//      finísimas verticales, claras y oscuras), el reflejo (un degradado angular enorme
//      que se desplaza), el brillo puntual bajo el puntero y la base. La posición del
//      puntero es lo único que escribe JavaScript, en dos variables.
//   2. El reflejo se mueve con `background-position`, no con una transformación de la
//      tarjeta: la tarjeta no se inclina ni se desplaza (para eso está la tarjeta
//      holográfica), solo cambia la luz que la recorre. Es lo que la hace sentir
//      pesada y metálica y no una pegatina.
//   3. El texto va en OSCURO sobre un metal que se mantiene claro en todo su recorrido. Con
//      un reflejo que pasase por grises medios el texto cruzaría el contraste mínimo en
//      mitad del movimiento; los tonos del degradado están elegidos para que no pase.
//   4. No usa la cámara ni nada que pida un permiso: una tarjeta de metal que pide mirar
//      a quien la ve es un truco de feria, no una función. Es el mismo HTML de siempre.
//
// El dial (`gain`) acorta la transición con la que el reflejo sigue al puntero. A cero, el
// reflejo se queda quieto en su posición de reposo.

export default function CartaMetal({
  titulo,
  subtitulo,
  datos = [],
  sello,
  brillo = 0.7,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
  children,
}) {
  const g = useGain(gain)
  const ref = useRef(null)

  const luz = (px, py) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--cm-px', px.toFixed(3))
    el.style.setProperty('--cm-py', py.toFixed(3))
  }

  const alMover = (e) => {
    if (g === 0 || e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    luz(Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1), Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1))
  }

  return (
    <article
      ref={ref}
      className={`cm${g === 0 ? ' cm--quieta' : ''} ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={() => luz(0.35, 0.25)}
      lang={idioma}
      style={{
        '--cm-px': 0.35,
        '--cm-py': 0.25,
        '--cm-brillo': brillo,
        '--cm-sigue': `${(g > 0 ? Math.min(0.25 / g, 0.8) : 0).toFixed(2)}s`,
        ...style,
      }}
    >
      <div className="cm-contenido">
        <header className="cm-cabecera">
          <div>
            <h3 className="cm-titulo">{titulo}</h3>
            {subtitulo && <p className="cm-subtitulo">{subtitulo}</p>}
          </div>
          {sello && <span className="cm-sello" aria-hidden="true">{sello}</span>}
        </header>

        {datos.length > 0 && (
          <dl className="cm-datos">
            {datos.map((d) => (
              <div key={d.etiqueta} className="cm-dato">
                <dt>{d.etiqueta}</dt>
                <dd>{d.valor}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </article>
  )
}
