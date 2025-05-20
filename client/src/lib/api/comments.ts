import { ResApiWithData } from '@/types/common';
import { ResComment } from '@/types/common';
import { kyInstance } from '../kyInstance';
import { CommunityFilterParams } from '../validations/community';
import { API_PATH_SEGMENTS, API_PATHS } from './api-paths';

export const getCommentsByArticleId = async (articleId: string, params?: CommunityFilterParams) => {
  const searchParams: Record<string, string> = {
    page: params?.page.toString() ?? '1',
    limit: params?.limit.toString() ?? '20',
  };

  const response = await kyInstance.get<ResApiWithData<ResComment[]>>(
    API_PATHS.COMMENTS.BY_ARTICLE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId),
    {
      searchParams,
    },
  );

  return response.json();
};

export const createCommentOnArticle = async (articleId: string, content: string) => {
  const response = await kyInstance.post(API_PATHS.COMMENTS.CREATE, {
    json: {
      articleId,
      content,
    },
  });

  return response.json();
};

export const createReplyOnComment = async (commentId: string, content: string) => {
  const response = await kyInstance.post(API_PATHS.COMMENTS.REPLY.replace(API_PATH_SEGMENTS.DYNAMIC_ID, commentId), {
    json: {
      content,
    },
  });

  return response.json();
};

export const toggleLikeComment = async (commentId: string) => {
  const response = await kyInstance.put(
    API_PATHS.COMMENTS.TOGGLE_LIKE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, commentId),
  );
  return response.json();
};
