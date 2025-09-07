// Node.js 내장 모듈 예제

// 1. 파일 시스템 (fs)
const fs = require('fs');
const fsPromises = require('fs').promises;

// 동기적 파일 읽기
try {
  const data = fs.readFileSync('package.json', 'utf8');
  console.log('package.json 내용:', data);
} catch (error) {
  console.error('파일 읽기 실패:', error);
}

// 비동기적 파일 읽기 (콜백)
fs.readFile('package.json', 'utf8', (err, data) => {
  if (err) {
    console.error('파일 읽기 실패:', err);
    return;
  }
  console.log('비동기 파일 읽기 완료');
});

// Promise 기반 파일 읽기
const readFileAsync = async () => {
  try {
    const data = await fsPromises.readFile('package.json', 'utf8');
    console.log('Promise 기반 파일 읽기 완료');
  } catch (error) {
    console.error('파일 읽기 실패:', error);
  }
};

// 2. 경로 처리 (path)
const path = require('path');

const filePath = '/users/john/documents/file.txt';
console.log('파일명:', path.basename(filePath)); // file.txt
console.log('디렉토리:', path.dirname(filePath)); // /users/john/documents
console.log('확장자:', path.extname(filePath)); // .txt
console.log('절대 경로:', path.resolve('./src/app.js')); // 현재 디렉토리 기준 절대 경로

// 경로 조합
const fullPath = path.join(__dirname, 'src', 'controllers', 'authController.js');
console.log('조합된 경로:', fullPath);

// 3. URL 처리 (url)
const url = require('url');

const urlString = 'https://example.com:8080/path?query=value#hash';
const parsedUrl = url.parse(urlString, true);
console.log('호스트:', parsedUrl.host); // example.com:8080
console.log('경로:', parsedUrl.pathname); // /path
console.log('쿼리:', parsedUrl.query); // { query: 'value' }

// 4. 쿼리 문자열 (querystring)
const querystring = require('querystring');

const query = { name: '홍길동', age: 30, city: '서울' };
const queryString = querystring.stringify(query);
console.log('쿼리 문자열:', queryString); // name=홍길동&age=30&city=서울

const parsedQuery = querystring.parse(queryString);
console.log('파싱된 쿼리:', parsedQuery);

// 5. 암호화 (crypto)
const crypto = require('crypto');

// 해시 생성
const password = 'mypassword123';
const hash = crypto.createHash('sha256').update(password).digest('hex');
console.log('SHA256 해시:', hash);

// 랜덤 바이트 생성
const randomBytes = crypto.randomBytes(16);
console.log('랜덤 바이트:', randomBytes.toString('hex'));

// 6. 운영체제 정보 (os)
const os = require('os');

console.log('운영체제:', os.platform()); // win32, darwin, linux
console.log('아키텍처:', os.arch()); // x64, arm64
console.log('CPU 코어 수:', os.cpus().length);
console.log('총 메모리:', Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB');
console.log('사용 가능한 메모리:', Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB');

// 7. 프로세스 정보 (process)
console.log('Node.js 버전:', process.version);
console.log('플랫폼:', process.platform);
console.log('현재 작업 디렉토리:', process.cwd());
console.log('환경 변수 NODE_ENV:', process.env.NODE_ENV);

// 명령행 인수
console.log('명령행 인수:', process.argv);

// 8. 스트림 (stream)
const { Readable, Writable, Transform } = require('stream');

// 읽기 스트림
const readable = new Readable({
  read() {
    this.push('Hello ');
    this.push('World!');
    this.push(null); // 스트림 종료
  }
});

// 쓰기 스트림
const writable = new Writable({
  write(chunk, encoding, callback) {
    console.log('받은 데이터:', chunk.toString());
    callback();
  }
});

// 변환 스트림
const transform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

// 스트림 연결
readable.pipe(transform).pipe(writable);

module.exports = {
  readFileAsync,
  fullPath,
  parsedUrl,
  queryString,
  hash,
  randomBytes
};
