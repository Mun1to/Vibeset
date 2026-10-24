import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './BotonMecha.css'

// Botón con mecha de deshacer. Código PROPIO, escrito desde cero.
//
// Deshacer es mejor que preguntar «¿seguro?»: no interrumpe a quien acertó y rescata a
// quien no. Aquí, al pulsar, la acción no ocurre todavía: arranca una cuenta atrás que se
// ve como una mecha que se consume, y la acción se confirma sola cuando la mecha acaba. Si
// durante ese tiempo se pulsa «Deshacer», no ocurre.
//
// Lo que lo hace honesto y usable:
//
//   1. La acción es REAL al acabar la cuenta: `onConfirmar` se llama una vez, en ese
//      instante. Un «deshacer» que no deshace nada (porque la acción ya salió al pulsar)
//      es un adorno que miente; aquí no hay nada que revertir porque nada ha salido.
//   2. El FOCO se lleva solo al botón «Deshacer» al empezar la cuenta. Quien usa el
//      teclado acaba de pulsar Intro en el botón principal, que desaparece; sin esto el
//      foco se pierde y no llega a deshacer en cinco segundos. Escape también deshace.
//   3. La cuenta no se pausa por el foco, solo por el ratón encima: como el foco se mueve
//      al botón de deshacer sin que nadie lo pida, pausar por foco la pararía siempre.
//   4. Se anuncia UNA vez («Se confirmará en 5 segundos. Pulsa Deshacer para cancelarlo»),
//      en una región `status`. El número que baja cada segundo va `aria-hidden`; si se
//      anunciase, un lector hablaría cinco veces seguidas encima de todo lo demás.
//   5. El tiempo se lleva con `requestAnimationFrame` y el tiempo real entre fotogramas,
//      y descuenta solo lo que corre: al pausar con el ratón, la mecha se detiene donde
//      está y no se pierde ni se regala un segundo.
//
// El dial (`gain`) apaga el parpadeo de la chispa. La mecha, que es función y no adorno,
// se consume igual a cualquier valor, también a cero.

const TEXTO = {
  es: {
    deshacer: 'Deshacer',
    pausa: 'En pausa',
    hecho: 'Hecho',
    deshecho: 'Cancelado',
    segundos: (n) => `${n} s`,
    aviso: (n) => `Se confirmará en ${n} ${n === 1 ? 'segundo' : 'segundos'}. Pulsa Deshacer para cancelarlo.`,
  },
  en: {
    deshacer: 'Undo',
    pausa: 'Paused',
    hecho: 'Done',
    deshecho: 'Cancelled',
    segundos: (n) => `${n} s`,
    aviso: (n) => `It will be confirmed in ${n} ${n === 1 ? 'second' : 'seconds'}. Press Undo to cancel it.`,
  },
}

export default function BotonMecha({
  children,
  duracion = 5,
  lado = 'abajo',
  pausaAlPasar = true,
  rotuloHecho,
  idioma = 'es',
  onConfirmar,
  onDeshacer,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const raiz = useRef(null)
  const principal = useRef(null)
  const deshacerRef = useRef(null)
  const restante = useRef(0)
  const encima = useRef(false)
  const devolverFoco = useRef(false)
  const alConfirmar = useRef(onConfirmar)
  const alDeshacer = useRef(onDeshacer)
  const [fase, setFase] = useState('reposo') // reposo | cuenta | hecho | deshecho
  const [seg, setSeg] = useState(duracion)
  const [pausado, setPausado] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    alConfirmar.current = onConfirmar
    alDeshacer.current = onDeshacer
  }, [onConfirmar, onDeshacer])

  const empezar = () => {
    setAviso(txt.aviso(duracion))
    devolverFoco.current = true
    // El ratón acaba de pulsar, así que está encima del botón: si eso contase como «encima
    // para pausar», la mecha no arrancaría nunca hasta que se retirase. La pausa empieza
    // cuando el ratón SE MUEVE sobre la pieza durante la cuenta.
    encima.current = false
    setFase('cuenta')
  }

  // Punto 5: el tiempo real, descontando solo lo que corre.
  useEffect(() => {
    if (fase !== 'cuenta') return
    const total = duracion * 1000
    restante.current = total
    setSeg(duracion)
    setPausado(false)
    let id = 0
    let previo = 0
    const paso = (t) => {
      const dt = previo ? Math.min(t - previo, 100) : 0
      previo = t
      const parado = pausaAlPasar && encima.current
      if (!parado) restante.current -= dt
      setPausado((p) => (p === parado ? p : parado))
      raiz.current?.style.setProperty('--fm-p', String(Math.max(restante.current, 0) / total))
      const s = Math.ceil(Math.max(restante.current, 0) / 1000)
      setSeg((prev) => (prev === s ? prev : s))
      if (restante.current <= 0) {
        // Punto 1: la acción sale aquí, y solo aquí.
        setFase('hecho')
        alConfirmar.current?.()
        return
      }
      id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [fase, duracion, pausaAlPasar])

  // Punto 2: al empezar la cuenta, el foco va a «Deshacer».
  useEffect(() => {
    if (fase === 'cuenta') deshacerRef.current?.focus()
  }, [fase])

  // Tras confirmar o deshacer, un momento el resultado y se vuelve a empezar.
  useEffect(() => {
    if (fase !== 'hecho' && fase !== 'deshecho') return
    setAviso(fase === 'hecho' ? rotuloHecho ?? txt.hecho : txt.deshecho)
    const id = setTimeout(() => {
      setFase('reposo')
      setAviso('')
    }, 1600)
    return () => clearTimeout(id)
  }, [fase, rotuloHecho, txt.hecho, txt.deshecho])

  // Y el foco vuelve al botón principal, si lo tenía alguien y se habría perdido.
  useEffect(() => {
    if (fase !== 'reposo' || !devolverFoco.current) return
    devolverFoco.current = false
    const activo = document.activeElement
    if (!activo || activo === document.body || raiz.current?.contains(activo)) principal.current?.focus()
  }, [fase])

  const deshacer = () => {
    alDeshacer.current?.()
    setFase('deshecho')
  }

  const alTeclear = (e) => {
    if (e.key === 'Escape' && fase === 'cuenta') {
      e.preventDefault()
      deshacer()
    }
  }

  return (
    <div
      ref={raiz}
      className={`fm fm--${fase} fm--${lado}${g === 0 ? ' fm--quieto' : ''} ${className}`.trim()}
      style={{ '--fm-p': 1, ...style }}
      onKeyDown={alTeclear}
      onPointerMove={(e) => { if (e.pointerType === 'mouse') encima.current = true }}
      onPointerLeave={() => { encima.current = false }}
    >
      <div className="fm-caja">
        {fase === 'reposo' && (
          <button ref={principal} type="button" className="fm-boton" onClick={empezar}>
            {children}
          </button>
        )}

        {fase === 'cuenta' && (
          <div className="fm-cuenta">
            <span className="fm-texto" aria-hidden="true">
              {pausado ? txt.pausa : children}
              <span className="fm-seg">{txt.segundos(seg)}</span>
            </span>
            <button ref={deshacerRef} type="button" className="fm-deshacer" onClick={deshacer}>
              {txt.deshacer}
            </button>
          </div>
        )}

        {(fase === 'hecho' || fase === 'deshecho') && (
          <span className="fm-resultado" aria-hidden="true">{fase === 'hecho' ? rotuloHecho ?? txt.hecho : txt.deshecho}</span>
        )}

        {/* La mecha: una barra que se consume y una chispa en su punta. */}
        {fase === 'cuenta' && (
          <span className="fm-mecha" aria-hidden="true">
            <span className="fm-llama" />
            <span className="fm-chispa" />
          </span>
        )}
      </div>

      {/* Punto 4: lo que oye un lector, una vez. */}
      <span className="fm-aviso" role="status">{aviso}</span>
    </div>
  )
}
