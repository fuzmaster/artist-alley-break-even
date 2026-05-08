import { NumberInput } from './NumberInput'
import type { CalculatorState } from '../types/calculator'

type CostInputsProps = {
  state: CalculatorState
  onChange: (field: keyof CalculatorState, value: number) => void
}

export function CostInputs({ state, onChange }: CostInputsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">Con Costs</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberInput id="tableFee" label="Table / booth fee" value={state.tableFee} min={0} onChange={(value) => onChange('tableFee', value)} />
        <NumberInput id="badgeCost" label="Badge / registration fees" value={state.badgeCost} min={0} onChange={(value) => onChange('badgeCost', value)} />
        <NumberInput id="hotelCost" label="Hotel total" value={state.hotelCost} min={0} onChange={(value) => onChange('hotelCost', value)} />
        <NumberInput id="roommateCount" label="Roommates splitting hotel" value={state.roommateCount} min={1} onChange={(value) => onChange('roommateCount', value)} />
        <NumberInput id="travelCost" label="Travel / gas / flight" value={state.travelCost} min={0} onChange={(value) => onChange('travelCost', value)} />
        <NumberInput id="foodCost" label="Food budget" value={state.foodCost} min={0} onChange={(value) => onChange('foodCost', value)} />
        <NumberInput id="displayCost" label="Display / setup costs" value={state.displayCost} min={0} onChange={(value) => onChange('displayCost', value)} />
        <NumberInput id="inventoryCost" label="Inventory production cost" value={state.inventoryCost} min={0} onChange={(value) => onChange('inventoryCost', value)} />
        <NumberInput id="emergencyBuffer" label="Emergency buffer" value={state.emergencyBuffer} min={0} onChange={(value) => onChange('emergencyBuffer', value)} />
      </div>
    </section>
  )
}
