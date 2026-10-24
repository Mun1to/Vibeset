import { useEffect, useState } from 'react'
import LineaPensando from '../LineaPensando'
import './demos.css'

// Los pasos son lo que hace de verdad un agente al escribir una pieza para este sitio.
// La demo repite el ciclo sola (piensa, va sumando pasos, termina, se queda un rato
// terminada y vuelve a empezar) para que se vean los dos estados sin pulsar nada.
const PASOS = {
  es: ['Leo el AGENTS.md del proyecto', 'Busco qué piezas faltan', 'Escribo la pieza desde cero', 'La pruebo en pantalla'],
  en: ['Read the project AGENTS.md', 'Look for which pieces are missing', 'Write the piece from scratch', 'Test it on screen'],
}

const CADA_PASO = 2000
const TERMINADA = 4500

export default function DemoLineaPensando({ values, compact, lang }) {
  const lista = PASOS[lang] ?? PASOS.es
  const [n, setN] = useState(1)
  const [hecho, setHecho] = useState(false)

  useEffect(() => {
    let id = 0
    let vivo = true
    const subir = (k) => {
      if (!vivo) return
      setN(k)
      if (k < lista.length) id = setTimeout(() => subir(k + 1), CADA_PASO)
      else id = setTimeout(() => { setHecho(true); id = setTimeout(reiniciar, TERMINADA) }, CADA_PASO)
    }
    const reiniciar = () => {
      if (!vivo) return
      setHecho(false)
      subir(1)
    }
    subir(1)
    return () => { vivo = false; clearTimeout(id) }
  }, [lista.length])

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <LineaPensando
          {...values}
          estado={hecho ? 'hecho' : 'pensando'}
          pasos={lista.slice(0, n).map((texto, i) => ({ id: i, texto }))}
          idioma={lang}
        />
      </div>
    </div>
  )
}
