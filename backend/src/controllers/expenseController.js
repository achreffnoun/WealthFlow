import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import { CATEGORIES } from '../constants.js'

function serialize(expense) {
  return { ...expense, tags: expense.tags ? JSON.parse(expense.tags) : [] }
}

function validate(body, { partial = false } = {}) {
  const { amount, category, date, description, tags } = body

  if (!partial || amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new ApiError(400, 'Le montant doit être positif')
    }
    if (amount > 999999.99) {
      throw new ApiError(400, 'Montant trop élevé')
    }
  }
  if (!partial || category !== undefined) {
    if (!CATEGORIES.includes(category)) {
      throw new ApiError(400, 'Catégorie invalide')
    }
  }
  if (!partial || date !== undefined) {
    if (!date || new Date(date) > new Date()) {
      throw new ApiError(400, 'La date ne peut pas être future')
    }
  }
  if (description !== undefined && description !== null && description.length > 500) {
    throw new ApiError(400, 'Description trop longue')
  }
  if (tags !== undefined && tags !== null && !Array.isArray(tags)) {
    throw new ApiError(400, 'Tags invalides')
  }
}

export async function list(req, res, next) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    })
    res.json({ items: expenses.map(serialize), total: expenses.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    validate(req.body)
    const { amount, category, date, description, tags } = req.body
    const expense = await prisma.expense.create({
      data: {
        userId: req.userId,
        amount,
        category,
        date: new Date(date),
        description: description || null,
        tags: tags ? JSON.stringify(tags) : null,
      },
    })
    res.status(201).json(serialize(expense))
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const existing = await prisma.expense.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Dépense introuvable')
    validate(req.body, { partial: true })
    const { amount, category, date, description, tags } = req.body
    const expense = await prisma.expense.update({
      where: { id: existing.id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags: tags ? JSON.stringify(tags) : null }),
      },
    })
    res.json(serialize(expense))
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.expense.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Dépense introuvable')
    await prisma.expense.delete({ where: { id: existing.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
