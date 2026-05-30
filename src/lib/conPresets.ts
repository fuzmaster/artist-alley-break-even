import type { ConPreset, ConSize } from '../types/calculator'

export const CON_PRESETS: Record<ConSize, ConPreset> = {
  small: {
    label: 'Small / local con',
    blurb: 'A library, hotel ballroom, or one-day local show. Lighter foot traffic.',
    days: 1, hours: 7,
    tableFee: 60, travel: 25, lodgingPerNight: 0, nights: 0, otherFixed: 30,
    avgSale: 14, avgCost: 4, inventorySpend: 250,
    pace: 2.4,
  },
  mid: {
    label: 'Mid-size regional',
    blurb: 'A weekend regional anime con, a few thousand attendees. The bread-and-butter show.',
    days: 2, hours: 8,
    tableFee: 320, travel: 110, lodgingPerNight: 145, nights: 2, otherFixed: 90,
    avgSale: 18, avgCost: 5, inventorySpend: 600,
    pace: 3.6,
  },
  major: {
    label: 'Major / flagship con',
    blurb: 'A flagship show with tens of thousands of attendees. Big crowds, big costs.',
    days: 3, hours: 9,
    tableFee: 750, travel: 280, lodgingPerNight: 210, nights: 4, otherFixed: 200,
    avgSale: 22, avgCost: 6, inventorySpend: 1400,
    pace: 5.0,
  },
}
