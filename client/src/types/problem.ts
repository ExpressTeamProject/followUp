import { ResAttachment } from './common';

export interface ResProblem {
  id: string;
  title: string;
  content: string;
  author: string;
  categories: string[];
  tags: string[];
  attachments: ResAttachment[];
  imageUrl: string;
  viewCount: number;
  likes: string[];
  likeCount: number;
  comments: string[];
  isSolved: boolean;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  aiResponse: string;
  aiResponseCreatedAt: string;
}
