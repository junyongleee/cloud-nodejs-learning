const Joi = require('joi');

// 사용자 등록 검증
const registerValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '이름은 최소 2자 이상이어야 합니다.',
      'string.max': '이름은 50자를 초과할 수 없습니다.',
      'any.required': '이름을 입력해주세요.'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '유효한 이메일 주소를 입력해주세요.',
      'any.required': '이메일을 입력해주세요.'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
      'any.required': '비밀번호를 입력해주세요.'
    })
});

// 사용자 로그인 검증
const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '유효한 이메일 주소를 입력해주세요.',
      'any.required': '이메일을 입력해주세요.'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': '비밀번호를 입력해주세요.'
    })
});

// 비밀번호 변경 검증
const passwordChangeValidation = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': '현재 비밀번호를 입력해주세요.'
    }),
  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': '새 비밀번호는 최소 6자 이상이어야 합니다.',
      'any.required': '새 비밀번호를 입력해주세요.'
    })
});

// 게시글 생성/수정 검증
const postValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': '제목을 입력해주세요.',
      'string.max': '제목은 100자를 초과할 수 없습니다.',
      'any.required': '제목을 입력해주세요.'
    }),
  content: Joi.string()
    .min(1)
    .max(5000)
    .required()
    .messages({
      'string.min': '내용을 입력해주세요.',
      'string.max': '내용은 5000자를 초과할 수 없습니다.',
      'any.required': '내용을 입력해주세요.'
    }),
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),
  image: Joi.string()
    .uri()
    .optional()
    .allow(''),
  isPublished: Joi.boolean()
    .optional()
});

// 댓글 검증
const commentValidation = Joi.object({
  content: Joi.string()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.min': '댓글 내용을 입력해주세요.',
      'string.max': '댓글은 500자를 초과할 수 없습니다.',
      'any.required': '댓글 내용을 입력해주세요.'
    })
});

// 검증 미들웨어 생성 함수
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  registerValidation,
  loginValidation,
  passwordChangeValidation,
  postValidation,
  commentValidation,
  validate
};
