import { lazy, Suspense, useEffect, useRef, useState } from 'react'

// El respaldo para los navegadores que no pueden dibujar WebGL en un worker.
const AsciiObject = lazy(() => import('./canvasui/AsciiObject'))

const OPCIONES = {
  cellSize: 7,
  scale: 3.6,
  autoRotate: true,
  autoRotateSpeed: 1.2,
  colored: false,
  background: '',
  highlight: '#2563eb',
}

const EVENTOS_PUNTERO = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']

const datosDelPuntero = (e) => ({
  pointerId: e.pointerId,
  pointerType: e.pointerType,
  button: e.button,
  buttons: e.buttons,
  clientX: e.clientX,
  clientY: e.clientY,
  pageX: e.pageX,
  pageY: e.pageY,
  ctrlKey: e.ctrlKey,
  metaKey: e.metaKey,
  shiftKey: e.shiftKey,
})

const puedeIrEnHilo = () => typeof Worker === 'function'
  && typeof OffscreenCanvas === 'function'
  && typeof HTMLCanvasElement.prototype.transferControlToOffscreen === 'function'

// El logo giratorio de la portada, dibujado fuera del hilo principal (ver
// `logoAscii.worker.js`). El canvas se crea aquí y no en el JSX porque un canvas solo se
// puede transferir una vez, y React monta los efectos dos veces en desarrollo.
export default function LogoAscii({ color, cargando }) {
  const caja = useRef(null)
  const hilo = useRef(null)
  const colorInicial = useRef(color)
  const [estado, setEstado] = useState(() => (puedeIrEnHilo() ? 'cargando' : 'respaldo'))
  const enHilo = useRef(estado !== 'respaldo')

  useEffect(() => {
    if (!enHilo.current) return undefined

    const lienzo = document.createElement('canvas')
    lienzo.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none'
    caja.current.append(lienzo)

    const trabajador = new Worker(new URL('./logoAscii.worker.js', import.meta.url), { type: 'module' })
    hilo.current = trabajador

    const medida = () => ({
      ancho: lienzo.clientWidth,
      alto: lienzo.clientHeight,
      dpr: window.devicePixelRatio || 1,
    })
    const movimiento = window.matchMedia('(prefers-reduced-motion: reduce)')
    const alMovimiento = () => trabajador.postMessage({ tipo: 'movimiento', reducido: movimiento.matches })
    const tamano = new ResizeObserver(() => trabajador.postMessage({ tipo: 'tamano', ...medida() }))
    const vista = new IntersectionObserver((entradas) => {
      trabajador.postMessage({ tipo: 'visible', visible: entradas[entradas.length - 1].isIntersecting })
    })
    const alPuntero = (e) => {
      if (e.type === 'pointerdown') lienzo.setPointerCapture(e.pointerId)
      else if (!lienzo.hasPointerCapture(e.pointerId) && e.type === 'pointermove') return
      trabajador.postMessage({ tipo: 'puntero', evento: e.type, datos: datosDelPuntero(e) })
    }
    const sinMenu = (e) => e.preventDefault()

    const soltar = () => {
      tamano.disconnect()
      vista.disconnect()
      movimiento.removeEventListener('change', alMovimiento)
      EVENTOS_PUNTERO.forEach((tipo) => lienzo.removeEventListener(tipo, alPuntero))
      lienzo.removeEventListener('contextmenu', sinMenu)
      trabajador.terminate()
      lienzo.remove()
      hilo.current = null
    }
    const alRespaldo = () => {
      soltar()
      setEstado('respaldo')
    }

    trabajador.onerror = alRespaldo
    trabajador.onmessage = ({ data }) => {
      if (data.tipo === 'listo') setEstado('listo')
      else if (data.tipo === 'fallo') alRespaldo()
      else if (data.tipo === 'cursor') lienzo.style.cursor = data.valor
    }

    const transferido = lienzo.transferControlToOffscreen()
    trabajador.postMessage({
      tipo: 'iniciar',
      lienzo: transferido,
      reducido: movimiento.matches,
      opciones: { ...OPCIONES, color: colorInicial.current },
      ...medida(),
    }, [transferido])

    tamano.observe(lienzo)
    vista.observe(lienzo)
    movimiento.addEventListener('change', alMovimiento)
    EVENTOS_PUNTERO.forEach((tipo) => lienzo.addEventListener(tipo, alPuntero))
    lienzo.addEventListener('contextmenu', sinMenu)

    return soltar
  }, [])

  // El color sigue al tema del sistema también con la portada abierta.
  useEffect(() => {
    hilo.current?.postMessage({ tipo: 'opciones', opciones: { color } })
  }, [color])

  const rotulo = (
    <div className="absolute inset-0 grid place-items-center font-mono text-xs text-tinta-suave pointer-events-none">
      {cargando}
    </div>
  )

  if (estado === 'respaldo') {
    return (
      <Suspense fallback={rotulo}>
        <AsciiObject
          {...OPCIONES}
          src="/brand/logo-blanco.svg"
          color={color}
          style={{ position: 'absolute', inset: 0 }}
        />
      </Suspense>
    )
  }

  return (
    <div ref={caja} className="absolute inset-0">
      {estado === 'cargando' && rotulo}
    </div>
  )
}
