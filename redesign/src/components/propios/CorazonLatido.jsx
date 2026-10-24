import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './CorazonLatido.css'

// Botón de «me gusta» con latido y contador de rodillo. Código PROPIO, escrito desde cero.
//
// Un «me gusta» es una promesa pequeña: pulsas y algo queda guardado. Esta pieza pone
// la parte que se ve (el latido, el número que gira) y deja la que cuenta, guardar, a
// quien la use: `onCambio` avisa de cada cambio y el estado puede venir de fuera.
//
// Lo que hay debajo:
//
//   1. Sirve CONTROLADA (`marcado` y `cuenta` vienen de fuera) y SIN controlar
//      (`marcadoInicial` y `cuentaInicial`, y ella lleva la cuenta). La regla es la de
//      un `<input>`: si llega la prop, manda la prop.
//   2. Es un `<button aria-pressed>`: un interruptor, no un enlace ni un div. El nombre
//      es el rótulo («Me gusta») más la cuenta, en un texto solo para lectores; el
//      número que gira va `aria-hidden`, que de lo contrario un lector leería «9, 10».
//   3. El número gira como un rodillo: durante el cambio hay DOS cifras apiladas en una
//      ventana de una línea, y la columna se desliza hacia arriba si sube y hacia abajo
//      si baja. Al terminar vuelve a haber una. No lleva ninguna librería.
//   4. El latido se reinicia en cada activación cambiando la `key` del icono, y solo
//      suena al MARCAR: al quitar el «me gusta» no hay nada que celebrar.
//
// El dial (`gain`) alarga el latido y el giro. A cero cambia de estado sin animar nada.

const ICONOS = {
  corazon: {
    color: '#fb7185',
    d: 'M12 20.4 C12 20.4 3.2 15.2 3.2 9 C3.2 6.3 5.3 4.4 7.7 4.4 C9.5 4.4 11 5.4 12 7 C13 5.4 14.5 4.4 16.3 4.4 C18.7 4.4 20.8 6.3 20.8 9 C20.8 15.2 12 20.4 12 20.4 Z',
  },
  estrella: {
    color: '#fbbf24',
    d: 'M12 3 L14.7 8.9 L21.2 9.6 L16.4 14 L17.7 20.4 L12 17.2 L6.3 20.4 L7.6 14 L2.8 9.6 L9.3 8.9 Z',
  },
  pulgar: {
    color: '#60a5fa',
    d: 'M8 10.5 L12 3.6 C13.7 3.6 14.7 5 14.3 6.6 L13.6 9.4 H19.4 C20.7 9.4 21.6 10.6 21.3 11.8 L19.9 18.4 C19.7 19.4 18.8 20.1 17.8 20.1 H8 Z M3.6 10.5 H8 V20.1 H3.6 Z',
  },
}

const TEXTO = {
  es: { rotulo: 'Me gusta' },
  en: { rotulo: 'Like' },
}

export default function CorazonLatido({
  marcado,
  marcadoInicial = false,
  cuenta,
  cuentaInicial,
  icono = 'corazon',
  rotulo,
  idioma = 'es',
  onCambio,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const forma = ICONOS[icono] ?? ICONOS.corazon

  // Punto 1: la prop manda cuando llega; si no, el estado propio.
  const [interno, setInterno] = useState(marcadoInicial)
  const [conteo, setConteo] = useState(cuentaInicial ?? 0)
  const hay = marcado ?? interno
  const total = cuenta ?? (cuentaInicial === undefined ? undefined : conteo)
  const [pulso, setPulso] = useState(0)

  const fmt = useMemo(() => new Intl.NumberFormat(idioma), [idioma])

  const alPulsar = () => {
    const sig = !hay
    if (marcado === undefined) setInterno(sig)
    if (cuenta === undefined && cuentaInicial !== undefined) setConteo((n) => n + (sig ? 1 : -1))
    if (sig) setPulso((p) => p + 1)
    onCambio?.(sig, total === undefined ? undefined : total + (sig ? 1 : -1))
  }

  const lat = g > 0 ? Math.min(0.55 / g, 1.6) : 0

  return (
    <button
      type="button"
      className={`cl${hay ? ' cl--marcado' : ''}${g === 0 ? ' cl--quieto' : ''} ${className}`.trim()}
      aria-pressed={hay}
      onClick={alPulsar}
      style={{ '--cl-c': forma.color, '--cl-lat': `${lat.toFixed(2)}s`, '--cl-giro': `${(g > 0 ? Math.min(0.35 / g, 1) : 0).toFixed(2)}s`, ...style }}
    >
      {/* Punto 4: al cambiar la `key` se monta un icono nuevo y el latido vuelve a sonar.
          Antes de la primera activación no hay clase de latido: un botón que llega ya
          marcado no debe latir al cargar la página. */}
      <span className={`cl-caja${pulso > 0 ? ' cl-late' : ''}`} key={pulso}>
        <svg className="cl-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={forma.d} strokeLinejoin="round" />
        </svg>
        {/* El eco: la misma forma, solo el contorno, que crece y se apaga. */}
        {pulso > 0 && (
          <svg className="cl-eco" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={forma.d} strokeLinejoin="round" />
          </svg>
        )}
      </span>

      {total !== undefined && <Rodillo valor={total} fmt={fmt} quieto={g === 0} />}

      {/* Punto 2: lo que oye quien no ve la pantalla. */}
      <span className="cl-lector">
        {rotulo ?? txt.rotulo}
        {total !== undefined ? `: ${fmt.format(total)}` : ''}
      </span>
    </button>
  )
}

// El número que gira. Guarda el valor anterior para poder dibujar los dos a la vez
// mientras dura el cambio, y se queda con uno solo cuando termina.
function Rodillo({ valor, fmt, quieto }) {
  const previo = useRef(valor)
  const [giro, setGiro] = useState(null) // { de, a, sube } mientras gira
  const fin = useCallback(() => setGiro(null), [])

  useEffect(() => {
    if (previo.current === valor) return
    // Sin animación no habría `animationend` que cierre el giro, y se quedarían dos cifras.
    if (!quieto) setGiro({ de: previo.current, a: valor, sube: valor > previo.current })
    previo.current = valor
  }, [valor, quieto])

  const cifras = giro ? (giro.sube ? [giro.de, giro.a] : [giro.a, giro.de]) : [valor]

  return (
    <span className="cl-rodillo" aria-hidden="true">
      <span
        className={`cl-columna${giro ? (giro.sube ? ' cl-sube' : ' cl-baja') : ''}`}
        onAnimationEnd={fin}
      >
        {cifras.map((n, i) => (
          <span className="cl-cifra" key={i}>{fmt.format(n)}</span>
        ))}
      </span>
    </span>
  )
}
