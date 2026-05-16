export default function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-xl bg-apple-blue/15 px-4 py-2 text-xs font-medium text-apple-blue transition-colors hover:bg-apple-blue/25 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
