import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { CATEGORIES, getCategory } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import { spentForBudget, budgetStatusColor } from '../utils/calculations'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ProgressBar from '../components/ui/ProgressBar'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const BAR_COLOR = { mint: '#10B981', amber: '#F59E0B', red: '#EF4444' }

function BudgetForm({ initial, existingCategories, onSubmit, onCancel, month, year }) {
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES.find((c) => !existingCategories.includes(c.code))?.code ?? CATEGORIES[0].code)
  const [limit, setLimit] = useState(initial?.limit ?? '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const numericLimit = Number(limit)
    if (!numericLimit || numericLimit <= 0) {
      setError('Le montant doit être positif')
      return
    }
    if (!initial && existingCategories.includes(category)) {
      setError('Un budget existe déjà pour cette catégorie ce mois-ci')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ category, limit: numericLimit, month, year })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Catégorie</label>
        <select
          value={category}
          disabled={!!initial}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3 disabled:opacity-60"
        >
          {CATEGORIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Montant limite</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="500.00 €"
          autoFocus
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3 font-amount-md"
        />
      </div>
      {error && <p className="text-error text-label-sm">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-low transition-colors">
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

export default function BudgetsPage() {
  const { expenses, budgets, addBudget, updateBudget, deleteBudget, loading } = useApp()
  const { showToast } = useToast()

  const today = new Date()
  const [cursor, setCursor] = useState({ month: today.getMonth() + 1, year: today.getFullYear() })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const monthBudgets = useMemo(
    () => budgets.filter((b) => b.month === cursor.month && b.year === cursor.year),
    [budgets, cursor],
  )

  const rows = useMemo(
    () =>
      monthBudgets.map((b) => {
        const spent = spentForBudget(expenses, b)
        const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100 * 10) / 10 : 0
        const count = expenses.filter(
          (e) => e.category === b.category && e.date.slice(0, 7) === `${b.year}-${String(b.month).padStart(2, '0')}`,
        ).length
        return { ...b, spent, percent, count, remaining: Number(b.limit) - spent, color: budgetStatusColor(percent) }
      }),
    [monthBudgets, expenses],
  )

  useEffect(() => {
    rows.forEach((r) => {
      const key = `alert:${r.id}:${cursor.month}-${cursor.year}`
      const already = sessionStorage.getItem(key)
      if (!already && r.percent >= 100) {
        showToast(`Budget ${getCategory(r.category).label} dépassé (${Math.round(r.percent)}%)`, 'error')
        sessionStorage.setItem(key, '100')
      } else if (!already && r.percent >= 80) {
        showToast(`Budget ${getCategory(r.category).label} à ${Math.round(r.percent)}%`, 'warning')
        sessionStorage.setItem(key, '80')
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows])

  const totalLimit = rows.reduce((s, r) => s + Number(r.limit), 0)
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0)
  const utilization = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0

  const changeMonth = (delta) => {
    setCursor((prev) => {
      let month = prev.month + delta
      let year = prev.year
      if (month > 12) {
        month = 1
        year += 1
      } else if (month < 1) {
        month = 12
        year -= 1
      }
      return { month, year }
    })
  }

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (budget) => {
    setEditing(budget)
    setFormOpen(true)
  }
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateBudget(editing.id, { limit: data.limit })
        showToast('Budget modifié')
      } else {
        await addBudget(data)
        showToast('Budget créé')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteBudget(toDelete.id)
      showToast('Budget supprimé')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Month Navigation & Action Header */}
      <section className="flex flex-col sm:flex-row justify-between items-center mb-stack-lg gap-gutter">
        <div className="flex items-center bg-surface-container rounded-xl p-1 gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors flex items-center text-on-surface-variant">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="px-6 py-2 bg-white rounded-lg shadow-sm">
            <h2 className="font-headline-md text-headline-md text-primary">
              {MONTH_NAMES[cursor.month - 1]} {cursor.year}
            </h2>
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-surface-container-high rounded-lg transition-colors flex items-center text-on-surface-variant">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-lg font-body-md font-bold hover:shadow-md transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Nouveau Budget
        </button>
      </section>

      {/* Summary Card */}
      <section className="mb-stack-lg">
        <div className="bg-white shadow-level-1 rounded-xl p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full md:w-3/4">
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Budget</p>
                <p className="font-amount-lg text-amount-lg text-on-surface">{formatCurrency(totalLimit)}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Dépensé</p>
                <p className="font-amount-lg text-amount-lg text-secondary">{formatCurrency(totalSpent)}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Restant</p>
                <p className="font-amount-lg text-amount-lg text-primary">{formatCurrency(totalLimit - totalSpent)}</p>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="text-right">
                <p className="font-label-sm text-on-surface-variant mb-1">Utilisation</p>
                <p className="font-display-lg text-display-lg text-primary leading-none">{utilization}%</p>
              </div>
            </div>
          </div>
          <div className="mt-8 h-3 w-full bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(100, utilization)}%` }}
            />
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <EmptyState
          icon="account_balance_wallet"
          title="Aucun budget"
          message={`Aucun budget pour ${MONTH_NAMES[cursor.month - 1]} ${cursor.year}. Créez-en un pour commencer à suivre vos catégories.`}
          action={
            <button onClick={openAdd} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Nouveau Budget
            </button>
          }
        />
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-lg">
          {rows.map((r) => {
            const cat = getCategory(r.category)
            const over = r.percent >= 100
            return (
              <div key={r.id} className="bg-white shadow-level-1 rounded-xl p-5 border border-transparent hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}26`, color: cat.color }}>
                      <span className="material-symbols-outlined">{cat.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md">{cat.label}</h3>
                      <p className="font-label-sm text-on-surface-variant">
                        {r.count} transaction{r.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(r)} className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button onClick={() => setToDelete(r)} className="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant hover:text-error">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-label-sm text-on-surface-variant">Dépensé</p>
                      <p className="font-amount-md text-amount-md font-bold">{formatCurrency(r.spent)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-sm text-on-surface-variant">Limite</p>
                      <p className="font-amount-md text-amount-md text-on-surface-variant">{formatCurrency(r.limit)}</p>
                    </div>
                  </div>
                  <div>
                    <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, r.percent)}%`, backgroundColor: BAR_COLOR[r.color] }}
                      />
                    </div>
                    {over ? (
                      <div className="flex justify-between text-[11px] font-semibold text-error">
                        <span>{r.percent}% - Dépassement !</span>
                        <span>{formatCurrency(r.remaining)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant">
                        <span>{r.percent}% utilisé</span>
                        <span style={{ color: BAR_COLOR[r.color] }}>{formatCurrency(r.remaining)} restant</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </section>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier le budget' : 'Nouveau budget'}>
        <BudgetForm
          initial={editing}
          existingCategories={monthBudgets.map((b) => b.category)}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          month={cursor.month}
          year={cursor.year}
        />
      </Modal>
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le budget"
        message="Êtes-vous sûr de vouloir supprimer ce budget ?"
      />
    </>
  )
}
