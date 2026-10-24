import { lazy, Suspense } from 'react'
import SuperficieDemo, { SuperficieAlta } from './SuperficieDemo'
import { TOTALES } from '../lib/totales'
import { DEMOS_PROPIOS } from './propios/demos'

// Componentes originales de canvasui.dev: shaders pesados (dos con three.js),
// así que se descargan solo cuando alguien los mira, no en la carga inicial.
const Bubble = lazy(() => import('./canvasui/Bubble'))
const Cloth = lazy(() => import('./canvasui/Cloth'))
const DitheredObject = lazy(() => import('./canvasui/DitheredObject'))
const Asciify = lazy(() => import('./canvasui/Asciify'))
const Peel = lazy(() => import('./canvasui/Peel'))
const Bend = lazy(() => import('./canvasui/Bend'))
const AsciiObject = lazy(() => import('./canvasui/AsciiObject'))
const Laser = lazy(() => import('./canvasui/Laser'))
const ParticleScroll = lazy(() => import('./canvasui/ParticleScroll'))

// Visuales de arlan.me/vault: motores propios, montados por su puente.
const ChromaGlowDemo = lazy(() => import('./arlan/ArlanDemos').then((m) => ({ default: m.ChromaGlowDemo })))
const EmbossDemo = lazy(() => import('./arlan/ArlanDemos').then((m) => ({ default: m.EmbossDemo })))
const ColorDepthDemo = lazy(() => import('./arlan/colorDepth/ColorDepthDemo'))

// Piezas PROPIAS (src/components/propios/). Van perezosas por lo mismo que las
// otras: nadie mira quince demos a la vez. Aquí no hay shader ni three.js, así
// que pesan poco, pero el patrón se mantiene para no tener dos reglas.
const HeaderPildora = lazy(() => import('./propios/HeaderPildora'))
const AcordeonFaq = lazy(() => import('./propios/AcordeonFaq'))
const MatrioskaParallax = lazy(() => import('./propios/MatrioskaParallax'))

// La superficie sobre la que actúan los efectos vive en SuperficieDemo: es el
// catálogo de Vibeset dibujado con bloques de color y texto, no una foto de
// banco de imágenes. Aquí solo se elige cuál toca a cada efecto.
const DemoContent = ({ compact, t, clave }) => <SuperficieDemo clave={clave} compact={compact} t={t} />
const TallContent = ({ compact, t }) => <SuperficieAlta compact={compact} t={t} />

// La capa que asoma cuando el Peel levanta la portada.
function UnderContent({ compact, t }) {
  return (
    <div className={`w-full h-full bg-blue-600 text-white ${compact ? 'p-4' : 'p-8'}`}>
      <div className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-2xl'}`}>
        {t.demoUnder}
      </div>
      <div className={`opacity-80 mt-2 ${compact ? 'text-[12px]' : 'text-sm'}`}>
        {t.demoLine(TOTALES)}
      </div>
    </div>
  )
}

// Los componentes de canvasui aplican `position: relative` en el style inline,
// que gana a cualquier clase: hay que estirarlos desde el propio style.
const FILL = { position: 'absolute', inset: 0 }

function Loading({ t }) {
  return (
    <div className="absolute inset-0 grid place-items-center font-mono text-xs text-zinc-400">
      {t.compLoading}
    </div>
  )
}

export default function ComponentDemo({ item, values, lang, compact = false, t }) {
  if (item.key === 'bubble') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Bubble {...values} style={FILL} className="cursor-none">
          <DemoContent t={t} compact={compact} clave="bubble" />
        </Bubble>
      </Suspense>
    )
  }

  if (item.key === 'cloth') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Cloth {...values} style={FILL}>
          <DemoContent t={t} compact={compact} clave="cloth" />
        </Cloth>
      </Suspense>
    )
  }

  if (item.key === 'dithered') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <DitheredObject {...values} style={FILL} />
      </Suspense>
    )
  }

  if (item.key === 'asciiObject') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <AsciiObject {...values} style={FILL} />
      </Suspense>
    )
  }

  if (item.key === 'asciify') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Asciify {...values} style={FILL}>
          <DemoContent t={t} compact={compact} clave="asciify" />
        </Asciify>
      </Suspense>
    )
  }

  if (item.key === 'peel') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Peel {...values} style={FILL} under={<UnderContent t={t} compact={compact} />}>
          <DemoContent t={t} compact={compact} clave="peel" />
        </Peel>
      </Suspense>
    )
  }

  if (item.key === 'laser') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Laser {...values} style={FILL}>
          <TallContent compact={compact} t={t} />
        </Laser>
      </Suspense>
    )
  }

  if (item.key === 'particleScroll') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ParticleScroll {...values} style={FILL}>
          <TallContent compact={compact} t={t} />
        </ParticleScroll>
      </Suspense>
    )
  }

  if (item.key === 'chromaGlow') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ChromaGlowDemo values={values} />
      </Suspense>
    )
  }

  if (item.key === 'emboss') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <EmbossDemo values={values} />
      </Suspense>
    )
  }

  if (item.key === 'colorDepth') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ColorDepthDemo values={values} compact={compact} t={t} />
      </Suspense>
    )
  }

  if (item.key === 'bend') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Bend {...values} style={FILL}>
          <TallContent compact={compact} t={t} />
        </Bend>
      </Suspense>
    )
  }

  if (item.key === 'headerPildora') {
    // El menú dice las secciones de verdad de este sitio: un menú de mentira con
    // «Item 1, Item 2» no enseña cómo se comporta la píldora con anchos desiguales,
    // que es justo lo que hace la pieza.
    return (
      <Suspense fallback={<Loading t={t} />}>
        <HeaderPildora
          {...values}
          style={FILL}
          items={[t.nav.languages, t.nav.resources, t.nav.concepts, t.nav.skills, t.nav.consejos]}
        />
      </Suspense>
    )
  }

  if (item.key === 'acordeonFaq') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <AcordeonFaq
          {...values}
          style={FILL}
          titulo={compact ? null : t.demoFaqTitulo}
          items={t.demoFaq}
        />
      </Suspense>
    )
  }

  if (item.key === 'matrioska') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <MatrioskaParallax
          {...values}
          style={FILL}
          capas={t.demoCapas.map((c) => (
            <div key={c.rotulo} className="mp-anillo">
              <span className="mp-rotulo">{c.rotulo}</span>
              <span className="mp-titulo">{c.titulo}</span>
            </div>
          ))}
        />
      </Suspense>
    )
  }

  // Las piezas propias nuevas: cada una trae su demo en propios/demos/ y se
  // registra en el índice de esa carpeta, sin añadir otro `if` aquí.
  const DemoPropio = DEMOS_PROPIOS[item.key]
  if (DemoPropio) {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <DemoPropio values={values} compact={compact} lang={lang} t={t} />
      </Suspense>
    )
  }

  return null
}
