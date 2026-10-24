import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { atajoBuscar, esMac } from '../lib/atajos'

// Con enlaces de verdad hacen falta callejones sin salida de verdad: una
// dirección equivocada tiene que decirlo, no dejar la portada como si nada.
export default function NoEncontrado({ t }) {
  // En un efecto y no al pintar: esta página también se cocina en el build, y
  // el HTML servido tiene que coincidir con el primer pintado del cliente.
  const [mac, setMac] = useState(false)
  useEffect(() => { setMac(esMac()) }, [])

  return (
    // `mx-auto` y `my-auto`: la columna se centra en el hueco, a lo ancho y a lo
    // alto (quien la envuelve es una columna flex solo cuando hay un 404). Con
    // solo `max-w-2xl` quedaba pegada a la izquierda con medio monitor vacío a la
    // derecha, igual que pasaba con las fichas.
    <section className="px-6 sm:px-10 py-24 max-w-2xl w-fit mx-auto my-auto">
      <div className="font-mono text-xs uppercase tracking-[.14em] text-blue-600 dark:text-blue-400">404</div>
      <h1 className="text-3xl font-extrabold tracking-tight mt-3">{t.noHayTitulo}</h1>
      <p className="text-tinta-suave mt-3 leading-relaxed">{t.noHayTexto}</p>

      <Link
        to="/"
        className="grupo-cta pulsable alzable inline-flex items-center gap-1.5 mt-7 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-5 py-2.5 text-sm"
      >
        {t.noHayVolver}
        <ArrowRight size={14} className="flecha-desliza" />
      </Link>

      <div className="font-mono text-[12px] text-tinta-suave mt-4">{t.noHayBuscar(atajoBuscar(mac))}</div>
    </section>
  )
}
