import { describe, expect, it } from 'vitest'
import { calculateResults } from './calculations'
import { defaultState } from './defaultState'
import type { CalculatorState } from '../types/calculator'

const makeState = (overrides: Partial<CalculatorState> = {}): CalculatorState => ({
  ...defaultState,
  ...overrides,
})

describe('calculateResults', () => {
  describe('basic break-even math', () => {
    it('calculates fixed costs correctly', () => {
      const state = makeState({
        tableFee: 300,
        badgeCost: 60,
        hotelCost: 500,
        roommateCount: 2,
        travelCost: 120,
        foodCost: 100,
        displayCost: 150,
        emergencyBuffer: 150,
        inventoryCost: 0,
      })
      const result = calculateResults(state)
      // hotelCost is split: 500 / 2 = 250
      expect(result.fixedCosts).toBe(300 + 60 + 250 + 120 + 100 + 150 + 150)
    })

    it('includes inventory in upfront cash but not fixed costs', () => {
      const state = makeState({ inventoryCost: 450 })
      const result = calculateResults(state)
      expect(result.upfrontCashNeeded).toBe(result.fixedCosts + 450)
    })

    it('calculates break-even units correctly', () => {
      const state = makeState({
        tableFee: 100,
        badgeCost: 0,
        hotelCost: 0,
        roommateCount: 1,
        travelCost: 0,
        foodCost: 0,
        displayCost: 0,
        emergencyBuffer: 0,
        inventoryCost: 0,
        averageSalePrice: 10,
        averageItemCost: 5,
      })
      const result = calculateResults(state)
      // fixedCosts = 100, profitPerItem = 5, breakEven = ceil(100/5) = 20
      expect(result.breakEvenUnits).toBe(20)
    })

    it('uses Math.ceil for fractional break-even units', () => {
      const state = makeState({
        tableFee: 101,
        badgeCost: 0,
        hotelCost: 0,
        roommateCount: 1,
        travelCost: 0,
        foodCost: 0,
        displayCost: 0,
        emergencyBuffer: 0,
        inventoryCost: 0,
        averageSalePrice: 10,
        averageItemCost: 5,
      })
      const result = calculateResults(state)
      // ceil(101/5) = ceil(20.2) = 21
      expect(result.breakEvenUnits).toBe(21)
    })
  })

  describe('profit per item', () => {
    it('returns correct profit per item', () => {
      const state = makeState({ averageSalePrice: 12, averageItemCost: 4 })
      expect(calculateResults(state).profitPerItem).toBe(8)
    })

    it('flags invalid profit when cost exceeds price', () => {
      const state = makeState({ averageSalePrice: 5, averageItemCost: 10 })
      const result = calculateResults(state)
      expect(result.hasInvalidProfit).toBe(true)
      expect(result.breakEvenUnits).toBe(0)
    })

    it('flags invalid profit when price equals cost', () => {
      const state = makeState({ averageSalePrice: 5, averageItemCost: 5 })
      expect(calculateResults(state).hasInvalidProfit).toBe(true)
    })
  })

  describe('risk levels', () => {
    const makeStateWithSalesPerHour = (targetSalesPerHour: number) => {
      // fixedCosts = 100, profitPerItem = 10, breakEven = 10
      // salesPerHour = 10 / totalSellingHours
      // totalSellingHours = 10 / targetSalesPerHour
      const totalHours = 10 / targetSalesPerHour
      return makeState({
        tableFee: 100,
        badgeCost: 0, hotelCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
        roommateCount: 1,
        averageSalePrice: 15,
        averageItemCost: 5,
        conDays: 1,
        alleyHoursPerDay: totalHours,
      })
    }

    it('returns LOW RISK when salesPerHour < 2', () => {
      const state = makeStateWithSalesPerHour(1)
      expect(calculateResults(state).riskLevel).toBe('LOW RISK')
    })

    it('returns MEDIUM RISK when 2 <= salesPerHour < 6', () => {
      const state = makeStateWithSalesPerHour(3)
      expect(calculateResults(state).riskLevel).toBe('MEDIUM RISK')
    })

    it('returns HIGH RISK when salesPerHour >= 6', () => {
      const state = makeStateWithSalesPerHour(7)
      expect(calculateResults(state).riskLevel).toBe('HIGH RISK')
    })

    it('returns null risk level when profit is invalid', () => {
      const state = makeState({ averageSalePrice: 1, averageItemCost: 10 })
      expect(calculateResults(state).riskLevel).toBeNull()
    })
  })

  describe('sales targets', () => {
    it('calculates sales per day correctly', () => {
      const state = makeState({
        tableFee: 60,
        badgeCost: 0, hotelCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
        roommateCount: 1,
        averageSalePrice: 10,
        averageItemCost: 4,
        conDays: 3,
        alleyHoursPerDay: 8,
      })
      const result = calculateResults(state)
      // fixedCosts=60, profitPerItem=6, breakEven=10, salesPerDay=10/3≈3.33
      expect(result.salesPerDay).toBeCloseTo(3.33, 1)
    })

    it('calculates total selling hours correctly', () => {
      const state = makeState({ conDays: 3, alleyHoursPerDay: 8 })
      expect(calculateResults(state).totalSellingHours).toBe(24)
    })

    it('returns 0 sales targets when break-even is 0', () => {
      const state = makeState({ averageSalePrice: 1, averageItemCost: 10 })
      const result = calculateResults(state)
      expect(result.salesPerDay).toBe(0)
      expect(result.salesPerHour).toBe(0)
    })
  })

  describe('price sensitivity', () => {
    it('calculates lower break-even at higher prices', () => {
      const state = makeState({
        tableFee: 100,
        badgeCost: 0, hotelCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
        roommateCount: 1,
        averageSalePrice: 10,
        averageItemCost: 5,
      })
      const result = calculateResults(state)
      // profitPerItem=5, breakEven=20
      // +$1: profit=6, breakEven=ceil(100/6)=17
      expect(result.breakEvenAtOneDollarMore).toBe(17)
      // +$3: profit=8, breakEven=ceil(100/8)=13
      expect(result.breakEvenAtThreeDollarsMore).toBe(13)
      // +$5: profit=10, breakEven=ceil(100/10)=10
      expect(result.breakEvenAtFiveDollarsMore).toBe(10)
    })
  })

  describe('roommate splitting', () => {
    it('divides hotel cost by roommate count', () => {
      const state = makeState({
        hotelCost: 600,
        roommateCount: 3,
        tableFee: 0, badgeCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
      })
      expect(calculateResults(state).fixedCosts).toBe(200)
    })

    it('uses full hotel cost when roommateCount is 0 (treated as 1)', () => {
      const state = makeState({
        hotelCost: 300,
        roommateCount: 0,
        tableFee: 0, badgeCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
      })
      expect(calculateResults(state).fixedCosts).toBe(300)
    })
  })

  describe('edge cases', () => {
    it('handles zero fixed costs gracefully', () => {
      const state = makeState({
        tableFee: 0, badgeCost: 0, hotelCost: 0, travelCost: 0, foodCost: 0,
        displayCost: 0, emergencyBuffer: 0, inventoryCost: 0,
        averageSalePrice: 10, averageItemCost: 5,
      })
      const result = calculateResults(state)
      expect(result.breakEvenUnits).toBe(0)
      expect(result.salesPerDay).toBe(0)
    })

    it('produces finite results from default state', () => {
      const result = calculateResults(defaultState)
      expect(Number.isFinite(result.fixedCosts)).toBe(true)
      expect(Number.isFinite(result.breakEvenUnits)).toBe(true)
      expect(Number.isFinite(result.salesPerHour)).toBe(true)
      expect(Number.isFinite(result.requiredProfitPerHour)).toBe(true)
    })
  })
})
