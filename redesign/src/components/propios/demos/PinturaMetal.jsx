import PinturaMetal from '../PinturaMetal'
import { LOGO_TRAZO, LOGO_CAJA } from '../../logoTrazo'
import './demos.css'

const VISTA = `${LOGO_CAJA.x} ${LOGO_CAJA.y} ${LOGO_CAJA.w} ${LOGO_CAJA.h}`

// El logo del sitio es lo que merece ser de metal: un trazo grueso, de mucho contraste y que ya
// existe como SVG (el mismo que dibuja la cabecera, por eso sale de `logoTrazo`). Un párrafo
// cromado no se lee. Con `figura` se puede ver también un texto, que es el otro modo de la pieza.
// No se traduce: es un nombre propio.
export default function DemoPinturaMetal({ values, compact }) {
  const { figura, ...resto } = values
  const forma = figura === 'texto' ? { texto: 'Vibeset' } : { trazo: LOGO_TRAZO, vista: VISTA, nombre: 'Vibeset' }
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <PinturaMetal {...resto} {...forma} style={{ minHeight: 0 }} />
    </div>
  )
}
