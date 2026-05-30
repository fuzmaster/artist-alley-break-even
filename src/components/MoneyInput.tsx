import { useId, type ChangeEvent } from 'react'

type MoneyInputProps = {
  label: string
  value: number
  onChange: (value: number) => void
  hint?: string
  placeholder?: string
}

export function MoneyInput({ label, value, onChange, hint, placeholder }: MoneyInputProps) {
  const id = useId()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const n = parseFloat(e.target.value)
    onChange(isNaN(n) ? 0 : Math.max(0, n))
  }
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="input-wrap">
        <span className="input-affix input-affix--left">$</span>
        <input
          id={id}
          className="field-input has-prefix"
          type="number"
          inputMode="decimal"
          min={0}
          step={1}
          value={value === 0 ? '' : value}
          placeholder={placeholder ?? '0'}
          onChange={handleChange}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />
      </div>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
    </div>
  )
}
