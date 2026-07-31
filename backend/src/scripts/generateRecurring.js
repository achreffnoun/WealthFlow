import 'dotenv/config'
import { prisma } from '../config/db.js'
import { generateRecurringTransactions } from '../services/recurringGenerator.js'

generateRecurringTransactions()
  .catch((err) => {
    console.error('[generateRecurring] failed', err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
