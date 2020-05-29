const express =require('express');
const passport = require('passport')
const router = express.Router();
const controller = require('../controllers/user');

router.get('/', passport.authenticate('jwt', {session:false}),controller.getUser);
router.put('/', passport.authenticate('jwt', {session:false}),controller.editUser);

module.exports = router;