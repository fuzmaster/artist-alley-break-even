import { NumberInput } from './NumberInput'
import type { CalculatorState } from '../types/calculator'

type SellingTimeInputsProps = {
  state: CalculatorState
  totalSellingHours: number
  onChange: (field: keyof CalculatorState, value: number) => void
}

export function SellingTimeInputs({ state, totalSellingHours, onChange }: SellingTimeInputsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">Selling Time</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberInput id="conDays" label="Con days" value={state.conDays} min={1} onChange={(value) => onChange('conDays', value)} />
        <NumberInput id="alleyHoursPerDay" label="Artist Alley hours per day" value={state.alleyHoursPerDay} min={1} step={0.5} onChange={(value) => onChange('alleyHoursPerDay', value)} />
      </div>
      <p className="text-sm text-slate-300">
        Total selling hours: <span className="font-semibold text-fuchsia-300">{totalSellingHours}</span>
      </p>
    </section>
  )
}
