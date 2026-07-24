export function Skeleton({ className = '' }) {
  return <div className={`skeleton animate-shimmer rounded-md ${className}`} />
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`tonal-card space-y-3 ${className}`}>
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-2 w-full" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="tonal-card space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}
