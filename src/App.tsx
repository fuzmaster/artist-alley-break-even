import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { ResultCard } from './components/ResultCard'
import { CostInputs } from './components/CostInputs'
import { ProductInputs } from './components/ProductInputs'
import { SellingTimeInputs } from './components/SellingTimeInputs'
import { ShareSummary } from './components/ShareSummary'
import { WarningBox } from './components/WarningBox'
import { calculateResults } from './lib/calculations'
import { defaultState } from './lib/defaultState'
import { loadCalculatorState, saveCalculatorState } from './lib/localStorage'
import { buildShareText } from './lib/shareText'
import type { CalculatorState } from './types/calculator'

const unrealisticSalesPerHourThreshold = 8
const fieldsWithMinimumOne: Array<keyof CalculatorState> = [
  'roommateCount',
  'conDays',
  'alleyHoursPerDay',
]

function App() {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = loadCalculatorState()
    return saved ? { ...defaultState, ...saved } : defaultState
  })
  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  const results = useMemo(() => calculateResults(state), [state])

  const updateField = (field: keyof CalculatorState, value: number) => {
    setState((prev) => {
      const minimum = fieldsWithMinimumOne.includes(field) ? 1 : 0
      const nextState = {
        ...prev,
        [field]: Math.max(minimum, Number.isFinite(value) ? value : minimum),
      }
      saveCalculatorState(nextState)
      return nextState
    })
  }

  const handleCopySummary = async () => {
    const shareText = buildShareText(state, results)

    try {
      await navigator.clipboard.writeText(shareText)
      setCopyStatus('Summary copied to clipboard.')
    } catch {
      setCopyStatus('Clipboard not available in this browser.')
    }
  }

  const handleReset = () => {
    setState(defaultState)
    saveCalculatorState(defaultState)
    setCopyStatus('Reset to defaults.')
  }

  const showUnrealisticPaceWarning =
    !results.hasInvalidProfit &&
    results.salesPerHour >= unrealisticSalesPerHourThreshold

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Header />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="order-2 space-y-5 lg:order-1">
            <CostInputs state={state} onChange={updateField} />
            <ProductInputs
              state={state}
              profitPerItem={results.profitPerItem}
              onChange={updateField}
            />
            <SellingTimeInputs
              state={state}
              totalSellingHours={results.totalSellingHours}
              onChange={updateField}
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

          <div className="order-1 lg:order-2 lg:sticky lg:top-6">
            <ResultCard
              breakEvenUnits={results.breakEvenUnits}
              salesPerDay={results.salesPerDay}
              salesPerHour={results.salesPerHour}
              totalCost={results.totalCost}
            />
          </div>
        </div>

        <footer className="border-t border-slate-800 pt-4 text-xs text-slate-400">
          This calculator is an estimate based on your inputs and is not
          financial advice.
        </footer>
      </main>
    </div>
  )
}

export default App
