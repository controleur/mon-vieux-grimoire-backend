const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/book');

mongoose.connect('mongodb+srv://devcontroleur:p4KIFGLIWBxYfALZ@cluster0.hujly5r.mongodb.net/test?retryWrites=true&w=majority')
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

app.get('/api/books/:id', (req, res, next) => {
    Book.findOne({ _id:req.params.id})
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

app.get('/api/books', (req, res, next) => {
    Book.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
  });


module.exports = app;