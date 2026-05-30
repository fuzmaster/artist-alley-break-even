import { useId, type ChangeEvent } from 'react'

type PlainNumberProps = {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
  suffix?: string
  hint?: string
}

export function PlainNumber({ label, value, onChange, min = 0, step = 1, suffix, hint }: PlainNumberProps) {
  const id = useId()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value)
    onChange(isNaN(n) ? min : Math.max(min, n))
  }
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="input-wrap">
        <input
          id={id}
          className={`field-input${suffix ? ' has-suffix' : ''}`}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={handleChange}
        />
        {suffix && <span className="input-affix input-affix--right">{suffix}</span>}
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}
