// Los suelos de diseño de la casa, comprobados sin abrir el navegador a mano.
//
//   pnpm auditar              las 7 secciones en los dos idiomas y los dos temas
//   pnpm auditar -- --movil   además a 390px de ancho
//   pnpm auditar -- --fichas  además las fichas de cada componente, skill y lenguaje (las del sitemap)
//
// El taller de `/kitchen` ya medía todo esto, pero solo cuando alguien se
// acordaba de abrirlo, así que nada impedía que un cambio de hoy rompiera lo que
// se arregló ayer. Esto es el mismo auditor, el de `src/kitchen/medir.js`, sin
// persona delante: sale con código 1 si algo incumple, o sea que puede ponerse
// rojo en un hook antes de commitear.
//
// Se mide contra el `dist`, que es lo que ve un visitante, y no contra el
// servidor de desarrollo.
//
// **No hay ninguna dependencia nueva y es a propósito.** Puppeteer o Playwright
// harían esto en veinte líneas, pero se traen un navegador de varios cientos de
// megas a un repositorio cuyo build corre en Cloudflare, donde no hace falta
// para nada. Node 22 en adelante trae `WebSocket` de serie, y el protocolo de
// Chrome se habla con seis mensajes contados, así que el precio de hacerlo a
// mano es este archivo y nada más.
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { readFile, stat, mkdtemp, rm } from 'node:fs/promises'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { join, extname, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(AQUI, '..')
const DIST = join(RAIZ, 'dist')
const PUERTO = 4183
const DEPURACION = 9333

// Las siete secciones en los DOS idiomas. El inglés no es una traducción que se
// pinta encima: son páginas distintas, y un texto más largo puede desbordar un
// control que en español cabía justo.
const PAGINAS = ['/', '/start', '/languages', '/resources', '/concepts', '/components', '/skills', '/tips']
const SECCIONES = [...PAGINAS, ...PAGINAS.map((r) => (r === '/' ? '/en' : `/en${r}`))]
const CON_MOVIL = process.argv.includes('--movil')
const CON_FICHAS = process.argv.includes('--fichas')

// Las fichas de detalle (componentes, skills y lenguajes) no se listan a mano: se
// leen del sitemap del `dist`, que es lo que el build ya sabe de cada dirección,
// así que una ficha nueva entra sola en la auditoría. Las demos llevan `data-demo`
// y el auditor las salta; lo que se mide aquí es la interfaz de la ficha (mandos,
// código, el apartado del original), que es la que escribimos nosotros.
function fichasDeDetalle() {
  const mapa = readFileSync(join(DIST, 'sitemap.xml'), 'utf8')
  return [...mapa.matchAll(/<loc>https?:\/\/[^/]+(\/(?:en\/)?(?:components|skills|languages)\/[^<]+)<\/loc>/g)].map((m) => m[1])
}

// ---------------------------------------------------------------- el servidor
//
// Sirve el `dist` con la misma regla que Cloudflare Pages: `/languages` se
// resuelve a `languages.html`, porque el build escribe un archivo plano por
// ruta y no una carpeta con índice (con carpeta, Pages responde 308 hacia la
// barra final, y eso ya costó una tarde en su día).
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}

const existe = async (p) => { try { return (await stat(p)).isFile() } catch { return false } }

async function servir() {
  const server = createServer(async (req, res) => {
    const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const candidatos = [
      join(DIST, ruta),
      join(DIST, `${ruta}.html`),
      join(DIST, ruta, 'index.html'),
      join(DIST, ruta === '/' ? 'index.html' : '404.html'),
    ]
    for (const c of candidatos) {
      if (!c.startsWith(DIST)) continue // nada de subir por encima del dist
      if (await existe(c)) {
        res.writeHead(200, { 'content-type': TIPOS[extname(c)] ?? 'application/octet-stream' })
        return createReadStream(c).pipe(res)
      }
    }
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('no está')
  })
  await new Promise((ok) => server.listen(PUERTO, '127.0.0.1', ok))
  return server
}

// ---------------------------------------------------------------- el navegador
const CANDIDATOS = [
  process.env.NAVEGADOR,
  'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms))

async function abrirNavegador(perfil) {
  const exe = CANDIDATOS.find((p) => existsSync(p))
  if (!exe) {
    console.error('  No encuentro Chrome, Brave ni Edge. Pon la ruta en la variable NAVEGADOR.')
    process.exit(2)
  }
  // Perfil de usar y tirar, nunca el de la persona que lanza esto: así no hay
  // sesiones abiertas ni extensiones que cambien lo que se mide.
  const proc = spawn(exe, [
    '--headless=new',
    `--remote-debugging-port=${DEPURACION}`,
    `--user-data-dir=${perfil}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--force-device-scale-factor=1', // el escalado de Windows falsearía los tamaños
    '--hide-scrollbars',
    'about:blank',
  ], { stdio: 'ignore' })

  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${DEPURACION}/json/version`)
      if (r.ok) return { proc, ws: (await r.json()).webSocketDebuggerUrl }
    } catch { /* todavía no ha levantado */ }
    await esperar(250)
  }
  proc.kill()
  throw new Error('el navegador no abrió su puerto de depuración en 15s')
}

// Un cliente del protocolo de Chrome en treinta líneas. Cada mensaje lleva su
// número y se resuelve cuando vuelve con ese mismo número; los que llegan sin
// número son eventos, y de esos solo interesa saber que la página cargó.
function conectar(url) {
  const ws = new WebSocket(url)
  const pendientes = new Map()
  const oyentes = new Set()
  let n = 0
  const listo = new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = mal })
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pendientes.has(m.id)) {
      const { ok, mal } = pendientes.get(m.id)
      pendientes.delete(m.id)
      m.error ? mal(new Error(m.error.message)) : ok(m.result)
    } else if (m.method) {
      for (const f of oyentes) f(m)
    }
  }
  const enviar = (method, params = {}, sessionId) =>
    listo.then(() => new Promise((ok, mal) => {
      const id = ++n
      pendientes.set(id, { ok, mal })
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
    }))
  const evento = (nombre, ms = 20_000) => new Promise((ok, mal) => {
    const reloj = setTimeout(() => { oyentes.delete(f); mal(new Error(`no llegó ${nombre}`)) }, ms)
    const f = (m) => { if (m.method === nombre) { clearTimeout(reloj); oyentes.delete(f); ok(m.params) } }
    oyentes.add(f)
  })
  return { enviar, evento, cerrar: () => ws.close() }
}

// ---------------------------------------------------------------- la auditoría
//
// El auditor no se reescribe aquí: se lee el MISMO archivo que usa el taller y
// se le quitan los `export` para poder evaluarlo dentro de la página. Copiarlo
// crearía una segunda versión que se arregla sola y deja la buena rota, que es
// la trampa que este proyecto ya conoce.
const fuenteAuditor = (await readFile(join(RAIZ, 'src/kitchen/medir.js'), 'utf8'))
  .replace(/^export /gm, '')

const PROGRAMA = `(() => {
  ${fuenteAuditor}
  const f = auditar(document.body)
  return JSON.stringify({
    contraste: f.contraste, tactil: f.tactil,
    letraMinuscula: f.letraMinuscula, colorEnNavegacion: f.colorEnNavegacion,
  })
})()`

async function auditarRuta(cdp, sesion, ruta) {
  await cdp.enviar('Page.navigate', { url: `http://127.0.0.1:${PUERTO}${ruta}` }, sesion)
  await cdp.evento('Page.loadEventFired')

  // El HTML llega con el contenido cocinado dentro y React lo sustituye al
  // montar. Auditar antes mediría un HTML que nadie ve más de un instante, así
  // que se espera a que la aplicación haya puesto algo en su raíz.
  for (let i = 0; i < 40; i++) {
    const { result } = await cdp.enviar('Runtime.evaluate', {
      expression: 'document.querySelector("#root")?.childElementCount ?? 0', returnByValue: true,
    }, sesion)
    if (result.value > 0) break
    await esperar(150)
  }
  // Un respiro para las animaciones de entrada: varias fichas empiezan en
  // opacidad cero y un control a medio aparecer mide lo que no mide luego.
  await esperar(700)

  const { result, exceptionDetails } = await cdp.enviar('Runtime.evaluate', {
    expression: PROGRAMA, returnByValue: true, awaitPromise: false,
  }, sesion)
  if (exceptionDetails) throw new Error(exceptionDetails.text ?? 'el auditor reventó dentro de la página')
  return JSON.parse(result.value)
}

// ---------------------------------------------------------------- el programa
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('  No hay dist. Lanza `pnpm build` antes.')
  process.exit(2)
}

const RUTAS = [...SECCIONES, ...(CON_FICHAS ? fichasDeDetalle() : [])]

const perfil = await mkdtemp(join(tmpdir(), 'vibeset-auditor-'))
const server = await servir()
const { proc, ws } = await abrirNavegador(perfil)
const cdp = conectar(ws)

let totalFallos = 0
try {
  const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true })
  await cdp.enviar('Page.enable', {}, sessionId)
  await cdp.enviar('Runtime.enable', {}, sessionId)

  const pantallas = [
    { nombre: 'escritorio', w: 1440, h: 900, movil: false },
    ...(CON_MOVIL ? [{ nombre: 'móvil', w: 390, h: 844, movil: true }] : []),
  ]

  for (const pantalla of pantallas) {
    await cdp.enviar('Emulation.setDeviceMetricsOverride', {
      width: pantalla.w, height: pantalla.h, deviceScaleFactor: 1, mobile: pantalla.movil,
    }, sessionId)

    for (const tema of ['light', 'dark']) {
      // El tema se emula en el NAVEGADOR y antes de cargar la página, que es la
      // única forma que funciona: forzarlo desde dentro de la página da cientos
      // de fallos inventados, porque el módulo que se importa desde ahí es otra
      // copia distinta de la que cargó la aplicación.
      await cdp.enviar('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-color-scheme', value: tema }],
      }, sessionId)

      for (const ruta of RUTAS) {
        const f = await auditarRuta(cdp, sessionId, ruta)
        const n = f.contraste.length + f.tactil.length + f.letraMinuscula.length + f.colorEnNavegacion.length
        totalFallos += n
        const donde = `${pantalla.nombre} · ${tema === 'dark' ? 'oscuro' : 'claro'} · ${ruta}`
        if (n === 0) {
          console.log(`  ✓ ${donde}`)
          continue
        }
        console.log(`  ✗ ${donde}: ${n} fallo(s)`)
        for (const c of f.contraste) console.log(`      contraste ${c.valor}:1 a ${c.px}px  «${c.que}»`)
        for (const c of f.tactil) console.log(`      pulsable de ${c.w}×${c.h}  «${c.que}»`)
        for (const c of f.letraMinuscula) console.log(`      texto a ${c.px}px  «${c.que}»`)
        for (const c of f.colorEnNavegacion) console.log(`      color en la navegación (${c.prop}: ${c.valor})  «${c.que}»`)
      }
    }
  }
} finally {
  cdp.cerrar()
  proc.kill()
  server.close()
  await rm(perfil, { recursive: true, force: true }).catch(() => {})
}

console.log(
  totalFallos === 0
    ? `\n  los suelos se cumplen en las ${RUTAS.length} páginas, en los dos temas${CON_MOVIL ? ' y en las dos pantallas' : ''}`
    : `\n  ${totalFallos} incumplimiento(s). Los suelos: contraste 4,5:1 (3:1 en texto grande), pulsables de 24×24, nada por debajo de 11px y cero color en la navegación.`,
)
process.exit(totalFallos === 0 ? 0 : 1)
