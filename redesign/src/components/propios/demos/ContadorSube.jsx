import { useState } from 'react'
import ContadorSube from '../ContadorSube'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// Las cifras son las del catálogo de este sitio, las mismas que salen en la portada:
// un contador que sube hasta «12.345» enseña la animación, pero no enseña cómo
// queda con tres cifras reales una al lado de otra, que es como se usa.
const TEXTO = {
  es: { repetir: 'Repetir' },
  en: { repetir: 'Replay' },
}

export default function DemoContadorSube({ values, compact, lang, t }) {
  // Cambiar la clave desmonta y vuelve a montar los contadores: es la forma de
  // verlos subir otra vez sin recargar la página.
  const [vuelta, setVuelta] = useState(0)

  const datos = compact
    ? [{ n: TOTALES.langs, r: t.nav.languages }]
    : [
        { n: TOTALES.langs, r: t.nav.languages },
        { n: TOTALES.res, r: t.nav.resources },
        { n: TOTALES.concepts, r: t.nav.concepts },
      ]

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <div className="pd-fila" key={vuelta}>
          {datos.map((d) => (
            <div className="pd-dato" key={d.r}>
              <ContadorSube {...values} hasta={d.n} idioma={lang} className="pd-cifra" />
              <span className="pd-rotulo">{d.r}</span>
            </div>
          ))}
        </div>
        {!compact && (
          <button type="button" className="pd-boton" onClick={() => setVuelta((v) => v + 1)}>
            {TEXTO[lang]?.repetir ?? TEXTO.es.repetir}
          </button>
        )}
      </div>
    </div>
  )
}
