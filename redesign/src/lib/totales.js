import { LANGUAGES } from '../data/languages.js'
import { RESOURCES } from '../data/resources.js'
import { CONCEPTS } from '../data/concepts.js'
import { COMPONENT_ITEMS } from '../data/components.js'
import { SKILL_ITEMS } from '../data/skills.js'
import { CONSEJOS } from '../data/consejos.js'

// Cuánto hay en cada sección, contado del catálogo. Vive aquí y no dentro de
// App porque lo necesitan la aplicación, las demos y el prerenderizado del
// build, y mientras cada uno tenía su copia el sitio llegó a anunciar dos
// cifras distintas del mismo dato: el 2026-08-20 el mismo componente decía
// «64 recursos» arriba y «72 recursos» unos píxeles más abajo.
const suma = (grupos) => grupos.reduce((n, g) => n + g.items.length, 0)

export const TOTALES = {
  langs: LANGUAGES.length,
  res: suma(RESOURCES),
  concepts: suma(CONCEPTS),
  comps: COMPONENT_ITEMS.length,
  // De esos, los que tienen demo y los que son fichas de análisis sin demo ni
  // código (clase `referencia`). Hay que distinguirlos al contar: «15 componentes
  // en vivo» sigue siendo verdad, y «43 componentes en vivo» no lo sería.
  compsVivos: COMPONENT_ITEMS.filter((c) => c.clase !== 'referencia').length,
  compsRef: COMPONENT_ITEMS.filter((c) => c.clase === 'referencia').length,
  skills: SKILL_ITEMS.length,
  consejos: CONSEJOS.length,
  // Cuántas skills se instalan con dos comandos. El texto de la sección decía
  // «las seis» a mano, y eso deja de ser verdad en cuanto se publique la
  // séptima sin que nadie mire este archivo.
  skillsPlugin: SKILL_ITEMS.filter((s) => s.plugin).length,
}

// Lo que la tarjeta social dice que hay: el texto alternativo de su imagen.
//
// Ya no lleva cifras, y no es un descuido. Un texto alternativo describe la
// imagen que acompaña, y esa imagen dejó de dibujar números el 2026-08-20 para
// que no caducara sola (ver `scripts/tarjeta-social.mjs`). Si aquí siguieran los
// contadores, quien la escucha con un lector de pantalla oiría un dato que la
// pantalla no enseña, y encima uno que envejece con cada ficha nueva.
// Va por idioma desde que cada página tiene una dirección en cada uno: el `alt`
// describe la imagen para quien no la ve, así que tiene que estar en el idioma
// del documento que lo contiene, no en el de la imagen.
const RESUMEN = {
  es: 'Vibeset · lenguajes, recursos, conceptos web, componentes, skills y consejos',
  en: 'Vibeset · languages, resources, web concepts, components, skills and tips',
}

export const resumenDelCatalogo = (lang = 'es') => RESUMEN[lang] ?? RESUMEN.es
