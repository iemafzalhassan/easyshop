const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validator.middleware');
const {
  registerValidator,
  loginValidator,
  changePasswordValidator
} = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidator), AuthController.register);
router.post('/login', validate(loginValidator), AuthController.login);

// Protected routes
router.get('/check', auth, (req, res) => {
  res.status(200).json({ status: 'success', message: 'Authenticated' });
});
router.get('/profile', auth, AuthController.getProfile);
router.put('/profile', auth, AuthController.updateProfile);
router.patch('/change-password', auth, validate(changePasswordValidator), AuthController.changePassword);

module.exports = router;
