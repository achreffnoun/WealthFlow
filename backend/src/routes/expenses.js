import { Router } from 'express'
import { list, create, update, remove } from '../controllers/expenseController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/**
 * @openapi
 * /expenses:
 *   get:
 *     tags: [Expenses]
 *     summary: Lister les dépenses de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des dépenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items: { type: array, items: { $ref: '#/components/schemas/Expense' } }
 *                 total: { type: integer }
 *   post:
 *     tags: [Expenses]
 *     summary: Créer une dépense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, category, date]
 *             properties:
 *               amount: { type: number }
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               description: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Dépense créée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Expense' }
 *       400: { description: Requête invalide, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get('/', list)
router.post('/', create)

/**
 * @openapi
 * /expenses/{id}:
 *   put:
 *     tags: [Expenses]
 *     summary: Mettre à jour une dépense
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
 *               category: { type: string }
 *               date: { type: string, format: date-time }
 *               description: { type: string }
 *               tags: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Dépense mise à jour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Expense' }
 *       404: { description: Introuvable, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Expenses]
 *     summary: Supprimer une dépense
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
