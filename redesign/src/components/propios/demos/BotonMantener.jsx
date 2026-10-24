import { useState } from 'react'
import BotonMantener from '../BotonMantener'
import './demos.css'

// La acción de muestra es una que existe en este sitio y que cuesta rehacer: vaciar
// los favoritos. Aquí no borra nada de verdad; solo cuenta cuántas veces se ha
// confirmado, para que se vea el efecto sin riesgo.
const TEXTO = {
  es: {
    rotulo: 'Vaciar mis favoritos',
    alternativa: 'Confirmar sin mantener pulsado',
    cuenta: (n) => (n === 0 ? 'Todavía no has confirmado nada.' : `Confirmado ${n} ${n === 1 ? 'vez' : 'veces'}.`),
  },
  en: {
    rotulo: 'Clear my favourites',
    alternativa: 'Confirm without holding',
    cuenta: (n) => (n === 0 ? 'Nothing confirmed yet.' : `Confirmed ${n} ${n === 1 ? 'time' : 'times'}.`),
  },
}

export default function DemoBotonMantener({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const [veces, setVeces] = useState(0)

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <BotonMantener
          {...values}
          idioma={lang}
          alternativa={!compact && values.conAlternativa ? tx.alternativa : undefined}
          onConfirmar={() => setVeces((n) => n + 1)}
        >
          {tx.rotulo}
        </BotonMantener>
        {!compact && <p className="pd-nota">{tx.cuenta(veces)}</p>}
      </div>
    </div>
  )
}
