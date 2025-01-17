const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerValidator), AuthController.register);
router.post('/login', validate(loginValidator), AuthController.login);
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;
