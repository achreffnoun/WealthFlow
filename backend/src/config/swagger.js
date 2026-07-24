import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Suivi Dépenses API',
      version: '0.1.0',
      description: "API de suivi des dépenses, budgets et objectifs d'épargne.",
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string', nullable: true },
            lastName: { type: 'string', nullable: true },
            currency: { type: 'string', example: 'EUR' },
            language: { type: 'string', example: 'fr' },
            theme: { type: 'string', example: 'light' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Expense: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            amount: { type: 'number', format: 'float' },
            category: {
              type: 'string',
              enum: ['FOOD', 'HOUSING', 'TRANSPORT', 'CLOTHING', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'SHOPPING', 'UTILITIES', 'OTHER'],
            },
            description: { type: 'string', nullable: true },
            date: { type: 'string', format: 'date-time' },
            tags: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Budget: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            category: { type: 'string' },
            limit: { type: 'number', format: 'float' },
            month: { type: 'integer', minimum: 1, maximum: 12 },
            year: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Goal: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            targetAmount: { type: 'number', format: 'float' },
            savedAmount: { type: 'number', format: 'float' },
            deadline: { type: 'string', format: 'date-time', nullable: true },
            status: { type: 'string', enum: ['active', 'completed', 'abandoned'] },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
}

export const swaggerSpec = swaggerJsdoc(options)
