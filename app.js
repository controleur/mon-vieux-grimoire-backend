const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');

mongoose.connect('mongodb+srv://devcontroleur:p4KIFGLIWBxYfALZ@cluster0.hujly5r.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();



module.exports = app;