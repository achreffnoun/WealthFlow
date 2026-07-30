import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-4 transform transition-transform hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">WealthFlow</h1>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/30 p-6 md:p-8">
            <header className="text-center mb-6">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Bon retour</h2>
              <p className="text-body-md text-on-surface-variant">Connectez-vous pour gérer vos finances</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="exemple@wealthflow.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md placeholder:text-outline/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">
                    Mot de passe
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">lock</span>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md placeholder:text-outline/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && <p className="text-error text-label-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 bg-primary text-on-primary rounded-lg font-headline-md text-headline-md shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
                {!loading && <span className="material-symbols-outlined text-xl">login</span>}
              </button>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-body-md text-on-surface-variant">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline ml-1">
                  Créer un compte
                </Link>
              </p>
            </footer>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">Sécurisé par WealthFlow Vault</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
