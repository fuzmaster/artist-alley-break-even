import type { CalculationResults, CalculatorState } from '../types/calculator'

const safeDivisor = (value: number, fallback = 1): number =>
  value > 0 ? value : fallback

const safeRound = (value: number): number =>
  Number.isFinite(value) ? Number.parseFloat(value.toFixed(2)) : 0

export const calculateResults = (state: CalculatorState): CalculationResults => {
  const roommateCount = safeDivisor(state.roommateCount)
  const conDays = safeDivisor(state.conDays)
  const alleyHoursPerDay = safeDivisor(state.alleyHoursPerDay)

  const fixedCosts =
    state.tableFee +
    state.badgeCost +
    state.hotelCost / roommateCount +
    state.travelCost +
    state.foodCost +
    state.displayCost +
    state.emergencyBuffer
  const upfrontCashNeeded = fixedCosts + state.inventoryCost

  const profitPerItem = state.averageSalePrice - state.averageItemCost
  const hasInvalidProfit = profitPerItem <= 0

  const breakEvenUnits =
    hasInvalidProfit || fixedCosts <= 0 ? 0 : Math.ceil(fixedCosts / profitPerItem)
  const totalSellingHours = conDays * alleyHoursPerDay
  const requiredProfitPerHour = fixedCosts / safeDivisor(totalSellingHours)

  const salesPerDay = breakEvenUnits > 0 ? breakEvenUnits / conDays : 0
  const salesPerHour =
    breakEvenUnits > 0 && totalSellingHours > 0
      ? breakEvenUnits / totalSellingHours
      : 0

  return {
    fixedCosts: safeRound(fixedCosts),
    upfrontCashNeeded: safeRound(upfrontCashNeeded),
    profitPerItem: safeRound(profitPerItem),
    requiredProfitPerHour: safeRound(requiredProfitPerHour),
    breakEvenUnits,
    salesPerDay: safeRound(salesPerDay),
    salesPerHour: safeRound(salesPerHour),
    totalSellingHours: safeRound(totalSellingHours),
    hasInvalidProfit,
  }
}
