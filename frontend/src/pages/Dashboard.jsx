import { Link } from 'react-router-dom'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, PieChart, Pie, Cell } from 'recharts'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { getCategory, GOAL_STATUS } from '../utils/constants'
import { formatCurrency, formatDateLong } from '../utils/formatters'
import {
  filterByMonth,
  totalAmount,
  totalByCategory,
  averagePerDay,
  last30DaysSeries,
  budgetStatusColor,
} from '../utils/calculations'
import ProgressBar from '../components/ui/ProgressBar'
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function Dashboard() {
  const { expenses, budgets, goals, loading } = useApp()
  const { user } = useAuth()

  const now = new Date()
  const monthExpenses = filterByMonth(expenses, now.getMonth() + 1, now.getFullYear())
  const totalMonth = totalAmount(monthExpenses)

  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthExpenses = filterByMonth(expenses, prevMonthDate.getMonth() + 1, prevMonthDate.getFullYear())
  const totalPrevMonth = totalAmount(prevMonthExpenses)
  const monthDelta = totalPrevMonth > 0 ? Math.round(((totalMonth - totalPrevMonth) / totalPrevMonth) * 100) : null

  const totalBudgetLimit = budgets
    .filter((b) => b.month === now.getMonth() + 1 && b.year === now.getFullYear())
    .reduce((s, b) => s + Number(b.limit), 0)
  const budgetUsedPercent = totalBudgetLimit > 0 ? Math.round((totalMonth / totalBudgetLimit) * 100) : 0
  const avgDay = averagePerDay(monthExpenses, now.getDate())
  const activeGoals = goals.filter((g) => g.status === GOAL_STATUS.ACTIVE)

  const trendSeries = last30DaysSeries(expenses).map((d) => ({
    label: d.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    total: Number(d.total.toFixed(2)),
  }))

  const byCategory = totalByCategory(monthExpenses)
  const pieData = Object.entries(byCategory)
    .map(([code, value]) => ({ code, value, ...getCategory(code) }))
    .sort((a, b) => b.value - a.value)

  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  if (loading) {
    return (
      <>
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-stack-lg">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Bonjour, {user?.firstName || 'vous'}
            </h2>
            <p className="font-body-md text-on-surface-variant">{formatDateLong(now)}</p>
          </div>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          <div className="lg:col-span-8">
            <SkeletonTable rows={4} />
          </div>
          <div className="lg:col-span-4">
            <SkeletonCard className="h-full" />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* SECTION 1: GREETING */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-stack-lg">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Bonjour, {user?.firstName || 'vous'}
          </h2>
          <p className="font-body-md text-on-surface-variant">{formatDateLong(now)}</p>
        </div>
      </section>

      {/* SECTION 2: KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="tonal-card hover-lift flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Mois</span>
          <div className="font-amount-lg text-amount-lg text-on-background">{formatCurrency(totalMonth)}</div>
          {monthDelta !== null && (
            <div className={`mt-4 flex items-center gap-1 text-label-sm ${monthDelta <= 0 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[16px]">
                {monthDelta <= 0 ? 'arrow_drop_down' : 'arrow_drop_up'}
              </span>
              <span>{Math.abs(monthDelta)}% vs mois dernier</span>
            </div>
          )}
        </div>
        <div className="tonal-card hover-lift flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Budget Utilisé</span>
          <div className="font-amount-lg text-amount-lg text-on-background">{budgetUsedPercent}%</div>
          <div className="mt-4 w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full"
              style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
            />
          </div>
        </div>
        <div className="tonal-card hover-lift flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Moyenne/Jour</span>
          <div className="font-amount-lg text-amount-lg text-on-background">{formatCurrency(avgDay)}</div>
          <div className="mt-4 text-on-surface-variant text-label-sm">Basé sur {now.getDate()} jours</div>
        </div>
        <div className="tonal-card hover-lift flex flex-col justify-between">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Objectifs</span>
          <div className="font-amount-lg text-amount-lg text-on-background">{activeGoals.length} Actifs</div>
          <div className="mt-4 flex items-center gap-1 text-primary text-label-sm">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>En bonne voie</span>
          </div>
        </div>
      </section>

      {/* ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Spending Trend (Large) */}
        <div className="lg:col-span-8 tonal-card overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md">Évolution des dépenses</h3>
            <span className="text-label-sm text-on-surface-variant">Derniers 30 jours</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendSeries} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0058be" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0058be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#727785' }} interval={6} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="total" stroke="#0058be" strokeWidth={3} fill="url(#trendGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Overview Donut (Medium) */}
        <div className="lg:col-span-4 tonal-card flex flex-col items-center">
          <div className="w-full mb-6">
            <h3 className="font-headline-md text-headline-md">Par Catégorie</h3>
          </div>
          {pieData.length === 0 ? (
            <EmptyState icon="donut_small" title="Aucune dépense" message="Ajoutez une dépense pour voir la répartition par catégorie." />
          ) : (
            <>
              <div className="relative w-48 h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="label" innerRadius={62} outerRadius={80} paddingAngle={2}>
                      {pieData.map((entry) => (
                        <Cell key={entry.code} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-amount-md text-on-surface-variant">Total</span>
                  <span className="font-amount-lg text-amount-lg text-on-background">{formatCurrency(totalMonth)}</span>
                </div>
              </div>
              <ul className="w-full space-y-3">
                {pieData.slice(0, 3).map((cat) => (
                  <li key={cat.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-body-md">{cat.label}</span>
                    </div>
                    <span className="font-amount-md">{Math.round((cat.value / totalMonth) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Recent Expenses Table */}
        <div className="lg:col-span-8 tonal-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline-md text-headline-md">Dépenses récentes</h3>
            <Link to="/depenses" className="text-primary font-bold text-body-md hover:underline">
              Voir tout
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState icon="receipt_long" title="Aucune dépense" message="Vos dépenses récentes apparaîtront ici." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-on-surface-variant border-b border-outline-variant">
                    <th className="pb-4 font-label-sm font-bold uppercase">Catégorie</th>
                    <th className="pb-4 font-label-sm font-bold uppercase">Description</th>
                    <th className="pb-4 font-label-sm font-bold uppercase">Date</th>
                    <th className="pb-4 font-label-sm font-bold uppercase text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recent.map((exp) => {
                    const cat = getCategory(exp.category)
                    return (
                      <tr key={exp.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
                            >
                              <span className="material-symbols-outlined">{cat.icon}</span>
                            </div>
                            <span className="block font-bold text-body-md">{cat.label}</span>
                          </div>
                        </td>
                        <td className="py-4 text-body-md text-on-surface">{exp.description || '—'}</td>
                        <td className="py-4 text-body-md text-on-surface-variant">
                          {new Date(exp.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-4 text-right font-amount-md text-on-background">- {formatCurrency(exp.amount)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Savings Goals + Atmospheric Card */}
        <div className="lg:col-span-4 space-y-stack-lg">
          <div className="tonal-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-headline-md">Objectifs d'épargne</h3>
              <Link to="/objectifs" className="p-1 hover:bg-surface-container-low rounded-full">
                <span className="material-symbols-outlined">add</span>
              </Link>
            </div>
            {activeGoals.length === 0 ? (
              <EmptyState icon="ads_click" title="Aucun objectif actif" message="Créez un objectif pour suivre votre épargne." />
            ) : (
              <div className="space-y-6">
                {activeGoals.slice(0, 2).map((goal) => {
                  const percent = Math.round((Number(goal.savedAmount) / Number(goal.targetAmount)) * 100)
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="font-bold text-body-md">{goal.name}</p>
                          <p className="text-label-sm text-on-surface-variant">Objectif: {formatCurrency(goal.targetAmount)}</p>
                        </div>
                        <span className="font-amount-md text-primary">{formatCurrency(goal.savedAmount)}</span>
                      </div>
                      <ProgressBar percent={percent} color={budgetStatusColor(percent)} trackClassName="bg-surface-container" />
                      <p className="text-[10px] text-on-surface-variant text-right">{percent}% atteint</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {/* Atmospheric Card */}
          <div className="relative rounded-xl overflow-hidden h-40 group">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Optimisez vos rendements"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9QN9x6DV1ShvLP0hQIoafBomu8VOwNXWPKybL4E4GxxaGFSvnXuUHHAzy0Q6ujKUQGjYQ8DtqPGlBN20goD5_UpMNKCddQser95oijAcUlbzwijYguayXt2ksriHi19pndSeTGOwkXhIB5qdaSgahCuCz96vlVOugR2YcAL87m3cGHqz7iJuoon21_P9v1oTt_C5Dk6xdcK68Y7-86PrRFwUlIIG5dlASMC3raGCCnp9FSSiTWQF29r3KMNv_le2Vb-3eXyscoeI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
              <p className="font-bold text-body-lg">Optimisez vos rendements</p>
              <p className="text-label-sm opacity-80">Découvrez nos conseils personnalisés</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
