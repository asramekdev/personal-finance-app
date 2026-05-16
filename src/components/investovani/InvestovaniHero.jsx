import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  heroChartData,
  portfolioCurrentValue,
  portfolioCostBasis,
  formatCZK,
  formatChartDate,
} from './investovaniData'

function ChartTooltip({ active, payload, label, view }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-[10px] text-white/40">{formatChartDate(label, view)}</p>
      <p className="text-sm font-semibold text-white">{formatCZK(payload[0].value)}</p>
    </div>
  )
}

function SegmentedControl({ view, onChange }) {
  return (
    <div className="flex rounded-full border border-white/[0.08] bg-white/[0.05] p-0.5">
      {[{ key: 'months', label: '12M' }, { key: 'years', label: 'ALL' }].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            'rounded-full px-2.5 py-[3px] text-[10px] font-semibold tracking-wide transition-all duration-150',
            view === key
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-white/38 hover:text-white/60',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function InvestovaniHero({ brokers, chartView, onChartViewChange }) {
  const totalValue = portfolioCurrentValue(brokers)
  const totalIn = portfolioCostBasis(brokers)
  const gain = totalValue - totalIn
  const gainPct = totalIn > 0 ? (gain / totalIn) * 100 : 0
  const isPositive = gain >= 0

  const data = heroChartData(brokers, chartView)

  return (
    <div className="liquid-glass rounded-3xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/35">
            Celková hodnota portfolia
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="shrink-0 text-3xl font-semibold tracking-tight text-white/95 sm:text-4xl">
              {formatCZK(totalValue)}
            </p>
            <div className="sm:hidden">
              <SegmentedControl view={chartView} onChange={onChartViewChange} />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                isPositive
                  ? 'bg-[#30D158]/15 text-[#30D158] shadow-[0_0_8px_0px_rgba(48,209,88,0.30)]'
                  : 'bg-red-500/15 text-red-400 shadow-[0_0_8px_0px_rgba(239,68,68,0.30)]',
              ].join(' ')}
            >
              {isPositive ? '+' : ''}
              {gainPct.toFixed(1)}%
            </span>
            <span className={`text-xs font-medium ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}
              {formatCZK(gain)}
            </span>
          </div>
        </div>

        <div className="mt-6 hidden shrink-0 sm:flex">
          <SegmentedControl view={chartView} onChange={onChartViewChange} />
        </div>
      </div>

      <div className="mt-4 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="invHeroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007AFF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#007AFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={d => formatChartDate(d, chartView)}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }}
              interval="preserveStartEnd"
              padding={{ left: 0, right: 0 }}
            />
            <Tooltip
              content={<ChartTooltip view={chartView} />}
              cursor={{ stroke: 'rgba(255,255,255,0.10)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#007AFF"
              strokeWidth={1.5}
              fill="url(#invHeroGrad)"
              dot={false}
              activeDot={{ r: 3.5, fill: '#007AFF', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
