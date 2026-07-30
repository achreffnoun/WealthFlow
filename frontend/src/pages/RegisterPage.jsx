import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function passwordStrength(value) {
  const length = value.length
  if (length === 0) return { level: 0, label: 'Aucune', color: 'text-on-surface-variant' }
  if (length < 6) return { level: 1, label: 'Faible', color: 'text-error' }
  if (length < 10) return { level: 2, label: 'Moyenne', color: 'text-on-secondary-container' }
  return { level: 3, label: 'Forte', color: 'text-on-secondary-container font-semibold' }
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(password)
  const bars = [1, 2, 3].map((i) => i <= strength.level)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation")
      return
    }
    setLoading(true)
    try {
      await register({ firstName, lastName, email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-level-1 p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">WealthFlow</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Créer votre compte</h1>
          <p className="text-body-md text-on-surface-variant">Commencez votre voyage vers la liberté financière.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="firstname">
                Prénom
              </label>
              <input
                id="firstname"
                type="text"
                placeholder="Jean"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg text-body-md bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="lastname">
                Nom
              </label>
              <input
                id="lastname"
                type="text"
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg text-body-md bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-outline-variant rounded-lg text-body-md bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg text-body-md bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1 w-full h-1 rounded-full overflow-hidden bg-surface-variant">
                {bars.map((filled, i) => (
                  <div
                    key={i}
                    className={`h-full w-1/3 transition-all duration-300 ${
                      filled ? (strength.level === 1 ? 'bg-error' : strength.level === 2 ? 'bg-secondary-fixed-dim' : 'bg-on-secondary-container') : 'bg-surface-variant'
                    }`}
                  />
                ))}
              </div>
              <span className={`font-label-sm text-label-sm italic ${strength.color}`}>Sécurité : {strength.label}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface-variant ml-1" htmlFor="confirm-password">
              Confirmer mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 border border-outline-variant rounded-lg text-body-md bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-start gap-2 mt-1">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-all"
            />
            <label className="text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
              J'accepte les <a className="text-primary font-semibold hover:underline" href="#">conditions d'utilisation</a> et la
              politique de confidentialité.
            </label>
          </div>

          {error && <p className="text-error text-label-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-on-primary font-body-lg text-body-lg font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          >
            {loading ? 'Création...' : 'Créer un compte'}
          </button>
        </form>

        <div className="flex justify-center">
          <p className="text-body-md text-on-surface-variant">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
