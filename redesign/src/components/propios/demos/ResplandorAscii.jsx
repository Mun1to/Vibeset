import ResplandorAscii from '../ResplandorAscii'
import { TOTALES } from '../../../lib/totales'
import './demos.css'

// Encima del fondo va el titular de la portada de este sitio y su cuenta real: es la
// situación para la que sirve el fondo (poco contenido que respire) y la única en la que
// se ve si el texto se sigue leyendo sobre la parte más clara del campo.
export default function DemoResplandorAscii({ values, compact, t }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <ResplandorAscii {...values} celda={compact ? Math.max(values.celda - 3, 9) : values.celda}>
        <div>
          <h3 style={{ margin: 0, fontSize: compact ? '1.1rem' : 'clamp(1.4rem, 3.4vw, 2.1rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {t.heroTitle1}
          </h3>
          {!compact && <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem', color: '#d7dbe0' }}>{t.demoLine(TOTALES)}</p>}
        </div>
      </ResplandorAscii>
    </div>
  )
}
