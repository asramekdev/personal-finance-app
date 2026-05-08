export default function StickyHeader({ title }) {
  return (
    <div className="shrink-0 flex items-center border-b border-white/[0.07] bg-white/[0.04] backdrop-blur-xl px-6 h-14 z-10">
      <h1 className="text-base font-semibold text-white/90">{title}</h1>
    </div>
  )
}
