import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import CodeBlock from './CodeBlock'
import FavButton from './FavButton'
import CopiarEnlace from './CopiarEnlace'
import PromptPieza from './PromptPieza'
import { nombreDe, formatoKb } from '../data/components'
import { rutaDe } from '../lib/rutas'

// La ficha de una pieza AJENA que no se copia aquí (clase `referencia`): ni demo
// ni código, porque la licencia del origen no deja redistribuirlo. Lo que ocupa su
// sitio es el análisis: cuándo sí, con qué ojo, qué dice el código de su
// accesibilidad, y el prompt para pedírselo a un agente. A la izquierda se lee y a
// la derecha se usa (ficha técnica, prompt, instalación), igual que en la ficha de
// un componente con demo.
export function Bloque({ titulo, children, nota }) {
  return (
    <section className="border-t border-linea pt-4">
      <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave mb-2">{titulo}</h2>
      <p className="text-[15px] leading-relaxed text-tinta max-w-[68ch]">{children}</p>
      {nota && <p className="text-sm text-tinta-suave mt-2 max-w-[68ch]">{nota}</p>}
    </section>
  )
}

function Fila({ etiqueta, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5 border-b border-linea last:border-b-0">
      <dt className="text-sm text-tinta-suave shrink-0">{etiqueta}</dt>
      <dd className="font-mono text-[13px] text-tinta-fuerte text-right">{children}</dd>
    </div>
  )
}

export default function ComponentRef({ t, lang, item, fav, onToggleFav }) {
  // La primera frase del aviso es la que importa (no hay demo ni código): va en
  // negrita, y el resto explica por qué.
  const [primera, ...resto] = t.compRefAviso.split('. ')

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

          <p className="text-sm text-tinta-suave mt-4 max-w-2xl leading-relaxed">
            <b className="text-tinta-fuerte">{primera}.</b> {resto.join('. ')}
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 min-h-6 text-sm text-tinta-fuerte hover:text-blue-600 dark:hover:text-blue-400 mt-2 transition-colors"
          >
            {t.compRefVer}
            <ArrowUpRight size={13} />
          </a>

          <div className="mt-10 grid gap-8 min-[1700px]:grid-cols-3">
            <Bloque titulo={t.compCuando}>{item.cuando[lang]}</Bloque>
            <Bloque titulo={t.compCuidado}>{item.cuidado[lang]}</Bloque>
            <Bloque titulo={t.compA11y} nota={t.compA11yNota}>{item.a11y[lang]}</Bloque>
          </div>
        </div>

        <div className="min-w-0 mt-10 xl:mt-0 flex flex-col gap-6">
          <div>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave pb-2 border-b border-linea">
              {t.compFicha}
            </h2>
            <dl>
              <Fila etiqueta={t.compDibuja}>{item.labels.join(', ')}</Fila>
              <Fila etiqueta={t.compDepende}>{item.deps.length ? item.deps.join(', ') : t.compNada}</Fila>
              <Fila etiqueta={t.compPeso}>{formatoKb(item.kb, lang)}</Fila>
              {item.pausa && <Fila etiqueta={t.compPausa}>{t.compSi}</Fila>}
            </dl>
          </div>

          <PromptPieza
            prompt={item.prompt} lang={lang}
            etiqueta={t.compPrompt} copiar={t.compCopy} copiado={t.compCopied}
          />

          <div>
            <CodeBlock t={t} title={t.compInstall} code={item.install} />
            <p className="text-xs text-tinta-suave mt-2.5 leading-relaxed">{t.compVariantes}</p>
          </div>
        </div>
      </div>

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
    </motion.section>
  )
}
