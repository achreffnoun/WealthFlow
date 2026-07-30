import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import Avatar from '../ui/Avatar'

export default function TopBar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-[64px] fixed top-0 right-0 left-0 md:left-64 z-40 bg-surface shadow-sm flex items-center">
      <div className="flex justify-between items-center px-gutter w-full max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md w-64 focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Rechercher..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant"
          >
            <Avatar user={user} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 bg-surface-container-lowest rounded-lg shadow-level-2 border border-outline-variant/30 py-2 w-52">
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                  {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                </button>
                <button className="w-full text-left px-4 py-2 text-body-md text-on-surface hover:bg-surface-container-low flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Paramètres
                </button>
                <div className="my-1 border-t border-outline-variant/30" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-body-md text-error hover:bg-surface-container-low flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
