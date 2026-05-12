import { describe, expect, it } from 'vitest'
import { sanitizeState } from './sanitizeState'
import { defaultState } from './defaultState'

describe('sanitizeState', () => {
  it('returns defaults for empty input', () => {
    const result = sanitizeState({})
    expect(result).toEqual(defaultState)
  })

  it('clamps roommateCount to minimum of 1', () => {
    expect(sanitizeState({ roommateCount: 0 }).roommateCount).toBe(1)
    expect(sanitizeState({ roommateCount: -5 }).roommateCount).toBe(1)
  })

  it('clamps conDays to minimum of 1', () => {
    expect(sanitizeState({ conDays: 0 }).conDays).toBe(1)
    expect(sanitizeState({ conDays: -1 }).conDays).toBe(1)
  })

  it('clamps alleyHoursPerDay to minimum of 1', () => {
    expect(sanitizeState({ alleyHoursPerDay: 0 }).alleyHoursPerDay).toBe(1)
  })

  it('clamps all cost fields to minimum of 0', () => {
    const fields = ['tableFee', 'badgeCost', 'hotelCost', 'travelCost', 'foodCost', 'displayCost', 'inventoryCost', 'emergencyBuffer', 'averageSalePrice', 'averageItemCost'] as const
    for (const field of fields) {
      expect(sanitizeState({ [field]: -100 })[field]).toBe(0)
    }
  })

  it('passes through valid numbers unchanged', () => {
    const state = sanitizeState({ tableFee: 350.5, conDays: 2, roommateCount: 3 })
    expect(state.tableFee).toBe(350.5)
    expect(state.conDays).toBe(2)
    expect(state.roommateCount).toBe(3)
  })

  it('replaces NaN/Infinity with 0 for numeric fields', () => {
    expect(sanitizeState({ tableFee: NaN }).tableFee).toBe(0)
    expect(sanitizeState({ tableFee: Infinity }).tableFee).toBe(0)
    expect(sanitizeState({ tableFee: -Infinity }).tableFee).toBe(0)
  })

  it('falls back to default conName when empty string provided', () => {
    expect(sanitizeState({ conName: '' }).conName).toBe(defaultState.conName)
  })

  it('falls back to default productName when empty string provided', () => {
    expect(sanitizeState({ productName: '' }).productName).toBe(defaultState.productName)
  })

  it('trims whitespace from string fields', () => {
    expect(sanitizeState({ conName: '  My Con  ' }).conName).toBe('My Con')
    expect(sanitizeState({ productName: '  Prints  ' }).productName).toBe('Prints')
  })

  it('handles non-string values for text fields gracefully', () => {
    expect(sanitizeState({ conName: undefined }).conName).toBe(defaultState.conName)
    expect(sanitizeState({ productName: null as unknown as string }).productName).toBe(defaultState.productName)
  })
})
