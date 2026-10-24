// Lo mínimo para pintar un shader de fragmento a pantalla completa. Código PROPIO, escrito
// desde cero y sin ninguna librería de gráficos detrás: unas sesenta líneas de WebGL 1.
//
// Las piezas de shader (curvas de nivel, haz de luz, metal líquido) solo necesitan un
// rectángulo que cubra el lienzo y un programa que decida el color de cada píxel; todo lo
// demás (geometría, cámara, escena) sobra. Un triángulo gigante que cubre la pantalla es
// la forma más barata de conseguirlo, sin el borde diagonal de dos triángulos.
//
// WebGL 1 y no 2 a propósito: lo entiende cualquier navegador que entienda WebGL, y estos
// shaders no necesitan nada de lo que añadió la 2. Por la misma razón no se usan derivadas
// (`fwidth`): en WebGL 1 son una extensión, y los shaders calculan lo que necesitan.
//
// Devuelve `null` si el navegador no puede (sin WebGL, o un shader que no compila), y
// quien lo llama enseña entonces su alternativa estática en vez de un cuadro vacío.
//
// Una trampa que costó una tarde: `liberar()` suelta el contexto de verdad, y un `<canvas>`
// al que se le ha soltado el contexto sigue devolviendo ese mismo contexto muerto cada vez
// que se le pide uno. Por eso quien use esto crea un `<canvas>` NUEVO por cada programa (y
// lo retira al limpiar), en vez de reutilizar el de React: si no, al cambiar el tamaño de
// la caja o llegar la tipografía, el segundo intento falla sin decir nada útil.

const VERTICE = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }'

function compilar(gl, tipo, fuente) {
  const s = gl.createShader(tipo)
  gl.shaderSource(s, fuente)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('Shader sin compilar:', gl.getShaderInfoLog(s))
    return null
  }
  return s
}

export function crearPantalla(lienzo, fuenteFragmento) {
  const gl = lienzo.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true })
  if (!gl) return null
  const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE)
  const fs = compilar(gl, gl.FRAGMENT_SHADER, `precision highp float;\n${fuenteFragmento}`)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('Programa sin enlazar:', gl.getProgramInfoLog(prog))
    return null
  }
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const ubicaciones = {}
  const donde = (nombre) => (ubicaciones[nombre] ??= gl.getUniformLocation(prog, nombre))
  const texturas = []

  return {
    gl,
    // Un número es un float; una lista de 2 a 4, un vec2/vec3/vec4.
    poner(valores) {
      for (const [nombre, v] of Object.entries(valores)) {
        const u = donde(nombre)
        if (u === null) continue
        if (typeof v === 'number') gl.uniform1f(u, v)
        else if (v.length === 2) gl.uniform2f(u, v[0], v[1])
        else if (v.length === 3) gl.uniform3f(u, v[0], v[1], v[2])
        else if (v.length === 4) gl.uniform4f(u, v[0], v[1], v[2], v[3])
      }
    },
    // Sube una imagen (o un lienzo) como textura y la deja en la unidad `unidad`. Con
    // `mipmaps`, el shader puede pedir versiones cada vez más desenfocadas de la imagen con
    // un solo `texture2D(…, sesgo)`: es el desenfoque más barato que hay. En WebGL 1 los
    // mipmaps exigen que el ancho y el alto sean potencias de dos (1024, 2048…).
    textura(nombre, imagen, unidad = 0, mipmaps = false) {
      const t = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + unidad)
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagen)
      if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.uniform1i(donde(nombre), unidad)
      texturas.push(t)
    },
    dibujar() {
      gl.viewport(0, 0, lienzo.width, lienzo.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    // Suelta lo que ocupa en la tarjeta gráfica: un navegador solo admite unos cuantos
    // contextos a la vez, y un lienzo que se desmonta sin soltarlo se come uno.
    liberar() {
      texturas.forEach((t) => gl.deleteTexture(t))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}

// «#rrggbb» a tres números de 0 a 1, que es lo que pide un `vec3`.
export function colorAVec3(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}
