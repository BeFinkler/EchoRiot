const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EchoRiot API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de playlists e autenticação de usuários',
      contact: {
        name: 'EchoRiot',
        url: 'https://github.com/BeFinkler/EchoRiot',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desenvolvimento',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor alternativo',
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
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
