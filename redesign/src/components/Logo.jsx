import { LOGO_TRAZO, LOGO_CAJA } from './logoTrazo'

const WIDE_RATIO = LOGO_CAJA.w / LOGO_CAJA.h

// `wide` recorta el margen vertical muerto del cuadrado: mismo trazo, silueta horizontal.
export default function Logo({ size = 22, wide = false, className = '' }) {
  const viewBox = wide ? `${LOGO_CAJA.x} ${LOGO_CAJA.y} ${LOGO_CAJA.w} ${LOGO_CAJA.h}` : '0 0 512 512'
  const width = wide ? Math.round(size * WIDE_RATIO) : size

  return (
    <svg viewBox={viewBox} width={width} height={size} className={className} aria-hidden="true">
      <path d={LOGO_TRAZO} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
