import { defaultState } from './defaultState'
import type { CalculatorState, ConSize } from '../types/calculator'

const CON_SIZES: ConSize[] = ['small', 'mid', 'major']

function clampNum(v: unknown, min = 0): number {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? Math.max(min, n) : min
}

export const sanitizeState = (next: Partial<CalculatorState>): CalculatorState => {
  const merged = { ...defaultState, ...next }
  const con: ConSize = CON_SIZES.includes(merged.con as ConSize)
    ? (merged.con as ConSize)
    : defaultState.con
  const conName =
    typeof merged.conName === 'string' ? merged.conName.trim().slice(0, 60) : ''

  return {
    con,
    conName,
    days: clampNum(merged.days, 1),
    hours: clampNum(merged.hours, 1),
    tableFee: clampNum(merged.tableFee),
    travel: clampNum(merged.travel),
    lodgingPerNight: clampNum(merged.lodgingPerNight),
    nights: clampNum(merged.nights),
    otherFixed: clampNum(merged.otherFixed),
    avgSale: clampNum(merged.avgSale),
    avgCost: clampNum(merged.avgCost),
    inventorySpend: clampNum(merged.inventorySpend),
  }
}
