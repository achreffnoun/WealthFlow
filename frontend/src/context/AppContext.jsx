import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { expenseService } from '../services/expenseService'
import { budgetService } from '../services/budgetService'
import { goalService } from '../services/goalService'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setExpenses([])
      setBudgets([])
      setGoals([])
      setLoading(false)
      return
    }
    setLoading(true)
    const [expensesRes, budgetsRes, goalsRes] = await Promise.all([
      expenseService.list(),
      budgetService.list(),
      goalService.list(),
    ])
    setExpenses(expensesRes.items)
    setBudgets(budgetsRes.items)
    setGoals(goalsRes.items)
    setLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addExpense = async (expense) => {
    const created = await expenseService.create(expense)
    setExpenses((prev) => [created, ...prev])
  }
  const updateExpense = async (id, patch) => {
    const updated = await expenseService.update(id, patch)
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }
  const deleteExpense = async (id) => {
    await expenseService.remove(id)
    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  const addBudget = async (budget) => {
    const created = await budgetService.create(budget)
    setBudgets((prev) => [created, ...prev])
  }
  const updateBudget = async (id, patch) => {
    const updated = await budgetService.update(id, patch)
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }
  const deleteBudget = async (id) => {
    await budgetService.remove(id)
    setBudgets((prev) => prev.filter((b) => b.id !== id))
  }

  const addGoal = async (goal) => {
    const created = await goalService.create(goal)
    setGoals((prev) => [created, ...prev])
  }
  const updateGoal = async (id, patch) => {
    const updated = await goalService.update(id, patch)
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
  }
  const addToGoal = async (id, amount) => {
    const updated = await goalService.addSavings(id, amount)
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
  }
  const deleteGoal = async (id) => {
    await goalService.remove(id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const value = useMemo(
    () => ({
      expenses,
      budgets,
      goals,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      addToGoal,
      deleteGoal,
    }),
    [expenses, budgets, goals, loading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
