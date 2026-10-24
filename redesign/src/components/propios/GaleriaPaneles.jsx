import { useId, useState } from 'react'
import { useGain } from './movimiento'
import './GaleriaPaneles.css'

// Galería de paneles que se abren. Código PROPIO, escrito desde cero.
//
// Una fila (o columna) de paneles estrechos de los que uno está abierto y los demás
// asoman su rótulo. Al pasar por otro, o pulsarlo, o llegar a él con el teclado, se abre
// ese y se cierran los demás. Sirve para enseñar de cuatro a seis proyectos, destinos o
// secciones en poco alto, y se ve bien con una imagen por panel o sin ninguna.
//
// Lo que cuenta de verdad está por debajo:
//
//   1. Es un ACORDEÓN y se comporta como tal. La cabecera de cada panel es un `<button>`
//      con `aria-expanded` y `aria-controls`; lo que enseña al abrirse vive en una región
//      aparte. Un montón de divs que cambian de tamaño con el ratón no dicen a un lector
//      de pantalla qué está abierto ni dejan llegar con el tabulador.
//   2. Siempre hay uno abierto. Pulsar el abierto no lo cierra: una galería sin ningún
//      panel abierto es una fila de tiras estrechas que no enseña nada.
//   3. Lo cerrado lleva `inert`: su contenido (un enlace, un botón) sale del orden del
//      tabulador, o el foco se perdería dentro de algo que no se ve.
//   4. El ancho se anima con `flex-grow`, de 1 a 6: el navegador reparte el espacio y no
//      hay una sola medida escrita a mano. Por eso añadir o quitar paneles no obliga a
//      tocar nada.
//   5. `abrir="hover"` abre al pasar el ratón; el clic y el teclado abren siempre. En táctil
//      no hay hover, así que el toque es la única vía, y por eso nunca puede ser la
//      única forma de llegar a algo: si un panel lleva `href`, es un enlace real.
//
// No trae imágenes de ningún sitio: cada panel lleva la suya (`imagen`) o ninguna. Una
// galería que pide fotos a un tercero por defecto hace que quien la use filtre las visitas
// de su web sin saberlo.
//
// El dial (`gain`) alarga la apertura. A cero el panel cambia de golpe.

export default function GaleriaPaneles({
  paneles,
  inicial = 0,
  eje = 'horizontal',
  abrir = 'hover',
  alto = 18,
  rotulo = 'Galería',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const base = useId()
  const [activo, setActivo] = useState(inicial)

  const vel = g > 0 ? Math.min(0.5 / g, 1.4) : 0

  return (
    <div
      className={`gp gp--${eje}${g === 0 ? ' gp--quieta' : ''} ${className}`.trim()}
      role="group"
      aria-label={rotulo}
      style={{ '--gp-alto': `${alto}rem`, '--gp-vel': `${vel.toFixed(2)}s`, ...style }}
    >
      {paneles.map((p, i) => {
        const abierto = i === activo
        const idCuerpo = `${base}-${i}`
        return (
          <section key={p.id ?? i} className={`gp-panel${abierto ? ' gp-abierto' : ''}`}>
            {p.imagen && <img className="gp-imagen" src={p.imagen} alt="" loading="lazy" aria-hidden="true" />}
            <button
              type="button"
              className="gp-cabecera"
              aria-expanded={abierto}
              aria-controls={idCuerpo}
              onClick={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              onPointerEnter={(e) => {
                if (abrir === 'hover' && e.pointerType === 'mouse') setActivo(i)
              }}
            >
              {p.numero != null && <span className="gp-numero" aria-hidden="true">{p.numero}</span>}
              <span className="gp-etiqueta">{p.etiqueta}</span>
            </button>
            {/* Punto 3: lo cerrado sale del tabulador. */}
            <div id={idCuerpo} className="gp-cuerpo" inert={!abierto}>
              {p.detalle && <p className="gp-detalle">{p.detalle}</p>}
              {p.href && (
                <a className="gp-enlace" href={p.href}>
                  {p.enlace ?? p.etiqueta}
                </a>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
