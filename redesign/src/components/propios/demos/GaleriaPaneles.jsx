import GaleriaPaneles from '../GaleriaPaneles'
import { TOTALES } from '../../../lib/totales'
import { rutaDe } from '../../../lib/rutas'
import './demos.css'

// Los paneles son las seis secciones de este sitio, con cuántas fichas tiene cada una y
// un enlace a ella. Sin fotos a propósito: la pieza no pide imágenes a nadie, y así se
// ve cómo queda una galería que no las lleva, que es el caso más probable al empezar.
const TEXTO = {
  es: {
    rotulo: 'Secciones de Vibeset',
    entrar: 'Entrar',
    ficha: (n) => `${n} fichas`,
  },
  en: {
    rotulo: 'Vibeset sections',
    entrar: 'Open',
    ficha: (n) => `${n} entries`,
  },
}

const SECCIONES = [
  ['languages', 'langs'],
  ['resources', 'res'],
  ['concepts', 'concepts'],
  ['components', 'comps'],
  ['skills', 'skills'],
  ['consejos', 'consejos'],
]

export default function DemoGaleriaPaneles({ values, compact, lang, t }) {
  const tx = TEXTO[lang] ?? TEXTO.es

  const paneles = SECCIONES.map(([seccion, total], i) => ({
    id: seccion,
    numero: String(i + 1).padStart(2, '0'),
    etiqueta: t.nav[seccion],
    detalle: tx.ficha(TOTALES[total]),
    // En la tarjeta de la rejilla no hay enlaces: la tarjeta entera ya abre la ficha.
    href: compact ? undefined : rutaDe(seccion, undefined, lang),
    enlace: tx.entrar,
  }))

  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila" style={{ alignItems: 'stretch' }}>
        <GaleriaPaneles {...values} paneles={paneles} rotulo={tx.rotulo} alto={compact ? 11 : values.alto} />
      </div>
    </div>
  )
}
