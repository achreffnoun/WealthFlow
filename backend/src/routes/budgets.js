import { Router } from 'express'
import { list, create, update, remove } from '../controllers/budgetController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/**
 * @openapi
 * /budgets:
 *   get:
 *     tags: [Budgets]
 *     summary: Lister les budgets de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des budgets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items: { type: array, items: { $ref: '#/components/schemas/Budget' } }
 *   post:
 *     tags: [Budgets]
 *     summary: Créer un budget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category, limit, month, year]
 *             properties:
 *               category: { type: string }
 *               limit: { type: number }
 *               month: { type: integer, minimum: 1, maximum: 12 }
 *               year: { type: integer }
 *     responses:
 *       201:
 *         description: Budget créé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Budget' }
 *       400: { description: Requête invalide, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       409: { description: Budget déjà existant pour cette période, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get('/', list)
router.post('/', create)

/**
 * @openapi
 * /budgets/{id}:
 *   put:
 *     tags: [Budgets]
 *     summary: Mettre à jour un budget
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
 *               limit: { type: number }
 *     responses:
 *       200:
 *         description: Budget mis à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Budget' }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Budgets]
 *     summary: Supprimer un budget
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
router.delete('/:id', remove)

export default router
