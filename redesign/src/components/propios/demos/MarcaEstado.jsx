import { useEffect, useState } from 'react'
import MarcaEstado from '../MarcaEstado'
import './demos.css'

// Los pasos son los que hace de verdad la publicación de este sitio (instalar,
// compilar, cocinar el HTML de cada dirección, comprobar enlaces, publicar): una
// lista de «Tarea 1, Tarea 2» no enseña cómo se lee la marca junto a frases reales.
const PASOS = {
  es: ['Instalar dependencias', 'Compilar el sitio', 'Cocinar el HTML de cada ruta', 'Comprobar los enlaces', 'Publicar'],
  en: ['Install dependencies', 'Build the site', 'Cook the HTML of every route', 'Check the links', 'Publish'],
}

// El cuarto paso es el que falla cuando se pide, y el tercero no tiene porcentaje:
// así salen los cinco estados y las dos formas de «en curso» en la misma lista.
const PASO_QUE_FALLA = 3
const PASO_SIN_PORCENTAJE = 2
const TIC = 140

const inicial = (n) => Array.from({ length: n }, (_, i) => (i === 0 ? { estado: 'curso', progreso: 0 } : { estado: 'pendiente' }))

export default function DemoMarcaEstado({ values, compact, lang }) {
  const pasos = PASOS[lang] ?? PASOS.es
  const [estados, setEstados] = useState(() => inicial(pasos.length))

  // Una simulación que corre sola y vuelve a empezar: la marca se ve en todos sus
  // estados sin que nadie tenga que pulsar nada.
  useEffect(() => {
    const n = pasos.length
    let est = inicial(n)
    const m = { i: 0, p: 0, espera: 0, fin: false }
    setEstados(est)
    const id = setInterval(() => {
      est = [...est]
      if (m.fin) {
        if (--m.espera > 0) return
        est = inicial(n)
        Object.assign(m, { i: 0, p: 0, fin: false })
      } else {
        m.p += 0.11
        if (m.p < 1) {
          est[m.i] = m.i === PASO_SIN_PORCENTAJE ? { estado: 'curso' } : { estado: 'curso', progreso: m.p }
        } else if (values.fallar && m.i === PASO_QUE_FALLA) {
          est[m.i] = { estado: 'fallo' }
          for (let k = m.i + 1; k < n; k++) est[k] = { estado: 'cancelado' }
          Object.assign(m, { fin: true, espera: 18 })
        } else {
          est[m.i] = { estado: 'hecho' }
          m.i++
          m.p = 0
          if (m.i >= n) Object.assign(m, { fin: true, espera: 18 })
          else est[m.i] = { estado: 'curso', progreso: 0 }
        }
      }
      setEstados(est)
    }, TIC)
    return () => clearInterval(id)
  }, [pasos.length, values.fallar])

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <ul className="pd-lista" aria-label={lang === 'en' ? 'Deployment steps' : 'Pasos del despliegue'}>
        {pasos.map((nombre, i) => (
          <li key={nombre}>
            <MarcaEstado
              etiqueta={nombre}
              estado={estados[i]?.estado ?? 'pendiente'}
              progreso={estados[i]?.progreso}
              tachado={values.tachado}
              tamano={compact ? Math.min(values.tamano, 18) : values.tamano}
              idioma={lang}
              gain={values.gain}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
