const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// register
router.post('/register', register);

//  login
router.post('/login', login);

// auth/me
router.get('/me', auth, getMe);

module.exports = router;
