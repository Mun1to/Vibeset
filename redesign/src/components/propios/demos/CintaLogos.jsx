import CintaLogos from '../CintaLogos'
import './demos.css'

// Lo que dice la cinta es verdad: las seis piezas con las que está hecho este sitio,
// las de su package.json y su despliegue. Es lo que pide la ficha del original para
// una franja de «hecho con»: que no se ponga lo que no es. Van como nombres con
// monograma y no con sus logotipos, que son marcas ajenas y que esta pieza no
// necesita para enseñar cómo rueda.
const PILA = [
  { nombre: 'React', marca: 'R', href: 'https://react.dev' },
  { nombre: 'Vite', marca: 'V', href: 'https://vite.dev' },
  { nombre: 'Tailwind CSS', marca: 'T', href: 'https://tailwindcss.com' },
  { nombre: 'Framer Motion', marca: 'F', href: 'https://motion.dev' },
  { nombre: 'Three.js', marca: '3', href: 'https://threejs.org' },
  { nombre: 'Cloudflare Pages', marca: 'C', href: 'https://pages.cloudflare.com' },
]

const TEXTO = {
  es: { rotulo: 'Con lo que está hecho Vibeset', nota: 'Pasa el ratón por encima, o tabula hasta un enlace: la cinta se detiene.' },
  en: { rotulo: 'What Vibeset is built with', nota: 'Hover it, or tab to a link: the ribbon stops.' },
}

export default function DemoCintaLogos({ values, compact, lang }) {
  const tx = TEXTO[lang] ?? TEXTO.es
  return (
    <div className={`pd-marco${compact ? ' pd-compacto' : ''}`}>
      <div className="pd-pila" style={{ alignItems: 'stretch' }}>
        <CintaLogos {...values} items={PILA} rotulo={tx.rotulo} idioma={lang} botonPausa={!compact && values.botonPausa} />
        {!compact && <p className="pd-nota" style={{ alignSelf: 'center' }}>{tx.nota}</p>}
      </div>
    </div>
  )
}
