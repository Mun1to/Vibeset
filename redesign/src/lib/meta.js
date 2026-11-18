import { useEffect } from 'react'
import { TOTALES } from './totales.js'
import { traducirRuta } from './rutas.js'
import { nombreDe } from './nombreDe.js'

// Con una sola URL, el título y la descripción de la pestaña valían para todo el
// sitio. Ahora que cada ficha tiene la suya, cada una dice lo suyo: es lo que se
// ve en la pestaña, en el historial, en el resultado de Google y en la tarjeta
// que sale al pegar el enlace en un chat.
const BASE = 'https://vibeset.dev'

function fijarMeta(selector, atributo, valor) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(atributo, valor)
}

// `activo` existe porque hay DOS sitios que ponen el meta: esta pantalla para
// la portada y el 404, y el catálogo para sus secciones y sus fichas (que es
// donde están los datos para titularlas). Los hooks no se pueden llamar a
// medias, así que el que no manda se calla en vez de no montarse.
export function useMeta({ titulo, descripcion, ruta, activo = true }) {
  useEffect(() => {
    if (!activo) return
    document.title = titulo
    fijarMeta('meta[name="description"]', 'content', descripcion)
    fijarMeta('meta[property="og:title"]', 'content', titulo)
    fijarMeta('meta[property="og:description"]', 'content', descripcion)
    fijarMeta('meta[name="twitter:title"]', 'content', titulo)
    fijarMeta('meta[name="twitter:description"]', 'content', descripcion)
    fijarMeta('meta[property="og:url"]', 'content', BASE + ruta)
    fijarMeta('link[rel="canonical"]', 'href', BASE + ruta)

    // Las alternativas por idioma también se mueven al navegar. En el HTML
    // servido ya vienen puestas por el build, que es lo que leen los buscadores;
    // esto es para que no se queden apuntando a la página anterior cuando se
    // navega dentro de la aplicación, y sobre todo para que no mientan si
    // alguien mira el head con las herramientas del navegador.
    const hermanas = { es: traducirRuta(ruta, 'es'), en: traducirRuta(ruta, 'en') }
    for (const [idioma, destino] of [...Object.entries(hermanas), ['x-default', hermanas.es]]) {
      fijarMeta(`link[rel="alternate"][hreflang="${idioma}"]`, 'href', BASE + destino)
    }
  }, [titulo, descripcion, ruta, activo])
}

// Corta por la última palabra entera: una descripción cortada a mitad de palabra
// en un resultado de búsqueda queda peor que una frase más corta.
export function recortar(texto, max = 155) {
  if (!texto || texto.length <= max) return texto ?? ''
  const trozo = texto.slice(0, max)
  return trozo.slice(0, trozo.lastIndexOf(' ')) + '…'
}

// El título y la descripción de una página, calculados sin tocar el navegador.
//
// Vive aquí y no dentro de App porque hacen falta en DOS sitios: la aplicación
// los pone al navegar, y el build los escribe dentro del HTML de cada dirección
// (`prerenderMeta` en vite.config.js). Los robots que dibujan la vista previa de
// un enlace (X, Slack, LinkedIn, WhatsApp, Discord) NO ejecutan JavaScript: si
// esto solo lo hiciera React, todas las direcciones compartirían tarjeta.
//
// `ficha` es la entrada ya resuelta cuando la ruta apunta a una: el lenguaje, el
// componente o la skill. Sin ella, la vista es una sección entera.
export function metaDePagina({ vista, ficha, lang, t }) {
  const marca = 'Vibeset'

  if (vista === '404') return { titulo: `${t.noHayTitulo} · ${marca}`, descripcion: t.noHayTexto }
  // La portada NO reutiliza el titular del hero. Un titular puede permitirse
  // catorce palabras porque se lee entero de un vistazo; la tarjeta de un chat
  // corta por donde quiere, y «Vibeset · Un sitio con todo lo que necesitas para
  // construir en la ...» llegaba cortado a Discord. Su texto propio está en el
  // i18n, y ahí manda caber.
  if (vista === 'home') {
    return { titulo: t.metaTitulo, descripcion: t.metaDesc }
  }

  if (ficha) {
    if (vista === 'languages') return { titulo: `${ficha.name} · ${marca}`, descripcion: recortar(ficha[lang].fullDesc) }
    if (vista === 'components') return { titulo: `${nombreDe(ficha, lang)} · ${marca}`, descripcion: recortar(ficha.desc[lang]) }
    if (vista === 'skills') return { titulo: `${ficha[lang].label} · ${marca}`, descripcion: recortar(ficha[lang].what) }
  }

  const titulos = {
    // `langsSub` lleva la cuenta dentro, así que aquí es una función y no un
    // texto: sin llamarla, la descripción de la página saldría con el código
    // fuente de la flecha escrito en la pestaña y en Google.
    languages: [t.gridTitle, t.langsSub(TOTALES.langs)], resources: [t.resTitle, t.resSub],
    concepts: [t.conceptsTitle, t.conceptsSub], components: [t.compTitle, t.compSub],
    skills: [t.skillsTitle, t.skillsSub], consejos: [t.consejosTitle, t.consejosSub],
    guia: [t.guiaTitle, t.guiaSub],
  }
  const [titulo, sub] = titulos[vista] ?? [marca, t.heroSub]
  // «Componentes de Vibeset» ya lleva la marca dentro: añadirla otra vez dejaba
  // «Componentes de Vibeset · Vibeset» en la pestaña y en el buscador.
  const conMarca = titulo.includes(marca) ? titulo : `${titulo} · ${marca}`
  return { titulo: conMarca, descripcion: recortar(sub) }
}
