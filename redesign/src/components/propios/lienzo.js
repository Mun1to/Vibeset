import { useEffect, useState } from 'react'

// Lo que comparten las piezas de lienzo (canvas 2D y WebGL): saber cuánto mide la caja, a
// qué densidad de píxeles dibujar y si se está viendo.
//
// Las piezas que pintan en un `<canvas>` dibujan en bucle, y un bucle que dibuja lo que
// nadie ve es gasto puro: por eso `visible` existe y cada pieza lo usa para parar. La
// densidad se limita a 2: en una pantalla de 3 cuesta dos veces y media más y no se nota.
//
// Es el único archivo que estas piezas comparten además de `movimiento.js`: quien se lleve
// una de lienzo se lleva este también, y son treinta líneas.
export function useCaja(ref) {
  const [caja, setCaja] = useState({ w: 0, h: 0, dpr: 1 })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () =>
      setCaja({
        w: Math.round(el.clientWidth),
        h: Math.round(el.clientHeight),
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      })
    medir()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(medir) : null
    ro?.observe(el)
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((es) => setVisible(es[es.length - 1].isIntersecting), { threshold: 0 })
        : null
    io?.observe(el)
    return () => {
      ro?.disconnect()
      io?.disconnect()
    }
  }, [ref])

  return [caja, visible]
}
