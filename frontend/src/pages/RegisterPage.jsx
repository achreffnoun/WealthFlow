import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
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
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-level-2 p-8">
        <h1 className="font-headline-lg text-headline-lg text-primary text-center mb-1">WealthFlow</h1>
        <p className="text-on-surface-variant text-body-md text-center mb-8">Créez votre compte</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
              />
            </div>
            <div>
              <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
              />
            </div>
          </div>
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
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="text-center text-body-md text-on-surface-variant mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}
