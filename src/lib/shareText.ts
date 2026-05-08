import { formatCurrency } from './formatCurrency'
import type { CalculationResults, CalculatorState } from '../types/calculator'

export const buildShareText = (
  state: CalculatorState,
  results: CalculationResults,
): string => {
  return [
    'Artist Alley Break-Even Calculator',
    '',
    `Total convention cost: ${formatCurrency(results.totalCost)}`,
    `Average sale price: ${formatCurrency(state.averageSalePrice)}`,
    `Average production cost: ${formatCurrency(state.averageItemCost)}`,
    `Average profit per item: ${formatCurrency(results.profitPerItem)}`,
    `Break-even target: ${results.breakEvenUnits} items`,
    `Sales per day: ${results.salesPerDay}`,
    `Sales per hour: ${results.salesPerHour}`,
    '',
    'Estimate only. Not financial advice.',
  ].join('\n')
}
