export type CalculatorState = {
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
  totalCost: number
  profitPerItem: number
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  totalSellingHours: number
  hasInvalidProfit: boolean
}
