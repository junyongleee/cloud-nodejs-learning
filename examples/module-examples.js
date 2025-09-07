// Node.js 모듈 시스템 예제

// 1. CommonJS 모듈 내보내기 (module.exports)
const mathUtils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : null
};

// 개별 함수 내보내기
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR');
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 여러 방식으로 내보내기
module.exports = mathUtils; // 기본 내보내기
module.exports.formatDate = formatDate; // 추가 내보내기
module.exports.generateId = generateId;

// 또는 객체로 한번에 내보내기
module.exports = {
  ...mathUtils,
  formatDate,
  generateId
};

// 2. ES6 모듈 (import/export) - package.json에 "type": "module" 필요
/*
export const mathUtils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

export default mathUtils;
*/

// 3. 모듈 가져오기 (require)
const express = require('express'); // npm 패키지
const path = require('path'); // Node.js 내장 모듈
const fs = require('fs'); // Node.js 내장 모듈

// 상대 경로로 로컬 모듈 가져오기
const authController = require('./controllers/authController');
const userModel = require('./models/User');

// 4. 동적 모듈 로딩
const loadModule = async (moduleName) => {
  try {
    const module = await import(`./modules/${moduleName}.js`);
    return module;
  } catch (error) {
    console.error(`모듈 로드 실패: ${moduleName}`, error);
  }
};

// 5. 모듈 캐싱
// Node.js는 require()로 로드된 모듈을 캐시합니다
// 같은 모듈을 여러 번 require()해도 한 번만 실행됩니다

let moduleLoadCount = 0;
module.exports = {
  getLoadCount: () => moduleLoadCount++,
  resetCount: () => { moduleLoadCount = 0; }
};

// 6. 모듈 경로 해석
/*
Node.js가 모듈을 찾는 순서:
1. 현재 디렉토리의 node_modules
2. 상위 디렉토리의 node_modules (재귀적으로)
3. 전역 node_modules
4. Node.js 내장 모듈
*/

// 7. package.json의 main 필드
// require('package-name') 시 어떤 파일을 로드할지 지정

module.exports = {
  mathUtils,
  formatDate,
  generateId,
  loadModule
};
