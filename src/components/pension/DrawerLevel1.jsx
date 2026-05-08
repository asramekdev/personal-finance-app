import { motion } from 'framer-motion'
import { X, Pencil } from 'lucide-react'
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { fundChartData, formatChartDate, formatCZK, formatMonth } from './pensionData'

function MiniTooltip({ active, payload, label, view }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-gray-900/90 px-2.5 py-1.5 text-xs shadow-xl backdrop-blur-md">
      <p className="text-white/40">{formatChartDate(label, view)}</p>
      <p className="font-semibold text-white">{formatCZK(payload[0].value)}</p>
    </div>
  )
}

const SPRING = { type: 'spring', damping: 28, stiffness: 320 }

export default function DrawerLevel1({ fund, chartView, isL2Open, onClose, onEditRecord, onNewRecord }) {
  const chartData = fundChartData(fund.records, chartView)
  const sortedRecords = [...fund.records].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        className="absolute inset-y-0 right-0 flex w-[520px] flex-col overflow-hidden rounded-l-3xl border-l border-t border-b border-white/[0.12] bg-[rgba(15,20,35,0.82)] shadow-2xl"
        style={{ backdropFilter: 'blur(32px) saturate(160%)' }}
        initial={{ x: '100%' }}
        animate={{
          x: 0,
          scale: isL2Open ? 0.96 : 1,
          filter: isL2Open ? 'blur(3px)' : 'blur(0px)',
        }}
        exit={{ x: '100%' }}
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
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Mini chart */}
          <div className="h-28">
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
                  tickFormatter={d => formatChartDate(d, chartView)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  content={<MiniTooltip view={chartView} />}
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={fund.color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${fund.id})`}
                  dot={false}
                  activeDot={{ r: 3, fill: fund.color, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Table header */}
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

          {/* Records table */}
          <div className="overflow-x-auto">
            <table className="w-full pension-table">
              <thead>
                <tr>
                  <th className="text-left">Měsíc</th>
                  <th className="text-right">Účastník</th>
                  <th className="text-right">Zaměstnavatel</th>
                  <th className="text-right">Stát</th>
                  <th className="text-right">Hodnota</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map(record => (
                  <tr key={record.id}>
                    <td className="whitespace-nowrap pr-3 text-white/70">
                      {formatMonth(record.date)}
                    </td>
                    <td className="text-right tabular-nums text-white/65">
                      {record.participant.toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="text-right tabular-nums text-white/65">
                      {record.employer.toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="text-right tabular-nums text-white/65">
                      {record.state.toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="text-right tabular-nums font-medium text-white/85">
                      {record.value.toLocaleString('cs-CZ')} Kč
                    </td>
                    <td className="pl-3">
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
      </motion.div>
    </>
  )
}
