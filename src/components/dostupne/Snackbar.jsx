import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function Snackbar({ message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, duration)
    return () => clearTimeout(t)
  }, [onDismiss, duration])

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[100] flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-[rgba(20,25,42,0.92)] px-4 py-3 shadow-2xl"
      style={{ backdropFilter: 'blur(32px) saturate(160%)' }}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ type: 'spring', damping: 28, stiffness: 340 }}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#30D158]/15">
        <CheckCircle2 size={14} className="text-[#30D158]" />
      </div>
      <p className="text-sm font-medium text-white/85">{message}</p>
    </motion.div>
  )
}
