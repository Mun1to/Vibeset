// Avisa a IndexNow de las páginas que han cambiado desde la última publicación.
//
//   node scripts/avisar-indexnow.mjs            compara con el estado guardado y avisa de lo cambiado
//   node scripts/avisar-indexnow.mjs --seco     dice qué avisaría, sin avisar ni guardar nada
//   node scripts/avisar-indexnow.mjs --todas    avisa de todas las páginas del sitemap
//
// Lo lanza `.github/workflows/indexnow.yml` cuando la web ya sirve el commit nuevo. El estado es
// una huella del texto de cada página, guardada en la caché de Actions entre publicaciones. Si no
// hay estado, solo se guarda la foto de hoy y no se avisa de nada: IndexNow pide enviar lo que
// cambia, y una caché caducada no debe reenviar el sitio entero.
//
// La huella sale del título, la descripción y el texto visible, no del HTML en bruto: cada build
// cambia los nombres de los archivos JS y CSS, y eso no es un cambio de contenido.

import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const SITIO = 'https://vibeset.dev'
const HOST = 'vibeset.dev'
const CLAVE = 'fc58b72078d7ef112e12965b0a13ca29'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_POR_ENVIO = 10000
const A_LA_VEZ = 8
const UA = 'Mozilla/5.0 (compatible; vibeset-indexnow)'

const args = process.argv.slice(2)
const seco = args.includes('--seco')
const todas = args.includes('--todas')
const ARCHIVO_ESTADO = args.find((a) => a.startsWith('--estado='))?.slice(9) || '.indexnow-estado.json'

const pedir = (url) => fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) })

function huella(html) {
  const titulo = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(html)?.[1] ?? ''
  const descripcion = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1] ?? ''
  const texto = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/^[\s\S]*?<body\b[^>]*>/i, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return createHash('sha256').update(`${titulo}\n${descripcion}\n${texto}`).digest('hex')
}

async function leerSitio() {
  const r = await pedir(`${SITIO}/sitemap.xml`)
  if (!r.ok) throw new Error(`sitemap.xml respondió ${r.status}`)
  const urls = [...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  const huellas = {}
  for (let i = 0; i < urls.length; i += A_LA_VEZ) {
    await Promise.all(
      urls.slice(i, i + A_LA_VEZ).map(async (url) => {
        const p = await pedir(url)
        if (!p.ok) throw new Error(`${url} respondió ${p.status}`)
        huellas[url] = huella(await p.text())
      }),
    )
  }
  return huellas
}

async function avisar(urls) {
  for (let i = 0; i < urls.length; i += MAX_POR_ENVIO) {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: CLAVE,
        keyLocation: `${SITIO}/${CLAVE}.txt`,
        urlList: urls.slice(i, i + MAX_POR_ENVIO),
      }),
    })
    // 200 es recibido y 202 es recibido con la clave aún por validar. Ninguno significa indexado.
    if (r.status !== 200 && r.status !== 202) throw new Error(`IndexNow respondió ${r.status}: ${await r.text()}`)
    console.log(`IndexNow respondió ${r.status} a ${urls.slice(i, i + MAX_POR_ENVIO).length} direcciones`)
  }
}

const ahora = await leerSitio()
const antes = existsSync(ARCHIVO_ESTADO) ? JSON.parse(readFileSync(ARCHIVO_ESTADO, 'utf8')) : null
const total = Object.keys(ahora).length

let cambiadas = []
if (todas) cambiadas = Object.keys(ahora)
else if (antes) {
  const nuevasOEditadas = Object.keys(ahora).filter((u) => ahora[u] !== antes[u])
  const retiradas = Object.keys(antes).filter((u) => !(u in ahora))
  cambiadas = [...nuevasOEditadas, ...retiradas]
}

if (!antes && !todas) console.log(`Sin estado anterior: guardo la foto de ${total} páginas y no aviso de nada.`)
else console.log(`${cambiadas.length} de ${total} páginas para avisar`)
for (const u of cambiadas.slice(0, 20)) console.log(`  ${u}`)
if (cambiadas.length > 20) console.log(`  ... y ${cambiadas.length - 20} más`)

if (seco) process.exit(0)
if (cambiadas.length) await avisar(cambiadas)
writeFileSync(ARCHIVO_ESTADO, JSON.stringify(ahora))
