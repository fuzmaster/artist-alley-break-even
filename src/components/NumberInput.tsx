import type { ChangeEvent } from 'react'

type NumberInputProps = {
  id: string
  label: string
  value: number
  min?: number
  step?: number
  onChange: (value: number) => void
  helperText?: string
}

export function NumberInput({
  id,
  label,
  value,
  min,
  step = 1,
  onChange,
  helperText,
}: NumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseFloat(event.target.value)
    onChange(Number.isNaN(nextValue) ? 0 : nextValue)
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner outline-none ring-0 transition focus:border-fuchsia-400"
      />
      {helperText ? <p className="text-xs text-slate-400">{helperText}</p> : null}
    </div>
  )
}
