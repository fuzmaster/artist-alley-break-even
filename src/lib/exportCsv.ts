import type { CalculatorState, CalculationResults } from '../types/calculator'
import { CON_PRESETS } from './conPresets'

const row = (label: string, value: string | number) => `"${label}","${value}"`

export const buildCsvContent = (state: CalculatorState, results: CalculationResults): string => {
  const conLabel = CON_PRESETS[state.con].label
  const lines = [
    'Category,Value',
    row('Con Name', state.conName || '—'),
    row('Con Size', conLabel),
    '',
    row('--- Time on floor ---', ''),
    row('Days', state.days),
    row('Hours / day', state.hours),
    row('Total selling hours', results.totalHours),
    '',
    row('--- Fixed Costs ---', ''),
    row('Table / booth fee', state.tableFee),
    row('Travel', state.travel),
    row('Lodging / night', state.lodgingPerNight),
    row('Nights', state.nights),
    row('Lodging total', results.lodging),
    row('Extras (badge, food, supplies)', state.otherFixed),
    row('Total fixed costs', results.fixedCosts),
    row('Inventory spend', state.inventorySpend),
    row('Total upfront cash', results.upfrontCash),
    '',
    row('--- Product Economics ---', ''),
    row('Average sale price', state.avgSale),
    row('Average cost per sale', state.avgCost),
    row('Margin per sale', results.margin),
    row('Margin %', `${results.marginPct.toFixed(1)}%`),
    '',
    row('--- Results ---', ''),
    row('Break-even units', results.losingMoney ? 'Never' : results.breakEvenUnits),
    row('Sales per day', results.losingMoney ? '—' : results.salesPerDay),
    row('Sales per hour', results.losingMoney ? '—' : results.salesPerHour),
    row('Minutes per sale', results.losingMoney ? '—' : results.minutesPerSale),
    row('Risk level', results.risk),
    row('In profit', results.beClock ? `${results.beClock.day} · ${results.beClock.time}` : '—'),
  ]
  return lines.join('\n')
}

export const downloadCsv = (state: CalculatorState, results: CalculationResults): void => {
  const content = buildCsvContent(state, results)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const filename = `${(state.conName || 'break-even').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.csv`
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
