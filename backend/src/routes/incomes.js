import { Router } from 'express'
import { list, create, update, remove } from '../controllers/incomeController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/**
 * @openapi
 * /incomes:
 *   get:
 *     tags: [Incomes]
 *     summary: Lister les revenus de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des revenus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items: { type: array, items: { $ref: '#/components/schemas/Income' } }
 *                 total: { type: integer }
 *   post:
 *     tags: [Incomes]
 *     summary: Créer un revenu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, source, date]
 *             properties:
 *               amount: { type: number }
 *               source: { type: string }
 *               date: { type: string, format: date-time }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Revenu créé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Income' }
 *       400: { description: Requête invalide, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get('/', list)
router.post('/', create)

/**
 * @openapi
 * /incomes/{id}:
 *   put:
 *     tags: [Incomes]
 *     summary: Mettre à jour un revenu
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
 *               amount: { type: number }
 *               source: { type: string }
 *               date: { type: string, format: date-time }
 *               description: { type: string }
 *     responses:
 *       200:
 *         description: Revenu mis à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Income' }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Incomes]
 *     summary: Supprimer un revenu
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
