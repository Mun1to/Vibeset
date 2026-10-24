import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './BotonMantener.css'

// Botón que se confirma manteniéndolo pulsado. Código PROPIO, escrito desde cero.
//
// Para lo que no se puede deshacer o cuesta dinero, un cuadro de diálogo con «¿Seguro?»
// se contesta sin leerlo. Mantener pulsado un rato obliga a querer hacerlo: el gesto
// ES la confirmación, y no hay ningún cuadro de por medio.
//
// Lo que lo hace usable y no una trampa:
//
//   1. El progreso lo lleva un `requestAnimationFrame` que escribe en una variable de
//      CSS, no el estado de React: son sesenta cambios por segundo y no hay motivo
//      para repintar el componente por cada uno.
//   2. Hay DOS capas con el mismo rótulo, una sobre la otra: la de abajo con el
//      color de reposo y la de arriba con el color de relleno, recortada hasta
//      donde ha llegado el progreso. El texto siempre se lee, esté el relleno por
//      donde esté; con un solo texto, la mitad se perdería sobre el color
//      equivocado. La de arriba va `aria-hidden`: es la misma palabra.
//   3. Mantener es difícil para mucha gente (temblor, un dedo, un ratón de trackball):
//      por eso `alternativa` pinta, debajo, una vía visible para confirmar sin
//      mantener nada. Una acción que solo se puede hacer con pulso firme excluye.
//   4. Y nadie adivina que hay que mantener, así que el botón lo dice: la pista va
//      enlazada con `aria-describedby` y el toque corto avisa en vez de no hacer nada.
//
// El teclado funciona igual que el ratón: Espacio o Intro mantenidas. El dial (`gain`)
// acorta el vuelo de la vuelta atrás y la animación del «hecho»; el relleno es la
// función de la pieza, no adorno, y por eso se queda a cualquier valor del dial.

const TEXTO = {
  es: { pista: (s) => `Mantén pulsado ${s} s para confirmar`, hecho: 'Confirmado', toque: 'Hay que mantenerlo pulsado' },
  en: { pista: (s) => `Hold for ${s} s to confirm`, hecho: 'Confirmed', toque: 'You have to hold it down' },
}

export default function BotonMantener({
  children,
  duracion = 1.5,
  direccion = 'derecha',
  alternativa,
  idioma = 'es',
  onConfirmar,
  onToque,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const raiz = useRef(null)
  const bucle = useRef(0)
  const retorno = useRef(0)
  const inicio = useRef(0)
  const progreso = useRef(0)
  const pulsado = useRef(false)
  const [fase, setFase] = useState('reposo') // reposo | manteniendo | hecho
  const [aviso, setAviso] = useState('')

  const pintar = useCallback((p) => {
    progreso.current = p
    raiz.current?.style.setProperty('--bm-p', String(p))
  }, [])

  const soltar = useCallback(
    (completo) => {
      cancelAnimationFrame(bucle.current)
      pulsado.current = false
      if (completo) return
      setFase('reposo')
      // Vuelta atrás: el relleno retrocede en lugar de desaparecer de golpe. Con el
      // dial a cero, de golpe.
      const de = progreso.current
      const dur = g > 0 ? Math.min(0.25 / g, 0.8) * 1000 : 0
      const t0 = performance.now()
      cancelAnimationFrame(retorno.current)
      const paso = (t) => {
        const k = dur === 0 ? 1 : Math.min((t - t0) / dur, 1)
        pintar(de * (1 - k))
        if (k < 1) retorno.current = requestAnimationFrame(paso)
      }
      retorno.current = requestAnimationFrame(paso)
    },
    [g, pintar],
  )

  const empezar = useCallback(() => {
    if (pulsado.current || fase === 'hecho') return
    pulsado.current = true
    cancelAnimationFrame(retorno.current)
    setAviso('')
    setFase('manteniendo')
    inicio.current = performance.now()
    const paso = (t) => {
      const p = Math.min((t - inicio.current) / (duracion * 1000), 1)
      pintar(p)
      if (p < 1) {
        bucle.current = requestAnimationFrame(paso)
        return
      }
      soltar(true)
      setFase('hecho')
      setAviso(txt.hecho)
      onConfirmar?.()
    }
    bucle.current = requestAnimationFrame(paso)
  }, [fase, duracion, pintar, soltar, onConfirmar, txt.hecho])

  const parar = useCallback(() => {
    if (!pulsado.current) return
    const corto = performance.now() - inicio.current < 300
    soltar(false)
    // Un toque corto no confirma: avisa de lo que hay que hacer, que es mejor que
    // no responder y dejar a la persona pensando que está roto.
    if (corto) {
      setAviso(txt.toque)
      onToque?.()
    }
  }, [soltar, txt.toque, onToque])

  // Tras confirmar, el botón se vuelve a poder usar pasado un momento, y el relleno
  // se retira como cuando se suelta antes de tiempo.
  useEffect(() => {
    if (fase !== 'hecho') return
    const id = setTimeout(() => {
      soltar(false)
      setAviso('')
    }, 1600)
    return () => clearTimeout(id)
  }, [fase, soltar])

  useEffect(() => () => {
    cancelAnimationFrame(bucle.current)
    cancelAnimationFrame(retorno.current)
  }, [])

  const alTeclear = (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault()
      empezar()
    }
  }
  const alSoltarTecla = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      parar()
    }
  }

  const confirmarSinMantener = () => {
    pintar(1)
    setFase('hecho')
    setAviso(txt.hecho)
    onConfirmar?.()
  }

  const idPista = useId()

  return (
    <span
      className={`bm bm--${direccion} ${className}`.trim()}
      style={{ '--bm-pop': `${(g > 0 ? Math.min(0.3 / g, 0.9) : 0).toFixed(2)}s`, ...style }}
    >
      <button
        ref={raiz}
        type="button"
        className={`bm-boton bm-${fase}`}
        style={{ '--bm-p': 0 }}
        aria-describedby={idPista}
        onPointerDown={(e) => {
          if (e.button === 0) empezar()
        }}
        onPointerUp={parar}
        onPointerLeave={parar}
        onPointerCancel={parar}
        onKeyDown={alTeclear}
        onKeyUp={alSoltarTecla}
        onBlur={parar}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="bm-capa">
          <span className="bm-rotulo">{fase === 'hecho' ? txt.hecho : children}</span>
        </span>
        <span className="bm-capa bm-relleno" aria-hidden="true">
          <span className="bm-rotulo">{fase === 'hecho' ? txt.hecho : children}</span>
        </span>
        <span className="bm-borde" aria-hidden="true" />
      </button>

      <span id={idPista} className="bm-pista">
        {txt.pista(duracion.toLocaleString(idioma === 'en' ? 'en-US' : 'es-ES'))}
      </span>
      <span role="status" className="bm-aviso">{aviso}</span>

      {alternativa && (
        <button type="button" className="bm-alternativa" onClick={confirmarSinMantener}>
          {alternativa}
        </button>
      )}
    </span>
  )
}
