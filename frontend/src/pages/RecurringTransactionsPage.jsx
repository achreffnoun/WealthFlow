import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { getCategory, getIncomeSource, getRecurringFrequency } from '../utils/constants'
import { formatCurrency, formatDate } from '../utils/formatters'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import RecurringTransactionForm from '../components/RecurringTransactionForm'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonTable } from '../components/ui/Skeleton'

export default function RecurringTransactionsPage() {
  const { recurringTransactions, addRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction, loading } = useApp()
  const { showToast } = useToast()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (recurring) => {
    setEditing(recurring)
    setFormOpen(true)
  }
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateRecurringTransaction(editing.id, data)
        showToast('Transaction récurrente modifiée')
      } else {
        await addRecurringTransaction(data)
        showToast('Transaction récurrente créée')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteRecurringTransaction(toDelete.id)
      showToast('Transaction récurrente supprimée')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleToggleActive = async (recurring) => {
    try {
      await updateRecurringTransaction(recurring.id, { active: !recurring.active })
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="space-y-stack-lg">
        <SkeletonTable rows={6} />
      </div>
    )
  }

  return (
    <div className="space-y-stack-lg">
      <div className="flex justify-between items-end flex-wrap gap-gutter">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Transactions récurrentes</h2>
          <p className="text-on-surface-variant font-body-md">Abonnements, salaire, loyer — générés automatiquement chaque période.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-3 bg-primary text-on-primary rounded-lg font-headline-md flex items-center gap-2 shadow-sm hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Nouvelle récurrence</span>
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {recurringTransactions.length === 0 ? (
          <EmptyState
            icon="event_repeat"
            title="Aucune transaction récurrente"
            message="Ajoutez votre loyer, salaire ou abonnement pour qu'ils soient générés automatiquement."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Catégorie/Source</th>
                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Fréquence</th>
                  <th className="px-6 py-4 text-left font-label-sm text-on-surface-variant uppercase tracking-wider">Prochaine échéance</th>
                  <th className="px-6 py-4 text-right font-label-sm text-on-surface-variant uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-center font-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recurringTransactions.map((rt) => {
                  const meta = rt.type === 'INCOME' ? getIncomeSource(rt.categoryOrSource) : getCategory(rt.categoryOrSource)
                  const freq = getRecurringFrequency(rt.frequency)
                  return (
                    <tr key={rt.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full font-label-sm inline-flex items-center gap-1.5"
                          style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                        >
                          <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-on-surface font-body-md">{freq.label}</td>
                      <td className="px-6 py-4 text-on-surface font-body-md whitespace-nowrap">{formatDate(rt.nextRunDate)}</td>
                      <td className={`px-6 py-4 text-right font-amount-md ${rt.type === 'INCOME' ? 'text-secondary' : 'text-on-surface'}`}>
                        {rt.type === 'INCOME' ? '+ ' : '- '}
                        {formatCurrency(rt.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(rt)}
                          className={`px-3 py-1 rounded-full font-label-sm transition-colors ${
                            rt.active ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/20 text-on-surface-variant'
                          }`}
                        >
                          {rt.active ? 'Actif' : 'Pausé'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => openEdit(rt)}
                            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => setToDelete(rt)}
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
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Modifier la récurrence' : 'Nouvelle transaction récurrente'}
      >
        <RecurringTransactionForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la récurrence"
        message="Êtes-vous sûr de vouloir supprimer cette transaction récurrente ? Cette action est irréversible."
      />
    </div>
  )
}
