import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import Modal from '../ui/Modal'
import ExpenseForm from '../ExpenseForm'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'

export default function Layout() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const { addExpense } = useApp()
  const { showToast } = useToast()

  const handleQuickAdd = async (expense) => {
    try {
      await addExpense(expense)
      setQuickAddOpen(false)
      showToast('Dépense ajoutée avec succès')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onQuickAdd={() => setQuickAddOpen(true)} />
      <TopBar />
      <main className="pt-16 pb-24 md:pb-8 md:pl-64 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-gutter py-stack-lg">
          <Outlet />
        </div>
      </main>
      <BottomNav />
      <Modal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} title="Nouvelle dépense">
        <ExpenseForm onSubmit={handleQuickAdd} onCancel={() => setQuickAddOpen(false)} />
      </Modal>
    </div>
  )
}
