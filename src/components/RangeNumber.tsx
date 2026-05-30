import { useId, type ChangeEvent } from 'react'

type RangeNumberProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  prefix?: string
  onChange: (value: number) => void
  hint?: string
}

export function RangeNumber({ label, value, min, max, step = 1, suffix, prefix, onChange, hint }: RangeNumberProps) {
  const id = useId()
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  const handleNum = (e: ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value)
    onChange(isNaN(n) ? min : Math.max(min, n))
  }
  const handleRange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <label htmlFor={`${id}-n`} className="field-label" style={{ marginBottom: 0 }}>{label}</label>
        <div className="input-wrap" style={{ width: 116 }}>
          {prefix && <span className="input-affix input-affix--left">{prefix}</span>}
          <input
            id={`${id}-n`}
            className={`field-input${prefix ? ' has-prefix' : ''}${suffix ? ' has-suffix' : ''}`}
            style={{ padding: `9px 12px`, paddingLeft: prefix ? 26 : 12, paddingRight: suffix ? 40 : 12 }}
            type="number"
            inputMode="decimal"
            min={min}
            step={step}
            value={value}
            onChange={handleNum}
          />
          {suffix && <span className="input-affix input-affix--right">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--pct' as string]: `${pct}%` }}
        onChange={handleRange}
        aria-label={label}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}
