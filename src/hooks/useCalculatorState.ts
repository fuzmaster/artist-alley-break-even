import { useMemo, useState } from 'react'
import { calculateResults } from '../lib/calculations'
import { defaultState } from '../lib/defaultState'
import { loadCalculatorState, saveCalculatorState } from '../lib/localStorage'
import { loadScenarios, saveScenario, deleteScenario } from '../lib/scenarios'
import { sanitizeState } from '../lib/sanitizeState'
import { trackEvent } from '../lib/analytics'
import { CON_PRESETS } from '../lib/conPresets'
import type { CalculatorState, ConSize } from '../types/calculator'
import type { SavedScenario } from '../lib/scenarios'

export function useCalculatorState() {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = loadCalculatorState()
    return saved ? sanitizeState(saved) : defaultState
  })
  const [saveError, setSaveError] = useState(false)
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadScenarios())
  const [pendingCon, setPendingCon] = useState<ConSize | null>(null)

  const results = useMemo(() => calculateResults(state), [state])

  const persist = (next: CalculatorState) => {
    const ok = saveCalculatorState(next)
    setSaveError(!ok)
  }

  const setField = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => {
      const next = sanitizeState({ ...prev, [field]: value })
      persist(next)
      return next
    })
  }

  const setNum = (field: keyof CalculatorState, value: number) => {
    setField(field, (Number.isFinite(value) ? value : 0) as CalculatorState[typeof field])
  }

  const pickCon = (con: ConSize) => {
    if (con === state.con) return
    setState((prev) => {
      const next = sanitizeState({ ...prev, con })
      persist(next)
      return next
    })
    setPendingCon(con)
  }

  const loadCon = (con: ConSize) => {
    const { label: _l, blurb: _b, pace: _p, ...vals } = CON_PRESETS[con]
    setState((prev) => {
      const next = sanitizeState({ ...prev, con, ...vals })
      persist(next)
      return next
    })
    setPendingCon(null)
    trackEvent('preset_loaded', { con })
  }

  const dismissPendingCon = () => setPendingCon(null)

  const handleReset = () => {
    trackEvent('reset_clicked')
    const next = sanitizeState(defaultState)
    setState(next)
    persist(next)
    setPendingCon(null)
  }

  const handleSaveScenario = (name: string) => {
    const scenario = saveScenario(name, state)
    if (scenario) setScenarios(loadScenarios())
  }

  const handleLoadScenario = (scenario: SavedScenario) => {
    const next = sanitizeState(scenario.state)
    setState(next)
    persist(next)
  }

  const handleDeleteScenario = (id: string) => {
    deleteScenario(id)
    setScenarios(loadScenarios())
  }

  const warnings = {
    losingMoney: results.losingMoney,
    zeroPriceWarning: state.avgSale === 0,
    highRisk: results.risk === 'HIGH' && !results.losingMoney,
  }

  return {
    state, results, saveError, scenarios, pendingCon, warnings,
    setNum, setField, pickCon, loadCon, dismissPendingCon,
    handleReset, handleSaveScenario, handleLoadScenario, handleDeleteScenario,
  }
}
