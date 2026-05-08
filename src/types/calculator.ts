export type CalculatorState = {
  conName: string
  productName: string
  tableFee: number
  badgeCost: number
  hotelCost: number
  roommateCount: number
  travelCost: number
  foodCost: number
  displayCost: number
  inventoryCost: number
  emergencyBuffer: number
  averageSalePrice: number
  averageItemCost: number
  conDays: number
  alleyHoursPerDay: number
}

export type ProductPreset = {
  label: string
  averageSalePrice: number
  averageItemCost: number
}

export type CalculationResults = {
  fixedCosts: number
  upfrontCashNeeded: number
  profitPerItem: number
  requiredProfitPerHour: number
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  totalSellingHours: number
  hasInvalidProfit: boolean
}
