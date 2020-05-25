const express =require('express');
const passport = require('passport');
const router = express.Router();
const controller = require('../controllers/auth');

router.post('/signup',controller.signup);
router.post('/signin',controller.signin);
router.put('/refresh-token',controller.refreshToken);
router.get('/me', passport.authenticate('jwt', {session:false}),controller.me);


module.exports = router;