import { useEffect, useMemo, useRef, useState } from 'react'
import { Header } from './components/Header'
import { ResultCard } from './components/ResultCard'
import { CostInputs } from './components/CostInputs'
import { ProductInputs } from './components/ProductInputs'
import { SellingTimeInputs } from './components/SellingTimeInputs'
import { ShareSummary } from './components/ShareSummary'
import { ShareCard } from './components/ShareCard'
import { PricingInsight } from './components/PricingInsight'
import { WarningBox } from './components/WarningBox'
import { calculateResults } from './lib/calculations'
import { defaultState } from './lib/defaultState'
import { loadCalculatorState, saveCalculatorState } from './lib/localStorage'
import { sanitizeState } from './lib/sanitizeState'
import { buildShareText } from './lib/shareText'
import { trackEvent } from './lib/analytics'
import type { CalculatorState } from './types/calculator'

const UNREALISTIC_SALES_PER_HOUR_THRESHOLD = 8
const HIGH_RISK_LEVEL = 'HIGH RISK'
type NumericField = Exclude<keyof CalculatorState, 'conName' | 'productName'>

function App() {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = loadCalculatorState()
    return saved ? sanitizeState(saved) : defaultState
  })
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const hasTrackedHighRiskRef = useRef(false)

  const results = useMemo(() => calculateResults(state), [state])

  useEffect(() => {
    if (results.riskLevel === HIGH_RISK_LEVEL && !hasTrackedHighRiskRef.current) {
      trackEvent('high_risk_result', {
        salesPerHour: results.salesPerHour,
        requiredProfitPerHour: results.requiredProfitPerHour,
        breakEvenUnits: results.breakEvenUnits,
      })
      hasTrackedHighRiskRef.current = true
      return
    }

    if (results.riskLevel !== HIGH_RISK_LEVEL) {
      hasTrackedHighRiskRef.current = false
    }
  }, [results.breakEvenUnits, results.requiredProfitPerHour, results.riskLevel, results.salesPerHour])

  const updateNumberField = (field: NumericField, value: number) => {
    setState((prev) => {
      const nextState = sanitizeState({
        ...prev,
        [field]: Number.isFinite(value) ? value : 0,
      })
      saveCalculatorState(nextState)
      return nextState
    })
  }

  const updateTextField = (
    field: Extract<keyof CalculatorState, 'conName' | 'productName'>,
    value: string,
  ) => {
    setState((prev) => {
      const nextState = sanitizeState({
        ...prev,
        [field]: value,
      })
      saveCalculatorState(nextState)
      return nextState
    })
  }

  const handlePresetSelect = (
    productName: string,
    averageSalePrice: number,
    averageItemCost: number,
  ) => {
    trackEvent('preset_selected', {
      productName,
      averageSalePrice,
      averageItemCost,
    })

    setState((prev) => {
      const nextState = sanitizeState({
        ...prev,
        productName,
        averageSalePrice,
        averageItemCost,
      })
      saveCalculatorState(nextState)
      return nextState
    })
  }

  const handleCopySummary = async () => {
    trackEvent('copy_summary_clicked', {
      conName: state.conName,
      productName: state.productName,
      breakEvenUnits: results.breakEvenUnits,
    })

    const shareText = buildShareText(state, results)

    try {
      await navigator.clipboard.writeText(shareText)
      setCopyStatus('Summary copied to clipboard.')
    } catch {
      setCopyStatus('Clipboard not available in this browser.')
    }
  }

  const handleReset = () => {
    trackEvent('reset_clicked')

    const nextState = sanitizeState(defaultState)
    setState(nextState)
    saveCalculatorState(nextState)
    setCopyStatus('Reset to defaults.')
  }

  const showUnrealisticPaceWarning =
    !results.hasInvalidProfit &&
    results.salesPerHour >= UNREALISTIC_SALES_PER_HOUR_THRESHOLD

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Header />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="order-2 space-y-5 lg:order-1">
            <CostInputs state={state} onChange={updateNumberField} />
            <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Convention Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="conName"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Con name
                  </label>
                  <input
                    id="conName"
                    type="text"
                    value={state.conName}
                    onChange={(event) => updateTextField('conName', event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner outline-none ring-0 transition focus:border-fuchsia-400"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Product name
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={state.productName}
                    onChange={(event) => updateTextField('productName', event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner outline-none ring-0 transition focus:border-fuchsia-400"
                  />
                </div>
              </div>
            </section>
            <ProductInputs
              state={state}
              profitPerItem={results.profitPerItem}
              onChange={updateNumberField}
              onPresetSelect={handlePresetSelect}
            />
            <SellingTimeInputs
              state={state}
              totalSellingHours={results.totalSellingHours}
              onChange={updateNumberField}
            />

            <ShareSummary
              onCopy={handleCopySummary}
              onReset={handleReset}
              copyStatus={copyStatus}
            />

            {results.hasInvalidProfit ? (
              <WarningBox message="You lose money on every sale. Raise your price or lower your production cost before tabling." />
            ) : null}

            {showUnrealisticPaceWarning ? (
              <WarningBox message="This sales pace may be unrealistic. Consider raising prices, lowering costs, or skipping this con." />
            ) : null}
          </section>

          <div className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-6">
            <ResultCard
              productName={state.productName}
              breakEvenUnits={results.breakEvenUnits}
              salesPerDay={results.salesPerDay}
              salesPerHour={results.salesPerHour}
              upfrontCashNeeded={results.upfrontCashNeeded}
              requiredProfitPerHour={results.requiredProfitPerHour}
              hasInvalidProfit={results.hasInvalidProfit}
              riskLevel={results.riskLevel}
            />
            <ShareCard
              conName={state.conName}
              productName={state.productName}
              breakEvenUnits={results.breakEvenUnits}
              salesPerDay={results.salesPerDay}
              salesPerHour={results.salesPerHour}
              requiredProfitPerHour={results.requiredProfitPerHour}
              upfrontCashNeeded={results.upfrontCashNeeded}
              profitPerItem={results.profitPerItem}
              hasInvalidProfit={results.hasInvalidProfit}
            />
            <PricingInsight
              breakEvenUnits={results.breakEvenUnits}
              breakEvenAtOneDollarMore={results.breakEvenAtOneDollarMore}
              breakEvenAtThreeDollarsMore={results.breakEvenAtThreeDollarsMore}
              breakEvenAtFiveDollarsMore={results.breakEvenAtFiveDollarsMore}
              profitPerItem={results.profitPerItem}
            />
            <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 text-sm text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Why inventory is separate from break-even math
              </p>
              <div className="mt-2 space-y-1">
                <p>Item cost is already counted in profit per sale, so break-even units use your fixed costs only.</p>
                <p>Inventory cash is still real money you need upfront before the event starts.</p>
              </div>
            </section>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h2 className="text-lg font-semibold text-white">Quick Artist Alley Pricing Rules</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Low-margin items need volume.</li>
            <li>• High table costs require higher-price items or bundles.</li>
            <li>• Track profit, not just revenue.</li>
            <li>• If your required sales per hour feels impossible, skip the con or raise prices.</li>
          </ul>
        </section>

        <footer className="border-t border-slate-800 pt-4 text-xs text-slate-400">
          <div className="space-y-1">
            <p>This calculator is an estimate based on your inputs and is not financial advice.</p>
            <p>Jacob Britten 2026 jacobbritten.com</p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
