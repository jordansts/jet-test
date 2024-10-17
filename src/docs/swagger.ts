import swaggerJsdoc from 'swagger-jsdoc';

export const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Swagger Express API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
    },
  },
  apis: ['./src/routes/messageRoutes.ts'],
});
