# 클라우드 Node.js 학습 프로젝트

현대적인 클라우드 서비스 개발을 위한 Node.js 학습 프로젝트입니다. Express.js, MongoDB, JWT 인증, 파일 업로드 등 실무에서 자주 사용되는 기술들을 포함하고 있습니다.

주요 기능

- **사용자 인증**: JWT 기반 회원가입/로그인 시스템
- **RESTful API**: 완전한 CRUD 작업을 지원하는 API
- **데이터베이스**: MongoDB와 Mongoose ODM 사용
- **파일 업로드**: 이미지 파일 업로드 및 관리
- **보안**: Helmet, CORS, Rate Limiting 등 보안 기능
- **로깅**: Winston을 사용한 구조화된 로깅
- **검증**: Joi를 사용한 입력 데이터 검증
- **에러 처리**: 중앙화된 에러 처리 시스템

요구사항

- Node.js 18.0.0 이상
- MongoDB (로컬 또는 MongoDB Atlas)
- npm 또는 yarn

설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
npm install

# 또는 yarn 사용시
yarn install
```

### 2. 환경 변수 설정

```bash
# env.example 파일을 .env로 복사
cp env.example .env
```

`.env` 파일을 편집하여 필요한 환경 변수를 설정하세요:

```env
# 서버 설정
PORT=3000
NODE_ENV=development

# 데이터베이스 설정
MONGODB_URI=mongodb://localhost:27017/cloud-learning

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
```

### 3. MongoDB 설정

#### 로컬 MongoDB 사용
```bash
# MongoDB 설치 후 실행
mongod
```

#### MongoDB Atlas 사용
1. [MongoDB Atlas](https://www.mongodb.com/atlas)에서 계정 생성
2. 클러스터 생성 후 연결 문자열을 `.env` 파일에 설정

### 4. 서버 실행

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버가 성공적으로 실행되면 `http://localhost:3000`에서 API에 접근할 수 있습니다.

API 문서

### 인증 (Authentication)

#### 회원가입
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "password123"
}
```

#### 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "hong@example.com",
  "password": "password123"
}
```

#### 현재 사용자 정보 조회
```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

### 사용자 관리 (Users)

#### 모든 사용자 조회 (관리자만)
```http
GET /api/users
Authorization: Bearer <JWT_TOKEN>
```

#### 특정 사용자 조회
```http
GET /api/users/:id
Authorization: Bearer <JWT_TOKEN>
```

#### 사용자 정보 수정
```http
PUT /api/users/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "새로운 이름",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 게시글 관리 (Posts)

#### 모든 게시글 조회
```http
GET /api/posts?page=1&limit=10&search=검색어&tag=태그명
```

#### 특정 게시글 조회
```http
GET /api/posts/:id
```

#### 게시글 생성
```http
POST /api/posts
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "tags": ["태그1", "태그2"],
  "isPublished": true
}
```

#### 게시글 수정
```http
PUT /api/posts/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "수정된 제목",
  "content": "수정된 내용"
}
```

#### 게시글 삭제
```http
DELETE /api/posts/:id
Authorization: Bearer <JWT_TOKEN>
```

#### 게시글 좋아요
```http
POST /api/posts/:id/like
Authorization: Bearer <JWT_TOKEN>
```

#### 댓글 추가
```http
POST /api/posts/:id/comments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "댓글 내용"
}
```

### 파일 업로드 (Upload)

#### 파일 업로드
```http
POST /api/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

image: <파일>
```

#### 파일 삭제
```http
DELETE /api/upload/:filename
Authorization: Bearer <JWT_TOKEN>
```

프로젝트 구조

```
src/
├── app.js                 # 메인 애플리케이션 파일
├── config/
│   └── database.js        # 데이터베이스 연결 설정
├── controllers/           # 컨트롤러 (비즈니스 로직)
│   ├── authController.js
│   ├── userController.js
│   ├── postController.js
│   └── uploadController.js
├── middleware/            # 미들웨어
│   ├── auth.js           # 인증 미들웨어
│   └── errorHandler.js   # 에러 처리 미들웨어
├── models/               # 데이터베이스 모델
│   ├── User.js
│   └── Post.js
├── routes/               # 라우트 정의
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   └── upload.js
└── utils/                # 유틸리티 함수
    ├── logger.js         # 로깅 설정
    ├── upload.js         # 파일 업로드 설정
    └── validation.js     # 데이터 검증
```

개발 도구

### 사용 가능한 스크립트

```bash
# 개발 서버 실행 (nodemon)
npm run dev

# 프로덕션 서버 실행
npm start

# 테스트 실행
npm test

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format
```

### 주요 패키지

- **express**: 웹 프레임워크
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT 토큰 처리
- **bcryptjs**: 비밀번호 암호화
- **multer**: 파일 업로드 처리
- **winston**: 로깅
- **joi**: 데이터 검증
- **helmet**: 보안 헤더 설정
- **cors**: CORS 설정
- **express-rate-limit**: 요청 제한

클라우드 배포

### Heroku 배포

1. Heroku CLI 설치
2. Heroku 앱 생성
3. 환경 변수 설정
4. 배포

```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### AWS EC2 배포

1. EC2 인스턴스 생성
2. Node.js 및 MongoDB 설치
3. PM2를 사용한 프로세스 관리
4. Nginx를 사용한 리버스 프록시

### Docker 배포

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

학습 포인트

1. **Node.js 기초**: 비동기 프로그래밍, 이벤트 루프
2. **Express.js**: 미들웨어, 라우팅, 에러 처리
3. **MongoDB**: NoSQL 데이터베이스, Mongoose ODM
4. **인증 시스템**: JWT, 비밀번호 암호화
5. **API 설계**: RESTful API 설계 원칙
6. **보안**: CORS, Rate Limiting, 입력 검증
7. **파일 처리**: 파일 업로드, 정적 파일 서빙
8. **로깅**: 구조화된 로깅 시스템
9. **에러 처리**: 중앙화된 에러 처리
10. **클라우드 배포**: Heroku, AWS, Docker
