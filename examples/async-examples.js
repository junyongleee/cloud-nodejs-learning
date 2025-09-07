// Node.js 비동기 프로그래밍 예제

// 1. Promise 기반 비동기 함수
const fetchUserData = async (userId) => {
  try {
    // 데이터베이스에서 사용자 조회 (비동기)
    const user = await User.findById(userId);
    
    // 다른 API 호출 (비동기)
    const posts = await Post.find({ author: userId });
    
    return { user, posts };
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
};

// 2. 병렬 처리 (Promise.all)
const getDashboardData = async (userId) => {
  try {
    // 여러 비동기 작업을 동시에 실행
    const [user, posts, comments] = await Promise.all([
      User.findById(userId),
      Post.find({ author: userId }),
      Comment.find({ user: userId })
    ]);
    
    return { user, posts, comments };
  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error);
  }
};

// 3. 콜백 기반 (레거시)
const fs = require('fs');

// 콜백 지옥 예제
fs.readFile('file1.txt', 'utf8', (err, data1) => {
  if (err) throw err;
  fs.readFile('file2.txt', 'utf8', (err, data2) => {
    if (err) throw err;
    fs.readFile('file3.txt', 'utf8', (err, data3) => {
      if (err) throw err;
      console.log(data1 + data2 + data3);
    });
  });
});

// Promise로 개선
const readFiles = async () => {
  try {
    const [data1, data2, data3] = await Promise.all([
      fs.promises.readFile('file1.txt', 'utf8'),
      fs.promises.readFile('file2.txt', 'utf8'),
      fs.promises.readFile('file3.txt', 'utf8')
    ]);
    console.log(data1 + data2 + data3);
  } catch (error) {
    console.error('파일 읽기 실패:', error);
  }
};

module.exports = { fetchUserData, getDashboardData, readFiles };
