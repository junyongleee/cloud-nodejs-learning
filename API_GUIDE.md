# API 사용 가이드

이 문서는 클라우드 Node.js 학습 프로젝트의 API 사용법을 자세히 설명합니다.

## 🔐 인증

대부분의 API 엔드포인트는 JWT 토큰을 통한 인증이 필요합니다. 인증이 필요한 요청에는 다음 헤더를 포함해야 합니다:

```
Authorization: Bearer <JWT_TOKEN>
```

## 📋 API 엔드포인트 목록

### 1. 인증 (Authentication)

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

**응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "user"
  }
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

**응답:**
```json
{
  "success": true,
  "message": "로그인되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "user",
    "lastLogin": "2023-09-07T04:30:00.000Z"
  }
}
```

#### 현재 사용자 정보 조회
```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

**응답:**
```json
{
  "success": true,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "홍길동",
    "email": "hong@example.com",
    "role": "user",
    "avatar": "",
    "isActive": true,
    "createdAt": "2023-09-07T04:25:00.000Z",
    "updatedAt": "2023-09-07T04:30:00.000Z"
  }
}
```

#### 비밀번호 변경
```http
PUT /api/auth/password
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 2. 사용자 관리 (Users)

#### 모든 사용자 조회 (관리자만)
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)

**응답:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "홍길동",
      "email": "hong@example.com",
      "role": "user",
      "avatar": "",
      "isActive": true,
      "createdAt": "2023-09-07T04:25:00.000Z"
    }
  ]
}
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

#### 사용자 통계 조회 (관리자만)
```http
GET /api/users/stats
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**응답:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "newUsersThisMonth": 5,
    "adminUsers": 2,
    "regularUsers": 23
  }
}
```

### 3. 게시글 관리 (Posts)

#### 모든 게시글 조회
```http
GET /api/posts?page=1&limit=10&search=검색어&tag=태그명
```

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `search`: 제목 또는 내용에서 검색할 키워드
- `tag`: 특정 태그로 필터링

**응답:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "게시글 제목",
      "content": "게시글 내용",
      "author": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "홍길동",
        "email": "hong@example.com",
        "avatar": ""
      },
      "tags": ["태그1", "태그2"],
      "image": "https://example.com/image.jpg",
      "likes": ["64f8a1b2c3d4e5f6a7b8c9d0"],
      "comments": [],
      "isPublished": true,
      "viewCount": 15,
      "likeCount": 1,
      "commentCount": 0,
      "createdAt": "2023-09-07T04:25:00.000Z",
      "updatedAt": "2023-09-07T04:25:00.000Z"
    }
  ]
}
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
  "title": "새로운 게시글",
  "content": "게시글 내용입니다.",
  "tags": ["Node.js", "Express"],
  "image": "https://example.com/image.jpg",
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
  "content": "수정된 내용",
  "tags": ["수정된", "태그"],
  "isPublished": false
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

**응답:**
```json
{
  "success": true,
  "message": "좋아요가 추가되었습니다.",
  "likeCount": 5
}
```

#### 게시글 좋아요 취소
```http
DELETE /api/posts/:id/like
Authorization: Bearer <JWT_TOKEN>
```

#### 댓글 추가
```http
POST /api/posts/:id/comments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "content": "댓글 내용입니다."
}
```

**응답:**
```json
{
  "success": true,
  "message": "댓글이 추가되었습니다.",
  "data": {
    "user": "64f8a1b2c3d4e5f6a7b8c9d0",
    "content": "댓글 내용입니다.",
    "createdAt": "2023-09-07T04:30:00.000Z"
  }
}
```

### 4. 파일 업로드 (Upload)

#### 파일 업로드
```http
POST /api/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

image: <파일>
```

**응답:**
```json
{
  "success": true,
  "message": "파일이 성공적으로 업로드되었습니다.",
  "data": {
    "filename": "image-1694062200000-123456789.jpg",
    "originalName": "profile.jpg",
    "size": 1024000,
    "url": "http://localhost:3000/uploads/image-1694062200000-123456789.jpg"
  }
}
```

#### 파일 삭제
```http
DELETE /api/upload/:filename
Authorization: Bearer <JWT_TOKEN>
```

## 🚨 에러 응답

API는 다음과 같은 에러 응답 형식을 사용합니다:

```json
{
  "success": false,
  "message": "에러 메시지",
  "stack": "에러 스택 (개발 환경에서만)"
}
```

### 일반적인 HTTP 상태 코드

- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `403`: 권한 없음
- `404`: 리소스 없음
- `429`: 요청 제한 초과
- `500`: 서버 오류

## 🔒 보안 고려사항

1. **Rate Limiting**: API 요청은 15분당 100회로 제한됩니다.
2. **CORS**: 허용된 도메인에서만 API에 접근할 수 있습니다.
3. **Helmet**: 보안 헤더가 자동으로 설정됩니다.
4. **입력 검증**: 모든 입력 데이터는 Joi를 통해 검증됩니다.
5. **비밀번호 암호화**: bcrypt를 사용하여 비밀번호가 암호화됩니다.

## 📝 사용 예시

### JavaScript (Fetch API)

```javascript
// 로그인
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data;
};

// 게시글 생성
const createPost = async (postData, token) => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  
  const data = await response.json();
  return data;
};
```

### cURL 예시

```bash
# 로그인
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hong@example.com","password":"password123"}'

# 게시글 조회
curl -X GET http://localhost:3000/api/posts

# 게시글 생성
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"제목","content":"내용","isPublished":true}'
```

## 🧪 테스트

API 테스트를 위해 Postman 컬렉션을 사용하거나, 위의 예시들을 참고하여 직접 테스트해보세요.

---

이 가이드가 API 사용에 도움이 되기를 바랍니다. 추가 질문이 있으시면 이슈를 생성해주세요.
