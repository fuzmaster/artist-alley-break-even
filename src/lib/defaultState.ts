import type { CalculatorState } from '../types/calculator'
import { CON_PRESETS } from './conPresets'

const { label: _l, blurb: _b, pace: _p, ...midVals } = CON_PRESETS.mid

export const defaultState: CalculatorState = {
  con: 'mid',
  conName: '',
  ...midVals,
}
