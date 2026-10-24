// Registries de componentes de terceros que el MCP indexa y ENLAZA, nunca
// rehospeda. El MCP lee el índice (metadata pura) de cada origen y devuelve
// título, descripción y el comando de instalación del ORIGEN. El código ajeno no
// se copia ni se sirve jamás: ver LICENSING.md y la guardia de
// scripts/comprobar-registro.mjs.
//
// Campos:
// - namespace: el alias shadcn (@x) con el que se instala desde su origen.
// - indexUrl: el registry.json índice del origen. scripts/comprobar-registro.mjs
//   comprueba que cada uno esté vivo y devuelva items de verdad, y si un origen
//   cae, la búsqueda degrada a «solo lo propio» sin romperse.
// - verificado: si el indexUrl devuelve un registry JSON con items. Los doce se
//   comprobaron el 2026-08-21 (items reales, de 41 a 1.130 por origen). Hay muchos
//   más en el directorio oficial de shadcn (https://ui.shadcn.com/r/registries.json,
//   289 registries); esta lista es la selección curada que se federa en vivo.
// - license: la licencia declarada del origen. Da igual para la ley porque no se
//   rehospeda ninguno, pero se muestra para que quien instale sepa a qué se atiene.
export const REGISTRIES = [
  {
    key: 'shadcn',
    name: 'shadcn/ui',
    homepage: 'https://ui.shadcn.com',
    namespace: '@shadcn',
    indexUrl: 'https://ui.shadcn.com/r/index.json',
    license: 'MIT',
    verificado: true,
    es: 'La base del ecosistema: componentes accesibles y sin estilo propio.',
    en: 'The base of the ecosystem: accessible, unstyled components.',
  },
  {
    key: 'magicui',
    name: 'Magic UI',
    homepage: 'https://magicui.design',
    namespace: '@magicui',
    indexUrl: 'https://magicui.design/r/registry.json',
    license: 'MIT',
    verificado: true,
    es: 'Componentes animados listos para marketing, sobre shadcn.',
    en: 'Animated, marketing-ready components built on shadcn.',
  },
  {
    key: 'reactbits',
    name: 'React Bits',
    homepage: 'https://reactbits.dev',
    namespace: '@react-bits',
    indexUrl: 'https://reactbits.dev/r/registry.json',
    license: 'MIT + Commons Clause',
    verificado: true,
    es: 'Colección de componentes React animados. Instalar sí, revender no.',
    en: 'A collection of animated React components. Fine to use, not to resell.',
  },
  {
    key: 'aceternity',
    name: 'Aceternity UI',
    homepage: 'https://ui.aceternity.com',
    namespace: '@aceternity',
    indexUrl: 'https://ui.aceternity.com/registry.json',
    license: 'proprietary',
    verificado: true,
    es: 'Efectos de alto impacto. Licencia propietaria: se enlaza, se instala desde su sitio.',
    en: 'High-impact effects. Proprietary licence: linked, installed from their own site.',
  },
  {
    key: 'canvas-ui',
    name: 'canvasui',
    homepage: 'https://canvasui.dev',
    namespace: '@canvas-ui',
    indexUrl: 'https://canvasui.dev/r/registry.json',
    license: 'author-terms',
    verificado: true,
    es: 'La fuente real de 9 de los 12 efectos WebGL del catálogo propio.',
    en: 'The real source of 9 of the 12 WebGL effects in the own catalogue.',
  },
  {
    key: 'fancy',
    name: 'Fancy Components',
    homepage: 'https://fancycomponents.dev',
    namespace: '@fancy',
    indexUrl: 'https://www.fancycomponents.dev/r/registry.json',
    license: 'MIT',
    verificado: true,
    es: 'Componentes de texto y movimiento con mucho carácter.',
    en: 'Text and motion components with plenty of character.',
  },
  {
    key: 'animate-ui',
    name: 'Animate UI',
    homepage: 'https://animate-ui.com',
    namespace: '@animate-ui',
    indexUrl: 'https://animate-ui.com/r/registry.json',
    license: 'MIT + Commons Clause',
    verificado: true,
    es: 'Componentes animados sobre shadcn. Instalar sí, revender no.',
    en: 'Animated components on top of shadcn. Fine to use, not to resell.',
  },
  {
    key: 'cnippet',
    name: 'Cnippet UI',
    homepage: 'https://ui.cnippet.dev',
    namespace: '@cnippet',
    indexUrl: 'https://ui.cnippet.dev/r/registry.json',
    license: 'MIT',
    verificado: true,
    es: 'Catálogo amplio de componentes y bloques.',
    en: 'A broad catalogue of components and blocks.',
  },
  {
    key: 'kokonutui',
    name: 'Kokonut UI',
    homepage: 'https://kokonutui.com',
    namespace: '@kokonutui',
    indexUrl: 'https://kokonutui.com/r/registry.json',
    license: 'MIT',
    verificado: true,
    es: 'Componentes con estilo, listos para pegar.',
    en: 'Stylish components, ready to paste.',
  },
  {
    key: 'smoothui',
    name: 'SmoothUI',
    homepage: 'https://smoothui.dev',
    namespace: '@smoothui',
    indexUrl: 'https://smoothui.dev/r/registry.json',
    license: 'MIT',
    verificado: true,
    es: 'Componentes con micro-interacciones suaves.',
    en: 'Components with smooth micro-interactions.',
  },
  {
    key: 'react-aria',
    name: 'React Aria (Adobe)',
    homepage: 'https://react-aria.adobe.com',
    namespace: '@react-aria',
    indexUrl: 'https://react-aria.adobe.com/registry/registry.json',
    license: 'Apache-2.0',
    verificado: true,
    es: 'Los componentes accesibles de Adobe, cuando manda el rigor.',
    en: 'Adobe accessible components, for when rigour comes first.',
  },
  {
    key: 'svgl',
    name: 'svgl',
    homepage: 'https://svgl.app',
    namespace: '@svgl',
    indexUrl: 'https://svgl.app/r/registry.json',
    license: 'MIT (código); los logos son marcas de terceros',
    verificado: true,
    es: 'Logos de marcas en SVG. El código es libre; el logo, marca de su dueño.',
    en: 'Brand logos in SVG. The code is free; the logo is its owner trademark.',
  },
]
