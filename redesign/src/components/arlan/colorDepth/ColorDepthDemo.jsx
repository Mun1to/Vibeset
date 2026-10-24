import { useEffect, useRef, useState } from 'react'
import './color-depth.css'

// Los diez materiales de botón de arlan.me/vault/color-depth. El CSS es el
// original; aquí van el marcado que cada material necesita, el seguimiento del
// puntero (Metal y Foil) y el filtro SVG que usa el material de cristal.

const FILTRO_CRISTAL = (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <filter id="liquid-glass-filter" colorInterpolationFilters="sRGB">
        <feImage
          x="0" y="0" width="100%" height="100%"
          href="data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%20200%2080%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27r%27%20x2%3D%27100%25%27%3E%3Cstop%20stop-color%3D%27%23f00%27%2F%3E%3Cstop%20offset%3D%2750%25%27%20stop-color%3D%27%23808080%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%230f0%27%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%27b%27%20y2%3D%27100%25%27%3E%3Cstop%20stop-color%3D%27%2300f%27%2F%3E%3Cstop%20offset%3D%2750%25%27%20stop-color%3D%27%23808080%27%2F%3E%3Cstop%20offset%3D%27100%25%27%20stop-color%3D%27%23ff0%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%27200%27%20height%3D%2780%27%20rx%3D%2740%27%20fill%3D%27url%28%23r%29%27%2F%3E%3Crect%20width%3D%27200%27%20height%3D%2780%27%20rx%3D%2740%27%20fill%3D%27url%28%23b%29%27%20style%3D%27mix-blend-mode%3Aoverlay%27%2F%3E%3Crect%20x%3D%2714%27%20y%3D%2714%27%20width%3D%27172%27%20height%3D%2752%27%20rx%3D%2726%27%20fill%3D%27%23808080%27%20style%3D%27filter%3Ablur%2814px%29%27%2F%3E%3C%2Fsvg%3E"
          result="map"
        />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-14" xChannelSelector="R" yChannelSelector="G" result="dispRed" />
        <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-13" xChannelSelector="R" yChannelSelector="G" result="dispGreen" />
        <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="-12" xChannelSelector="R" yChannelSelector="G" result="dispBlue" />
        <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
        <feBlend in="red" in2="green" mode="screen" result="rg" />
        <feBlend in="rg" in2="blue" mode="screen" result="output" />
        <feGaussianBlur in="output" stdDeviation="0.4" />
      </filter>
    </defs>
  </svg>
)

// Metal y Foil leen la posición del cursor desde variables CSS.
function usePuntero() {
  const ref = useRef(null)

  useEffect(() => {
    const raiz = ref.current
    if (!raiz) return
    const objetivos = [...raiz.querySelectorAll('.depth-metal, .depth-foil')]
    const sueltas = objetivos.map((el) => {
      let raf = 0
      let px = 0.5
      let py = 0.5
      const escribir = () => {
        raf = 0
        const s = el.style
        s.setProperty('--pointer-x', (px * 100).toFixed(1) + '%')
        s.setProperty('--pointer-y', (py * 100).toFixed(1) + '%')
        s.setProperty('--glare-x', (px * 100).toFixed(1) + '%')
        s.setProperty('--glare-y', (py * 100).toFixed(1) + '%')
        s.setProperty('--shine-angle', (110 + (px - 0.5) * 50).toFixed(1) + 'deg')
      }
      const pedir = () => { if (!raf) raf = requestAnimationFrame(escribir) }
      const mover = (e) => {
        const r = el.getBoundingClientRect()
        if (r.width && r.height) {
          px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
          py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
        }
        pedir()
      }
      const salir = () => { px = 0.5; py = 0.5; pedir() }
      el.addEventListener('pointermove', mover, { passive: true })
      el.addEventListener('pointerleave', salir)
      return () => {
        cancelAnimationFrame(raf)
        el.removeEventListener('pointermove', mover)
        el.removeEventListener('pointerleave', salir)
      }
    })
    return () => sueltas.forEach((f) => f())
  })

  return ref
}

function Contenido({ material, etiqueta }) {
  if (material === 'foil') {
    return (
      <>
        <span aria-hidden className="depth-foil-l depth-foil-base" />
        <span aria-hidden className="depth-foil-l depth-foil-film" />
        <span aria-hidden className="depth-foil-l depth-foil-pearl" />
        <span className="depth-label">{etiqueta}</span>
        <span aria-hidden className="depth-foil-l depth-foil-shine" />
        <span aria-hidden className="depth-foil-l depth-foil-glare" />
      </>
    )
  }
  return <span className="depth-label">{etiqueta}</span>
}

export default function ColorDepthDemo({ values, compact, t }) {
  const material = values.material || 'glossy'
  const etiqueta = values.label || 'Vibeset'
  const [encendido, setEncendido] = useState(true)
  const ref = usePuntero()

  return (
    <div
      ref={ref}
      className="absolute inset-0 grid place-items-center gap-5"
      // el cristal necesita algo con color detrás para que se note la refracción
      style={{
        background:
          'linear-gradient(rgba(9,13,20,.55), rgba(9,13,20,.78)), url(/demo/paisaje-5.jpg) center/cover',
      }}
    >
      {FILTRO_CRISTAL}
      <div className={`flex items-center ${compact ? 'gap-3' : 'gap-5'} flex-wrap justify-center px-4`}>
        <button className={`depth-btn depth-${material}`}>
          <Contenido material={material} etiqueta={etiqueta} />
        </button>

        <button className={`depth-btn depth-icon depth-${material}`} aria-label={t?.demoGo ?? 'Go'}>
          <Contenido
            material={material}
            etiqueta={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
              </svg>
            }
          />
        </button>

        <button
          className={`depth-btn depth-toggle depth-${material}`}
          role="switch"
          aria-checked={encendido}
          data-on={encendido ? 'true' : 'false'}
          onClick={() => setEncendido((v) => !v)}
          aria-label={t?.demoSwitch ?? 'Switch'}
        >
          {material === 'foil' && (
            <>
              <span aria-hidden className="depth-foil-l depth-foil-base" />
              <span aria-hidden className="depth-foil-l depth-foil-film" />
            </>
          )}
          <span aria-hidden className="depth-knob" />
        </button>
      </div>
    </div>
  )
}
