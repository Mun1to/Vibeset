import CurvasNivel from '../CurvasNivel'
import './demos.css'

// Encima va una frase del sitio, que es para lo que sirve un fondo así: dar relieve a una
// portada sin quitarle al texto el sitio. El titular sale de la propia portada.
export default function DemoCurvasNivel({ values, compact, t }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <CurvasNivel {...values}>
        <h3 style={{ margin: 0, fontSize: compact ? '1.05rem' : 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 800, lineHeight: 1.2, maxWidth: '22ch' }}>
          {t.heroTitle1}
        </h3>
      </CurvasNivel>
    </div>
  )
}
