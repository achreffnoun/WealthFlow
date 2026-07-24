import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type, leaving: false }])
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    }, 2700)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-level-2 font-body-md text-body-md text-white flex items-center gap-2 ${
              t.leaving ? 'animate-fadeOut' : 'animate-slideInRight'
            } ${t.type === 'error' ? 'bg-error' : t.type === 'warning' ? 'bg-amber' : 'bg-secondary'}`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {t.type === 'error' ? 'error' : t.type === 'warning' ? 'warning' : 'check_circle'}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
