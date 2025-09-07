const express = require('express');
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 공개 라우트
router.post('/register', register);
router.post('/login', login);

// 보호된 라우트
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

module.exports = router;
