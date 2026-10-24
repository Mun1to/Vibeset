import { useMemo, useState } from 'react'
import MenuRamas from '../MenuRamas'
import { vistazoDe } from '../../../lib/vistazo'
import './demos.css'

// El árbol es el de este mismo sitio: las secciones con sus grupos y cuántas fichas
// hay en cada uno, sacados del catálogo, no escritos a mano. Así se ve la pieza con
// nombres de longitud desigual y con un número a la derecha, que es como se usa.
const SECCIONES = ['components', 'skills', 'consejos']

const TEXTO = {
  es: { rotulo: 'Secciones del sitio', elegido: (n) => `Has elegido: ${n}`, ninguno: 'Abre un grupo y elige una opción.' },
  en: { rotulo: 'Site sections', elegido: (n) => `You picked: ${n}`, ninguno: 'Open a group and pick an option.' },
}

export default function DemoMenuRamas({ values, compact, lang, t }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  const [elegido, setElegido] = useState('')

  const items = useMemo(
    () =>
      SECCIONES.map((s) => ({
        id: s,
        etiqueta: t.nav[s],
        hijos: vistazoDe(s, lang).map((g) => ({ id: `${s}:${g.clave}`, etiqueta: g.etiqueta, cuenta: g.cuenta })),
      })),
    [lang, t],
  )

  // En la tarjeta de la rejilla (224 px de alto) solo cabe un grupo con cuatro opciones.
  const visibles = compact ? [{ ...items[0], hijos: items[0].hijos.slice(0, 4) }] : items
  const nombre = elegido
    ? items.flatMap((s) => s.hijos.map((h) => ({ ...h, seccion: s.etiqueta }))).find((h) => h.id === elegido)
    : null

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila">
        <MenuRamas
          {...values}
          key={`${lang}-${values.unoSolo}`}
          items={visibles}
          abiertosInicial={[SECCIONES[0]]}
          rotulo={tx.rotulo}
          onElegir={setElegido}
        />
        {!compact && (
          <p className="pd-nota">{nombre ? tx.elegido(`${nombre.seccion} / ${nombre.etiqueta}`) : tx.ninguno}</p>
        )}
      </div>
    </div>
  )
}
