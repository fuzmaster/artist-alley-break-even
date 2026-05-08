import type { CalculatorState } from '../types/calculator'
import { sanitizeState } from './sanitizeState'

const STORAGE_KEY = 'artist-alley-break-even-state'

export const loadCalculatorState = (): CalculatorState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<CalculatorState>
    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }

    return sanitizeState(parsed)
  } catch {
    return null
  }
}

export const saveCalculatorState = (state: CalculatorState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // no-op
  }
}
