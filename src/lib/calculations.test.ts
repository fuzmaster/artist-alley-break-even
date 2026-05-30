import { describe, expect, it } from 'vitest'
import { calculateResults } from './calculations'
import { defaultState } from './defaultState'
import type { CalculatorState } from '../types/calculator'

const make = (overrides: Partial<CalculatorState> = {}): CalculatorState => ({
  ...defaultState,
  ...overrides,
})

describe('calculateResults', () => {
  describe('fixed costs', () => {
    it('sums all fixed cost components', () => {
      const r = calculateResults(make({
        tableFee: 100, travel: 50,
        lodgingPerNight: 100, nights: 2,
        otherFixed: 30,
        inventorySpend: 0,
      }))
      // 100 + 50 + 200 + 30 = 380
      expect(r.fixedCosts).toBe(380)
    })

    it('adds inventory to upfront cash but not fixed costs', () => {
      const r = calculateResults(make({ tableFee: 100, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0, inventorySpend: 500 }))
      expect(r.fixedCosts).toBe(100)
      expect(r.upfrontCash).toBe(600)
    })

    it('zero costs yield zero upfront cash', () => {
      const r = calculateResults(make({ tableFee: 0, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0, inventorySpend: 0 }))
      expect(r.fixedCosts).toBe(0)
      expect(r.upfrontCash).toBe(0)
    })
  })

  describe('margin', () => {
    it('calculates correct margin', () => {
      const r = calculateResults(make({ avgSale: 18, avgCost: 5 }))
      expect(r.margin).toBe(13)
    })

    it('flags losing money when cost > price', () => {
      const r = calculateResults(make({ avgSale: 5, avgCost: 10 }))
      expect(r.losingMoney).toBe(true)
      expect(r.breakEvenUnits).toBe(0)
    })

    it('flags losing money when price equals cost', () => {
      expect(calculateResults(make({ avgSale: 5, avgCost: 5 })).losingMoney).toBe(true)
    })
  })

  describe('break-even units', () => {
    it('uses Math.ceil', () => {
      const r = calculateResults(make({
        tableFee: 101, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 10, avgCost: 5,
      }))
      expect(r.breakEvenUnits).toBe(21) // ceil(101/5)
    })

    it('is zero when fixed costs are zero', () => {
      const r = calculateResults(make({
        tableFee: 0, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 10, avgCost: 5,
      }))
      expect(r.breakEvenUnits).toBe(0)
    })
  })

  describe('sales targets', () => {
    it('computes salesPerDay and salesPerHour', () => {
      const r = calculateResults(make({
        tableFee: 80, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 10, avgCost: 5,
        days: 2, hours: 8,
      }))
      // breakEven = ceil(80/5) = 16
      expect(r.breakEvenUnits).toBe(16)
      expect(r.salesPerDay).toBe(8)    // 16/2
      expect(r.salesPerHour).toBe(1)   // 16/16
    })

    it('minutesPerSale is 60/salesPerHour', () => {
      const r = calculateResults(make({
        tableFee: 60, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 10, avgCost: 4,
        days: 1, hours: 6,
      }))
      // breakEven = 10, totalHours = 6, salesPerHour = 10/6 ≈ 1.67
      expect(r.minutesPerSale).toBeCloseTo(36, 0)
    })
  })

  describe('risk levels', () => {
    it('LOW risk when pace load is below threshold', () => {
      // small con pace = 2.4; if salesPerHour = 0.5, paceLoad = 0.5/2.4 ≈ 0.21 → score 0
      const r = calculateResults(make({
        con: 'small',
        tableFee: 10, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 20, avgCost: 4,
        days: 1, hours: 7,
      }))
      expect(r.risk).toBe('LOW')
    })

    it('HIGH risk when losing money', () => {
      const r = calculateResults(make({ avgSale: 3, avgCost: 10 }))
      expect(r.risk).toBe('HIGH')
      expect(r.losingMoney).toBe(true)
    })
  })

  describe('break-even clock', () => {
    it('returns null when losing money', () => {
      const r = calculateResults(make({ avgSale: 1, avgCost: 10 }))
      expect(r.beClock).toBeNull()
    })

    it('returns a clock object when profitable', () => {
      const r = calculateResults(make({
        tableFee: 50, travel: 0, lodgingPerNight: 0, nights: 0, otherFixed: 0,
        avgSale: 15, avgCost: 5,
        days: 2, hours: 8,
        con: 'mid',
      }))
      expect(r.beClock).not.toBeNull()
      expect(r.beClock?.day).toMatch(/Day \d+/)
    })
  })

  describe('default state', () => {
    it('produces finite results', () => {
      const r = calculateResults(defaultState)
      expect(Number.isFinite(r.fixedCosts)).toBe(true)
      expect(Number.isFinite(r.breakEvenUnits)).toBe(true)
      expect(Number.isFinite(r.salesPerHour)).toBe(true)
      expect(Number.isFinite(r.upfrontCash)).toBe(true)
    })
  })
})
