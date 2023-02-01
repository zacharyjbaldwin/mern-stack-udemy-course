const router = require('express').Router();
const { check } = require('express-validator');
const controller = require('../controllers/places.controller');

router.get('/:pid', controller.getPlaceById);

router.get('/user/:uid', controller.getPlacesByUserId);

router.post('/', [check('title').notEmpty(), check('description').isLength({ min: 5 }), check('address').notEmpty()], controller.createPlace)

router.patch('/:pid', [check('title').notEmpty(), check('description').isLength({ min: 5 })], controller.updatePlaceById);

router.delete('/:pid', controller.deletePlaceById);

module.exports = router;