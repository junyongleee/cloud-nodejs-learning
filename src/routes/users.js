const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트는 인증 필요
router.use(protect);

// 관리자 전용 라우트
router.get('/stats', authorize('admin'), getUserStats);
router.get('/', authorize('admin'), getUsers);
router.delete('/:id', authorize('admin'), deleteUser);

// 일반 사용자 라우트
router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
