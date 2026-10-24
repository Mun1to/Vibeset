import PanelFichas from '../PanelFichas'
import './demos.css'

// Las palabras son las seis secciones de este sitio: un panel de «Madrid, París, Roma»
// diría que Vibeset es una agencia de viajes. Se usa solo la primera palabra de cada
// nombre para que ninguna pase de once letras y el panel no cambie de ancho.
const TEXTO = {
  es: { rotulo: 'Secciones' },
  en: { rotulo: 'Sections' },
}

export default function DemoPanelFichas({ values, compact, lang, t }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const palabras = ['languages', 'resources', 'concepts', 'components', 'skills', 'consejos'].map(
    (s) => t.nav[s].split(' ')[0],
  )

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <PanelFichas
          {...values}
          palabras={palabras}
          tam={compact ? Math.min(values.tam, 1.2) : values.tam}
          botonPausa={!compact && values.botonPausa}
          idioma={lang}
          style={{ maxWidth: '100%' }}
        />
        {!compact && <p className="pd-nota">{tx.rotulo}</p>}
      </div>
    </div>
  )
}
