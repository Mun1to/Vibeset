// La fecha del último cambio de cada página, sacada del historial de git.
//
// SOLO la usa el build (`sitemap` en vite.config.js). Un `lastmod` que se mueve en
// cada compilación le dice al buscador que todo cambió siempre, y entonces deja de
// hacerle caso. Aquí nada depende del día en que se compila: si una ficha no se
// toca, su fecha no se mueve.
//
// Mirar el archivo entero no basta: todas las skills viven en `skills.js` y todos los
// lenguajes en `languages.js`, así que corregir una errata en una ficha le cambiaría
// la fecha a las demás. Por eso cada archivo se parte en sus fichas y se busca el
// commit en el que el trozo de ESA ficha dejó de ser como es hoy.
//
// Cloudflare Pages compila con un clon superficial, sin historial: `git log` solo ve
// el último commit y todas las páginas saldrían con su fecha. El historial se pide
// antes de empezar, y si no se puede conseguir no se escribe ninguna fecha, porque
// un sitemap sin `lastmod` es válido y uno con fechas falsas engaña.

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const CLAVE_FICHA = /^ {4}key: '(.+)',$/

// De qué archivos salen las fichas de cada sección, y cómo empieza una ficha en cada
// uno. La línea de la clave es siempre el primer campo de la entrada.
const FICHAS = {
  languages: [
    { archivo: 'src/data/languages.js', inicio: /^ {2}"name": "(.+)",$/ },
    { archivo: 'src/data/codeEn.js', inicio: /^ "(.+)": \{$/ },
  ],
  components: [
    { archivo: 'src/data/components.js', inicio: CLAVE_FICHA },
    { archivo: 'src/data/componentsPropios.js', inicio: CLAVE_FICHA },
    { archivo: 'src/data/componentsRef.js', inicio: CLAVE_FICHA },
  ],
  skills: [{ archivo: 'src/data/skills.js', inicio: CLAVE_FICHA }],
}

// Las secciones que son una sola página, sin fichas propias.
const SECCIONES = {
  resources: ['src/data/resources.js'],
  concepts: ['src/data/concepts.js', 'src/data/conceptExamples.js', 'src/data/conceptExamplesEn.js'],
  consejos: ['src/data/consejos.js'],
  guia: ['src/data/guia.js'],
}

const PORTADA = ['src/data/i18n.js', 'src/components/LandingView.jsx']

const mayor = (...fechas) => fechas.filter(Boolean).sort().at(-1) ?? null

function trocear(texto, inicio) {
  const trozos = new Map()
  let clave = null
  let lineas = []
  for (const linea of texto.replaceAll('\r\n', '\n').split('\n')) {
    const m = linea.match(inicio)
    if (m) {
      if (clave !== null) trozos.set(clave, lineas.join('\n'))
      clave = m[1]
      lineas = []
    }
    lineas.push(linea)
  }
  // La última ficha acaba donde se cierra la lista: lo que hay detrás son funciones
  // del módulo, que no son contenido de esa ficha.
  const fin = lineas.findIndex((l) => l === ']' || l === '}')
  if (clave !== null) trozos.set(clave, lineas.slice(0, fin < 0 ? undefined : fin).join('\n'))
  return trozos
}

export function fechasDeRutas(rutas, raiz) {
  const git = (...args) => execFileSync('git', args, {
    cwd: raiz, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  })

  // Se vuelve a preguntar después del fetch porque sin remoto termina con éxito y
  // sin traer nada: el código de salida no dice si el historial ha llegado.
  const superficial = () => git('rev-parse', '--is-shallow-repository').trim() === 'true'
  try {
    if (superficial()) git('fetch', '--unshallow', '--quiet')
    if (superficial()) throw new Error('el clon sigue siendo superficial')
  } catch (e) {
    console.warn(`  sitemap sin lastmod: no hay historial de git (${e.message.split('\n')[0]})`)
    return new Map()
  }

  const versionDe = (hash, archivo) => {
    // Un commit que borró el archivo también sale en el log, y ahí no hay nada que leer.
    try { return git('show', `${hash}:./${archivo}`) } catch { return '' }
  }

  // Del commit más nuevo al más viejo: la primera versión en la que el trozo es
  // distinto al de hoy marca que el cambio ocurrió en el commit inmediatamente
  // posterior. Lo que aún no está en ningún commit se queda sin fecha.
  function fechasDeFichas({ archivo, inicio }) {
    const hoy = trocear(readFileSync(join(raiz, archivo), 'utf8'), inicio)
    const fechas = new Map()
    const pendientes = new Set(hoy.keys())
    let posterior = null
    for (const linea of git('log', '--format=%H %cs', '--', archivo).trim().split('\n')) {
      const [hash, fecha] = linea.split(' ')
      const version = trocear(versionDe(hash, archivo), inicio)
      for (const clave of pendientes) {
        if (version.get(clave) === hoy.get(clave)) continue
        fechas.set(clave, posterior)
        pendientes.delete(clave)
      }
      posterior = fecha
      if (!pendientes.size) break
    }
    for (const clave of pendientes) fechas.set(clave, posterior)
    return fechas
  }

  const fechaDeArchivo = new Map()
  let fecha = null
  for (const linea of git('log', '--format=@%cs', '--name-only', '--relative', '--', '.').split('\n')) {
    if (linea.startsWith('@')) fecha = linea.slice(1)
    else if (linea && !fechaDeArchivo.has(linea)) fechaDeArchivo.set(linea, fecha)
  }
  const deArchivos = (archivos) => mayor(...archivos.map((a) => fechaDeArchivo.get(a)))

  const fichas = Object.fromEntries(Object.entries(FICHAS).map(([vista, fuentes]) => {
    const fechas = new Map()
    for (const fuente of fuentes) {
      for (const [clave, dia] of fechasDeFichas(fuente)) fechas.set(clave, mayor(fechas.get(clave), dia))
    }
    return [vista, fechas]
  }))

  // Una pieza propia enseña además su código en vivo y el análisis de su original.
  const deFicha = ({ vista, ficha }) => {
    const propia = ficha.component
      ? [`src/components/propios/${ficha.component}.jsx`, `src/components/propios/${ficha.component}.css`, `src/components/propios/demos/${ficha.component}.jsx`]
      : []
    return mayor(
      fichas[vista].get(ficha.key ?? ficha.name),
      ficha.original && fichas[vista].get(ficha.original),
      deArchivos(propia),
    )
  }

  const seccion = Object.fromEntries([
    ...Object.entries(SECCIONES).map(([vista, archivos]) => [vista, deArchivos(archivos)]),
    ...Object.entries(FICHAS).map(([vista, fuentes]) => [vista, mayor(
      deArchivos(fuentes.map((f) => f.archivo)),
      ...rutas.filter((r) => r.ficha && r.vista === vista).map(deFicha),
    )]),
  ])
  const portada = mayor(deArchivos(PORTADA), ...Object.values(seccion))

  return new Map(rutas.map((r) => [
    r.ruta,
    r.ficha ? deFicha(r) : r.vista === 'home' ? portada : seccion[r.vista] ?? null,
  ]))
}
