import { lazy, Suspense, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from './components/TopBar'
import LandingView from './components/LandingView'
import NoEncontrado from './components/NoEncontrado'
import Pie from './components/Pie'
import { leerRuta, rutaDe, slugClave, slugLenguaje, traducirRuta } from './lib/rutas'
import { guardarIdioma } from './lib/idioma'
import { useTema } from './lib/tema'
import { metaDePagina, useMeta } from './lib/meta'
import { I18N } from './data/i18n'
import { TOTALES } from './lib/totales'

// El catálogo entero, con sus seis secciones y sus datos, en su propio trozo.
//
// Aquí está el reparto del peso de esta web: `Catalogo` arrastra los cien
// lenguajes, las dieciocho skills y el resto del contenido, que son 374 KB (128
// ya comprimidos). La portada no enseña ninguna ficha, así que quien entra y se
// queda mirando el logo no tiene por qué bajarse el catálogo entero. Se carga en
// cuanto se pisa una sección, que es cuando hace falta de verdad.
//
// La guía va aparte por lo mismo, y además se lleva dentro el test de lenguajes,
// que antes colgaba de un botón de la barra y ahora vive donde su respuesta
// significa algo.
const Catalogo = lazy(() => import('./Catalogo'))
const Guia = lazy(() => import('./components/GuiaView'))

export default function App() {
  // Ya no devuelve nada: el tema sigue al sistema en vivo y no hay interruptor
  // que necesite su estado. Ver `lib/tema.js`.
  useTema()

  // Dónde estamos lo dice la URL y nada más: así se puede enlazar cualquier
  // ficha, el botón atrás del navegador funciona y Google ve el catálogo entero.
  const location = useLocation()
  const irA = useNavigate()
  // El idioma es parte de la dirección desde que el inglés vive en `/en`: la
  // mitad inglesa del sitio tiene ahora sus propias direcciones, que es lo que
  // hace falta para que un buscador pueda indexarla. Y como el resto del estado
  // de esta aplicación, se lee de la URL en vez de guardarse aparte, para que no
  // pueda haber dos versiones de la verdad.
  const { seccion, ficha, lang } = leerRuta(location.pathname)
  const t = I18N[lang]
  const activeNav = seccion ?? 'home'
  const rutaRota = seccion === null
  const enGuia = seccion === 'guia'
  const enCatalogo = !rutaRota && !enGuia && activeNav !== 'home'

  // Cada cambio de página empieza arriba, como en cualquier sitio con enlaces.
  useEffect(() => { window.scrollTo({ top: 0 }) }, [location.pathname])

  // El idioma declarado en el html tiene que seguir al que se está leyendo:
  // es lo que usan los lectores de pantalla y los traductores del navegador.
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  // Aquí solo se calcula el meta de lo que esta pantalla sabe pintar: la portada
  // y el «aquí no hay nada». El de las secciones y las fichas lo pone `Catalogo`,
  // porque para titular `/languages/rust` hay que tener el lenguaje delante y
  // los datos viven allí. Nunca se pisan: o se monta uno, o el otro.
  const meta = useMemo(
    () => metaDePagina({ vista: rutaRota ? '404' : enGuia ? 'guia' : 'home', ficha: null, lang, t }),
    [rutaRota, enGuia, lang, t],
  )
  // Y se calla mientras hay catálogo delante: si escribiera siempre, machacaría
  // el título que acaba de poner `Catalogo` en cuanto algo lo hiciera repintar.
  useMeta({ ...meta, ruta: location.pathname, activo: !enCatalogo })

  // Cambiar de idioma es ir a la MISMA página en la otra dirección, no cambiar
  // un estado: si solo cambiara el estado, la barra de direcciones seguiría
  // diciendo español con la página en inglés, y ese enlace compartido llegaría
  // al idioma equivocado.
  const cambiarIdioma = () => {
    const nuevo = lang === 'es' ? 'en' : 'es'
    // Se recuerda porque es una elección explícita: a partir de aquí, entrar por
    // una dirección española ya no le manda a la inglesa aunque su navegador lo
    // pida.
    guardarIdioma(nuevo)
    irA(traducirRuta(location.pathname, nuevo) + location.search)
  }

  const irAlInicio = () => irA(rutaDe('home', null, lang))
  const irALaGuia = () => irA(rutaDe('guia', null, lang))
  const abrirLenguaje = (name) => irA(rutaDe('languages', slugLenguaje(name), lang))

  // Un resultado del buscador deja la cosa abierta, no solo la sección: la ficha
  // del lenguaje, la del componente o la de la skill. Los recursos son enlaces a
  // sitios de fuera, así que se abren igual que en su propia sección.
  //
  // Los conceptos y los consejos no tienen ficha propia, así que el término
  // viaja en la dirección (`?q=`) y el catálogo lo recoge al montarse. Antes esto
  // llamaba a un setter de dentro del catálogo, y ese hilo se cortó al separarlo;
  // por la URL es además mejor, porque ese resultado se puede compartir.
  const abrirResultado = (r) => {
    if (r.seccion === 'languages') return abrirLenguaje(r.clave)
    if (r.seccion === 'resources') return window.open(r.url, '_blank', 'noopener')
    if (r.seccion === 'components') return irA(rutaDe('components', slugClave(r.clave), lang))
    if (r.seccion === 'skills') return irA(rutaDe('skills', slugClave(r.clave), lang))
    if (r.seccion === 'concepts') return irA(`${rutaDe('concepts', null, lang)}?q=${encodeURIComponent(r.clave)}`)
    if (r.seccion === 'consejos') return irA(`${rutaDe('consejos', null, lang)}?q=${encodeURIComponent(r.texto ?? r.clave)}`)
  }

  return (
    // Columna con el contenido a `flex-1`: en una página más corta que la ventana
    // (el 404, una búsqueda sin resultados) el pie baja al final en vez de
    // quedarse a media pantalla con el vacío debajo.
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-tinta">
      <TopBar
        t={t} lang={lang} onToggleLang={cambiarIdioma} activeNav={activeNav}
        totales={TOTALES}
        onLogoClick={irAlInicio}
        onAbrirResultado={abrirResultado}
        onQuizClick={irALaGuia}
      />
      <div className="flex flex-1">
        {enCatalogo ? (
          // Sin nada mientras carga: el trozo pesa lo que pesa pero llega en un
          // parpadeo desde la caché del navegador, y una pantalla de «cargando»
          // que aparece y desaparece se lee peor que un instante en blanco.
          <Suspense fallback={<main id="principal" className="flex-1 min-w-0" />}>
            <Catalogo t={t} lang={lang} />
          </Suspense>
        ) : (
          // En un 404 la columna del contenido se vuelve flex para que el aviso
          // se centre en el hueco que deja la ventana. En el resto no cambia nada.
          <main id="principal" className={`flex-1 min-w-0 overflow-hidden${rutaRota ? ' flex flex-col' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                className={rutaRota ? 'flex flex-col flex-1' : undefined}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {rutaRota
                  ? <NoEncontrado t={t} onHome={irAlInicio} />
                  : enGuia
                    ? <Suspense fallback={null}><Guia t={t} lang={lang} /></Suspense>
                    : <LandingView t={t} lang={lang} totals={TOTALES} onQuiz={irALaGuia} />}
              </motion.div>
            </AnimatePresence>
          </main>
        )}
      </div>

      {/* Fuera del flex: el pie cruza de lado a lado por debajo de la barra
          lateral, que es pegajosa y termina donde termina la ventana. */}
      {/* El idioma baja aquí desde la barra: se detecta solo del navegador, así
          que en la barra era un control que casi nadie toca ocupando sitio de
          primera fila. Pero tiene que seguir estando en algún lado, porque un
          español con el navegador en inglés vería la web en inglés y sin esto no
          tendría cómo cambiarla. */}
      <Pie t={t} totals={TOTALES} lang={lang} onToggleLang={cambiarIdioma} />

    </div>
  )
}
