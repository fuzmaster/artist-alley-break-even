import { useState } from 'react'
import type { SavedScenario } from '../lib/scenarios'
import type { CalculatorState } from '../types/calculator'

type ScenarioManagerProps = {
  currentState: CalculatorState
  scenarios: SavedScenario[]
  onSave: (name: string) => void
  onLoad: (scenario: SavedScenario) => void
  onDelete: (id: string) => void
}

export function ScenarioManager({
  currentState,
  scenarios,
  onSave,
  onLoad,
  onDelete,
}: ScenarioManagerProps) {
  const [name, setName] = useState(currentState.conName ?? '')
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onSave(trimmed)
    setIsOpen(false)
  }

  const formatDate = (ts: number) =>
    new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(ts))

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Saved Scenarios</h2>
        <button
          type="button"
          onClick={() => { setName(currentState.conName ?? ''); setIsOpen((v) => !v) }}
          aria-expanded={isOpen}
          className="rounded-xl border border-fuchsia-500/50 bg-fuchsia-500/10 px-3 py-1.5 text-sm font-semibold text-fuchsia-200 transition hover:bg-fuchsia-500/20"
        >
          Save current
        </button>
      </div>

      {isOpen ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
            placeholder="Scenario name…"
            aria-label="Scenario name"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-fuchsia-400"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="rounded-xl border border-fuchsia-500/50 bg-fuchsia-500/20 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/35 disabled:opacity-40"
          >
            Save
          </button>
        </div>
      ) : null}

      {scenarios.length === 0 ? (
        <p className="text-sm text-slate-400">No saved scenarios yet. Save your current setup to compare cons later.</p>
      ) : (
        <ul className="space-y-2" aria-label="Saved scenarios">
          {scenarios.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{s.name}</p>
                <p className="text-xs text-slate-400">{formatDate(s.savedAt)}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(s)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-400"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(s.id)}
                  aria-label={`Delete scenario ${s.name}`}
                  className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
