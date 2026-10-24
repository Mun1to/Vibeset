import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import ComponentDemo from './ComponentDemo'
import ControlPanel from './ControlPanel'
import CodeBlock from './CodeBlock'
import FavButton from './FavButton'
import CopiarEnlace from './CopiarEnlace'
import useHtmlInCanvas from '../hooks/useHtmlInCanvas'
import { Bloque } from './ComponentRef'
import { usageSnippet, nombreDe, originalDe } from '../data/components'
import { rutaDe } from '../lib/rutas'

export default function ComponentDetail({ t, lang, item, values, onChange, onReset, fav, onToggleFav }) {
  const htmlInCanvas = useHtmlInCanvas()
  const needsHtmlInCanvas = item.labels?.includes('html-in-canvas')
  const original = originalDe(item)

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="px-6 sm:px-10 py-10 max-w-5xl xl:max-w-[1800px] mx-auto"
    >
      <Link
        to={rutaDe('components', null, lang)}
        className="inline-flex items-center gap-1.5 min-h-6 px-1.5 -mx-1.5 text-sm text-tinta-suave hover:text-tinta transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t.compBack}
      </Link>

      {/* En pantalla ancha la ficha son dos columnas: a la izquierda lo que se ve
          (título y demo, que crece con el ancho) y a la derecha lo que se toca
          (controles, uso, instalación). Debajo de xl es una sola columna, en el
          mismo orden de lectura. */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_30rem] xl:gap-x-14 xl:items-start">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight">{nombreDe(item, lang)}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <CopiarEnlace t={t} />
              <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
            </div>
          </div>

          <div className="font-mono text-[12px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-1.5">
            {item.labels.join(' · ')}
          </div>

          <p className="text-tinta-suave mt-4 max-w-2xl leading-relaxed">{item.desc[lang]}</p>

          {item.clase === 'receta' && (
            <p className="text-sm text-tinta-fuerte mt-3 max-w-2xl">{t.compReceta}</p>
          )}

          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 min-h-6 text-sm text-tinta-suave hover:text-tinta mt-3 transition-colors"
            >
              {t.compSource} {new URL(item.url).hostname}
              <ArrowUpRight size={13} />
            </a>
          ) : (
            <div className="text-sm text-tinta-suave mt-3">{t.compOwn}</div>
          )}

          <div className="relative h-[420px] min-[1500px]:h-[540px] overflow-hidden bg-zinc-950 border border-linea mt-8">
            <ComponentDemo item={item} values={values} lang={lang} t={t} />
          </div>
          {needsHtmlInCanvas && !htmlInCanvas && (
            <p className="text-xs text-tinta-suave mt-2.5 leading-relaxed max-w-2xl">{t.compHicWarn}</p>
          )}
        </div>

        <div className="min-w-0 mt-6 xl:mt-0 flex flex-col gap-4">
          <div className="border border-linea px-4 py-3 bg-panel/50">
            <ControlPanel
              t={t} lang={lang} controls={item.controls} values={values}
              onChange={onChange} onReset={onReset}
            />
          </div>

          <div className="flex flex-col gap-4 mt-6 xl:mt-2">
            <CodeBlock t={t} title={t.compUsage} code={usageSnippet(item, values)} />
            {item.install && <CodeBlock t={t} title={t.compInstall} code={item.install} />}
            {item.deps?.length > 0 && (
              <div className="text-sm text-tinta-suave">
                {t.compDeps} <span className="font-mono text-tinta-fuerte">{item.deps.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Si esta pieza hace algo parecido a una de React Bits, aquí va lo que vimos
          de la suya. No es un crédito (no se ha copiado nada) sino información: quien
          prefiera el original sabe qué cuesta, con qué ojo mirarlo y cómo se instala. */}
      {original && (
        <section className="mt-12 pt-6 border-t border-linea">
          <h2 className="text-xl font-bold">{t.compOriginalTitulo(original.name)}</h2>
          <p className="text-sm text-tinta-suave mt-2 max-w-2xl leading-relaxed">{t.compOriginalNota(original.name)}</p>
          <div className="mt-6 grid gap-8 min-[1400px]:grid-cols-3">
            <Bloque titulo={t.compCuando}>{original.cuando[lang]}</Bloque>
            <Bloque titulo={t.compCuidado}>{original.cuidado[lang]}</Bloque>
            <Bloque titulo={t.compA11y} nota={t.compA11yNota}>{original.a11y[lang]}</Bloque>
          </div>
          <div className="mt-6 max-w-xl">
            <CodeBlock t={t} title={t.compInstall} code={original.install} />
            <p className="text-xs text-tinta-suave mt-2.5 leading-relaxed">{t.compVariantes}</p>
            <a
              href={original.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 min-h-6 text-sm text-tinta-fuerte hover:text-blue-600 dark:hover:text-blue-400 mt-2 transition-colors"
            >
              {t.compRefVer}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
      )}

      {/* Crédito al pie: discreto, pero con el enlace exacto de donde salió. Una
          pieza de la casa no tiene autor externo al que acreditar, así que lo que
          se enlaza es su archivo, que es lo útil: el código entero, sin registro
          de por medio. */}
      {item.origin === 'propio' && item.component && (
        <div className="mt-12 pt-5 border-t border-linea/60">
          <a
            href={`https://github.com/Mun1to/Vibeset/blob/main/redesign/src/components/propios/${item.component}.jsx`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-6 font-mono text-[12px] text-tinta-suave hover:text-tinta transition-colors break-all"
          >
            {t.compCodigo} · MIT
          </a>
        </div>
      )}

      {item.url && (
        <div className="mt-12 pt-5 border-t border-linea/60">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-6 font-mono text-[12px] text-tinta-suave hover:text-tinta transition-colors break-all"
          >
            {t.compCredit} {item.url.replace('https://', '')}
          </a>
        </div>
      )}
    </motion.section>
  )
}
