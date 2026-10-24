import HazLaser from '../HazLaser'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// El haz apunta a algo, que es la única razón para ponerlo: una tarjeta con lo que ofrece el
// sitio, cuyo borde de arriba es la «superficie» donde aterriza. Con el puntero encima, el haz
// se mueve hacia él; sin él, se balancea sobre la tarjeta.
const TEXTO = {
  es: { titulo: 'Todo en un sitio', linea: (n) => `${n.langs} lenguajes · ${n.res} recursos · ${n.concepts} conceptos` },
  en: { titulo: 'All in one place', linea: (n) => `${n.langs} languages · ${n.res} resources · ${n.concepts} concepts` },
}

export default function DemoHazLaser({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <HazLaser {...values}>
        <div
          style={{
            width: 'min(100%, 22rem)',
            padding: compact ? '0.6rem 0.9rem' : '0.9rem 1.2rem',
            border: '1px solid #3a3d44',
            background: 'rgb(14 15 17 / 0.82)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: compact ? '0.95rem' : '1.1rem' }}>{tx.titulo}</div>
          {!compact && <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: '#d7dbe0' }}>{tx.linea(TOTALES)}</div>}
        </div>
      </HazLaser>
    </div>
  )
}
