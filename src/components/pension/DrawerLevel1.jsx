import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { X, Pencil } from 'lucide-react'
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { fundChartData, formatChartDate, formatCZK, formatMonth, currentValue, totalDeposited } from './pensionData'

function ChartTooltip({ active, payload, label, view }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/90 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-[11px] text-white/40">{formatChartDate(label, view)}</p>
      <p className="text-sm font-semibold text-white">{formatCZK(payload[0].value)}</p>
    </div>
  )
}

const SPRING = { type: 'spring', damping: 28, stiffness: 320 }

export default function DrawerLevel1({ fund, isL2Open, onClose, onEditRecord, onNewRecord }) {
  const [view, setView] = useState('months')
  const isMobile = useIsMobile()
  const chartData = fundChartData(fund.records, view)
  const sortedRecords = [...fund.records].sort((a, b) => b.date.localeCompare(a.date))

  const value = currentValue(fund.records)
  const deposited = totalDeposited(fund.records)
  const gain = value - deposited
  const gainPct = deposited > 0 ? (gain / deposited) * 100 : 0
  const isPositive = gain >= 0

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className={isMobile ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]' : 'absolute inset-0 bg-black/45 backdrop-blur-[2px]'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className={isMobile
          ? 'fixed inset-x-0 bottom-0 z-40 flex max-h-[92vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/[0.12] bg-[rgba(15,20,35,0.82)] shadow-2xl'
          : 'absolute inset-y-0 right-0 flex w-[888px] flex-col overflow-hidden rounded-l-3xl border-l border-t border-b border-white/[0.12] bg-[rgba(15,20,35,0.82)] shadow-2xl'
        }
        style={{ backdropFilter: 'blur(32px) saturate(160%)' }}
        initial={isMobile ? { y: '100%' } : { x: '100%' }}
        animate={isMobile
          ? { y: 0, scale: isL2Open ? 0.97 : 1, filter: isL2Open ? 'blur(3px)' : 'blur(0px)' }
          : { x: 0, scale: isL2Open ? 0.96 : 1, filter: isL2Open ? 'blur(3px)' : 'blur(0px)' }
        }
        exit={isMobile ? { y: '100%' } : { x: '100%' }}
        transition={SPRING}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: fund.color, boxShadow: `0 0 6px 1px ${fund.color}60` }}
            />
            <h2 className="text-base font-semibold text-white/90">{fund.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-white/80"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-5">
          {/* Hero fund card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5">
            {/* Top row: value + segmented control */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                  Celková hodnota fondu
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white/95">
                  {formatCZK(value)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold',
                      isPositive
                        ? 'bg-[#30D158]/15 text-[#30D158] shadow-[0_0_8px_0px_rgba(48,209,88,0.3)]'
                        : 'bg-red-500/15 text-red-400',
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
                    onClick={() => setView(key)}
                    className={[
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
                      view === key
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
            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${fund.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={fund.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={fund.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickFormatter={d => formatChartDate(d, view)}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <Tooltip
                    content={<ChartTooltip view={view} />}
                    cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={fund.color}
                    strokeWidth={2}
                    fill={`url(#grad-${fund.id})`}
                    dot={false}
                    activeDot={{ r: 4, fill: fund.color, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table section */}
          <div className="flex flex-col gap-2">
            {/* Heading row above card */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-widest text-white/35">
                Historické záznamy
              </h3>
              <button
                onClick={() => onNewRecord(fund.id)}
                className="flex items-center gap-1 rounded-lg bg-apple-blue/15 px-3 py-1 text-xs font-medium text-apple-blue transition-colors hover:bg-apple-blue/25"
              >
                + Nový záznam
              </button>
            </div>

            {/* Table card */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05]">
              <div className="overflow-x-auto">
                <table className="w-full pension-table">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="px-4 pb-3 pt-3 text-left">Měsíc</th>
                      <th className="px-4 pb-3 pt-3 text-right">Účastník</th>
                      <th className="px-4 pb-3 pt-3 text-right">Zaměstnavatel</th>
                      <th className="px-4 pb-3 pt-3 text-right">Stát</th>
                      <th className="px-4 pb-3 pt-3 text-right">Hodnota</th>
                      <th className="px-4 pb-3 pt-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map(record => (
                      <tr key={record.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="whitespace-nowrap px-4 py-2.5 text-white/70">
                          {formatMonth(record.date)}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-white/65">
                          {record.participant.toLocaleString('cs-CZ')} Kč
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-white/65">
                          {record.employer.toLocaleString('cs-CZ')} Kč
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-white/65">
                          {record.state.toLocaleString('cs-CZ')} Kč
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-medium text-white/85">
                          {record.value.toLocaleString('cs-CZ')} Kč
                        </td>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => onEditRecord(record)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/8 hover:text-white/60"
                            title="Upravit"
                          >
                            <Pencil size={11} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.08] px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
          >
            Zavřít
          </button>
        </div>
      </motion.div>
    </>
  )
}
