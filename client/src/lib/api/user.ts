import { kyInstance } from '../kyInstance';
import { API_PATHS, API_PATH_SEGMENTS } from './api-paths';
import { ResApiWithData, ResUserInfo } from '@/types/common';

export const getUser = async (id: string) => {
  const response = await kyInstance.get<ResApiWithData<ResUserInfo>>(
    API_PATHS.USERS.PROFILE.replace(API_PATH_SEGMENTS.DYNAMIC_ID, id),
  );
  return response.json();
};
