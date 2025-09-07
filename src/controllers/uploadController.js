const { handleUpload, getFileUrl, deleteFile } = require('../utils/upload');
const logger = require('../utils/logger');

// @desc    파일 업로드
// @route   POST /api/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '업로드할 파일을 선택해주세요.'
      });
    }

    const fileUrl = getFileUrl(req, req.file.filename);

    logger.info(`파일 업로드됨: ${req.file.filename} by ${req.user.email}`);

    res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    파일 삭제
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteUploadedFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    deleteFile(filePath);

    logger.info(`파일 삭제됨: ${filename} by ${req.user.email}`);

    res.json({
      success: true,
      message: '파일이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile: [handleUpload, uploadFile],
  deleteUploadedFile
};
