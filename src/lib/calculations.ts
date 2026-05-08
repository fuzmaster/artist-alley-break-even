import type { CalculationResults, CalculatorState, RiskLevel } from '../types/calculator'

const safeDivisor = (value: number, fallback = 1): number =>
  value > 0 ? value : fallback

const safeRound = (value: number): number =>
  Number.isFinite(value) ? Number.parseFloat(value.toFixed(2)) : 0

const getRiskLevel = (salesPerHour: number, hasInvalidProfit: boolean): RiskLevel | null => {
  if (hasInvalidProfit) {
    return null
  }

  if (salesPerHour < 2) {
    return 'LOW RISK'
  }

  if (salesPerHour < 6) {
    return 'MEDIUM RISK'
  }

  return 'HIGH RISK'
}

export const calculateResults = (state: CalculatorState): CalculationResults => {
  const roommateCount = safeDivisor(state.roommateCount)
  const conDays = safeDivisor(state.conDays)
  const alleyHoursPerDay = safeDivisor(state.alleyHoursPerDay)

  // Fixed costs are the convention/event expenses you must recoup from sales.
  const fixedCosts =
    state.tableFee +
    state.badgeCost +
    state.hotelCost / roommateCount +
    state.travelCost +
    state.foodCost +
    state.displayCost +
    state.emergencyBuffer
  // Upfront cash includes fixed costs plus inventory cash paid before the event.
  const upfrontCashNeeded = fixedCosts + state.inventoryCost

  // Profit per item is sale price minus item cost, used for break-even math.
  const profitPerItem = state.averageSalePrice - state.averageItemCost
  const hasInvalidProfit = profitPerItem <= 0

  // Break-even units are how many items you must sell to recover fixed costs.
  const breakEvenUnits =
    hasInvalidProfit || fixedCosts <= 0 ? 0 : Math.ceil(fixedCosts / profitPerItem)
  const breakEvenWithPriceIncrease = (priceIncrease: number): number => {
    const increasedProfit = state.averageSalePrice + priceIncrease - state.averageItemCost

    return increasedProfit > 0 && fixedCosts > 0
      ? Math.ceil(fixedCosts / increasedProfit)
      : 0
  }
  const breakEvenAtOneDollarMore = breakEvenWithPriceIncrease(1)
  const breakEvenAtThreeDollarsMore = breakEvenWithPriceIncrease(3)
  const breakEvenAtFiveDollarsMore = breakEvenWithPriceIncrease(5)
  const totalSellingHours = conDays * alleyHoursPerDay
  const requiredProfitPerHour = fixedCosts / safeDivisor(totalSellingHours)

  const salesPerDay = breakEvenUnits > 0 ? breakEvenUnits / conDays : 0
  const salesPerHour =
    breakEvenUnits > 0 && totalSellingHours > 0
      ? breakEvenUnits / totalSellingHours
      : 0
  const roundedSalesPerHour = safeRound(salesPerHour)

  return {
    fixedCosts: safeRound(fixedCosts),
    upfrontCashNeeded: safeRound(upfrontCashNeeded),
    profitPerItem: safeRound(profitPerItem),
    requiredProfitPerHour: safeRound(requiredProfitPerHour),
    breakEvenUnits,
    breakEvenAtOneDollarMore,
    breakEvenAtThreeDollarsMore,
    breakEvenAtFiveDollarsMore,
    salesPerDay: safeRound(salesPerDay),
    salesPerHour: roundedSalesPerHour,
    totalSellingHours: safeRound(totalSellingHours),
    hasInvalidProfit,
    riskLevel: getRiskLevel(roundedSalesPerHour, hasInvalidProfit),
  }
}
