const validator = require('validator');
const Book = require("../models/book");
const fs = require("fs");

function validateEntry(book) {
  // Limites de longueur
  if (
    !book.title || !validator.isLength(book.title, { min: 1, max: 100 }) ||
    !book.author || !validator.isLength(book.author, { min: 1, max: 50 }) ||
    !book.genre || !validator.isLength(book.genre, { min: 1, max: 30 })
  ) {
    return { valid: false, error: "Champs invalides ou trop longs." };
  }
  // Vérification année pertinente 
  if (book.year && (book.year < 1000 || book.year > new Date().getFullYear())) {
    return { valid: false, error: "Année invalide." };
  }
  // Prévention des injections XSS
  book.title = validator.escape(book.title);
  book.author = validator.escape(book.author);
  book.genre = validator.escape(book.genre);
  return { valid: true, book };
}

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const { valid, error, book } = validateEntry(bookObject);
  if (!valid) {
    return res.status(400).json({ error });
  }
  const newBook = new Book({
    ...book,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  newBook
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.showAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.showOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ error });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error });
      }

      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error });
      }

      if (req.file) {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne image:",
              err
            );
          }
        });
      }
      const { valid, error, book: validatedBook } = validateEntry(bookObject);
      if (!valid) {
        return res.status(400).json({ error });
      }
      Book.updateOne({ _id: req.params.id }, { ...validatedBook, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre modifié avec succès!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.addGrade = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = parseInt(req.body.rating, 10);

  if (isNaN(grade) || grade < 0 || grade > 5) {
    return res.status(400).json({ error });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error });
      }

      const existingRating = book.ratings.find((rating) => rating.userId === userId);

      if (existingRating) {
        return res.status(400).json({ error });
      }

      book.ratings.push({ userId, grade });

      const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = Math.round((totalRatings / book.ratings.length) * 10) / 10; // Arrondi au dixième pour respecter la maquette

      book.save()
        .then((book) => {
          res.status(200).json(book);
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.showBestRatings = (req, res, next) => {
  Book.find()
    .then((books) => {
      const bestRatedBooks = books
        .sort((a, b) => b.averageRating - a.averageRating) 
        .slice(0, 3);
      res.status(200).json(bestRatedBooks);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};