import { useState } from 'react'
import BotonMecha from '../BotonMecha'
import './demos.css'

// La acción es mandar una aportación, que es de lo que va este sitio y es de las que sí
// se pueden retirar mientras no ha salido. Aquí no se manda nada: la demo cuenta cuántas
// veces se ha confirmado de verdad (al acabar la mecha) y cuántas se han deshecho, para
// que se vea que deshacer a tiempo evita la acción y esperar la confirma.
const TEXTO = {
  es: {
    rotulo: 'Enviar aportación',
    hecho: 'Enviada',
    nota: (c, d) => `Confirmadas: ${c} · Deshechas: ${d}`,
    ayuda: 'Pulsa y espera, o deshaz. Con el ratón encima la mecha se detiene.',
  },
  en: {
    rotulo: 'Send contribution',
    hecho: 'Sent',
    nota: (c, d) => `Confirmed: ${c} · Undone: ${d}`,
    ayuda: 'Press and wait, or undo. With the mouse over it the fuse stops.',
  },
}

export default function DemoBotonMecha({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const [confirmadas, setConfirmadas] = useState(0)
  const [deshechas, setDeshechas] = useState(0)

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <BotonMecha
          {...values}
          rotuloHecho={tx.hecho}
          idioma={lang}
          onConfirmar={() => setConfirmadas((n) => n + 1)}
          onDeshacer={() => setDeshechas((n) => n + 1)}
        >
          {tx.rotulo}
        </BotonMecha>
        {!compact && <p className="pd-nota">{tx.nota(confirmadas, deshechas)}</p>}
        {!compact && <p className="pd-nota">{tx.ayuda}</p>}
      </div>
    </div>
  )
}
