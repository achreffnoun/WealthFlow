import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import { CATEGORIES, INCOME_SOURCES, RECURRING_TYPES, RECURRING_FREQUENCIES } from '../constants.js'

function computeNextRunDate(from, frequency) {
  const next = new Date(from)
  switch (frequency) {
    case 'DAILY':
      next.setDate(next.getDate() + 1)
      break
    case 'WEEKLY':
      next.setDate(next.getDate() + 7)
      break
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1)
      break
    case 'YEARLY':
      next.setFullYear(next.getFullYear() + 1)
      break
  }
  return next
}

function validate(body, { partial = false } = {}) {
  const { type, amount, categoryOrSource, frequency, startDate, endDate, description } = body

  if (!partial || type !== undefined) {
    if (!RECURRING_TYPES.includes(type)) {
      throw new ApiError(400, 'Type invalide')
    }
  }
  if (!partial || amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new ApiError(400, 'Le montant doit être positif')
    }
    if (amount > 999999.99) {
      throw new ApiError(400, 'Montant trop élevé')
    }
  }
  if (!partial || categoryOrSource !== undefined) {
    const validValues = type === 'INCOME' ? INCOME_SOURCES : CATEGORIES
    if (!validValues.includes(categoryOrSource)) {
      throw new ApiError(400, 'Catégorie/source invalide')
    }
  }
  if (!partial || frequency !== undefined) {
    if (!RECURRING_FREQUENCIES.includes(frequency)) {
      throw new ApiError(400, 'Fréquence invalide')
    }
  }
  if (!partial || startDate !== undefined) {
    if (!startDate || isNaN(new Date(startDate).getTime())) {
      throw new ApiError(400, 'Date de début invalide')
    }
  }
  if (endDate !== undefined && endDate !== null && isNaN(new Date(endDate).getTime())) {
    throw new ApiError(400, 'Date de fin invalide')
  }
  if (description !== undefined && description !== null && description.length > 500) {
    throw new ApiError(400, 'Description trop longue')
  }
}

export async function list(req, res, next) {
  try {
    const items = await prisma.recurringTransaction.findMany({
      where: { userId: req.userId },
      orderBy: { nextRunDate: 'asc' },
    })
    res.json({ items, total: items.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    validate(req.body)
    const { type, amount, categoryOrSource, description, frequency, startDate, endDate } = req.body
    const recurring = await prisma.recurringTransaction.create({
      data: {
        userId: req.userId,
        type,
        amount,
        categoryOrSource,
        description: description || null,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        nextRunDate: new Date(startDate),
      },
    })
    res.status(201).json(recurring)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const existing = await prisma.recurringTransaction.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Transaction récurrente introuvable')
    validate({ type: existing.type, ...req.body }, { partial: true })
    const { amount, categoryOrSource, description, frequency, startDate, endDate, active } = req.body
    const recurring = await prisma.recurringTransaction.update({
      where: { id: existing.id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(categoryOrSource !== undefined && { categoryOrSource }),
        ...(description !== undefined && { description }),
        ...(frequency !== undefined && { frequency }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    })
    res.json(recurring)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.recurringTransaction.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Transaction récurrente introuvable')
    await prisma.recurringTransaction.delete({ where: { id: existing.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export { computeNextRunDate }
