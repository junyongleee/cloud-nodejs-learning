const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 공개 라우트
router.get('/', getPosts);
router.get('/:id', getPost);

// 보호된 라우트
router.use(protect);

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.delete('/:id/like', unlikePost);
router.post('/:id/comments', addComment);

module.exports = router;
