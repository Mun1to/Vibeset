import { useId, useState } from 'react'
import { useGain } from './movimiento'
import './NotaAsoma.css'

// Valoración con etiqueta que asoma. Código PROPIO, escrito desde cero.
//
// Cinco iconos para dar una nota. Al pasar por encima, el icono se levanta y sobre él
// asoma una palabra («Buena»): una nota de 1 a 5 sin contexto es un número, con la
// palabra es una opinión.
//
// Lo que no se ve:
//
//   1. Es un RADIOGROUP de verdad. Cada icono es un `role="radio"` con su nota en el
//      nombre («4 de 5: Buena»), solo uno está en el orden del tabulador y las
//      flechas mueven la nota, como en cualquier grupo de botones de radio. Un
//      montón de divs con `onClick` no tiene nada de esto.
//   2. Admite MEDIAS. En modo de solo lectura `valor` puede ser 4,3 y la última
//      estrella se rellena un 30 %, recortando una copia encima de otra. Una media
//      redondeada a 4 miente en un decimal que a la gente le importa.
//   3. La etiqueta es UNA sola, que se desplaza entre iconos, y no una por icono
//      que aparece y desaparece. Y se enseña tanto con ratón como con foco de
//      teclado, que si no el teclado se queda sin la palabra.
//   4. Lo que se elige se anuncia (una región `status`) y se puede borrar con
//      Escape, Retroceso o Supr, o volviendo a pulsar la misma nota si `borrable`.
//
// El dial (`gain`) baja la altura a la que se levanta el icono y acorta el traslado
// de la etiqueta. A cero no se levanta ni se desliza: la etiqueta aparece y ya.

const ICONOS = {
  estrella: {
    color: '#fbbf24',
    d: 'M12 3 L14.7 8.9 L21.2 9.6 L16.4 14 L17.7 20.4 L12 17.2 L6.3 20.4 L7.6 14 L2.8 9.6 L9.3 8.9 Z',
  },
  corazon: {
    color: '#fb7185',
    d: 'M12 20.4 C12 20.4 3.2 15.2 3.2 9 C3.2 6.3 5.3 4.4 7.7 4.4 C9.5 4.4 11 5.4 12 7 C13 5.4 14.5 4.4 16.3 4.4 C18.7 4.4 20.8 6.3 20.8 9 C20.8 15.2 12 20.4 12 20.4 Z',
  },
  rayo: {
    color: '#60a5fa',
    d: 'M13.5 2.5 L5 13.5 H11 L10 21.5 L19 10 H12.5 Z',
  },
}

const TEXTO = {
  es: {
    rotulo: 'Valoración',
    etiquetas: ['Muy mala', 'Mala', 'Normal', 'Buena', 'Excelente'],
    de: (n, max) => `${n} de ${max}`,
    elegida: (n, max, e) => `Has puesto ${n} de ${max}${e ? `: ${e}` : ''}`,
    borrada: 'Has borrado tu valoración',
  },
  en: {
    rotulo: 'Rating',
    etiquetas: ['Very poor', 'Poor', 'Okay', 'Good', 'Excellent'],
    de: (n, max) => `${n} of ${max}`,
    elegida: (n, max, e) => `You rated ${n} of ${max}${e ? `: ${e}` : ''}`,
    borrada: 'You cleared your rating',
  },
}

export default function NotaAsoma({
  valor,
  valorInicial = 0,
  max = 5,
  icono = 'estrella',
  etiquetas,
  rotulo,
  soloLectura = false,
  borrable = true,
  idioma = 'es',
  onCambio,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const forma = ICONOS[icono] ?? ICONOS.estrella
  const palabras = etiquetas ?? (max === 5 ? txt.etiquetas : [])
  const nombre = rotulo ?? txt.rotulo
  const idGrupo = useId()

  const [interno, setInterno] = useState(valorInicial)
  const [encima, setEncima] = useState(0) // icono bajo el ratón (1..max), 0 si ninguno
  const [foco, setFoco] = useState(0) // icono con foco de teclado, 0 si ninguno
  const [anuncio, setAnuncio] = useState('')
  const actual = valor ?? interno

  const poner = (n) => {
    if (valor === undefined) setInterno(n)
    setAnuncio(n === 0 ? txt.borrada : txt.elegida(n, max, palabras[n - 1]))
    onCambio?.(n)
  }

  const cifras = (n) => (Number.isInteger(n) ? String(n) : n.toLocaleString(idioma === 'en' ? 'en-US' : 'es-ES', { maximumFractionDigits: 1 }))

  // Un icono con su relleno parcial: punto 2. Un ancho de 0 a 1 de la copia de arriba.
  // Es una función que devuelve JSX y no un componente: definir un componente dentro
  // del render crea un tipo nuevo en cada pintado y React lo desmonta y lo monta.
  const dibujar = (relleno) => (
    <span className="na-icono">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="na-contorno">
        <path d={forma.d} strokeLinejoin="round" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="na-lleno"
        style={{ clipPath: `inset(0 ${(1 - relleno) * 100}% 0 0)` }}
      >
        <path d={forma.d} strokeLinejoin="round" />
      </svg>
    </span>
  )

  const estilo = {
    '--na-c': forma.color,
    '--na-lift': `${(3 * g).toFixed(2)}px`,
    '--na-mov': `${(g > 0 ? Math.min(0.2 / g, 0.6) : 0).toFixed(2)}s`,
    '--na-n': max,
    ...style,
  }

  // Punto 2: la media, solo lectura, con relleno parcial.
  if (soloLectura) {
    return (
      <span
        className={`na na--lectura ${className}`.trim()}
        role="img"
        aria-label={`${nombre}: ${txt.de(cifras(actual), max)}`}
        style={estilo}
      >
        {Array.from({ length: max }, (_, i) => (
          <span className="na-celda" key={i}>
            {dibujar(Math.min(Math.max(actual - i, 0), 1))}
          </span>
        ))}
      </span>
    )
  }

  const mostrado = encima || foco || 0
  const lleno = encima || actual

  const alTeclear = (e, i) => {
    let sig
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') sig = Math.min(i + 1, max)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') sig = Math.max(i - 1, 1)
    else if (e.key === 'Home') sig = 1
    else if (e.key === 'End') sig = max
    else if (borrable && (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Delete')) sig = 0
    else return
    e.preventDefault()
    // Si el ratón sigue encima de otro icono, el teclado manda desde que se usa.
    setEncima(0)
    poner(sig)
    // Mueve el foco al icono nuevo, que es lo que hace un grupo de radio nativo.
    if (sig > 0) document.getElementById(`${idGrupo}-${sig}`)?.focus()
  }

  // Solo uno está en el tabulador: el elegido, o el primero si no hay ninguno.
  const tabulable = actual > 0 ? Math.round(actual) : 1

  return (
    <span className={`na ${className}`.trim()} style={estilo}>
      <span
        className="na-grupo"
        role="radiogroup"
        aria-label={nombre}
        onMouseLeave={() => setEncima(0)}
      >
        {Array.from({ length: max }, (_, k) => {
          const i = k + 1
          return (
            <button
              key={i}
              id={`${idGrupo}-${i}`}
              type="button"
              role="radio"
              className={`na-boton${i <= lleno ? ' na-on' : ''}${i === mostrado ? ' na-arriba' : ''}`}
              aria-checked={i === Math.round(actual)}
              aria-label={`${txt.de(i, max)}${palabras[k] ? `: ${palabras[k]}` : ''}`}
              tabIndex={i === tabulable ? 0 : -1}
              onMouseEnter={() => setEncima(i)}
              onFocus={() => setFoco(i)}
              onBlur={() => setFoco(0)}
              onClick={() => poner(borrable && i === Math.round(actual) ? 0 : i)}
              onKeyDown={(e) => alTeclear(e, i)}
            >
              {dibujar(1)}
            </button>
          )
        })}
      </span>

      {/* Punto 3: una sola etiqueta que viaja, visible con ratón y con teclado. */}
      {palabras.length > 0 && (
        <span
          className={`na-etiqueta${mostrado ? ' na-visible' : ''}`}
          style={{ '--na-i': mostrado || Math.max(Math.round(actual), 1) }}
          aria-hidden="true"
        >
          {palabras[(mostrado || Math.max(Math.round(actual), 1)) - 1]}
        </span>
      )}

      <span className="na-lector" role="status">{anuncio}</span>
    </span>
  )
}
