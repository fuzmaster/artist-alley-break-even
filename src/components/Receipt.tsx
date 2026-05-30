import type { CalculationResults, CalculatorState } from '../types/calculator'

const money = (v: number, decimals = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(v)

const fmt = (v: number, decimals = 0) =>
  Number.isFinite(v)
    ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : '—'

type RLineProps = { name: string; val: string; total?: boolean }
function RLine({ name, val, total }: RLineProps) {
  return (
    <div className={`r-line${total ? ' r-line--total' : ''}`}>
      <span className="r-line__name">{name}</span>
      <span className="r-line__dots" />
      <span className="r-line__val">{val}</span>
    </div>
  )
}

function RiskStamp({ risk }: { risk: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const labels = { LOW: 'LOW RISK', MEDIUM: 'MEDIUM RISK', HIGH: 'HIGH RISK' } as const
  const subs   = { LOW: 'CLEARED',  MEDIUM: 'PROCEED',     HIGH: 'CAUTION'  } as const
  return (
    <div className={`r-stamp r-stamp--${risk}`}>
      <span className="r-stamp__big">{labels[risk]}</span>
      <span className="r-stamp__small">★ {subs[risk]} ★</span>
    </div>
  )
}

function regFor(results: CalculationResults): string {
  const seed = Math.round(
    results.fixedCosts * 7 +
    (Number.isFinite(results.breakEvenUnits) ? results.breakEvenUnits : 999) * 13 +
    results.totalHours
  )
  return `AA-${String(seed % 10000).padStart(4, '0')}`
}

type ReceiptProps = {
  state: CalculatorState
  results: CalculationResults
}

export function Receipt({ state, results: r }: ReceiptProps) {
  const conName = (state.conName || '').trim()
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const regNo = regFor(r)

  return (
    <div className="receipt">
      {/* header */}
      <div className="r-center">
        <div className="r-head-mark">✦ ARTIST ALLEY ✦</div>
        <div className="r-title">BREAK&#8209;EVEN RECEIPT</div>
        <div className="r-sub">
          {conName ? conName.toUpperCase() : 'YOUR NEXT CON'} · TABLE ECONOMICS
        </div>
      </div>
      <div className="r-meta">
        <span>REG {regNo}</span>
        <span>{dateStr}</span>
      </div>

      <hr className="r-rule" />

      {/* fixed costs */}
      <div className="r-section-label">Fixed costs · this weekend</div>
      <RLine name="Table / booth" val={money(r.tableFee)} />
      <RLine name="Travel" val={money(r.travel)} />
      {r.lodging > 0 && (
        <RLine name={`Lodging (${fmt(state.nights)} nt)`} val={money(r.lodging)} />
      )}
      <RLine name="Extras / badge / food" val={money(r.otherFixed)} />
      <hr className="r-rule" />
      <RLine name="FIXED COSTS" val={money(r.fixedCosts)} total />

      <hr className="r-rule" />

      {/* per-sale economics */}
      <div className="r-section-label">Per&#8209;sale economics</div>
      <RLine name="Avg sale price"   val={money(r.avgSale, 2)} />
      <RLine name="− Materials / sale" val={money(r.avgCost, 2)} />
      <RLine
        name={`= Margin (${r.avgSale > 0 ? Math.round(r.marginPct) : 0}%)`}
        val={r.margin > 0 ? money(r.margin, 2) : '—'}
        total
      />

      <hr className="r-rule r-rule--solid" />

      {/* THE ANSWER */}
      {r.losingMoney ? (
        <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
          <div className="r-big-label" style={{ marginBottom: 6 }}>Break&#8209;even</div>
          <div className="r-big-num" style={{ fontSize: 40, color: '#c4344f' }}>NEVER</div>
          <div className="r-sub" style={{ marginTop: 8 }}>Every sale loses money at these numbers.</div>
        </div>
      ) : (
        <div className="r-bigrow">
          <div>
            <div className="r-big-label">Break&#8209;even</div>
            <div className="r-big-num">{fmt(r.breakEvenUnits)}</div>
            <div className="r-big-unit">sales to clear costs</div>
          </div>
          <div style={{ marginBottom: 6 }}>
            <RiskStamp risk={r.risk} />
          </div>
        </div>
      )}

      {/* stat grid */}
      <div className="r-stat-grid">
        <div className="r-stat">
          <div className="r-stat__k">Sales / day</div>
          <div className="r-stat__v">{r.losingMoney ? '—' : fmt(r.salesPerDay, 1)}</div>
        </div>
        <div className="r-stat">
          <div className="r-stat__k">Sales / hour</div>
          <div className="r-stat__v">{r.losingMoney ? '—' : fmt(r.salesPerHour, 1)}</div>
        </div>
        <div className="r-stat">
          <div className="r-stat__k">One sale every</div>
          <div className="r-stat__v">{r.losingMoney ? '—' : `${fmt(r.minutesPerSale, 0)}m`}</div>
        </div>
        <div className="r-stat">
          <div className="r-stat__k">Upfront cash</div>
          <div className="r-stat__v">{money(r.upfrontCash)}</div>
        </div>
      </div>

      {/* holofoil break-even moment */}
      {!r.losingMoney && r.beClock && (
        <div className="r-foil" style={{ marginTop: 14 }}>
          ✦ In profit ~ {r.beClock.day} · {r.beClock.time} ✦
        </div>
      )}

      <hr className="r-rule" style={{ marginTop: 14 }} />

      {/* barcode */}
      <div className="r-barcode" />
      <div className="r-barcode-num">
        {regNo.replace(/[^0-9]/g, '') || '000000'} · {fmt(r.totalHours)}H FLOOR
      </div>
      <div className="r-center" style={{ marginTop: 12 }}>
        <div className="r-head-mark" style={{ letterSpacing: '0.18em' }}>
          — now go make rent —
        </div>
      </div>
    </div>
  )
}
