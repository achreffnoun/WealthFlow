import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import { GOAL_STATUS } from '../constants.js'

export async function list(req, res, next) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ items: goals })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const { name, description, targetAmount, savedAmount = 0, deadline } = req.body
    if (!name || !name.trim()) throw new ApiError(400, 'Le nom est requis')
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      throw new ApiError(400, 'Le montant cible doit être positif')
    }
    if (savedAmount < 0) throw new ApiError(400, "Le montant épargné ne peut pas être négatif")
    if (savedAmount > targetAmount) throw new ApiError(400, 'Le montant épargné ne peut pas dépasser la cible')

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        name,
        description,
        targetAmount,
        savedAmount,
        deadline: deadline ? new Date(deadline) : null,
        status: savedAmount >= targetAmount ? 'completed' : 'active',
        completedAt: savedAmount >= targetAmount ? new Date() : null,
      },
    })
    res.status(201).json(goal)
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const existing = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Objectif introuvable')
    const { name, description, targetAmount, savedAmount, deadline, status } = req.body

    if (status !== undefined && !GOAL_STATUS.includes(status)) {
      throw new ApiError(400, 'Statut invalide')
    }
    const nextTarget = targetAmount ?? existing.targetAmount
    const nextSaved = savedAmount ?? existing.savedAmount
    if (nextSaved > nextTarget) throw new ApiError(400, 'Le montant épargné ne peut pas dépasser la cible')

    const willComplete = nextSaved >= nextTarget && existing.status === 'active'

    const goal = await prisma.goal.update({
      where: { id: existing.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(savedAmount !== undefined && { savedAmount }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status !== undefined && { status }),
        ...(willComplete && { status: 'completed', completedAt: new Date() }),
      },
    })
    res.json(goal)
  } catch (err) {
    next(err)
  }
}

export async function addSavings(req, res, next) {
  try {
    const existing = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Objectif introuvable')
    const { amount } = req.body
    if (typeof amount !== 'number' || amount <= 0) throw new ApiError(400, 'Le montant doit être positif')

    const savedAmount = Math.min(existing.targetAmount, existing.savedAmount + amount)
    const completed = savedAmount >= existing.targetAmount

    const goal = await prisma.goal.update({
      where: { id: existing.id },
      data: {
        savedAmount,
        ...(completed && { status: 'completed', completedAt: new Date() }),
      },
    })
    res.json(goal)
  } catch (err) {
    next(err)
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.goal.findFirst({ where: { id: req.params.id, userId: req.userId } })
    if (!existing) throw new ApiError(404, 'Objectif introuvable')
    await prisma.goal.delete({ where: { id: existing.id } })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
