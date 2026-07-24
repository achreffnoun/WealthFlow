import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { GOAL_STATUS } from '../utils/constants'
import { formatCurrency, toInputDate } from '../utils/formatters'
import { daysRemaining, monthlyAmountNeeded, budgetStatusColor } from '../utils/calculations'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import ProgressBar from '../components/ui/ProgressBar'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'

const TABS = [
  { key: 'all', label: 'Tous' },
  { key: GOAL_STATUS.ACTIVE, label: 'Actifs' },
  { key: GOAL_STATUS.COMPLETED, label: 'Complétés' },
]

function GoalForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [targetAmount, setTargetAmount] = useState(initial?.targetAmount ?? '')
  const [savedAmount, setSavedAmount] = useState(initial?.savedAmount ?? 0)
  const [deadline, setDeadline] = useState(initial?.deadline ? toInputDate(initial.deadline) : '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const target = Number(targetAmount)
    const saved = Number(savedAmount)
    if (!name.trim()) return setError('Le nom est requis')
    if (!target || target <= 0) return setError('Le montant cible doit être positif')
    if (saved < 0) return setError("Le montant épargné ne peut pas être négatif")
    if (saved > target) return setError('Le montant épargné ne peut pas dépasser la cible')
    setSubmitting(true)
    try {
      await onSubmit({ name, description, targetAmount: target, savedAmount: saved, deadline: deadline || null })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Nom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Vacances d'été"
          autoFocus
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
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Cible</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3 font-amount-md"
          />
        </div>
        <div>
          <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Épargné</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3 font-amount-md"
          />
        </div>
      </div>
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
          Deadline <span className="normal-case font-normal opacity-60">(optionnel)</span>
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-lg border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-body-md p-3"
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

function AddSavingsForm({ onSubmit, onCancel }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return setError('Le montant doit être positif')
    setSubmitting(true)
    try {
      await onSubmit(value)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Montant à ajouter</label>
        <input
          type="number"
          step="0.01"
          min="0"
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="100.00 €"
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
          {submitting ? 'Confirmation...' : 'Confirmer'}
        </button>
      </div>
    </form>
  )
}

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, addToGoal, deleteGoal, loading } = useApp()
  const { showToast } = useToast()

  const [tab, setTab] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [savingsGoal, setSavingsGoal] = useState(null)

  const filtered = useMemo(() => (tab === 'all' ? goals : goals.filter((g) => g.status === tab)), [goals, tab])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (goal) => {
    setEditing(goal)
    setFormOpen(true)
  }
  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateGoal(editing.id, data)
        showToast('Objectif modifié')
      } else {
        await addGoal(data)
        showToast('Objectif créé')
      }
      setFormOpen(false)
      setEditing(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleDelete = async () => {
    try {
      await deleteGoal(toDelete.id)
      showToast('Objectif supprimé')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
  const handleAddSavings = async (amount) => {
    try {
      await addToGoal(savingsGoal.id, amount)
      const newTotal = Number(savingsGoal.savedAmount) + amount
      showToast(newTotal >= Number(savingsGoal.targetAmount) ? 'Objectif atteint ! 🎉' : 'Épargne ajoutée')
      setSavingsGoal(null)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} className="h-64" />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Page Hero / Tabs Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-stack-lg">
        <div className="space-y-2">
          <h1 className="font-headline-lg text-headline-lg">Vos Objectifs d'Épargne</h1>
          <p className="text-on-surface-variant font-body-md">Suivez vos progrès et atteignez vos rêves financiers.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Nouvel Objectif</span>
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex gap-2 mb-stack-lg overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-colors shrink-0 ${
              tab === t.key ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="flag"
          title="Aucun objectif"
          message="Aucun objectif ici pour le moment. Créez-en un pour commencer à épargner."
          action={
            <button onClick={openAdd} className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Nouvel Objectif
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-lg">
          {filtered.map((goal) => {
            const percent = Math.round((Number(goal.savedAmount) / Number(goal.targetAmount)) * 100)
            const isCompleted = goal.status === GOAL_STATUS.COMPLETED
            const remaining = daysRemaining(goal.deadline)
            const perMonth = monthlyAmountNeeded(goal)

            if (isCompleted) {
              return (
                <div
                  key={goal.id}
                  className="bg-secondary-container p-stack-lg rounded-xl shadow-md border border-secondary/20 relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-on-secondary-container/5 rounded-full -mr-16 -mt-16" />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-on-secondary-container text-on-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined">celebration</span>
                    </div>
                    <span className="px-3 py-1 bg-on-secondary-container text-on-secondary text-label-sm rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Objectif atteint
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-1 text-on-secondary-container">{goal.name}</h3>
                  {goal.description && <p className="text-on-secondary-container/80 text-sm mb-6">{goal.description}</p>}
                  <div className="mt-auto space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-on-secondary-container/60 text-xs uppercase tracking-wider font-bold">Épargné</span>
                        <span className="font-amount-lg text-amount-lg text-on-secondary-container">{formatCurrency(goal.savedAmount)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-on-secondary-container/60 text-xs uppercase tracking-wider font-bold">Objectif</span>
                        <span className="font-amount-md text-amount-md block text-on-secondary-container">{formatCurrency(goal.targetAmount)}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-on-secondary-container/10 rounded-full overflow-hidden">
                      <div className="h-full bg-on-secondary-container" style={{ width: '100%' }} />
                    </div>
                    <button
                      onClick={() => setToDelete(goal)}
                      className="w-full py-2.5 bg-on-secondary-container text-on-secondary font-bold rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Supprimer
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={goal.id} className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-sm border border-outline-variant/30 hover:-translate-y-1 transition-transform flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                    <span className="material-symbols-outlined">ads_click</span>
                  </div>
                  {goal.deadline ? (
                    <span className="px-3 py-1 bg-error-container text-error text-label-sm rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">alarm</span>
                      {remaining} jours restants
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant text-label-sm rounded-full">Sans échéance</span>
                  )}
                </div>
                <h3 className="font-headline-md text-headline-md mb-1">{goal.name}</h3>
                {goal.description && <p className="text-on-surface-variant text-sm mb-6">{goal.description}</p>}
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Épargné</span>
                      <span className="font-amount-lg text-amount-lg text-primary">{formatCurrency(goal.savedAmount)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-on-surface-variant text-xs uppercase tracking-wider font-bold">Objectif</span>
                      <span className="font-amount-md text-amount-md block">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                  <ProgressBar percent={percent} color={budgetStatusColor(percent)} trackClassName="bg-surface-container" />
                  {perMonth !== null && (
                    <p className="text-[11px] text-on-surface-variant">À épargner/mois : {formatCurrency(perMonth)}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSavingsGoal(goal)}
                      className="flex-1 py-2.5 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Épargne
                    </button>
                    <button
                      onClick={() => openEdit(goal)}
                      className="px-3 py-2.5 bg-surface-variant/50 text-on-surface-variant rounded-lg hover:bg-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => setToDelete(goal)}
                      className="px-3 py-2.5 bg-surface-variant/50 text-on-surface-variant rounded-lg hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dashboard Visual Tip Section */}
      <section className="mt-12 bg-primary-container p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 text-on-primary-container">
        <div className="flex-1 space-y-4">
          <h2 className="font-headline-lg text-headline-lg">Boostez votre épargne</h2>
          <p className="font-body-lg text-body-lg opacity-90">
            Les utilisateurs qui mettent en place des virements automatiques atteignent leurs objectifs 3x plus vite.
          </p>
          <button
            onClick={() => showToast('Fonctionnalité bientôt disponible', 'warning')}
            className="px-8 py-3 bg-on-primary-container text-primary-container rounded-full font-bold shadow-xl hover:scale-105 transition-transform active:scale-95"
          >
            Activer l'auto-épargne
          </button>
        </div>
        <div className="relative w-full md:w-64 h-48 rounded-xl overflow-hidden shadow-2xl">
          <img
            className="w-full h-full object-cover"
            alt="Clarté financière"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxioZ-fAeN05dGn-DXHu-vKv3cNxhX-RwxuWuuJTbJUq4Xk0oErHtEaZJ7oDxdv_Pck8KTf1jHiwgC-hTjfKXu2bSpmWOK3kjj0Q6_50gromvG3NaBfj7ZSQwLe5MqA_l89i8P_cfyBMZ1WFbNV36hez0FGt-iETmAZVhhoQdreRwDIKGKOyl97MUfcEEffHJrqmaX-5X2L8Xsj5dsn3TVXEMmeTLYF5l7fA5T_mFCWobElyEUBg44i5m_eQUMHaZW_JzlJz-zpmU"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container/40 to-transparent" />
        </div>
      </section>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Modifier l'objectif" : 'Nouvel objectif'}>
        <GoalForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>
      <Modal open={!!savingsGoal} onClose={() => setSavingsGoal(null)} title="Ajouter de l'épargne">
        {savingsGoal && <AddSavingsForm onSubmit={handleAddSavings} onCancel={() => setSavingsGoal(null)} />}
      </Modal>
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'objectif"
        message="Êtes-vous sûr de vouloir supprimer cet objectif ?"
      />
    </>
  )
}
