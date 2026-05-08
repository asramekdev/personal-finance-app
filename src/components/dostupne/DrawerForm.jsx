import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'

const SPRING = { type: 'spring', damping: 30, stiffness: 340 }

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function DrawerForm({ mode, record, onClose, onSave }) {
  const isProduct = mode === 'product'
  const isEdit = mode === 'record' && record
  const isMobile = useIsMobile()

  const [name, setName] = useState('')
  const [date, setDate] = useState(isEdit ? record.date : today())
  const [balance, setBalance] = useState(isEdit ? String(record.balance) : '')

  function handleSave() {
    const bal = parseFloat(balance)
    if (!date || isNaN(bal)) return
    if (isProduct) {
      if (!name.trim()) return
      onSave({ type: 'product', name: name.trim(), date, balance: Math.round(bal) })
    } else {
      onSave({ type: 'record', date, balance: Math.round(bal) })
    }
  }

  const title = isProduct
    ? 'Přidat produkt'
    : isEdit
    ? `Upravit záznam`
    : 'Nový záznam'

  return (
    <>
      <motion.div
        className={isMobile ? 'fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]' : 'absolute inset-0 bg-black/25'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className={isMobile
          ? 'fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/[0.12] bg-[rgba(15,20,35,0.92)] shadow-2xl'
          : 'absolute inset-y-0 right-0 flex w-[420px] flex-col overflow-hidden rounded-l-3xl border-l border-t border-b border-white/[0.12] bg-[rgba(15,20,35,0.88)] shadow-2xl'
        }
        style={{ backdropFilter: 'blur(32px) saturate(160%)' }}
        initial={isMobile ? { y: '100%' } : { x: '100%' }}
        animate={isMobile ? { y: 0 } : { x: 0 }}
        exit={isMobile ? { y: '100%' } : { x: '100%' }}
        transition={SPRING}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <h2 className="text-base font-semibold text-white/90">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-white/50 transition-colors hover:bg-white/15 hover:text-white/80"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
          {isProduct && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-white/35">
                Název produktu
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="např. Spořicí účet ČSOB"
                className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white/85 placeholder-white/25 outline-none transition-colors focus:border-apple-blue/50 focus:bg-white/[0.08]"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-white/35">
              Měsíc / Rok
            </label>
            <input
              type="month"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm text-white/85 outline-none transition-colors focus:border-apple-blue/50 focus:bg-white/[0.08] [color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-white/35">
              {isProduct ? 'Počáteční zůstatek' : 'Aktuální zůstatek'}
            </label>
            <div className="flex overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.05] transition-colors focus-within:border-apple-blue/50 focus-within:bg-white/[0.08]">
              <input
                type="number"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                placeholder="0"
                min="0"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white/85 placeholder-white/25 outline-none"
              />
              <span className="flex items-center border-l border-white/[0.08] px-3 text-sm text-white/35">
                Kč
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-3 border-t border-white/[0.08] px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
          >
            Zavřít
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-apple-blue py-2.5 text-sm font-medium text-white transition-colors hover:bg-apple-blue/85"
          >
            Uložit
          </button>
        </div>
      </motion.div>
    </>
  )
}
