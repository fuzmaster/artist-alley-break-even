import type { CalculatorState } from '../types/calculator'

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

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        typeof value === 'number' && Number.isFinite(value) ? value : 0,
      ]),
    ) as CalculatorState
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
