const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');


const processImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error });
  }

  try {
    const userId = req.auth.userId;
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}.webp`;
    const outputPath = path.join(__dirname, '../images', filename);

    if (!fs.existsSync(path.join(__dirname, '../images'))) {
      fs.mkdirSync(path.join(__dirname, '../images'));
    }

    await sharp(req.file.buffer)
      .resize({ width: 448 }) //40%-80px de 1320px, largeur maximale des images sur front
      .webp({ quality: 80 }) 
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error( error );
    res.status(500).json({ error });
  }
};

module.exports = { upload, processImage };