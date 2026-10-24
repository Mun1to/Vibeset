import { useId, useState } from 'react'
import { useGain } from './movimiento'
import './MenuRamas.css'

// Menú en árbol con ramas que se dibujan. Código PROPIO, escrito desde cero.
//
// Para la navegación de unas docs o de un árbol de archivos: grupos que se abren y
// dentro sus opciones, unidas al grupo por unas ramas que se trazan al abrir y se
// retiran al cerrar. Las ramas no son decoración: son lo que dice que esas opciones
// cuelgan de ese grupo y de ningún otro.
//
// Lo que hay debajo, y que decide si sirve para algo más que para verse:
//
//   1. Es un patrón de DIVULGACIÓN, no un `role="tree"`. Un árbol ARIA promete al
//      lector de pantalla una navegación con flechas que hay que programar entera
//      (y que casi nadie programa bien); un `<nav>` con listas y botones con
//      `aria-expanded` se maneja con el tabulador y la barra espaciadora, que ya
//      saben hacer todos. Menos promesa, menos fallos.
//   2. Si una opción trae `href`, es un ENLACE de verdad. Cuando cada opción es una
//      página, un `onClick` a secas deja a un buscador sin llegar a ella.
//   3. Lo que está plegado lleva `inert`: sin eso, el contenido recortado sigue en el
//      orden del tabulador y el foco se pierde dentro de algo que no se ve.
//   4. Cada rama la dibuja el propio elemento al que une (dos pseudoelementos: el
//      tramo vertical y el codo), y no un dibujo aparte que haya que mantener
//      alineado. La última opción corta el tramo vertical por la mitad y cierra el
//      árbol; añadir o quitar opciones no obliga a tocar nada más.
//   5. El alto se anima con una rejilla de 0fr a 1fr, no con un `max-height` puesto a
//      ojo que recorta los grupos largos.
//
// El dial (`gain`) acorta el trazo de las ramas y el giro del indicador. A cero el
// árbol se abre y se cierra sin animar nada, con las ramas ya dibujadas.

export default function MenuRamas({
  items,
  valor,
  valorInicial,
  abiertosInicial = [],
  unoSolo = false,
  sangria = 22,
  grosor = 1.5,
  velocidad = 0.4,
  rotulo = 'Menú',
  onElegir,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const base = useId()
  const [abiertos, setAbiertos] = useState(abiertosInicial)
  const [interno, setInterno] = useState(valorInicial)
  const elegido = valor ?? interno

  const alternar = (id) =>
    setAbiertos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : unoSolo ? [id] : [...prev, id],
    )

  const elegir = (item) => {
    if (valor === undefined) setInterno(item.id)
    onElegir?.(item.id, item)
  }

  // Cuanto más bajo el dial, más lento; a cero, nada.
  const vel = g > 0 ? Math.min(velocidad / g, 1.4) : 0

  const fila = (item, nivel, idx) => {
    const sel = elegido === item.id
    const contenido = (
      <>
        <span className="mr-nombre">{item.etiqueta}</span>
        {item.cuenta != null && <span className="mr-cuenta">{item.cuenta}</span>}
      </>
    )

    if (item.hijos?.length) {
      const abierto = abiertos.includes(item.id)
      const idCaja = `${base}-${item.id}`
      return (
        <li key={item.id} className={`mr-nodo mr-nivel-${nivel}${abierto ? ' mr-abierto' : ''}`} style={{ '--i': idx }}>
          <button
            type="button"
            className="mr-fila mr-grupo"
            aria-expanded={abierto}
            aria-controls={idCaja}
            onClick={() => alternar(item.id)}
          >
            <svg className="mr-flecha" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
              <path d="M6 3.5 L10.5 8 L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {contenido}
          </button>
          {/* Punto 5: la rejilla de 0fr a 1fr; punto 3: `inert` mientras está plegado. */}
          <div id={idCaja} className="mr-caja" inert={!abierto}>
            <ul className="mr-ramas">{item.hijos.map((h, k) => fila(h, nivel + 1, k))}</ul>
          </div>
        </li>
      )
    }

    // Punto 2: con `href` es un enlace; sin él, un botón.
    const comun = {
      className: `mr-fila mr-hoja${sel ? ' mr-elegido' : ''}`,
      'aria-current': sel ? 'true' : undefined,
      onClick: () => elegir(item),
    }
    return (
      <li key={item.id} className={`mr-nodo mr-nivel-${nivel}`} style={{ '--i': idx }}>
        {item.href ? (
          <a href={item.href} {...comun}>{contenido}</a>
        ) : (
          <button type="button" {...comun}>{contenido}</button>
        )}
      </li>
    )
  }

  return (
    <nav
      className={`mr${g === 0 ? ' mr--quieto' : ''} ${className}`.trim()}
      aria-label={rotulo}
      style={{
        '--mr-sangria': `${sangria}px`,
        '--mr-grosor': `${grosor}px`,
        '--mr-vel': `${vel.toFixed(2)}s`,
        ...style,
      }}
    >
      <ul className="mr-raiz">{items.map((it, i) => fila(it, 0, i))}</ul>
    </nav>
  )
}
