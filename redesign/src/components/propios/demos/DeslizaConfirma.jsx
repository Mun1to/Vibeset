import DeslizaConfirma from '../DeslizaConfirma'
import './demos.css'

// La acción de muestra es publicar una ficha, que es de lo que va este sitio. Tarda
// un poco a propósito: sin esa espera no se vería el estado «confirmando», que es la
// mitad de lo que hace la pieza. Si se pide que falle, rechaza como lo haría un
// servidor que no responde, y se ve el camino de error.
const TEXTO = {
  es: { rotulo: 'Desliza para publicar', hecho: 'Publicado', error: 'No se ha publicado' },
  en: { rotulo: 'Slide to publish', hecho: 'Published', error: 'Not published' },
}

const ESPERA = 1100

export default function DemoDeslizaConfirma({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es

  const publicar = () =>
    new Promise((ok, mal) => setTimeout(() => (values.fallar ? mal(new Error('simulado')) : ok()), ESPERA))

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        {/* Se reinicia sola a los 3 s para que la demo se pueda repetir sin recargar. */}
        <DeslizaConfirma
          {...values}
          idioma={lang}
          rotulo={tx.rotulo}
          rotuloHecho={tx.hecho}
          rotuloError={tx.error}
          reiniciarEn={3}
          onConfirmar={publicar}
        />
      </div>
    </div>
  )
}
