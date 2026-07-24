import { Router } from 'express'
import { register, login, me, updateMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Créer un compte
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201:
 *         description: Compte créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { description: Requête invalide, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: Email déjà utilisé, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/register', register)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Se connecter
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { description: Identifiants invalides, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post('/login', login)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Profil de l'utilisateur connecté
 *     responses:
 *       200:
 *         description: Utilisateur courant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { description: Non authentifié, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   put:
 *     tags: [Auth]
 *     summary: Mettre à jour le profil
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               currency: { type: string }
 *               language: { type: string }
 *               theme: { type: string }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user: { $ref: '#/components/schemas/User' }
 *       401: { description: Non authentifié, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get('/me', requireAuth, me)
router.put('/me', requireAuth, updateMe)

export default router
