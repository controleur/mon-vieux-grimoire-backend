const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');
const { swaggerUi, swaggerSpec } = require('./swagger');
require("dotenv").config(); //ajout dotenv pour masquer la string de connexion

mongoose.connect(process.env.DATABASE) //string contenue dans .env
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route pour la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Mon Vieux Grimoire API Documentation",
  customfavIcon: "/images/favicon.ico",
  customCss: `
    .topbar-wrapper .download-url-wrapper { display: none }
    .swagger-ui .topbar { background-color: #2c3e50; }
  `
}));

app.use('/api/books', bookRoutes);

app.use('/api/auth', userRoutes);



module.exports = app;