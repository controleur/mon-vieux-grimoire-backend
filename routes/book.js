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

router.post('/', auth, upload, processImage, bookCtrl.createBook);
router.put('/:id', auth, upload, processImageIfFile, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/bestrating', bookCtrl.showBestRatings)
router.get('/:id', bookCtrl.showOneBook);
router.get('/' + '', bookCtrl.showAllBooks);
router.post('/:id/rating', auth, bookCtrl.addGrade);

module.exports = router;