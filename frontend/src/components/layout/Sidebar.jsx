import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/depenses', label: 'Expenses', icon: 'payments' },
  { to: '/budgets', label: 'Budgets', icon: 'account_balance_wallet' },
  { to: '/objectifs', label: 'Goals', icon: 'ads_click' },
  { to: '/analyses', label: 'Analytics', icon: 'monitoring' },
]

export default function Sidebar({ onQuickAdd }) {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface shadow-sm py-stack-lg z-50">
      <div className="px-gutter mb-stack-lg">
        <h1 className="font-display-lg text-display-md text-primary leading-tight">WealthFlow</h1>
        <p className="text-on-surface-variant font-label-sm opacity-70">Personal Finance</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors active:scale-95 duration-150 ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body-md">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 mt-auto">
        <button
          onClick={onQuickAdd}
          className="w-full py-3 bg-primary text-on-primary rounded-lg font-headline-md flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Add Transaction</span>
        </button>
      </div>
    </aside>
  )
}

export { NAV_ITEMS }
