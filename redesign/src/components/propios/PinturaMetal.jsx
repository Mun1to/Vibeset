import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import { crearPantalla } from './gl'
import './PinturaMetal.css'

// Un texto (o una forma) hecho de metal líquido. Código PROPIO, escrito desde cero: el
// shader entero, ruido incluido, es de aquí.
//
// Un logotipo o un titular que parece mercurio: superficie cromada con bandas que fluyen,
// reflejos que se mueven con la luz (el puntero la mueve) y un leve borde de color donde
// el metal se parte en sus componentes, como en un cromo irisado.
//
// Cómo se consigue sin un modelo 3D:
//
//   1. La FORMA sale de dibujar el texto en un lienzo 2D y subirlo como textura: lo que es
//      letra vale 1, lo demás 0. Cualquier tipografía y cualquier texto, y con una imagen
//      sería lo mismo. De esa máscara sale todo.
//   2. El RELIEVE se inventa desde la máscara. Se desenfoca mucho (nueve muestras con un
//      radio grande) para que sea una colina suave y no un escalón, y de la diferencia
//      entre dos puntos vecinos sale la pendiente, y de la pendiente una normal falsa: como
//      si las letras fueran un bajorrelieve redondeado. Es lo que da el aspecto de volumen.
//   3. El METAL son tres cosas encima: una banda que fluye (ruido que se deforma con la
//      propia normal, para que el flujo siga el relieve), un reflejo especular que depende
//      de dónde está la luz, y un desfase de fase distinto por canal de color (la
//      dispersión), que es lo que deja el borde ligeramente irisado.
//   4. La salida es transparente fuera de las letras, con alfa premultiplicado: el metal se
//      pone sobre lo que haya detrás sin recuadro.
//   5. Como pasa con todo lo que dibuja un texto en un lienzo, el texto deja de ser texto para
//      el navegador: el contenedor es una imagen con el texto por nombre. El bucle para
//      fuera de pantalla, el dial a cero deja un fotograma, y sin WebGL queda el texto normal.
//
// El dial (`gain`) multiplica el flujo y la velocidad con que la luz sigue al puntero.

const FRAGMENTO = `
uniform sampler2D uMascara;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uLuz;
uniform float uDistor;
uniform float uBrillo;
uniform float uDisp;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * ruido(p);
    p = p * 2.05 + vec2(9.7, 3.1);
    a *= 0.5;
  }
  return v;
}

// Punto 2: la máscara desenfocada. Pedirle a la textura un nivel de detalle más bajo (el
// «sesgo») da una versión suave de la imagen con UNA muestra, y la pendiente de esa colina
// es continua: con nueve muestras sueltas sobre un borde duro, la pendiente sale a escalones
// y el metal parece cristal roto.
float alto(vec2 uv, float sesgo) {
  return texture2D(uMascara, uv, sesgo).a;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float forma = smoothstep(0.38, 0.62, texture2D(uMascara, uv).a);
  if (forma < 0.002) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Dos desenfoques, uno ajustado al borde y otro ancho, sumados: el bisel llega más adentro
  // de la letra y el centro de los trazos gruesos no se queda plano del todo.
  float e = 4.0 / uRes.y;
  vec2 g1 = vec2(
    alto(uv + vec2(e, 0.0), 4.0) - alto(uv - vec2(e, 0.0), 4.0),
    alto(uv + vec2(0.0, e), 4.0) - alto(uv - vec2(0.0, e), 4.0)
  );
  vec2 g2 = vec2(
    alto(uv + vec2(e, 0.0), 6.5) - alto(uv - vec2(e, 0.0), 6.5),
    alto(uv + vec2(0.0, e), 6.5) - alto(uv - vec2(0.0, e), 6.5)
  );
  vec2 g = (g1 + 0.9 * g2) / (2.0 * e) / 55.0;
  vec3 n = normalize(vec3(-g * uDistor, 1.0));

  // Punto 3: la banda fluye siguiendo el relieve, y cada canal lleva su propia fase.
  vec2 p = vec2(uv.x * asp, uv.y) * 2.4 + n.xy * 1.6;
  float f1 = fbm(p + vec2(uT * 0.10, -uT * 0.07));
  float f2 = fbm(p * 1.7 - vec2(uT * 0.08, uT * 0.05) + f1 * 1.6);
  float fase = f2 * 4.2 + n.x * 2.6 + n.y * 1.6 + (uLuz.x - 0.5) * 1.8;
  vec3 bandas = 0.5 + 0.5 * cos(6.2832 * (vec3(fase) + vec3(0.0, uDisp * 0.07, uDisp * 0.14)));

  vec3 L = normalize(vec3((uLuz.x - 0.5) * 1.8, (uLuz.y - 0.5) * 1.8, 0.85));
  float espec = pow(max(dot(n, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 34.0);
  float canto = smoothstep(0.0, 0.5, length(g) * uDistor * 1.4);

  vec3 oscuro = vec3(0.07, 0.08, 0.1);
  vec3 claro = vec3(0.93, 0.95, 0.99);
  vec3 col = mix(oscuro, claro, pow(bandas, vec3(1.7)));
  col += vec3(1.0) * espec * uBrillo * 1.1 + vec3(0.55, 0.7, 1.0) * canto * 0.12;

  // Punto 4: alfa premultiplicado.
  gl_FragColor = vec4(min(col, vec3(1.0)) * forma, forma);
}
`

export default function PinturaMetal({
  texto,
  distorsion = 1,
  brillo = 1,
  dispersion = 1,
  velocidad = 1,
  gain = 1,
  className = '',
  style,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const pantalla = useRef(null)
  const luz = useRef({ x: 0.35, y: 0.3, tx: 0.35, ty: 0.3 })
  const par = useRef({})
  par.current = { distorsion, brillo, dispersion, velocidad, g }
  const [caja, visible] = useCaja(raiz)
  const [fallo, setFallo] = useState(false)
  const [reinicio, setReinicio] = useState(0)
  const [fuentes, setFuentes] = useState(false)

  useEffect(() => {
    document.fonts?.ready.then(() => setFuentes(true))
  }, [])

  useEffect(() => {
    if (!raiz.current || !caja.w || !caja.h) return
    // Un lienzo nuevo por programa: ver el aviso de `gl.js` sobre los contextos soltados.
    const cv = document.createElement('canvas')
    cv.className = 'pm-lienzo'
    cv.setAttribute('aria-hidden', 'true')
    // Un poco menos de densidad que el resto: el relieve cuesta 45 muestras por píxel.
    const dpr = Math.min(caja.dpr, 1.5)
    cv.width = Math.round(caja.w * dpr)
    cv.height = Math.round(caja.h * dpr)

    // Punto 1: el texto, dibujado en blanco sobre transparente, es la máscara.
    const m = document.createElement('canvas')
    m.width = cv.width
    m.height = cv.height
    const c = m.getContext('2d')
    const familia = "'Inter', system-ui, sans-serif"
    c.font = `900 100px ${familia}`
    const medido = c.measureText(texto).width || 1
    const fs = Math.min((100 * m.width * 0.86) / medido, m.height * 0.72)
    c.font = `900 ${fs}px ${familia}`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillStyle = '#fff'
    c.fillText(texto, m.width / 2, m.height / 2 + fs * 0.04)

    const p = crearPantalla(cv, FRAGMENTO)
    if (!p) {
      setFallo(true)
      return
    }
    raiz.current.prepend(cv)
    lienzo.current = cv
    setFallo(false)
    // Los mipmaps de WebGL 1 piden potencias de dos: la máscara se estira a 2048 x 1024, y el
    // shader la lee con coordenadas de 0 a 1, así que el estiramiento no se nota.
    const pot = document.createElement('canvas')
    pot.width = 2048
    pot.height = 1024
    pot.getContext('2d').drawImage(m, 0, 0, pot.width, pot.height)
    p.textura('uMascara', pot, 0, true)
    pantalla.current = p
    const perdido = (e) => { e.preventDefault(); setFallo(true) }
    const vuelto = () => setReinicio((n) => n + 1)
    cv.addEventListener('webglcontextlost', perdido)
    cv.addEventListener('webglcontextrestored', vuelto)
    return () => {
      cv.removeEventListener('webglcontextlost', perdido)
      cv.removeEventListener('webglcontextrestored', vuelto)
      pantalla.current = null
      lienzo.current = null
      p.liberar()
      cv.remove()
    }
  }, [caja, texto, fuentes, reinicio])

  const pintar = (t) => {
    const p = pantalla.current
    if (!p) return
    const a = par.current
    const l = luz.current
    l.x += (l.tx - l.x) * 0.08 * Math.max(a.g, 0.2)
    l.y += (l.ty - l.y) * 0.08 * Math.max(a.g, 0.2)
    p.poner({
      uRes: [lienzo.current.width, lienzo.current.height],
      uT: t,
      uLuz: [l.x, 1 - l.y],
      uDistor: a.distorsion,
      uBrillo: a.brillo,
      uDisp: a.dispersion,
    })
    p.dibujar()
  }

  useEffect(() => {
    if (fallo || !caja.w) return
    if (g === 0 || !visible) {
      pintar(0)
      return
    }
    let id = 0
    const bucle = (ms) => {
      pintar((ms / 1000) * par.current.velocidad * par.current.g)
      id = requestAnimationFrame(bucle)
    }
    id = requestAnimationFrame(bucle)
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallo, caja, visible, g, reinicio, fuentes, texto])

  const alMover = (e) => {
    if (e.pointerType !== 'mouse' || g === 0) return
    const r = raiz.current.getBoundingClientRect()
    luz.current.tx = (e.clientX - r.left) / r.width
    luz.current.ty = (e.clientY - r.top) / r.height
  }

  return (
    <div
      ref={raiz}
      className={`pm${fallo ? ' pm--fallo' : ''} ${className}`.trim()}
      role="img"
      aria-label={texto}
      onPointerMove={alMover}
      style={style}
    >
      {/* El lienzo lo crea el efecto y lo pone aquí delante; ver más arriba. */}
      {/* Sin WebGL, el texto de siempre. */}
      {fallo && <span className="pm-alternativa" aria-hidden="true">{texto}</span>}
    </div>
  )
}
