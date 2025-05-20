import { ResApi, ResApiWithData } from '@/types/common';
import { kyInstance } from '../kyInstance';
import { API_PATHS } from './api-paths';
import { ResArticle } from '@/types/article';
import { ResProblem } from '@/types/problem';

export const getSavedItems = async () => {
  const response = await kyInstance.get<
    ResApiWithData<{
      posts: ResProblem[];
      articles: ResArticle[];
    }>
  >(API_PATHS.SAVED_ITEMS.ROOT);
  return response.json();
};

export const toggleSavedItem = async (itemId: string, itemType: 'post' | 'article') => {
  const response = await kyInstance.post<ResApi & { isSaved: boolean; message: string }>(API_PATHS.SAVED_ITEMS.TOGGLE, {
    json: {
      itemId,
      itemType,
    },
  });

  return response.json();
};

export const checkSavedItem = async (itemId: string, itemType: 'post' | 'article') => {
  const searchParams = new URLSearchParams();
  searchParams.set('itemId', itemId);
  searchParams.set('itemType', itemType);

  const response = await kyInstance.get<ResApi & { isSaved: boolean }>(API_PATHS.SAVED_ITEMS.CHECK, {
    searchParams,
  });
  return response.json();
};
