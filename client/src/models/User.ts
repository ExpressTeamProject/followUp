export type Major =
  | '수학'
  | '물리학'
  | '화학'
  | '생물학'
  | '컴퓨터공학'
  | '전자공학'
  | '기계공학'
  | '경영학'
  | '경제학'
  | '심리학'
  | '사회학'
  | '기타';

export type Role = 'user' | 'admin';

export interface SocialLinks {
  github?: string;
  twitter?: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
  nickname: string;
  profileImage: string;
  bio?: string;
  major: Major;
  website?: string;
  socialLinks?: SocialLinks;
  role: Role;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

