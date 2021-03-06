const express =require('express');
const multer = require('multer');
const passport = require('passport')
const upload = multer({ dest: './uploads' });
const router = express.Router();
const controller = require('../controllers/products');


router.get('/:id',controller.getProduct);
router.post('/:id',controller.addComment);
router.get('/',controller.getAll);
router.delete('/:id',passport.authenticate('jwt', {session:false}),controller.removeProduct);
router.post('/',passport.authenticate('jwt', {session:false}),upload.single('image'),controller.create);
router.put('/:id',passport.authenticate('jwt', {session:false}),upload.single('image'),controller.update);
router.put('/remove-restore-comment/:id',passport.authenticate('jwt', {session:false}), controller.removeOrRestoreComment);

module.exports = router;