const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

router.post('/', bookCtrl.createBook);
router.get('/:id', bookCtrl.showOneBook);
router.put('/:id', bookCtrl.updateBook);
router.delete('/:id', bookCtrl.deleteBook);
router.get('/' + '', bookCtrl.showAllBooks);

module.exports = router;