import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/depenses', label: 'Expenses', icon: 'payments' },
  { to: '/budgets', label: 'Budgets', icon: 'account_balance_wallet' },
  { to: '/objectifs', label: 'Goals', icon: 'ads_click' },
  { to: '/analyses', label: 'Analytics', icon: 'monitoring' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex items-center justify-around px-4 z-50">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
          }
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="text-[10px] font-semibold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
