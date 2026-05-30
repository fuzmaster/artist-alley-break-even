import { describe, expect, it, beforeEach, vi } from 'vitest'
import { loadCalculatorState, saveCalculatorState } from './localStorage'
import { defaultState } from './defaultState'

const STORAGE_KEY = 'artist-alley-break-even-state'

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('loadCalculatorState', () => {
    it('returns null when nothing is stored', () => {
      expect(loadCalculatorState()).toBeNull()
    })

    it('returns null for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json{{{')
      expect(loadCalculatorState()).toBeNull()
    })

    it('returns null for non-object JSON', () => {
      localStorage.setItem(STORAGE_KEY, '"just a string"')
      expect(loadCalculatorState()).toBeNull()
    })

    it('returns sanitized state for valid stored data', () => {
      saveCalculatorState(defaultState)
      const loaded = loadCalculatorState()
      expect(loaded).toEqual(defaultState)
    })

    it('sanitizes invalid values on load', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultState, tableFee: -999 }))
      const loaded = loadCalculatorState()
      expect(loaded?.tableFee).toBe(0)
    })

    it('returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage error')
      })
      expect(loadCalculatorState()).toBeNull()
    })
  })

  describe('saveCalculatorState', () => {
    it('persists state that can be reloaded', () => {
      const state = { ...defaultState, tableFee: 999, conName: 'Test Con' }
      saveCalculatorState(state)
      const loaded = loadCalculatorState()
      expect(loaded?.tableFee).toBe(999)
      expect(loaded?.conName).toBe('Test Con')
    })

    it('returns true on success', () => {
      expect(saveCalculatorState(defaultState)).toBe(true)
    })

    it('returns false and does not throw when localStorage.setItem throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      expect(() => saveCalculatorState(defaultState)).not.toThrow()
      expect(saveCalculatorState(defaultState)).toBe(false)
    })
  })
})
