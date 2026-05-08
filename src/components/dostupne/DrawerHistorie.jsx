import { useState } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { X, Pencil } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  productChartData, formatChartDate, formatCZK, formatMonth,
  currentBalance, lastMonthBalance,
} from './dostupneData'

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

export default function DrawerHistorie({ product, isL2Open, onClose, onEditRecord, onNewRecord }) {
  const [view, setView] = useState('months')
  const chartData = productChartData(product.records, view)
  const sortedRecords = [...product.records].sort((a, b) => b.date.localeCompare(a.date))

  const balance = currentBalance(product.records)
  const prevBalance = lastMonthBalance(product.records)
  const change = balance - prevBalance
  const changePct = prevBalance > 0 ? (change / prevBalance) * 100 : 0
  const isPositive = change >= 0
  const chartColor = isPositive ? '#30D158' : '#FF3B30'
  const isMobile = useIsMobile()

  return (
    <>
      <motion.div
        className={isMobile ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]' : 'absolute inset-0 bg-black/45 backdrop-blur-[2px]'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

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
              style={{ backgroundColor: product.color, boxShadow: `0 0 6px 1px ${product.color}60` }}
            />
            <h2 className="text-base font-semibold text-white/90">{product.name}</h2>
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
          {/* Hero card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/35">
                  Aktuální zůstatek
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white/95">
                  {formatCZK(balance)}
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
                    {isPositive ? '+' : ''}{changePct.toFixed(2)}%
                  </span>
                  <span className={`text-sm font-medium ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{formatCZK(change)}
                  </span>
                  <span className="text-xs text-white/30">oproti minulému měsíci</span>
                </div>
              </div>

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

            <div className="mt-4 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gradDostupne-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
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
                    stroke={chartColor}
                    strokeWidth={2}
                    fill={`url(#gradDostupne-${product.id})`}
                    dot={false}
                    activeDot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-widest text-white/35">
                Historické záznamy
              </h3>
              <button
                onClick={() => onNewRecord(product.id)}
                className="flex items-center gap-1 rounded-lg bg-apple-blue/15 px-3 py-1 text-xs font-medium text-apple-blue transition-colors hover:bg-apple-blue/25"
              >
                + Nový záznam
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05]">
              <div className="overflow-x-auto">
                <table className="w-full pension-table">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="px-4 pb-3 pt-3 text-left">Měsíc / Rok</th>
                      <th className="px-4 pb-3 pt-3 text-right">Zůstatek</th>
                      <th className="px-4 pb-3 pt-3 text-right">Změna</th>
                      <th className="px-4 pb-3 pt-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((record, idx) => {
                      const prevRecord = sortedRecords[idx + 1]
                      const diff = prevRecord ? record.balance - prevRecord.balance : null
                      const diffPct = prevRecord ? (diff / prevRecord.balance) * 100 : null
                      const pos = diff === null ? null : diff >= 0

                      return (
                        <tr key={record.id} className="transition-colors hover:bg-white/[0.03]">
                          <td className="whitespace-nowrap px-4 py-2.5 text-white/70">
                            {formatMonth(record.date)}
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-medium text-white/85">
                            {record.balance.toLocaleString('cs-CZ')} Kč
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-sm">
                            {diff !== null ? (
                              <span className={pos ? 'text-[#30D158]' : 'text-red-400'}>
                                {pos ? '+' : ''}{formatCZK(diff)}
                                <span className="ml-1 text-xs opacity-60">
                                  ({pos ? '+' : ''}{diffPct.toFixed(1)}%)
                                </span>
                              </span>
                            ) : (
                              <span className="text-white/25">—</span>
                            )}
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
                      )
                    })}
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
