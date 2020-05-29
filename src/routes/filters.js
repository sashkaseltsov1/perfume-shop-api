const express =require('express');
const passport = require('passport')
const router = express.Router();
const controller = require('../controllers/filters');
/*router.get('/', passport.authenticate('jwt', {session:false}),controller.getAll);*/
router.get('/',controller.getAll);

module.exports = router;