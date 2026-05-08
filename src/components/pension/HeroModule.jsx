import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { heroChartData, formatChartDate, formatCZK, currentValue, totalDeposited } from './pensionData'

function CustomTooltip({ active, payload, label, view }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-[11px] text-white/40">{formatChartDate(label, view)}</p>
      <p className="text-sm font-semibold text-white">{formatCZK(payload[0].value)}</p>
    </div>
  )
}

export default function HeroModule({ funds, chartView, onChartViewChange }) {
  const totalValue = funds.reduce((s, f) => s + currentValue(f.records), 0)
  const totalIn = funds.reduce((s, f) => s + totalDeposited(f.records), 0)
  const gain = totalValue - totalIn
  const gainPct = totalIn > 0 ? (gain / totalIn) * 100 : 0
  const isPositive = gain >= 0

  const data = heroChartData(funds, chartView)

  return (
    <div className="liquid-glass rounded-3xl p-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/35">
            Celková hodnota penzijního spoření
          </p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-white/95">
            {formatCZK(totalValue)}
          </p>

          {/* Gain indicators */}
          <div className="mt-2.5 flex items-center gap-2.5">
            <span
              className={[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold',
                isPositive
                  ? 'bg-[#30D158]/15 text-[#30D158] shadow-[0_0_8px_0px_rgba(48,209,88,0.35)]'
                  : 'bg-red-500/15 text-red-400 shadow-[0_0_8px_0px_rgba(239,68,68,0.35)]',
              ].join(' ')}
            >
              {isPositive ? '+' : ''}{gainPct.toFixed(1)}%
            </span>
            <span className={`text-sm font-medium ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{formatCZK(gain)}
            </span>
          </div>
        </div>

        {/* Segmented control */}
        <div className="flex shrink-0 rounded-lg bg-white/[0.07] p-0.5">
          {[
            { key: 'months', label: 'Měsíce' },
            { key: 'years', label: 'Roky' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChartViewChange(key)}
              className={[
                'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                chartView === key
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-5 h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007AFF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={d => formatChartDate(d, chartView)}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <Tooltip
              content={<CustomTooltip view={chartView} />}
              cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#007AFF"
              strokeWidth={2}
              fill="url(#heroGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#007AFF', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
