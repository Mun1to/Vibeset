import MiraCursor from '../MiraCursor'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// Los objetivos son las seis secciones de este sitio, con cuántas fichas tiene cada una:
// al pasar la mira por una, se bloquea sobre ella y la etiqueta dice su nombre. Son cajas
// normales con un atributo `data-mira`, que es todo lo que hace falta para que la mira
// las reconozca. Fuera de las cajas, la etiqueta enseña las coordenadas.
const SECCIONES = [
  ['languages', 'langs'],
  ['resources', 'res'],
  ['concepts', 'concepts'],
  ['components', 'comps'],
  ['skills', 'skills'],
  ['consejos', 'consejos'],
]

const TEXTO = {
  es: { nota: 'Pasa el puntero por las cajas, y pulsa en cualquier sitio.', fichas: (n) => `${n} fichas` },
  en: { nota: 'Move the pointer over the boxes, and press anywhere.', fichas: (n) => `${n} entries` },
}

export default function DemoMiraCursor({ values, compact, lang, t }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <MiraCursor {...values} className="pd-mira">
        <div className="pd-mira-rejilla">
          {SECCIONES.map(([sec, total]) => (
            <div key={sec} className="pd-mira-caja" data-mira={t.nav[sec]}>
              <span className="pd-mira-nombre">{t.nav[sec]}</span>
              <span className="pd-mira-cuenta">{tx.fichas(TOTALES[total])}</span>
            </div>
          ))}
        </div>
        {!compact && <p className="pd-nota pd-mira-nota">{tx.nota}</p>}
      </MiraCursor>
    </div>
  )
}
