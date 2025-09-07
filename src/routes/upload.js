const express = require('express');
const { uploadFile, deleteUploadedFile } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 모든 라우트는 인증 필요
router.use(protect);

router.post('/', uploadFile);
router.delete('/:filename', deleteUploadedFile);

module.exports = router;
