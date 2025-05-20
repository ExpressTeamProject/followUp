import { kyInstance } from '@/lib/kyInstance';
import { API_PATH_SEGMENTS, API_PATHS } from '@/lib/api/api-paths';
import type { CommunityFilterParams, ArticleForm } from '@/lib/validations/community';
import type { ResArticle, ResPopularTag } from '@/types/article';
import { ResApiWithData, ResApiWithPagination } from '@/types/common';
import { ALL_VALUE } from '@/config/constant';

export const getArticles = async (params: CommunityFilterParams) => {
  const searchParams: Record<string, string> = {
    page: params.page.toString(),
    limit: params.limit.toString(),
  };

  if (params.search) searchParams.search = params.search;
  if (params.category && params.category !== ALL_VALUE) searchParams.category = params.category;
  if (params.tags?.length) searchParams.tags = params.tags.join(',');

  const response = await kyInstance.get<ResApiWithPagination<ResArticle[], CommunityFilterParams>>(
    API_PATHS.ARTICLES.ROOT,
    {
      searchParams,
    },
  );

  return response.json();
};

export const getArticle = async (id: string) => {
  const response = await kyInstance.get<ResApiWithData<ResArticle>>(`${API_PATHS.ARTICLES.ROOT}/${id}`);

  return response.json();
};

export const createArticle = async (data: ArticleForm) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('category', data.category ?? '');
  formData.append('content', data.content);

  formData.append('tags', data.tags?.join(',') ?? '');

  if (data.files && data.files.length > 0) {
    data.files.forEach((file) => {
      formData.append(`files`, file);
    });
  }

  const response = await kyInstance.post(API_PATHS.ARTICLES.CREATE, {
    body: formData,
  });

  return response.json();
};

export const updateArticle = async (id: string, data: ArticleForm) => {
  const articleData = {
    title: data.title,
    category: data.category ?? '',
    content: data.content,
    tags: data.tags ?? [],
  };

  const response = await kyInstance.put(API_PATHS.ARTICLES.UPDATE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, id), {
    json: articleData,
  });

  if (data.files && data.files.length > 0) {
    await addArticleAttachment(id, data.files);
  }

  return response.json();
};

export const addArticleAttachment = async (articleId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await kyInstance.post(
    API_PATHS.ARTICLES.ADD_ATTACHMENTS.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId),
    {
      body: formData,
    },
  );

  return response.json();
};

export const removeArticleAttachment = async (articleId: string, filename: string) => {
  const response = await kyInstance.delete(
    API_PATHS.ARTICLES.REMOVE_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId).replace(
      API_PATH_SEGMENTS.DYNAMIC_FILENAME,
      filename,
    ),
  );

  return response.json();
};

export const deleteArticle = async (articleId: string) => {
  const response = await kyInstance.delete(API_PATHS.ARTICLES.DELETE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId));

  return response.json();
};

export const getArticlesByUser = async (userId: string, params?: CommunityFilterParams) => {
  const searchParams: Record<string, string> = {
    page: params?.page.toString() ?? '1',
    limit: params?.limit.toString() ?? '5',
  };

  if (params?.search) searchParams.search = params.search;
  if (params?.category && params.category !== ALL_VALUE) searchParams.category = params.category;
  if (params?.tags?.length) searchParams.tags = params.tags.join(',');

  const response = await kyInstance.get<ResApiWithPagination<ResArticle[], CommunityFilterParams>>(
    API_PATHS.ARTICLES.BY_USER.replace(API_PATH_SEGMENTS.DYNAMIC_ID, userId),
    {
      searchParams,
    },
  );

  return response.json();
};

export const getPopularTags = async () => {
  const response = await kyInstance.get<ResApiWithData<ResPopularTag[]>>(API_PATHS.ARTICLES.POPULAR_TAGS);

  return response.json();
};

export const downloadArticleAttachment = async (filename: string) => {
  const response = await kyInstance.get(
    `${API_PATHS.DOWNLOAD.ARTICLE_ATTACHMENT.replace(API_PATH_SEGMENTS.DYNAMIC_FILENAME, filename)}`,
  );

  return response.blob();
};

export const toggleArticleLike = async (articleId: string) => {
  const response = await kyInstance.put(
    API_PATHS.ARTICLES.TOGGLE_LIKE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, articleId),
  );

  return response.json();
};
