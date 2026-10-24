// El registro de Vibeset, generado desde el mismo catálogo que alimenta el sitio.
// Es una lib pura, sin efectos: la comparten el endpoint MCP (functions/api/mcp.js),
// la emulación en dev (vite.config.js) y el generador estático del build. Una sola
// fuente de verdad, como src/lib/totales.js.
//
// Dos cosas distintas salen de aquí:
//   - El REGISTRY shadcn (indiceRegistro/itemRegistro para /r/): solo lo INSTALABLE,
//     o sea componentes y skills.
//   - La BÚSQUEDA del MCP (buscarCatalogo): todo el catálogo propio, incluidos los
//     conceptos, los consejos y los recursos, que son conocimiento, no algo que se
//     instale.
//
// Regla dura de licencias (LICENSING.md): las skills, los conceptos, los consejos y
// los recursos son CC BY de la casa y se sirven ENTEROS. En componentes hay que
// mirar el `origin`, porque desde el 2026-08-29 ya no son todos de fuera:
//   - canvasui/arlan NO son nuestros. Metadata más el comando de instalación del
//     origen, con files SIEMPRE vacío, y licencia `third-party`. Igual lo federado.
//   - reactbits tampoco, y además su licencia (MIT con Commons Clause) prohíbe
//     redistribuirlo: aquí ni siquiera hay código en el repositorio. Metadata, el
//     comando de instalación del origen, y el ANÁLISIS, que sí es nuestro (CC BY).
//     La licencia se declara como la del origen, no como `third-party` a secas.
//   - `propio` es código de la casa, MIT, y así se declara. Hoy también va con files
//     vacío, pero por un motivo distinto y que no es de licencia: esta lib es pura y
//     no lee del disco. Mientras tanto apunta al archivo en GitHub, que es honesto y
//     comprobable. Declarar `third-party` sobre código propio sí sería mentir.
import { COMPONENT_ITEMS, originalDe } from '../data/components.js'
import { SKILL_ITEMS, authorOf, repoOf } from '../data/skills.js'
import { CONCEPTS } from '../data/concepts.js'
import { CONSEJOS } from '../data/consejos.js'
import { RESOURCES } from '../data/resources.js'
import { META_CASA } from '../data/registro-meta.js'
import { slugClave } from './rutas.js'

const SCHEMA_REGISTRO = 'https://ui.shadcn.com/schema/registry.json'
const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json'
const HOMEPAGE = 'https://vibeset.dev'
const REPO = 'https://github.com/Mun1to/Vibeset'
const ATRIBUCION = 'Content from Vibeset by Munir Torres — https://vibeset.dev — CC BY 4.0'

// Del comando de instalación de origen saca la dependencia de registry shadcn.
// 'pnpm dlx shadcn@latest add @canvas-ui/bubble-react' -> '@canvas-ui/bubble-react'.
function depDeInstall(install) {
  if (!install) return []
  const m = install.match(/@[\w-]+\/[\w-]+/)
  return m ? [m[0]] : []
}

function juntar(...trozos) {
  return trozos.filter(Boolean).join(' ').toLowerCase()
}

function slug(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function normalizarComponente(item) {
  const meta = META_CASA[item.key] || {}
  const deLaCasa = item.origin === 'propio'
  // Una pieza propia puede parecerse a una de React Bits. Se dice, con su enlace y su
  // comando, pero ni una línea de su código viaja: esto es información sobre el otro.
  const parecida = originalDe(item)
  return {
    id: `component:${item.key}`,
    source: 'own',
    type: 'component',
    key: item.key,
    name: item.name,
    grupo: item.group,
    origin: item.origin,
    deLaCasa,
    clase: item.clase || 'pieza',
    // Una pieza de la casa no tiene web de origen: su sitio es su ficha aquí.
    fuente: deLaCasa && item.component
      ? `${REPO}/blob/main/redesign/src/components/propios/${item.component}.jsx`
      : null,
    install: item.install || null,
    homepage: item.url || (deLaCasa ? `${HOMEPAGE}/components/${slugClave(item.key)}` : null),
    deps: item.deps || [],
    labels: item.labels || [],
    tag: item.tag,
    desc: item.desc,
    licenciaOrigen: item.licenciaOrigen || null,
    parecida: parecida
      ? { nombre: parecida.name, url: parecida.url, install: parecida.install, licencia: parecida.licenciaOrigen }
      : null,
    // El análisis de una ficha de referencia. Es texto nuestro, no del autor.
    analisis: item.clase === 'referencia'
      ? { cuando: item.cuando, cuidado: item.cuidado, a11y: item.a11y, prompt: item.prompt, kb: item.kb, pausa: !!item.pausa }
      : null,
    meta,
    buscable: juntar(item.key, item.name, item.tag?.es, item.tag?.en, item.desc?.es, item.desc?.en, item.cuando?.es, item.cuando?.en, item.cuidado?.es, item.cuidado?.en, parecida?.name, ...(item.labels || []), ...(meta.arquetipos || [])),
  }
}

// Un texto bilingüe en el idioma pedido, con el español de respaldo.
const enIdioma = (t, lang) => (t && (t[lang] || t.es)) || ''

function normalizarSkill(item) {
  return {
    id: `skill:${item.key}`,
    source: 'own',
    type: 'skill',
    key: item.key,
    name: item.name,
    nameEn: item.nameEn,
    homepage: repoOf(item),
    plugin: item.plugin || null,
    grupo: item.group,
    autor: authorOf(item).name,
    es: item.es,
    en: item.en,
    meta: {},
    buscable: juntar(item.key, item.name, item.nameEn, item.es?.label, item.en?.label, item.es?.what, item.en?.what, item.es?.description, item.en?.description),
  }
}

// Un concepto de diseño web. Trae un prompt listo para el agente y, a veces, la web
// donde se vio la técnica en vivo.
function normalizarConcepto(item, grupoKey) {
  const key = slug(item.name)
  return {
    id: `concept:${key}`,
    source: 'own',
    type: 'concept',
    key,
    name: item.name,
    grupo: grupoKey,
    tag: item.tag || null,
    es: item.es,
    en: item.en,
    prompt: item.prompt || null,
    vistoEn: item.vistoEn || null,
    meta: {},
    buscable: juntar(item.name, item.tag, item.es?.what, item.en?.what, item.es?.use, item.en?.use),
  }
}

// Un consejo: una frase por idea, en los dos idiomas.
function normalizarConsejo(item) {
  return {
    id: `tip:${item.id}`,
    source: 'own',
    type: 'tip',
    key: item.id,
    name: item.id,
    grupo: item.grupo,
    es: item.es,
    en: item.en,
    meta: {},
    buscable: juntar(item.id, item.es, item.en),
  }
}

// Un recurso del directorio: una herramienta con su enlace.
function normalizarRecurso(item, grupoKey) {
  return {
    id: `resource:${slug(item.name)}`,
    source: 'own',
    type: 'resource',
    key: slug(item.name),
    name: item.name,
    grupo: grupoKey,
    url: item.url,
    es: item.es,
    en: item.en,
    meta: {},
    buscable: juntar(item.name, item.es, item.en, item.url),
  }
}

// Lo instalable (va al registry shadcn) y el conocimiento (solo a la búsqueda).
const INSTALABLE = [
  ...COMPONENT_ITEMS.map(normalizarComponente),
  ...SKILL_ITEMS.map(normalizarSkill),
]
const CONOCIMIENTO = [
  ...CONCEPTS.flatMap((g) => g.items.map((i) => normalizarConcepto(i, g.key))),
  ...CONSEJOS.map(normalizarConsejo),
  ...RESOURCES.flatMap((g) => g.items.map((i) => normalizarRecurso(i, g.key))),
]
const CATALOGO = [...INSTALABLE, ...CONOCIMIENTO]

function vistaCorta(x, lang) {
  const base = { id: x.id, source: x.source, type: x.type, name: x.name }
  if (x.type === 'component') {
    return { ...base, title: x.name, description: (x.tag && (x.tag[lang] || x.tag.es)) || '', homepage: x.homepage, install: x.install, meta: { ...x.meta, grupo: x.grupo } }
  }
  if (x.type === 'skill') {
    const t = x[lang] || x.es
    return { ...base, title: t.label, description: t.what, homepage: x.homepage, install: x.plugin ? `plugin: ${x.plugin}` : null, meta: { grupo: x.grupo, autor: x.autor } }
  }
  if (x.type === 'concept') {
    const t = x[lang] || x.es
    return { ...base, title: x.name, description: t.what, homepage: x.vistoEn?.url || null, install: null, meta: { grupo: x.grupo, use: t.use } }
  }
  if (x.type === 'resource') {
    return { ...base, title: x.name, description: x[lang] || x.es, homepage: x.url, install: null, meta: { grupo: x.grupo } }
  }
  // tip
  return { ...base, title: x.name, description: x[lang] || x.es, homepage: null, install: null, meta: { grupo: x.grupo } }
}

// La despensa propia en vista corta. La consume list/search del MCP.
export function catalogoPropio(lang = 'es') {
  return CATALOGO.map((x) => vistaCorta(x, lang))
}

// Puntúa un match: el nombre pesa más que el resto del texto buscable.
function puntuar(x, q) {
  const nombre = `${(x.key || '').toLowerCase()} ${(x.name || '').toLowerCase()}`
  let s = 0
  if (nombre.startsWith(q)) s += 5
  else if (nombre.includes(q)) s += 3
  if (x.buscable.includes(q)) s += 1
  return s
}

// Búsqueda en memoria sobre lo propio. Filtros:
// - tipo: 'component' | 'skill' | 'concept' | 'tip' | 'resource'
// - grupo: el grupo de la sección (scroll, texto…; web, flujo…; etc.).
// - arquetipo: solo descarta componentes que no encajen; el resto nunca se cae por
//   este filtro (no tiene arquetipo).
// - dial: 'ok' deja fuera el movimiento decorativo que no cumple la política.
// - a11y: 'ok' | 'decorativo' | 'requiere-refuerzo'
// - limit: corta el resultado.
export function buscarCatalogo(query = '', filtros = {}) {
  const { tipo, grupo, arquetipo, dial, a11y, limit } = filtros
  const lang = filtros.lang || 'es'
  const q = String(query || '').trim().toLowerCase()
  let out = CATALOGO
  if (tipo) out = out.filter((x) => x.type === tipo)
  if (grupo) out = out.filter((x) => x.grupo === grupo)
  if (arquetipo) out = out.filter((x) => !x.meta.arquetipos || x.meta.arquetipos.includes(arquetipo))
  if (dial === 'ok') out = out.filter((x) => x.meta.cumpleDial !== false)
  if (a11y) out = out.filter((x) => (x.meta.a11y || 'ok') === a11y)
  if (q) {
    out = out
      .filter((x) => x.buscable.includes(q))
      .map((x, i) => ({ x, i, s: puntuar(x, q) }))
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map((o) => o.x)
  }
  const resultados = out.map((x) => vistaCorta(x, lang))
  return typeof limit === 'number' ? resultados.slice(0, limit) : resultados
}

// El registry.json raíz: SOLO lo instalable (componentes y skills), nombres, tipos
// y descripciones cortas.
export function indiceRegistro(lang = 'es') {
  return {
    $schema: SCHEMA_REGISTRO,
    name: 'vibeset',
    homepage: HOMEPAGE,
    items: INSTALABLE.map((x) => {
      const v = vistaCorta(x, lang)
      return {
        name: x.key,
        type: x.type === 'component' ? 'registry:component' : 'registry:file',
        title: v.title,
        description: v.description,
      }
    }),
  }
}

// Un item completo por id (o por key suelta). Aquí se respeta la ley: skill y
// conocimiento con su texto dentro; componente con metadata + puntero, files vacío.
export function itemRegistro(id, lang = 'es') {
  const x = CATALOGO.find((c) => c.id === id) || CATALOGO.find((c) => c.key === id)
  if (!x) return null

  if (x.type === 'component') {
    return {
      $schema: SCHEMA_ITEM,
      name: x.key,
      type: 'registry:component',
      title: x.name,
      description: (x.desc && (x.desc[lang] || x.desc.es)) || '',
      homepage: x.homepage,
      dependencies: x.deps,
      registryDependencies: depDeInstall(x.install),
      // Guardia dura: NUNCA el código de canvasui/arlan/reactbits. Los propios
      // también van vacíos hoy, pero por no leer del disco desde una lib pura, no
      // por licencia.
      files: [],
      meta: {
        ...x.meta,
        origen: x.origin,
        clase: x.clase,
        install: x.install,
        instalacion: x.install ? 'shadcn' : 'manual',
        licencia: x.deLaCasa ? 'MIT' : (x.licenciaOrigen || 'third-party'),
        ...(x.deLaCasa ? { atribucion: ATRIBUCION, codigo: x.fuente } : {}),
        ...(x.parecida ? { parecidaA: x.parecida } : {}),
        ...(x.analisis
          ? {
              analisis: {
                cuando: enIdioma(x.analisis.cuando, lang),
                cuidado: enIdioma(x.analisis.cuidado, lang),
                accesibilidad: enIdioma(x.analisis.a11y, lang),
                prompt: enIdioma(x.analisis.prompt, lang),
                pesoKb: x.analisis.kb,
                sePausaFueraDePantalla: x.analisis.pausa,
                licencia: 'CC BY 4.0',
              },
              atribucion: ATRIBUCION,
            }
          : {}),
      },
    }
  }

  if (x.type === 'skill') {
    const t = x[lang] || x.es
    return {
      $schema: SCHEMA_ITEM,
      name: x.key,
      type: 'registry:file',
      title: t.label,
      description: t.description,
      files: [{ path: `${x.name}/SKILL.md`, type: 'registry:file', content: t.body }],
      meta: { grupo: x.grupo, autor: x.autor, repo: x.homepage, plugin: x.plugin, licencia: 'CC BY 4.0', atribucion: ATRIBUCION },
    }
  }

  if (x.type === 'concept') {
    const t = x[lang] || x.es
    return {
      name: x.key,
      type: 'concept',
      title: x.name,
      description: t.what,
      use: t.use,
      tag: x.tag,
      prompt: (x.prompt && (x.prompt[lang] || x.prompt.es)) || null,
      vistoEn: x.vistoEn,
      meta: { grupo: x.grupo, licencia: 'CC BY 4.0', atribucion: ATRIBUCION },
    }
  }

  if (x.type === 'resource') {
    return {
      name: x.key,
      type: 'resource',
      title: x.name,
      description: x[lang] || x.es,
      url: x.url,
      meta: { grupo: x.grupo, licencia: 'CC BY 4.0', atribucion: ATRIBUCION },
    }
  }

  // tip
  return {
    name: x.key,
    type: 'tip',
    title: x.name,
    text: x[lang] || x.es,
    meta: { grupo: x.grupo, licencia: 'CC BY 4.0', atribucion: ATRIBUCION },
  }
}
