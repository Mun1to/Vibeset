import TextoDestello from '../TextoDestello'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// El texto de muestra es el titular de la portada de este sitio, con su cuenta
// real debajo: un destello sobre «Lorem ipsum» no enseña cómo queda con una frase
// de verdad, que es con lo que se va a usar.
const AVISO = {
  es: {
    hover: 'Pasa el ratón por encima del titular.',
    vista: 'Se dispara al entrar en pantalla: baja y vuelve a subir.',
  },
  en: {
    hover: 'Hover the headline.',
    vista: 'It fires when it enters the screen: scroll away and back.',
  },
}

export default function DemoTextoDestello({ values, compact, lang, t }) {
  const aviso = AVISO[lang]?.[values.disparo]
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <TextoDestello
          {...values}
          style={{
            fontSize: compact ? '1.4rem' : 'clamp(1.9rem, 5.2vw, 3.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textAlign: 'center',
            maxWidth: '100%',
          }}
        >
          {t.heroTitle1}
        </TextoDestello>
        {!compact && <p className="pd-nota">{t.demoLine(TOTALES)}</p>}
        {!compact && aviso && <p className="pd-nota">{aviso}</p>}
      </div>
    </div>
  )
}
