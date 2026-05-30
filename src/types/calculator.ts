export type ConSize = 'small' | 'mid' | 'major'

export type CalculatorState = {
  con: ConSize
  conName: string
  days: number
  hours: number         // hours per day on the floor
  tableFee: number
  travel: number
  lodgingPerNight: number
  nights: number
  otherFixed: number    // badge + food + extras
  avgSale: number
  avgCost: number
  inventorySpend: number
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type BreakEvenClock = {
  day: string   // e.g. "Day 2"
  time: string  // e.g. "3h 20m in"
}

export type CalculationResults = {
  days: number
  hours: number
  totalHours: number
  tableFee: number
  travel: number
  lodging: number
  otherFixed: number
  fixedCosts: number
  avgSale: number
  avgCost: number
  margin: number
  marginPct: number
  inventorySpend: number
  upfrontCash: number
  losingMoney: boolean
  breakEvenUnits: number
  salesPerDay: number
  salesPerHour: number
  minutesPerSale: number
  pace: number
  paceLoad: number
  risk: RiskLevel
  riskScore: number
  beFraction: number
  beClock: BreakEvenClock | null
}

export type ConPreset = {
  label: string
  blurb: string
  days: number
  hours: number
  tableFee: number
  travel: number
  lodgingPerNight: number
  nights: number
  otherFixed: number
  avgSale: number
  avgCost: number
  inventorySpend: number
  pace: number   // realistic sustainable sales/hour ceiling for this con size
}
