export default function EmptyState({ icon = 'inbox', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 animate-fadeIn">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      {title && <h4 className="font-headline-md text-on-surface mb-1">{title}</h4>}
      {message && <p className="text-on-surface-variant font-body-md max-w-xs">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
