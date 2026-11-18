import { IDIOMAS } from './rutas.js'

// Qué idioma se le sugiere a quien llega. Nunca decide lo que se pinta: eso lo dice
// la dirección, y cada dirección enseña siempre su idioma.
//
// Aquí hubo un salto automático a `/en` para los navegadores en inglés, escrito con
// la idea de que ningún buscador ejecuta JavaScript. Google sí lo ejecuta, rastrea
// con el navegador en inglés y no manda idioma, así que al entrar en `/` acababa en
// `/en` y la portada española, que además es el `x-default`, podía no indexarse.
const CLAVE = 'vibeset-lang'

function idiomaGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return IDIOMAS.includes(guardado) ? guardado : null
  } catch {
    // Navegación privada sin almacenamiento.
    return null
  }
}

function idiomaDelNavegador() {
  const preferidos = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const etiqueta of preferidos ?? []) {
    // 'en-GB' y 'en' valen los dos: interesa la parte de antes del guion.
    const base = String(etiqueta).toLowerCase().split('-')[0]
    if (IDIOMAS.includes(base)) return base
  }
  return null
}

// El idioma que merece un aviso en esta página, o `null` si no hay nada que decir.
// Solo se sugiere el inglés en las direcciones españolas: las de `/en` son
// explícitas, y quien comparte una está eligiendo. Y quien ya eligió, a mano o
// cerrando el aviso, no vuelve a oír hablar del tema.
export function idiomaASugerir(lang) {
  if (lang !== 'es' || idiomaGuardado()) return null
  return idiomaDelNavegador() === 'en' ? 'en' : null
}

export function guardarIdioma(lang) {
  try { localStorage.setItem(CLAVE, lang) } catch { /* sin almacenamiento */ }
}
