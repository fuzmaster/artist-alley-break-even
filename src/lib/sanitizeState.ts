import { defaultState } from './defaultState'
import type { CalculatorState } from '../types/calculator'

export const sanitizeState = (nextState: Partial<CalculatorState>): CalculatorState => {
  const merged = { ...defaultState, ...nextState }

  return {
    conName: typeof merged.conName === 'string' ? merged.conName : defaultState.conName,
    productName:
      typeof merged.productName === 'string'
        ? merged.productName
        : defaultState.productName,
    tableFee: Number.isFinite(merged.tableFee) ? Math.max(0, merged.tableFee) : 0,
    badgeCost: Number.isFinite(merged.badgeCost) ? Math.max(0, merged.badgeCost) : 0,
    hotelCost: Number.isFinite(merged.hotelCost) ? Math.max(0, merged.hotelCost) : 0,
    roommateCount: Number.isFinite(merged.roommateCount)
      ? Math.max(1, merged.roommateCount)
      : 1,
    travelCost: Number.isFinite(merged.travelCost) ? Math.max(0, merged.travelCost) : 0,
    foodCost: Number.isFinite(merged.foodCost) ? Math.max(0, merged.foodCost) : 0,
    displayCost: Number.isFinite(merged.displayCost) ? Math.max(0, merged.displayCost) : 0,
    inventoryCost: Number.isFinite(merged.inventoryCost)
      ? Math.max(0, merged.inventoryCost)
      : 0,
    emergencyBuffer: Number.isFinite(merged.emergencyBuffer)
      ? Math.max(0, merged.emergencyBuffer)
      : 0,
    averageSalePrice: Number.isFinite(merged.averageSalePrice)
      ? Math.max(0, merged.averageSalePrice)
      : 0,
    averageItemCost: Number.isFinite(merged.averageItemCost)
      ? Math.max(0, merged.averageItemCost)
      : 0,
    conDays: Number.isFinite(merged.conDays) ? Math.max(1, merged.conDays) : 1,
    alleyHoursPerDay: Number.isFinite(merged.alleyHoursPerDay)
      ? Math.max(1, merged.alleyHoursPerDay)
      : 1,
  }
}
