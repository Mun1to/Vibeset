import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './DeslizaConfirma.css'

// «Desliza para confirmar». Código PROPIO, escrito desde cero.
//
// Para una acción que no se deshace (pagar, borrar, publicar) un clic suelto es
// poco: se da sin querer. Arrastrar un tirador hasta el otro extremo pide un gesto
// con principio, trayecto y final, y deja un punto intermedio donde arrepentirse.
//
// Lo que cuesta y no se ve:
//
//   1. La acción es ASÍNCRONA. `onConfirmar` puede devolver una promesa, y el
//      control espera: tirador clavado al final y rótulo «Confirmando…» hasta que
//      termina bien (hecho) o mal (error, con el tirador de vuelta). Un deslizador
//      que confirma «hecho» antes de que el servidor responda miente.
//   2. El tirador es un `role="slider"` de verdad y no un div que se arrastra: con
//      teclado, las flechas lo mueven de cuarto en cuarto (cuatro pulsaciones para
//      llegar) y Fin confirma. Quien no puede arrastrar tiene una vía, y no es un
//      botón de «confirmar» que se salte la idea entera.
//   3. La posición vive en dos variables de CSS escritas desde el gesto, no en el
//      estado de React: en un arrastre cambia cada vez que se mueve el ratón. Y como
//      las transiciones actúan sobre `transform` y `width`, soltar antes del umbral
//      devuelve el tirador con un muelle sin una línea de JavaScript más.
//   4. Se mide el trayecto al empezar y cada vez que la caja cambia de ancho: un
//      tirador ya confirmado se queda pegado al final aunque se gire el móvil.
//
// El dial (`gain`) acorta la vuelta del tirador y la sacudida del error (esta solo
// aparece con el dial alto). A cero el tirador vuelve de golpe, y se confirma igual.

const TEXTO = {
  es: {
    rotulo: 'Desliza para confirmar',
    esperando: 'Confirmando…',
    hecho: 'Hecho',
    error: 'No se ha podido',
    pista: 'Desliza hacia la derecha, o usa las flechas; Fin confirma.',
    valor: (p) => `${p} %`,
  },
  en: {
    rotulo: 'Slide to confirm',
    esperando: 'Confirming…',
    hecho: 'Done',
    error: 'It did not work',
    pista: 'Slide to the right, or use the arrow keys; End confirms.',
    valor: (p) => `${p} %`,
  },
}

// Sangría del tirador dentro de la pista, en px. El CSS usa el mismo número.
const SANGRIA = 4
// Cuánto avanza el teclado por pulsación, como fracción del trayecto.
const PASO_TECLADO = 0.25

export default function DeslizaConfirma({
  rotulo,
  rotuloHecho,
  rotuloError,
  onConfirmar,
  umbral = 0.9,
  reiniciarEn = 0,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const pista = useRef(null)
  const asa = useRef(null)
  const x = useRef(0)
  const max = useRef(0)
  const origen = useRef(0)
  const vivo = useRef(true)
  const [fase, setFase] = useState('reposo') // reposo | arrastrando | esperando | hecho | error
  const [pct, setPct] = useState(0)
  const idPista = useId()

  const pintar = useCallback((nuevo) => {
    x.current = nuevo
    const el = pista.current
    if (!el) return
    el.style.setProperty('--ds-x', `${nuevo}px`)
    el.style.setProperty('--ds-p', String(max.current > 0 ? nuevo / max.current : 0))
  }, [])

  const medir = useCallback(() => {
    if (!pista.current || !asa.current) return
    max.current = Math.max(pista.current.clientWidth - asa.current.offsetWidth - SANGRIA * 2, 0)
  }, [])

  // Punto 4: si la caja cambia de ancho, el trayecto cambia y el tirador final también.
  useEffect(() => {
    const el = pista.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      medir()
      if (x.current > 0 && (fase === 'esperando' || fase === 'hecho')) pintar(max.current)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fase, medir, pintar])

  // `vivo` se vuelve a poner a true al montar: con el modo estricto de React el efecto
  // se monta, se desmonta y se vuelve a montar, y dejarlo en false lo mataría.
  useEffect(() => {
    vivo.current = true
    return () => { vivo.current = false }
  }, [])

  const volver = useCallback(() => {
    setFase('reposo')
    setPct(0)
    pintar(0)
  }, [pintar])

  const confirmar = useCallback(async () => {
    pintar(max.current)
    setPct(100)
    setFase('esperando')
    try {
      await onConfirmar?.()
      if (!vivo.current) return
      setFase('hecho')
      if (reiniciarEn > 0) setTimeout(() => vivo.current && volver(), reiniciarEn * 1000)
    } catch {
      if (!vivo.current) return
      setFase('error')
      setTimeout(() => vivo.current && volver(), 1800)
    }
  }, [onConfirmar, pintar, reiniciarEn, volver])

  const alEmpezar = (e) => {
    if (fase !== 'reposo' || e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    medir()
    origen.current = e.clientX - x.current
    setFase('arrastrando')
  }

  const alMover = (e) => {
    if (fase !== 'arrastrando') return
    const nuevo = Math.min(Math.max(e.clientX - origen.current, 0), max.current)
    pintar(nuevo)
    setPct(max.current > 0 ? Math.round((nuevo / max.current) * 100) : 0)
  }

  const alSoltar = (e) => {
    if (fase !== 'arrastrando') return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    if (max.current > 0 && x.current / max.current >= umbral) confirmar()
    else volver()
  }

  // Punto 2: el teclado mueve el tirador como mueve cualquier deslizador.
  const alTeclear = (e) => {
    if (fase !== 'reposo') return
    medir()
    let sig
    const paso = max.current * PASO_TECLADO
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') sig = x.current + paso
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') sig = x.current - paso
    else if (e.key === 'Home') sig = 0
    else if (e.key === 'End') sig = max.current
    else return
    e.preventDefault()
    sig = Math.min(Math.max(sig, 0), max.current)
    pintar(sig)
    setPct(max.current > 0 ? Math.round((sig / max.current) * 100) : 0)
    if (max.current > 0 && sig / max.current >= umbral) confirmar()
  }

  const texto =
    fase === 'esperando' ? txt.esperando
    : fase === 'hecho' ? rotuloHecho ?? txt.hecho
    : fase === 'error' ? rotuloError ?? txt.error
    : rotulo ?? txt.rotulo

  const ocupado = fase === 'esperando' || fase === 'hecho' || fase === 'error'

  return (
    <div
      ref={pista}
      className={`ds ds--${fase}${g === 0 ? ' ds--quieto' : ''} ${className}`.trim()}
      style={{
        '--ds-vuelta': `${(g > 0 ? Math.min(0.4 / g, 1.2) : 0).toFixed(2)}s`,
        '--ds-sacude': g > 0.5 ? '0.4s' : '0s',
        '--ds-sangria': `${SANGRIA}px`,
        ...style,
      }}
    >
      <span className="ds-relleno" aria-hidden="true" />
      <span className="ds-rotulo" role="status">{texto}</span>
      <button
        ref={asa}
        type="button"
        role="slider"
        className="ds-asa"
        aria-label={rotulo ?? txt.rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={txt.valor(pct)}
        aria-disabled={ocupado || undefined}
        aria-describedby={idPista}
        onPointerDown={alEmpezar}
        onPointerMove={alMover}
        onPointerUp={alSoltar}
        onPointerCancel={alSoltar}
        onKeyDown={alTeclear}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {fase === 'hecho' ? (
            <path d="M5 12.5 L10 17.5 L19 7.5" />
          ) : fase === 'error' ? (
            <path d="M7 7 L17 17 M17 7 L7 17" />
          ) : fase === 'esperando' ? (
            <>
              <circle className="ds-punto" cx="5.5" cy="12" r="2" />
              <circle className="ds-punto" cx="12" cy="12" r="2" />
              <circle className="ds-punto" cx="18.5" cy="12" r="2" />
            </>
          ) : (
            <path d="M6 12 H18 M13 7 L18 12 L13 17" />
          )}
        </svg>
      </button>
      <span id={idPista} className="ds-pista">{txt.pista}</span>
    </div>
  )
}
