const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    모든 사용자 조회
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    특정 사용자 조회
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    사용자 정보 업데이트
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.params.id;

    // 본인 또는 관리자만 수정 가능
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    logger.info(`사용자 정보 업데이트: ${user.email}`);

    res.json({
      success: true,
      message: '사용자 정보가 업데이트되었습니다.',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    사용자 삭제 (비활성화)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // 본인은 삭제할 수 없음
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: '본인 계정은 삭제할 수 없습니다.'
      });
    }

    // 사용자 비활성화
    user.isActive = false;
    await user.save();

    logger.info(`사용자 비활성화: ${user.email}`);

    res.json({
      success: true,
      message: '사용자가 비활성화되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    사용자 통계 조회
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      isActive: true,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const adminUsers = await User.countDocuments({ 
      isActive: true, 
      role: 'admin' 
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth,
        adminUsers,
        regularUsers: totalUsers - adminUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
};
