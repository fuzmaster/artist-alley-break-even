import type { CalculatorState } from '../types/calculator'
import { sanitizeState } from './sanitizeState'

const SCENARIOS_KEY = 'artist-alley-scenarios'

export type SavedScenario = {
  id: string
  name: string
  savedAt: number
  state: CalculatorState
}

export const loadScenarios = (): SavedScenario[] => {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is SavedScenario =>
        typeof s === 'object' && s !== null &&
        typeof s.id === 'string' &&
        typeof s.name === 'string' &&
        typeof s.savedAt === 'number' &&
        typeof s.state === 'object'
      )
      .map((s) => ({ ...s, state: sanitizeState(s.state) }))
  } catch {
    return []
  }
}

export const saveScenario = (name: string, state: CalculatorState): SavedScenario | null => {
  try {
    const scenarios = loadScenarios()
    const scenario: SavedScenario = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      savedAt: Date.now(),
      state,
    }
    scenarios.push(scenario)
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
    return scenario
  } catch {
    return null
  }
}

export const deleteScenario = (id: string): boolean => {
  try {
    const scenarios = loadScenarios().filter((s) => s.id !== id)
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
    return true
  } catch {
    return false
  }
}
