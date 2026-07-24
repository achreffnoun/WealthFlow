import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user
  return publicUser
}

export async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName } = req.body
    if (!email || !password) {
      throw new ApiError(400, 'Email et mot de passe requis')
    }
    if (password.length < 6) {
      throw new ApiError(400, 'Le mot de passe doit contenir au moins 6 caractères')
    }
    const normalizedEmail = email.toLowerCase().trim()
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      throw new ApiError(409, 'Un compte existe déjà avec cet email')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email: normalizedEmail, passwordHash, firstName, lastName },
    })
    const token = signToken(user.id)
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new ApiError(400, 'Email et mot de passe requis')
    }
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      throw new ApiError(401, 'Identifiants invalides')
    }
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw new ApiError(401, 'Identifiants invalides')
    }
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
    const token = signToken(user.id)
    res.json({ token, user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) throw new ApiError(404, 'Utilisateur introuvable')
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
}

export async function updateMe(req, res, next) {
  try {
    const { firstName, lastName, currency, language, theme } = req.body
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { firstName, lastName, currency, language, theme },
    })
    res.json({ user: toPublicUser(user) })
  } catch (err) {
    next(err)
  }
}
