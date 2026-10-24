import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './CintaLogos.css'

// Cinta infinita de logos o de nombres. Código PROPIO, escrito desde cero.
//
// La franja de «hecho con» o «lo usan». Es movimiento que nadie ha pedido y que no
// para solo, así que lo importante no es que ruede sino que se pueda parar, que no
// gaste lo que nadie mira y que no se vea el empalme.
//
// Lo que hay debajo:
//
//   1. El bucle es CSS puro: una pista que se desplaza justo lo que mide UNA copia de
//      la lista y vuelve a empezar. Como cada copia es idéntica y la distancia es su
//      ancho exacto, el salto no se nota. El JavaScript solo MIDE (cuánto mide una
//      copia y cuántas hacen falta para llenar la caja) y no mueve nada.
//   2. Cada copia lleva el hueco entre elementos también AL FINAL, dentro de su
//      anchura. Con el hueco solo entre elementos, la última de una copia se pegaría
//      a la primera de la siguiente y el bucle daría un tirón.
//   3. Solo la primera copia existe para un lector de pantalla y para el tabulador: el
//      resto va `aria-hidden` e `inert`. Si no, oiría la lista tres veces y el foco
//      recorrería enlaces que son el mismo.
//   4. Se puede PARAR, que no es opcional: lo que se mueve solo más de cinco segundos
//      exige un control para pausarlo (WCAG 2.2.2). Hay un botón, y además se detiene
//      al pasar el ratón, al enfocar con teclado y cuando sale de pantalla.
//   5. Con el dial a cero la cinta no rueda y se puede desplazar a mano, para que
//      ningún elemento quede fuera de alcance.
//
// El dial (`gain`) multiplica la velocidad: con movimiento reducido (0,3) va al 30 %.

const TEXTO = {
  es: { pausar: 'Pausar la cinta', reanudar: 'Reanudar la cinta', rotulo: 'Cinta de logos' },
  en: { pausar: 'Pause the ribbon', reanudar: 'Resume the ribbon', rotulo: 'Logo ribbon' },
}

export default function CintaLogos({
  items,
  velocidad = 60,
  direccion = 'izquierda',
  hueco = 48,
  alPasar = 'pausa',
  fundido = true,
  botonPausa = true,
  rotulo,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const raiz = useRef(null)
  const copia = useRef(null)
  const [medida, setMedida] = useState({ ancho: 0, copias: 2 })
  const [pausado, setPausado] = useState(false)
  const [visible, setVisible] = useState(true)

  // Punto 1: solo se mide. Cuánto mide una copia y cuántas llenan la caja más una.
  useLayoutEffect(() => {
    const medir = () => {
      const ancho = copia.current?.offsetWidth ?? 0
      const caja = raiz.current?.clientWidth ?? 0
      if (!ancho) return
      setMedida({ ancho, copias: Math.max(2, Math.ceil(caja / ancho) + 1) })
    }
    medir()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medir)
    if (raiz.current) ro.observe(raiz.current)
    if (copia.current) ro.observe(copia.current)
    return () => ro.disconnect()
  }, [items, hueco])

  // Lo que sale de pantalla se para.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !raiz.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(raiz.current)
    return () => io.disconnect()
  }, [])

  const rueda = g > 0 && velocidad > 0
  const dur = rueda && medida.ancho ? medida.ancho / (velocidad * g) : 0
  // Quieta, una sola copia: repetirla solo serviría para que la cinta se viera
  // llena de elementos duplicados al desplazarla a mano.
  const copias = rueda ? medida.copias : 1

  const elemento = (it, i) => {
    const contenido = it.imagen ? (
      <img className="ct-imagen" src={it.imagen} alt={it.nombre} loading="lazy" />
    ) : (
      <>
        {it.marca && <span className="ct-marca" aria-hidden="true">{it.marca}</span>}
        <span className="ct-nombre">{it.nombre}</span>
      </>
    )
    return (
      <li className="ct-item" key={i}>
        {it.href ? (
          <a className="ct-enlace" href={it.href} target="_blank" rel="noreferrer">{contenido}</a>
        ) : (
          <span className="ct-enlace">{contenido}</span>
        )}
      </li>
    )
  }

  return (
    <div
      className={`ct${rueda ? '' : ' ct--quieto'}${dur > 0 ? ' ct--anima' : ''}${fundido ? ' ct--fundido' : ''}${alPasar === 'pausa' ? ' ct--pausa-al-pasar' : ''}${pausado || !visible ? ' ct--parada' : ''} ${className}`.trim()}
      style={{
        '--ct-hueco': `${hueco}px`,
        '--ct-ancho': `${medida.ancho}px`,
        '--ct-dur': `${dur.toFixed(2)}s`,
        '--ct-sentido': direccion === 'derecha' ? 'reverse' : 'normal',
        ...style,
      }}
    >
      <div ref={raiz} className="ct-ventana" role="group" aria-label={rotulo ?? txt.rotulo}>
        <div className="ct-pista">
          {Array.from({ length: copias }, (_, c) => (
            // Punto 3: solo la primera copia existe para lectores y para el tabulador.
            <ul
              key={c}
              ref={c === 0 ? copia : undefined}
              className="ct-copia"
              aria-hidden={c > 0 || undefined}
              inert={c > 0}
            >
              {items.map(elemento)}
            </ul>
          ))}
        </div>
      </div>

      {/* Punto 4: parar lo que se mueve solo. */}
      {botonPausa && rueda && (
        <button
          type="button"
          className="ct-pausa"
          onClick={() => setPausado((p) => !p)}
        >
          {pausado ? txt.reanudar : txt.pausar}
        </button>
      )}
    </div>
  )
}
