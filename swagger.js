const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration de base de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Mon Vieux Grimoire API',
    version: '1.0.0',
    description: 'API pour la gestion de livres et des utilisateurs du site Mon Vieux Grimoire',
    contact: {
      name: 'Support API',
      email: 'support@monvieuxgrimoire.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Serveur de développement'
    },
    {
      url: 'https://api.monvieuxgrimoire.com',
      description: 'Serveur de production'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT pour l\'authentification'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Adresse email de l\'utilisateur',
            example: 'user@example.com'
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'Mot de passe de l\'utilisateur',
            example: 'motdepasse123'
          }
        }
      },
      Book: {
        type: 'object',
        required: ['title', 'author', 'year', 'genre'],
        properties: {
          _id: {
            type: 'string',
            description: 'Identifiant unique du livre',
            example: '507f1f77bcf86cd799439011'
          },
          userId: {
            type: 'string',
            description: 'ID de l\'utilisateur qui a ajouté le livre',
            example: '507f1f77bcf86cd799439012'
          },
          title: {
            type: 'string',
            description: 'Titre du livre',
            example: 'Le Seigneur des Anneaux'
          },
          author: {
            type: 'string',
            description: 'Auteur du livre',
            example: 'J.R.R. Tolkien'
          },
          imageUrl: {
            type: 'string',
            description: 'URL de l\'image de couverture',
            example: 'http://localhost:4000/images/livre1234567890.webp'
          },
          year: {
            type: 'number',
            description: 'Année de publication',
            example: 1954
          },
          genre: {
            type: 'string',
            description: 'Genre du livre',
            example: 'Fantasy'
          },
          ratings: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Rating'
            },
            description: 'Liste des notes attribuées au livre'
          },
          averageRating: {
            type: 'number',
            description: 'Note moyenne du livre',
            example: 4.5
          }
        }
      },
      Rating: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID de l\'utilisateur qui a noté',
            example: '507f1f77bcf86cd799439013'
          },
          grade: {
            type: 'number',
            minimum: 0,
            maximum: 5,
            description: 'Note attribuée (0-5)',
            example: 4
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID de l\'utilisateur connecté',
            example: '507f1f77bcf86cd799439012'
          },
          token: {
            type: 'string',
            description: 'Token JWT pour l\'authentification',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Message d\'erreur',
            example: 'Une erreur est survenue'
          }
        }
      }
    }
  }
};

// Options pour swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  // Chemins vers les fichiers contenant les annotations Swagger
  apis: ['./routes/*.js', './controllers/*.js', './app.js']
};

// Génération de la spécification Swagger
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};
