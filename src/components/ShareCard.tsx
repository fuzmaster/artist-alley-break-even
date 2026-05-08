import { formatCurrency } from '../lib/formatCurrency'

type ShareCardProps = {
  conName: string
  productName: string
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  requiredProfitPerHour: number
  upfrontCashNeeded: number
  profitPerItem: number
  hasInvalidProfit: boolean
}

const getShareProductLabel = (productName: string): string => {
  const normalizedProductName = productName.trim()
  return normalizedProductName ? `${normalizedProductName} sales` : 'item sales'
}

export function ShareCard({
  conName,
  productName,
  breakEvenUnits,
  salesPerDay,
  salesPerHour,
  requiredProfitPerHour,
  upfrontCashNeeded,
  profitPerItem,
  hasInvalidProfit,
}: ShareCardProps) {
  const normalizedConName = conName.trim() || 'your con'
  const normalizedProductName = productName.trim() || 'item'
  const shareProductLabel = getShareProductLabel(productName)

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/50">
      <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-200">
        Share Card
      </p>
      {hasInvalidProfit ? (
        <p className="mt-3 text-sm text-slate-100">
          At {normalizedConName}, you cannot break even with this {normalizedProductName} price
          because item cost is higher than your sale price. Raise your price or lower production
          cost before tabling.
        </p>
      ) : (
        <>
          <p className="mt-3 text-xl font-bold text-white">
            At {normalizedConName}, you need {breakEvenUnits} {shareProductLabel} just to break
            even.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Sales per day</p>
              <p className="mt-1 font-semibold">{salesPerDay}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Sales per hour</p>
              <p className="mt-1 font-semibold">{salesPerHour}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Profit per item</p>
              <p className="mt-1 font-semibold">{formatCurrency(profitPerItem)}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
              <p className="text-xs text-slate-400">Required profit per hour</p>
              <p className="mt-1 font-semibold">{formatCurrency(requiredProfitPerHour)}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 sm:col-span-2 lg:col-span-2">
              <p className="text-xs text-slate-400">Upfront cash needed</p>
              <p className="mt-1 font-semibold">{formatCurrency(upfrontCashNeeded)}</p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
