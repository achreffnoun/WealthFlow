import cron from 'node-cron'
import { generateRecurringTransactions } from './services/recurringGenerator.js'

export function startScheduler() {
  // chaque nuit à 2h — génère les Income/Expense dus depuis RecurringTransaction
  cron.schedule('0 2 * * *', () => {
    generateRecurringTransactions().catch((err) => console.error('[scheduler] generateRecurringTransactions failed', err))
  })
}
