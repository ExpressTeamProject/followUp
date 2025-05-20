export interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
}
