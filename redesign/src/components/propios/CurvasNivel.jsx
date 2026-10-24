import { useEffect, useRef, useState } from 'react'
import { useGain } from './movimiento'
import { useCaja } from './lienzo'
import { crearPantalla, colorAVec3 } from './gl'
import './CurvasNivel.css'

// Un fondo de curvas de nivel, como un mapa topográfico que respira. Código PROPIO,
// escrito desde cero: el shader entero, ruido incluido, es de aquí.
//
// Un terreno inventado (ruido fractal que se desplaza muy despacio) dibujado solo con sus
// líneas de altura: una fina cada cierto desnivel y una más gruesa cada cinco, como en un
// mapa de senderismo. Bajo el puntero el terreno se alza como una colina y las curvas se
// cierran a su alrededor.
//
// El shader, y lo que cuesta acertar:
//
//   1. Una curva de nivel es donde la altura vale un múltiplo exacto del desnivel. Para
//      dibujarla con un grosor constante en PÍXELES (y no en unidades del terreno, que
//      darían líneas gruesas en las laderas suaves y finísimas en las abruptas), se mide
//      cuánto cambia la altura de un píxel al siguiente (la pendiente) y se ancha la línea
//      en esa proporción. Es lo que normalmente hace `fwidth`.
//   2. No se usa `fwidth` porque en WebGL 1 es una extensión. En su lugar, la altura se
//      calcula tres veces (aquí, un píxel a la derecha y un píxel arriba) y la pendiente
//      sale de la diferencia. Cuesta el triple y a este tamaño no se nota.
//   3. Una de cada cinco líneas va más gruesa (las «maestras» de un mapa), lo que da lectura
//      al conjunto: sin ellas son líneas todas iguales, y con ellas se ve el relieve.
//   4. El color de fondo sube un poco con la altura, para que los valles y las cumbres se
//      distingan aunque no se vean las líneas.
//   5. El bucle para fuera de pantalla, y con el dial a cero se pinta un fotograma. Si el
//      navegador no tiene WebGL, queda un degradado fijo, no un recuadro vacío.
//
// El dial (`gain`) multiplica la velocidad con que se desplaza el terreno.

const FRAGMENTO = `
uniform vec2 uRes;
uniform float uT;
uniform vec2 uPtr;
uniform float uHay;
uniform float uNiveles;
uniform float uEscala;
uniform float uGrosor;
uniform float uRelieve;
uniform vec3 uColor;
uniform vec3 uFondo;

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
  for (int i = 0; i < 5; i++) {
    v += a * ruido(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

float altura(vec2 p) {
  float h = fbm(p * uEscala + vec2(uT * 0.03, uT * 0.02));
  float d = distance(p, uPtr);
  return h + uHay * uRelieve * exp(-d * d * 8.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y);
  float px = 1.0 / uRes.y;

  float h = altura(p);
  float hx = altura(p + vec2(px, 0.0));
  float hy = altura(p + vec2(0.0, px));
  // Cuánto cambia la altura en un píxel, en unidades de desnivel: es el ancho de un píxel
  // medido en «niveles», y por eso sirve para dar el mismo grosor a todas las líneas.
  float pendiente = max(length(vec2(hx - h, hy - h)) * uNiveles, 0.0005);

  float f = h * uNiveles;
  float dist = abs(fract(f - 0.5) - 0.5);
  float nivel = floor(f + 0.5);
  float maestra = step(mod(nivel, 5.0), 0.5);
  float mitad = 0.5 * uGrosor * (1.0 + 0.9 * maestra) * pendiente;
  float linea = 1.0 - smoothstep(mitad, mitad + pendiente, dist);

  vec3 base = mix(uFondo, uColor * 0.16, smoothstep(0.25, 0.85, h));
  vec3 col = mix(base, uColor, linea * (0.5 + 0.5 * maestra));

  float vineta = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.4);
  gl_FragColor = vec4(col * (0.55 + 0.45 * vineta), 1.0);
}
`

export default function CurvasNivel({
  niveles = 18,
  escala = 2.2,
  grosor = 1.3,
  relieve = 0.5,
  velocidad = 1,
  color = '#60a5fa',
  fondo = '#0e0f11',
  gain = 1,
  className = '',
  style,
  children,
}) {
  const g = useGain(gain)
  const raiz = useRef(null)
  const lienzo = useRef(null)
  const pantalla = useRef(null)
  const puntero = useRef({ x: 0, y: 0, tx: 0, ty: 0, hay: 0, objetivo: 0 })
  // Los parámetros viajan por una ref: mover un deslizador no debe rehacer el programa de la
  // tarjeta gráfica, solo cambiar lo que el bucle le manda en el siguiente fotograma.
  const par = useRef({})
  par.current = { niveles, escala, grosor, relieve, velocidad, color, fondo, g }
  const [caja, visible] = useCaja(raiz)
  const [fallo, setFallo] = useState(false)
  const [reinicio, setReinicio] = useState(0)

  // El programa y el tamaño del lienzo: solo se rehacen si cambia la caja.
  useEffect(() => {
    if (!raiz.current || !caja.w || !caja.h) return
    // Un lienzo nuevo por programa: ver el aviso de `gl.js` sobre los contextos soltados.
    const cv = document.createElement('canvas')
    cv.className = 'cn-lienzo'
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
    const pt = puntero.current
    // El puntero llega con suavidad, y el relieve entra y sale en vez de aparecer de golpe.
    pt.x += (pt.tx - pt.x) * 0.15
    pt.y += (pt.ty - pt.y) * 0.15
    pt.hay += (pt.objetivo - pt.hay) * 0.08
    p.poner({
      uRes: [lienzo.current.width, lienzo.current.height],
      uT: t,
      uPtr: [pt.x * (caja.w / caja.h), 1 - pt.y],
      uHay: pt.hay,
      uNiveles: a.niveles,
      uEscala: a.escala,
      uGrosor: a.grosor * caja.dpr,
      uRelieve: a.relieve,
      uColor: colorAVec3(a.color),
      uFondo: colorAVec3(a.fondo),
    })
    p.dibujar()
  }

  // Punto 5: el bucle solo corre si se ve, y con el dial a cero hay un fotograma.
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
    const pt = puntero.current
    pt.tx = (e.clientX - r.left) / r.width
    pt.ty = (e.clientY - r.top) / r.height
    if (!pt.objetivo) { pt.x = pt.tx; pt.y = pt.ty }
    pt.objetivo = 1
  }

  return (
    <div
      ref={raiz}
      className={`cn${fallo ? ' cn--fallo' : ''} ${className}`.trim()}
      onPointerMove={alMover}
      onPointerLeave={() => { puntero.current.objetivo = 0 }}
      style={style}
    >
      {/* El lienzo lo crea el efecto y lo pone aquí delante; ver más arriba. */}
      <div className="cn-contenido">{children}</div>
    </div>
  )
}
