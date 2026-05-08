import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

export default function DeleteConfirmModal({ product, onConfirm, onCancel }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.14] bg-[rgba(28,33,52,0.97)] shadow-2xl"
        style={{ backdropFilter: 'blur(40px) saturate(180%)' }}
        initial={{ opacity: 0, scale: 0.93, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 8 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Body */}
        <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-7 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/25">
            <Trash2 size={22} className="text-red-400" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold leading-snug text-white/95">
              Opravdu si přejete smazat<br />
              <span className="text-white">{product.name}</span>?
            </h2>
            <p className="text-sm leading-relaxed text-white/45">
              Smazáním produktu přijdete o možnost změnit stav a náhled do historie. Nebojte, graf vývoje celkové hodnoty dostupných prostředků smazání neovlivní.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-white/[0.08] px-6 py-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-white/[0.1] bg-white/[0.05] py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white/80"
          >
            Ne, ponechat
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_0px_rgba(239,68,68,0.35)] transition-all hover:bg-red-400"
          >
            Ano, smazat
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
