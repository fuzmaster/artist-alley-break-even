import { formatCurrency } from '../lib/formatCurrency'

type ResultCardProps = {
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  totalCost: number
}

export function ResultCard({
  breakEvenUnits,
  salesPerDay,
  salesPerHour,
  totalCost,
}: ResultCardProps) {
  return (
    <section className="rounded-2xl border border-fuchsia-500/40 bg-gradient-to-b from-fuchsia-500/20 to-slate-950 p-6 shadow-2xl shadow-fuchsia-900/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-200">
        Break-Even Target
      </p>
      <p className="mt-3 text-4xl font-black text-white sm:text-5xl">
        {breakEvenUnits} items
      </p>
      <p className="mt-2 text-sm text-fuchsia-100">
        You need to sell {breakEvenUnits} items to break even.
      </p>
      <div className="mt-5 space-y-2 text-sm text-slate-200">
        <p>That is {salesPerDay} sales per day.</p>
        <p>That is {salesPerHour} sales per hour.</p>
        <p className="text-fuchsia-100">Before profit.</p>
      </div>
      <p className="mt-5 text-xs text-slate-300">
        Total estimated convention spend: {formatCurrency(totalCost)}
      </p>
    </section>
  )
}
