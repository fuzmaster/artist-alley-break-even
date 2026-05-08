import { formatCurrency } from '../lib/formatCurrency'

type ResultCardProps = {
  productName: string
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  upfrontCashNeeded: number
  requiredProfitPerHour: number
  hasInvalidProfit: boolean
}

export function ResultCard({
  productName,
  breakEvenUnits,
  salesPerDay,
  salesPerHour,
  upfrontCashNeeded,
  requiredProfitPerHour,
  hasInvalidProfit,
}: ResultCardProps) {
  const normalizedProductName = productName.trim() || 'items'
  const displayProductName =
    breakEvenUnits === 1 && normalizedProductName.endsWith('s')
      ? normalizedProductName.slice(0, -1)
      : normalizedProductName

  return (
    <section className="rounded-2xl border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/20 to-slate-950 p-6 shadow-2xl shadow-fuchsia-900/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-200">
        Break-Even Target
      </p>
      {hasInvalidProfit ? (
        <div className="mt-3 space-y-2 text-sm text-fuchsia-100">
          <p className="text-base font-semibold text-white">
            You cannot break even at this price.
          </p>
          <p>Your item costs more to make than it sells for.</p>
          <p>Raise your price or lower production cost before tabling.</p>
        </div>
      ) : (
        <>
          <p className="mt-3 text-4xl font-black text-white sm:text-5xl">
            {breakEvenUnits} {displayProductName}
          </p>
          <div className="mt-5 space-y-2 text-sm text-slate-200">
            <p>You need to sell {breakEvenUnits} {displayProductName} to break even.</p>
            <p>That is {salesPerDay} per day.</p>
            <p>That is {salesPerHour} per hour.</p>
          </div>
        </>
      )}
      <div className="mt-5 space-y-2 text-sm text-slate-200">
        <p>You need {formatCurrency(upfrontCashNeeded)} cash upfront including inventory.</p>
        <p>You need {formatCurrency(requiredProfitPerHour)} profit per selling hour.</p>
      </div>
    </section>
  )
}
