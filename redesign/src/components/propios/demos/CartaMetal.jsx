import CartaMetal from '../CartaMetal'
import './demos.css'

// La credencial dice lo que de verdad ofrece este sitio: licencia MIT, sin registro, sin
// rastreo y en dos idiomas. Un carné de «Nombre Apellido» con un número inventado sería un
// documento falso en una pieza que se enseña como código real; esto es una ficha de
// condiciones, que es para lo que sirve una credencial de metal en una web.
const TEXTO = {
  es: {
    subtitulo: 'Condiciones de uso',
    datos: [
      ['Licencia', 'MIT'],
      ['Registro', 'Ninguno'],
      ['Rastreo', 'Ninguno'],
      ['Idiomas', 'ES / EN'],
    ],
    nota: 'Mueve el puntero: la luz recorre el metal, la tarjeta no se mueve.',
  },
  en: {
    subtitulo: 'Terms of use',
    datos: [
      ['Licence', 'MIT'],
      ['Sign-up', 'None'],
      ['Tracking', 'None'],
      ['Languages', 'ES / EN'],
    ],
    nota: 'Move the pointer: the light runs over the metal, the card does not move.',
  },
}

export default function DemoCartaMetal({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const datos = (compact ? tx.datos.slice(0, 2) : tx.datos).map(([etiqueta, valor]) => ({ etiqueta, valor }))
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <CartaMetal
          {...values}
          titulo="Vibeset"
          subtitulo={tx.subtitulo}
          datos={datos}
          sello="V"
          idioma={lang}
          style={compact ? { width: 'min(100%, 17rem)' } : undefined}
        />
        {!compact && <p className="pd-nota">{tx.nota}</p>}
      </div>
    </div>
  )
}
