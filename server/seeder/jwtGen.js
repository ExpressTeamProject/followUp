const crypto = require('crypto');

// JWT_SECRET 생성 (64바이트 길이의 랜덤 문자열)
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// REFRESH_TOKEN_SECRET 생성
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
console.log('REFRESH_TOKEN_SECRET=' + refreshTokenSecret);