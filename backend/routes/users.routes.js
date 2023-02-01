const router = require('express').Router();
const { check } = require('express-validator');
const controller = require('../controllers/users.controller');

router.get('/', controller.getUsers);

router.post('/signup', [check('name').notEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 6 })], controller.signUp);

router.post('/login', controller.login);

module.exports = router;