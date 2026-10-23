import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import CodeBlock from './CodeBlock'
import FavButton from './FavButton'
import CopiarEnlace from './CopiarEnlace'
import { authorOf, hasOwnRepo, MERCADO, repoLabel, repoOf, skillFile, skillPath, skillTree, slugOf } from '../data/skills'
import { rutaDe } from '../lib/rutas'

const DOCS = 'https://code.claude.com/docs/en/skills'

// Qué hace cada campo del frontmatter que aparece en estas skills. Tomado de la
// referencia oficial, resumido en una línea.
const CAMPOS = {
  name: {
    es: 'Nombre con el que se lista la skill. Por defecto, el de la carpeta.',
    en: 'Name the skill is listed under. Defaults to the folder name.',
  },
  description: {
    es: 'Qué hace y cuándo usarla. Es lo único que el agente lee para decidir si la carga.',
    en: 'What it does and when to use it. The only thing the agent reads to decide whether to load it.',
  },
  'allowed-tools': {
    es: 'Herramientas que puede usar sin pedir permiso durante ese turno.',
    en: 'Tools it may use without asking permission during that turn.',
  },
  'disallowed-tools': {
    es: 'Herramientas que se le retiran mientras la skill está activa.',
    en: 'Tools removed from its reach while the skill is active.',
  },
  'disable-model-invocation': {
    es: 'Impide que el agente la lance por su cuenta: solo se activa si la escribes tú.',
    en: 'Stops the agent from firing it on its own: it only runs when you type it.',
  },
  'argument-hint': {
    es: 'Pista de los argumentos que espera, para el autocompletado.',
    en: 'Hint about the arguments it expects, shown while autocompleting.',
  },
}

export default function SkillDetail({ t, lang, item, group, fav, onToggleFav }) {
  const d = item[lang]
  const slug = slugOf(item, lang)
  const campos = ['name', 'description', ...(item.extra || []).map(([k]) => k)]
  const autor = authorOf(item)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="px-6 sm:px-10 py-10 max-w-4xl xl:max-w-[1800px] mx-auto"
    >
      <Link
        to={rutaDe('skills', null, lang)}
        className="inline-flex items-center gap-1.5 min-h-6 px-1.5 -mx-1.5 text-sm text-tinta-suave hover:text-tinta transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t.skillBack}
      </Link>

      {/* En pantalla ancha son dos columnas: a la izquierda la skill (cabecera y el
          SKILL.md, que es lo que se lee) y a la derecha lo que se hace con ella
          (instalar, dónde vive, cómo se usa, qué significa cada campo). Debajo de
          xl los dos envoltorios desaparecen (`contents`) y las piezas se ordenan con
          `order`: cabecera, instalar, SKILL.md y el resto. Es el orden de siempre, y
          el comando de instalación sigue siendo lo primero que se puede copiar. */}
      <div className="flex flex-col xl:grid xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] xl:gap-x-14 xl:items-start">
        <div className="contents xl:block xl:min-w-0">
          <div className="order-1">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight">{d.label}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <CopiarEnlace t={t} />
                <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
              </div>
            </div>

            <div className="font-mono text-[13px] text-blue-600 dark:text-blue-400 mt-1.5">/{slug}</div>

            {/* Autoría y código: quién la escribió y dónde vive de verdad el archivo.
                Una skill aportada por otra persona trae su propio autor y su repo. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-tinta-suave">
              <span>
                {t.skillBy}{' '}
                <a
                  href={autor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center min-h-6 font-medium text-tinta-fuerte hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {autor.name}
                </a>
              </span>
              <span className="text-tinta-suave">·</span>
              <a
                href={repoOf(item)}
                target="_blank"
                rel="noreferrer"
                title={hasOwnRepo(item) ? t.skillOwnRepo : t.skillInThisRepo}
                className="inline-flex items-center gap-1 min-h-6 font-mono hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
              >
                {repoLabel(item)}
                <ArrowUpRight size={11} />
              </a>
            </div>

            <p className="text-tinta-suave mt-4 max-w-2xl leading-relaxed">{d.what}</p>
            <p className="text-sm text-tinta-suave mt-2 max-w-2xl leading-relaxed">
              <b className="text-tinta-suave">{t.skillWhen}:</b> {d.when}
            </p>
            {group && (
              <div className="font-mono text-[12px] uppercase tracking-wider text-tinta-suave mt-3">{group.label[lang]}</div>
            )}
          </div>

          <div className="order-3 mt-8">
            <CodeBlock t={t} title="SKILL.md" code={skillFile(item, lang)} />
          </div>
        </div>

        <div className="contents xl:block xl:min-w-0 xl:[&>:first-child]:mt-0">
          {/* Lo primero accionable de la página, como en cualquier galería de
              componentes: el comando que la instala, listo para copiar. */}
          {item.plugin && (
            <div className="order-2 mt-8">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-3">{t.skillInstall}</h2>
              <p className="text-sm text-tinta-suave mb-4 max-w-2xl leading-relaxed">{t.skillInstallText}</p>
              <CodeBlock
                t={t}
                title="claude code"
                code={`/plugin marketplace add ${MERCADO}\n/plugin install ${item.plugin}`}
              />
            </div>
          )}

          <div className="order-4 mt-10">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-3">{t.skillWhere}</h2>
            <p className="text-sm text-tinta-suave mb-4 max-w-2xl leading-relaxed">{t.skillWhereText}</p>
            <CodeBlock
              t={t}
              title={t.skillFolder}
              code={`${skillTree(item, lang)}\n\n${t.skillPersonal}: ${skillPath(item, 'personal', lang)}\n${t.skillProject}: ${skillPath(item, 'proyecto', lang)}`}
            />
          </div>

          <div className="order-5 mt-10">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-3">{t.skillUse}</h2>
            <p className="text-sm text-tinta-suave max-w-2xl leading-relaxed">
              {t.skillUseText(slug)}
            </p>
          </div>

          <div className="order-6 mt-10">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-3">{t.skillFields}</h2>
            <div className="flex flex-col gap-2">
              {campos.map((c) => (
                <div key={c} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-mono text-xs text-tinta-fuerte sm:w-56 shrink-0">{c}</span>
                  <span className="text-sm text-tinta-suave leading-relaxed">
                    {CAMPOS[c] ? CAMPOS[c][lang] : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* La fuente del formato, discreta, como en las fichas de componentes. */}
          <div className="order-7 mt-12 pt-5 border-t border-linea/60">
            <a
              href={DOCS}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 min-h-6 font-mono text-[12px] text-tinta-suave hover:text-tinta transition-colors break-all"
            >
              {t.skillDocs} {DOCS.replace('https://', '')}
              <ArrowUpRight size={11} />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
