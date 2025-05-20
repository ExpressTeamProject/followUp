import { Major, SocialLinks } from '@/models/User';

export interface ResApi {
  success: boolean;
}

export interface ResApiWithData<T> extends ResApi {
  data: T;
}

export interface ResApiWithPagination<T, F> extends ResApi {
  data: T;
  count: number;
  pagination: ResPagination;
  filters: F;
}

export interface ResPagination {
  totalPages: number;
  currentPage: number;
  totalResults: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ResAttachment {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  id: string;
}

export interface ResAuthor {
  _id: string;
  username: string;
  nickname: string;
  profileImage: string;
}

export interface ResAuthUser {
  email: string;
  id: string;
  nickname: string;
  role: 'user' | 'admin';
  username: string;
}

export interface ResUserInfo {
  _id: string;
  __v: number;
  username: string;
  email: string;
  nickname: string;
  major: Major;
  profileImage: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  savedItems: {
    articles: string[];
    posts: string[];
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  bio?: string;
  website?: string;
  socialLinks?: SocialLinks;
}

export interface ResComment {
  id: string;
  content: string;
  author: ResAuthor;
  post: string;
  parent: string;
  likes: string[];
  isAIGenerated: boolean;
  isDeleted: boolean;
  attachments: ResAttachment[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  replies: ResReply[];
  _id: string;
  __v: number;
}

export type ResReply = Omit<ResComment, 'replies'>;

export type UserRole = 'user' | 'admin';
