import TarjetaHolo from '../TarjetaHolo'
import './demos.css'

// La tarjeta presenta al propio sitio: lo que dice es cierto (es abierto a
// aportaciones, y aportar es rellenar un formulario) y el botón lleva a donde dice.
// Una tarjeta de «Ana García, diseñadora» sería un nombre inventado en una pieza
// que se enseña como código real.
const TEXTO = {
  es: {
    cargo: 'El kit del vibe coding',
    estado: 'Abierto a aportaciones',
    accion: 'Aportar',
    nota: 'Mueve el puntero por la tarjeta: se inclina y el brillo te sigue.',
  },
  en: {
    cargo: 'The vibe coding kit',
    estado: 'Open to contributions',
    accion: 'Contribute',
    nota: 'Move the pointer over the card: it tilts and the sheen follows you.',
  },
}

export default function DemoTarjetaHolo({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <TarjetaHolo
          {...values}
          disposicion={compact ? 'horizontal' : values.disposicion}
          nombre="Vibeset"
          cargo={tx.cargo}
          usuario="vibeset.dev"
          estado={tx.estado}
          accion={{ rotulo: tx.accion, href: 'https://github.com/Mun1to/Vibeset', externo: true }}
          idioma={lang}
        />
        {!compact && <p className="pd-nota">{tx.nota}</p>}
      </div>
    </div>
  )
}
