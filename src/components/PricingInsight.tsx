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

  const buildMessage = (priceIncrease: number, adjustedBreakEven: number): string => {
    if (adjustedBreakEven < breakEvenUnits) {
      return `If you raise your price by $${priceIncrease}, your break-even target drops from ${breakEvenUnits} to ${adjustedBreakEven}.`
    }

    return `If you raise your price by $${priceIncrease}, your break-even target stays at ${adjustedBreakEven}.`
  }

  return (
    <section className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-100">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
        Pricing Insight
      </p>
      <div className="mt-2 space-y-1">
        <p>{buildMessage(1, breakEvenAtOneDollarMore)}</p>
        <p>{buildMessage(3, breakEvenAtThreeDollarsMore)}</p>
        <p>{buildMessage(5, breakEvenAtFiveDollarsMore)}</p>
      </div>
    </section>
  )
}
