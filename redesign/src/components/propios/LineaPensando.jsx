import { useEffect, useId, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './LineaPensando.css'

// La línea de «pensando…» de un agente de IA. Código PROPIO, escrito desde cero.
//
// Donde una interfaz con un agente suele poner un spinner, esto cuenta qué hace: una línea
// que respira mientras piensa, con un cronómetro, y debajo los pasos que va dando. Al
// terminar se pliega y se queda en una frase («Pensó durante 12 s»), con los pasos a un
// clic por si alguien quiere ver cómo llegó.
//
// Lo que hay debajo:
//
//   1. Quien la usa le dice EL ESTADO (`estado`: pensando o hecho) y los pasos; ella solo
//      lo dibuja. No inventa pasos ni adivina cuándo acaba un proceso que no conoce.
//   2. La duración final se CONGELA en el momento en que el estado pasa a «hecho». Si se
//      siguiera calculando con el reloj, «Pensó durante 12 s» subiría a 13, 14, 15 mientras
//      la persona lo lee. Se puede pasar de fuera (`duracion`) cuando el servidor la sabe.
//   3. La frase de estado es una región `status`: un lector de pantalla oye «Pensando» al
//      empezar y «Pensó durante 12 segundos» al acabar, y nada más. El cronómetro que
//      cambia cada segundo va `aria-hidden`, o hablaría sin parar.
//   4. Plegar y desplegar es un `<button aria-expanded>` con su región, y lo plegado lleva
//      `inert` para que sus pasos salgan del tabulador. Si la persona lo despliega a mano
//      mientras piensa, al terminar NO se vuelve a plegar solo: lo que se abre a propósito
//      no se cierra sin avisar.
//   5. El glifo no es una carita de chispas ni ningún distintivo de «IA»: tres puntos, tres
//      barras o un cursor, o ninguno. Y el cronómetro funciona aunque no haya animación,
//      porque es información, no adorno.
//
// El dial (`gain`) alarga el latido del texto y del glifo. A cero todo queda quieto y el
// cronómetro sigue contando.

const TEXTO = {
  es: {
    pensando: 'Pensando',
    hecho: (s) => `Pensó durante ${s}`,
    ver: 'Ver los pasos',
    segundos: (n) => (n < 60 ? `${n} s` : `${Math.floor(n / 60)} min ${n % 60} s`),
    letra: (n) => (n < 60 ? `${n} ${n === 1 ? 'segundo' : 'segundos'}` : `${Math.floor(n / 60)} min ${n % 60} s`),
  },
  en: {
    pensando: 'Thinking',
    hecho: (s) => `Thought for ${s}`,
    ver: 'Show the steps',
    segundos: (n) => (n < 60 ? `${n} s` : `${Math.floor(n / 60)} min ${n % 60} s`),
    letra: (n) => (n < 60 ? `${n} ${n === 1 ? 'second' : 'seconds'}` : `${Math.floor(n / 60)} min ${n % 60} s`),
  },
}

export default function LineaPensando({
  estado = 'pensando',
  pasos = [],
  duracion,
  glifo = 'puntos',
  plegarAlTerminar = true,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const idCaja = useId()
  const hecho = estado === 'hecho'
  const inicio = useRef(performance.now())
  const [ms, setMs] = useState(0)
  // `null` = la persona no ha tocado nada; entonces manda el estado (abierta pensando,
  // plegada al terminar). Si lo ha tocado, manda lo que eligió.
  const [eleccion, setEleccion] = useState(null)

  // Punto 2: el cronómetro corre mientras piensa y se congela al pasar a hecho.
  useEffect(() => {
    if (hecho) return
    inicio.current = performance.now()
    setMs(0)
    const id = setInterval(() => setMs(performance.now() - inicio.current), 250)
    return () => clearInterval(id)
  }, [hecho])

  const [final, setFinal] = useState(0)
  useEffect(() => {
    // Una vuelta a «pensando» (otra ejecución) vuelve a dejar que mande el estado; el paso
    // a «hecho» guarda lo que ha durado, medido en ese instante y no con el último tic.
    if (hecho) setFinal(performance.now() - inicio.current)
    else setEleccion(null)
  }, [hecho])

  const total = Math.round((hecho ? duracion ?? final : ms) / 1000)

  const abierto = eleccion ?? (hecho ? !plegarAlTerminar : true)
  const quieto = g === 0

  return (
    <div
      className={`lp lp--${hecho ? 'hecho' : 'pensando'}${quieto ? ' lp--quieto' : ''} ${className}`.trim()}
      style={{ '--lp-latido': `${(g > 0 ? Math.min(2.2 / g, 7) : 0).toFixed(2)}s`, ...style }}
    >
      <button
        type="button"
        className="lp-cabecera"
        aria-expanded={abierto}
        aria-controls={idCaja}
        disabled={pasos.length === 0}
        onClick={() => setEleccion(!abierto)}
      >
        <span className="lp-glifo" aria-hidden="true">
          {hecho ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <path d="M5 12.5 L10 17.5 L19 7.5" />
            </svg>
          ) : glifo === 'barras' ? (
            <span className="lp-barras"><i /><i /><i /></span>
          ) : glifo === 'cursor' ? (
            <span className="lp-cursor" />
          ) : glifo === 'puntos' ? (
            <span className="lp-puntos"><i /><i /><i /></span>
          ) : null}
        </span>

        {/* Punto 3: una región de estado, y solo ella habla. */}
        <span className="lp-estado" role="status">
          <span className={hecho ? 'lp-frase' : 'lp-frase lp-respira'}>
            {hecho ? txt.hecho(txt.letra(total)) : txt.pensando}
          </span>
        </span>

        {!hecho && <span className="lp-tiempo" aria-hidden="true">{txt.segundos(total)}</span>}
        {pasos.length > 0 && (
          <svg className="lp-flecha" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <path d="M6 3.5 L10.5 8 L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Punto 4: la región plegable, y `inert` cuando está plegada. */}
      <div id={idCaja} className="lp-caja" data-abierto={abierto} inert={!abierto}>
        <ul className="lp-pasos">
          {pasos.map((p, i) => {
            const ultimo = i === pasos.length - 1
            const enCurso = !hecho && ultimo && p.estado !== 'hecho'
            return (
              <li key={p.id ?? i} className={`lp-paso${enCurso ? ' lp-paso--curso' : ''}`}>
                <span className="lp-marca" aria-hidden="true" />
                <span>{p.texto}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
