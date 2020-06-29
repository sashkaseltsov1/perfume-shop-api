const express =require('express');
const passport = require('passport');
const router = express.Router();
const controller = require('../controllers/filters');

router.get('/',controller.getAll);
router.get('/:category', controller.getFilter);
router.post('/:category', passport.authenticate('jwt', {session:false}),controller.addFilter);
router.delete('/:category/:optionId', passport.authenticate('jwt', {session:false}),controller.removeFilter);

module.exports = router;