import { useState } from 'react'
import NotaAsoma from '../NotaAsoma'
import './demos.css'

// La pregunta es sobre la propia pieza, y la media del modo de lectura la elige quien
// mira desde el panel, con una nota que lo dice: enseñar una media que parece de
// votos reales cuando nadie ha votado es inventar un dato, que es de lo que avisa la
// ficha del original al pie de esta misma página.
const TEXTO = {
  es: {
    pregunta: '¿Qué te parece esta pieza?',
    sin: 'Todavía sin nota. Aquí no se guarda nada.',
    nota: (n, max) => `Tu nota: ${n} de ${max}. Aquí no se guarda nada.`,
    lectura: 'Una media de ejemplo que eliges en el panel: no hay votos de verdad.',
  },
  en: {
    pregunta: 'What do you think of this piece?',
    sin: 'No rating yet. Nothing is saved here.',
    nota: (n, max) => `Your rating: ${n} of ${max}. Nothing is saved here.`,
    lectura: 'A sample average you choose in the panel: there are no real votes.',
  },
}

export default function DemoNotaAsoma({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const [nota, setNota] = useState(0)
  const { valor, soloLectura, max } = values

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        {!compact && !soloLectura && <p className="pd-nota">{tx.pregunta}</p>}
        <NotaAsoma
          {...values}
          // Con la altura de la etiqueta incluida, al volver de lectura a interactiva no salta.
          key={soloLectura ? 'lectura' : `activa-${max}`}
          valor={soloLectura ? valor : undefined}
          // En la tarjeta pequeña llega ya con una nota: sin ella son cinco contornos vacíos.
          valorInicial={compact ? 4 : 0}
          idioma={lang}
          onCambio={setNota}
        />
        {!compact && (
          <p className="pd-nota">
            {soloLectura ? tx.lectura : nota > 0 ? tx.nota(nota, max) : tx.sin}
          </p>
        )}
      </div>
    </div>
  )
}
