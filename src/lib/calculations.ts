import type { BreakEvenClock, CalculationResults, CalculatorState, RiskLevel } from '../types/calculator'
import { CON_PRESETS } from './conPresets'

function safeNum(v: number, fallback = 0): number {
  return Number.isFinite(v) && v > 0 ? v : fallback
}

function round2(v: number): number {
  return Number.isFinite(v) ? Math.round(v * 100) / 100 : 0
}

function breakEvenClock(
  fraction: number,
  days: number,
  hoursPerDay: number,
): BreakEvenClock {
  const totalHours = days * hoursPerDay
  const hoursIn = Math.min(fraction, 1) * totalHours
  const dayIndex = Math.min(Math.floor(hoursIn / hoursPerDay), days - 1)
  const hourInDay = hoursIn - dayIndex * hoursPerDay
  const h = Math.floor(hourInDay)
  const m = Math.round((hourInDay - h) * 60)
  const timeStr = m > 0 ? `${h}h ${m}m in` : `${h}h in`
  return { day: `Day ${dayIndex + 1}`, time: timeStr }
}

export const calculateResults = (state: CalculatorState): CalculationResults => {
  const days = Math.max(1, Math.round(safeNum(state.days, 1)) || 1)
  const hours = safeNum(state.hours, 1) > 0 ? safeNum(state.hours, 1) : 1
  const totalHours = days * hours

  const tableFee = safeNum(state.tableFee)
  const travel = safeNum(state.travel)
  const lodging = safeNum(state.lodgingPerNight) * safeNum(state.nights)
  const otherFixed = safeNum(state.otherFixed)
  const fixedCosts = tableFee + travel + lodging + otherFixed

  const avgSale = safeNum(state.avgSale)
  const avgCost = safeNum(state.avgCost)
  const margin = avgSale - avgCost
  const marginPct = avgSale > 0 ? (margin / avgSale) * 100 : 0

  const inventorySpend = safeNum(state.inventorySpend)
  const upfrontCash = fixedCosts + inventorySpend

  const losingMoney = margin <= 0
  const breakEvenUnitsRaw = losingMoney || fixedCosts <= 0 ? 0 : fixedCosts / margin
  const breakEvenUnits = losingMoney || fixedCosts <= 0 ? 0 : Math.ceil(breakEvenUnitsRaw)

  const salesPerDay = breakEvenUnitsRaw > 0 ? round2(breakEvenUnitsRaw / days) : 0
  const salesPerHour = breakEvenUnitsRaw > 0 ? round2(breakEvenUnitsRaw / totalHours) : 0
  const minutesPerSale = salesPerHour > 0 ? round2(60 / salesPerHour) : 0

  // Pace ceiling — how hard the room needs to be worked relative to
  // a realistic sustainable pace for this con size.
  const pace = (CON_PRESETS[state.con] ?? CON_PRESETS.mid).pace
  const paceLoad = salesPerHour > 0 ? salesPerHour / pace : 0

  // Risk score: pace load (0-3) + margin health penalty (0-2)
  let riskScore = 0
  if (!losingMoney) {
    if (paceLoad <= 0.45) riskScore = 0
    else if (paceLoad <= 0.8) riskScore = 1
    else if (paceLoad <= 1.15) riskScore = 2
    else riskScore = 3
    if (marginPct < 50) riskScore += 1
    if (marginPct < 30) riskScore += 1
  } else {
    riskScore = 5
  }

  const risk: RiskLevel = losingMoney ? 'HIGH' : riskScore <= 1 ? 'LOW' : riskScore <= 2 ? 'MEDIUM' : 'HIGH'

  // When in the weekend does the artist cross into profit?
  // Uses pace ceiling as a realistic arrival-rate estimate.
  const beFraction =
    losingMoney || breakEvenUnitsRaw <= 0
      ? Infinity
      : Math.min(1, breakEvenUnitsRaw / (pace * totalHours))

  const beClock =
    Number.isFinite(beFraction) ? breakEvenClock(beFraction, days, hours) : null

  return {
    days,
    hours,
    totalHours,
    tableFee,
    travel,
    lodging,
    otherFixed,
    fixedCosts: round2(fixedCosts),
    avgSale,
    avgCost,
    margin: round2(margin),
    marginPct: round2(marginPct),
    inventorySpend,
    upfrontCash: round2(upfrontCash),
    losingMoney,
    breakEvenUnits,
    salesPerDay,
    salesPerHour,
    minutesPerSale,
    pace,
    paceLoad: round2(paceLoad),
    risk,
    riskScore,
    beFraction: Number.isFinite(beFraction) ? round2(beFraction) : 1,
    beClock,
  }
}
