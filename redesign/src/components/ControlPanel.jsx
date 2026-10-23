import { RotateCcw } from 'lucide-react'

function Row({ children }) {
  return <div className="py-2.5">{children}</div>
}

function Label({ children, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-1.5">
      <span className="text-sm text-tinta-fuerte">{children}</span>
      {value != null && <span className="font-mono text-xs text-tinta-suave shrink-0">{value}</span>}
    </div>
  )
}

export default function ControlPanel({ t, lang, controls, values, onChange, onReset }) {
  return (
    <div className="@container">
      <div className="flex items-baseline justify-between gap-3 pb-2 border-b border-linea">
        <div className="text-[12px] font-bold uppercase tracking-wider text-tinta-suave">
          {t.compControls}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 min-h-6 px-1.5 -mx-1.5 text-xs text-tinta-suave hover:text-tinta cursor-pointer transition-colors"
        >
          <RotateCcw size={12} />
          {t.compReset}
        </button>
      </div>

      <div className="grid @sm:grid-cols-2 @3xl:grid-cols-3 gap-x-8 pt-1">
      {controls.map((c) => {
        const value = values[c.key]

        if (c.type === 'range') {
          return (
            <Row key={c.key}>
              <Label value={value}>{c.label[lang]}</Label>
              <input
                type="range"
                min={c.min} max={c.max} step={c.step} value={value}
                onChange={(e) => onChange(c.key, Number(e.target.value))}
                className="w-full h-6 accent-blue-500 cursor-pointer"
                aria-label={c.label[lang]}
              />
            </Row>
          )
        }

        if (c.type === 'select') {
          return (
            <Row key={c.key}>
              <Label>{c.label[lang]}</Label>
              <select
                value={value}
                onChange={(e) => onChange(c.key, e.target.value)}
                className="w-full bg-panel border border-linea px-2 py-1.5 text-sm text-tinta-fuerte outline-none focus:border-blue-500 cursor-pointer"
              >
                {c.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label[lang]}</option>
                ))}
              </select>
            </Row>
          )
        }

        if (c.type === 'bool') {
          return (
            <Row key={c.key}>
              <button
                onClick={() => onChange(c.key, !value)}
                className="flex items-center justify-between gap-3 w-full cursor-pointer group"
              >
                <span className="text-sm text-tinta-fuerte group-hover:text-tinta transition-colors">
                  {c.label[lang]}
                </span>
                <span
                  aria-hidden="true"
                  className={`relative w-9 h-5 rounded-full shrink-0 transition-colors ${
                    value ? 'bg-blue-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      value ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </Row>
          )
        }

        if (c.type === 'text') {
          return (
            <Row key={c.key}>
              <Label>{c.label[lang]}</Label>
              <input
                value={value}
                maxLength={c.maxLength || 14}
                onChange={(e) => onChange(c.key, e.target.value)}
                className="w-full bg-panel border border-linea px-2 py-1.5 text-sm text-tinta-fuerte outline-none focus:border-blue-500"
              />
            </Row>
          )
        }

        if (c.type === 'color') {
          return (
            <Row key={c.key}>
              <Label value={value}>{c.label[lang]}</Label>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(c.key, e.target.value)}
                className="w-full h-8 bg-transparent cursor-pointer"
              />
            </Row>
          )
        }

        return null
      })}
      </div>
    </div>
  )
}
