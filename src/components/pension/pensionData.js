// Generate 36 months of records ending at 2026-05
function generateRecords(config) {
  const records = []
  const end = new Date(2026, 4, 1) // May 2026
  let value = config.startValue

  for (let i = 35; i >= 0; i--) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    // Apply monthly growth + noise
    const noise = (Math.random() - 0.48) * config.volatility
    value = value * (1 + config.monthlyGrowth + noise) + config.participant + config.employer + config.state

    records.push({
      id: date,
      date,
      participant: config.participant,
      employer: config.employer,
      state: config.state,
      value: Math.round(value),
    })
  }
  return records
}

// Seeded pseudo-random for deterministic initial data
let seed = 42
function seededRandom() {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

function generateDeterministicRecords(config) {
  const records = []
  const end = new Date(2026, 4, 1)
  let value = config.startValue

  for (let i = 35; i >= 0; i--) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    const noise = (seededRandom() - 0.48) * config.volatility
    value = value * (1 + config.monthlyGrowth + noise) + config.participant + config.employer + config.state

    records.push({
      id: date,
      date,
      participant: config.participant,
      employer: config.employer,
      state: config.state,
      value: Math.round(value),
    })
  }
  return records
}

export const INITIAL_FUNDS = [
  {
    id: 'vyvazeny',
    name: 'Vyvážený fond',
    color: '#007AFF',
    records: generateDeterministicRecords({
      startValue: 45000,
      monthlyGrowth: 0.0055,
      volatility: 0.004,
      participant: 500,
      employer: 500,
      state: 230,
    }),
  },
  {
    id: 'dynamicky',
    name: 'Dynamický fond',
    color: '#30D158',
    records: generateDeterministicRecords({
      startValue: 28000,
      monthlyGrowth: 0.009,
      volatility: 0.012,
      participant: 1500,
      employer: 1000,
      state: 230,
    }),
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export function currentValue(records) {
  if (!records.length) return 0
  return [...records].sort((a, b) => b.date.localeCompare(a.date))[0].value
}

export function totalDeposited(records) {
  return records.reduce((s, r) => s + r.participant + r.employer + r.state, 0)
}

export function formatCZK(n) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n)
}

export function formatMonth(dateStr) {
  const [y, m] = dateStr.split('-')
  const months = ['led','úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro']
  return `${months[parseInt(m) - 1]} ${y}`
}

// Aggregate all funds by month → { date, value }
export function heroChartData(funds, view) {
  const byDate = {}
  funds.forEach(fund => {
    fund.records.forEach(r => {
      byDate[r.date] = (byDate[r.date] || 0) + r.value
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

  // Last 13 months
  return sorted.slice(-13)
}

export function fundChartData(records, view) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))

  if (view === 'years') {
    const byYear = {}
    sorted.forEach(r => {
      const year = r.date.slice(0, 4)
      byYear[year] = r.value
    })
    return Object.entries(byYear).map(([date, value]) => ({ date, value }))
  }

  return sorted.slice(-13).map(r => ({ date: r.date, value: r.value }))
}

export function formatChartDate(dateStr, view) {
  if (view === 'years') return dateStr
  const [y, m] = dateStr.split('-')
  const months = ['led','úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro']
  return months[parseInt(m) - 1]
}
