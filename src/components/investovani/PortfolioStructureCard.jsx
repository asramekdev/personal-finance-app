import { useMemo, useState } from 'react'
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCZK, aggregatedTickerStats, structureListData } from './investovaniData'
import { PolarAreaDonutChart } from '../ui/PolarAreaDonutChart'

const CHART_COLORS = ['#007AFF', '#30D158', '#FF9500', '#BF5AF2', '#64D2FF']

function SegmentedControl({ view, onChange }) {
  return (
    <div className="flex rounded-full border border-white/[0.08] bg-white/[0.05] p-0.5">
      {[{ key: 'graf', label: 'Graf' }, { key: 'seznam', label: 'Seznam' }].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            'rounded-full px-3 py-[6px] text-[10px] font-semibold tracking-wide transition-all duration-150',
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

export default function PortfolioStructureCard({ brokers }) {
  const [view, setView] = useState('graf')
  const tickerStats = useMemo(() => aggregatedTickerStats(brokers), [brokers])
  const totalValue = tickerStats.reduce((sum, ticker) => sum + ticker.value, 0)
  const listData = useMemo(() => structureListData(brokers), [brokers])

  const chartData = useMemo(() => {
    if (!tickerStats.length) return []
    const maxValue = Math.max(...tickerStats.map(item => item.value))
    return tickerStats
      .slice()
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        label: item.symbol,
        value: item.value,
        percentage: item.percent ?? (totalValue === 0 ? 0 : (item.value / totalValue) * 100),
        color: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
        radiusIndex: Math.max(1, Math.round((item.value / maxValue) * 5)),
      }))
  }, [tickerStats, totalValue])

  const listChartData = useMemo(() => {
    const sorted = listData.slice().sort((a, b) => b.value - a.value)
    return sorted.map((item, index) => ({
      ...item,
      label: item.symbol,
      value: item.percent,
      color: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
      radiusColor: item.color ?? CHART_COLORS[index % CHART_COLORS.length],
    }))
  }, [listData])

  const topListChartData = useMemo(() => listChartData.slice(0, 8), [listChartData])

  function RadialListTooltip({ active, payload }) {
    if (!active || !payload?.length) return null
    const entry = payload[0].payload
    return (
      <div className="rounded-2xl border border-white/10 bg-gray-950/95 p-3 text-sm text-white shadow-xl backdrop-blur-md">
        <div className="text-xs text-white/40">{entry.label}</div>
        <div className="mt-1 font-semibold">{formatCZK(Math.round((entry.percent / 100) * totalValue || 0))}</div>
        <div className="text-xs text-white/50">{entry.percent.toFixed(1)}%</div>
      </div>
    )
  }

  return (
    <div className="liquid-glass rounded-3xl p-5 h-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white/90">Struktura portfolia</p>
          <p className="text-xs text-white/50">Aktuální rozložení investic podle tickerů</p>
        </div>
        <SegmentedControl view={view} onChange={setView} />
      </div>

      <div className="mt-4 flex h-[calc(100%-56px)] flex-col gap-4 overflow-hidden">
        {totalValue === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            Žádné data pro zobrazení struktury portfolia.
          </div>
        ) : view === 'graf' ? (
          <div className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-3xl bg-white/5 p-2">
            <div className="h-[320px] w-full">
              <PolarAreaDonutChart data={chartData} height={320} innerRadius={60} radiusStep={16} />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {listChartData.map(entry => (
                <div key={entry.label} className="flex min-w-[120px] flex-col gap-1 rounded-2xl bg-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs font-semibold text-white/90">{entry.label}</span>
                  </div>
                  <span className="text-[11px] text-white/40">{entry.percent.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/5 p-2">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="95%"
                  barSize={18}
                  data={topListChartData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Tooltip content={<RadialListTooltip />} />
                  <RadialBar
                    background={{ fill: 'rgba(255,255,255,0.08)' }}
                    dataKey="value"
                    cornerRadius={50}
                    minAngle={15}
                  >
                    {topListChartData.map(item => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {listChartData.map(entry => (
                <div key={entry.label} className="flex min-w-[120px] flex-col gap-1 rounded-2xl bg-white/5 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs font-semibold text-white/90">{entry.label}</span>
                  </div>
                  <span className="text-[11px] text-white/40">{entry.percent.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
