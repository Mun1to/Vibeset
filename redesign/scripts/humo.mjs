// Prueba de humo: que la web haga lo que promete, contra el `dist` de verdad.
//
//   pnpm humo
//
// Existe por el reparto de peso del 2026-08-21: el catálogo y sus datos se
// separaron de la portada y ahora llegan con `lazy()` al pisar una sección. Es
// un cambio que no rompe la compilación cuando se estropea; se rompe en el
// navegador y en silencio, así que hace falta algo que lo mire.
//
// Cubre lo que un cambio de arquitectura puede llevarse por delante sin avisar:
// que cada sección pinte su contenido, que los filtros de la dirección filtren,
// que una ficha abra la suya, que lo que no existe sea un 404 de verdad, que el
// buscador global encuentre después de traerse su índice, que el pie lleve al
// otro idioma y que no salte ninguna excepción por el camino.
//
// Es hermano de `pnpm auditar`: aquel mira si la web se VE bien, este si
// FUNCIONA. Los dos hablan el protocolo de Chrome a mano para no meter un
// navegador de trescientos megas en las dependencias.

import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { stat, mkdtemp, rm } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { COMPONENT_ITEMS, originalDe } from '../src/data/components.js'
import { slugClave } from '../src/lib/rutas.js'

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PUERTO = 4188
const DEP = 9345
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms))
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain' }
const existe = async (p) => { try { return (await stat(p)).isFile() } catch { return false } }

const server = createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  for (const c of [join(DIST, ruta), join(DIST, `${ruta}.html`), join(DIST, ruta, 'index.html'), join(DIST, ruta === '/' ? 'index.html' : '404.html')]) {
    if (await existe(c)) { res.writeHead(200, { 'content-type': TIPOS[extname(c)] ?? 'application/octet-stream' }); return createReadStream(c).pipe(res) }
  }
  res.writeHead(404); res.end('no')
})
await new Promise((ok) => server.listen(PUERTO, '127.0.0.1', ok))

const perfil = await mkdtemp(join(tmpdir(), 'humo-'))
const CANDIDATOS = [
  process.env.NAVEGADOR,
  'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const EXE = CANDIDATOS.find((p) => existsSync(p))
if (!EXE) { console.error('  No encuentro Chrome, Brave ni Edge. Pon la ruta en la variable NAVEGADOR.'); process.exit(2) }
if (!existsSync(join(DIST, 'index.html'))) { console.error('  No hay dist. Lanza `pnpm build` antes.'); process.exit(2) }

const proc = spawn(EXE,
  ['--headless=new', `--remote-debugging-port=${DEP}`, `--user-data-dir=${perfil}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
let wsUrl
for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${DEP}/json/version`); if (r.ok) { wsUrl = (await r.json()).webSocketDebuggerUrl; break } } catch {} await esperar(250) }

const ws = new WebSocket(wsUrl); const pend = new Map(); const oy = new Set(); let n = 0
const listo = new Promise((ok) => { ws.onopen = ok })
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const { ok, mal } = pend.get(m.id); pend.delete(m.id); m.error ? mal(new Error(m.error.message)) : ok(m.result) } else if (m.method) for (const f of oy) f(m) }
const en = (method, params = {}, sid) => listo.then(() => new Promise((ok, mal) => { const id = ++n; pend.set(id, { ok, mal }); ws.send(JSON.stringify({ id, method, params, ...(sid ? { sessionId: sid } : {}) })) }))
const evento = (nom, ms = 20000) => new Promise((ok, mal) => { const r = setTimeout(() => { oy.delete(f); mal(new Error('timeout ' + nom)) }, ms); const f = (m) => { if (m.method === nom) { clearTimeout(r); oy.delete(f); ok(m.params) } }; oy.add(f) })

const { targetId } = await en('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await en('Target.attachToTarget', { targetId, flatten: true })
await en('Page.enable', {}, sessionId); await en('Runtime.enable', {}, sessionId)
await en('Emulation.setDeviceMetricsOverride', { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false }, sessionId)

const errores = []
oy.add((m) => {
  if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails?.text + ' ' + (m.params.exceptionDetails?.exception?.description ?? ''))
})

const ev = async (expr) => {
  const { result, exceptionDetails } = await en('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId)
  if (exceptionDetails) throw new Error(exceptionDetails.text + ' ' + (exceptionDetails.exception?.description ?? ''))
  return result.value
}
const ir = async (ruta) => {
  await en('Page.navigate', { url: `http://127.0.0.1:${PUERTO}${ruta}` }, sessionId)
  await evento('Page.loadEventFired')
  for (let i = 0; i < 60; i++) { if (await ev('document.querySelector("#root")?.childElementCount ?? 0') > 0) break; await esperar(150) }
  await esperar(900)
}

let fallos = 0
const comprobar = (nombre, ok, detalle = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${nombre}${detalle ? ': ' + detalle : ''}`)
  if (!ok) fallos++
}

// 1. La portada
await ir('/')
comprobar('portada: seis secciones', await ev(`document.querySelectorAll('main a[href^="/"]').length >= 6`))
comprobar('portada: ventana de código con sus pestañas',
  await ev(`[...document.querySelectorAll('button')].filter(b=>['Python','JavaScript','Rust','Go'].includes(b.textContent.trim())).length === 4`))
comprobar('portada: hay código dentro', await ev(`(document.querySelector('pre')?.innerText ?? '').length > 15`), await ev(`(document.querySelector('pre')?.innerText ?? '').slice(0,30)`))
comprobar('portada: título', await ev('document.title').then(x => x.includes('Vibeset')), await ev('document.title'))

// 2. Lenguajes, su lista y sus filtros
await ir('/languages')
comprobar('lenguajes: 24 fichas de entrada', await ev(`document.querySelectorAll('#grid article').length`) === 24,
  String(await ev(`document.querySelectorAll('#grid article').length`)))
comprobar('lenguajes: la lateral tiene categorías', await ev(`document.querySelectorAll('aside button').length > 5`))
await ir('/languages?cat=movil')
const conFiltro = await ev(`document.querySelectorAll('#grid article').length`)
comprobar('lenguajes: filtra por categoría desde la URL', conFiltro === 7, `${conFiltro} fichas de móvil`)

// 3. Una ficha
await ir('/languages/rust')
comprobar('ficha de Rust: h1', await ev(`document.querySelector('h1')?.textContent.trim()`) === 'Rust')
comprobar('ficha de Rust: título de pestaña', (await ev('document.title')).startsWith('Rust'), await ev('document.title'))

// 4. Las otras secciones
for (const [ruta, sel, min] of [['/resources', 'main a[target="_blank"]', 20], ['/concepts', 'main .relative.bg-panel', 5], ['/components', 'main a[href*="/components/"]', 5], ['/skills', 'main .cursor-pointer', 18], ['/tips', 'main .cursor-pointer, main .consejo, main figure', 3]]) {
  await ir(ruta)
  const cuantos = await ev(`document.querySelectorAll(${JSON.stringify(sel)}).length`)
  comprobar(`${ruta}: pinta contenido`, cuantos >= min, `${cuantos} elementos`)
}

// 5. El 404 de ruta y el de ficha
await ir('/inventado')
comprobar('/inventado es un 404', await ev(`document.body.innerText.includes('404') || !!document.querySelector('[data-404]') || document.title.includes('404') || document.body.innerText.length < 900`),
  (await ev('document.title')))
// Dónde se pinta el aviso: centrado en su hueco y con el pie al final de la ventana.
// Pegado a la izquierda y con el pie a media pantalla llegó a pasar, y no lo dice
// ninguna otra comprobación porque el texto y el estado son los correctos.
const geometria404 = `(() => { const s = document.querySelector('#principal section'); const p = document.querySelector('footer'); if (!s || !p) return null; const a = s.getBoundingClientRect(); const b = p.getBoundingClientRect(); return { descentrado: Math.round(Math.abs(a.left + a.width / 2 - innerWidth / 2)), pieSobra: Math.round(Math.abs(b.bottom - innerHeight)) } })()`
const g1 = await ev(geometria404)
comprobar('/inventado: el aviso va centrado y el pie al final', !!g1 && g1.descentrado <= 2 && g1.pieSobra <= 2, JSON.stringify(g1))
await ir('/languages/no-existe')
comprobar('/languages/no-existe es un 404', await ev(`!document.querySelector('#grid')`), await ev('document.title'))
const g2 = await ev(geometria404)
comprobar('/languages/no-existe: el aviso va centrado y el pie al final', !!g2 && g2.descentrado <= 2 && g2.pieSobra <= 2, JSON.stringify(g2))

// El carril de una skill larga (columna derecha: instalar, dónde va, cómo se usa) se
// queda a la vista mientras se lee el SKILL.md. Dejó de hacerlo cuando `main` llevaba
// `overflow-hidden`, que rompe `position: sticky`, y el carril se iba pantallas arriba.
await ir('/skills/criteria')
const carril = await ev(`(async () => { const g = document.querySelector('main section > div.flex.flex-col'); const r = g?.children[1]; if (!r) return null; scrollTo(0, 1200); await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))); const b = r.getBoundingClientRect(); return { top: Math.round(b.top), abajo: Math.round(b.bottom), vh: innerHeight } })()`)
comprobar('skill larga: el carril se queda a la vista al bajar', !!carril && carril.top >= 0 && carril.top <= 100 && carril.abajo <= carril.vh, JSON.stringify(carril))

// Los mandos de la ficha los lee un lector de pantalla: cada campo con su nombre, y el
// interruptor con su rol y su estado. Las auditorías de contraste y de tamaño no lo ven,
// porque no miran el árbol de accesibilidad: un `select` sin nombre y un botón que hacía
// de interruptor sin decir si estaba activado pasaron meses sin que nada se pusiera rojo.
await ir('/components/cloth')
const sinNombre = await ev(`[...document.querySelectorAll('main select, main input')].filter((e) => !e.getAttribute('aria-label') && !(e.labels && e.labels.length)).length`)
comprobar('mandos de la ficha: cada campo tiene nombre', sinNombre === 0, `${sinNombre} sin nombre`)
await ir('/components/contador-sube')
const interruptor = await ev(`(async () => { const b = document.querySelector('main [role=switch]'); if (!b) return null; const antes = b.getAttribute('aria-checked'); b.click(); await new Promise((ok) => setTimeout(ok, 150)); return { antes, despues: b.getAttribute('aria-checked') } })()`)
comprobar('mandos de la ficha: el interruptor anuncia su estado', !!interruptor && interruptor.antes !== interruptor.despues && ['true', 'false'].includes(interruptor.antes), JSON.stringify(interruptor))

// La región `status` dentro de un botón no cuenta para su nombre: el botón de «Pensando» se
// quedaba sin él para un lector de pantalla. La frase va dentro como texto y el anuncio, fuera.
await ir('/components/linea-pensando')
const lp = await ev(`(() => { const b = document.querySelector('main .lp-cabecera'); const s = document.querySelector('main .lp-sr[role=status]'); return b && s ? { dentro: !!b.querySelector('[role=status]'), nombre: b.innerText.trim().length > 0, anuncio: s.textContent.length > 0 } : null })()`)
comprobar('línea de pensando: el botón tiene nombre y el anuncio va fuera', !!lp && !lp.dentro && lp.nombre && lp.anuncio, JSON.stringify(lp))

// 6. El buscador global, que ahora carga su índice al abrirse
await ir('/')
await ev(`[...document.querySelectorAll('button')].find(b => /Buscar|Search/i.test(b.textContent))?.click()`)
await esperar(1200)
await ev(`(() => { const i = document.querySelector('input[type=text], input:not([type])'); if (i) { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set; s.call(i,'rust'); i.dispatchEvent(new Event('input',{bubbles:true})) } })()`)
await esperar(900)
const resultados = await ev(`document.body.innerText.match(/Rust/g)?.length ?? 0`)
comprobar('buscador: encuentra «rust» tras cargar su índice', resultados > 0, `${resultados} apariciones`)

// 7. La guía: sus bloques, el nivel que viaja en la dirección, y el test dentro
await ir('/start')
const bloques = await ev(`document.querySelectorAll('main ol > li').length`)
comprobar('guía: pinta sus bloques', bloques === 10, `${bloques} bloques`)
comprobar('guía: cada bloque manda a alguna parte', await ev(`document.querySelectorAll('main ol a').length >= 10`),
  `${await ev(`document.querySelectorAll('main ol a').length`)} enlaces`)
comprobar('guía: el nivel por defecto es el de en medio',
  (await ev(`document.querySelector('[aria-pressed="true"]')?.textContent.trim()`)) === 'He tocado algo',
  await ev(`document.querySelector('[aria-pressed="true"]')?.textContent.trim()`))

await ir('/start?nivel=cero')
comprobar('guía: el nivel se lee de la dirección',
  (await ev(`document.querySelector('[aria-pressed="true"]')?.textContent.trim()`)) === 'No he programado nunca',
  await ev(`document.querySelector('[aria-pressed="true"]')?.textContent.trim()`))
comprobar('guía: marca lo que te puedes saltar en vez de esconderlo',
  await ev(`document.body.innerText.includes('te lo puedes saltar')`))
// Dos glosarios: el de palabras basicas es solo del nivel cero, el de vocabulario
// de agentes sale en los tres, porque ese no lo sabe nadie por haber programado.
const glosariosCero = await ev(`document.querySelectorAll('main dl').length`)
comprobar('guía: el nivel cero ve los dos glosarios', glosariosCero === 2, `${glosariosCero} glosarios`)

await ir('/start?nivel=pro')
// Los dos siguen en la pagina: el diseno MARCA lo que no es tuyo, no lo esconde,
// que es ademas lo que deja que el HTML cocinado diga lo mismo que la pantalla.
const basicasSaltables = await ev(`(() => { const li = [...document.querySelectorAll('main ol > li')].find(l => l.querySelector('dl')); return li ? li.textContent.includes('te lo puedes saltar') : false })()`)
comprobar('guía: al que ya programa, las palabras básicas le salen marcadas', basicasSaltables === true)
await ir('/start?nivel=cero')

// El test vive dentro de la guía desde que dejó de colgar de la barra.
await ev(`[...document.querySelectorAll('main ol button')].find(b => /test/i.test(b.textContent))?.click()`)
await esperar(900)
comprobar('guía: el test se abre desde dentro',
  await ev(`/Paso 1 de 3|Step 1 of 3/.test(document.body.innerText)`))

await ir('/en/start')
comprobar('guía: existe en inglés', (await ev(`document.querySelector('main h1')?.textContent.trim()`)) === 'Where to start',
  await ev(`document.querySelector('main h1')?.textContent.trim()`))

// 8. Las fichas de análisis de React Bits (clase `referencia`): sin demo ni código,
// con su análisis en lugar de la demo. Si alguien las trata como componentes con
// demo, la ficha se queda vacía o se cae; si alguien les mete código, rompe la
// licencia del origen (ver LICENSING.md).
await ir('/components')
const tarjetas = await ev(`document.querySelectorAll('main a[href*="/components/"]').length`)
comprobar('componentes: se pagina (24 de entrada)', tarjetas === 24, `${tarjetas} tarjetas`)
comprobar('componentes: el botón dice cuántas quedan', await ev(`/Ver \\d+ más/.test(document.body.innerText)`))
await ir('/components?cat=micro')
const micro = await ev(`document.querySelectorAll('main a[href*="/components/"]').length`)
comprobar('componentes: el grupo nuevo trae sus 10 fichas', micro === 10, `${micro} fichas`)
// La ficha de referencia que se comprueba es la primera que siga siéndolo: según se
// van construyendo las piezas propias, las fichas de análisis dejan de ser tarjetas
// aparte, y una clave escrita aquí se quedaría apuntando a una página que ya no existe.
// Cuando se han construido todas, no queda ninguna y estas comprobaciones no tienen a qué
// agarrarse: la ficha de análisis sigue existiendo, pero como apartado de cada pieza propia,
// y eso lo comprueba el bucle de más abajo.
const ref = COMPONENT_ITEMS.find((x) => x.clase === 'referencia')
if (ref) {
  await ir(`/components/${slugClave(ref.key)}`)
  comprobar('ficha de referencia: h1', await ev(`document.querySelector('h1')?.textContent.trim()`) === ref.name)
  comprobar('ficha de referencia: sin demo ni canvas', await ev(`document.querySelectorAll('main canvas, main [data-demo]').length === 0`))
  comprobar('ficha de referencia: trae su análisis',
    await ev(`['Cuándo sí', 'Ojo con', 'Accesibilidad', 'Ficha técnica'].every((x) => document.querySelector('main').textContent.includes(x))`))
  comprobar('ficha de referencia: el comando es el de @react-bits',
    await ev(`document.querySelector('main pre')?.textContent.includes(${JSON.stringify(ref.install)}) ?? false`),
    await ev(`document.querySelector('main pre')?.textContent`))
  comprobar('ficha de referencia: el prompt está', await ev(`document.querySelector('main').textContent.includes('Pídeselo a tu agente')`))
  await ir(`/en/components/${slugClave(ref.key)}`)
  comprobar('ficha de referencia: existe en inglés', await ev(`document.querySelector('main').textContent.includes('When to use it')`))
}
// Las piezas propias: la ficha de cada una tiene que pintar su demo, y se lee del
// catálogo para que una pieza nueva entre en la prueba sin tocar este archivo. Lo que
// se comprueba es que el escenario monte algo, no que se vea bien: eso se mira en
// pantalla (pnpm auditar y los ojos).
for (const c of COMPONENT_ITEMS.filter((x) => x.origin === 'propio' && x.clase === 'pieza')) {
  await ir(`/components/${slugClave(c.key)}`)
  await esperar(500)
  const dentro = await ev(`(() => { const d = document.querySelector('main .bg-zinc-950'); return d ? d.querySelectorAll('*').length : 0 })()`)
  // Una pieza de lienzo es marco, contenedor y canvas: tres elementos. Por debajo de eso
  // la demo no se ha montado (se queda el marco vacío o el aviso de «cargando»).
  comprobar(`pieza propia ${c.key}: su demo se pinta`, dentro >= 3, `${dentro} elementos`)
  // Si imita a una pieza de React Bits, su ficha lleva el análisis del original al pie
  // y su comando de instalación: es lo que sustituye a la tarjeta que ya no sale aparte.
  if (c.original) {
    const o = originalDe(c)
    comprobar(`pieza propia ${c.key}: lleva el apartado del original`,
      await ev(`document.querySelector('main').textContent.includes(${JSON.stringify(`Y el original de React Bits: ${o.name}`)}) && [...document.querySelectorAll('main pre')].some((p) => p.textContent.includes(${JSON.stringify(o.install)}))`))
  }
}
// (Va antes del cambio de idioma: al pulsar el pie el navegador de la prueba se
// queda con el inglés guardado y redirige a /en, y estas comprobaciones leen
// textos en español.)

// 9. El cambio de idioma desde el pie
await ir('/languages')
await ev(`[...document.querySelectorAll('footer button')].find(e=>/ES\\s*\\/\\s*EN|EN\\s*\\/\\s*ES/.test(e.textContent))?.click()`)
await esperar(1200)
comprobar('idioma: el pie lleva a /en/languages', await ev('location.pathname') === '/en/languages', await ev('location.pathname'))

// La demo de una ficha que aparece al filtrar por la URL. Se quedaba sin montar
// para siempre porque su observador miraba un nodo que React ya había soltado.
await ir('/concepts?q=marquee')
const hijosDemo = await ev(`(() => { const d = document.querySelector('[data-demo]'); return d ? d.querySelectorAll('*').length : 0 })()`)
comprobar('la demo arranca en la ficha que deja el filtro', hijosDemo > 5, `${hijosDemo} elementos dentro`)
comprobar('el prompt sale en la ficha', await ev(`document.body.innerText.includes('PÍDESELO A TU AGENTE') || document.body.innerText.includes('ASK YOUR AGENT')`))

comprobar('cero excepciones en consola', errores.length === 0, errores.slice(0, 3).join(' | '))

console.log(fallos === 0 ? '\n  todo en pie' : `\n  ${fallos} fallo(s)`)
ws.close(); proc.kill(); server.close(); await rm(perfil, { recursive: true, force: true }).catch(() => {})
process.exit(fallos ? 1 : 0)
