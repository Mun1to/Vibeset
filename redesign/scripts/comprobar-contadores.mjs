// Comprueba que los números que el proyecto anuncia por ahí fuera coinciden con
// lo que hay de verdad en el catálogo.
//
// Existe por un caso concreto: el 2026-08-20 el sitio anunciaba «64 recursos y
// 17 skills» cuando ya eran 72 y 18, el README público decía lo mismo en tres
// sitios, y el LICENSING.md llegaba a definir QUÉ material es CC BY contando
// cosas, con una cifra distinta en cada idioma. El fallo no lo cazó nadie
// durante días porque no había forma de cazarlo sin leerlo todo a mano.
//
// Se lanza con `pnpm contadores`. Sale con código 1 si algo no cuadra, así que
// sirve tal cual para un hook o para CI.

import { readFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOTALES } from '../src/lib/totales.js'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = join(RAIZ, '..')

// Cada unidad, en los dos idiomas, con el total que le corresponde. La palabra
// va pegada al número en todos los textos del proyecto, así que basta con eso.
const UNIDADES = [
  [/\b(\d+)\s+(?:lenguajes|languages|programming languages|lenguajes de programación)\b/g, 'langs'],
  [/\b(\d+)\s+(?:recursos|resources|herramientas de frontend|frontend tools|frontend resources|recursos de frontend)\b/g, 'res'],
  [/\b(\d+)\s+(?:conceptos|concepts|web design concepts|conceptos web|técnicas de diseño|design techniques)\b/g, 'concepts'],
  [/\b(\d+)\s+(?:componentes(?!\s+en vivo)|components)\b/g, 'comps'],
  // «15 en vivo» y «28 de análisis» no son el total de componentes: son sus dos
  // clases (demo viva, y ficha de análisis sin demo ni código).
  [/\b(\d+)\s+(?:live components|componentes en vivo)\b/g, 'compsVivos'],
  [/\b(\d+)\s+(?:component analysis cards|analysis cards|fichas de análisis de componentes|fichas de análisis)\b/g, 'compsRef'],
  [/\b(\d+)\s+(?:skills|agent skills|skills de agente)\b/g, 'skills'],
  [/\b(\d+)\s+(?:consejos|tips)\b/g, 'consejos'],
]

const ARCHIVOS = ['README.md', 'README.es.md', 'LICENSING.md', 'redesign/index.html']

// Frases donde el número está a propósito y no describe el catálogo de hoy.
// Se apuntan enteras para que añadir una sea una decisión visible, no un ajuste
// de la expresión regular que desactive comprobaciones sin querer.
const A_PROPOSITO = [
  'a licence that says "the 64 resource entries" leaves the sixty-fifth in the dark',
]

let fallos = 0

for (const archivo of ARCHIVOS) {
  const ruta = join(REPO, archivo)
  let texto
  try { texto = readFileSync(ruta, 'utf8') } catch { console.log(`  ? no está: ${archivo}`); continue }

  const lineas = texto.split(/\r?\n/)
  lineas.forEach((linea, i) => {
    if (A_PROPOSITO.some((frase) => linea.includes(frase))) return
    for (const [re, clave] of UNIDADES) {
      for (const m of linea.matchAll(re)) {
        const escrito = Number(m[1])
        if (escrito === TOTALES[clave]) continue
        fallos++
        console.log(`  ✗ ${relative(REPO, ruta)}:${i + 1}  dice ${escrito} ${clave}, hay ${TOTALES[clave]}`)
        console.log(`     ${linea.trim().slice(0, 100)}`)
      }
    }
  })
}

const cuenta = Object.entries(TOTALES).map(([k, v]) => `${v} ${k}`).join(' · ')

if (fallos) {
  console.log(`\n${fallos} número(s) desfasado(s). El catálogo tiene: ${cuenta}`)
  process.exit(1)
}

console.log(`  contadores al día en ${ARCHIVOS.length} archivos: ${cuenta}`)
