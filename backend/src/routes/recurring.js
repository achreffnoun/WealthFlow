import { Router } from 'express'
import { list, create, update, remove } from '../controllers/recurringController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

/**
 * @openapi
 * /recurring-transactions:
 *   get:
 *     tags: [RecurringTransactions]
 *     summary: Lister les transactions récurrentes de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des transactions récurrentes
 *   post:
 *     tags: [RecurringTransactions]
 *     summary: Créer une transaction récurrente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, categoryOrSource, frequency, startDate]
 *             properties:
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               amount: { type: number }
 *               categoryOrSource: { type: string }
 *               description: { type: string }
 *               frequency: { type: string, enum: [DAILY, WEEKLY, MONTHLY, YEARLY] }
 *               startDate: { type: string, format: date-time }
 *               endDate: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Transaction récurrente créée
 *       400: { description: Requête invalide }
 */
router.get('/', list)
router.post('/', create)

/**
 * @openapi
 * /recurring-transactions/{id}:
 *   put:
 *     tags: [RecurringTransactions]
 *     summary: Mettre à jour une transaction récurrente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Transaction récurrente mise à jour }
 *       404: { description: Introuvable }
 *   delete:
 *     tags: [RecurringTransactions]
 *     summary: Supprimer une transaction récurrente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Suppression réussie }
 *       404: { description: Introuvable }
 */
router.put('/:id', update)
router.delete('/:id', remove)

export default router
