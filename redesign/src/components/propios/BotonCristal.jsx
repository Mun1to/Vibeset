import { useRef } from 'react'
import { useGain } from './movimiento'
import './BotonCristal.css'

// Botón de cristal con un brillo que sigue al puntero. Código PROPIO, escrito desde cero.
//
// Un botón que parece una pieza de vidrio tallado: una luz blanca se desliza por su cara y
// su canto según donde pongas el puntero, como si lo movieras bajo una lámpara. Es solo CSS
// con un detalle de JavaScript: dos números.
//
// Cómo funciona, y por qué es barato:
//
//   1. El puntero escribe dos variables (su posición dentro del botón, de 0 a 100 %) y NADA
//      más. El brillo de la cara es un degradado radial centrado en esa posición; el del
//      CANTO es otro degradado radial puesto como fondo del borde, que se consigue con dos
//      capas de fondo (`padding-box` para la cara y `border-box` para el filo) y un borde
//      transparente. No hay elementos extra ni bucle de animación.
//   2. Sin puntero (teclado, táctil, o el ratón fuera) la luz vuelve a un reposo arriba y en
//      medio, que es de donde cae una lámpara; así el botón nunca se ve plano ni apagado.
//   3. El estado pulsado se hunde un píxel y pierde brillo. Va por `:active`, que cubre
//      ratón, dedo y teclado (Espacio) sin una línea de JavaScript más.
//   4. Es un `<button>` o un `<a>` de verdad (si trae `href`): foco visible, Intro y Espacio,
//      y el texto es texto. El cristal es fondo, no contenido, y con colores forzados se
//      vuelve el botón normal del sistema, que es lo que debe pasar.
//
// El dial (`gain`) acorta la transición con la que la luz sigue al puntero. A cero la luz se
// queda en reposo y no se mueve: el botón sigue siendo un botón de cristal, solo que quieto.

export default function BotonCristal({
  children,
  href,
  onClick,
  tono = '#2563eb',
  brillo = 0.55,
  tamano = 'md',
  gain = 1,
  className = '',
  style,
  ...resto
}) {
  const g = useGain(gain)
  const ref = useRef(null)

  const luz = (x, y) => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--bc-x', `${x.toFixed(1)}%`)
    el.style.setProperty('--bc-y', `${y.toFixed(1)}%`)
  }

  const alMover = (e) => {
    if (g === 0 || e.pointerType === 'touch') return
    const r = ref.current.getBoundingClientRect()
    luz(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)
  }

  // Punto 2: sin puntero, la luz vuelve a caer desde arriba y en medio.
  const alSalir = () => luz(50, -10)

  const comunes = {
    ref,
    className: `bc bc--${tamano}${g === 0 ? ' bc--quieto' : ''} ${className}`.trim(),
    onPointerMove: alMover,
    onPointerLeave: alSalir,
    style: {
      '--bc-x': '50%',
      '--bc-y': '-10%',
      '--bc-tono': tono,
      '--bc-brillo': brillo,
      '--bc-sigue': `${(g > 0 ? Math.min(0.12 / g, 0.4) : 0).toFixed(2)}s`,
      ...style,
    },
    ...resto,
  }

  return href ? (
    <a href={href} {...comunes}>{children}</a>
  ) : (
    <button type="button" onClick={onClick} {...comunes}>{children}</button>
  )
}
