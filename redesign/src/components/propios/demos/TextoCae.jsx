import TextoCae from '../TextoCae'
import './demos.css'

// La frase es el lema real del sitio. Una frase de relleno no enseña cómo se reparten
// palabras de longitud desigual al apilarse, que es donde se nota si la física va bien.
const TEXTO = {
  es: 'Un sitio con todo lo que necesitas para construir en la web, gratis, sin registro y sin rastreo',
  en: 'One place with everything you need to build for the web, free, no sign-up and no tracking',
}

export default function DemoTextoCae({ values, compact, lang }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: compact ? '0.5rem' : '1rem' }}>
      <TextoCae
        {...values}
        texto={TEXTO[lang] ?? TEXTO.es}
        alto={compact ? 12.5 : values.alto}
        tamano={compact ? 1 : values.tamano}
        idioma={lang}
      />
    </div>
  )
}
