import { useState } from 'react'
import { Header } from './components/Header'
import { ResultCard } from './components/ResultCard'
import { CostInputs } from './components/CostInputs'
import { ProductInputs } from './components/ProductInputs'
import { SellingTimeInputs } from './components/SellingTimeInputs'
import { ShareSummary } from './components/ShareSummary'
import { ShareCard } from './components/ShareCard'
import { PricingInsight } from './components/PricingInsight'
import { WarningBox } from './components/WarningBox'
import { ScenarioManager } from './components/ScenarioManager'
import { calcBreakEvenWithPriceIncrease } from './lib/calculations'
import { buildShareText } from './lib/shareText'
import { downloadCsv } from './lib/exportCsv'
import { trackEvent } from './lib/analytics'
import { useCalculatorState } from './hooks/useCalculatorState'

function App() {
  const {
    state,
    results,
    saveError,
    scenarios,
    warnings,
    updateNumberField,
    updateTextField,
    handlePresetSelect,
    handleReset,
    handleSaveScenario,
    handleLoadScenario,
    handleDeleteScenario,
  } = useCalculatorState()

  const [copyStatus, setCopyStatus] = useState<string | null>(null)

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

  const handleExportCsv = () => {
    trackEvent('export_csv_clicked', { conName: state.conName })
    downloadCsv(state, results)
  }

  const handleResetWithStatus = () => {
    handleReset()
    setCopyStatus('Reset to defaults.')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main aria-label="Artist Alley Break-Even Calculator" className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Header />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="order-2 space-y-5 lg:order-1">
            <CostInputs state={state} onChange={updateNumberField} />
            <ScenarioManager
              currentState={state}
              scenarios={scenarios}
              onSave={handleSaveScenario}
              onLoad={handleLoadScenario}
              onDelete={handleDeleteScenario}
            />
            <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <h2 className="text-lg font-semibold text-white">Convention Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="conName" className="block text-sm font-medium text-slate-200">
                    Con name
                  </label>
                  <input
                    id="conName"
                    type="text"
                    value={state.conName}
                    onChange={(event) => updateTextField('conName', event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner outline-none transition focus:border-fuchsia-400 focus-visible:ring-2 focus-visible:ring-fuchsia-500/40"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="productName" className="block text-sm font-medium text-slate-200">
                    Product name
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={state.productName}
                    onChange={(event) => updateTextField('productName', event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner outline-none transition focus:border-fuchsia-400 focus-visible:ring-2 focus-visible:ring-fuchsia-500/40"
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
              onReset={handleResetWithStatus}
              onExportCsv={handleExportCsv}
              copyStatus={copyStatus}
            />

            {warnings.zeroPriceWarning ? (
              <WarningBox message="Sale price is $0. Enter a price to calculate your break-even." />
            ) : null}

            {warnings.zeroCostWarning ? (
              <WarningBox message="Production cost is $0. Double-check this — free items are rare." />
            ) : null}

            {results.hasInvalidProfit ? (
              <WarningBox message="You lose money on every sale. Raise your price or lower your production cost before tabling." />
            ) : null}

            {warnings.unrealisticPaceWarning ? (
              <WarningBox message="This sales pace may be unrealistic. Consider raising prices, lowering costs, or skipping this con." />
            ) : null}

            {saveError ? (
              <WarningBox message="Your changes couldn't be saved — browser storage may be full or blocked. Changes will be lost on refresh." />
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
              onCalculateCustomDelta={(delta) => calcBreakEvenWithPriceIncrease(state, delta)}
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

        <p className="text-xs text-slate-500 px-1">
          This calculator is an estimate based on your inputs and is not financial advice.
        </p>

        <footer className="border-t border-[rgba(0,255,200,0.18)] bg-[#0B0D14] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.06em] text-white/50">
              Built by{' '}
              <a
                href="https://jacobbritten.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00FFC8] no-underline hover:underline"
              >
                Jacob Britten
              </a>{' '}
              &mdash; Media Systems Architect
            </p>
            <nav aria-label="Jacob Britten" className="flex flex-wrap gap-5">
              {[
                { href: 'https://jacobbritten.com', label: 'Portfolio' },
                { href: 'https://jacobbritten.com/projects.html', label: 'Projects' },
                { href: 'https://jacobbritten.com/lab.html', label: 'The Lab' },
                { href: 'https://ko-fi.com/jacobbritten', label: 'Ko-fi' },
                { href: 'https://www.paypal.com/donate/?hosted_button_id=47A4JJ4WNBY9U', label: 'PayPal' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[0.68rem] uppercase tracking-[0.07em] text-white/70 no-underline transition-colors hover:text-[#00FFC8] focus-visible:text-[#00FFC8] outline-none"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
