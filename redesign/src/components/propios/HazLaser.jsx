import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import { crearPantalla, colorAVec3 } from './gl'
import './HazLaser.css'

// Un haz de luz que cae sobre una superficie, con niebla, vetas y polvo. Código PROPIO,
// escrito desde cero: el shader entero es de aquí.
//
// Un rayo que baja desde arriba y aterriza en un punto, con un núcleo blanco, un halo que
// lo envuelve, una niebla que se arremolina a su alrededor, vetas finas dentro del haz,
// motas de polvo que lo cruzan y un destello donde toca la superficie. Si el puntero está
// encima, el haz apunta al puntero; si no, se balancea despacio.
//
// Cómo está montado, y el aviso:
//
//   1. El haz no es una imagen: es una DISTANCIA. Para cada píxel se calcula cuánto cae
//      perpendicular a la línea que une el origen con el punto de impacto, y cuánto avanza a
//      lo largo de ella. De la perpendicular sale el núcleo, el halo y la niebla (curvas
//      gaussianas de distinta anchura); de lo que avanza, el desvanecimiento por arriba y
//      el corte en el suelo. Con esas dos coordenadas, el haz puede apuntar a cualquier sitio.
//   2. Las vetas y el polvo viven en esas mismas coordenadas (a lo largo y a lo ancho del haz),
//      no en las de la pantalla: por eso viajan con el haz y no se quedan quietas cuando él se
//      mueve. El polvo es una rejilla de celdas con una mota en algunas de ellas, que se
//      desplaza y parpadea.
//   3. La salida es transparente: el alfa es la luz más fuerte de cada píxel, y el color ya va
//      multiplicado por ella (alfa premultiplicado). El haz se suma a lo que haya detrás
//      sin ensuciar el fondo con un cuadrado negro. Y la luz se corta en la superficie, que
//      es horizontal, y no donde acaba la línea del haz: inclinado, ese corte quedaría en diagonal.
//   4. Un láser de adorno en cada portada es justo lo que hoy se lee como «hecho por una IA»:
//      tiene sentido cuando apunta a algo que importa. Por eso el punto de impacto es de
//      quien la use (`apuntar`), y el contenido va encima, no al lado.
//   5. El bucle para fuera de pantalla, el dial a cero deja un fotograma, y sin WebGL
//      queda un degradado vertical fijo.
//
// El dial (`gain`) multiplica la velocidad del flujo, el balanceo y el parpadeo.

const FRAGMENTO = `
uniform vec2 uRes;
uniform float uT;
uniform vec2 uImpacto;
uniform float uInt;
uniform float uAncho;
uniform float uNiebla;
uniform float uSemilla;
uniform vec3 uColor;

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
    p = p * 2.07 + vec2(11.7, 5.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  float asp = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * asp, uv.y);

  // El haz: del origen (arriba, fuera de la caja) al punto de impacto.
  vec2 A = vec2(uImpacto.x * 0.6 + asp * 0.2, 1.2);
  vec2 B = uImpacto;
  vec2 dir = normalize(B - A);
  vec2 q = p - A;
  float s = dot(q, dir);
  float ancho = cross(vec3(dir, 0.0), vec3(q, 0.0)).z;
  float e = abs(ancho);

  float w = uAncho * 0.045;
  // Un pulso lento a lo largo del haz y un parpadeo fino, para que no parezca una barra.
  float pulso = 1.0 + 0.16 * sin(s * 22.0 - uT * 6.0 + uSemilla * 7.0) + 0.1 * (ruido(vec2(s * 9.0 - uT * 3.0, uSemilla)) - 0.5);

  // Punto 1: núcleo, halo y niebla son tres gaussianas de la distancia perpendicular.
  float nucleo = exp(-(e * e) / (w * w * 0.35 * pulso));
  float halo = exp(-(e * e) / (w * w * 14.0));
  float aire = exp(-(e * e) / (w * w * 70.0));

  // Arriba, el haz entra poco a poco; abajo, lo corta la SUPERFICIE (una línea horizontal por
  // el punto de impacto) y no el final del haz, que inclinado dejaría un corte en diagonal.
  float arriba = smoothstep(0.0, 0.25, s);
  float suelo = smoothstep(B.y - 0.01, B.y + 0.045, p.y);

  // Punto 2: la niebla y las vetas, en las coordenadas del haz.
  vec2 flujo = vec2(s * 2.6 - uT * 0.5, ancho * 9.0 + uSemilla * 13.0);
  float nube = fbm(flujo + vec2(0.0, uT * 0.12));
  float niebla = aire * (0.25 + nube * 1.1) * uNiebla;
  float veta = pow(ruido(vec2(s * 1.6 - uT * 0.9, ancho * 70.0 + uSemilla * 5.0)), 4.0) * halo * 1.4;

  // El polvo: una rejilla de celdas, con una mota en algunas, que deriva y parpadea.
  float polvo = 0.0;
  for (int k = 0; k < 2; k++) {
    float esc = k == 0 ? 17.0 : 29.0;
    vec2 g = vec2(s * esc * 0.8 + uT * (0.35 + float(k) * 0.2), ancho * esc * 1.9 + uSemilla * 3.0 * float(k + 1));
    vec2 c = floor(g);
    float r = hash(c + float(k) * 7.3);
    vec2 f = fract(g) - 0.5 - 0.3 * (vec2(hash(c * 1.7), hash(c * 2.3)) - 0.5);
    float mota = smoothstep(0.1, 0.0, length(f)) * step(0.84, r) * (0.55 + 0.45 * sin(uT * 3.0 + r * 40.0));
    polvo += mota * exp(-(e * e) / (w * w * 40.0));
  }

  // El destello donde toca la superficie, y la propia superficie como una línea tenue.
  vec2 d = (p - B) * vec2(1.0, 3.6);
  float impacto = exp(-dot(d, d) / (w * w * 28.0)) * 1.1
                + exp(-((p.y - B.y) * (p.y - B.y)) / (w * w * 0.9)) * exp(-((p.x - B.x) * (p.x - B.x)) / (w * w * 110.0)) * 0.7;
  float linea = exp(-pow((p.y - B.y) * uRes.y / 1.6, 2.0)) * 0.1;

  float luz = (nucleo * 1.3 + halo * 0.55 + niebla + veta + polvo * 1.4) * arriba * suelo + impacto + linea * smoothstep(0.0, 0.2, 1.0 - abs(p.x - B.x) / asp * 1.4);
  vec3 col = uColor * luz * uInt;
  col += vec3(1.0) * pow(nucleo * arriba * suelo, 3.0) * 0.55 * uInt;

  // Punto 3: alfa premultiplicado, la luz más fuerte de cada píxel.
  float alfa = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  gl_FragColor = vec4(min(col, vec3(alfa)), alfa);
}
`

export default function HazLaser({
  color = '#22d3ee',
  intensidad = 1,
  ancho = 1,
  niebla = 1,
  semilla = 1,
  velocidad = 1,
  seguirPuntero = true,
  gain = 1,
  className = '',
  style,
  children,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const pantalla = useRef(null)
  const mira = useRef({ x: 0.5, y: 0.3, tx: 0.5, ty: 0.3, hay: false })
  const par = useRef({})
  par.current = { color, intensidad, ancho, niebla, semilla, velocidad, g, seguirPuntero }
  const [caja, visible] = useCaja(raiz)
  const [fallo, setFallo] = useState(false)
  const [reinicio, setReinicio] = useState(0)

  useEffect(() => {
    if (!raiz.current || !caja.w || !caja.h) return
    // Un lienzo nuevo por programa: ver el aviso de `gl.js` sobre los contextos soltados.
    const cv = document.createElement('canvas')
    cv.className = 'hl-lienzo'
    cv.setAttribute('aria-hidden', 'true')
    cv.width = Math.round(caja.w * caja.dpr)
    cv.height = Math.round(caja.h * caja.dpr)
    const p = crearPantalla(cv, FRAGMENTO)
    if (!p) {
      setFallo(true)
      return
    }
    raiz.current.prepend(cv)
    lienzo.current = cv
    setFallo(false)
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
  }, [caja, reinicio])

  const pintar = (t) => {
    const p = pantalla.current
    if (!p) return
    const a = par.current
    const m = mira.current
    // Con el puntero encima, el impacto va hacia él; si no, el haz se balancea despacio.
    const balanceo = Math.sin(t * 0.45) * 0.07
    const objX = a.seguirPuntero && m.hay ? m.tx : 0.5 + balanceo
    const objY = a.seguirPuntero && m.hay ? Math.min(Math.max(m.ty, 0.35), 0.85) : 0.72
    m.x += (objX - m.x) * 0.1
    m.y += (objY - m.y) * 0.1
    p.poner({
      uRes: [lienzo.current.width, lienzo.current.height],
      uT: t,
      uImpacto: [m.x * (caja.w / caja.h), 1 - m.y],
      uInt: a.intensidad,
      uAncho: a.ancho,
      uNiebla: a.niebla,
      uSemilla: a.semilla,
      uColor: colorAVec3(a.color),
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
  }, [fallo, caja, visible, g, reinicio])

  const alMover = (e) => {
    if (e.pointerType !== 'mouse' || g === 0) return
    const r = raiz.current.getBoundingClientRect()
    const m = mira.current
    m.tx = (e.clientX - r.left) / r.width
    m.ty = (e.clientY - r.top) / r.height
    if (!m.hay) { m.x = m.tx; m.y = m.ty }
    m.hay = true
  }

  return (
    <div
      ref={raiz}
      className={`hl${fallo ? ' hl--fallo' : ''} ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={() => { mira.current.hay = false }}
      style={style}
    >
      {/* El lienzo lo crea el efecto y lo pone aquí delante; ver más arriba. */}
      <div className="hl-contenido">{children}</div>
    </div>
  )
}
