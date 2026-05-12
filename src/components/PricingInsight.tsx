import { useState } from 'react'

type PricingInsightProps = {
  breakEvenUnits: number
  breakEvenAtOneDollarMore: number
  breakEvenAtThreeDollarsMore: number
  breakEvenAtFiveDollarsMore: number
  profitPerItem: number
  onCalculateCustomDelta: (delta: number) => number
}

export function PricingInsight({
  breakEvenUnits,
  breakEvenAtOneDollarMore,
  breakEvenAtThreeDollarsMore,
  breakEvenAtFiveDollarsMore,
  profitPerItem,
  onCalculateCustomDelta,
}: PricingInsightProps) {
  const [customDelta, setCustomDelta] = useState<number>(2)

  if (profitPerItem <= 0 || breakEvenUnits <= 0) {
    return null
  }

  const improvements = [
    { priceIncrease: 1, adjustedBreakEven: breakEvenAtOneDollarMore },
    { priceIncrease: 3, adjustedBreakEven: breakEvenAtThreeDollarsMore },
    { priceIncrease: 5, adjustedBreakEven: breakEvenAtFiveDollarsMore },
  ].filter(({ adjustedBreakEven }) => adjustedBreakEven > 0 && adjustedBreakEven < breakEvenUnits)

  const customBreakEven = customDelta > 0 ? onCalculateCustomDelta(customDelta) : 0
  const showCustomResult = customBreakEven > 0 && customBreakEven < breakEvenUnits
    && ![1, 3, 5].includes(customDelta)

  if (improvements.length === 0 && !showCustomResult) {
    return null
  }

  return (
    <section className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
        Pricing Insight
      </p>
      <div className="mt-2 space-y-1">
        {improvements.map(({ priceIncrease, adjustedBreakEven }) => (
          <p key={priceIncrease}>
            +${priceIncrease} → break-even drops from {breakEvenUnits} to {adjustedBreakEven} units.
          </p>
        ))}
        {showCustomResult ? (
          <p>
            +${customDelta} → break-even drops from {breakEvenUnits} to {customBreakEven} units.
          </p>
        ) : null}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <label htmlFor="customDelta" className="text-xs text-emerald-300 shrink-0">
          What if I raise by $
        </label>
        <input
          id="customDelta"
          type="number"
          min={0.01}
          step={0.5}
          value={customDelta}
          onChange={(e) => setCustomDelta(Math.max(0, Number(e.target.value)))}
          className="w-20 rounded-lg border border-emerald-500/40 bg-emerald-900/30 px-2 py-1 text-sm text-emerald-100 outline-none focus:border-emerald-400"
          aria-label="Custom price increase amount"
        />
        <span className="text-xs text-emerald-300">?</span>
      </div>
    </section>
  )
}
