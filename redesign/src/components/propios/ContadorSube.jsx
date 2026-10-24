import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useGain } from './movimiento'
import './ContadorSube.css'

// Contador que sube hasta su cifra. Código PROPIO, escrito desde cero.
//
// Lo que cuesta de un contador no es contar, es que cuente sin estorbar:
//
//   1. El número que sube se escribe DIRECTAMENTE en el nodo (`textContent`), no
//      pasa por el estado de React. Son sesenta cambios por segundo durante dos
//      segundos, y repintar el componente en cada uno es pagar un árbol entero por
//      cambiar unas cifras.
//   2. El valor FINAL está siempre en el DOM, en un texto transparente que ocupa
//      justo el ancho que tendrá el número ya terminado. Hace dos cosas: la página
//      no se mueve mientras sube (sin él, el ancho crece con cada cifra y empuja
//      todo lo que tiene al lado) y quien lee con un lector de pantalla, o copia el
//      texto, oye y copia «83», no «17, 31, 52…».
//   3. El que sube va marcado `aria-hidden`: es decoración de lo que ya dice el
//      final. Si no, un lector anunciaría los números intermedios uno a uno.
//   4. La curva baja de golpe y se posa despacio (exponencial inversa). Una subida
//      lineal parece una barra de carga; así parece un instrumento que se estabiliza.
//
// El dial (`gain`) acorta el recuento: con menos movimiento el número sube más
// deprisa, que es menos tiempo de cifras cambiando. A cero no sube: aparece el
// valor final y ya.

// A qué fracción del contador visible se considera que «ha entrado».
const UMBRAL = 0.4

export default function ContadorSube({
  hasta,
  desde = 0,
  duracion = 2,
  decimales = 0,
  prefijo = '',
  sufijo = '',
  disparo = 'vista',
  repetirAlPasar = false,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const vivo = useRef(null)
  // Lo que se está viendo ahora mismo, para que un cambio de meta parta de ahí y no
  // vuelva a cero.
  const actual = useRef(desde)
  const visto = useRef(false)
  const [dentro, setDentro] = useState(disparo === 'carga')

  const formato = useMemo(
    () => new Intl.NumberFormat(idioma, { minimumFractionDigits: decimales, maximumFractionDigits: decimales }),
    [idioma, decimales],
  )
  const escribir = useCallback((v) => `${prefijo}${formato.format(v)}${sufijo}`, [formato, prefijo, sufijo])

  // Se mira cuándo entra en pantalla. Con `repetirAlPasar` vuelve a empezar cada vez;
  // sin él, lo que ya se ha visto subir se queda arriba.
  useEffect(() => {
    if (disparo === 'carga') {
      setDentro(true)
      return
    }
    const el = raiz.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setDentro(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) visto.current = true
        setDentro(e.isIntersecting || (!repetirAlPasar && visto.current))
      },
      { threshold: UMBRAL },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disparo, repetirAlPasar])

  // Con el dial en 0,2 el recuento dura la quinta parte de lo que se pidió; a 0 no hay
  // recuento. El mínimo de 0,2 evita que un dial bajo lo deje en un parpadeo.
  const dur = g > 0 ? duracion * (0.2 + 0.8 * g) : 0

  // Antes de pintar, para que el primer fotograma ya tenga su número y no un hueco.
  useLayoutEffect(() => {
    const el = vivo.current
    if (!el) return
    // Sin recuento (dial a cero) no hay punto de partida que preparar: el valor
    // final se enseña siempre, haya entrado en pantalla o no.
    if (dur === 0 || (dentro && actual.current === hasta)) {
      actual.current = hasta
      el.textContent = escribir(hasta)
      return
    }
    if (!dentro) {
      // Fuera de pantalla se prepara el punto de partida sin animar: nadie lo ve.
      actual.current = desde
      el.textContent = escribir(desde)
      return
    }
    const de = actual.current
    const t0 = performance.now()
    let id = 0
    const paso = (t) => {
      const p = Math.min((t - t0) / (dur * 1000), 1)
      // La exponencial no llega a 1 por sí sola: el último fotograma se fuerza.
      const v = p >= 1 ? hasta : de + (hasta - de) * (1 - 2 ** (-10 * p))
      actual.current = v
      el.textContent = escribir(v)
      if (p < 1) id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [dentro, hasta, desde, dur, escribir])

  return (
    <span ref={raiz} className={`cs ${className}`.trim()} style={style}>
      <span className="cs-final">{escribir(hasta)}</span>
      <span ref={vivo} className="cs-vivo" aria-hidden="true" />
    </span>
  )
}
