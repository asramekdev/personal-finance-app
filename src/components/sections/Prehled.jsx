import { LayoutDashboard } from 'lucide-react'

export default function Prehled() {
  return (
    <div className="section-fade flex flex-1 flex-col items-center justify-center gap-5 p-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/30">
        <LayoutDashboard size={32} strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white/90">Přehled</h1>
        <p className="mt-3 text-base text-white/35">
          Sekce Přehled – Připraveno pro definici logiky.
        </p>
      </div>
    </div>
  )
}
