const express =require('express');
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const router = express.Router();
const controller = require('../controllers/products');

router.get('/:id',controller.getProduct);
router.post('/:id',controller.addComment);
router.get('/',controller.getAll);
router.post('/',upload.single('image'),controller.create);

module.exports = router;