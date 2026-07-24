import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import { CATEGORIES } from '../constants.js'

export async function list(req, res, next) {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    })
    res.json({ items: budgets })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const { category, limit, month, year } = req.body
    if (!CATEGORIES.includes(category)) throw new ApiError(400, 'Catégorie invalide')
    if (typeof limit !== 'number' || limit <= 0) throw new ApiError(400, 'Le montant limite doit être positif')
    if (!month || month < 1 || month > 12) throw new ApiError(400, 'Mois invalide')
    if (!year) throw new ApiError(400, 'Année invalide')

    const budget = await prisma.budget.create({
      data: { userId: req.userId, category, limit, month, year },
    })
    res.status(201).json(budget)
  } catch (err) {
    if (err.code === 'P2002') {
      return next(new ApiError(409, 'Un budget existe déjà pour cette catégorie ce mois-ci'))
    }
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const existing = await prisma.budget.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Budget introuvable')
    const { limit } = req.body
    if (limit !== undefined && (typeof limit !== 'number' || limit <= 0)) {
      throw new ApiError(400, 'Le montant limite doit être positif')
    }
    const budget = await prisma.budget.update({
      where: { id: existing.id },
      data: { ...(limit !== undefined && { limit }) },
    })
    res.json(budget)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.budget.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Budget introuvable')
    await prisma.budget.delete({ where: { id: existing.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
