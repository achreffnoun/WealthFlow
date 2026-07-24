import { daysBetween } from './formatters'

export function isSameMonth(date, month, year) {
  const d = new Date(date)
  return d.getMonth() + 1 === month && d.getFullYear() === year
}

export function filterByMonth(expenses, month, year) {
  return expenses.filter((e) => isSameMonth(e.date, month, year))
}

export function totalAmount(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

export function totalByCategory(expenses) {
  const map = {}
  for (const e of expenses) {
    map[e.category] = (map[e.category] || 0) + Number(e.amount)
  }
  return map
}

export function spentForBudget(expenses, budget) {
  return totalAmount(
    expenses.filter((e) => e.category === budget.category && isSameMonth(e.date, budget.month, budget.year)),
  )
}

export function budgetStatusColor(percent) {
  if (percent <= 70) return 'mint'
  if (percent <= 90) return 'amber'
  return 'red'
}

export function averagePerDay(expenses, daysElapsed) {
  const total = totalAmount(expenses)
  return daysElapsed > 0 ? total / daysElapsed : 0
}

export function daysRemaining(deadline) {
  if (!deadline) return null
  return Math.max(0, daysBetween(new Date(), deadline))
}

export function monthlyAmountNeeded(goal) {
  if (!goal.deadline) return null
  const remaining = Number(goal.targetAmount) - Number(goal.savedAmount)
  const days = daysRemaining(goal.deadline)
  if (days === null || days <= 0) return remaining > 0 ? remaining : 0
  const months = Math.max(1, Math.ceil(days / 30))
  return remaining > 0 ? remaining / months : 0
}

export function last30DaysSeries(expenses) {
  const days = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push(d)
  }
  return days.map((d) => {
    const dayTotal = totalAmount(
      expenses.filter((e) => {
        const ed = new Date(e.date)
        return ed.toDateString() === d.toDateString()
      }),
    )
    return { date: d, total: dayTotal }
  })
}

export function monthlyTotalsSeries(expenses, monthsBack = 6) {
  const today = new Date()
  const result = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    result.push({
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
      month,
      year,
      total: totalAmount(filterByMonth(expenses, month, year)),
    })
  }
  return result
}
