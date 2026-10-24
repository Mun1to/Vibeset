import PinturaMetal from '../PinturaMetal'
import './demos.css'

// El nombre del sitio, que es el único texto que merece ser de metal: corto, grueso y de
// mucho contraste. Un párrafo cromado no se lee. No se traduce, es un nombre propio.
export default function DemoPinturaMetal({ values, compact }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <PinturaMetal {...values} texto="Vibeset" style={{ minHeight: 0 }} />
    </div>
  )
}
