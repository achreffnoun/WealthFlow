import { CURRENCY, LOCALE } from './constants'

export function formatCurrency(amount) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
  }).format(Number(amount) || 0)
}

export function formatDate(date, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(LOCALE, options).format(d)
}

export function formatDateLong(date) {
  const d = date instanceof Date ? date : new Date(date)
  const formatted = new Intl.DateTimeFormat(LOCALE, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function toInputDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().slice(0, 10)
}

export function daysBetween(a, b) {
  const MS = 1000 * 60 * 60 * 24
  const start = new Date(a)
  const end = new Date(b)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.round((end - start) / MS)
}
