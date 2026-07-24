const COLORS = {
  mint: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
}

export default function ProgressBar({ percent, color = 'mint', height = 8, trackClassName = 'bg-surface-variant' }) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className={`w-full ${trackClassName} rounded-full overflow-hidden`} style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: COLORS[color] || color }}
      />
    </div>
  )
}
