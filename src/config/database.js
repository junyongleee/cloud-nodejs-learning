const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB 연결됨: ${conn.connection.host}`);
    
    // 연결 이벤트 리스너
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB 연결 오류:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB 연결이 끊어졌습니다.');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB 연결이 종료되었습니다.');
      process.exit(0);
    });

  } catch (error) {
    logger.error('데이터베이스 연결 실패:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
