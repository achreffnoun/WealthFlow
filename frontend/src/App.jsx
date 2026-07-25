import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import ExpensesPage from './pages/ExpensesPage'
import IncomesPage from './pages/IncomesPage'
import BudgetsPage from './pages/BudgetsPage'
import GoalsPage from './pages/GoalsPage'
import AnalyticsPage from './pages/AnalyticsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/depenses" element={<ExpensesPage />} />
          <Route path="/revenus" element={<IncomesPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/objectifs" element={<GoalsPage />} />
          <Route path="/analyses" element={<AnalyticsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
