import { formatCurrency } from './formatCurrency'
import type { CalculationResults, CalculatorState } from '../types/calculator'

const getShareProductLabel = (productName: string): string => {
  const normalizedProductName = productName.trim()
  return normalizedProductName ? `${normalizedProductName} sales` : 'item sales'
}

export const buildShareText = (
  state: CalculatorState,
  results: CalculationResults,
): string => {
  const normalizedConName = state.conName.trim() || 'Untitled con'
  const normalizedProductName = state.productName.trim() || 'item'
  const shareProductLabel = getShareProductLabel(state.productName)
  const breakEvenLine = results.hasInvalidProfit
    ? 'Break-even target: You cannot break even at this price.'
    : `At ${normalizedConName}, you need ${results.breakEvenUnits} ${shareProductLabel} just to break even.`

  return [
    'Artist Alley Break-Even Calculator',
    '',
    breakEvenLine,
    `Convention: ${normalizedConName}`,
    `Product: ${normalizedProductName}`,
    `Sales per day: ${results.salesPerDay}`,
    `Sales per hour: ${results.salesPerHour}`,
    `Profit per item: ${formatCurrency(results.profitPerItem)}`,
    `Required profit per hour: ${formatCurrency(results.requiredProfitPerHour)}`,
    `Upfront cash needed: ${formatCurrency(results.upfrontCashNeeded)}`,
    `Fixed convention costs: ${formatCurrency(results.fixedCosts)}`,
    `Average sale price: ${formatCurrency(state.averageSalePrice)}`,
    `Average production cost: ${formatCurrency(state.averageItemCost)}`,
    '',
    'Estimate only. Not financial advice.',
  ].join('\n')
}
