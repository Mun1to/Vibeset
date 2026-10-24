import FocoPalabras from '../FocoPalabras'
import './demos.css'

// La frase es el titular de la portada de este sitio, entero: una frase con una
// sola idea se enfoca palabra a palabra sin perder el hilo, y una de relleno no
// deja ver si el marcador acierta con palabras cortas y largas mezcladas.
const AVISO = {
  es: 'Pasa el ratón por las palabras, o enfoca la frase y usa las flechas.',
  en: 'Hover the words, or focus the sentence and use the arrow keys.',
}

export default function DemoFocoPalabras({ values, compact, lang, t }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <FocoPalabras
          {...values}
          // A tamaño de tarjeta la letra mide la mitad y el mismo desenfoque la borra.
          desenfoque={compact ? Math.min(values.desenfoque, 2) : values.desenfoque}
          frase={compact ? t.heroTitle1 : `${t.heroTitle1} ${t.heroTitle2}`}
          style={{
            fontSize: compact ? '1.15rem' : 'clamp(1.5rem, 3.6vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            maxWidth: compact ? '100%' : '30ch',
          }}
        />
        {!compact && values.manual && <p className="pd-nota">{AVISO[lang] ?? AVISO.es}</p>}
      </div>
    </div>
  )
}
