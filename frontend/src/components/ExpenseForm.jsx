import { useState } from 'react'
import { CATEGORIES } from '../utils/constants'
import { toInputDate } from '../utils/formatters'

export default function ExpenseForm({ initial, onSubmit, onCancel }) {
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0].code)
  const [date, setDate] = useState(initial?.date ? toInputDate(initial.date) : toInputDate(new Date()))
  const [description, setDescription] = useState(initial?.description ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const numericAmount = Number(amount)
    if (!numericAmount || numericAmount <= 0) {
      setError('Le montant doit être positif')
      return
    }
    if (numericAmount > 999999.99) {
      setError('Montant trop élevé')
      return
    }
    if (new Date(date) > new Date()) {
      setError('La date ne peut pas être future')
      return
    }
    if (description.length > 500) {
      setError('Description trop longue')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ amount: numericAmount, category, date, description })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Montant</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00 €"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3 font-amount-md"
          autoFocus
        />
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        >
          {CATEGORIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Date</label>
        <input
          type="date"
          value={date}
          max={toInputDate(new Date())}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        />
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
          Description <span className="normal-case font-normal opacity-60">(optionnel)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Courses hebdomadaires"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        />
      </div>
      {error && <p className="text-error text-label-sm">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
        >
          {submitting && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
