import { Comment } from './Comment';
import { User } from './User';

export type Category =
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

export interface Attachment {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  uploadDate: Date;
  id: string;
}

export interface Problem {
  id: string;
  title: string;
  content: string;
  author: User;
  categories: Category[];
  tags: string[]; // 최대 5개
  attachments: Attachment[];
  viewCount: number;
  likes: User[];
  comments: Comment[];
  isSolved: boolean;
  aiResponse: string | null;
  aiResponseCreatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  commentCount: number;
}
