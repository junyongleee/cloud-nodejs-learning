const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요.'],
    trim: true,
    maxlength: [100, '제목은 100자를 초과할 수 없습니다.']
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요.'],
    maxlength: [5000, '내용은 5000자를 초과할 수 없습니다.']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, '댓글은 500자를 초과할 수 없습니다.']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 인덱스 설정 (검색 성능 향상)
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });

// 가상 필드: 좋아요 수
PostSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// 가상 필드: 댓글 수
PostSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// JSON 변환 시 가상 필드 포함
PostSchema.set('toJSON', { virtuals: true });

// 게시글 조회 시 조인된 사용자 정보 포함
PostSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'name email avatar'
  }).populate({
    path: 'comments.user',
    select: 'name avatar'
  });
  next();
});

module.exports = mongoose.model('Post', PostSchema);
