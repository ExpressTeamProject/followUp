const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 사용자 인증 확인
exports.protect = async (req, res, next) => {
  let token;

  // 헤더에서 Authorization 토큰 확인
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Bearer 토큰에서 jwt 추출
    token = req.headers.authorization.split(' ')[1];
  }
  // 쿠키에서 토큰 확인 (선택 사항)
  else if (req.cookies.token) {
     token = req.cookies.token;
  }

  // 토큰이 없으면 접근 거부
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '이 리소스에 접근하려면 로그인이 필요합니다',
    });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 사용자 정보를 요청 객체에 추가
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '이 토큰에 해당하는 사용자를 찾을 수 없습니다',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: '인증에 실패했습니다',
    });
  }
};

// 권한 검사 (관리자, 소유자 등)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '인증이 필요합니다',
      });
    }

    // 권한 확인
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '이 리소스에 대한 접근 권한이 없습니다',
      });
    }
    next();
  };
};

// 리소스 소유자 확인
// auth.js의 checkOwnership 미들웨어
exports.checkOwnership = (model) => async (req, res, next) => {
  try {
    console.log(`checkOwnership 시작: 모델=${model.modelName}, ID=${req.params.id}`);
    
    const resource = await model.findById(req.params.id);
    console.log(`리소스 조회 결과: ${resource ? '찾음' : '찾지 못함'}`);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: '리소스를 찾을 수 없습니다',
      });
    }

    console.log(`사용자 역할: ${req.user.role}, 사용자 ID: ${req.user.id}`);
    
    // 관리자는 모든 리소스에 접근 가능
    if (req.user.role === 'admin') {
      console.log('관리자 권한으로 접근 허용');
      req.resource = resource;
      return next();
    }

    // 소유자 확인 (author 또는 user 필드 중 하나로 체크)
    const ownerId = resource.author || resource.user;
    console.log(`리소스 소유자 ID: ${ownerId}, 타입: ${typeof ownerId}`);
    console.log(`사용자 ID: ${req.user.id}, 타입: ${typeof req.user.id}`);
    
    if (!ownerId) {
      console.log('리소스에 소유자 정보가 없음');
      return res.status(400).json({
        success: false,
        message: '리소스에 소유자 정보가 없습니다',
      });
    }
    
    const ownerIdStr = ownerId.toString();
    const userIdStr = req.user.id.toString();
    
    console.log(`소유자 ID 문자열: ${ownerIdStr}`);
    console.log(`사용자 ID 문자열: ${userIdStr}`);
    console.log(`ID 일치 여부: ${ownerIdStr === userIdStr}`);

    if (ownerIdStr !== userIdStr) {
      console.log('권한 없음: 소유자가 아님');
      return res.status(403).json({
        success: false,
        message: '이 리소스에 대한 권한이 없습니다',
      });
    }

    console.log('권한 확인 완료, 다음 미들웨어로 진행');
    // 리소스를 req 객체에 추가해서 다음 미들웨어에서 사용할 수 있게 함
    req.resource = resource;
    next();
  } catch (err) {
    console.error(`checkOwnership 오류: ${err.message}`);
    next(err);
  }
};