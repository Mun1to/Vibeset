import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './TextoOrbita.css'

// Texto que da vueltas sobre una forma. Código PROPIO, escrito desde cero.
//
// Un sello giratorio o una cinta ondulada con el lema de la marca. El texto se escribe
// sobre un trazo de SVG (`<textPath>`) y se mueve por él en bucle, sin que se note dónde
// acaba y empieza.
//
// Cómo se consigue que no se note, que es la parte difícil:
//
//   1. Se MIDE una copia del texto (`getComputedTextLength`) en un elemento oculto y se
//      repite hasta llenar el trazo y una copia más. Nada se supone: con otra tipografía o
//      con un texto más largo, las cuentas se rehacen solas, y se vuelven a hacer cuando
//      acaba de cargar la fuente (con la fuente de reserva, la medida es otra).
//   2. En el CÍRCULO, el texto se estira (`textLength`, con espacio entre letras) justo a lo
//      que mide la circunferencia, y lo que gira es el grupo entero. Un texto sobre un
//      trazo cerrado no da la vuelta por sí mismo: lo que se pasa del final se corta.
//   3. En la ONDA, que es un trazo abierto, se mueve el comienzo del texto
//      (`startOffset`) de 0 a -(una copia) y se vuelve a 0. Como cada copia es idéntica, el
//      salto no se ve. Es el mismo truco de la cinta de logos, doblado sobre una curva.
//   4. Lo mueve un solo `requestAnimationFrame` que escribe UN atributo por fotograma, con
//      el tiempo real entre fotogramas: la velocidad es la misma en una pantalla de 60 Hz
//      que en una de 144, y si la pestaña se queda dormida no se dispara al volver.
//   5. El texto va en un `<svg role="img">` con su `aria-label`: un lector lo lee una vez,
//      entero, y no letra a letra mientras da vueltas. Y se puede parar con un botón, y se
//      detiene solo fuera de pantalla: lo que se mueve solo exige poder pararlo.
//
// El dial (`gain`) multiplica la velocidad. A cero el texto queda quieto y legible.

const CIRCULO = 'M 100 100 m -78 0 a 78 78 0 1 1 156 0 a 78 78 0 1 1 -156 0'
const ONDA = 'M 0 62 C 90 -6 170 130 300 62 S 510 -6 600 62'
const LONGITUD_CIRCULO = 2 * Math.PI * 78

const TEXTO = {
  es: { pausar: 'Pausar el texto', reanudar: 'Reanudar el texto' },
  en: { pausar: 'Pause the text', reanudar: 'Resume the text' },
}

export default function TextoOrbita({
  texto,
  forma = 'circulo',
  separador = ' · ',
  velocidad = 40,
  sentido = 'horario',
  contorno = false,
  centro,
  botonPausa = true,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const idTrazo = useId()
  const raiz = useRef(null)
  const medidor = useRef(null)
  const grupo = useRef(null)
  const sobreTrazo = useRef(null)
  const x = useRef(0)
  const [medida, setMedida] = useState({ una: 0, copias: 3 })
  const [pausado, setPausado] = useState(false)
  const [visible, setVisible] = useState(true)

  const circulo = forma === 'circulo'
  const trazo = circulo ? CIRCULO : ONDA
  const largo = circulo ? LONGITUD_CIRCULO : 660 // la onda mide un poco más que su ancho
  const copiaTexto = `${texto}${separador}`

  // Punto 1: se mide una copia y se repite hasta llenar el trazo y una más.
  useLayoutEffect(() => {
    const medir = () => {
      const una = medidor.current?.getComputedTextLength() ?? 0
      // En el círculo se redondea (el texto se estira o se encoge un poco hasta la
      // circunferencia, y redondeando el ajuste es el menor posible); en la onda se
      // sube, porque ahí sobrar no cuesta nada y faltar deja un hueco.
      if (una > 0) setMedida({ una, copias: circulo ? Math.max(Math.round(largo / una), 1) : Math.ceil(largo / una) + 1 })
    }
    medir()
    document.fonts?.ready.then(medir)
  }, [copiaTexto, largo, circulo])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !raiz.current) return
    const io = new IntersectionObserver((es) => setVisible(es[es.length - 1].isIntersecting), { threshold: 0.01 })
    io.observe(raiz.current)
    return () => io.disconnect()
  }, [])

  const rueda = g > 0 && velocidad > 0 && !pausado && visible && medida.una > 0
  const signo = sentido === 'horario' ? 1 : -1

  // Punto 4: un solo bucle, un solo atributo por fotograma, con el tiempo real.
  useEffect(() => {
    const aplicar = () => {
      if (circulo) {
        grupo.current?.setAttribute('transform', `rotate(${(x.current / LONGITUD_CIRCULO) * 360} 100 100)`)
      } else {
        // Si antes era un círculo, el grupo conserva su giro: se quita, o la onda sale de canto.
        grupo.current?.removeAttribute('transform')
        const una = medida.una
        const desp = una > 0 ? -(((x.current % una) + una) % una) : 0
        sobreTrazo.current?.setAttribute('startOffset', String(desp))
      }
    }
    aplicar()
    if (!rueda) return
    let id = 0
    let previo = 0
    const paso = (t) => {
      const dt = previo ? Math.min((t - previo) / 1000, 0.1) : 0
      previo = t
      x.current += velocidad * g * signo * dt
      aplicar()
      id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [rueda, circulo, velocidad, g, signo, medida.una])

  const cuerpo = copiaTexto.repeat(medida.copias)

  return (
    <div ref={raiz} className={`to to--${forma}${contorno ? ' to--contorno' : ''} ${className}`.trim()} style={style}>
      <div className="to-lienzo">
        {/* Punto 5: una sola imagen con el texto como nombre. */}
        <svg
          className="to-svg"
          viewBox={circulo ? '0 0 200 200' : '0 0 600 124'}
          role="img"
          aria-label={texto}
        >
          <defs>
            <path id={idTrazo} d={trazo} fill="none" />
          </defs>
          {/* Medidor: una copia sin pintar, solo para saber cuánto ocupa. */}
          <text ref={medidor} className="to-texto" visibility="hidden" aria-hidden="true">{copiaTexto}</text>
          <g ref={grupo}>
            <text className="to-texto" aria-hidden="true">
              <textPath
                ref={sobreTrazo}
                href={`#${idTrazo}`}
                {...(circulo ? { textLength: LONGITUD_CIRCULO, lengthAdjust: 'spacing' } : { startOffset: 0 })}
              >
                {cuerpo}
              </textPath>
            </text>
          </g>
        </svg>
        {centro && <div className="to-centro">{centro}</div>}
      </div>

      {botonPausa && g > 0 && (
        <button type="button" className="to-pausa" onClick={() => setPausado((p) => !p)}>
          {pausado ? txt.reanudar : txt.pausar}
        </button>
      )}
    </div>
  )
}
