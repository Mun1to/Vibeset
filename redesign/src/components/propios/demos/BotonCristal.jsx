import BotonCristal from '../BotonCristal'
import './demos.css'

// Tres botones con el mismo cristal y distinto tono, para ver cómo se comporta la luz sobre
// colores claros y oscuros. Los textos son las acciones de verdad de este sitio, y el último
// es un enlace real, para que se vea que la pieza vale igual como `<a>`.
const TEXTO = {
  es: { aportar: 'Aportar', codigo: 'Ver el código', licencia: 'Licencia MIT' },
  en: { aportar: 'Contribute', codigo: 'View the code', licencia: 'MIT licence' },
}

export default function DemoBotonCristal({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <div className="pd-fila" style={{ gap: '1rem' }}>
          <BotonCristal {...values}>{tx.aportar}</BotonCristal>
          {!compact && (
            <>
              <BotonCristal {...values} tono="#7c3aed" href="https://github.com/Mun1to/Vibeset" target="_blank" rel="noreferrer">
                {tx.codigo}
              </BotonCristal>
              <BotonCristal {...values} tono="#0f766e">{tx.licencia}</BotonCristal>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
