import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('thomas@example.com')
  const [password, setPassword] = useState('password123')
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
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-level-2 p-8">
        <h1 className="font-headline-lg text-headline-lg text-primary text-center mb-1">WealthFlow</h1>
        <p className="text-on-surface-variant text-body-md text-center mb-8">Connectez-vous à votre compte</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
            />
          </div>
          <div>
            <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
            />
          </div>
          {error && <p className="text-error text-label-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-body-md text-on-surface-variant mt-6">
          Pas de compte ?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
        <p className="text-center text-label-sm text-on-surface-variant mt-4 opacity-70">
          Démo : thomas@example.com / password123
        </p>
      </div>
    </div>
  )
}
