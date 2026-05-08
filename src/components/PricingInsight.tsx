type PricingInsightProps = {
  breakEvenUnits: number
  breakEvenAtOneDollarMore: number
  breakEvenAtThreeDollarsMore: number
  breakEvenAtFiveDollarsMore: number
  profitPerItem: number
}

export function PricingInsight({
  breakEvenUnits,
  breakEvenAtOneDollarMore,
  breakEvenAtThreeDollarsMore,
  breakEvenAtFiveDollarsMore,
  profitPerItem,
}: PricingInsightProps) {
  if (profitPerItem <= 0 || breakEvenUnits <= 0) {
    return null
  }

  const improvements = [
    { priceIncrease: 1, adjustedBreakEven: breakEvenAtOneDollarMore },
    { priceIncrease: 3, adjustedBreakEven: breakEvenAtThreeDollarsMore },
    { priceIncrease: 5, adjustedBreakEven: breakEvenAtFiveDollarsMore },
  ].filter(({ adjustedBreakEven }) => adjustedBreakEven > 0 && adjustedBreakEven < breakEvenUnits)

  if (improvements.length === 0) {
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
            If you raise your price by ${priceIncrease}, your break-even target drops from{' '}
            {breakEvenUnits} to {adjustedBreakEven}.
          </p>
        ))}
      </div>
    </section>
  )
}
