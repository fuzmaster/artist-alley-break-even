import type { CalculatorState } from '../types/calculator'
import type { CalculationResults } from '../types/calculator'

const row = (label: string, value: string | number) =>
  `"${label}","${value}"`

export const buildCsvContent = (state: CalculatorState, results: CalculationResults): string => {
  const lines = [
    'Category,Value',
    row('Con Name', state.conName),
    row('Product Name', state.productName),
    '',
    row('--- Convention Costs ---', ''),
    row('Table Fee', state.tableFee),
    row('Badge Cost', state.badgeCost),
    row('Hotel Cost (total)', state.hotelCost),
    row('Roommates', state.roommateCount),
    row('Hotel Cost (your share)', (state.hotelCost / Math.max(1, state.roommateCount)).toFixed(2)),
    row('Travel Cost', state.travelCost),
    row('Food Cost', state.foodCost),
    row('Display Cost', state.displayCost),
    row('Emergency Buffer', state.emergencyBuffer),
    row('Inventory Cash Needed', state.inventoryCost),
    '',
    row('--- Product Economics ---', ''),
    row('Average Sale Price', state.averageSalePrice),
    row('Average Item Cost', state.averageItemCost),
    row('Profit Per Item', results.profitPerItem),
    '',
    row('--- Selling Time ---', ''),
    row('Convention Days', state.conDays),
    row('Alley Hours Per Day', state.alleyHoursPerDay),
    row('Total Selling Hours', results.totalSellingHours),
    '',
    row('--- Results ---', ''),
    row('Fixed Costs to Recoup', results.fixedCosts),
    row('Upfront Cash Needed', results.upfrontCashNeeded),
    row('Break-Even Units', results.breakEvenUnits),
    row('Sales Per Day', results.salesPerDay),
    row('Sales Per Hour', results.salesPerHour),
    row('Required Profit Per Hour', results.requiredProfitPerHour),
    row('Risk Level', results.riskLevel ?? 'N/A'),
    '',
    row('--- Price Sensitivity ---', ''),
    row('Break-Even at +$1', results.breakEvenAtOneDollarMore),
    row('Break-Even at +$3', results.breakEvenAtThreeDollarsMore),
    row('Break-Even at +$5', results.breakEvenAtFiveDollarsMore),
  ]
  return lines.join('\n')
}

export const downloadCsv = (state: CalculatorState, results: CalculationResults): void => {
  const content = buildCsvContent(state, results)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const filename = `${state.conName.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'break-even'}.csv`
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
