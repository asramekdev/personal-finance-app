import { LayoutDashboard, ChevronRight, PiggyBank, Wallet } from 'lucide-react'
import { currentValue, formatCZK } from '../pension/pensionData'
import { currentBalance } from '../dostupne/dostupneData'

export default function Prehled({ funds = [], products = [], onSectionChange }) {
  const pensionTotal = funds.reduce((s, f) => s + currentValue(f.records), 0)
  const dostupneTotal = products.reduce((s, p) => s + currentBalance(p.records), 0)

  return (
    <div className="section-fade flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {/* Section heading */}
      <div className="flex items-center gap-3 px-1">
        <LayoutDashboard size={18} strokeWidth={1.8} className="text-white/40" />
        <h1 className="text-lg font-semibold tracking-tight text-white/80">Přehled</h1>
      </div>

      {/* Dostupné prostředky card */}
      <button
        onClick={() => onSectionChange('dostupne')}
        className="liquid-glass group flex w-full items-center justify-between rounded-2xl p-5 text-left transition-all duration-150 hover:bg-white/[0.11]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30D158]/15">
            <Wallet size={20} strokeWidth={1.8} className="text-[#30D158]" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/35">
              Dostupné prostředky
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white/90">
              {formatCZK(dostupneTotal)}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-white/25 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white/50"
        />
      </button>

      {/* Pension savings card */}
      <button
        onClick={() => onSectionChange('penzijni')}
        className="liquid-glass group flex w-full items-center justify-between rounded-2xl p-5 text-left transition-all duration-150 hover:bg-white/[0.11]"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-apple-blue/15">
            <PiggyBank size={20} strokeWidth={1.8} className="text-apple-blue" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/35">
              Penzijní spoření
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white/90">
              {formatCZK(pensionTotal)}
            </p>
          </div>
        </div>
        <ChevronRight
          size={18}
          className="text-white/25 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-white/50"
        />
      </button>
    </div>
  )
}
