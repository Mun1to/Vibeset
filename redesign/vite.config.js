import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BASE = 'https://vibeset.dev'

// La lista de direcciones del sitio, sacada del propio catálogo. La usan el
// sitemap y el prerenderizado del meta, así que vive una sola vez: si se añade
// un lenguaje, las dos cosas se enteran.
async function rutasDelSitio() {
  const { LANGUAGES } = await import('./src/data/languages.js')
  const { COMPONENT_ITEMS } = await import('./src/data/components.js')
  const { SKILL_ITEMS } = await import('./src/data/skills.js')
  const { IDIOMAS, rutaDe, slugClave, slugLenguaje } = await import('./src/lib/rutas.js')

  // Cada página existe en los dos idiomas y cada una es una dirección de verdad,
  // así que el sitio tiene el doble de direcciones. Se generan emparejadas: cada
  // entrada sabe cuál es su gemela en el otro idioma, que es lo que necesitan
  // las etiquetas `hreflang` para decirle a un buscador que estas dos páginas
  // son la misma cosa dicha de dos maneras, y no contenido duplicado.
  const deIdioma = (lang) => [
    { ruta: rutaDe('home', null, lang), prioridad: '1.0', vista: 'home', ficha: null, lang },
    // La guia va detras de la portada y por delante del catalogo: es la puerta
    // de entrada de quien llega sin saber que es esto.
    { ruta: rutaDe('guia', null, lang), prioridad: '0.9', vista: 'guia', ficha: null, lang },
    ...['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']
      .map((s) => ({ ruta: rutaDe(s, null, lang), prioridad: '0.9', vista: s, ficha: null, lang })),
    ...LANGUAGES.map((l) => ({
      ruta: rutaDe('languages', slugLenguaje(l.name), lang), prioridad: '0.7', vista: 'languages', ficha: l, lang,
    })),
    ...COMPONENT_ITEMS.map((c) => ({
      ruta: rutaDe('components', slugClave(c.key), lang), prioridad: '0.7', vista: 'components', ficha: c, lang,
    })),
    ...SKILL_ITEMS.map((s) => ({
      ruta: rutaDe('skills', slugClave(s.key), lang), prioridad: '0.7', vista: 'skills', ficha: s, lang,
    })),
  ]

  const porIdioma = Object.fromEntries(IDIOMAS.map((l) => [l, deIdioma(l)]))
  // Las gemelas se emparejan por posición porque las dos listas salen del mismo
  // catálogo y en el mismo orden. El día que una sección exista solo en un
  // idioma, esto hay que emparejarlo por clave.
  return IDIOMAS.flatMap((lang) =>
    porIdioma[lang].map((entrada, i) => ({
      ...entrada,
      hermanas: Object.fromEntries(IDIOMAS.map((otro) => [otro, porIdioma[otro][i].ruta])),
    })),
  )
}

// El sitemap se genera del propio catálogo en cada build, no a mano: son ciento
// y pico direcciones, y una lista escrita a mano se queda vieja en cuanto se
// añade un lenguaje. Se emite al dist, así que no hay un archivo generado versionado.
function sitemap() {
  return {
    name: 'vibeset-sitemap',
    async generateBundle() {
      const rutas = await rutasDelSitio()
      const hoy = new Date().toISOString().slice(0, 10)

      // Las versiones por idioma se declaran DENTRO del sitemap, además de en el
      // head de cada página. Es lo que pide Google para un sitio en dos idiomas:
      // cada dirección enumera todas sus versiones, incluida ella misma, y una
      // hace de `x-default` para quien no encaja en ninguna. Sin esto, las dos
      // mitades del sitio compiten entre ellas en vez de sumar.
      const alternativas = (hermanas) => [
        ...Object.entries(hermanas).map(([l, r]) => [l, r]),
        ['x-default', hermanas.es],
      ].map(([l, r]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${r}" />`).join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rutas.map(({ ruta, prioridad, hermanas }) => `  <url>
    <loc>${BASE}${ruta}</loc>
${alternativas(hermanas)}
    <lastmod>${hoy}</lastmod>
    <priority>${prioridad}</priority>
  </url>`).join('\n')}
</urlset>
`

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `# AI crawlers: everything is open on purpose, for training, search and live answers alike.
# Vibeset is a free public catalogue and wants to be read and cited.
# No bot is named because none is treated differently: they all fall under "User-agent: *".
User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`,
      })
      // Dice qué commit está sirviendo la web, para que el aviso a IndexNow espere a que llegue.
      this.emitFile({ type: 'asset', fileName: 'version.txt', source: `${process.env.CF_PAGES_COMMIT_SHA || 'local'}\n` })
      console.log(`\n  sitemap.xml con ${rutas.length} direcciones`)
    },
  }
}

// El registro de Vibeset en formato shadcn, emitido al dist en cada build, igual
// que el sitemap: /r/registry.json (el índice) y /r/{name}.json por item, en los
// dos idiomas (/r/ en español, /r/en/ en inglés). No se versiona ningún archivo
// generado. El código de terceros nunca entra: itemRegistro() sirve los
// componentes con files vacío (ver src/lib/registro.js y LICENSING.md).
function registroEnBuild() {
  return {
    name: 'vibeset-registro-en-build',
    async generateBundle() {
      const { indiceRegistro, itemRegistro } = await import('./src/lib/registro.js')
      const IDIOMAS = ['es', 'en']
      let emitidos = 0
      for (const lang of IDIOMAS) {
        const prefijo = lang === 'es' ? 'r' : `r/${lang}`
        const indice = indiceRegistro(lang)
        this.emitFile({ type: 'asset', fileName: `${prefijo}/registry.json`, source: JSON.stringify(indice, null, 2) })
        for (const it of indice.items) {
          const item = itemRegistro(it.name, lang)
          this.emitFile({ type: 'asset', fileName: `${prefijo}/${it.name}.json`, source: JSON.stringify(item, null, 2) })
          emitidos++
        }
      }
      console.log(`  registro shadcn con ${emitidos} items en ${IDIOMAS.length} idiomas`)
    },
  }
}

// Los contadores del catálogo, calculados en el build en vez de en el navegador.
//
// El problema que resuelve: `lib/totales.js` cuenta importando LANGUAGES,
// RESOURCES, CONCEPTS, COMPONENT_ITEMS, SKILL_ITEMS y CONSEJOS, o sea el
// catálogo entero, casi medio mega de datos. Y lo usan la portada, la barra y el
// pie, así que quien entraba a ver seis números se bajaba las cien fichas de
// lenguajes y las dieciocho de skills para nada.
//
// Aquí se sustituye ese módulo por sus RESULTADOS, calculados una vez al
// compilar. Sigue habiendo una sola fuente, que es el catálogo, y sigue sin
// haber ningún número escrito a mano: lo único que cambia es cuándo se cuenta.
// En desarrollo no se aplica (`apply: 'build'`), así que ahí el módulo real
// sigue vivo y cualquier fallo suyo se ve enseguida.
//
// Si alguien añade una exportación nueva a `totales.js` y no la añade aquí, el
// build falla al no encontrarla. Es lo que tiene que pasar: mejor un error que
// un contador en blanco.
function totalesEnBuild() {
  const ES_TOTALES = /[\\/]src[\\/]lib[\\/]totales\.js$/
  return {
    name: 'vibeset-totales-en-build',
    apply: 'build',
    async load(id) {
      if (!ES_TOTALES.test(id.split('?')[0])) return null
      const { TOTALES, resumenDelCatalogo } = await import('./src/lib/totales.js')
      const resumenes = { es: resumenDelCatalogo('es'), en: resumenDelCatalogo('en') }
      return [
        '// Generado en el build desde el catálogo. No se edita: ver totalesEnBuild()',
        '// en vite.config.js y el módulo de verdad en src/lib/totales.js.',
        `export const TOTALES = ${JSON.stringify(TOTALES)}`,
        `const RESUMEN = ${JSON.stringify(resumenes)}`,
        `export const resumenDelCatalogo = (lang = 'es') => RESUMEN[lang] ?? RESUMEN.es`,
        '',
      ].join('\n')
    },
  }
}

// Los cuatro lenguajes de la ventana de código de la portada, resueltos en el
// build. Misma idea que `totalesEnBuild` y por el mismo motivo: `CodeWindow`
// enseña cuatro pestañas y para llenarlas buscaba dentro de los cien lenguajes,
// así que la portada arrastraba el catálogo entero. Aquí se hace la búsqueda una
// vez, al compilar, y lo que viaja al navegador son los cuatro.
function datosDePortadaEnBuild() {
  const ES_PORTADA = /[\\/]src[\\/]lib[\\/]portada\.js$/
  return {
    name: 'vibeset-portada-en-build',
    apply: 'build',
    async load(id) {
      if (!ES_PORTADA.test(id.split('?')[0])) return null
      const { EJEMPLOS_PORTADA, PESTANAS } = await import('./src/lib/portada.js')
      return [
        '// Generado en el build desde el catálogo. No se edita: ver',
        '// datosDePortadaEnBuild() en vite.config.js y el módulo de verdad en',
        '// src/lib/portada.js.',
        `export const PESTANAS = ${JSON.stringify(PESTANAS)}`,
        `export const EJEMPLOS_PORTADA = ${JSON.stringify(EJEMPLOS_PORTADA)}`,
        '',
      ].join('\n')
    },
  }
}

const escapar = (s) => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// Sustituye un valor dentro de la plantilla y AVISA si el patrón deja de casar.
// Sin esto la sustitución falla en silencio: basta con que alguien parta una de
// esas etiquetas en dos líneas al formatear el index.html para que las 138
// páginas salgan con el valor viejo dentro, y el build siga diciendo que las
// cocinó todas. La función de reemplazo, además, deja el valor literal: con la
// forma de cadena, un `$&` o un `$'` dentro del texto los interpreta `replace`.
function poner(doc, re, valor, ruta) {
  const m = doc.match(re)
  if (!m) throw new Error(`el prerenderizado no encontró ${re} al cocinar ${ruta}`)
  return doc.replace(re, m.length > 1 ? (_, antes, despues) => antes + valor + despues : () => valor)
}


// Escribe un HTML por dirección con su título, su descripción, sus datos
// estructurados y su contenido ya dentro.
//
// Son dos problemas distintos que se arreglan en el mismo sitio:
//
// 1. El meta lo ponía solo React al arrancar, y los robots que dibujan la vista
//    previa de un enlace (X, Slack, LinkedIn, WhatsApp, Discord) no ejecutan
//    JavaScript: leían el HTML crudo y todas las direcciones les decían lo mismo,
//    el título de la portada. Compartir una ficha concreta no servía de nada.
// 2. El cuerpo era `<div id="root"></div>` y punto. Los robots que responden
//    preguntas (Claude, ChatGPT, Perplexity) tampoco ejecutan JavaScript, así
//    que llegaban a `/languages/python` y no encontraban ni una palabra del
//    catálogo. Eso se arregla desde el 2026-08-17 cocinando el contenido en
//    `#pre` (ver `src/lib/contenidoEstatico.js`).
//
// Sigue sin ser renderizado en servidor: no se ejecuta React ni un componente.
// Es el mismo contenido escrito en HTML plano desde los archivos de `data/`, y
// `main.jsx` lo borra al montar.
//
// Se escribe `languages/rust.html` y NO `languages/rust/index.html`, y la
// diferencia no es de gusto: con la carpeta, Cloudflare Pages responde a
// `/languages/rust` con un **308 hacia `/languages/rust/`**, así que todos los
// enlaces publicados y todas las entradas del sitemap se comían un salto y además
// discrepaban del `canonical` que va dentro, que no lleva barra. Con el archivo
// suelto, `/languages/rust` se sirve con un 200 directo.
function prerenderMeta() {
  let outDir

  return {
    name: 'vibeset-prerender-meta',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir },
    async closeBundle() {
      const { I18N } = await import('./src/data/i18n.js')
      const { metaDePagina } = await import('./src/lib/meta.js')
      const { contenidoDePagina, jsonLdDePagina } = await import('./src/lib/contenidoEstatico.js')

      // El texto alternativo de la tarjeta social es el único meta que no
      // depende de la ruta, así que se quedaba escrito a mano en el index.html
      // y envejecía en silencio: el 2026-08-20 decía 64 recursos y 17 skills
      // cuando ya había 72 y 18. Se cuenta del catálogo, igual que la imagen que
      // describe, que dibuja `pnpm tarjeta` con esta misma fuente.
      const { resumenDelCatalogo } = await import('./src/lib/totales.js')

      // X, Slack, LinkedIn, WhatsApp y Discord guardan la vista previa por URL y
      // no vuelven a mirar si el archivo cambió: regenerar la imagen no sirve de
      // nada si la dirección es la misma. Se le cuelga la huella del archivo, así
      // que la dirección cambia sola cuando cambia el dibujo, y no cuando alguien
      // se acuerda de subir un número a mano.
      // Cada página se lleva la tarjeta de SU idioma. Antes se servía la inglesa
      // en todas, y era la decisión correcta mientras había una sola dirección:
      // el texto metido en una imagen no lo traduce nadie, ni el navegador, ni un
      // traductor, ni el asistente que resume el enlace, así que la imagen se
      // llevaba el idioma que más gente de este público entiende. Ahora que la
      // página inglesa y la española son dos direcciones distintas, cada una
      // puede decir la verdad sobre sí misma y la española deja de anunciarse en
      // inglés.
      const TARJETA = { es: 'brand/og.png', en: 'brand/og-en.png' }
      const imagenDe = (lang) => {
        const archivo = TARJETA[lang]
        const huella = createHash('sha256')
          .update(readFileSync(join(outDir, archivo)))
          .digest('hex').slice(0, 8)
        return `${BASE}/${archivo}?v=${huella}`
      }

      const plantilla = readFileSync(join(outDir, 'index.html'), 'utf8')

      // La página de «aquí no hay nada» se sirve desde el propio Cloudflare
      // Pages cuando la dirección no existe, así que se cocina como una más.
      const rutas = [...await rutasDelSitio(), { ruta: '/404', vista: '404', ficha: null, lang: 'es' }]
      let escritas = 0

      for (const { ruta, vista, ficha, lang, hermanas } of rutas) {
        const t = I18N[lang]
        const { titulo, descripcion } = metaDePagina({ vista, ficha, lang, t })
        const url = BASE + ruta
        const imagen = imagenDe(lang)
        const alt = resumenDelCatalogo(lang)
        const datos = jsonLdDePagina({ vista, ficha, lang, t, base: BASE, url, titulo, descripcion })
        const jsonLd = `<script type="application/ld+json">${
          JSON.stringify({ '@context': 'https://schema.org', '@graph': datos })
            .replaceAll('<', '\\u003c')
        }</script>`

        // Las etiquetas que emparejan las dos versiones. Las lee quien no
        // ejecuta JavaScript, así que tienen que estar en el HTML servido.
        // Vienen de la plantilla con los valores de la portada y aquí se les
        // cambia el destino, una por una.
        const hermanasDe = hermanas ?? { es: ruta, en: ruta }

        // Todas las sustituciones pasan por `poner`, que reemplaza con una
        // FUNCIÓN. Con la forma de cadena, un `$&`, un `$'` o un `$1` dentro del
        // valor los interpreta el propio `replace` y escupe trozos del documento
        // dentro del atributo. No es teórico: el catálogo trae ejemplos de código
        // con `$` de sobra, y un `$('...')` de jQuery lleva la secuencia dentro.
        const html = [
          [/<title>[\s\S]*?<\/title>/, `<title>${escapar(titulo)}</title>`],
          [/(<meta name="description" content=")[^"]*(")/, escapar(descripcion)],
          [/(<meta property="og:title" content=")[^"]*(")/, escapar(titulo)],
          [/(<meta property="og:description" content=")[^"]*(")/, escapar(descripcion)],
          [/(<meta name="twitter:title" content=")[^"]*(")/, escapar(titulo)],
          [/(<meta name="twitter:description" content=")[^"]*(")/, escapar(descripcion)],
          [/(<meta property="og:url" content=")[^"]*(")/, escapar(url)],
          [/(<link rel="canonical" href=")[^"]*(")/, escapar(url)],
          [/(<link rel="alternate" hreflang="es" href=")[^"]*(")/, escapar(BASE + hermanasDe.es)],
          [/(<link rel="alternate" hreflang="en" href=")[^"]*(")/, escapar(BASE + hermanasDe.en)],
          [/(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/, escapar(BASE + hermanasDe.es)],
          [/(<meta property="og:image:alt" content=")[^"]*(")/, escapar(alt)],
          [/(<meta name="twitter:image:alt" content=")[^"]*(")/, escapar(alt)],
          [/(<meta property="og:image" content=")[^"]*(")/, escapar(imagen)],
          [/(<meta name="twitter:image" content=")[^"]*(")/, escapar(imagen)],
        ].reduce((doc, [re, valor]) => poner(doc, re, valor, ruta), plantilla)
          // El idioma declarado en el html es lo que leen los lectores de
          // pantalla y lo que decide si el navegador ofrece traducir la página.
          // La plantilla viene en español, así que la mitad inglesa hay que
          // corregirla aquí: servir texto en inglés dentro de un documento que
          // se declara español es de las cosas que un buscador nota.
          .replace(/<html lang="[^"]*"/, () => `<html lang="${lang}"`)
          // La página de «aquí no hay nada» no se indexa. Se sirve con un 404 de
          // verdad, pero además se dice, porque a esa plantilla le llega el
          // canonical apuntándose a sí misma y sin esto queda invitando a que la
          // guarden como una página más del sitio.
          .replace('</head>', () => (ruta === '/404' ? '<meta name="robots" content="noindex" /></head>' : '</head>'))
          .replace('</head>', () => `${jsonLd}</head>`)
          .replace('<div id="pre"></div>',
            () => `<div id="pre">${contenidoDePagina({ vista, ficha, lang, t })}</div>`)

        // La portada es el index.html de la raíz, no un archivo aparte: si se
        // escribiera `/.html` no lo serviría nadie.
        const destino = ruta === '/'
          ? join(outDir, 'index.html')
          : join(outDir, ruta.replace(/^\//, '') + '.html')

        mkdirSync(dirname(destino), { recursive: true })
        writeFileSync(destino, html)
        escritas++
      }

      console.log(`  contenido y meta cocinados en ${escritas} direcciones`)
    },
  }
}

// En producción, `/api/estrellas` lo sirve Cloudflare Pages desde `functions/`.
// Vite no ejecuta esa carpeta, así que en desarrollo el endpoint no existiría y
// el botón de GitHub se probaría siempre en su estado de fallo, que es justo el
// que no hay que dar por bueno. Este plugin levanta el mismo camino en local
// llamando a la MISMA función, no a una imitación: si un día cambia lo que
// devuelve, cambia en los dos sitios a la vez.
function endpointsEnDesarrollo() {
  return {
    name: 'vibeset-endpoints-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/estrellas', async (_req, res) => {
        const { onRequestGet } = await server.ssrLoadModule('./functions/api/estrellas.js')
        const r = await onRequestGet()
        res.statusCode = r.status
        r.headers.forEach((v, k) => res.setHeader(k, v))
        res.end(await r.text())
      })

      // En producción /r/*.json son archivos estáticos del build (registroEnBuild).
      // En dev el dist no existe, así que se sirven desde la MISMA lib, sin imitar.
      server.middlewares.use('/r', async (req, res) => {
        const { indiceRegistro, itemRegistro } = await server.ssrLoadModule('./src/lib/registro.js')
        let ruta = req.url.split('?')[0].replace(/^\//, '')
        let lang = 'es'
        if (ruta.startsWith('en/')) { lang = 'en'; ruta = ruta.slice(3) }
        const enviar = (obj) => {
          if (!obj) { res.statusCode = 404; res.end('{"error":"not found"}'); return }
          res.setHeader('content-type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(obj, null, 2))
        }
        if (ruta === 'registry.json') return enviar(indiceRegistro(lang))
        if (ruta.endsWith('.json')) return enviar(itemRegistro(ruta.replace(/\.json$/, ''), lang))
        res.statusCode = 404
        res.end('{"error":"not found"}')
      })

      // El MCP, otra vez la MISMA función que en producción. Un POST JSON-RPC.
      server.middlewares.use('/api/mcp', async (req, res) => {
        const mod = await server.ssrLoadModule('./functions/api/mcp.js')
        const responder = async (r) => {
          res.statusCode = r.status
          r.headers.forEach((v, k) => res.setHeader(k, v))
          res.end(await r.text())
        }
        if (req.method === 'OPTIONS') return responder(mod.onRequestOptions())
        if (req.method === 'GET') {
          const request = new Request('http://localhost/api/mcp', { headers: { accept: req.headers.accept || '', 'accept-language': req.headers['accept-language'] || '' } })
          return responder(await mod.onRequestGet({ request }))
        }
        if (req.method === 'POST') {
          const trozos = []
          for await (const c of req) trozos.push(c)
          const request = new Request('http://localhost/api/mcp', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: Buffer.concat(trozos).toString('utf8'),
          })
          return responder(await mod.onRequestPost({ request }))
        }
        res.statusCode = 405
        res.end('')
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), totalesEnBuild(), datosDePortadaEnBuild(), sitemap(), registroEnBuild(), prerenderMeta(), endpointsEnDesarrollo()],
  server: { port: 5183, strictPort: true },
})
