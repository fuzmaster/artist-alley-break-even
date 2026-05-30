import type { CalculationResults, CalculatorState } from '../types/calculator'

const money = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

export const buildShareText = (
  state: CalculatorState,
  results: CalculationResults,
): string => {
  const con = state.conName.trim() || 'Untitled con'
  const beeLine = results.losingMoney
    ? 'Break-even: never — you lose money on every sale.'
    : `At ${con}, you need ${results.breakEvenUnits} sales just to break even.`

  return [
    'Artist Alley Break-Even Calculator',
    '',
    beeLine,
    `Convention: ${con}`,
    `Risk level: ${results.risk}`,
    `Sales per day: ${results.salesPerDay}`,
    `Sales per hour: ${results.salesPerHour}`,
    `One sale every: ${results.minutesPerSale}m`,
    `Margin per sale: ${money(results.margin)}`,
    `Fixed costs: ${money(results.fixedCosts)}`,
    `Upfront cash needed: ${money(results.upfrontCash)}`,
    results.beClock ? `In profit by: ${results.beClock.day} · ${results.beClock.time}` : '',
    '',
    'Estimate only. Not financial advice.',
  ].filter(Boolean).join('\n')
}
