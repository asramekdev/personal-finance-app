import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { X } from 'lucide-react'
import { formatMonth } from './investovaniData'

const SPRING = { type: 'spring', damping: 30, stiffness: 340 }

function Field({ label, value, onChange, type = 'number', suffix, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/40">{label}</label>
      <div className="flex overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.06] transition-colors focus-within:border-apple-blue/60 focus-within:bg-white/[0.09]">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white/90 outline-none placeholder:text-white/25"
          min={type === 'number' ? 0 : undefined}
        />
        {suffix && (
          <span className="flex items-center border-l border-white/[0.08] px-3 text-sm text-white/35">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

function MonthField({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/40">{label}</label>
      <input
        type="month"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] px-3.5 py-2.5 text-sm text-white/90 outline-none transition-all focus:border-apple-blue/60 focus:bg-white/[0.09] [color-scheme:dark]"
      />
    </div>
  )
}

const TITLES = {
  addBroker: 'Přidat brokera',
  addTicker: 'Přidat ticker',
  newRecord: 'Nový záznam hodnoty',
  editRecord: null,
  newPurchase: 'Nový nákup',
  editPurchase: null,
}

export default function InvestovaniDrawerL2({ mode, data, onSave, onClose }) {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({})

  useEffect(() => {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    if (mode === 'addBroker') {
      setForm({ name: '' })
    } else if (mode === 'addTicker') {
      setForm({ symbol: '', name: '', date: month, shares: '', pricePerShare: '' })
    } else if (mode === 'newRecord') {
      setForm({ date: month, value: '', shares: '' })
    } else if (mode === 'editRecord') {
      setForm({ date: data.date, value: String(data.value), shares: String(data.shares ?? '') })
    } else if (mode === 'newPurchase') {
      setForm({ date: month, shares: '', pricePerShare: '' })
    } else if (mode === 'editPurchase') {
      setForm({ date: data.date, shares: String(data.shares), pricePerShare: String(data.pricePerShare) })
    }
  }, [mode, data])

  function set(key) {
    return val => setForm(f => ({ ...f, [key]: val }))
  }

  function isValid() {
    if (mode === 'addBroker') return form.name?.trim()
    if (mode === 'addTicker') return form.symbol?.trim() && form.date
    if (mode === 'newRecord' || mode === 'editRecord') return form.date && form.value
    if (mode === 'newPurchase' || mode === 'editPurchase') return form.date && form.shares
    return false
  }

  function handleSave() {
    if (!isValid()) return

    if (mode === 'addBroker') {
      onSave({ name: form.name.trim() })
    } else if (mode === 'addTicker') {
      onSave({
        symbol: form.symbol.trim().toUpperCase(),
        name: form.name.trim() || form.symbol.trim().toUpperCase(),
        date: form.date,
        shares: Number(form.shares) || 0,
        pricePerShare: Number(form.pricePerShare) || 0,
      })
    } else if (mode === 'newRecord' || mode === 'editRecord') {
      onSave({
        id: form.date,
        date: form.date,
        value: Number(form.value) || 0,
        shares: Number(form.shares) || 0,
      })
    } else if (mode === 'newPurchase' || mode === 'editPurchase') {
      onSave({
        id: mode === 'editPurchase' ? data.id : `p-${Date.now()}`,
        date: form.date,
        shares: Number(form.shares) || 0,
        pricePerShare: Number(form.pricePerShare) || 0,
      })
    }
  }

  const title =
    TITLES[mode] ??
    (mode === 'editRecord' && data
      ? `Upravit záznam – ${formatMonth(data.date)}`
      : mode === 'editPurchase' && data
        ? `Upravit nákup – ${formatMonth(data.date)}`
        : 'Upravit')

  return (
    <>
      {isMobile && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      <motion.div
        className={
          isMobile
            ? 'fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/[0.15] bg-[rgba(18,24,42,0.92)] shadow-2xl'
            : 'absolute inset-y-0 right-0 z-20 flex w-[400px] flex-col overflow-hidden rounded-l-3xl border-b border-l border-t border-white/[0.15] bg-[rgba(18,24,42,0.88)] shadow-2xl'
        }
        style={{ backdropFilter: 'blur(36px) saturate(160%)' }}
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
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6">
          {mode === 'addBroker' && (
            <Field
              label="Název brokera"
              value={form.name || ''}
              onChange={set('name')}
              type="text"
              placeholder="např. XTB, Trading 212…"
            />
          )}

          {mode === 'addTicker' && (
            <>
              <Field
                label="Symbol (ticker)"
                value={form.symbol || ''}
                onChange={set('symbol')}
                type="text"
                placeholder="např. AAPL"
              />
              <Field
                label="Název společnosti"
                value={form.name || ''}
                onChange={set('name')}
                type="text"
                placeholder="např. Apple Inc."
              />
              <MonthField label="Aktuální měsíc / rok" value={form.date || ''} onChange={set('date')} />
              <Field
                label="Počet kusů (uložené prostředky)"
                value={form.shares || ''}
                onChange={set('shares')}
                suffix="ks"
              />
              <Field
                label="Aktuální cena za kus"
                value={form.pricePerShare || ''}
                onChange={set('pricePerShare')}
                suffix="Kč"
              />
              {form.shares && form.pricePerShare && (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                  <p className="text-xs text-white/35">Uložené prostředky</p>
                  <p className="mt-0.5 text-sm font-semibold text-white/80">
                    {((Number(form.shares) || 0) * (Number(form.pricePerShare) || 0)).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              )}
            </>
          )}

          {(mode === 'newRecord' || mode === 'editRecord') && (
            <>
              <MonthField label="Měsíc / Rok" value={form.date || ''} onChange={set('date')} />
              <Field
                label="Počet akcií"
                value={form.shares || ''}
                onChange={set('shares')}
                suffix="ks"
              />
              <Field
                label="Hodnota pozice k ultimu měsíce"
                value={form.value || ''}
                onChange={set('value')}
                suffix="Kč"
              />
            </>
          )}

          {(mode === 'newPurchase' || mode === 'editPurchase') && (
            <>
              <MonthField label="Měsíc / Rok nákupu" value={form.date || ''} onChange={set('date')} />
              <Field
                label="Počet nakoupených kusů"
                value={form.shares || ''}
                onChange={set('shares')}
                suffix="ks"
              />
              <Field
                label="Nákupní cena za kus"
                value={form.pricePerShare || ''}
                onChange={set('pricePerShare')}
                suffix="Kč"
              />
              {form.shares && form.pricePerShare && (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                  <p className="text-xs text-white/35">Celková investice</p>
                  <p className="mt-0.5 text-sm font-semibold text-white/80">
                    {((Number(form.shares) || 0) * (Number(form.pricePerShare) || 0)).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-3 border-t border-white/[0.08] px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
          >
            Zavřít
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid()}
            className="flex-1 rounded-xl bg-apple-blue py-2.5 text-sm font-semibold text-white shadow-apple-glow transition-opacity disabled:opacity-40 hover:opacity-90"
          >
            Uložit
          </button>
        </div>
      </motion.div>
    </>
  )
}
