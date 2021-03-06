const express =require('express');
const passport = require('passport')
const router = express.Router();
const controller = require('../controllers/orders');

router.post('/', passport.authenticate('jwt', {session:false}),controller.addOrder);
router.get('/:id', passport.authenticate('jwt', {session:false}),controller.getOrder);

module.exports = router;