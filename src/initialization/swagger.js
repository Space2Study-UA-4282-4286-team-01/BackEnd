const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Space 2 Studies',
      version: '1.0.0',
      description: 'API Documentation Space 2 Studies'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ]
  },
  apis: ['src/docs/*.yaml']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = { swaggerUi, swaggerSpec }
