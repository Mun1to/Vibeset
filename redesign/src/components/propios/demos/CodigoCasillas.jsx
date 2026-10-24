import CodigoCasillas from '../CodigoCasillas'
import './demos.css'

// La verificación de la demo es local y con un código que se dice en pantalla: es la
// única manera de que se vea el camino de éxito y el de error sin servidor. En un uso
// real la comprobación va en el servidor, con límite de intentos; esta pieza no la
// hace por nadie, y la nota de debajo lo recuerda.
const TEXTO = {
  es: {
    titulo: (n) => `Escribe el código de ${n} cifras`,
    pista: (c) => `Prueba con ${c} (vale) o con otro (no vale). También puedes pegar el código entero.`,
  },
  en: {
    titulo: (n) => `Enter the ${n}-digit code`,
    pista: (c) => `Try ${c} (it works) or any other (it does not). You can also paste the whole code.`,
  },
}

const DIGITOS = '2468135792468135'
const ESPERA = 900

export default function DemoCodigoCasillas({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const correcto = DIGITOS.slice(0, values.longitud)

  const verificar = (codigo) =>
    new Promise((ok) => setTimeout(() => ok(codigo === correcto), ESPERA))

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        {!compact && <p className="pd-nota">{tx.titulo(values.longitud)}</p>}
        {/* La clave reinicia el campo al cambiar la longitud: un código a medias de otro largo no vale. */}
        <CodigoCasillas {...values} key={values.longitud} idioma={lang} onCompleto={verificar} />
        {!compact && <p className="pd-nota">{tx.pista(correcto)}</p>}
      </div>
    </div>
  )
}
