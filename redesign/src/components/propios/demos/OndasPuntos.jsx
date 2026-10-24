import OndasPuntos from '../OndasPuntos'
import './demos.css'

// El titular es el nombre del sitio: una sola palabra corta y con letras gruesas, que es
// para lo que sirve un titular hecho de puntos. Un párrafo no se leería. No se traduce,
// porque es un nombre propio.
export default function DemoOndasPuntos({ values, compact }) {
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`} style={{ padding: 0 }}>
      <OndasPuntos
        {...values}
        texto="VIBESET"
        paso={compact ? Math.max(values.paso - 4, 7) : values.paso}
        style={{ minHeight: 0 }}
      />
    </div>
  )
}
