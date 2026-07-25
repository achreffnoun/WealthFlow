import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

async function main() {
  const email = 'thomas@example.com'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Utilisateur démo déjà présent:', email)
    return
  }

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName: 'Thomas', lastName: 'Demo' },
  })

  const now = new Date()

  await prisma.expense.createMany({
    data: [
      { userId: user.id, amount: 142.5, category: 'FOOD', description: 'Courses hebdomadaires', date: daysAgo(0) },
      { userId: user.id, amount: 85, category: 'TRANSPORT', description: 'Plein essence', date: daysAgo(1) },
      { userId: user.id, amount: 17.99, category: 'ENTERTAINMENT', description: 'Abonnement streaming', date: daysAgo(2) },
      { userId: user.id, amount: 92.3, category: 'HOUSING', description: 'Facture électricité', date: daysAgo(4) },
      { userId: user.id, amount: 45.1, category: 'HEALTH', description: 'Pharmacie', date: daysAgo(6) },
    ],
  })

  await prisma.income.createMany({
    data: [
      { userId: user.id, amount: 2400, source: 'SALARY', description: 'Salaire mensuel', date: daysAgo(5) },
      { userId: user.id, amount: 300, source: 'FREELANCE', description: 'Mission freelance', date: daysAgo(10) },
    ],
  })

  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: 'FOOD', limit: 400, month: now.getMonth() + 1, year: now.getFullYear() },
      { userId: user.id, category: 'TRANSPORT', limit: 150, month: now.getMonth() + 1, year: now.getFullYear() },
      { userId: user.id, category: 'HOUSING', limit: 900, month: now.getMonth() + 1, year: now.getFullYear() },
    ],
  })

  await prisma.goal.create({
    data: {
      userId: user.id,
      name: "Vacances d'été",
      description: 'Voyage en Italie',
      targetAmount: 2000,
      savedAmount: 850,
      deadline: new Date(now.getFullYear(), now.getMonth() + 2, 28),
      status: 'active',
    },
  })

  console.log('Utilisateur démo créé:', email, '/ mot de passe: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
