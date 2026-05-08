import { Plus, ChevronRight, Trash2 } from 'lucide-react'
import { currentBalance, lastMonthBalance, formatCZK } from './dostupneData'

export default function ProductCard({ product, onOpenHistorie, onNewRecord, onDelete }) {
  const balance = currentBalance(product.records)
  const prevBalance = lastMonthBalance(product.records)
  const change = balance - prevBalance
  const changePct = prevBalance > 0 ? (change / prevBalance) * 100 : 0
  const isPositive = change >= 0

  return (
    <div className="liquid-glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: product.color, boxShadow: `0 0 6px 1px ${product.color}60` }}
          />
          <span className="text-sm font-medium text-white/60">{product.name}</span>
        </div>
        <button
          onClick={() => onDelete(product.id)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white/25 transition-colors hover:bg-red-500/15 hover:text-red-400"
          title="Smazat produkt"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div>
        <p className="text-2xl font-semibold tracking-tight text-white/90">
          {formatCZK(balance)}
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
            {isPositive ? '+' : ''}{changePct.toFixed(2)}%
          </span>
          <span className={`text-xs ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{formatCZK(change)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onOpenHistorie(product.id)}
          className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          Historie
          <ChevronRight size={13} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onNewRecord(product.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-apple-blue/15 py-2 text-xs font-medium text-apple-blue transition-colors hover:bg-apple-blue/25"
        >
          <Plus size={13} strokeWidth={2.5} />
          Nový záznam
        </button>
      </div>
    </div>
  )
}
