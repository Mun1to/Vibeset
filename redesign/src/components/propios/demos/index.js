import { lazy } from 'react'

// Las demos de las piezas propias nuevas, por la clave de su ficha. Van perezosas
// por lo mismo que el resto: nadie mira cuarenta demos a la vez. Cada demo es el
// escenario de una pieza (su contenido de muestra, hecho con datos reales del
// catálogo) y vive aparte de la pieza para que esta se pueda copiar sola.
export const DEMOS_PROPIOS = {
  textoDestello: lazy(() => import('./TextoDestello')),
  contadorSube: lazy(() => import('./ContadorSube')),
  focoPalabras: lazy(() => import('./FocoPalabras')),
}
