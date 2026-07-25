import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import { INCOME_SOURCES } from '../constants.js'

function validate(body, { partial = false } = {}) {
  const { amount, source, date, description } = body

  if (!partial || amount !== undefined) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new ApiError(400, 'Le montant doit être positif')
    }
    if (amount > 999999.99) {
      throw new ApiError(400, 'Montant trop élevé')
    }
  }
  if (!partial || source !== undefined) {
    if (!INCOME_SOURCES.includes(source)) {
      throw new ApiError(400, 'Source de revenu invalide')
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
}

export async function list(req, res, next) {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'desc' },
    })
    res.json({ items: incomes, total: incomes.length })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    validate(req.body)
    const { amount, source, date, description } = req.body
    const income = await prisma.income.create({
      data: {
        userId: req.userId,
        amount,
        source,
        date: new Date(date),
        description: description || null,
      },
    })
    res.status(201).json(income)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const existing = await prisma.income.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Revenu introuvable')
    validate(req.body, { partial: true })
    const { amount, source, date, description } = req.body
    const income = await prisma.income.update({
      where: { id: existing.id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(source !== undefined && { source }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description }),
      },
    })
    res.json(income)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.income.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Revenu introuvable')
    await prisma.income.delete({ where: { id: existing.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
