import { Plus, ChevronRight } from 'lucide-react'
import { currentValue, totalDeposited, formatCZK } from './pensionData'
import PrimaryButton from '../ui/PrimaryButton'

export default function FundCard({ fund, onOpenDetail, onNewRecord }) {
  const value = currentValue(fund.records)
  const deposited = totalDeposited(fund.records)
  const gain = value - deposited
  const gainPct = deposited > 0 ? (gain / deposited) * 100 : 0
  const isPositive = gain >= 0

  return (
    <div className="liquid-glass flex flex-col gap-4 rounded-2xl p-5">
      {/* Fund name + color dot */}
      <div className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: fund.color, boxShadow: `0 0 6px 1px ${fund.color}60` }}
        />
        <span className="text-sm font-medium text-white/60">{fund.name}</span>
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-semibold tracking-tight text-white/90">
          {formatCZK(value)}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={[
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
              isPositive
                ? 'bg-[#30D158]/15 text-[#30D158]'
                : 'bg-red-500/15 text-red-400',
            ].join(' ')}
          >
            {isPositive ? '+' : ''}{gainPct.toFixed(1)}%
          </span>
          <span className={`text-xs ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{formatCZK(gain)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onOpenDetail(fund.id)}
          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          Detail
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
        <PrimaryButton className="flex-1 justify-center" onClick={() => onNewRecord(fund.id)}>
          <Plus size={13} strokeWidth={2.5} />
          Nový záznam
        </PrimaryButton>
      </div>
    </div>
  )
}
