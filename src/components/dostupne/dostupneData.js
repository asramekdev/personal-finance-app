// Re-export shared formatters from pensionData
export { formatCZK, formatMonth, formatChartDate } from '../pension/pensionData'

// Seeded random for deterministic initial data
let seed = 137
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

// Generate 24 months of records ending at 2026-05
function generateRecords(config) {
  const records = []
  const end = new Date(2026, 4, 1)
  let balance = config.startBalance

  for (let i = 23; i >= 0; i--) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    balance =
      balance * (1 + config.monthlyGrowth) +
      config.monthlyDeposit +
      (seededRandom() - 0.48) * config.volatility * balance

    records.push({ id: date, date, balance: Math.round(balance) })
  }
  return records
}

export const INITIAL_PRODUCTS = [
  {
    id: 'sporici',
    name: 'Spořicí účet KB',
    color: '#007AFF',
    records: generateRecords({ startBalance: 45000, monthlyGrowth: 0.003, monthlyDeposit: 8000, volatility: 0.002 }),
  },
  {
    id: 'fond',
    name: 'Fond peněžního trhu',
    color: '#30D158',
    records: generateRecords({ startBalance: 32000, monthlyGrowth: 0.006, monthlyDeposit: 3000, volatility: 0.009 }),
  },
  {
    id: 'terminovany',
    name: 'Termínovaný vklad Moneta',
    color: '#FF9F0A',
    records: generateRecords({ startBalance: 100000, monthlyGrowth: 0.0035, monthlyDeposit: 0, volatility: 0.001 }),
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export function currentBalance(records) {
  if (!records.length) return 0
  return [...records].sort((a, b) => b.date.localeCompare(a.date))[0].balance
}

export function lastMonthBalance(records) {
  if (records.length < 2) return records[0]?.balance ?? 0
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date))
  return sorted[1].balance
}

export function heroChartData(products, view) {
  const byDate = {}
  products.forEach(p => {
    p.records.forEach(r => {
      byDate[r.date] = (byDate[r.date] || 0) + r.balance
    })
  })

  const sorted = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))

  if (view === 'years') {
    const byYear = {}
    sorted.forEach(({ date, value }) => {
      const year = date.slice(0, 4)
      byYear[year] = value
    })
    return Object.entries(byYear).map(([date, value]) => ({ date, value }))
  }

  return sorted.slice(-13)
}

export function productChartData(records, view) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))

  if (view === 'years') {
    const byYear = {}
    sorted.forEach(r => {
      const year = r.date.slice(0, 4)
      byYear[year] = r.balance
    })
    return Object.entries(byYear).map(([date, value]) => ({ date, value }))
  }

  return sorted.slice(-13).map(r => ({ date: r.date, value: r.balance }))
}

export function generateProductId() {
  return `product_${Date.now()}`
}

// Palette for new products
const COLORS = ['#FF375F', '#BF5AF2', '#FF9F0A', '#64D2FF', '#FFD60A', '#30D158']
let colorIdx = COLORS.length - 1
export function nextColor() {
  colorIdx = (colorIdx + 1) % COLORS.length
  return COLORS[colorIdx]
}
