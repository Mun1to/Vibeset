import { ArrowUpRight, Languages } from 'lucide-react'

// El pie vivía dentro de la portada, así que en las seis vistas de catálogo no
// existía: quien llega por un buscador a una ficha suelta, la lee y se va, no
// veía en ningún momento que esto tiene el código a la vista, que se puede
// auditar y que acepta aportaciones. Ahora va en la plantilla, debajo de todo, y
// lleva enlaces, que es lo que un pie hace.
const REPO = 'https://github.com/Mun1to/Vibeset'

const ENLACES = [
  { clave: 'pieCodigo', url: REPO },
  // Al elegir plantilla, no al documento: el documento explica cómo se aporta,
  // y lo que hace falta es un sitio donde aportar.
  { clave: 'pieAportar', url: `${REPO}/issues/new/choose` },
  { clave: 'pieLicencia', url: `${REPO}/blob/main/LICENSING.md` },
  { clave: 'pieAuditar', url: `${REPO}/blob/main/AI-AUDIT.md` },
]

export default function Pie({ t, totals, lang, onToggleLang }) {
  return (
    <footer className="border-t border-linea px-6 sm:px-10 py-8 mt-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-mono text-[12px] text-tinta-suave">
          {t.stats({ langs: totals.langs, res: totals.res, concepts: totals.concepts, skills: totals.skills })}
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label={t.pieTitulo}>
          {ENLACES.map(({ clave, url }) => (
            <a
              key={clave}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="pulsable inline-flex items-center gap-1 min-h-6 text-xs font-medium text-tinta-suave hover:text-tinta transition-colors"
            >
              {t[clave]}
              <ArrowUpRight size={12} />
            </a>
          ))}

          {/* El idioma vive aquí y no en la barra: es un control que la mayoría
              no toca nunca y no se gana la primera fila. Pero sigue estando, y a
              la vista: quien
              lee en un idioma distinto al de su navegador (un español fuera de
              España, alguien que prefiere los términos técnicos en inglés) se
              quedaría atrapado si esto no existiera en ningún sitio.

              Y llega: las listas largas se paginan justamente para que el pie se
              alcance, así que aquí no se esconde nada. */}
          <button
            onClick={onToggleLang}
            aria-label={t.ariaLang}
            className="pulsable inline-flex items-center gap-1.5 min-h-6 font-mono text-xs font-bold text-tinta-suave hover:text-tinta transition-colors cursor-pointer"
          >
            <Languages size={12} />
            {lang === 'es' ? 'ES / EN' : 'EN / ES'}
          </button>
        </nav>
      </div>
    </footer>
  )
}
