import { useState } from 'react'
import { BackgroundScene } from './components/BackgroundScene'
import { Receipt } from './components/Receipt'
import { ConPresetPicker } from './components/ConPresetPicker'
import { FieldGroup } from './components/FieldGroup'
import { MoneyInput } from './components/MoneyInput'
import { PlainNumber } from './components/PlainNumber'
import { RangeNumber } from './components/RangeNumber'
import { ScenarioManager } from './components/ScenarioManager'
import { JbdFooter } from './components/JbdFooter'
import { downloadCsv } from './lib/exportCsv'
import { buildShareText } from './lib/shareText'
import { trackEvent } from './lib/analytics'
import { useCalculatorState } from './hooks/useCalculatorState'

function App() {
  const {
    state, results, saveError, scenarios, pendingCon, warnings,
    setNum, setField, pickCon, loadCon, dismissPendingCon,
    handleReset, handleSaveScenario, handleLoadScenario, handleDeleteScenario,
  } = useCalculatorState()

  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleCopy = async () => {
    trackEvent('copy_summary_clicked', { conName: state.conName })
    try {
      await navigator.clipboard.writeText(buildShareText(state, results))
      setCopyStatus('Copied!')
      setTimeout(() => setCopyStatus(null), 1800)
    } catch {
      setCopyStatus('Clipboard unavailable')
    }
  }

  const handleExportCsv = () => {
    trackEvent('export_csv_clicked', { conName: state.conName })
    downloadCsv(state, results)
  }

  return (
    <div className="shell">
      <BackgroundScene />

      {/* top bar */}
      <header className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 20px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div className="mark" aria-hidden="true">✦</div>
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>Artist Alley</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>Break&#8209;Even Calc</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saveError && (
            <span style={{ fontSize: 12, color: 'var(--rose)', fontFamily: 'var(--font-mono)' }}>
              ⚠ Save failed
            </span>
          )}
          <button className="btn btn--ghost btn--sm" type="button" onClick={handleReset}>↺ Reset</button>
        </div>
      </header>

      {/* hero */}
      <section className="wrap" style={{ paddingTop: 40, paddingBottom: 8, position: 'relative', zIndex: 1 }}>
        <span className="kicker-pill">◆ Plan the table before you book the room</span>
        <h1 className="display" style={{ fontSize: 'clamp(38px,7vw,72px)', margin: '20px 0 0', maxWidth: 760 }}>
          Will your table{' '}
          <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
            <span style={{ position: 'relative', zIndex: 1 }}>make rent?</span>
            <span style={{ position: 'absolute', left: -2, right: -2, bottom: 6, height: 14, background: 'var(--accent-soft)', transform: 'skewX(-10deg)', zIndex: 0 }} aria-hidden="true" />
          </span>
        </h1>
        <p style={{ fontSize: 'clamp(15px,2.4vw,19px)', color: 'var(--text-dim)', maxWidth: 560, marginTop: 18, marginBottom: 0 }}>
          Add your con costs and what you charge. Get the exact number of sales you need to break even — before you put down a deposit.
        </p>
      </section>

      {/* main tool */}
      <section className="wrap" style={{ paddingTop: 22, paddingBottom: 40, position: 'relative', zIndex: 1 }}>
        <div className="aa-grid">

          {/* ── LEFT: form ── */}
          <form className="card" style={{ padding: '22px 22px 26px' }} onSubmit={(e) => e.preventDefault()}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: '0 0 2px' }}>Your numbers</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-dim)', margin: 0 }}>
              Round figures are fine — adjust the sliders and the receipt updates live.
            </p>

            <FieldGroup index="1" title="Which con?">
              <ConPresetPicker
                value={state.con}
                pending={pendingCon}
                onPick={pickCon}
                onLoad={loadCon}
                onKeep={dismissPendingCon}
              />
              <div>
                <label htmlFor="conName" className="field-label">Con name (optional)</label>
                <div className="input-wrap">
                  <input
                    id="conName"
                    className="field-input"
                    type="text"
                    value={state.conName}
                    placeholder="e.g. Anime Expo 2026"
                    maxLength={60}
                    onChange={(e) => setField('conName', e.target.value)}
                  />
                </div>
              </div>
            </FieldGroup>

            <FieldGroup index="2" title="Time on the floor">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <PlainNumber
                  label="Days" value={state.days} min={1} step={1}
                  onChange={(v) => setNum('days', v)}
                />
                <PlainNumber
                  label="Hours / day" value={state.hours} min={1} step={1} suffix="hr"
                  onChange={(v) => setNum('hours', v)}
                />
              </div>
            </FieldGroup>

            <FieldGroup index="3" title="Fixed costs">
              <MoneyInput
                label="Table / booth fee"
                value={state.tableFee}
                onChange={(v) => setNum('tableFee', v)}
              />
              <MoneyInput
                label="Travel (gas, flights, parking)"
                value={state.travel}
                onChange={(v) => setNum('travel', v)}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
                <MoneyInput
                  label="Lodging / night"
                  value={state.lodgingPerNight}
                  onChange={(v) => setNum('lodgingPerNight', v)}
                />
                <PlainNumber
                  label="Nights" value={state.nights} min={0} step={1}
                  onChange={(v) => setNum('nights', v)}
                />
              </div>
              <MoneyInput
                label="Extras (badge, food, supplies)"
                value={state.otherFixed}
                onChange={(v) => setNum('otherFixed', v)}
                hint="The little stuff that adds up: tape, grids, snacks, a hotel coffee."
              />
            </FieldGroup>

            <FieldGroup index="4" title="What you charge">
              <RangeNumber
                label="Average sale" value={state.avgSale}
                min={1} max={200} step={1} prefix="$"
                onChange={(v) => setNum('avgSale', v)}
                hint="Use a weighted average if you sell a mix of price points."
              />
              <RangeNumber
                label="Materials / sale" value={state.avgCost}
                min={0} max={100} step={0.5} prefix="$"
                onChange={(v) => setNum('avgCost', v)}
                hint="Your hard cost to produce one unit — printing, resin, packaging."
              />
            </FieldGroup>

            <FieldGroup index="5" title="Inventory">
              <MoneyInput
                label="Inventory cash needed"
                value={state.inventorySpend}
                onChange={(v) => setNum('inventorySpend', v)}
                hint="Upfront spend to stock your table. Not part of break-even math — just adds to your total cash-out."
              />
            </FieldGroup>

            {warnings.losingMoney && (
              <div className="note note--warn" style={{ marginTop: 16 }}>
                <strong>You lose money on every sale.</strong> Your cost exceeds your price — raise the price or lower materials before tabling.
              </div>
            )}
            {warnings.zeroPriceWarning && !warnings.losingMoney && (
              <div className="note note--warn" style={{ marginTop: 16 }}>
                Sale price is $0. Enter a price to calculate your break-even.
              </div>
            )}
            {warnings.highRisk && (
              <div className="note note--warn" style={{ marginTop: 16 }}>
                <strong>High risk.</strong> The required pace is tough for this size of con. Consider raising prices or skipping this one.
              </div>
            )}

            {/* actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
              <button className="btn btn--ghost btn--sm" type="button" onClick={handleCopy}>
                {copyStatus ?? 'Copy summary'}
              </button>
              <button className="btn btn--ghost btn--sm" type="button" onClick={handleExportCsv}>
                Download CSV
              </button>
            </div>
          </form>

          {/* ── RIGHT: receipt (desktop) ── */}
          <div className="hide-mob" style={{ position: 'sticky', top: 24 }}>
            <Receipt state={state} results={results} />
            <div style={{ marginTop: 20 }}>
              <ScenarioManager
                currentState={state}
                scenarios={scenarios}
                onSave={handleSaveScenario}
                onLoad={handleLoadScenario}
                onDelete={handleDeleteScenario}
              />
            </div>
          </div>

        </div>
      </section>

      {/* pricing rules */}
      <section className="wrap" style={{ paddingBottom: 32, position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, margin: '0 0 12px' }}>
            Quick Artist Alley rules
          </h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
            {[
              'Low-margin items need volume — high-margin items need fewer sales.',
              'If your required sales/hour feels impossible, skip the con or raise prices.',
              'Track margin, not just revenue. Busy days with bad margins are still losses.',
              'Hotel split and travel are often the hidden killers for small cons.',
            ].map((rule) => (
              <li key={rule} style={{ fontSize: 14, color: 'var(--text-dim)', display: 'flex', gap: 10 }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>◆</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── MOBILE: bottom sheet receipt ── */}
      <div className="show-mob">
        <div
          className={`sheet-backdrop${sheetOpen ? ' open' : ''}`}
          onClick={() => setSheetOpen(false)}
          aria-hidden="true"
        />
        <div className={`sheet${sheetOpen ? ' open' : ''}`} style={{ '--peek': '92px' } as React.CSSProperties}>
          <div className="sheet-card">
            <div className="sheet-grip" />
            <div className="sheet-peek" onClick={() => setSheetOpen((v) => !v)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className={`risk-dot risk-${results.risk}`} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                  {results.losingMoney ? 'Can\'t break even' : `${results.breakEvenUnits} sales to break even`}
                </span>
              </div>
              <span className={`risk-text-${results.risk}`} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em' }}>
                {results.risk} RISK {sheetOpen ? '▾' : '▴'}
              </span>
            </div>
            <div style={{ padding: '0 16px 24px' }}>
              <Receipt state={state} results={results} />
            </div>
          </div>
        </div>
      </div>

      <JbdFooter />
    </div>
  )
}

export default App
