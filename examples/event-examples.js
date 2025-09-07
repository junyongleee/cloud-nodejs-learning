// Node.js 이벤트 기반 프로그래밍 예제

const EventEmitter = require('events');

// 1. 커스텀 이벤트 에미터 클래스
class UserService extends EventEmitter {
  constructor() {
    super();
  }

  async createUser(userData) {
    try {
      // 사용자 생성 로직
      const user = await User.create(userData);
      
      // 이벤트 발생
      this.emit('userCreated', user);
      this.emit('userRegistered', { userId: user.id, email: user.email });
      
      return user;
    } catch (error) {
      this.emit('userCreationFailed', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await User.findByIdAndDelete(userId);
      this.emit('userDeleted', { userId });
    } catch (error) {
      this.emit('userDeletionFailed', error);
    }
  }
}

// 2. 이벤트 리스너 등록
const userService = new UserService();

// 사용자 생성 이벤트 리스너
userService.on('userCreated', (user) => {
  console.log(`새 사용자 생성됨: ${user.name} (${user.email})`);
  // 이메일 발송, 로그 기록 등
});

userService.on('userRegistered', (data) => {
  console.log(`사용자 등록 완료: ${data.email}`);
  // 환영 이메일 발송
});

userService.on('userDeleted', (data) => {
  console.log(`사용자 삭제됨: ${data.userId}`);
  // 관련 데이터 정리
});

// 3. Express.js에서 이벤트 사용
const express = require('express');
const app = express();

// 요청 이벤트 리스너
app.use((req, res, next) => {
  // 요청 시작 이벤트
  req.startTime = Date.now();
  
  res.on('finish', () => {
    // 응답 완료 이벤트
    const duration = Date.now() - req.startTime;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// 4. 파일 시스템 이벤트
const fs = require('fs');
const path = require('path');

// 파일 변경 감지
fs.watchFile('config.json', (curr, prev) => {
  console.log('설정 파일이 변경되었습니다!');
  // 설정 다시 로드
});

// 5. 프로세스 이벤트
process.on('SIGINT', () => {
  console.log('서버 종료 중...');
  // 정리 작업
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('처리되지 않은 예외:', error);
  // 로그 기록 후 종료
  process.exit(1);
});

module.exports = { UserService, userService };
