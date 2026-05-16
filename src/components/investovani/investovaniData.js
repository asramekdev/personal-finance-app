let seed = 137
function sr() {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

function genRecords(startValue, monthlyGrowth, volatility) {
  const records = []
  const end = new Date(2026, 4, 1)
  let value = startValue
  for (let i = 23; i >= 0; i--) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - i)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const noise = (sr() - 0.45) * volatility
    value = Math.max(0, value * (1 + monthlyGrowth + noise))
    records.push({ id: date, date, value: Math.round(value) })
  }
  return records
}

export const INITIAL_BROKERS = [
  {
    id: 'xtb',
    name: 'XTB',
    color: '#007AFF',
    tickers: [
      {
        id: 'aapl',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        purchases: [
          { id: 'p1', shares: 5, pricePerShare: 4200, date: '2024-02' },
          { id: 'p2', shares: 3, pricePerShare: 4850, date: '2024-09' },
        ],
        records: genRecords(21000, 0.006, 0.04),
      },
      {
        id: 'msft',
        symbol: 'MSFT',
        name: 'Microsoft',
        purchases: [
          { id: 'p3', shares: 2, pricePerShare: 9500, date: '2024-04' },
        ],
        records: genRecords(19000, 0.007, 0.035),
      },
    ],
  },
  {
    id: 'trading212',
    name: 'Trading 212',
    color: '#30D158',
    tickers: [
      {
        id: 'vwce',
        symbol: 'VWCE',
        name: 'Vanguard FTSE All-World',
        purchases: [
          { id: 'p4', shares: 10, pricePerShare: 3200, date: '2024-01' },
          { id: 'p5', shares: 5, pricePerShare: 3450, date: '2024-07' },
        ],
        records: genRecords(32000, 0.005, 0.025),
      },
    ],
  },
]

export const BROKER_COLORS = ['#007AFF', '#30D158', '#FF9500', '#FF375F', '#BF5AF2', '#64D2FF']

// ─── Value helpers ───────────────────────────────────────────────────────────

export function tickerCurrentValue(records) {
  if (!records.length) return 0
  return [...records].sort((a, b) => b.date.localeCompare(a.date))[0].value
}

export function tickerTotalShares(purchases) {
  return purchases.reduce((s, p) => s + p.shares, 0)
}

export function tickerCostBasis(purchases) {
  return purchases.reduce((s, p) => s + p.shares * p.pricePerShare, 0)
}

export function portfolioCurrentValue(brokers) {
  return brokers.reduce(
    (s, b) => s + b.tickers.reduce((ts, t) => ts + tickerCurrentValue(t.records), 0),
    0,
  )
}

export function portfolioCostBasis(brokers) {
  return brokers.reduce(
    (s, b) => s + b.tickers.reduce((ts, t) => ts + tickerCostBasis(t.purchases), 0),
    0,
  )
}

// ─── Chart helpers ───────────────────────────────────────────────────────────

export function heroChartData(brokers, view) {
  const byDate = {}
  brokers.forEach(broker =>
    broker.tickers.forEach(ticker =>
      ticker.records.forEach(r => {
        byDate[r.date] = (byDate[r.date] || 0) + r.value
      }),
    ),
  )
  const sorted = Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }))

  if (view === 'years') {
    const byYear = {}
    sorted.forEach(({ date, value }) => { byYear[date.slice(0, 4)] = value })
    return Object.entries(byYear).map(([date, value]) => ({ date, value }))
  }
  return sorted.slice(-13)
}

export function tickerChartData(records, view) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))
  if (view === 'years') {
    const byYear = {}
    sorted.forEach(r => { byYear[r.date.slice(0, 4)] = r.value })
    return Object.entries(byYear).map(([date, value]) => ({ date, value }))
  }
  return sorted.slice(-13).map(r => ({ date: r.date, value: r.value }))
}

// ─── Format helpers ──────────────────────────────────────────────────────────

export function formatCZK(n) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(n)
}

const MONTHS = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro']

export function formatMonth(dateStr) {
  const [y, m] = dateStr.split('-')
  return `${MONTHS[parseInt(m) - 1]} ${y}`
}

export function formatChartDate(dateStr, view) {
  if (view === 'years') return dateStr
  const [, m] = dateStr.split('-')
  return MONTHS[parseInt(m) - 1]
}
