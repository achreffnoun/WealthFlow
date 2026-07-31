import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { expenseService } from '../services/expenseService'
import { incomeService } from '../services/incomeService'
import { budgetService } from '../services/budgetService'
import { goalService } from '../services/goalService'
import { recurringService } from '../services/recurringService'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [incomes, setIncomes] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [recurringTransactions, setRecurringTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setExpenses([])
      setIncomes([])
      setBudgets([])
      setGoals([])
      setRecurringTransactions([])
      setLoading(false)
      return
    }
    setLoading(true)
    const [expensesRes, incomesRes, budgetsRes, goalsRes, recurringRes] = await Promise.all([
      expenseService.list(),
      incomeService.list(),
      budgetService.list(),
      goalService.list(),
      recurringService.list(),
    ])
    setExpenses(expensesRes.items)
    setIncomes(incomesRes.items)
    setBudgets(budgetsRes.items)
    setGoals(goalsRes.items)
    setRecurringTransactions(recurringRes.items)
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

  const addIncome = async (income) => {
    const created = await incomeService.create(income)
    setIncomes((prev) => [created, ...prev])
  }
  const updateIncome = async (id, patch) => {
    const updated = await incomeService.update(id, patch)
    setIncomes((prev) => prev.map((i) => (i.id === id ? updated : i)))
  }
  const deleteIncome = async (id) => {
    await incomeService.remove(id)
    setIncomes((prev) => prev.filter((i) => i.id !== id))
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

  const addRecurringTransaction = async (recurring) => {
    const created = await recurringService.create(recurring)
    setRecurringTransactions((prev) => [created, ...prev])
  }
  const updateRecurringTransaction = async (id, patch) => {
    const updated = await recurringService.update(id, patch)
    setRecurringTransactions((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }
  const deleteRecurringTransaction = async (id) => {
    await recurringService.remove(id)
    setRecurringTransactions((prev) => prev.filter((r) => r.id !== id))
  }

  const value = useMemo(
    () => ({
      expenses,
      incomes,
      budgets,
      goals,
      recurringTransactions,
      loading,
      addExpense,
      updateExpense,
      deleteExpense,
      addIncome,
      updateIncome,
      deleteIncome,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      addToGoal,
      deleteGoal,
      addRecurringTransaction,
      updateRecurringTransaction,
      deleteRecurringTransaction,
    }),
    [expenses, incomes, budgets, goals, recurringTransactions, loading],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
