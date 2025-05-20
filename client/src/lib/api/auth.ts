import { ResApiWithData } from '@/types/common';
import { ResUserInfo } from '@/types/common';
import { kyInstance } from '../kyInstance';
import { API_PATHS } from './api-paths';
import { EditMyProfileSchema } from '../validations/auth';

export const login = async (email: string, password: string) => {
  const response = await kyInstance.post(API_PATHS.AUTH.LOGIN, { json: { email, password } });
  return response.json();
};

export const logout = async () => {
  const response = await kyInstance.get(API_PATHS.AUTH.LOGOUT);
  return response.json();
};

export const getMe = async () => {
  const response = await kyInstance.get<ResApiWithData<ResUserInfo>>(API_PATHS.AUTH.ME);
  return response.json();
};

export const updateProfileDetails = async (data: EditMyProfileSchema) => {
  if (data.socialLinks) {
    data.socialLinks.github = data.socialLinks.github ? `https://github.com/${data.socialLinks.github}` : '';
    data.socialLinks.twitter = data.socialLinks.twitter ? `https://twitter.com/${data.socialLinks.twitter}` : '';
  }
  const response = await kyInstance.put<ResApiWithData<ResUserInfo>>(API_PATHS.AUTH.UPDATE_DETAILS, {
    json: data,
  });
  return response.json();
};

export const updateProfileImage = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await kyInstance.put<ResApiWithData<ResUserInfo>>(API_PATHS.AUTH.PROFILE_IMAGE, {
    body: formData,
  });
  return response.json();
};
