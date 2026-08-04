import cron from 'node-cron'
import { generateRecurringTransactions } from './services/recurringGenerator.js'

export function startScheduler() {
  // run au démarrage — rattrape les occurrences manquées si le service dormait (Render free = sleep après inactivité)
  generateRecurringTransactions().catch((err) => console.error('[scheduler] generateRecurringTransactions failed', err))

  // chaque nuit à 2h — génère les Income/Expense dus depuis RecurringTransaction (si le service est éveillé)
  cron.schedule('0 2 * * *', () => {
    generateRecurringTransactions().catch((err) => console.error('[scheduler] generateRecurringTransactions failed', err))
  })
}
