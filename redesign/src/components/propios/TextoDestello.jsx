import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './TextoDestello.css'

// Texto con un destello que lo cruza. Código PROPIO, escrito desde cero.
//
// El truco es que el destello no es un elemento: es el FONDO del texto. El texto se
// pinta transparente, se le pone detrás un degradado (color base, banda clara, color
// base) y `background-clip: text` recorta ese fondo con la forma de las letras. Mover
// el destello es mover la posición del fondo, y eso lo resuelve el navegador sin que
// React pinte nada: cuesta una animación de CSS y cero fotogramas de JavaScript.
//
// Tres decisiones que no se ven y que son las que separan esto de la versión rápida:
//
//   1. El degradado mide 2,5 veces el texto y se REPITE en horizontal. Con
//      `no-repeat`, en cuanto la banda se aparta, el fondo deja de cubrir el texto y
//      las letras desaparecen (el color es transparente, no hay nada detrás). Con
//      repetición, los bordes del degradado son el color base y el empalme no se ve.
//   2. Las posiciones de salida y de llegada se CALCULAN para dejar la banda entera
//      fuera del texto, contando su anchura y lo que la inclina el ángulo. Si se
//      ponen a ojo (0% y 100%), la banda se queda a medio cruzar y el texto parece
//      tener un brillo pegado en una esquina.
//   3. Con colores forzados (modo de alto contraste de Windows) el navegador quita
//      los fondos, y un texto transparente sin fondo es un texto invisible. Ahí se
//      vuelve al color del sistema y se acabó el efecto.
//
// El dial (`gain`) cambia la velocidad del barrido: más bajo, más lento. A cero el
// texto queda quieto y legible en su color base. Fuera de pantalla el bucle se
// detiene, que animar lo que nadie ve no se lo pidió nadie.

// El degradado mide 2,5 veces el texto; las cuentas de abajo parten de ese número.
const LARGO = 2.5
// Parte del recorrido en que el bucle respira: la banda cruza y se queda fuera.
const BARRIDO = 0.65

export default function TextoDestello({
  children,
  color = '#9aa0aa',
  destello = '#ffffff',
  velocidad = 3,
  angulo = 105,
  ancho = 0.3,
  disparo = 'bucle',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const ref = useRef(null)
  // «En pantalla»: en `bucle` decide si corre o está en pausa; en `vista` es el
  // disparador. En `hover` no se usa.
  const [dentro, setDentro] = useState(false)

  useEffect(() => {
    if (disparo === 'hover') return
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setDentro(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setDentro(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [disparo])

  // Mitad de la banda, medida en anchos de texto: `ancho` es la fracción del
  // degradado que ocupa el destello entero, y el degradado mide LARGO textos.
  const semi = (ancho * LARGO) / 2
  // Lo que se pasa de largo para que la banda salga del todo: inclinada, su borde
  // asoma antes de que su centro llegue. Un ángulo de 90° es una raya vertical.
  const margen = 0.1 + Math.abs(Math.cos((angulo * Math.PI) / 180)) * 0.5
  // Posición del fondo (en %) para tener la banda entera a la derecha y a la izquierda.
  // Con un fondo de LARGO textos, el centro de la banda cae en LARGO/2 - (LARGO - 1) * p:
  // cuanto MAYOR la posición, más a la izquierda queda. El barrido sale por la izquierda
  // y acaba por la derecha, que es el sentido en que se lee.
  const aDerecha = (LARGO / 2 - 1 - semi - margen) / (LARGO - 1)
  const aIzquierda = (LARGO / 2 + semi + margen) / (LARGO - 1)

  const dur = g > 0 ? Math.min(velocidad / g, 14) : 0
  const modo = g === 0 ? 'quieto' : disparo

  const clases = [
    'td',
    `td--${modo}`,
    modo === 'bucle' && !dentro ? 'td--fuera' : '',
    modo === 'vista' && dentro ? 'td--activo' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      ref={ref}
      className={clases}
      style={{
        '--td-color': color,
        '--td-destello': destello,
        '--td-angulo': `${angulo}deg`,
        '--td-semi': `${(semi / LARGO) * 100}%`,
        '--td-ini': `${(aIzquierda * 100).toFixed(1)}%`,
        '--td-fin': `${(aDerecha * 100).toFixed(1)}%`,
        '--td-dur': `${dur.toFixed(2)}s`,
        '--td-dur-bucle': `${(dur / BARRIDO).toFixed(2)}s`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
