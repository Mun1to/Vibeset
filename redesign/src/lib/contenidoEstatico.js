// El contenido del sitio, escrito en HTML plano dentro de cada dirección.
//
// SOLO lo usa el build (`prerenderMeta` en vite.config.js). No lo importa nada
// de la aplicación, así que no entra en el bundle que descarga el visitante.
//
// Por qué existe. Hasta el 2026-08-17 el HTML servido era la cabecera y
// `<div id="root"></div>`: 4 KB sin una sola palabra del catálogo. Los robots
// que dibujan la vista previa de un enlace ya tenían lo suyo con el meta
// cocinado, pero los que RESPONDEN preguntas (Claude, ChatGPT, Perplexity) no
// ejecutan JavaScript: entraban en `/languages/python` y no encontraban ni el
// nombre de Python. Google sí renderiza, pero tarde y con menos peso.
//
// No es cloaking, y la diferencia importa: esto dice exactamente lo mismo que
// ve una persona, sacado de los mismos archivos de `data/`. Si algún día dijera
// otra cosa, sería motivo de penalización y estaría bien merecida.
//
// Se escribe en un nodo aparte (`#pre`), no dentro de `#root`, y `main.jsx` lo
// borra justo antes de montar React. Aparece pintado mientras el bundle carga,
// que es mejor que la pantalla en blanco que había antes.

import { LANGUAGES } from '../data/languages.js'
import { RESOURCES } from '../data/resources.js'
import { CONCEPTS } from '../data/concepts.js'
import { COMPONENT_ITEMS, COMPONENT_GROUPS, nombreDe, formatoKb, originalDe, etiquetasDe } from '../data/components.js'
import { SKILL_ITEMS } from '../data/skills.js'
import { CONSEJOS, CONSEJO_GRUPOS } from '../data/consejos.js'
import { trozosDe } from './marcado.js'
import { NIVELES, PASOS } from '../data/guia.js'
import { rutaDe, slugClave, slugLenguaje } from './rutas.js'

const SECCIONES = ['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']

const esc = (s) => String(s ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

const a = (href, texto) => `<a href="${esc(href)}">${esc(texto)}</a>`
const p = (texto) => (texto ? `<p>${esc(texto)}</p>` : '')
const ul = (lineas) => (lineas.length ? `<ul>${lineas.map((l) => `<li>${l}</li>`).join('')}</ul>` : '')
const nota = (texto) => (texto ? ` <span class="sec">${esc(texto)}</span>` : '')

// Los campos largos de una ficha vienen unas veces como lista y otras como
// frase suelta. Se pinta lo que haya en vez de asumir una forma.
const bloque = (titulo, valor) => {
  if (!valor || (Array.isArray(valor) && !valor.length)) return ''
  const cuerpo = Array.isArray(valor) ? ul(valor.map(esc)) : p(valor)
  return `<h2>${esc(titulo)}</h2>${cuerpo}`
}

// El texto de un consejo y el de la guía llevan **negrita** y `código`: se
// reutiliza el mismo troceador que usan en pantalla, para que digan lo mismo.
const marcadoHtml = (texto) => trozosDe(texto).map((t) =>
  t.tipo === 'fuerte' ? `<b>${esc(t.texto)}</b>`
    : t.tipo === 'codigo' ? `<code>${esc(t.texto)}</code>`
    : esc(t.texto)).join('')

function cabecera(t, vista, lang) {
  const enlaces = SECCIONES
    .filter((s) => s !== vista)
    .map((s) => a(rutaDe(s, null, lang), t.nav[s]))
  return `<header>${a(rutaDe('home', null, lang), 'Vibeset')}${ul(enlaces)}</header>`
}

const pie = () => `<footer>${a('https://github.com/Mun1to/Vibeset', 'Vibeset en GitHub')}</footer>`

// ---------------------------------------------------------------- las vistas

const home = (t, lang) => `
  <h1>Vibeset</h1>
  ${p(`${t.heroTitle1} ${t.heroTitle2}`)}
  ${p(t.heroSub)}
  ${ul([
    a(rutaDe('languages', null, lang), t.nav.languages) + nota(`${LANGUAGES.length} fichas. ${t.langsSub(LANGUAGES.length)}`),
    a(rutaDe('resources', null, lang), t.nav.resources) + nota(`${RESOURCES.reduce((n, g) => n + g.items.length, 0)} recursos. ${t.resSub}`),
    a(rutaDe('concepts', null, lang), t.nav.concepts) + nota(`${CONCEPTS.reduce((n, g) => n + g.items.length, 0)} técnicas. ${t.conceptsSub}`),
    a(rutaDe('components', null, lang), t.nav.components) + nota(`${COMPONENT_ITEMS.length} componentes. ${t.compSub}`),
    a(rutaDe('skills', null, lang), t.nav.skills) + nota(`${SKILL_ITEMS.length} skills. ${t.skillsSub}`),
    a(rutaDe('consejos', null, lang), t.nav.consejos) + nota(`${CONSEJOS.length} consejos. ${t.consejosSub}`),
  ])}`

const listaLenguajes = (t, lang) => `
  <h1>${esc(t.gridTitle)}</h1>
  ${p(t.langsSub(LANGUAGES.length))}
  ${ul(LANGUAGES.map((l) =>
    a(rutaDe('languages', slugLenguaje(l.name), lang), l.name) + nota(l[lang]?.desc)))}`

const fichaLenguaje = (l, t, lang) => {
  const d = l[lang] ?? l.es
  return `
  <h1>${esc(l.name)}</h1>
  ${p(d.fullDesc || d.desc)}
  ${ul([
    l.creator ? `Creado por ${esc(l.creator)}` : '',
    l.year ? `Año ${esc(l.year)}` : '',
    d.paradigm ? `Paradigma: ${esc(d.paradigm)}` : '',
    l.extensions?.length ? `Extensiones: ${esc(l.extensions.join(', '))}` : '',
  ].filter(Boolean))}
  ${bloque('Para qué se usa', d.uses)}
  ${bloque('A favor', d.pros)}
  ${bloque('En contra', d.cons)}
  ${l.eco?.length ? bloque('Ecosistema', l.eco) : ''}
  ${l.example ? `<h2>Ejemplo</h2><pre><code>${esc(l.example)}</code></pre>` : ''}`
}

const listaRecursos = (t, lang) => `
  <h1>${esc(t.resTitle)}</h1>
  ${p(t.resSub)}
  ${RESOURCES.map((g) => `<h2>${esc(g.label[lang])}</h2>${ul(g.items.map((i) =>
    a(i.url, i.name) + nota(i[lang])))}`).join('')}`

const listaConceptos = (t, lang) => `
  <h1>${esc(t.conceptsTitle)}</h1>
  ${p(t.conceptsSub)}
  ${CONCEPTS.map((g) => `<h2>${esc(g.label[lang])}</h2>${ul(g.items.map((i) => {
    const d = i[lang] ?? i.es
    // El «visto en» entra en el HTML plano igual que el resto: es contenido, y
    // encima el más citable de la ficha. Un robot que responde «¿qué webs usan
    // scroll-driven animations?» necesita leer esto sin ejecutar JavaScript.
    const visto = i.vistoEn
      ? ` ${esc(t.vistoEn)}: ${a(i.vistoEn.url, i.vistoEn.sitio)}, ${esc(i.vistoEn[lang])}.`
      : ''
    // Y el prompt igual, por el mismo motivo y con más razón: es la parte de la
    // ficha que alguien va a querer copiar tal cual, y quien pregunta «cómo le
    // pido a mi agente un scroll horizontal» está preguntando exactamente esto.
    const pedir = i.prompt?.[lang] ? ` ${esc(t.conceptPrompt)}: ${esc(i.prompt[lang])}` : ''
    return `<b>${esc(i.name)}</b>${nota(i.tag)}${d?.what ? ` ${esc(d.what)}` : ''}${d?.use ? ` ${esc(d.use)}` : ''}${visto}${pedir}`
  }))}`).join('')}`

const listaComponentes = (t, lang) => `
  <h1>${esc(t.compTitle)}</h1>
  ${p(t.compSub)}
  ${COMPONENT_GROUPS.map((g) => {
    const items = COMPONENT_ITEMS.filter((c) => c.group === g.key)
    if (!items.length) return ''
    return `<h2>${esc(g.label[lang])}</h2>${ul(items.map((c) =>
      a(rutaDe('components', slugClave(c.key), lang), nombreDe(c, lang)) + nota(c.tag?.[lang])))}`
  }).join('')}`

// La ficha de referencia (análisis sin demo ni código) entra entera en el HTML
// plano: su texto ES el contenido, y el prompt es lo más citable de la ficha.
const analisisReferencia = (c, t, lang) => `
  ${p(t.compRefAviso)}
  <h2>${esc(t.compCuando)}</h2>${p(c.cuando[lang])}
  <h2>${esc(t.compCuidado)}</h2>${p(c.cuidado[lang])}
  <h2>${esc(t.compA11y)}</h2>${p(c.a11y[lang])}
  <h2>${esc(t.compFicha)}</h2>
  ${ul([
    `${esc(t.compDibuja)}: ${esc(etiquetasDe(c, lang).join(', '))}`,
    `${esc(t.compDepende)}: ${esc(c.deps.length ? c.deps.join(', ') : t.compNada)}`,
    `${esc(t.compPeso)}: ${esc(formatoKb(c.kb, lang))}`,
    c.pausa ? `${esc(t.compPausa)}: ${esc(t.compSi)}` : '',
  ].filter(Boolean))}
  <h2>${esc(t.compPrompt)}</h2>${p(c.prompt[lang])}`

// Lo que vimos del original de React Bits cuando la pieza propia se le parece.
const sobreElOriginal = (c, t, lang) => {
  const o = originalDe(c)
  if (!o) return ''
  return `
  <h2>${esc(t.compOriginalTitulo(o.name))}</h2>${p(t.compOriginalNota(o.name))}
  <h3>${esc(t.compCuando)}</h3>${p(o.cuando[lang])}
  <h3>${esc(t.compCuidado)}</h3>${p(o.cuidado[lang])}
  <h3>${esc(t.compA11y)}</h3>${p(o.a11y[lang])}
  ${ul([a(o.url, o.name), `<code>${esc(o.install)}</code>`])}`
}

const fichaComponente = (c, t, lang) => `
  <h1>${esc(nombreDe(c, lang))}</h1>
  ${p(c.desc?.[lang])}
  ${ul([
    c.labels?.length ? esc(etiquetasDe(c, lang).join(', ')) : '',
    c.url ? a(c.url, t.compDocsOriginal) : '',
  ].filter(Boolean))}
  ${c.clase === 'referencia' ? analisisReferencia(c, t, lang) : ''}
  ${c.install ? `<h2>${esc(t.compInstall)}</h2><pre><code>${esc(c.install)}</code></pre>` : ''}
  ${sobreElOriginal(c, t, lang)}`

const listaSkills = (t, lang) => `
  <h1>${esc(t.skillsTitle)}</h1>
  ${p(t.skillsSub)}
  ${ul(SKILL_ITEMS.map((s) =>
    a(rutaDe('skills', slugClave(s.key), lang), s[lang]?.label ?? s.name) + nota(s[lang]?.what)))}`

const fichaSkill = (s, t, lang) => {
  const d = s[lang] ?? s.es
  return `
  <h1>${esc(d.label ?? s.name)}</h1>
  ${p(d.what)}
  ${bloque('Cuándo se usa', d.when)}
  ${d.body ? `<h2>SKILL.md</h2><pre><code>${esc(d.body)}</code></pre>` : ''}`
}

const listaConsejos = (t, lang) => `
  <h1>${esc(t.consejosTitle)} (${esc(t.beta)})</h1>
  ${p(t.consejosSub)}
  ${CONSEJO_GRUPOS.map((g) => {
    const items = CONSEJOS.filter((c) => c.grupo === g.key)
    if (!items.length) return ''
    return `<h2>${esc(g.label[lang])}</h2>${ul(items.map((c) =>
      marcadoHtml(c[lang] ?? c.es) + (c.autor ? nota(`@${c.autor}`) : '')))}`
  }).join('')}`

// La guía entera, con sus ocho bloques y todos los niveles. En pantalla el
// nivel ATENÚA lo que no es tuyo pero no lo esconde, así que este HTML dice
// exactamente lo mismo que se ve: si escondiera, el texto cocinado y la página
// contarían cosas distintas, que es justo lo que penaliza un buscador.
const guia = (t, lang) => `
  <h1>${esc(t.guiaTitle)}</h1>
  ${p(t.guiaSub)}
  <h2>${esc(t.guiaNivelRotulo)}</h2>
  ${ul(NIVELES.map((n) => `<b>${esc(n[lang].nombre)}</b>${nota(n[lang].pie)}`))}
  ${PASOS.map((paso) => {
    const d = paso[lang] ?? paso.es
    const glosario = d.glosario
      ? ul(d.glosario.map((g) => `<b>${esc(g.palabra)}</b>${nota(g.def)}`))
      : ''
    const lista = d.lista ? ul(d.lista.map((x) => marcadoHtml(x))) : ''
    const enlaces = d.enlaces?.length
      ? ul(d.enlaces.map((e) => a(rutaDe(e.seccion, null, lang) + (e.cat ? `?cat=${e.cat}` : ''), e.texto)))
      : ''
    return `<h2>${esc(d.titulo)}</h2><p>${marcadoHtml(d.texto)}</p>` +
      (d.texto2 ? `<p>${marcadoHtml(d.texto2)}</p>` : '') +
      glosario + lista + (d.aviso ? p(d.aviso) : '') + enlaces
  }).join('')}
  ${p(t.guiaFinal)}`

const noHay = (t) => `<h1>${esc(t.noHayTitulo)}</h1>${p(t.noHayTexto)}`

// ------------------------------------------------------------------- público

// El HTML que se cocina dentro de `<div id="pre">` para una dirección.
export function contenidoDePagina({ vista, ficha, lang, t }) {
  const cuerpo =
    vista === '404' ? noHay(t)
    : vista === 'home' ? home(t, lang)
    : vista === 'languages' ? (ficha ? fichaLenguaje(ficha, t, lang) : listaLenguajes(t, lang))
    : vista === 'components' ? (ficha ? fichaComponente(ficha, t, lang) : listaComponentes(t, lang))
    : vista === 'skills' ? (ficha ? fichaSkill(ficha, t, lang) : listaSkills(t, lang))
    : vista === 'resources' ? listaRecursos(t, lang)
    : vista === 'concepts' ? listaConceptos(t, lang)
    : vista === 'consejos' ? listaConsejos(t, lang)
    : vista === 'guia' ? guia(t, lang)
    : home(t, lang)

  return `${cabecera(t, vista, lang)}<main>${cuerpo}</main>${pie()}`
}

// Los datos estructurados de una dirección, ya en JSON.
//
// Se queda corto a propósito: solo se declara lo que de verdad se ve en la
// página. Marcar de más es motivo de penalización, y aquí no hay ni precios ni
// valoraciones ni artículos que fingir.
export function jsonLdDePagina({ vista, ficha, lang, t, base, url, titulo, descripcion }) {
  const organizacion = {
    '@type': 'Organization',
    '@id': `${base}/#organizacion`,
    name: 'Vibeset',
    url: base,
    // El logo, no la tarjeta social: `og.png` es un banner de 1200x630 con
    // texto dentro, y quien pide el logo de una organización espera la marca.
    logo: `${base}/brand/icon-512.png`,
    sameAs: ['https://github.com/Mun1to/Vibeset'],
  }

  // El sitio y la organización van en TODAS las páginas, no solo en la portada.
  // Antes se emitían solo ahí, y las otras 137 referenciaban `#sitio` y
  // `#organizacion` con un `@id` que en ese documento no existía: quien lee el
  // grafo de forma estricta se encontraba una referencia colgando y descartaba
  // la asociación de la página con el sitio.
  const sitio = {
    '@type': 'WebSite',
    '@id': `${base}/#sitio`,
    name: 'Vibeset',
    url: base,
    inLanguage: lang === 'en' ? 'en' : 'es',
    publisher: { '@id': `${base}/#organizacion` },
  }

  if (vista === 'home') return [organizacion, { ...sitio, description: descripcion }]

  const migas = [{ '@type': 'ListItem', position: 1, name: 'Vibeset', item: base + rutaDe('home', null, lang) }]
  if (vista !== '404') {
    migas.push({ '@type': 'ListItem', position: 2, name: t.nav[vista] ?? vista, item: base + rutaDe(vista, null, lang) })
    if (ficha) migas.push({ '@type': 'ListItem', position: 3, name: titulo.split(' · ')[0], item: url })
  }

  const nodos = [organizacion, sitio, { '@type': 'BreadcrumbList', itemListElement: migas }]

  // En una sección sin fichas propias, la lista es la página entera: se declara
  // cuántas cosas hay, que es justo lo que se enseña.
  if (!ficha && vista !== '404') {
    const cuantos = {
      languages: LANGUAGES.length,
      resources: RESOURCES.reduce((n, g) => n + g.items.length, 0),
      concepts: CONCEPTS.reduce((n, g) => n + g.items.length, 0),
      components: COMPONENT_ITEMS.length,
      skills: SKILL_ITEMS.length,
      consejos: CONSEJOS.length,
    }[vista]

    if (cuantos) {
      nodos.push({
        '@type': 'CollectionPage',
        name: titulo,
        description: descripcion,
        url,
        inLanguage: lang === 'en' ? 'en' : 'es',
        isPartOf: { '@id': `${base}/#sitio` },
        mainEntity: { '@type': 'ItemList', numberOfItems: cuantos },
      })
    }
  }

  return nodos
}
