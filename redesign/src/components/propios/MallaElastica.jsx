import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import './MallaElastica.css'

// Un texto pintado sobre una malla elástica que se agarra, se estira y rebota. Código
// PROPIO, escrito desde cero, con la física de los muelles también escrita aquí.
//
// El texto se dibuja una vez en un lienzo auxiliar y se pega, trozo a trozo, sobre una
// malla de puntos. Cada punto está atado a su sitio por un muelle y a sus vecinos por otro
// más suave; al agarrar el texto con el puntero, los puntos cercanos siguen al puntero, y
// al soltar vuelven con un vaivén que se contagia de unos a otros.
//
// Cómo se hace, y qué se evita:
//
//   1. La malla es una cuadrícula de triángulos y cada triángulo se pinta con una
//      TRANSFORMACIÓN AFÍN: tres puntos del texto original y los tres puntos donde han
//      ido a parar determinan un único giro-escala-cizalla que lleva uno a otro, y el
//      lienzo 2D lo sabe aplicar (`transform` más un recorte al triángulo). No hace falta
//      WebGL para deformar una imagen en trozos pequeños.
//   2. Los triángulos se ensanchan un poco al recortar. Dos triángulos vecinos pintados
//      con el borde exacto dejan una rendija de píxel entre ellos por el suavizado de los
//      bordes, y la malla se vería rayada.
//   3. La física usa un paso FIJO (1/120 s) con integración de Verlet (la velocidad es la
//      diferencia entre la posición de ahora y la anterior): estable, y el vaivén sale
//      del propio muelle sin programarlo. El tiempo real se gasta en trozos de ese paso.
//   4. Cuando todo está quieto y nada se agarra, el bucle PARA y el último fotograma se
//      queda. Un texto en reposo no gasta nada.
//   5. Es un juguete y se dice como tal: el contenedor es una imagen con el texto como
//      nombre, y el texto de verdad debe estar fuera del lienzo para quien necesite leerlo
//      o seleccionarlo. Con el dial a cero no hay malla ni agarre: queda el texto.
//
// El dial (`gain`) quita fuerza al agarre y al contagio. A cero, nada se mueve.

const PASO = 1 / 120

export default function MallaElastica({
  texto,
  rigidez = 0.08,
  vaiven = 0.985,
  contagio = 0.18,
  radio = 90,
  malla = false,
  color = '#f4f6f8',
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const [caja] = useCaja(raiz)
  // Todo lo que la física y el puntero comparten vive en refs: no pasa por el estado.
  const sim = useRef(null)
  // El texto se mide con la tipografía real: si aún no ha llegado, se vuelve a medir al llegar.
  const [fuentes, setFuentes] = useState(false)
  useEffect(() => {
    document.fonts?.ready.then(() => setFuentes(true))
  }, [])

  useEffect(() => {
    const cv = lienzo.current
    if (!cv || !caja.w || !caja.h) return
    const dpr = caja.dpr
    cv.width = Math.round(caja.w * dpr)
    cv.height = Math.round(caja.h * dpr)
    const ctx = cv.getContext('2d')

    // El texto, dibujado una vez, ajustado al ancho de la caja.
    const familia = "'Inter', system-ui, sans-serif"
    const medidor = document.createElement('canvas').getContext('2d')
    medidor.font = `800 100px ${familia}`
    const medido = medidor.measureText(texto).width || 1
    const fs = Math.min((100 * caja.w * 0.88) / medido, caja.h * 0.6)
    const tw = (medido * fs) / 100
    const sw = Math.ceil(tw + fs * 0.3)
    const sh = Math.ceil(fs * 1.4)
    const src = document.createElement('canvas')
    src.width = Math.ceil(sw * dpr)
    src.height = Math.ceil(sh * dpr)
    const sc = src.getContext('2d')
    sc.scale(dpr, dpr)
    sc.font = `800 ${fs}px ${familia}`
    sc.fillStyle = color
    sc.textAlign = 'center'
    sc.textBaseline = 'middle'
    sc.fillText(texto, sw / 2, sh / 2 + fs * 0.04)

    // La malla: columnas por filas, con la proporción del texto.
    const cols = Math.max(Math.round(sw / 22), 6)
    const filas = Math.max(Math.round(sh / 22), 3)
    const n = cols * filas
    const ox = (caja.w - sw) / 2
    const oy = (caja.h - sh) / 2
    const rx = new Float32Array(n)
    const ry = new Float32Array(n)
    const x = new Float32Array(n)
    const y = new Float32Array(n)
    const px = new Float32Array(n)
    const py = new Float32Array(n)
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const i = f * cols + c
        rx[i] = x[i] = px[i] = ox + (c / (cols - 1)) * sw
        ry[i] = y[i] = py[i] = oy + (f / (filas - 1)) * sh
      }
    }

    const s = { agarre: null, previo: { x: 0, y: 0 }, corre: false, quietos: 0 }
    sim.current = s

    // Punto 1: una transformación afín que lleva un triángulo del texto a su sitio deformado.
    const triangulo = (i0, i1, i2) => {
      const s0x = ((i0 % cols) / (cols - 1)) * src.width
      const s0y = (Math.floor(i0 / cols) / (filas - 1)) * src.height
      const s1x = ((i1 % cols) / (cols - 1)) * src.width
      const s1y = (Math.floor(i1 / cols) / (filas - 1)) * src.height
      const s2x = ((i2 % cols) / (cols - 1)) * src.width
      const s2y = (Math.floor(i2 / cols) / (filas - 1)) * src.height
      const den = s0x * (s1y - s2y) + s1x * (s2y - s0y) + s2x * (s0y - s1y)
      if (Math.abs(den) < 1e-6) return
      // Punto 2: se ensancha el triángulo desde su centro para no dejar rendijas.
      const cx = (x[i0] + x[i1] + x[i2]) / 3
      const cy = (y[i0] + y[i1] + y[i2]) / 3
      const e = 1.04
      const dx = [x[i0], x[i1], x[i2]]
      const dy = [y[i0], y[i1], y[i2]]
      const a = (dx[0] * (s1y - s2y) + dx[1] * (s2y - s0y) + dx[2] * (s0y - s1y)) / den
      const b = (dy[0] * (s1y - s2y) + dy[1] * (s2y - s0y) + dy[2] * (s0y - s1y)) / den
      const c = (dx[0] * (s2x - s1x) + dx[1] * (s0x - s2x) + dx[2] * (s1x - s0x)) / den
      const d = (dy[0] * (s2x - s1x) + dy[1] * (s0x - s2x) + dy[2] * (s1x - s0x)) / den
      const tx = (dx[0] * (s1x * s2y - s2x * s1y) + dx[1] * (s2x * s0y - s0x * s2y) + dx[2] * (s0x * s1y - s1x * s0y)) / den
      const ty = (dy[0] * (s1x * s2y - s2x * s1y) + dy[1] * (s2x * s0y - s0x * s2y) + dy[2] * (s0x * s1y - s1x * s0y)) / den
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx + (dx[0] - cx) * e, cy + (dy[0] - cy) * e)
      ctx.lineTo(cx + (dx[1] - cx) * e, cy + (dy[1] - cy) * e)
      ctx.lineTo(cx + (dx[2] - cx) * e, cy + (dy[2] - cy) * e)
      ctx.closePath()
      ctx.clip()
      ctx.transform(a, b, c, d, tx, ty)
      // Solo el trozo del texto que cae en este triángulo, no la imagen entera quinientas
      // veces por fotograma.
      const mx = Math.max(Math.floor(Math.min(s0x, s1x, s2x)) - 2, 0)
      const my = Math.max(Math.floor(Math.min(s0y, s1y, s2y)) - 2, 0)
      const Mx = Math.min(Math.ceil(Math.max(s0x, s1x, s2x)) + 2, src.width)
      const My = Math.min(Math.ceil(Math.max(s0y, s1y, s2y)) + 2, src.height)
      ctx.drawImage(src, mx, my, Mx - mx, My - my, mx, my, Mx - mx, My - my)
      ctx.restore()
    }

    const dibujar = (reposo = false) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, caja.w, caja.h)
      // En reposo la malla no deforma nada: el texto se pega entero y de una vez, sin
      // costuras. La rendija tenue entre triángulos solo podría verse con la malla moviéndose.
      if (reposo) {
        ctx.drawImage(src, ox, oy, sw, sh)
        return
      }
      for (let f = 0; f < filas - 1; f++) {
        for (let c = 0; c < cols - 1; c++) {
          const i = f * cols + c
          triangulo(i, i + 1, i + cols)
          triangulo(i + 1, i + cols + 1, i + cols)
        }
      }
      if (malla) {
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        for (let f = 0; f < filas; f++) {
          for (let c = 0; c < cols; c++) {
            const i = f * cols + c
            if (c < cols - 1) { ctx.moveTo(x[i], y[i]); ctx.lineTo(x[i + 1], y[i + 1]) }
            if (f < filas - 1) { ctx.moveTo(x[i], y[i]); ctx.lineTo(x[i + cols], y[i + cols]) }
          }
        }
        ctx.stroke()
      }
    }

    // Punto 3: Verlet con paso fijo.
    const k = rigidez * 3600
    const paso = () => {
      const ag = s.agarre
      for (let i = 0; i < n; i++) {
        const vx = (x[i] - px[i]) * vaiven
        const vy = (y[i] - py[i]) * vaiven
        px[i] = x[i]
        py[i] = y[i]
        if (ag && ag.peso[i] > 0) {
          // Agarrado: sigue al puntero, con tanto peso como cerca estaba al agarrar.
          const w = ag.peso[i]
          x[i] += (rx[i] + (ag.x - ag.x0) * w - x[i]) * 0.45
          y[i] += (ry[i] + (ag.y - ag.y0) * w - y[i]) * 0.45
          // La posición anterior se queda donde estaba: lo que se ha movido en este paso es
          // la velocidad con la que sale el punto al soltar, y es lo que da la tirada.
          continue
        }
        x[i] += vx + k * (rx[i] - x[i]) * PASO * PASO
        y[i] += vy + k * (ry[i] - y[i]) * PASO * PASO
      }
      // El contagio: cada punto tiende al desplazamiento medio de sus vecinos.
      for (let f = 1; f < filas - 1; f++) {
        for (let c = 1; c < cols - 1; c++) {
          const i = f * cols + c
          if (ag && ag.peso[i] > 0) continue
          const mx = (x[i - 1] - rx[i - 1] + x[i + 1] - rx[i + 1] + x[i - cols] - rx[i - cols] + x[i + cols] - rx[i + cols]) / 4
          const my = (y[i - 1] - ry[i - 1] + y[i + 1] - ry[i + 1] + y[i - cols] - ry[i - cols] + y[i + cols] - ry[i + cols]) / 4
          x[i] += (rx[i] + mx - x[i]) * contagio * g * 0.5
          y[i] += (ry[i] + my - y[i]) * contagio * g * 0.5
        }
      }
    }

    // Punto 4: el bucle para cuando todo está quieto y nada se agarra.
    const correr = () => {
      if (s.corre) return
      s.corre = true
      s.quietos = 0
      let previo = 0
      let resto = 0
      const marco = (t) => {
        // Si el efecto se ha rehecho (otro tamaño, otro texto), este bucle es de una malla vieja.
        if (s.cancelado) return
        const dt = previo ? Math.min((t - previo) / 1000, 0.1) : PASO
        previo = t
        resto += dt
        while (resto >= PASO) {
          paso()
          resto -= PASO
        }
        dibujar()
        let mov = 0
        for (let i = 0; i < n; i++) mov = Math.max(mov, Math.abs(x[i] - rx[i]), Math.abs(y[i] - ry[i]), Math.abs(x[i] - px[i]) * 20, Math.abs(y[i] - py[i]) * 20)
        s.quietos = !s.agarre && mov < 0.08 ? s.quietos + 1 : 0
        if (s.quietos > 20) {
          for (let i = 0; i < n; i++) { x[i] = px[i] = rx[i]; y[i] = py[i] = ry[i] }
          // Con la malla a la vista se dibuja por triángulos, que es lo que lleva las líneas.
          dibujar(!malla)
          s.corre = false
          return
        }
        requestAnimationFrame(marco)
      }
      requestAnimationFrame(marco)
    }
    s.correr = correr
    s.malla = { cols, filas, n, rx, ry, x, y, px, py }
    dibujar(!malla)
    return () => { s.corre = true; s.cancelado = true }
  }, [caja, texto, rigidez, vaiven, contagio, malla, color, g, fuentes])

  // El puntero: agarrar, arrastrar, soltar.
  const posicion = (e) => {
    const r = raiz.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const alBajar = (e) => {
    const s = sim.current
    if (!s?.malla || g === 0 || e.button !== 0) return
    const { n, rx, ry } = s.malla
    const p = posicion(e)
    const peso = new Float32Array(n)
    let alguno = false
    for (let i = 0; i < n; i++) {
      const d = Math.hypot(rx[i] - p.x, ry[i] - p.y)
      if (d < radio) {
        peso[i] = (1 - d / radio) ** 2 * g
        alguno = true
      }
    }
    if (!alguno) return
    s.agarre = { x0: p.x, y0: p.y, x: p.x, y: p.y, peso }
    raiz.current.setPointerCapture(e.pointerId)
    s.correr()
  }

  const alMover = (e) => {
    const s = sim.current
    if (!s?.agarre) return
    const p = posicion(e)
    s.agarre.x = p.x
    s.agarre.y = p.y
  }

  const alSoltar = (e) => {
    const s = sim.current
    if (!s?.agarre) return
    s.agarre = null
    raiz.current?.releasePointerCapture?.(e.pointerId)
    s.correr()
  }

  return (
    <div
      ref={raiz}
      className={`me${g > 0 ? ' me--agarrable' : ''} ${className}`.trim()}
      role="img"
      aria-label={texto}
      onPointerDown={alBajar}
      onPointerMove={alMover}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
      style={style}
    >
      <canvas ref={lienzo} className="me-lienzo" aria-hidden="true" />
    </div>
  )
}
