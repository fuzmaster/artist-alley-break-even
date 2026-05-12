import { useEffect, useMemo, useRef, useState } from 'react'
import { calculateResults } from '../lib/calculations'
import { defaultState } from '../lib/defaultState'
import { loadCalculatorState, saveCalculatorState } from '../lib/localStorage'
import { loadScenarios, saveScenario, deleteScenario } from '../lib/scenarios'
import { sanitizeState } from '../lib/sanitizeState'
import { trackEvent } from '../lib/analytics'
import type { CalculatorState } from '../types/calculator'
import type { SavedScenario } from '../lib/scenarios'

type NumericField = Exclude<keyof CalculatorState, 'conName' | 'productName'>

const UNREALISTIC_SALES_PER_HOUR_THRESHOLD = 8
const HIGH_RISK_LEVEL = 'HIGH RISK'

export function useCalculatorState() {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = loadCalculatorState()
    return saved ? sanitizeState(saved) : defaultState
  })
  const [saveError, setSaveError] = useState(false)
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadScenarios())
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

  const persistState = (nextState: CalculatorState) => {
    const saved = saveCalculatorState(nextState)
    setSaveError(!saved)
  }

  const updateNumberField = (field: NumericField, value: number) => {
    setState((prev) => {
      const nextState = sanitizeState({
        ...prev,
        [field]: Number.isFinite(value) ? value : 0,
      })
      persistState(nextState)
      return nextState
    })
  }

  const updateTextField = (
    field: Extract<keyof CalculatorState, 'conName' | 'productName'>,
    value: string,
  ) => {
    setState((prev) => {
      const nextState = sanitizeState({ ...prev, [field]: value })
      persistState(nextState)
      return nextState
    })
  }

  const handlePresetSelect = (
    productName: string,
    averageSalePrice: number,
    averageItemCost: number,
  ) => {
    trackEvent('preset_selected', { productName, averageSalePrice, averageItemCost })
    setState((prev) => {
      const nextState = sanitizeState({ ...prev, productName, averageSalePrice, averageItemCost })
      persistState(nextState)
      return nextState
    })
  }

  const handleReset = () => {
    trackEvent('reset_clicked')
    const nextState = sanitizeState(defaultState)
    setState(nextState)
    persistState(nextState)
  }

  const handleSaveScenario = (name: string) => {
    const scenario = saveScenario(name, state)
    if (scenario) setScenarios(loadScenarios())
  }

  const handleLoadScenario = (scenario: SavedScenario) => {
    const nextState = sanitizeState(scenario.state)
    setState(nextState)
    persistState(nextState)
  }

  const handleDeleteScenario = (id: string) => {
    deleteScenario(id)
    setScenarios(loadScenarios())
  }

  const warnings = {
    zeroPriceWarning: state.averageSalePrice === 0,
    zeroCostWarning: state.averageItemCost === 0 && state.averageSalePrice > 0,
    unrealisticPaceWarning:
      !results.hasInvalidProfit &&
      results.salesPerHour >= UNREALISTIC_SALES_PER_HOUR_THRESHOLD,
  }

  return {
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
  }
}
