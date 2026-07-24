import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCmpGMsIYCEu9QjbEkiKzdIVz5JeACX9gfYuQiMdSUUJ9NPvKwDuL5LMD9wTQ1df2kbJuGBJ85BVytYGmWT-3tMWAZiVNM-t9KS5AwDsyEQiZjVEeFi9yBQZC527iyDLqihcPV8vJVI2K5JRrj5TAXqLcXD0SBe6tbvnoMesN9SH_1NQUQhYrqU2rTckFA4DqfmmugB1jJeOlF5eB9G7ahenzQo9_G3q61wHy8tikhgewPy45wcj4G79rTlptki3WmCAQI62N1pNh0'

export default function TopBar() {
  const { logout } = useAuth()
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
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-all">
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant"
          >
            <img className="w-full h-full object-cover" src={AVATAR_URL} alt="Profil" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 bg-surface-container-lowest rounded-lg shadow-level-2 border border-outline-variant/30 py-2 w-44">
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
