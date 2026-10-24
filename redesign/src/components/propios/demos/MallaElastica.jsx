import MallaElastica from '../MallaElastica'
import './demos.css'

// El texto es el nombre del sitio: una palabra con letras gruesas, que es lo que se
// deforma bien. La nota dice cómo se juega, porque un juguete que no avisa de que se
// agarra se queda sin tocar.
const TEXTO = {
  es: 'Agarra el texto y suéltalo.',
  en: 'Grab the text and let go.',
}

export default function DemoMallaElastica({ values, compact, lang }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0, gridTemplateRows: compact ? '1fr' : '1fr auto' }}>
      <MallaElastica {...values} texto="Vibeset" radio={compact ? 60 : values.radio} style={{ minHeight: 0 }} />
      {!compact && <p className="pd-nota" style={{ padding: '0 1rem 0.9rem' }}>{TEXTO[lang] ?? TEXTO.es}</p>}
    </div>
  )
}
