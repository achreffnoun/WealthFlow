import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-gutter">
      <div className="absolute inset-0 bg-on-background/40 animate-fadeIn" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-xl shadow-level-2 w-full max-w-md max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
