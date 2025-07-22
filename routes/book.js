const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const auth = require('../middleware/auth');
const { upload, processImage } = require('../middleware/multer-config');

const processImageIfFile = (req, res, next) => {
  if (req.file) {
    processImage(req, res, next);
  } else {
    next();
  }
};

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gestion des livres
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Créer un nouveau livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - book
 *               - image
 *             properties:
 *               book:
 *                 type: string
 *                 description: Données du livre au format JSON
 *                 example: '{"title":"Le Hobbit","author":"J.R.R. Tolkien","year":1937,"genre":"Fantasy"}'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de couverture du livre
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre enregistré !
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', auth, upload, processImage, bookCtrl.createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Modifier un livre existant
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *                 description: Données du livre au format JSON (optionnel si pas de nouvelle image)
 *               title:
 *                 type: string
 *                 description: Titre du livre
 *               author:
 *                 type: string
 *                 description: Auteur du livre
 *               year:
 *                 type: number
 *                 description: Année de publication
 *               genre:
 *                 type: string
 *                 description: Genre du livre
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nouvelle image de couverture (optionnelle)
 *     responses:
 *       200:
 *         description: Livre modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre modifié !
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Livre non trouvé
 */
router.put('/:id', auth, upload, processImageIfFile, bookCtrl.updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Supprimer un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Livre supprimé !
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Livre non trouvé
 */
router.delete('/:id', auth, bookCtrl.deleteBook);

/**
 * @swagger
 * /api/books/bestrating:
 *   get:
 *     summary: Obtenir les 3 livres les mieux notés
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste des 3 livres les mieux notés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Erreur serveur
 */
router.get('/bestrating', bookCtrl.showBestRatings)

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Obtenir un livre par son ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', bookCtrl.showOneBook);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Obtenir tous les livres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Liste de tous les livres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Erreur serveur
 */
router.get('/' + '', bookCtrl.showAllBooks);

/**
 * @swagger
 * /api/books/{id}/rating:
 *   post:
 *     summary: Noter un livre
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre à noter
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Note à attribuer (0-5)
 *                 example: 4
 *     responses:
 *       200:
 *         description: Note ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Utilisateur a déjà noté ce livre ou note invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Livre non trouvé
 */
router.post('/:id/rating', auth, bookCtrl.addGrade);

module.exports = router;