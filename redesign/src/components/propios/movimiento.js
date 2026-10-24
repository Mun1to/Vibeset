import { useEffect, useState } from 'react'

// El dial de movimiento de las piezas propias.
//
// Cada pieza que se mueve recibe `gain`, de 0 a 1. La regla de la casa es que las
// animaciones se enseñan a TODOS: con «reducir movimiento» del sistema no se
// apagan, se baja el recorrido. Este gancho hace esa cuenta en un solo sitio: si
// el sistema pide menos movimiento, el dial efectivo nunca pasa de 0,3; si no, es
// el que se ha pedido. A 0 la pieza tiene que seguir sirviendo, solo que quieta.
//
// Está aparte de las piezas para no repetirlo veintiocho veces, pero es lo único
// que comparten además del patrón: cada pieza se copia con su `.jsx` y su `.css`,
// y quien se la lleve solo tiene que traer también este archivo de veinte líneas.
const CONSULTA = '(prefers-reduced-motion: reduce)'

export function useGain(gain = 1) {
  const [reducir, setReducir] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.(CONSULTA).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia?.(CONSULTA)
    if (!mq) return
    const alCambiar = () => setReducir(mq.matches)
    mq.addEventListener('change', alCambiar)
    return () => mq.removeEventListener('change', alCambiar)
  }, [])

  return reducir ? Math.min(gain, 0.3) : gain
}
