import TextoOrbita from '../TextoOrbita'
import './demos.css'

// El lema es lo que de verdad promete este sitio: sin registro y sin rastreo. Un sello
// que dijera «Lorem ipsum» no enseña cómo se reparte una frase real alrededor del círculo,
// ni cuánto hay que repetirla para llenarlo.
const TEXTO = {
  es: 'Vibecoder Kit · sin registro · sin rastreo',
  en: 'Vibecoder Kit · no sign-up · no tracking',
}

export default function DemoTextoOrbita({ values, compact, lang }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <TextoOrbita
          {...values}
          texto={TEXTO[lang] ?? TEXTO.es}
          separador="  ·  "
          idioma={lang}
          botonPausa={!compact && values.botonPausa}
          centro={<span style={{ fontSize: values.forma === 'circulo' ? '3rem' : '1rem', fontWeight: 800 }}>{values.forma === 'circulo' ? 'V' : ''}</span>}
          // El círculo entero más el botón de pausa tienen que caber en el escenario de la ficha.
          style={{ '--to-ancho': compact ? '12.5rem' : values.forma === 'circulo' ? '14.5rem' : '30rem' }}
        />
      </div>
    </div>
  )
}
