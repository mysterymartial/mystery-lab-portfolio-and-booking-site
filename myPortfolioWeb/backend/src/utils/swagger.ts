// Swagger/OpenAPI documentation setup
// Install swagger-ui-express and swagger-jsdoc for full implementation
// npm install swagger-ui-express swagger-jsdoc @types/swagger-ui-express @types/swagger-jsdoc

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mystery Lab API',
      version: '1.0.0',
      description: 'API documentation for Mystery Lab Portfolio and Gig Booking Website',
      contact: {
        name: 'Agbaosi Bolarinwa Minasu (Mystery)',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
      },
    },
    servers: [
      {
        url: process.env.PRODUCTION_URL || process.env.FRONTEND_URL?.replace('/api', '') || 'http://localhost:5000',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

// Example API endpoint documentation format:
/*
/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
