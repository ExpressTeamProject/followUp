const User = require('../models/User');
const crypto = require('crypto');
const { asyncHandler } = require('../middleware/errorHandler');
const fs = require('fs').promises;
const path = require('path');

// @desc    사용자 등록
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, nickname } = req.body;

  // 사용자 생성
  const user = await User.create({
    username,
    email,
    password,
    nickname
  });

  // 토큰 생성 및 응답
  sendTokenResponse(user, 201, res);
});

// @desc    사용자 로그인
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 이메일과 비밀번호 확인
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: '이메일과 비밀번호를 입력해주세요'
    });
  }

  // 사용자 조회 (비밀번호 포함)
  const user = await User.findOne({ email }).select('+password');

  // 사용자가 존재하지 않는 경우
  if (!user) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 인증 정보입니다'
    });
  }

  // 비밀번호 확인
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 인증 정보입니다'
    });
  }

  // 토큰 생성 및 응답
  sendTokenResponse(user, 200, res);
});

// @desc    사용자 로그아웃
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // 쿠키 삭제
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: '로그아웃 되었습니다'
  });
});

// @desc    현재 로그인한 사용자 정보
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    사용자 정보 업데이트
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res) => {
  const { nickname, email, bio, major, website, socialLinks } = req.body;

  const fieldsToUpdate = {
    nickname,
    email,
  };

  // 선택적 필드 추가
  if (bio !== undefined) fieldsToUpdate.bio = bio;
  if (major !== undefined) fieldsToUpdate.major = major;
  if (website !== undefined) fieldsToUpdate.website = website;
  
  // socialLinks 객체가 있는 경우 추가
  if (socialLinks) {
    fieldsToUpdate.socialLinks = {};
    
    if (socialLinks.github !== undefined) {
      fieldsToUpdate.socialLinks.github = socialLinks.github;
    }
    
    if (socialLinks.twitter !== undefined) {
      fieldsToUpdate.socialLinks.twitter = socialLinks.twitter;
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    프로필 이미지 업로드
// @route   PUT /api/auth/profile-image
// @access  Private
exports.updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '이미지를 업로드해주세요'
    });
  }

  // 이전 프로필 이미지 경로
  const user = await User.findById(req.user.id);
  const previousImage = user.profileImage;
  
  // 기본 이미지가 아니라면 이전 이미지 삭제 시도
  if (previousImage && previousImage !== 'default-profile.jpg' && !previousImage.includes('default')) {
    try {
      const imagePath = path.join(__dirname, '..', previousImage.replace(/^\//, ''));
      await fs.access(imagePath);  // 파일 존재 여부 확인
      await fs.unlink(imagePath);  // 파일 삭제
      console.log(`이전 프로필 이미지 삭제: ${imagePath}`);
    } catch (error) {
      console.error('이전 프로필 이미지 삭제 실패:', error.message);
      // 파일 삭제 실패해도 계속 진행
    }
  }

  // 새 이미지 URL 생성
  const imageUrl = `/uploads/profile-images/${req.file.filename}`;
  
  // 사용자 정보 업데이트
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: imageUrl },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

// @desc    비밀번호 업데이트
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // 새 비밀번호와 비밀번호 확인이 일치하는지 확인
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다'
    });
  }

  // 새 비밀번호 설정
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    비밀번호 찾기
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: '해당 이메일로 등록된 사용자가 없습니다'
    });
  }

  // 비밀번호 재설정 토큰 생성
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 해시된 토큰 저장
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // 토큰 만료시간 설정 (1시간)
  user.resetPasswordExpire = Date.now() + 3600000;

  await user.save({ validateBeforeSave: false });

  // 이메일 전송 기능이 구현되기 전에는 토큰을 응답으로 반환
  res.status(200).json({
    success: true,
    resetToken
  });
});

// @desc    비밀번호 재설정
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // 토큰 해싱
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  // 유효한 토큰을 가진 사용자 찾기
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: '유효하지 않은 토큰입니다'
    });
  }

  // 새 비밀번호 설정
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});


// @desc    액세스 토큰 리프레시
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = asyncHandler(async (req, res) => {
  try {
    // 쿠키 또는 요청 본문에서 리프레시 토큰 가져오기
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: '리프레시 토큰이 제공되지 않았습니다'
      });
    }

    // 리프레시 토큰 검증
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 해당 사용자 찾기
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다'
      });
    }

    // 새 액세스 토큰 생성 및 응답
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('토큰 리프레시 오류:', error);
    
    return res.status(401).json({
      success: false,
      message: '유효하지 않은 리프레시 토큰입니다'
    });
  }
});

// 토큰 생성 및 쿠키 설정 헬퍼 함수
const sendTokenResponse = (user, statusCode, res) => {
  // 토큰 생성
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  // HTTPS인 경우에만 secure 옵션 설정
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // 필요한 사용자 정보만 응답에 포함
  const userData = {
    id: user._id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    role: user.role
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userData
    });
};