import { describe, expect, it } from 'vitest'
import { sanitizeState } from './sanitizeState'
import { defaultState } from './defaultState'

describe('sanitizeState', () => {
  it('returns defaults for empty input', () => {
    expect(sanitizeState({})).toEqual(defaultState)
  })

  it('clamps days to min 1', () => {
    expect(sanitizeState({ days: 0 }).days).toBe(1)
    expect(sanitizeState({ days: -3 }).days).toBe(1)
  })

  it('clamps hours to min 1', () => {
    expect(sanitizeState({ hours: 0 }).hours).toBe(1)
  })

  it('clamps all cost fields to 0', () => {
    const fields = ['tableFee','travel','lodgingPerNight','nights','otherFixed','avgSale','avgCost','inventorySpend'] as const
    for (const f of fields) {
      expect(sanitizeState({ [f]: -99 })[f]).toBe(0)
    }
  })

  it('passes valid numbers through', () => {
    const s = sanitizeState({ tableFee: 350, days: 3, nights: 2 })
    expect(s.tableFee).toBe(350)
    expect(s.days).toBe(3)
    expect(s.nights).toBe(2)
  })

  it('replaces NaN/Infinity with 0', () => {
    expect(sanitizeState({ tableFee: NaN }).tableFee).toBe(0)
    expect(sanitizeState({ tableFee: Infinity }).tableFee).toBe(0)
  })

  it('accepts valid con sizes', () => {
    expect(sanitizeState({ con: 'small' }).con).toBe('small')
    expect(sanitizeState({ con: 'mid' }).con).toBe('mid')
    expect(sanitizeState({ con: 'major' }).con).toBe('major')
  })

  it('falls back to default con size for invalid values', () => {
    expect(sanitizeState({ con: 'invalid' as 'small' }).con).toBe(defaultState.con)
  })

  it('trims conName', () => {
    expect(sanitizeState({ conName: '  My Con  ' }).conName).toBe('My Con')
  })

  it('clamps conName to 60 chars', () => {
    const long = 'A'.repeat(100)
    expect(sanitizeState({ conName: long }).conName).toHaveLength(60)
  })
})
