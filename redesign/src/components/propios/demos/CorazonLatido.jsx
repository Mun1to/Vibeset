import CorazonLatido from '../CorazonLatido'
import './demos.css'

// Las tres variantes de icono, una al lado de otra. La cuenta es un punto de partida
// que se elige en el panel y vive solo en esta página: la nota lo dice a las claras,
// porque un «me gusta» con un número que parece de verdad y no guarda nada es justo
// el engaño del que avisa su propia ficha.
const TEXTO = {
  es: {
    corazon: 'Me gusta',
    estrella: 'Favorito',
    pulgar: 'Útil',
    nota: 'La cuenta es solo tuya: aquí no se guarda nada.',
  },
  en: {
    corazon: 'Like',
    estrella: 'Favourite',
    pulgar: 'Useful',
    nota: 'The count is yours alone: nothing is saved here.',
  },
}

export default function DemoCorazonLatido({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const iconos = compact ? ['corazon'] : ['corazon', 'estrella', 'pulgar']
  const { conCuenta, cuentaInicial, ...resto } = values

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <div className="pd-fila">
          {iconos.map((icono) => (
            <CorazonLatido
              key={`${icono}-${conCuenta ? cuentaInicial : 'sin'}`}
              {...resto}
              icono={icono}
              rotulo={tx[icono]}
              idioma={lang}
              cuentaInicial={conCuenta ? cuentaInicial : undefined}
            />
          ))}
        </div>
        {!compact && <p className="pd-nota">{tx.nota}</p>}
      </div>
    </div>
  )
}
