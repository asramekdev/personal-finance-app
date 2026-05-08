import { LayoutDashboard, Wallet, TrendingUp, PiggyBank } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'prehled', label: 'Přehled', icon: LayoutDashboard },
  { id: 'dostupne', label: 'Dostupné prostředky', icon: Wallet },
  { id: 'investovani', label: 'Investování', icon: TrendingUp },
  { id: 'penzijni', label: 'Penzijní spoření', icon: PiggyBank },
]

export default function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="liquid-glass hidden md:flex w-60 shrink-0 flex-col rounded-r-4xl px-4 py-6 z-10">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-apple-blue/90 shadow-apple-glow">
          <span className="text-lg font-bold text-white">₣</span>
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-white/90">Osobní</p>
          <p className="text-sm font-semibold leading-tight text-white/90">Finance</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={[
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-apple-blue/20 text-apple-blue shadow-apple-glow'
                  : 'text-white/55 hover:bg-white/5 hover:text-white/80',
              ].join(' ')}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className="shrink-0"
              />
              <span className="truncate">{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
