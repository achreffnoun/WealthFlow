import 'dotenv/config'
import { prisma } from '../config/db.js'
import { computeNextRunDate } from '../controllers/recurringController.js'

async function run() {
  const now = new Date()
  const due = await prisma.recurringTransaction.findMany({
    where: {
      active: true,
      nextRunDate: { lte: now },
      OR: [{ endDate: null }, { endDate: { gte: now } }],
    },
  })

  console.log(`[generateRecurring] ${due.length} transaction(s) due`)

  for (const rt of due) {
    let runDate = rt.nextRunDate

    await prisma.$transaction(async (tx) => {
      // rattrape toutes les occurrences manquées (ex: cron resté down plusieurs jours)
      while (runDate <= now && (!rt.endDate || runDate <= rt.endDate)) {
        if (rt.type === 'INCOME') {
          await tx.income.create({
            data: {
              userId: rt.userId,
              amount: rt.amount,
              source: rt.categoryOrSource,
              description: rt.description,
              date: runDate,
            },
          })
        } else {
          await tx.expense.create({
            data: {
              userId: rt.userId,
              amount: rt.amount,
              category: rt.categoryOrSource,
              description: rt.description,
              date: runDate,
            },
          })
        }
        runDate = computeNextRunDate(runDate, rt.frequency)
      }

      await tx.recurringTransaction.update({
        where: { id: rt.id },
        data: { nextRunDate: runDate, lastGeneratedAt: now },
      })
    })
  }

  console.log('[generateRecurring] done')
}

run()
  .catch((err) => {
    console.error('[generateRecurring] failed', err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
