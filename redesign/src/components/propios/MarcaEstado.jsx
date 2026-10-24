import { useGain } from './movimiento'
import './MarcaEstado.css'

// Marca de estado de una tarea o de un paso. Código PROPIO, escrito desde cero.
//
// Cinco estados (pendiente, en curso, hecho, fallo, cancelado) en un SVG que DIBUJA
// su trazo al cambiar de uno a otro, en lugar de cambiar de icono de golpe. Sirve
// para lo que ya trae su lista: instalar, compilar, desplegar, comprobar.
//
// Tres decisiones que importan:
//
//   1. El estado NO se dice solo con el dibujo. Un círculo verde con un tick es
//      inútil para quien no ve el color o no ve la pantalla, así que cada marca
//      lleva su palabra en un texto solo para lectores («Hecho», «En curso, 40 %»).
//      El dibujo es decoración y va `aria-hidden`.
//   2. Todos los trazos miden 1 (`pathLength="1"`), da igual su longitud real. Así
//      la animación de dibujo es la misma cuenta para el anillo, el tick y la cruz,
//      y no hay que medir cada camino a mano.
//   3. El estado «en curso» admite dos formas: con `progreso` (de 0 a 1) el anillo se
//      llena, y sin él gira un arco, que es lo honesto cuando no se sabe cuánto falta.
//
// El dial (`gain`) alarga el dibujo y la vuelta del arco, más lentos cuanto más bajo.
// A cero todo aparece ya dibujado y el arco queda quieto: el estado se sigue viendo.

const PALABRAS = {
  es: { pendiente: 'Pendiente', curso: 'En curso', hecho: 'Hecho', fallo: 'Ha fallado', cancelado: 'Cancelado' },
  en: { pendiente: 'Pending', curso: 'Running', hecho: 'Done', fallo: 'Failed', cancelado: 'Cancelled' },
}

export default function MarcaEstado({
  estado = 'pendiente',
  progreso,
  etiqueta,
  tachado = false,
  tamano = 22,
  anunciar = false,
  idioma = 'es',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const palabras = PALABRAS[idioma] ?? PALABRAS.es
  const palabra = palabras[estado] ?? estado
  const determinado = estado === 'curso' && typeof progreso === 'number'
  const pct = determinado ? Math.round(Math.min(Math.max(progreso, 0), 1) * 100) : null

  // Cuanto más bajo el dial, más lento: con 0,3 (movimiento reducido) el dibujo tarda 1,2 s.
  const dibujo = g > 0 ? Math.min(0.4 / g, 1.2) : 0
  const vuelta = g > 0 ? Math.min(0.9 / g, 3) : 0

  // Un paso tachado es uno que ya no se va a hacer o que ya está hecho.
  const tacha = tachado && (estado === 'hecho' || estado === 'cancelado')

  return (
    <span
      className={`ms ms--${estado}${g === 0 ? ' ms--quieto' : ''}${tacha ? ' ms--tachado' : ''} ${className}`.trim()}
      role={anunciar ? 'status' : undefined}
      style={{
        '--ms-tam': `${tamano}px`,
        '--ms-dibujo': `${dibujo.toFixed(2)}s`,
        '--ms-vuelta': `${vuelta.toFixed(2)}s`,
        ...style,
      }}
    >
      <svg className="ms-icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {/* La `key` es el estado: al cambiar, React monta trazos nuevos y vuelven a dibujarse. */}
        <g key={estado} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {estado === 'pendiente' && (
            <circle className="ms-anillo ms-punteado" cx="12" cy="12" r="9" pathLength="1" />
          )}
          {estado === 'curso' && (
            // El anillo de fondo es solo la pista; encima va lo hecho o el arco que gira.
            <>
              <circle className="ms-pista" cx="12" cy="12" r="9" />
              {determinado ? (
                <circle
                  className="ms-arco ms-lleno"
                  cx="12" cy="12" r="9" pathLength="1"
                  strokeDasharray={`${pct / 100} 1`}
                />
              ) : (
                <circle
                  className="ms-arco ms-gira"
                  cx="12" cy="12" r="9" pathLength="1"
                  strokeDasharray="0.28 1"
                />
              )}
            </>
          )}
          {(estado === 'hecho' || estado === 'fallo' || estado === 'cancelado') && (
            <circle className="ms-anillo ms-traza" cx="12" cy="12" r="9" pathLength="1" />
          )}
          {estado === 'hecho' && (
            <path className="ms-signo ms-traza" d="M7.8 12.4 L10.8 15.4 L16.4 9" pathLength="1" />
          )}
          {estado === 'fallo' && (
            <>
              <path className="ms-signo ms-traza" d="M9 9 L15 15" pathLength="1" />
              <path className="ms-signo ms-traza ms-retraso" d="M15 9 L9 15" pathLength="1" />
            </>
          )}
          {estado === 'cancelado' && (
            <path className="ms-signo ms-traza" d="M8 16 L16 8" pathLength="1" />
          )}
        </g>
      </svg>

      {etiqueta != null && <span className="ms-etiqueta">{etiqueta}</span>}
      {/* Punto 1: el estado dicho con palabras, para quien no ve el dibujo. */}
      <span className="ms-lector">
        {etiqueta != null ? ': ' : ''}
        {palabra}
        {pct != null ? `, ${pct} %` : ''}
      </span>
    </span>
  )
}
