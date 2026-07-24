import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { CATEGORIES, getCategory } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import { totalAmount, totalByCategory, filterByMonth, spentForBudget, budgetStatusColor } from '../utils/calculations'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ExpenseForm from '../components/ExpenseForm'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton'

const PAGE_SIZE = 10

export default function ExpensesPage() {
  const { expenses, budgets, addExpense, updateExpense, deleteExpense, loading } = useApp()
  const { showToast } = useToast()

  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES.map((c) => c.code))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxAmount, setMaxAmount] = useState(2000)
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const toggleCategory = (code) => {
    setSelectedCategories((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
    setPage(1)
  }

  const resetFilters = () => {
    setSelectedCategories(CATEGORIES.map((c) => c.code))
    setStartDate('')
    setEndDate('')
    setMaxAmount(2000)
    setPage(1)
  }

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => selectedCategories.includes(e.category))
      .filter((e) => !startDate || e.date.slice(0, 10) >= startDate)
      .filter((e) => !endDate || e.date.slice(0, 10) <= endDate)
      .filter((e) => Number(e.amount) <= Number(maxAmount))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, selectedCategories, startDate, endDate, maxAmount])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const now = new Date()
  const monthExpenses = filterByMonth(expenses, now.getMonth() + 1, now.getFullYear())
  const monthSpent = totalAmount(monthExpenses)
  const monthBudgetLimit = budgets
    .filter((b) => b.month === now.getMonth() + 1 && b.year === now.getFullYear())
    .reduce((s, b) => s + Number(b.limit), 0)
  const monthBudgetPercent = monthBudgetLimit > 0 ? Math.round((monthSpent / monthBudgetLimit) * 100) : 0

  // Insight 1: category with the biggest spending drop vs last month
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthExpenses = filterByMonth(expenses, prevMonthDate.getMonth() + 1, prevMonthDate.getFullYear())
  const byCategoryNow = totalByCategory(monthExpenses)
  const byCategoryPrev = totalByCategory(prevMonthExpenses)
  let bestDrop = null
  for (const code of Object.keys(byCategoryPrev)) {
    const prev = byCategoryPrev[code]
    const cur = byCategoryNow[code] || 0
    if (prev > 0 && cur < prev) {
      const pct = Math.round(((prev - cur) / prev) * 100)
      if (!bestDrop || pct > bestDrop.pct) bestDrop = { code, pct }
    }
  }

  // Insight 2: budget closest to (or over) its limit
  const monthBudgets = budgets.filter((b) => b.month === now.getMonth() + 1 && b.year === now.getFullYear())
  let riskiestBudget = null
  for (const b of monthBudgets) {
    const spent = spentForBudget(expenses, b)
    const pct = b.limit > 0 ? (spent / b.limit) * 100 : 0
    if (pct >= 80 && (!riskiestBudget || pct > riskiestBudget.pct)) {
      riskiestBudget = { category: b.category, pct: Math.round(pct) }
    }
  }

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (expense) => {
    setEditing(expense)
    setFormOpen(true)
  }
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateExpense(editing.id, data)
        showToast('Dépense modifiée')
      } else {
        await addExpense(data)
        showToast('Dépense ajoutée avec succès')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteExpense(toDelete.id)
      showToast('Dépense supprimée')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          <div className="lg:col-span-3 space-y-stack-lg">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="lg:col-span-9">
            <SkeletonTable rows={6} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-stack-lg">
      {/* Page Header */}
      <div className="flex justify-between items-end flex-wrap gap-gutter">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Mes Dépenses</h2>
          <p className="text-on-surface-variant font-body-md">Gérez et analysez vos sorties d'argent en toute simplicité.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline-md flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Nouvelle dépense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Filter Panel */}
        <aside className="lg:col-span-3 space-y-stack-lg">
          <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-primary">filter_list</span>
              <h3 className="font-headline-md text-on-surface">Filtres</h3>
            </div>
            <div className="space-y-3">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Période</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setPage(1)
                  }}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary/20 text-body-md p-2"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setPage(1)
                  }}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary/20 text-body-md p-2"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Catégories</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {CATEGORIES.map((c) => (
                  <label key={c.code} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.code)}
                      onChange={() => toggleCategory(c.code)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Montant max.</label>
                <span className="font-amount-md text-primary">{maxAmount}€</span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxAmount}
                onChange={(e) => {
                  setMaxAmount(e.target.value)
                  setPage(1)
                }}
                className="w-full accent-primary"
              />
            </div>
            <button
              onClick={resetFilters}
              className="w-full py-2.5 rounded-lg border border-primary text-primary font-headline-md hover:bg-primary-fixed/30 transition-all"
            >
              Réinitialiser
            </button>
          </section>

          {/* Quick Stats Card */}
          <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-on-primary/80 font-label-sm mb-1">Dépensé ce mois</p>
              <h4 className="font-amount-lg text-amount-lg">{formatCurrency(monthSpent)}</h4>
              {monthBudgetLimit > 0 && (
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${Math.min(100, monthBudgetPercent)}%` }} />
                  </div>
                  <span className="text-label-sm">{monthBudgetPercent}%</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Expenses Table */}
        <div className="lg:col-span-9 space-y-stack-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            {pageItems.length === 0 ? (
              <EmptyState
                icon="search_off"
                title="Aucun résultat"
                message="Aucune dépense ne correspond aux filtres actuels."
                action={
                  <button onClick={resetFilters} className="px-4 py-2 rounded-lg border border-primary text-primary font-bold text-body-md hover:bg-primary/5 transition-colors">
                    Réinitialiser les filtres
                  </button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Catégorie</th>
                      <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {pageItems.map((exp) => {
                      const cat = getCategory(exp.category)
                      return (
                        <tr key={exp.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4 text-on-surface font-body-md whitespace-nowrap">
                            {new Date(exp.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-3 py-1 rounded-full font-label-sm inline-flex items-center gap-1.5"
                              style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
                            >
                              <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                              {cat.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant font-body-md">{exp.description || '—'}</td>
                          <td className="px-6 py-4 text-right font-amount-md text-on-surface">{formatCurrency(exp.amount)}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => openEdit(exp)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                onClick={() => setToDelete(exp)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-all"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-6 py-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
              <span className="text-on-surface-variant font-label-sm">
                Affichage de {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} sur {filtered.length} transactions
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-label-sm text-on-surface-variant px-2">
                  Page {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Analytics Hint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">savings</span>
              </div>
              <div>
                <h5 className="font-headline-md text-on-surface">Opportunité d'épargne</h5>
                <p className="text-body-md text-on-surface-variant">
                  {bestDrop
                    ? `Vous avez dépensé ${bestDrop.pct}% de moins en ${getCategory(bestDrop.code).label.toLowerCase()} ce mois-ci.`
                    : 'Continuez à enregistrer vos dépenses pour débloquer des insights personnalisés.'}
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex items-center gap-4 group">
              <div className="h-12 w-12 rounded-full bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div>
                <h5 className="font-headline-md text-on-surface">Alerte budget</h5>
                <p className="text-body-md text-on-surface-variant">
                  {riskiestBudget
                    ? `Le budget "${getCategory(riskiestBudget.category).label}" atteint ${riskiestBudget.pct}% de sa limite.`
                    : 'Tous vos budgets sont sous contrôle ce mois-ci.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier la dépense' : 'Nouvelle dépense'}>
        <ExpenseForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible."
      />
    </div>
  )
}
