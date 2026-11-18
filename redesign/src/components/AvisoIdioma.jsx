import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { I18N } from '../data/i18n'
import { guardarIdioma, idiomaASugerir } from '../lib/idioma'
import { traducirRuta } from '../lib/rutas'

// La franja que ofrece la otra versión de la página sin llevarte a ella.
//
// Va en el flujo y debajo de la barra, no flotando: así no tapa nada del contenido
// y el panel del móvil, que se abre justo bajo la barra, la cubre sin descolocarse.
// Se decide en el primer render para que no aparezca después empujando la página.
//
// `data-nosnippet` evita que Google use esta frase como resumen de la página, porque
// quien rastrea lo hace con el navegador en inglés y también la ve.
export default function AvisoIdioma({ lang }) {
  const { pathname, search, hash } = useLocation()
  const [cerrado, setCerrado] = useState(false)
  const sugerido = idiomaASugerir(lang)
  if (cerrado || !sugerido) return null

  const t = I18N[sugerido].avisoIdioma
  const cerrar = () => {
    guardarIdioma(lang)
    setCerrado(true)
  }

  return (
    <aside data-aviso-idioma data-nosnippet lang={sugerido} aria-label={t.zona} className="border-b border-linea bg-panel">
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1.5">
        <p className="min-w-0 text-[13px] text-tinta">{t.texto}</p>
        <Link
          to={traducirRuta(pathname, sugerido) + search + hash}
          onClick={() => guardarIdioma(sugerido)}
          className="pulsable inline-flex items-center h-8 px-2 sm:px-3 shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold"
        >
          {t.accion}
        </Link>
        <button
          type="button"
          onClick={cerrar}
          aria-label={t.cerrar}
          title={t.cerrar}
          className="pulsable grid place-items-center w-8 h-8 shrink-0 text-tinta-suave hover:text-tinta cursor-pointer"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </aside>
  )
}
