import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { INCOME_SOURCES, getIncomeSource } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import { totalAmount, filterByMonth, netBalance } from '../utils/calculations'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import IncomeForm from '../components/IncomeForm'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonTable, SkeletonCard } from '../components/ui/Skeleton'

const PAGE_SIZE = 10

export default function IncomesPage() {
  const { incomes, expenses, addIncome, updateIncome, deleteIncome, loading } = useApp()
  const { showToast } = useToast()

  const [selectedSources, setSelectedSources] = useState(INCOME_SOURCES.map((s) => s.code))
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const toggleSource = (code) => {
    setSelectedSources((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
    setPage(1)
  }

  const resetFilters = () => {
    setSelectedSources(INCOME_SOURCES.map((s) => s.code))
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const filtered = useMemo(() => {
    return incomes
      .filter((i) => selectedSources.includes(i.source))
      .filter((i) => !startDate || i.date.slice(0, 10) >= startDate)
      .filter((i) => !endDate || i.date.slice(0, 10) <= endDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [incomes, selectedSources, startDate, endDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const now = new Date()
  const monthIncomes = filterByMonth(incomes, now.getMonth() + 1, now.getFullYear())
  const monthEarned = totalAmount(monthIncomes)
  const monthBalance = netBalance(incomes, expenses, now.getMonth() + 1, now.getFullYear())

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (income) => {
    setEditing(income)
    setFormOpen(true)
  }
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateIncome(editing.id, data)
        showToast('Revenu modifié')
      } else {
        await addIncome(data)
        showToast('Revenu ajouté avec succès')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteIncome(toDelete.id)
      showToast('Revenu supprimé')
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
          <h2 className="font-headline-lg text-headline-lg text-on-background">Mes Revenus</h2>
          <p className="text-on-surface-variant font-body-md">Suivez vos entrées d'argent : salaire, primes et plus.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline-md flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Nouveau revenu</span>
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
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider">Sources</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {INCOME_SOURCES.map((s) => (
                  <label key={s.code} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(s.code)}
                      onChange={() => toggleSource(s.code)}
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="text-body-md text-on-surface group-hover:text-primary transition-colors">{s.label}</span>
                  </label>
                ))}
              </div>
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
            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-on-primary/80 font-label-sm mb-1">Gagné ce mois</p>
                <h4 className="font-amount-lg text-amount-lg">{formatCurrency(monthEarned)}</h4>
              </div>
              <div className="pt-3 border-t border-white/20">
                <p className="text-on-primary/80 font-label-sm mb-1">Solde du mois</p>
                <h4 className="font-amount-md text-amount-md">{formatCurrency(monthBalance)}</h4>
              </div>
            </div>
          </div>
        </aside>

        {/* Incomes Table */}
        <div className="lg:col-span-9 space-y-stack-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            {pageItems.length === 0 ? (
              <EmptyState
                icon="search_off"
                title="Aucun résultat"
                message="Aucun revenu ne correspond aux filtres actuels."
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
                      <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Source</th>
                      <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {pageItems.map((inc) => {
                      const src = getIncomeSource(inc.source)
                      return (
                        <tr key={inc.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-6 py-4 text-on-surface font-body-md whitespace-nowrap">
                            {new Date(inc.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="px-3 py-1 rounded-full font-label-sm inline-flex items-center gap-1.5"
                              style={{ backgroundColor: `${src.color}1a`, color: src.color }}
                            >
                              <span className="material-symbols-outlined text-[16px]">{src.icon}</span>
                              {src.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-on-surface-variant font-body-md">{inc.description || '—'}</td>
                          <td className="px-6 py-4 text-right font-amount-md text-secondary">+ {formatCurrency(inc.amount)}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => openEdit(inc)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                onClick={() => setToDelete(inc)}
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
        </div>
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Modifier le revenu' : 'Nouveau revenu'}>
        <IncomeForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le revenu"
        message="Êtes-vous sûr de vouloir supprimer ce revenu ? Cette action est irréversible."
      />
    </div>
  )
}
