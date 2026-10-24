import { useEffect, useId, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './CodigoCasillas.css'

// Campo de código de un solo uso, en casillas. Código PROPIO, escrito desde cero.
//
// Es la pantalla donde más gente se pierde (verificar un correo, un teléfono, un
// segundo factor), y los campos de seis casillas hechos con seis `<input>` fallan
// justo en lo que importa: pegar el código entero, el autocompletado del móvil, el
// borrado con retroceso y los lectores de pantalla.
//
// La solución es la contraria a lo que parece: hay UN solo `<input>` y las casillas
// son dibujo.
//
//   1. El `<input>` real ocupa toda la fila, transparente y por encima. Recibe el
//      foco, el teclado, el pegado y el autocompletado del sistema
//      (`autocomplete="one-time-code"`), que rellena un código que llega por SMS sin
//      que la persona teclee nada. Para un lector de pantalla es un campo de texto y
//      nada más, que es exactamente lo que es.
//   2. Las casillas leen el valor y lo pintan; no se pueden desincronizar porque no
//      guardan nada. La casilla activa es la siguiente a la última escrita.
//   3. NO lleva `maxLength`: si pegas «123 456», con límite de 6 el navegador corta en
//      «123 45» antes de que se pueda limpiar y se pierde un dígito. Se limpia primero
//      (espacios y guiones fuera) y se corta después.
//   4. `onCompleto` puede ser asíncrona: al llenarse el campo se verifica, y la fila se
//      queda en «verificando» hasta saber si el código vale. Si no vale, se sacude,
//      se vacía y el foco vuelve al campo para volver a intentarlo sin tocar nada.
//
// Lo que NO hace, y es de quien la use: validar el código. Eso va en el servidor, con
// límite de intentos; una comprobación en el navegador es una cortesía, no una puerta.
//
// El dial (`gain`) acorta el golpe de cada cifra y la sacudida del error. A cero todo
// cambia de estado sin moverse, y el cursor parpadeante se queda fijo.

const TEXTO = {
  es: {
    rotulo: 'Código de verificación',
    verificando: 'Comprobando el código…',
    exito: 'Código correcto',
    error: 'Ese código no es correcto',
  },
  en: {
    rotulo: 'Verification code',
    verificando: 'Checking the code…',
    exito: 'Code accepted',
    error: 'That code is not right',
  },
}

export default function CodigoCasillas({
  longitud = 6,
  valor,
  valorInicial = '',
  soloNumeros = true,
  enmascarar = false,
  partir = true,
  rotulo,
  mensajeError,
  mensajeExito,
  idioma = 'es',
  onCambio,
  onCompleto,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const txt = TEXTO[idioma] ?? TEXTO.es
  const campo = useRef(null)
  const vivo = useRef(true)
  const idMensaje = useId()

  const [interno, setInterno] = useState(valorInicial.slice(0, longitud))
  const [estado, setEstado] = useState('reposo') // reposo | verificando | exito | error
  const [mensaje, setMensaje] = useState('')
  const [enfocado, setEnfocado] = useState(false)
  // Qué casillas acaban de recibir cifra, para darles su golpe. `n` reinicia la animación.
  const [golpe, setGolpe] = useState({ desde: 0, hasta: 0, n: 0 })

  const actual = valor ?? interno

  // Con el modo estricto de React el efecto se monta, se desmonta y se vuelve a montar.
  useEffect(() => {
    vivo.current = true
    return () => { vivo.current = false }
  }, [])

  const limpiar = (crudo) => {
    const sin = soloNumeros ? crudo.replace(/\D/g, '') : crudo.replace(/[^a-z0-9]/gi, '').toUpperCase()
    return sin.slice(0, longitud)
  }

  const poner = (nuevo) => {
    if (valor === undefined) setInterno(nuevo)
    onCambio?.(nuevo)
  }

  const verificar = async (codigo) => {
    if (!onCompleto) return
    setEstado('verificando')
    setMensaje(txt.verificando)
    let bien = true
    try {
      bien = (await onCompleto(codigo)) !== false
    } catch {
      bien = false
    }
    if (!vivo.current) return
    if (bien) {
      setEstado('exito')
      setMensaje(mensajeExito ?? txt.exito)
      return
    }
    setEstado('error')
    setMensaje(mensajeError ?? txt.error)
    // Punto 4: tras sacudirse, se vacía y el foco vuelve al campo.
    setTimeout(() => {
      if (!vivo.current) return
      poner('')
      setEstado('reposo')
      setMensaje('')
      campo.current?.focus()
    }, g > 0 ? 900 : 1400)
  }

  const alCambiar = (e) => {
    const nuevo = limpiar(e.target.value)
    if (nuevo.length > actual.length) setGolpe((p) => ({ desde: actual.length, hasta: nuevo.length, n: p.n + 1 }))
    poner(nuevo)
    if (nuevo.length === longitud) verificar(nuevo)
  }

  // El cursor siempre al final: no hay casillas a las que volver con el ratón. Clicar
  // en medio y escribir ahí rompería la correspondencia entre campo y dibujo.
  const alFinal = (e) => {
    const n = e.target.value.length
    if (e.target.selectionStart !== n || e.target.selectionEnd !== n) e.target.setSelectionRange(n, n)
  }

  const bloqueado = estado === 'verificando' || estado === 'exito' || estado === 'error'
  const activa = enfocado && !bloqueado ? Math.min(actual.length, longitud - 1) : -1
  const llena = actual.length === longitud

  return (
    <div
      className={`cc cc--${estado}${g === 0 ? ' cc--quieto' : ''} ${className}`.trim()}
      style={{
        '--cc-golpe': `${(g > 0 ? Math.min(0.25 / g, 0.8) : 0).toFixed(2)}s`,
        '--cc-sacude': `${(g > 0.5 ? 0.4 : 0).toFixed(2)}s`,
        ...style,
      }}
    >
      <div className="cc-fila">
        <div className="cc-casillas" aria-hidden="true">
          {Array.from({ length: longitud }, (_, i) => {
            const c = actual[i]
            const golpea = c && i >= golpe.desde && i < golpe.hasta
            const separa = partir && longitud >= 4 && longitud % 2 === 0 && i === longitud / 2
            return (
              <span
                key={i}
                className={`cc-casilla${i === activa && !llena ? ' cc-activa' : ''}${c ? ' cc-llena' : ''}${separa ? ' cc-separa' : ''}`}
              >
                {c && (
                  <span key={golpea ? `g${golpe.n}` : 'q'} className={`cc-cifra${golpea ? ' cc-golpe' : ''}`}>
                    {enmascarar ? '•' : c}
                  </span>
                )}
              </span>
            )
          })}
        </div>

        {/* Punto 1: el campo de verdad, encima de todo y sin verse. */}
        <input
          ref={campo}
          className="cc-campo"
          type="text"
          value={actual}
          inputMode={soloNumeros ? 'numeric' : 'text'}
          autoComplete="one-time-code"
          autoCapitalize="characters"
          spellCheck={false}
          readOnly={bloqueado}
          aria-label={rotulo ?? txt.rotulo}
          aria-invalid={estado === 'error' || undefined}
          aria-describedby={idMensaje}
          onChange={alCambiar}
          onFocus={(e) => { setEnfocado(true); alFinal(e) }}
          onBlur={() => setEnfocado(false)}
          onSelect={alFinal}
          onClick={alFinal}
        />
      </div>

      <span id={idMensaje} className="cc-mensaje" role="status">{mensaje}</span>
    </div>
  )
}
