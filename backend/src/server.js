import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import authRoutes from './routes/auth.js'
import expenseRoutes from './routes/expenses.js'
import incomeRoutes from './routes/incomes.js'
import budgetRoutes from './routes/budgets.js'
import goalRoutes from './routes/goals.js'
import recurringRoutes from './routes/recurring.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/incomes', incomeRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/recurring-transactions', recurringRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`API démarrée sur http://localhost:${port}`)
})
