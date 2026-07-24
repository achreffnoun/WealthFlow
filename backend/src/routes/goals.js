import { Router } from 'express'
import { list, create, update, addSavings, remove } from '../controllers/goalController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/**
 * @openapi
 * /goals:
 *   get:
 *     tags: [Goals]
 *     summary: Lister les objectifs d'épargne
 *     responses:
 *       200:
 *         description: Liste des objectifs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items: { type: array, items: { $ref: '#/components/schemas/Goal' } }
 *   post:
 *     tags: [Goals]
 *     summary: Créer un objectif
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, targetAmount]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *               savedAmount: { type: number }
 *               deadline: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Objectif créé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Goal' }
 *       400: { description: Requête invalide, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get('/', list)
router.post('/', create)

/**
 * @openapi
 * /goals/{id}:
 *   put:
 *     tags: [Goals]
 *     summary: Mettre à jour un objectif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               targetAmount: { type: number }
 *               savedAmount: { type: number }
 *               deadline: { type: string, format: date-time }
 *               status: { type: string, enum: [active, completed, abandoned] }
 *     responses:
 *       200:
 *         description: Objectif mis à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Goal' }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Goals]
 *     summary: Supprimer un objectif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Suppression réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.put('/:id', update)

/**
 * @openapi
 * /goals/{id}/savings:
 *   patch:
 *     tags: [Goals]
 *     summary: Ajouter de l'épargne à un objectif
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount: { type: number }
 *     responses:
 *       200:
 *         description: Objectif mis à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Goal' }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.patch('/:id/savings', addSavings)
router.delete('/:id', remove)

export default router
