import { LayoutDashboard, Wallet, TrendingUp, PiggyBank } from 'lucide-react'

const TABS = [
  { id: 'prehled', label: 'Přehled', icon: LayoutDashboard },
  { id: 'dostupne', label: 'Dostupné', icon: Wallet },
  { id: 'investovani', label: 'Investování', icon: TrendingUp },
  { id: 'penzijni', label: 'Penzijní', icon: PiggyBank },
]

export default function BottomTabBar({ activeSection, onSectionChange }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 flex border-t border-white/[0.08] md:hidden"
      style={{
        background: 'rgba(12,16,30,0.82)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id
        return (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={[
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-apple-blue' : 'text-white/40 hover:text-white/65',
            ].join(' ')}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
