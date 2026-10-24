import ResplandorAscii from '../ResplandorAscii'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// Encima del fondo va el titular de la portada de este sitio y su cuenta real: es la
// situación para la que sirve el fondo (poco contenido que respire) y la única en la que
// se ve si el texto se sigue leyendo sobre la parte más clara del campo.
//
// Y no se leía: el subtítulo caía sobre la banda de letras más brillantes y medido daba 2,6:1
// (mínimo 4,5). Lo resuelve una placa oscura con el borde difuminado detrás del texto: el campo
// sigue llenando la caja y solo se apaga justo debajo de lo que hay que leer.
const PLACA = {
  padding: '1rem 1.6rem',
  background: 'rgb(13 14 16 / 0.82)',
  boxShadow: '0 0 1.6rem 1.2rem rgb(13 14 16 / 0.82)',
}

export default function DemoResplandorAscii({ values, compact, t }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <ResplandorAscii {...values} celda={compact ? Math.max(values.celda - 3, 9) : values.celda}>
        <div style={PLACA}>
          <h3 style={{ margin: 0, fontSize: compact ? '1.1rem' : 'clamp(1.4rem, 3.4vw, 2.1rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {t.heroTitle1}
          </h3>
          {!compact && <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: '#d7dbe0' }}>{t.demoLine(TOTALES)}</p>}
        </div>
      </ResplandorAscii>
    </div>
  )
}
