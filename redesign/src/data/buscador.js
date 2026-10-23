import { LANGUAGES } from './languages'
import { RESOURCES } from './resources'
import { CONCEPTS } from './concepts'
import { COMPONENT_ITEMS } from './components'
import { SKILL_ITEMS } from './skills'
import { CONSEJOS, CONSEJO_GRUPOS } from './consejos'

// Índice plano de todo lo que hay en la web, para el buscador del header. Cada
// sección tiene su propio filtro en la barra lateral; esto es lo contrario:
// una sola caja que mira en todos los catálogos a la vez.
//
// Cada entrada lleva de dónde viene y con qué abrirla, para que el resultado
// no te deje en la sección y te toque buscar otra vez.

const recorta = (texto, n = 74) =>
  !texto ? '' : texto.length > n ? texto.slice(0, n - 1).trimEnd() + '…' : texto

export function construirIndice(lang) {
  const entradas = []

  for (const l of LANGUAGES) {
    const d = l[lang]
    entradas.push({
      seccion: 'languages',
      clave: l.name,
      titulo: l.name,
      sub: `${l.year} · ${recorta(d.desc, 56)}`,
      color: l.color[0],
      busca: [l.name, l.creator, d.desc, d.paradigm, ...d.uses, ...l.extensions, ...l.eco]
        .join(' ').toLowerCase(),
    })
  }

  for (const g of RESOURCES) {
    for (const r of g.items) {
      entradas.push({
        seccion: 'resources',
        clave: r.name,
        titulo: r.name,
        sub: recorta(r[lang]),
        url: r.url,
        busca: [r.name, r[lang], g.label[lang]].join(' ').toLowerCase(),
      })
    }
  }

  for (const g of CONCEPTS) {
    for (const c of g.items) {
      entradas.push({
        seccion: 'concepts',
        // La clave interna es siempre el nombre español, como en el resto de la web.
        clave: c.name,
        titulo: (lang === 'en' && c.nameEn) || c.name,
        sub: recorta(c[lang].what),
        busca: [c.name, c.nameEn ?? '', c.tag, c[lang].what, c[lang].use, g.label[lang]]
          .join(' ').toLowerCase(),
      })
    }
  }

  for (const c of COMPONENT_ITEMS) {
    entradas.push({
      seccion: 'components',
      clave: c.key,
      titulo: c.name,
      sub: c.origin ? `${c.origin}` : '',
      busca: [c.name, c.key, c.origin ?? '', c.group, c.tag?.[lang] ?? ''].join(' ').toLowerCase(),
    })
  }

  for (const s of SKILL_ITEMS) {
    const d = s[lang]
    entradas.push({
      seccion: 'skills',
      clave: s.key,
      titulo: (lang === 'en' && s.nameEn) || s.name,
      sub: recorta(d.label ?? d.what),
      busca: [s.name, s.nameEn, d.label, d.what, d.when].join(' ').toLowerCase(),
    })
  }

  for (const c of CONSEJOS) {
    const texto = c[lang] ?? c.es
    const limpio = texto.replace(/[*`]/g, '')
    const grupo = CONSEJO_GRUPOS.find((g) => g.key === c.grupo)
    entradas.push({
      seccion: 'consejos',
      clave: c.id,
      // El consejo no tiene título: el título es el consejo. Se recorta para la
      // fila y el texto entero se sigue buscando.
      titulo: recorta(limpio, 58),
      // El texto entero, además del recortado. Al abrir un consejo desde el
      // buscador, el muro se filtra por su texto, y el recorte lleva puntos
      // suspensivos al final: filtrar por eso no encuentra nada.
      texto: limpio,
      sub: c.autor ? `@${c.autor} · ${grupo?.label[lang] ?? ''}` : (grupo?.label[lang] ?? ''),
      busca: [limpio, c.autor ?? '', grupo?.label[lang] ?? ''].join(' ').toLowerCase(),
    })
  }

  return entradas
}

// Orden de las secciones en el desplegable, el mismo de la navegación.
export const ORDEN_SECCIONES = ['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']

/**
 * Devuelve los resultados agrupados por sección. Lo que empieza por lo escrito
 * va antes que lo que solo lo contiene, para que teclear "rust" saque Rust y no
 * los seis lenguajes que lo mencionan de pasada.
 */
export function buscar(indice, consulta, { porSeccion = 4, tope = 14 } = {}) {
  const q = consulta.trim().toLowerCase()
  if (q.length < 2) return []

  const marcados = []
  for (const e of indice) {
    const titulo = e.titulo.toLowerCase()
    let peso = -1
    if (titulo === q) peso = 0
    else if (titulo.startsWith(q)) peso = 1
    else if (titulo.includes(q)) peso = 2
    else if (e.busca.includes(q)) peso = 3
    if (peso >= 0) marcados.push({ ...e, peso })
  }
  marcados.sort((a, b) => a.peso - b.peso || a.titulo.length - b.titulo.length)

  const porClave = new Map()
  let total = 0
  for (const m of marcados) {
    if (total >= tope) break
    const lista = porClave.get(m.seccion) ?? []
    if (lista.length >= porSeccion) continue
    lista.push(m)
    porClave.set(m.seccion, lista)
    total++
  }

  return ORDEN_SECCIONES
    .filter((s) => porClave.has(s))
    .map((s) => ({ seccion: s, items: porClave.get(s) }))
}
