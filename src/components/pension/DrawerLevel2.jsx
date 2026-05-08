import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { X } from 'lucide-react'
import { formatMonth } from './pensionData'

const SPRING = { type: 'spring', damping: 30, stiffness: 340 }

function Field({ label, value, onChange, type = 'number', suffix }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/40">{label}</label>
      <div className="flex overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.06] transition-colors focus-within:border-apple-blue/60 focus-within:bg-white/[0.09]">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white/90 outline-none"
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

export default function DrawerLevel2({ fundId, record, onSave, onClose }) {
  const isEdit = record !== null && record !== 'new'
  const isMobile = useIsMobile()

  const [form, setForm] = useState({
    date: '',
    participant: '',
    employer: '',
    state: '230',
    value: '',
  })

  useEffect(() => {
    if (isEdit) {
      setForm({
        date: record.date,
        participant: String(record.participant),
        employer: String(record.employer),
        state: String(record.state),
        value: String(record.value),
      })
    } else {
      const now = new Date()
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      setForm({ date: month, participant: '', employer: '', state: '230', value: '' })
    }
  }, [record, isEdit])

  function set(key) {
    return val => setForm(f => ({ ...f, [key]: val }))
  }

  function handleSave() {
    if (!form.date || !form.value) return
    onSave(fundId, {
      id: form.date,
      date: form.date,
      participant: Number(form.participant) || 0,
      employer: Number(form.employer) || 0,
      state: Number(form.state) || 0,
      value: Number(form.value) || 0,
    })
  }

  const title = isEdit ? `Upravit – ${formatMonth(record.date)}` : 'Nový záznam'

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
        className={isMobile
          ? 'fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl border-t border-white/[0.15] bg-[rgba(18,24,42,0.92)] shadow-2xl'
          : 'absolute inset-y-0 right-0 z-20 flex w-[400px] flex-col overflow-hidden rounded-l-3xl border-l border-t border-b border-white/[0.15] bg-[rgba(18,24,42,0.88)] shadow-2xl'
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
        {/* Date field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/40">Měsíc / Rok</label>
          <input
            type="month"
            value={form.date}
            onChange={e => set('date')(e.target.value)}
            className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] px-3.5 py-2.5 text-sm text-white/90 outline-none transition-all focus:border-apple-blue/60 focus:bg-white/[0.09] focus:ring-1 focus:ring-apple-blue/30 [color-scheme:dark]"
          />
        </div>

        <Field
          label="Vklad účastníka"
          value={form.participant}
          onChange={set('participant')}
          suffix="Kč"
        />
        <Field
          label="Vklad zaměstnavatele"
          value={form.employer}
          onChange={set('employer')}
          suffix="Kč"
        />
        <Field
          label="Státní příspěvek"
          value={form.state}
          onChange={set('state')}
          suffix="Kč"
        />
        <Field
          label="Hodnota fondu k ultimu měsíce"
          value={form.value}
          onChange={set('value')}
          suffix="Kč"
        />
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.08] px-6 py-4 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
        >
          Zavřít
        </button>
        <button
          onClick={handleSave}
          disabled={!form.date || !form.value}
          className="flex-1 rounded-xl bg-apple-blue py-2.5 text-sm font-semibold text-white shadow-apple-glow transition-opacity disabled:opacity-40 hover:opacity-90"
        >
          Uložit
        </button>
      </div>
      </motion.div>
    </>
  )
}
