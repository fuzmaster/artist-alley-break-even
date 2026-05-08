import { formatCurrency } from './formatCurrency'
import type { CalculationResults, CalculatorState } from '../types/calculator'

export const buildShareText = (
  state: CalculatorState,
  results: CalculationResults,
): string => {
  const normalizedProductName = state.productName || 'items'
  const breakEvenLine = results.hasInvalidProfit
    ? 'Break-even target: You cannot break even at this price.'
    : `Break-even target: ${results.breakEvenUnits} ${normalizedProductName}`

  return [
    'Artist Alley Break-Even Calculator',
    '',
    `Convention: ${state.conName || 'Untitled con'}`,
    `Product: ${normalizedProductName}`,
    `Fixed convention costs: ${formatCurrency(results.fixedCosts)}`,
    `Upfront cash needed (including inventory): ${formatCurrency(results.upfrontCashNeeded)}`,
    `Average sale price: ${formatCurrency(state.averageSalePrice)}`,
    `Average production cost: ${formatCurrency(state.averageItemCost)}`,
    `Average profit per item: ${formatCurrency(results.profitPerItem)}`,
    breakEvenLine,
    `Sales per day: ${results.salesPerDay}`,
    `Sales per hour: ${results.salesPerHour}`,
    `Required profit per selling hour: ${formatCurrency(results.requiredProfitPerHour)}`,
    '',
    'Estimate only. Not financial advice.',
  ].join('\n')
}
