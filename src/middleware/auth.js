const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// JWT 토큰 검증 미들웨어
const protect = async (req, res, next) => {
  let token;

  // 헤더에서 토큰 추출
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 정보 조회
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '토큰에 해당하는 사용자를 찾을 수 없습니다.'
        });
      }

      next();
    } catch (error) {
      logger.error('토큰 검증 오류:', error);
      return res.status(401).json({
        success: false,
        message: '인증에 실패했습니다.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '인증 토큰이 필요합니다.'
    });
  }
};

// 역할 기반 접근 제어
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '이 작업을 수행할 권한이 없습니다.'
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
