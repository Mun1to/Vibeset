import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NoEncontrado from './components/NoEncontrado'
import Sidebar from './components/Sidebar'
import FiltrosMovil from './components/FiltrosMovil'
import LanguagesHeader from './components/LanguagesHeader'
import LanguageGrid from './components/LanguageGrid'
import LanguageDetail from './components/LanguageDetail'
import ResourcesView from './components/ResourcesView'
import ConceptsView from './components/ConceptsView'
import ComponentsView from './components/ComponentsView'
import ComponentDetail from './components/ComponentDetail'
import ComponentRef from './components/ComponentRef'
import SkillsView from './components/SkillsView'
import SkillDetail from './components/SkillDetail'
import ConsejosView from './components/ConsejosView'
import CompareTray from './components/CompareTray'
import CompareModal from './components/CompareModal'
import { usePaginado } from './lib/paginar'
import { leerRuta, rutaDe, slugClave, slugLenguaje } from './lib/rutas'
import { metaDePagina, useMeta } from './lib/meta'
import { LANGUAGES, CATEGORIES, matchesFilter } from './data/languages'
import { RESOURCES } from './data/resources'
import { CONCEPTS } from './data/concepts'
import { COMPONENT_GROUPS, COMPONENT_ITEMS } from './data/components'
import { SKILL_GROUPS, SKILL_ITEMS } from './data/skills'
import { CONSEJO_GRUPOS, CONSEJOS } from './data/consejos'

// Las seis secciones del catálogo, con su estado de filtros y sus datos.
//
// **Por qué esto no está en `App.jsx`, que es de donde salió.** Aquí dentro se
// importa el catálogo entero: los cien lenguajes, las dieciocho skills, los
// setenta y siete recursos. Medido, son 374 KB de datos, 128 KB ya comprimidos,
// que es casi la mitad de todo lo que descargaba la portada. Y la portada no
// enseña ni una ficha: enseña seis números, que ahora los cuenta el build.
//
// `App` lo monta con `lazy()`, así que ese peso solo viaja cuando alguien entra
// de verdad en una sección. Quien llega a la portada y se queda ya no lo paga.
//
// Efecto secundario que conviene saber: al volver a la portada este componente
// se DESMONTA, así que los filtros de texto se limpian solos. La categoría no,
// porque esa vive en la dirección (`?cat=`), que es donde tiene que estar.
export default function Catalogo({ t, lang }) {
  const location = useLocation()
  const irA = useNavigate()
  const { seccion, ficha } = leerRuta(location.pathname)
  const activeNav = seccion ?? 'home'

  const lenguajeAbierto = seccion === 'languages' && ficha ? LENGUAJE_POR_SLUG[ficha] : null
  const openComp = seccion === 'components' && ficha ? COMPONENTE_POR_SLUG[ficha] : null
  const openSkill = seccion === 'skills' && ficha ? SKILL_POR_SLUG[ficha] : null
  // Una ficha que no existe es un 404, no la sección con la ficha ignorada. Lo
  // decide aquí y no en `App` porque saber si «rust» es un lenguaje de verdad
  // exige tener el catálogo delante, que es justo lo que la portada no carga.
  const fichaRota = Boolean(ficha) && !lenguajeAbierto && !openComp && !openSkill
  const vista = fichaRota ? '404' : activeNav

  // Filtrar o buscar desde una ficha abierta devuelve a su lista. Lee la ruta
  // del navegador y no del render, para que valga dentro de un useMemo sin
  // quedarse con una copia vieja.
  const volverALista = (sec) => {
    const base = rutaDe(sec, null, lang)
    if (window.location.pathname !== base) irA(base, { replace: true })
  }

  // La categoría abierta viaja en la dirección (`/languages?cat=web`), y no solo
  // en el estado de React. Dos cosas se arreglan con esto: el panel del header
  // puede enlazar «Web · 26» en vez de enseñarlo como texto muerto, y cualquier
  // filtro se puede compartir o guardar en marcadores.
  //
  // La dirección es la fuente y el estado la sigue, nunca al revés. Por eso los
  // filtros de la barra lateral navegan en vez de llamar a su setter: si
  // escribieran las dos cosas, un botón de atrás bastaría para dejarlas
  // diciendo cosas distintas.
  //
  // Va con `replace` a propósito: filtrar no es cambiar de página, y sin esto
  // cada clic en la lateral dejaría un escalón en el historial y salir de la
  // sección costaría diez veces atrás.
  const params = new URLSearchParams(location.search)
  const catUrl = params.get('cat') ?? 'all'
  // El texto también puede venir en la dirección. Lo usa el buscador global del
  // header para dejar abierto un concepto o un consejo concretos, que no tienen
  // ficha propia: antes eso lo hacía llamando a un setter de aquí dentro, y ese
  // hilo se cortó al separar la portada del catálogo. Ganamos de paso que ese
  // filtro se pueda compartir, como el de categoría.
  const qUrl = params.get('q') ?? ''
  const irACategoria = (sec, k) =>
    irA(k === 'all' ? rutaDe(sec, null, lang) : `${rutaDe(sec, null, lang)}?cat=${k}`, { replace: true })

  // Lenguajes filtra de tres formas (por categoría, por fama y por año) y las
  // tres viajan por la misma clave: `top` y `recent` no chocan con ninguna
  // categoría, así que no hace falta un segundo parámetro que además habría que
  // mantener en sincronía con el primero.
  const filtroDeClave = (k) =>
    k === 'all' ? { type: 'all' }
      : k === 'top' ? { type: 'fame', value: 'top' }
      : k === 'recent' ? { type: 'recent' }
      : { type: 'cat', value: k }

  // El título y la descripción de una ficha necesitan la ficha, y la ficha vive
  // en el catálogo. Por eso el meta de las secciones se pone aquí y el de la
  // portada y el 404 en `App`: son excluyentes, así que nunca se pisan. Mientras
  // este componente carga, el meta bueno ya está en el HTML que sirvió el
  // servidor, que es además el único que leen los robots.
  const meta = useMemo(() => {
    const abierta = lenguajeAbierto ? LANGUAGES.find((x) => x.name === lenguajeAbierto)
      : openComp ? COMPONENT_ITEMS.find((x) => x.key === openComp)
      : openSkill ? SKILL_ITEMS.find((x) => x.key === openSkill)
      : null
    return metaDePagina({ vista, ficha: abierta, lang, t })
  }, [vista, lenguajeAbierto, openComp, openSkill, lang, t])
  useMeta({ ...meta, ruta: location.pathname })

  const [filter, setFilter] = useState({ type: 'all' })
  const [query, setQuery] = useState('')
  const [langFavs, toggleLangFav] = useFavorites('lang')
  const [compareSet, setCompareSet] = useState(() => [])
  const [langFavOnly, setLangFavOnly] = useState(false)
  const [cmpOpen, setCmpOpen] = useState(false)

  const [resQuery, setResQuery] = useState(''); const [resCat, setResCat] = useState('all')
  const [resFavs, toggleResFav] = useFavorites('res'); const [resFavOnly, setResFavOnly] = useState(false)
  const [conQuery, setConQuery] = useState(''); const [conCat, setConCat] = useState('all')
  const [conFavs, toggleConFav] = useFavorites('con'); const [conFavOnly, setConFavOnly] = useState(false)
  const [compQuery, setCompQuery] = useState(''); const [compCat, setCompCat] = useState('all')
  const [compFavs, toggleCompFav] = useFavorites('comp'); const [compFavOnly, setCompFavOnly] = useState(false)
  const [skiQuery, setSkiQuery] = useState(''); const [skiCat, setSkiCat] = useState('all')
  const [skiFavs, toggleSkiFav] = useFavorites('skill'); const [skiFavOnly, setSkiFavOnly] = useState(false)
  const [cjQuery, setCjQuery] = useState(''); const [cjCat, setCjCat] = useState('all')
  const [cjFavs, toggleCjFav] = useFavorites('consejo'); const [cjFavOnly, setCjFavOnly] = useState(false)
  // El muro sale mezclado y se puede volver a mezclar: el orden del archivo no
  // dice nada, y así no salen siempre los mismos arriba.
  const [cjSemilla, setCjSemilla] = useState(() => Math.random())

  // La dirección manda: al entrar, al pulsar atrás o al llegar desde el panel
  // del header, la categoría de la sección activa se pone a lo que dice la URL.
  // Marcar «solo favoritos» y filtrar por categoría son excluyentes, así que
  // entrar por categoría apaga el otro.
  useEffect(() => {
    switch (activeNav) {
      case 'languages': setFilter(filtroDeClave(catUrl)); setLangFavOnly(false); if (qUrl) setQuery(qUrl); break
      case 'resources': setResCat(catUrl); setResFavOnly(false); if (qUrl) setResQuery(qUrl); break
      case 'concepts': setConCat(catUrl); setConFavOnly(false); if (qUrl) setConQuery(qUrl); break
      case 'components': setCompCat(catUrl); setCompFavOnly(false); if (qUrl) setCompQuery(qUrl); break
      case 'skills': setSkiCat(catUrl); setSkiFavOnly(false); if (qUrl) setSkiQuery(qUrl); break
      case 'consejos': setCjCat(catUrl); setCjFavOnly(false); if (qUrl) setCjQuery(qUrl); break
      default: break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav, catUrl, qUrl])

  // Los ajustes de cada componente viven aquí para que no se pierdan al cambiar
  // de sección y volver. Qué ficha está abierta lo dice la URL.
  const [compValues, setCompValues] = useState(() =>
    Object.fromEntries(COMPONENT_ITEMS.map((c) => [c.key, { ...c.defaults }])))
  const setCompValue = (key, prop, value) =>
    setCompValues((prev) => ({ ...prev, [key]: { ...prev[key], [prop]: value } }))
  const resetComp = (key) =>
    setCompValues((prev) => ({ ...prev, [key]: { ...COMPONENT_ITEMS.find((c) => c.key === key).defaults } }))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LANGUAGES.filter((l) => {
      if (langFavOnly && !langFavs.has(l.name)) return false
      if (!matchesFilter(l, filter)) return false
      if (!q) return true
      const d = l[lang]
      const hay = [l.name, l.creator, d.desc, d.fullDesc, d.paradigm, ...d.uses, ...l.extensions, ...l.eco]
        .join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query, langFavOnly, langFavs, lang])

  // Las cien fichas se pintaban de una vez: en un móvil eran 21,6 pantallas de
  // scroll seguido. Veinticuatro llenan la primera vista en cualquier ancho.
  const { corte: corteLangs, quedan: quedanLangs, verMas: verMasLangs } = usePaginado(visible.length, 24)

  const resGroups = useMemo(() => {
    const q = resQuery.trim().toLowerCase()
    return RESOURCES.filter((g) => resCat === 'all' || g.key === resCat)
      .map((g) => ({ ...g, items: g.items.filter((r) => {
        if (resFavOnly && !resFavs.has(r.name)) return false
        return !q || r.name.toLowerCase().includes(q) || r[lang].toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [resQuery, resCat, lang, resFavOnly, resFavs])

  const conGroups = useMemo(() => {
    const q = conQuery.trim().toLowerCase()
    return CONCEPTS.filter((g) => conCat === 'all' || g.key === conCat)
      .map((g) => ({ ...g, items: g.items.filter((c) => {
        if (conFavOnly && !conFavs.has(c.name)) return false
        return !q || [c.name, c.nameEn ?? '', c[lang].what].join(' ').toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [conQuery, conCat, lang, conFavOnly, conFavs])

  const compItems = useMemo(() => {
    const q = compQuery.trim().toLowerCase()
    return COMPONENT_ITEMS.filter((c) => {
      if (compFavOnly && !compFavs.has(c.key)) return false
      if (compCat !== 'all' && c.group !== compCat) return false
      return !q || c.name.toLowerCase().includes(q)
    })
  }, [compQuery, compCat, compFavOnly, compFavs])

  // Con las fichas de análisis son más de cuarenta: se paginan igual que los
  // lenguajes, para que el pie se pueda alcanzar.
  const { corte: corteComps, quedan: quedanComps, verMas: verMasComps } = usePaginado(compItems.length, 24)

  // Mezcla estable: con la misma semilla sale el mismo orden, así que filtrar o
  // marcar un favorito no reordena el muro entero bajo el dedo.
  const cjLista = useMemo(() => {
    const q = cjQuery.trim().toLowerCase()
    const filtrados = CONSEJOS.filter((c) => {
      if (cjFavOnly && !cjFavs.has(c.id)) return false
      if (cjCat !== 'all' && c.grupo !== cjCat) return false
      return !q || [c.es, c.en, c.autor ?? ''].join(' ').toLowerCase().includes(q)
    })
    const peso = (id) => {
      let h = 0
      const cadena = id + cjSemilla
      for (let i = 0; i < cadena.length; i++) h = (h * 31 + cadena.charCodeAt(i)) % 100000
      return h
    }
    return filtrados.sort((a, b) => peso(a.id) - peso(b.id))
  }, [cjQuery, cjCat, cjFavOnly, cjFavs, cjSemilla])

  // Las skills se muestran agrupadas por categoría, como los conceptos.
  const skiGroups = useMemo(() => {
    const q = skiQuery.trim().toLowerCase()
    return SKILL_GROUPS.filter((g) => skiCat === 'all' || g.key === skiCat)
      .map((g) => ({ ...g, items: SKILL_ITEMS.filter((s) => {
        if (s.group !== g.key) return false
        if (skiFavOnly && !skiFavs.has(s.key)) return false
        const d = s[lang]
        return !q || [s.name, s.nameEn, d.label, d.what, d.when].join(' ').toLowerCase().includes(q)
      })}))
      .filter((g) => g.items.length > 0)
  }, [skiQuery, skiCat, lang, skiFavOnly, skiFavs])

  const toggleCompare = (name) =>
    setCompareSet((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : prev.length >= 3 ? prev : [...prev, name])

  const sidebarProps = useMemo(() => {
    if (activeNav === 'languages') {
      const activeCat = filter.type === 'cat' ? filter.value : filter.type === 'all' ? 'all' : null
      return {
        searchPh: t.searchPh, query, setQuery,
        categories: CATEGORIES.map((c) => ({ key: c.key, label: c.label[lang], count: c.count, dot: c.dot })),
        activeCat: langFavOnly ? null : activeCat,
        setActiveCat: (k) => irACategoria('languages', k),
        extraGroup: {
          showFavOnly: langFavOnly, onToggleFavOnly: () => setLangFavOnly((v) => !v),
          favCount: langFavs.size, compareCount: compareSet.length,
        },
      }
    }
    if (activeNav === 'resources') {
      return {
        searchPh: t.resPh, query: resQuery, setQuery: setResQuery,
        categories: [{ key: 'all', label: t.all, count: RESOURCES.reduce((n, g) => n + g.items.length, 0), dot: 'var(--tono-indigo)' },
          ...RESOURCES.map((g) => ({ key: g.key, label: g.label[lang], count: g.items.length, dot: g.dot }))],
        activeCat: resFavOnly ? null : resCat,
        setActiveCat: (k) => irACategoria('resources', k),
        extraGroup: { showFavOnly: resFavOnly, onToggleFavOnly: () => setResFavOnly((v) => !v), favCount: resFavs.size },
      }
    }
    if (activeNav === 'concepts') {
      return {
        searchPh: t.conPh, query: conQuery, setQuery: setConQuery,
        categories: [{ key: 'all', label: t.all, count: CONCEPTS.reduce((n, g) => n + g.items.length, 0), dot: 'var(--tono-indigo)' },
          ...CONCEPTS.map((g) => ({ key: g.key, label: g.label[lang], count: g.items.length, dot: g.color }))],
        activeCat: conFavOnly ? null : conCat,
        setActiveCat: (k) => irACategoria('concepts', k),
        extraGroup: { showFavOnly: conFavOnly, onToggleFavOnly: () => setConFavOnly((v) => !v), favCount: conFavs.size },
      }
    }
    if (activeNav === 'skills') {
      return {
        searchPh: t.skillsPh, query: skiQuery,
        setQuery: (v) => { setSkiQuery(v); volverALista('skills') },
        categories: [{ key: 'all', label: t.all, count: SKILL_ITEMS.length },
          ...SKILL_GROUPS.map((g) => ({ key: g.key, label: g.label[lang],
            count: SKILL_ITEMS.filter((s) => s.group === g.key).length }))],
        activeCat: skiFavOnly ? null : skiCat,
        setActiveCat: (k) => irACategoria('skills', k),
        extraGroup: { showFavOnly: skiFavOnly,
          onToggleFavOnly: () => { setSkiFavOnly((v) => !v); volverALista('skills') }, favCount: skiFavs.size },
      }
    }
    if (activeNav === 'consejos') {
      return {
        searchPh: t.consejosPh, query: cjQuery, setQuery: setCjQuery,
        categories: [{ key: 'all', label: t.all, count: CONSEJOS.length },
          ...CONSEJO_GRUPOS.map((g) => ({ key: g.key, label: g.label[lang],
            count: CONSEJOS.filter((c) => c.grupo === g.key).length }))],
        activeCat: cjFavOnly ? null : cjCat,
        setActiveCat: (k) => irACategoria('consejos', k),
        extraGroup: { showFavOnly: cjFavOnly, onToggleFavOnly: () => setCjFavOnly((v) => !v), favCount: cjFavs.size },
      }
    }
    return {
      searchPh: t.compPh, query: compQuery,
      setQuery: (v) => { setCompQuery(v); volverALista('components') },
      categories: [{ key: 'all', label: t.all, count: COMPONENT_ITEMS.length },
        ...COMPONENT_GROUPS.map((g) => ({ key: g.key, label: g.label[lang],
          count: COMPONENT_ITEMS.filter((c) => c.group === g.key).length }))],
      activeCat: compFavOnly ? null : compCat,
      setActiveCat: (k) => irACategoria('components', k),
      extraGroup: { showFavOnly: compFavOnly, onToggleFavOnly: () => { setCompFavOnly((v) => !v); volverALista('components') }, favCount: compFavs.size },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNav, location.pathname, t, lang, query, filter, langFavOnly, langFavs, compareSet,
      resQuery, resCat, resFavOnly, resFavs, conQuery, conCat, conFavOnly, conFavs,
      compQuery, compCat, compFavOnly, compFavs, skiQuery, skiCat, skiFavOnly, skiFavs,
      cjQuery, cjCat, cjFavOnly, cjFavs])

  return (
    <>
      {!fichaRota && !lenguajeAbierto && !openComp && !openSkill && <Sidebar t={t} {...sidebarProps} />}
      <main id="principal" className="flex-1 min-w-0 overflow-hidden">
        {!fichaRota && !lenguajeAbierto && !openComp && !openSkill && <FiltrosMovil t={t} {...sidebarProps} />}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
        {fichaRota && <NoEncontrado t={t} onHome={() => irA(rutaDe('home', null, lang))} />}
        {vista === 'languages' && (
          lenguajeAbierto ? (
            <LanguageDetail
              t={t} lang={lang} nombre={lenguajeAbierto}
              fav={langFavs.has(lenguajeAbierto)}
              onToggleFav={() => toggleLangFav(lenguajeAbierto)}
              enComparacion={compareSet.includes(lenguajeAbierto)}
              onToggleCompare={() => toggleCompare(lenguajeAbierto)}
            />
          ) : (
            <>
              {/* `shown` es lo que hay pintado, no lo que pasa el filtro:
                  «Mostrando 24 de 100» tiene que poder comprobarse
                  contando las fichas de la pantalla. */}
              <LanguagesHeader t={t} lang={lang} filter={filter}
                               onFiltrar={(k) => irACategoria('languages', k)}
                               total={LANGUAGES.length} shown={corteLangs} />
              <LanguageGrid
                t={t} lang={lang} list={visible.slice(0, corteLangs)} total={LANGUAGES.length}
                favorites={langFavs} onToggleFav={toggleLangFav}
                compareSet={new Set(compareSet)} onToggleCompare={toggleCompare}
                quedan={quedanLangs} onVerMas={verMasLangs}
                onClearFilters={() => { setFilter({ type: 'all' }); setQuery(''); setLangFavOnly(false) }}
              />
            </>
          )
        )}
        {vista === 'resources' && (
          <ResourcesView t={t} lang={lang} groups={resGroups} favorites={resFavs} onToggleFav={toggleResFav}
            onClear={() => { setResQuery(''); setResCat('all'); setResFavOnly(false) }} />
        )}
        {vista === 'concepts' && (
          <ConceptsView t={t} lang={lang} groups={conGroups} favorites={conFavs} onToggleFav={toggleConFav}
            onClear={() => { setConQuery(''); setConCat('all'); setConFavOnly(false) }} />
        )}
        {vista === 'components' && (
          openComp ? (
            COMPONENT_ITEMS.find((c) => c.key === openComp).clase === 'referencia' ? (
              <ComponentRef
                t={t} lang={lang}
                item={COMPONENT_ITEMS.find((c) => c.key === openComp)}
                fav={compFavs.has(openComp)}
                onToggleFav={() => toggleCompFav(openComp)}
              />
            ) : (
              <ComponentDetail
                t={t} lang={lang}
                item={COMPONENT_ITEMS.find((c) => c.key === openComp)}
                values={compValues[openComp]}
                onChange={(prop, value) => setCompValue(openComp, prop, value)}
                onReset={() => resetComp(openComp)}
                fav={compFavs.has(openComp)}
                onToggleFav={() => toggleCompFav(openComp)}
              />
            )
          ) : (
            <ComponentsView t={t} lang={lang} items={compItems.slice(0, corteComps)} total={compItems.length}
              quedan={quedanComps} onVerMas={verMasComps}
              favorites={compFavs} onToggleFav={toggleCompFav}
              values={compValues}
              onClear={() => { setCompQuery(''); setCompCat('all'); setCompFavOnly(false) }} />
          )
        )}
        {vista === 'skills' && (
          openSkill ? (
            <SkillDetail
              t={t} lang={lang}
              item={SKILL_ITEMS.find((s) => s.key === openSkill)}
              group={SKILL_GROUPS.find((g) => g.key === SKILL_ITEMS.find((s) => s.key === openSkill).group)}
              fav={skiFavs.has(openSkill)}
              onToggleFav={() => toggleSkiFav(openSkill)}
            />
          ) : (
            <SkillsView t={t} lang={lang} groups={skiGroups} favorites={skiFavs} onToggleFav={toggleSkiFav}
              onClear={() => { setSkiQuery(''); setSkiCat('all'); setSkiFavOnly(false) }} />
          )
        )}
        {vista === 'consejos' && (
          <ConsejosView
            t={t} lang={lang} lista={cjLista} total={CONSEJOS.length}
            favorites={cjFavs} onToggleFav={toggleCjFav}
            onMezclar={() => setCjSemilla(Math.random())}
            urlAportar={URL_APORTAR}
            onClear={() => { setCjQuery(''); setCjCat('all'); setCjFavOnly(false) }}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      <CompareTray t={t} names={compareSet} onRemove={toggleCompare}
        onClear={() => setCompareSet([])} onOpen={() => setCmpOpen(true)} />
      <CompareModal t={t} lang={lang} open={cmpOpen} onClose={() => setCmpOpen(false)} names={compareSet} />
    </>
  )
}

// Aportar es rellenar un formulario, no editar código. Antes este enlace
// llevaba al archivo `consejos.js` en GitHub, o sea que para dejar una frase
// había que hacer un fork, editar JavaScript sin romper la sintaxis y abrir una
// pull request. La gente a la que va dirigida esta web es justo la que no
// quiere hacer eso, y el marcador está: en setenta y un días, cero forks, cero
// issues y ninguna aportación. Ahora abre la plantilla de issue, que para quien
// aporta es un formulario del navegador y para nosotros llega con los campos ya
// separados. El de la pull request sigue existiendo, en APORTAR.md.
const URL_APORTAR = 'https://github.com/Mun1to/Vibeset/issues/new?template=consejo.yml'

// Vuelta de la URL a la clave interna. Se arman una vez, no en cada pintado.
const LENGUAJE_POR_SLUG = Object.fromEntries(LANGUAGES.map((l) => [slugLenguaje(l.name), l.name]))
const COMPONENTE_POR_SLUG = Object.fromEntries(COMPONENT_ITEMS.map((c) => [slugClave(c.key), c.key]))
const SKILL_POR_SLUG = Object.fromEntries(SKILL_ITEMS.map((s) => [slugClave(s.key), s.key]))

// Los favoritos aguantan la recarga: guardar una estrella y perderla al refrescar
// es peor que no tener el botón. Cada catálogo lleva su propia lista.
function useFavorites(catalogo) {
  const clave = `vibeset-fav-${catalogo}`

  const [set, setSet] = useState(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(clave) ?? '[]')
      return new Set(Array.isArray(guardado) ? guardado : [])
    } catch { return new Set() }
  })

  const toggle = (key) =>
    setSet((prev) => {
      const n = new Set(prev)
      n.has(key) ? n.delete(key) : n.add(key)
      try { localStorage.setItem(clave, JSON.stringify([...n])) } catch { /* sin almacenamiento */ }
      return n
    })

  return [set, toggle]
}
