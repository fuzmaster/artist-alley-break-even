import { PresetButtons } from './PresetButtons'
import { formatCurrency } from '../lib/formatCurrency'
import type { CalculatorState } from '../types/calculator'
import { NumberInput } from './NumberInput'

type ProductInputsProps = {
  state: CalculatorState
  profitPerItem: number
  onChange: (
    field: Exclude<keyof CalculatorState, 'conName' | 'productName'>,
    value: number,
  ) => void
  onPresetSelect: (
    productName: string,
    averageSalePrice: number,
    averageItemCost: number,
  ) => void
}

export function ProductInputs({
  state,
  profitPerItem,
  onChange,
  onPresetSelect,
}: ProductInputsProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">Product Economics</h2>
      <PresetButtons onSelect={onPresetSelect} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberInput id="averageSalePrice" label="Average item sale price" value={state.averageSalePrice} min={0} step={0.01} onChange={(value) => onChange('averageSalePrice', value)} />
        <NumberInput id="averageItemCost" label="Average cost to make item" value={state.averageItemCost} min={0} step={0.01} onChange={(value) => onChange('averageItemCost', value)} />
      </div>
      <p className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-200">
        Average profit per item: <span className="font-semibold text-fuchsia-300">{formatCurrency(profitPerItem)}</span>
      </p>
    </section>
  )
}
