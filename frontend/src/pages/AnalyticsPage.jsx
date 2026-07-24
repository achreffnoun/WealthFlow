import { useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts'
import { useApp } from '../context/AppContext'
import { CATEGORIES, getCategory } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import { totalAmount, totalByCategory, monthlyTotalsSeries } from '../utils/calculations'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton'

const PERIODS = [
  { key: 7, label: '7j' },
  { key: 30, label: '30j' },
  { key: 90, label: '90j' },
  { key: 180, label: '6m' },
  { key: 365, label: '1a' },
]

function expensesBetween(expenses, start, end) {
  return expenses.filter((e) => {
    const d = new Date(e.date)
    return d >= start && d < end
  })
}

export default function AnalyticsPage() {
  const { expenses, loading } = useApp()
  const { showToast } = useToast()
  const [period, setPeriod] = useState(30)

  const now = new Date()
  const periodStart = new Date(now)
  periodStart.setDate(periodStart.getDate() - period)
  const prevPeriodStart = new Date(periodStart)
  prevPeriodStart.setDate(prevPeriodStart.getDate() - period)

  const periodExpenses = useMemo(() => expensesBetween(expenses, periodStart, now), [expenses, period])
  const prevPeriodExpenses = useMemo(() => expensesBetween(expenses, prevPeriodStart, periodStart), [expenses, period])

  const total = totalAmount(periodExpenses)
  const prevTotal = totalAmount(prevPeriodExpenses)
  const totalDelta = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null

  const avgDay = period > 0 ? total / period : 0
  const prevAvgDay = period > 0 ? prevTotal / period : 0
  const avgDelta = prevAvgDay > 0 ? Math.round(((avgDay - prevAvgDay) / prevAvgDay) * 100) : null

  const byCategory = totalByCategory(periodExpenses)
  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1])
  const topCategory = sortedCategories[0] ? getCategory(sortedCategories[0][0]) : null
  const topCategoryPercent = sortedCategories[0] && total > 0 ? Math.round((sortedCategories[0][1] / total) * 100) : 0

  const countDelta = periodExpenses.length - prevPeriodExpenses.length

  const pieData = sortedCategories.map(([code, value]) => ({ code, value, ...getCategory(code) }))

  // AI-style insight: category with the biggest spending drop vs previous equal period
  const byCategoryPrev = totalByCategory(prevPeriodExpenses)
  let bestDrop = null
  for (const code of Object.keys(byCategoryPrev)) {
    const prev = byCategoryPrev[code]
    const cur = byCategory[code] || 0
    if (prev > 0 && cur < prev) {
      const pct = Math.round(((prev - cur) / prev) * 100)
      if (!bestDrop || pct > bestDrop.pct) bestDrop = { code, pct, savedAmount: prev - cur }
    }
  }

  const dailySeries = useMemo(() => {
    const days = []
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      days.push(d)
    }
    return days.map((d) => ({
      date: d,
      label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      total: totalAmount(expenses.filter((e) => new Date(e.date).toDateString() === d.toDateString())),
    }))
  }, [expenses, period])

  const peakDay = dailySeries.reduce((max, d) => (d.total > (max?.total ?? -1) ? d : max), null)

  const monthlySeries = monthlyTotalsSeries(expenses, 6)

  const handleExport = () => {
    const header = 'Date,Catégorie,Description,Montant\n'
    const rows = periodExpenses
      .map((e) => `${e.date.slice(0, 10)},${getCategory(e.category).label},"${(e.description || '').replace(/"/g, '""')}",${e.amount}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `depenses-${period}j.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Export CSV téléchargé')
  }

  if (loading) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-stack-lg">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
        <SkeletonTable rows={5} />
      </>
    )
  }

  return (
    <>
      {/* Header & Period Selector */}
      <section className="flex flex-col md:flex-row md:items-center justify-between mb-stack-lg gap-gutter">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Analyses Financières</h2>
          <p className="text-on-surface-variant font-body-md">Suivez vos performances et optimisez vos dépenses.</p>
        </div>
        <div className="bg-surface-container flex p-1 rounded-xl shadow-inner self-start">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-gutter py-base text-label-sm rounded-lg transition-all ${
                period === p.key ? 'bg-white shadow-sm text-primary font-bold' : 'hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30 group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-base mb-base">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">account_balance</span>
            <span className="text-on-surface-variant text-label-sm uppercase tracking-wider">Total Dépenses</span>
          </div>
          <div className="font-amount-lg text-amount-lg text-on-background">{formatCurrency(total)}</div>
          {totalDelta !== null && (
            <div className={`mt-base flex items-center gap-base font-label-sm ${totalDelta <= 0 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-sm">{totalDelta <= 0 ? 'trending_down' : 'trending_up'}</span>
              <span>{totalDelta <= 0 ? totalDelta : `+${totalDelta}`}% vs période précédente</span>
            </div>
          )}
        </div>
        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30 group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-base mb-base">
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-lg">calendar_today</span>
            <span className="text-on-surface-variant text-label-sm uppercase tracking-wider">Moyenne Quotidienne</span>
          </div>
          <div className="font-amount-lg text-amount-lg text-on-background">{formatCurrency(avgDay)}</div>
          {avgDelta !== null && (
            <div className={`mt-base flex items-center gap-base font-label-sm ${avgDelta <= 0 ? 'text-secondary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-sm">{avgDelta <= 0 ? 'trending_down' : 'trending_up'}</span>
              <span>{avgDelta <= 0 ? avgDelta : `+${avgDelta}`}% vs période précédente</span>
            </div>
          )}
        </div>
        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30 group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-base mb-base">
            <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-lg">shopping_cart</span>
            <span className="text-on-surface-variant text-label-sm uppercase tracking-wider">Catégorie coûteuse</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-background">{topCategory ? topCategory.label : '—'}</div>
          <div className="mt-base text-on-surface-variant font-label-sm">{topCategoryPercent}% du total</div>
        </div>
        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30 group hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-base mb-base">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">receipt_long</span>
            <span className="text-on-surface-variant text-label-sm uppercase tracking-wider">Transactions</span>
          </div>
          <div className="font-amount-lg text-amount-lg text-on-background">{periodExpenses.length}</div>
          <div className="mt-base text-on-surface-variant font-label-sm">
            {countDelta === 0 ? 'Stable' : countDelta > 0 ? `+${countDelta} vs période précédente` : `${countDelta} vs période précédente`}
          </div>
        </div>
      </div>

      {/* AI Insights Highlight */}
      <div className="bg-primary/5 border border-primary/20 p-gutter rounded-xl mb-stack-lg flex items-start gap-gutter">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-lg">
          <span className="material-symbols-outlined text-on-primary">auto_awesome</span>
        </div>
        <div>
          <h3 className="font-headline-md text-primary mb-1">Insight</h3>
          <p className="text-on-surface-variant font-body-md leading-relaxed">
            {bestDrop ? (
              <>
                📈 <span className="font-bold text-on-background">Félicitations !</span> Vous avez dépensé{' '}
                <span className="text-secondary font-bold">{bestDrop.pct}% de moins</span> en{' '}
                {getCategory(bestDrop.code).label.toLowerCase()} sur cette période par rapport à la précédente. Cela représente une économie de{' '}
                {formatCurrency(bestDrop.savedAmount)}.
              </>
            ) : (
              'Continuez à enregistrer vos dépenses pour débloquer des insights personnalisés sur vos habitudes.'
            )}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg mb-stack-lg">
        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30">
          <h3 className="font-headline-md text-on-background mb-stack-lg">Dépenses par catégorie</h3>
          {pieData.length === 0 ? (
            <EmptyState icon="donut_small" title="Aucune donnée" message="Aucune dépense sur cette période." />
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-stack-lg">
              <div className="relative w-48 h-48">
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
                  <span className="text-label-sm text-on-surface-variant">TOTAL</span>
                  <span className="font-amount-md text-on-background">{formatCurrency(total)}</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-2 w-full">
                {pieData.map((cat) => (
                  <div key={cat.code} className="flex items-center justify-between text-body-md">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span>{cat.label}</span>
                    </div>
                    <span className="font-amount-md">{Math.round((cat.value / total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30">
          <h3 className="font-headline-md text-on-background mb-stack-lg">Évolution des dépenses</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e2ec" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#727785' }} interval={Math.ceil(dailySeries.length / 6)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#727785' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="total" stroke="#0058be" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {peakDay && peakDay.total > 0 && (
            <div className="mt-4 p-base bg-surface-container rounded-lg flex items-center justify-between text-body-md">
              <span className="text-on-surface-variant">Pic de dépense :</span>
              <span className="font-bold text-on-background">
                {peakDay.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — {formatCurrency(peakDay.total)}
              </span>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest p-gutter rounded-xl shadow-level-1 border border-outline-variant/30 lg:col-span-2">
          <h3 className="font-headline-md text-on-background mb-stack-lg">Comparaison mensuelle</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e2ec" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#727785' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#727785' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="total" fill="#0058be" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-level-1 border border-outline-variant/30 overflow-hidden">
        <div className="px-gutter py-stack-md border-b border-outline-variant/20 flex justify-between items-center">
          <h3 className="font-headline-md text-on-background">Détails par catégorie</h3>
          <button onClick={handleExport} className="text-primary font-label-sm flex items-center gap-1 hover:underline">
            Exporter CSV <span className="material-symbols-outlined text-sm">download</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider">
                <th className="px-gutter py-stack-md">Catégorie</th>
                <th className="px-gutter py-stack-md">Total dépensé</th>
                <th className="px-gutter py-stack-md">% du total</th>
                <th className="px-gutter py-stack-md">Moy. Transaction</th>
                <th className="px-gutter py-stack-md">Tendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-body-md">
              {sortedCategories.map(([code, value]) => {
                const cat = getCategory(code)
                const count = periodExpenses.filter((e) => e.category === code).length
                const avgTransaction = count > 0 ? value / count : 0
                const percent = total > 0 ? Math.round((value / total) * 100) : 0
                const prevValue = byCategoryPrev[code] || 0
                const trendPct = prevValue > 0 ? Math.round(((value - prevValue) / prevValue) * 100) : null

                return (
                  <tr key={code} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-gutter py-stack-md">
                      <div className="flex items-center gap-base">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}1a` }}>
                          <span className="material-symbols-outlined text-sm" style={{ color: cat.color }}>
                            {cat.icon}
                          </span>
                        </div>
                        <span className="font-bold">{cat.label}</span>
                      </div>
                    </td>
                    <td className="px-gutter py-stack-md font-amount-md">{formatCurrency(value)}</td>
                    <td className="px-gutter py-stack-md">
                      <div className="flex items-center gap-base">
                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden max-w-[100px]">
                          <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: cat.color }} />
                        </div>
                        <span className="text-label-sm">{percent}%</span>
                      </div>
                    </td>
                    <td className="px-gutter py-stack-md font-amount-md">{formatCurrency(avgTransaction)}</td>
                    <td className="px-gutter py-stack-md">
                      {trendPct === null ? (
                        <span className="text-on-surface-variant">Nouveau</span>
                      ) : trendPct === 0 ? (
                        <span className="text-on-surface-variant">Stable</span>
                      ) : trendPct > 0 ? (
                        <span className="text-error flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">arrow_upward</span> {trendPct}%
                        </span>
                      ) : (
                        <span className="text-secondary flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">arrow_downward</span> {Math.abs(trendPct)}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {sortedCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-gutter py-8 text-center text-on-surface-variant">
                    Aucune dépense sur cette période.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
