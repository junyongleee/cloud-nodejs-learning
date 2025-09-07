const Post = require('../models/Post');
const logger = require('../utils/logger');

// @desc    모든 게시글 조회
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search, tag } = req.query;

    // 검색 조건 구성
    let query = { isPublished: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    const posts = await Post.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    특정 게시글 조회
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 조회수 증가
    post.viewCount += 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    새 게시글 생성
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, image, isPublished } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      tags: tags || [],
      image: image || '',
      isPublished: isPublished || false
    });

    logger.info(`새 게시글 생성: ${title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: '게시글이 생성되었습니다.',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    게시글 업데이트
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { title, content, tags, image, isPublished } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 작성자 또는 관리자만 수정 가능
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, image, isPublished },
      { new: true, runValidators: true }
    );

    logger.info(`게시글 업데이트: ${title} by ${req.user.email}`);

    res.json({
      success: true,
      message: '게시글이 업데이트되었습니다.',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    게시글 삭제
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 작성자 또는 관리자만 삭제 가능
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '권한이 없습니다.'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    logger.info(`게시글 삭제: ${post.title} by ${req.user.email}`);

    res.json({
      success: true,
      message: '게시글이 삭제되었습니다.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    게시글 좋아요
// @route   POST /api/posts/:id/like
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 이미 좋아요한 경우
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: '이미 좋아요를 누른 게시글입니다.'
      });
    }

    post.likes.push(req.user.id);
    await post.save();

    res.json({
      success: true,
      message: '좋아요가 추가되었습니다.',
      likeCount: post.likes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    게시글 좋아요 취소
// @route   DELETE /api/posts/:id/like
// @access  Private
const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 좋아요하지 않은 경우
    if (!post.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: '좋아요를 누르지 않은 게시글입니다.'
      });
    }

    post.likes = post.likes.filter(
      like => like.toString() !== req.user.id
    );
    await post.save();

    res.json({
      success: true,
      message: '좋아요가 취소되었습니다.',
      likeCount: post.likes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    댓글 추가
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    post.comments.push({
      user: req.user.id,
      content
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: '댓글이 추가되었습니다.',
      data: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment
};
