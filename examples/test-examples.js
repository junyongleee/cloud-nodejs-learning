// Node.js 테스트용 예제들

const express = require('express');
const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

// 1. 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Node.js 테스트 서버입니다!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
});

// 2. 비동기 처리 예제
app.get('/async-test', async (req, res) => {
  try {
    // 가상의 비동기 작업들
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    console.log('작업 1 시작');
    await delay(1000); // 1초 대기
    console.log('작업 1 완료');
    
    console.log('작업 2 시작');
    await delay(500); // 0.5초 대기
    console.log('작업 2 완료');
    
    res.json({
      message: '모든 비동기 작업 완료!',
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Promise.all 예제
app.get('/parallel-test', async (req, res) => {
  try {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // 병렬로 실행되는 작업들
    const [result1, result2, result3] = await Promise.all([
      delay(1000).then(() => '작업 1 완료'),
      delay(800).then(() => '작업 2 완료'),
      delay(600).then(() => '작업 3 완료')
    ]);
    
    res.json({
      message: '병렬 작업 완료!',
      results: [result1, result2, result3],
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. 파일 시스템 테스트
app.get('/file-test', async (req, res) => {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // 현재 디렉토리의 파일 목록
    const files = await fs.readdir(__dirname);
    
    // package.json 읽기
    const packageJson = await fs.readFile('package.json', 'utf8');
    const packageData = JSON.parse(packageJson);
    
    res.json({
      message: '파일 시스템 테스트 완료!',
      currentDirectory: __dirname,
      files: files,
      packageName: packageData.name,
      packageVersion: packageData.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. 환경 변수 테스트
app.get('/env-test', (req, res) => {
  res.json({
    message: '환경 변수 테스트',
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT,
    mongodbUri: process.env.MONGODB_URI ? '설정됨' : '설정되지 않음',
    jwtSecret: process.env.JWT_SECRET ? '설정됨' : '설정되지 않음',
    allEnvVars: Object.keys(process.env).length
  });
});

// 6. 에러 처리 테스트
app.get('/error-test', (req, res) => {
  const { type } = req.query;
  
  switch (type) {
    case 'sync':
      throw new Error('동기 에러 테스트');
    case 'async':
      setTimeout(() => {
        throw new Error('비동기 에러 테스트');
      }, 100);
      res.json({ message: '비동기 에러가 곧 발생합니다...' });
      break;
    default:
      res.json({
        message: '에러 테스트',
        usage: '?type=sync 또는 ?type=async'
      });
  }
});

// 7. 스트림 테스트
app.get('/stream-test', (req, res) => {
  const { Readable } = require('stream');
  
  const stream = new Readable({
    read() {
      for (let i = 1; i <= 5; i++) {
        this.push(`데이터 청크 ${i}\n`);
      }
      this.push(null); // 스트림 종료
    }
  });
  
  res.setHeader('Content-Type', 'text/plain');
  stream.pipe(res);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('에러 발생:', err);
  res.status(500).json({
    error: '서버 내부 오류',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    error: '요청한 리소스를 찾을 수 없습니다',
    path: req.originalUrl,
    method: req.method
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`테스트 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`테스트 URL: http://localhost:${PORT}`);
});

module.exports = app;
