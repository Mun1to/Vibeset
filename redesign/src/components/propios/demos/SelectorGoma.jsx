import { useMemo, useState } from 'react'
import SelectorGoma from '../SelectorGoma'
import { COMPONENT_ITEMS } from '../../../data/components'
import './demos.css'

// Las tres opciones son las tres CLASES de ficha que hay en Componentes (piezas, recetas
// y fichas de análisis) y debajo se dice cuántas hay de la elegida, contadas del
// catálogo. Un selector de «Opción 1, Opción 2, Opción 3» no enseña cómo se comporta con
// etiquetas de longitud desigual, que es justo lo que le cuesta a un control segmentado.
const TEXTO = {
  es: {
    rotulo: 'Clase de ficha',
    pieza: 'Piezas',
    receta: 'Recetas',
    referencia: 'Análisis',
    cuenta: (n, c) => `${n} ${n === 1 ? 'ficha' : 'fichas'} de «${c}».`,
    nota: 'Agárrala y arrástrala, o cámbiala con las flechas.',
  },
  en: {
    rotulo: 'Entry type',
    pieza: 'Pieces',
    receta: 'Recipes',
    referencia: 'Analysis',
    cuenta: (n, c) => `${n} ${n === 1 ? 'entry' : 'entries'} of "${c}".`,
    nota: 'Grab it and drag it, or change it with the arrow keys.',
  },
}

export default function DemoSelectorGoma({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const [clase, setClase] = useState('pieza')

  const opciones = useMemo(() => ['pieza', 'receta', 'referencia'].map((v) => ({ valor: v, etiqueta: tx[v] })), [tx])
  // Las doce piezas de canvasui y arlan no llevan `clase`: sin ella, son piezas.
  const cuantas = COMPONENT_ITEMS.filter((c) => (c.clase ?? 'pieza') === clase).length

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <SelectorGoma {...values} opciones={opciones} valor={clase} onCambio={setClase} rotulo={tx.rotulo} />
        {!compact && <p className="pd-nota">{tx.cuenta(cuantas, tx[clase])}</p>}
        {!compact && <p className="pd-nota">{tx.nota}</p>}
      </div>
    </div>
  )
}
