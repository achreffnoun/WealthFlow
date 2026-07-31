import { useState } from 'react'
import { CATEGORIES, INCOME_SOURCES, RECURRING_FREQUENCIES } from '../utils/constants'
import { toInputDate } from '../utils/formatters'

export default function RecurringTransactionForm({ initial, onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type ?? 'EXPENSE')
  const [amount, setAmount] = useState(initial?.amount ?? '')
  const [categoryOrSource, setCategoryOrSource] = useState(
    initial?.categoryOrSource ?? (type === 'INCOME' ? INCOME_SOURCES[0].code : CATEGORIES[0].code),
  )
  const [frequency, setFrequency] = useState(initial?.frequency ?? 'MONTHLY')
  const [startDate, setStartDate] = useState(initial?.startDate ? toInputDate(initial.startDate) : toInputDate(new Date()))
  const [endDate, setEndDate] = useState(initial?.endDate ? toInputDate(initial.endDate) : '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [active, setActive] = useState(initial?.active ?? true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const options = type === 'INCOME' ? INCOME_SOURCES : CATEGORIES

  const handleTypeChange = (nextType) => {
    setType(nextType)
    const nextOptions = nextType === 'INCOME' ? INCOME_SOURCES : CATEGORIES
    setCategoryOrSource(nextOptions[0].code)
  }

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
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError('La date de fin doit être après la date de début')
      return
    }
    if (description.length > 500) {
      setError('Description trop longue')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        type,
        amount: numericAmount,
        categoryOrSource,
        frequency,
        startDate,
        endDate: endDate || null,
        description,
      }
      if (initial) payload.active = active
      await onSubmit(payload)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Type</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`py-2.5 rounded-lg border font-bold transition-colors ${
              type === 'EXPENSE' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'
            }`}
          >
            Dépense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`py-2.5 rounded-lg border font-bold transition-colors ${
              type === 'INCOME' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'
            }`}
          >
            Revenu
          </button>
        </div>
      </div>
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
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
          {type === 'INCOME' ? 'Source' : 'Catégorie'}
        </label>
        <select
          value={categoryOrSource}
          onChange={(e) => setCategoryOrSource(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        >
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Fréquence</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        >
          {RECURRING_FREQUENCIES.map((f) => (
            <option key={f.code} value={f.code}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Début</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
          />
        </div>
        <div>
          <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Fin <span className="normal-case font-normal opacity-60">(optionnel)</span>
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
          />
        </div>
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
          Description <span className="normal-case font-normal opacity-60">(optionnel)</span>
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Loyer appartement"
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        />
      </div>
      {initial && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="text-body-md text-on-surface">Actif</span>
        </label>
      )}
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
