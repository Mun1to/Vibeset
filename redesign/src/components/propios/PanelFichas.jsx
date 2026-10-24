import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './PanelFichas.css'

// Panel de aeropuerto: letras que giran como fichas hasta formar cada palabra. Código
// PROPIO, escrito desde cero.
//
// Una ficha de panel mecánico tiene dos mitades fijas (la de arriba enseña la letra que
// llega, la de abajo la que se va) y dos aletas que giran: la de arriba cae hasta quedar
// de canto y, a mitad de camino, la de abajo termina de bajar con la letra nueva. Eso es
// todo el truco, y se hace con cuatro capas y dos animaciones de CSS por ficha.
//
// Lo que hay que resolver alrededor, y que no se ve:
//
//   1. Cada ficha pasa por el abecedario ENTERO desde donde está hasta su letra, como un
//      panel de verdad. Pero de una A a una Z son veinticinco giros, y con 70 ms cada uno
//      son casi dos segundos de ruido: el recorrido se recorta a `maxPasos` giros, que
//      empiezan ya cerca del destino. Se ve girar sin tener que esperar.
//   2. Las fichas arrancan escalonadas (`escalon` ms entre una y la siguiente): todas a la
//      vez parece un parpadeo, de izquierda a derecha parece que alguien lo escribe.
//   3. La palabra final está SIEMPRE en el DOM como texto: el contenedor es una imagen
//      con `aria-label` de la palabra, y las fichas van ocultas. Un lector no oye veinte
//      letras por segundo, oye una palabra, y no se la anuncia cada vez (no es `aria-live`).
//   4. Como cambia sola, se puede PARAR: un botón, y se detiene también fuera de pantalla.
//      Lo que cambia solo más de cinco segundos exige un control para pausarlo.
//   5. Si el destino trae una letra que el abecedario no tiene (una Ñ, un acento), se
//      añade al final: pasa por todas y aterriza, en vez de quedarse sin llegar.
//
// El dial (`gain`) acelera o frena los giros. A cero las palabras cambian de golpe, sin
// giro, y el panel no cambia solo: se queda en la primera palabra.

const ABECEDARIO = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const TEXTO = {
  es: { pausar: 'Pausar el panel', reanudar: 'Reanudar el panel', rotulo: 'Panel' },
  en: { pausar: 'Pause the board', reanudar: 'Resume the board', rotulo: 'Board' },
}

// Punto 1 y punto 5: las letras por las que pasa una ficha de `desde` a `hasta`.
function recorrido(desde, hasta, abecedario, maxPasos) {
  const arr = [...abecedario]
  for (const c of [desde, hasta]) if (!arr.includes(c)) arr.push(c)
  const n = arr.length
  const d = (arr.indexOf(hasta) - arr.indexOf(desde) + n) % n
  if (d === 0) return []
  const pasos = Math.min(d, maxPasos)
  const fin = arr.indexOf(hasta)
  return Array.from({ length: pasos }, (_, k) => arr[(fin - pasos + k + 1 + n * 2) % n])
}

function Ficha({ destino, retraso, paso, abecedario, maxPasos, quieto }) {
  // Al montarse, la ficha parte en blanco y gira hasta su letra: ver llegar la primera
  // palabra es la mitad del efecto. Quieta (dial a cero), ya aparece escrita.
  const inicio = quieto ? destino : ' '
  const [par, setPar] = useState({ ant: inicio, act: inicio, n: 0 })
  const actual = useRef(inicio)

  useEffect(() => {
    if (quieto) {
      actual.current = destino
      setPar({ ant: destino, act: destino, n: 0 })
      return
    }
    const camino = recorrido(actual.current, destino, abecedario, maxPasos)
    let i = 0
    let id = 0
    const siguiente = () => {
      if (i >= camino.length) return
      const sig = camino[i++]
      const antes = actual.current
      actual.current = sig
      setPar((p) => ({ ant: antes, act: sig, n: p.n + 1 }))
      id = setTimeout(siguiente, paso)
    }
    id = setTimeout(siguiente, retraso)
    return () => clearTimeout(id)
  }, [destino, retraso, paso, abecedario, maxPasos, quieto])

  const car = (c) => <span className="pf-car">{c}</span>
  return (
    <span className="pf-ficha" aria-hidden="true">
      <span className="pf-mitad pf-arriba">{car(par.act)}</span>
      <span className="pf-mitad pf-abajo">{car(par.ant)}</span>
      {par.n > 0 && (
        <>
          {/* Cada giro monta aletas nuevas (la `key` cambia) y vuelven a caer. */}
          <span key={`a${par.n}`} className="pf-mitad pf-aleta pf-aleta-arriba">{car(par.ant)}</span>
          <span key={`b${par.n}`} className="pf-mitad pf-aleta pf-aleta-abajo">{car(par.act)}</span>
        </>
      )}
    </span>
  )
}

export default function PanelFichas({
  palabras,
  pausa = 3,
  paso = 70,
  escalon = 45,
  maxPasos = 12,
  tam = 2.2,
  abecedario = ABECEDARIO,
  botonPausa = true,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const raiz = useRef(null)
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [visible, setVisible] = useState(true)

  const lista = palabras.map((p) => p.toUpperCase())
  const longitud = Math.max(...lista.map((p) => p.length), 1)
  const palabra = (lista[indice % lista.length] ?? '').padEnd(longitud, ' ')

  const cambiaSola = g > 0 && lista.length > 1
  const ritmo = g > 0 ? Math.min(paso / g, 400) : 0

  // Fuera de pantalla o pausado, el panel no pasa a la palabra siguiente.
  useEffect(() => {
    if (!cambiaSola || pausado || !visible) return
    const id = setInterval(() => setIndice((i) => (i + 1) % lista.length), pausa * 1000)
    return () => clearInterval(id)
  }, [cambiaSola, pausado, visible, pausa, lista.length])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !raiz.current) return
    const io = new IntersectionObserver((es) => setVisible(es[es.length - 1].isIntersecting), { threshold: 0.01 })
    io.observe(raiz.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={raiz}
      className={`pf${g === 0 ? ' pf--quieto' : ''} ${className}`.trim()}
      style={{ '--pf-tam': `${tam}rem`, '--pf-paso': `${(ritmo * 0.9).toFixed(0)}ms`, ...style }}
    >
      {/* Punto 3: la palabra, como texto, para quien no ve las fichas. */}
      <div className="pf-tablero" role="img" aria-label={`${txt.rotulo}: ${lista[indice % lista.length]}`}>
        {[...palabra].map((c, i) => (
          <Ficha
            key={i}
            destino={c}
            retraso={i * escalon}
            paso={ritmo}
            abecedario={abecedario}
            maxPasos={maxPasos}
            quieto={g === 0}
          />
        ))}
      </div>

      {/* Punto 4: parar lo que cambia solo. */}
      {botonPausa && cambiaSola && (
        <button type="button" className="pf-pausa" onClick={() => setPausado((p) => !p)}>
          {pausado ? txt.reanudar : txt.pausar}
        </button>
      )}
    </div>
  )
}
