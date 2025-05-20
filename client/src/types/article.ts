import { ResAttachment } from './common';

export interface ResArticle {
  id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    nickname: string;
    profileImage: string;
  };
  category: string;
  tags: string[];
  attachments: ResAttachment[];
  viewCount: number;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  _id: string;
}

export interface ResPopularTag {
  tag: string;
  count: number;
}
