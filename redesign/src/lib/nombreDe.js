// El nombre de una pieza de la casa sí se traduce: «Header de píldora deslizante»
// en inglés no dice nada. Los de canvasui y arlan no tienen `nameEn` porque son
// nombres propios (Bubble, Cloth) y esos no se traducen.
//
// Vive aparte del catálogo porque `meta.js` lo necesita en el paquete principal, y
// importarlo de `data/components.js` metía todas las fichas en la portada.
export const nombreDe = (item, lang) => (lang === 'en' && item.nameEn) || item.name
